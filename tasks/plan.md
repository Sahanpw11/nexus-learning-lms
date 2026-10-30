# Full TypeScript migration

## Goal and boundaries

Convert the React frontend and Python API to TypeScript while preserving the
current interface, documented endpoint paths, response field names, PostgreSQL
data, and existing demonstration workflows. This is a language migration, not
implementation of the missing LMS features.

The existing API has authentication, users, classes, and enrollment routes.
Assignments, submissions, materials, notes, sessions, and calendar events have
database models but no mounted routes. Their screens must retain current behavior.

## Target architecture

- React 18 + TypeScript, retaining React Router, Tailwind, and current components.
- Node.js + TypeScript + Express 5 for the API.
- PostgreSQL retained; parameterized queries through `pg` preserve existing table
  names and data without introducing an ORM-driven schema replacement.
- Shared TypeScript request/response contracts; runtime validation with Zod at API
  boundaries. Static types do not validate HTTP input.
- JWT, bcrypt-compatible password hashes, Firebase Storage retained.
- Strict TypeScript compilation. No `@ts-nocheck`, blanket `any`, or disabled type
  checking to make converted files pass.
- Existing JavaScript may coexist temporarily during incremental conversion;
  `allowJs` is removed at the final frontend gate.

## 1. Baseline and tooling

Inventory active routes, models, API requests, configuration, and alternate page
versions. Capture representative response fixtures and build behavior. Create the
migration branch and install compatible TypeScript tooling.

Acceptance: baseline limitations recorded; old backend remains runnable; new API
types match existing schemas; frontend builds with the typed client.

## 2. Frontend foundation

Introduce API contracts and a typed Axios client first. Then convert authentication
context, route guards, error boundary, toast provider, navigation, loading states,
and application entry points. Model demo account IDs separately from numeric API
IDs. Preserve demo login during migration and make that limitation explicit.

Acceptance: converted files pass strict compilation; API request paths and browser
storage keys stay compatible; sign-in, sign-out, navigation, and errors behave as
before. No implicit `any` in converted application code.

## 3. Frontend feature slices

Convert related pages together, with explicit types for props, state, forms,
events, refs, and mock data:

1. Dashboard, users, students, and student profiles.
2. Classes, class details, and analytics.
3. Assignments and submission/grade views.
4. Calendar, event creation, live sessions, scheduling, and recordings.
5. Notes, editor, settings, and notifications.

Alternate `_new`, `_backup`, `_temp`, and similar files require an import/reference
check. Either convert retained variants or archive them explicitly as historical
references outside compiled application source; do not silently delete them.

Acceptance per slice: strict compilation and production build pass; the relevant
screens retain their behavior. Final frontend gate: no application `.js` files,
`allowJs: false`, no excluded active screens.

## 4. Backend compatibility foundation

Create typed environment parsing, database connections, parameterized query
helpers, error handling, CORS, and health endpoints. Match existing PostgreSQL
columns, SQLAlchemy enum labels (uppercase database labels versus lowercase API
roles), timestamps, null fields, and serial IDs.

Test against a disposable PostgreSQL database before any existing database.
Verify all nine tables, not just tables with API routes. Never drop or recreate
existing tables to complete this migration. Database startup failures must stop
startup rather than report a healthy API.

Acceptance: clean-database initialization works; an existing-schema fixture works;
environment parsing fails clearly on missing production secrets.

## 5. Backend vertical slices

1. Authentication: registration, login, `/auth/me`, admin creation, bearer token
   parsing, expiration, deactivated users, and existing bcrypt hashes.
2. Users: listing, reading, updating, deactivation, teacher/student lists.
3. Classes: CRUD, visibility, ownership checks, enrollment, enrolled students.
4. Firebase helpers and database seed command.

Preserve endpoint shapes and status codes. Fix confirmed authorization defects
with explicit tests and document intentional changes: public administrator
registration, self-service role escalation, and enrollment in another teacher's
class must not carry forward into the replacement API.

Acceptance: focused API tests cover success, invalid input, missing/expired auth,
role restrictions, ownership, duplicates, and nonexistent IDs. Existing Python
JWTs and password hashes are covered by compatibility fixtures where possible.

## 6. Integration and deployment

Replace Python commands in Railway configuration, Procfile, seed instructions,
environment examples, README, deployment guide, quick guide, and checklist.
Provide root commands for development, build, type checking, and tests. Retain
frontend URL configuration and Vercel SPA routing. Document the Express equivalent
of FastAPI's `/docs` rather than silently removing the documented API explorer.

Acceptance: fresh install, frontend/backend build, API tests, production startup,
and a browser walkthrough pass. Verify against disposable infrastructure; a live
deployment and production database changes are separate actions.

## 7. Final removal and review

Remove Python runtime files and dependencies only after the TypeScript API passes
its compatibility checks. Convert Tailwind/PostCSS configuration where supported,
or use the tooling's documented JavaScript bootstrap when required; distinguish
build configuration from application source. Search all docs/configuration for
stale Python commands and file references. Review the final diff for accidental
behavior changes, credentials, suppressions, and dropped features.

Acceptance: the frontend and API application source is TypeScript, the deployed
API uses Node, data migration is unnecessary or explicitly tested, all required
checks pass, and remaining product limitations are documented accurately.

## Discovered baseline limitations

- No project test files were found in the initial inventory.
- Frontend authentication currently creates a demo teacher and uses `mock_token`.
- Many screens use hardcoded data and simulated saves.
- The initial exploratory strict conversion produced 1,176 diagnostics. Bulk
  renames were rolled back to migrate typed, buildable slices instead.
- Existing public registration/profile updates accept role changes; class
  enrollment lacks teacher ownership validation.
- Firebase has a placeholder bucket; no working storage integration was verified.
- Runtime/database/browser baseline checks have not yet been completed.
- Dependency installation reports 74 frontend dependency advisories. No automatic
  dependency upgrades were applied; assess these separately from language parity.

## Documentation references

- TypeScript configuration: https://www.typescriptlang.org/tsconfig/
- React TypeScript: https://react.dev/learn/typescript
- Express async error behavior: https://expressjs.com/en/5x/guide/error-handling/
