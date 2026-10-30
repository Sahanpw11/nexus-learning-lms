# TypeScript migration progress

- [x] Inspect application routes, backend models, authentication, and API client.
- [x] Create branch `codex/full-typescript`.
- [x] Write implementation plan and acceptance gates.
- [x] Add shared request/response contracts and convert Axios client to TypeScript.
- [x] Convert authentication context and route guard with explicit session types.
- [x] Verify first frontend increment: type check and production build.
- [x] Capture runtime and API compatibility fixtures (Python-created DB, passlib hashes, python-jose JWT).
- [x] Convert remaining shared components and application entry points.
- [x] Convert frontend page slices; remove temporary JavaScript support (`allowJs: false`).
- [x] Implement typed API/database foundation against disposable PostgreSQL.
- [x] Port authentication and compatibility tests.
- [x] Port user routes and authorization tests.
- [x] Port class/enrollment routes and authorization tests.
- [x] Port seed command. Storage helper dropped (see below).
- [x] Update setup, deployment, API documentation, and environment examples.
- [x] Verify full integration and browser workflows (Playwright).
- [x] Remove replaced Python implementation and review final diff.

## Verification (2026-10-30)

- `npm run typecheck` (backend + frontend, strict, no `any` suppressions): pass.
- `npm test`: 22/22, including 3 tests against a database created by the old
  `setup_db.py` (passlib hashes log in, a python-jose token is accepted, uppercase enum works).
- Fresh TypeScript-created schema diffed against the SQLAlchemy-created schema: identical.
- `npm run build`: pass, 13 pre-existing `no-unused-vars` lint warnings.
- `npm run test:e2e`: 76/76 — all 23 routes x 3 roles render without page errors,
  sidebar navigation, browser registration against the real API, API error display, CORS.
- Production start fails fast on missing `SECRET_KEY` and on an unreachable database.

## Intentional behavior changes

- `POST /auth/register` rejects `role: "admin"` (403); admins come from `/auth/create-admin` or the seed.
- `PUT /users/:id`: non-admins cannot change `role` or `is_active` (403).
- `POST /classes/:id/enroll`: teachers can only enroll into their own classes (403);
  body needs only `student_id` (the Python schema also demanded `class_id`, which the frontend never sent).
- 500 responses no longer echo the internal exception text.
- `/docs` is a JSON endpoint index instead of Swagger UI.
- `firebase_utils.py` was not ported: nothing imported it and its bucket name was a placeholder.
- Fixed NoteEditor "Insert Table", which inserted the text `false` instead of a table.

## Known limitations (unchanged from before)

- Frontend login is still the demo mock in `AuthContext.tsx`; pages use mock data,
  not the API. Registration is the only screen calling the backend.
- Old variant pages are kept in `frontend/archive/pages/` (not compiled).

## Hosting move: Vercel + Neon + R2 (2026-10-30)

- API runs as one Vercel function (`backend/api/index.ts`, rewrites in `backend/vercel.json`).
  Build = `npm run build && npm run migrate` (schema created at deploy, not per cold start).
- Pool size 3 per function when `VERCEL` is set; use Neon's pooled URL.
- New `POST /files/upload-url` and `/files/download-url`: signed R2 URLs, owner-scoped keys,
  50 MB / type allow-list. Frontend pages don't use them yet (they are still mock data).
- Railway/Procfile config removed; docs rewritten for Vercel + Neon + R2.
- Backend pinned to TypeScript 5.9 (TS 7 has no JS compiler API, which Vercel's builder needs)
  and Node 22.x.
- Verified: `vercel build` locally succeeds and the built function serves /health, register,
  login and auth checks; API tests 23/23 (+3 legacy skipped); Playwright 76/76.
- Not verified: an actual deploy to Vercel, a real Neon database, real R2 uploads.
