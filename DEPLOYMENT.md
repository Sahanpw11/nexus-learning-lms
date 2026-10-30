# Deployment Guide: Vercel + Neon + Cloudflare R2

The whole app runs as a single Vercel project:

| Piece | Where | What it is |
|---|---|---|
| Frontend | Vercel | React build served as a single-page app |
| API | Vercel, same project, under `/api` | Express app running as one serverless function (`api/index.ts`) |
| Database | Neon | PostgreSQL |
| Files | Cloudflare R2 | Uploaded files; the browser uploads/downloads directly with signed URLs |

## Prerequisites

- GitHub repository containing this project
- Vercel, Neon and Cloudflare accounts (all have free tiers)
- Node.js 22 locally (to run the database seed)

---

## 1. Neon (database)

1. Create a project at https://console.neon.tech (or Vercel dashboard → Storage → Neon, which also links the env vars).
2. Copy the **pooled** connection string: in *Connection Details* turn on *Connection pooling*. The host contains `-pooler`:
   ```
   postgresql://USER:PASSWORD@ep-xxxx-pooler.REGION.aws.neon.tech/neondb?sslmode=require
   ```
   Serverless functions open many short-lived connections; the pooled URL is what keeps them from exhausting Neon's limit.

### Moving existing data (optional)

If you already have data in another Postgres (e.g. the old Railway database), copy it over. The schema is unchanged, so a straight dump/restore works:

```bash
pg_dump --no-owner --no-acl "OLD_DATABASE_URL" > lms.sql
psql "NEON_DIRECT_URL" < lms.sql      # use Neon's direct (non-pooler) URL for the restore
```

## 2. Cloudflare R2 (files)

1. Cloudflare dashboard → R2 → *Create bucket* (e.g. `nexus-learning-files`). Keep it private.
2. R2 → *Manage API tokens* → *Create API token* with **Object Read & Write** on that bucket. Note the *Access Key ID*, *Secret Access Key* and your *Account ID*.
3. Bucket → *Settings* → *CORS policy*, so browsers can upload with the signed URLs:
   ```json
   [
     {
       "AllowedOrigins": ["https://your-app.vercel.app", "http://localhost:3000"],
       "AllowedMethods": ["GET", "PUT"],
       "AllowedHeaders": ["Content-Type"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```

How uploads work: the frontend calls `POST /files/upload-url` with `{ filename, content_type, size }`, then `PUT`s the file to the returned `upload_url` with the returned `Content-Type` header. Store the returned `key`; `POST /files/download-url` with `{ key }` returns a 5-minute download link. Keys are scoped per user (`users/<id>/…`), only the owner or an admin can get a download link, and uploads are limited to 50 MB and document/image/MP4 types.

## 3. Vercel (frontend + API, one project)

1. Vercel → *Add New Project* → import the repo. Keep the **Root Directory as the repository root**.
2. Build settings come from the root `vercel.json` (install both apps, build the API, create missing tables, build the React app). Don't override them in the dashboard.
3. Environment variables (Production and Preview):

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | Neon pooled connection string |
   | `SECRET_KEY` | long random string (reuse the old one if migrating, so existing logins stay valid) |
   | `NODE_ENV` | `production` |
   | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` | from step 2 |

   No `REACT_APP_API_URL` or `CORS_ORIGINS` needed: the app calls the API at `/api` on its own domain.
4. Deploy. The build runs `npm run migrate`, which creates any missing tables in Neon (existing tables and data are left alone). If the database is unreachable the build fails instead of deploying a broken API.
5. Check `https://your-app.vercel.app/api/health` returns `{"status":"healthy",...}`, then add the app URL to the R2 CORS policy.

How it's wired: `api/index.ts` is the serverless function; `vercel.json` rewrites `/api/*` to it and every other path to `index.html`. The API strips the `/api` prefix itself, so the same Express routes work locally without it.

## 5. Demo accounts (optional)

The seed script creates tables plus three demo users with **well-known passwords** — only do this for a demo deployment:

```bash
cd backend
npm install
DATABASE_URL="NEON_POOLED_URL" npm run seed:dev
```

Creates `admin@reactorminds.com / admin123`, `teacher@example.com / teacher123`, `student@example.com / student123`. There is no change-password endpoint yet, so for a real deployment create users through registration and `/auth/create-admin` instead.

---

## Troubleshooting

- **Build fails at `npm run migrate`:** `DATABASE_URL` is missing or wrong for that environment (Preview deployments need it too).
- **Function crashes with "Missing required environment variable SECRET_KEY":** set `SECRET_KEY`; production refuses to fall back to a dev secret.
- **API calls return the React page instead of JSON:** the request path must start with `/api`; check `REACT_APP_API_URL` is not set to something else.
- **`/files/*` returns 503:** one of the four `R2_*` variables is missing.
- **Upload `PUT` fails with 403 from R2:** the bucket CORS policy is missing the frontend origin, or the upload's `Content-Type`/size differs from what was requested — both are part of the signature.
- **"too many connections":** `DATABASE_URL` is Neon's direct URL; switch to the `-pooler` one.

## Limits of running the API serverless

- First request after idle time is slower (cold start).
- No WebSockets or background jobs inside the API; real-time live sessions would need a separate service.
- Request bodies are capped around 4.5 MB, which is why files go directly to R2.

## Local development

```bash
npm run install:all
cp backend/.env.example backend/.env   # point DATABASE_URL at a local Postgres or a Neon branch
npm run seed
npm run dev:backend    # http://localhost:8000
npm run dev:frontend   # http://localhost:3000 (proxies /api to the backend)
```

## Resources

- [Express on Vercel](https://vercel.com/docs/frameworks/backend/express)
- [Neon connection pooling](https://neon.tech/docs/connect/connection-pooling)
- [R2 presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)
- [R2 CORS](https://developers.cloudflare.com/r2/buckets/cors/)
