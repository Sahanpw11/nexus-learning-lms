import { defineConfig, devices } from '@playwright/test';

// E2E_REUSE_SERVERS=1 runs against already-running dev servers (their database, not E2E_DATABASE_URL).
// Needs a disposable Postgres; E2E_DATABASE_URL must name a database the API may create tables in.
const databaseUrl = process.env.E2E_DATABASE_URL ?? 'postgresql://postgres:test@localhost:55432/lms_e2e';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm --prefix ../backend run dev',
      url: 'http://localhost:8000/health',
      env: { DATABASE_URL: databaseUrl, SECRET_KEY: 'e2e-secret', PORT: '8000' },
      reuseExistingServer: Boolean(process.env.E2E_REUSE_SERVERS),
      timeout: 60_000,
    },
    {
      command: 'npm --prefix ../frontend start',
      url: 'http://localhost:3000',
      // No REACT_APP_API_URL: the app calls same-origin /api, proxied to the backend like on Vercel.
      env: { BROWSER: 'none', PORT: '3000', REACT_APP_GOOGLE_CLIENT_ID: 'e2e-client-id' },
      reuseExistingServer: Boolean(process.env.E2E_REUSE_SERVERS),
      timeout: 180_000,
    },
  ],
});
