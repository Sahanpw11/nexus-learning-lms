import { expect, test, type Page } from '@playwright/test';

// A real Google account can't sign in from a test, so this stands in for Google's script and the
// three API calls it leads to. The backend side of the flow is covered in backend/test/api.test.ts.
async function fakeGoogle(page: Page, apiResponse: object) {
  await page.addInitScript(() => {
    let callback: (r: { credential: string }) => void = () => undefined;
    (window as unknown as { google: object }).google = {
      accounts: {
        id: {
          initialize: (o: { callback: typeof callback }) => {
            callback = o.callback;
          },
          renderButton: (parent: HTMLElement) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = 'Continue with Google';
            button.onclick = () => callback({ credential: 'fake-google-credential' });
            parent.appendChild(button);
          },
          disableAutoSelect: () => undefined,
        },
      },
    };
  });
  await page.route('**/api/auth/google', (route) => route.fulfill({ json: apiResponse }));
  // The fake access token isn't valid on the real API; stub the sidebar's unread poll too.
  await page.route('**/api/chat/unread', (route) => route.fulfill({ json: { total: 0 } }));
}

const me = { id: 41, email: 'newcomer@gmail.com', full_name: 'Nadia Perera', role: 'teacher', is_active: true, created_at: '2026-10-30T00:00:00Z', updated_at: null };

test('first Google sign-in goes through onboarding and creates the chosen role', async ({ page }) => {
  await fakeGoogle(page, { status: 'onboarding', onboarding_token: 'onb-token', email: 'newcomer@gmail.com', full_name: 'Nadia P' });
  let completeBody: unknown;
  await page.route('**/api/auth/google/complete', async (route) => {
    completeBody = route.request().postDataJSON();
    await route.fulfill({ json: { access_token: 'real-token', token_type: 'bearer' } });
  });
  await page.route('**/api/auth/me', (route) => route.fulfill({ json: me }));

  await page.goto('/login');
  await page.getByRole('button', { name: 'Continue with Google' }).click();
  await expect(page).toHaveURL(/\/onboarding$/);
  await expect(page.getByText('newcomer@gmail.com')).toBeVisible();

  // A role must be chosen before continuing.
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('alert')).toHaveText('Choose whether you are a student or a teacher');

  await page.getByLabel('FULL NAME').fill('Nadia Perera');
  await page.getByText('Teacher', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  expect(completeBody).toEqual({ onboarding_token: 'onb-token', full_name: 'Nadia Perera', role: 'teacher' });
  const session = await page.evaluate(() => JSON.parse(localStorage.getItem('user') ?? 'null'));
  expect(session).toMatchObject({ apiId: 41, role: 'teacher', email: 'newcomer@gmail.com' });
});

test('a returning Google user goes straight to the dashboard', async ({ page }) => {
  await fakeGoogle(page, { status: 'signed_in', access_token: 'real-token', token_type: 'bearer' });
  await page.route('**/api/auth/me', (route) => route.fulfill({ json: { ...me, role: 'student' } }));
  await page.goto('/login');
  await page.getByRole('button', { name: 'Continue with Google' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
});

test('opening /onboarding without a Google sign-in returns to login', async ({ page }) => {
  await page.goto('/onboarding');
  await expect(page).toHaveURL(/\/login$/);
});
