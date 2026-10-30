import { expect, test, type Page } from '@playwright/test';

type Role = 'admin' | 'teacher' | 'student';

// The frontend still signs in with demo users (see AuthContext), so seed that session directly.
const demoUsers: Record<Role, object> = {
  admin: { id: 'admin_1', apiId: 1, name: 'Admin User', full_name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  teacher: { id: 'teacher_1', apiId: 2, name: 'Dr. John Smith', full_name: 'Dr. John Smith', email: 'teacher@example.com', role: 'teacher' },
  student: { id: 'student_1', apiId: 3, name: 'Alex Johnson', full_name: 'Alex Johnson', email: 'student@example.com', role: 'student' },
};

const routes = [
  '/dashboard',
  '/classes',
  '/class/1',
  '/assignments',
  '/assignment/1',
  '/calendar',
  '/event-creator',
  '/live-sessions',
  '/schedule-session',
  '/session/1',
  '/session/2',
  '/recording/1',
  '/notes',
  '/note/new',
  '/note/1',
  '/students',
  '/add-student',
  '/student/1',
  '/users',
  '/analytics',
  '/analytics/class/1',
  '/settings',
  '/notifications',
];

async function signInAs(page: Page, role: Role) {
  // Demo sessions have no real token; answer the sidebar's unread poll instead of the API.
  await page.route('**/api/chat/unread', (route) => route.fulfill({ json: { total: 0 } }));

  await page.addInitScript((user) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', 'e2e-session-token');
  }, demoUsers[role]);
}

for (const role of ['admin', 'teacher', 'student'] as const) {
  test.describe(`${role} pages`, () => {
    for (const route of routes) {
      test(`${route} renders without errors`, async ({ page }) => {
        const pageErrors: string[] = [];
        page.on('pageerror', (error) => pageErrors.push(error.message));
        await signInAs(page, role);

        await page.goto(route);
        await page.waitForLoadState('networkidle');
        // Some detail pages simulate a fetch delay before rendering.
        await page.waitForTimeout(1200);

        await expect(page.getByText('Something went wrong')).toHaveCount(0);
        await expect(page.locator('body')).not.toBeEmpty();
        expect(pageErrors).toEqual([]);
      });
    }
  });
}

test('sidebar navigation reaches each section', async ({ page }) => {
  await signInAs(page, 'teacher');
  await page.goto('/dashboard');
  for (const href of ['/classes', '/assignments', '/calendar', '/live-sessions', '/notes', '/students', '/analytics', '/settings']) {
    await page.locator(`nav a[href="${href}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
  }
});

test('class detail opens from the classes list', async ({ page }) => {
  await signInAs(page, 'teacher');
  await page.goto('/classes');
  await page.getByRole('button', { name: /enter class|manage class/i }).first().click();
  await expect(page).toHaveURL(/\/class\/\d+$/);
  await expect(page.getByText('Something went wrong')).toHaveCount(0);
});

test('note editor table button inserts a table', async ({ page }) => {
  await signInAs(page, 'teacher');
  await page.goto('/note/new');
  const editor = page.locator('[contenteditable="true"]').first();
  await editor.click();
  await page.getByTitle('Insert Table').click();
  await expect(editor.locator('table')).toHaveCount(1);
  await expect(editor).not.toContainText('false');
});

test('email login checks the real account', async ({ page, request }) => {
  const email = `login-${Date.now()}@example.com`;
  const created = await request.post('http://localhost:8000/auth/register', {
    data: { email, full_name: 'Login Tester', password: 'right-pass', role: 'student' },
  });
  expect(created.status()).toBe(200);

  await page.goto('/login');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill('wrong-pass');
  await page.locator('button[type="submit"]').click();
  await expect(page.getByText('Incorrect email or password')).toBeVisible();

  await page.locator('input[name="password"]').fill('right-pass');
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/\/dashboard$/);
  // The dashboard greets the signed-in account by first name.
  await expect(page.getByText('Login', { exact: true })).toBeVisible();
});

test('a visitor with no session is sent to the login page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
  await page.goto('/classes');
  await expect(page).toHaveURL(/\/login$/);
});
