# 🚀 Quick Deploy — Vercel + Neon + R2

Full details and troubleshooting: `DEPLOYMENT.md`.

### 1. Neon (2 min)
Create a project at https://console.neon.tech and copy the **pooled** connection string (host contains `-pooler`).

### 2. Cloudflare R2 (3 min)
Create a private bucket, an API token with Object Read & Write on it, and add a CORS policy allowing `GET`/`PUT` from your frontend URL (example in `DEPLOYMENT.md`).

### 3. Vercel (3 min)
New Project → this repo, **root directory = repository root** (settings come from `vercel.json`). Environment variables:
- `DATABASE_URL` = Neon pooled URL
- `SECRET_KEY` = long random string
- `NODE_ENV` = `production`
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`

Deploy — the build also creates the database tables. Check `https://your-app.vercel.app/api/health`.

### 4. Demo users (optional, demo only)
```bash
cd backend && npm install
DATABASE_URL="NEON_POOLED_URL" npm run seed:dev
```
- Admin: `admin@reactorminds.com` / `admin123`
- Teacher: `teacher@example.com` / `teacher123`
- Student: `student@example.com` / `student123`

## 💰 Cost
Vercel Hobby, Neon Free and R2's free tier (10 GB storage, no egress fees) cover development and small deployments.
