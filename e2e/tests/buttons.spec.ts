import { expect, test, type Page } from '@playwright/test';

// These tests only navigate and read; they never write to the database.
async function signInAsTeacher(page: Page) {
  // Demo sessions have no real token; answer the sidebar's unread poll instead of the API.
  await page.route('**/api/chat/unread', (route) => route.fulfill({ json: { total: 0 } }));

  await page.addInitScript(() => {
    localStorage.setItem('user', JSON.stringify({ id: 'teacher_1', apiId: 2, name: 'Dr. John Smith', full_name: 'Dr. John Smith', email: 'teacher@example.com', role: 'teacher' }));
    localStorage.setItem('token', 'e2e-session-token');
  });
}

test.beforeEach(async ({ page }) => {
  await signInAsTeacher(page);
});

test('class roster: Add Student and View Details navigate', async ({ page }) => {
  await page.goto('/class/1');
  await page.getByRole('button', { name: 'Students' }).click();
  await page.getByRole('button', { name: 'Add Student' }).click();
  await expect(page).toHaveURL(/\/add-student$/);

  await page.goto('/class/1');
  await page.getByRole('button', { name: 'Students' }).click();
  await page.getByRole('button', { name: 'View Details' }).first().click();
  await expect(page).toHaveURL(/\/student\/\d+$/);
});

test('class Create Assignment opens the assignment form', async ({ page }) => {
  await page.goto('/class/1');
  await page.getByRole('button', { name: 'Assignments' }).click();
  await page.getByRole('button', { name: 'Create Assignment' }).click();
  await expect(page).toHaveURL(/\/assignments$/);
  await expect(page.getByRole('heading', { name: 'Create New Assignment' })).toBeVisible();
});

test('buttons without a backend explain themselves instead of doing nothing', async ({ page }) => {
  await page.goto('/analytics');
  await page.getByRole('button', { name: 'Export Report' }).click();
  await expect(page.getByText("Exporting reports isn't available yet.")).toBeVisible();
});

test('session Add to Calendar opens the event creator', async ({ page }) => {
  await page.goto('/session/1');
  await page.getByRole('button', { name: 'Add to Calendar' }).click();
  await expect(page).toHaveURL(/\/event-creator$/);
});

test('footer starts to the right of the sidebar', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.goto('/classes');
  const sidebar = await page.locator('div.fixed.left-0').first().boundingBox();
  const footer = await page.locator('footer').boundingBox();
  expect(footer!.x).toBeGreaterThanOrEqual(sidebar!.x + sidebar!.width);
});
