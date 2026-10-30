import { expect, test } from '@playwright/test';

const API = 'http://localhost:8000';

test('registration in the browser creates a user in the TypeScript API', async ({ page, request }) => {
  const email = `e2e-${Date.now()}@example.com`;
  await page.goto('/register');
  await page.locator('input[name="full_name"]').fill('E2E Student');
  await page.locator('input[name="email"]').fill(email);
  await page.getByText('Student', { exact: true }).click();
  await page.locator('input[name="password"]').fill('secret-pass');
  await page.locator('input[name="confirmPassword"]').fill('secret-pass');
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/\/login$/);

  // The account exists and the password the browser sent works against the API.
  const login = await request.post(`${API}/auth/login`, { data: { email, password: 'secret-pass' } });
  expect(login.status()).toBe(200);
  const { access_token } = await login.json();
  const me = await request.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${access_token}` } });
  expect(await me.json()).toMatchObject({ email, full_name: 'E2E Student', role: 'student', is_active: true });
});

test('duplicate registration shows the API error message', async ({ page, request }) => {
  const email = `dup-${Date.now()}@example.com`;
  const first = await request.post(`${API}/auth/register`, {
    data: { email, full_name: 'First', password: 'secret-pass', role: 'teacher' },
  });
  expect(first.status()).toBe(200);

  await page.goto('/register');
  await page.locator('input[name="full_name"]').fill('Second');
  await page.locator('input[name="email"]').fill(email);
  await page.getByText('Teacher', { exact: true }).click();
  await page.locator('input[name="password"]').fill('secret-pass');
  await page.locator('input[name="confirmPassword"]').fill('secret-pass');
  await page.locator('button[type="submit"]').click();
  await expect(page.getByText('Email already registered')).toBeVisible();
});

test('API is served same-origin under /api', async ({ page }) => {
  await page.goto('/login');
  const result = await page.evaluate(async () => {
    const response = await fetch('/api/health');
    return { status: response.status, body: await response.json() };
  });
  expect(result).toEqual({ status: 200, body: { status: 'healthy', service: 'Nexus Learning' } });
});
