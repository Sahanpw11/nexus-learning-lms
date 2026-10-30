import { expect, test, type APIRequestContext, type Browser, type Page } from '@playwright/test';

// Real accounts, two browsers side by side. File attachments need R2 and are covered by backend tests.
const API = 'http://localhost:8000';
const run = Date.now();
const people = {
  teacher: { email: `chat-teacher-${run}@example.com`, full_name: 'Tara Teacher', role: 'teacher' },
  amal: { email: `chat-amal-${run}@example.com`, full_name: 'Amal Student', role: 'student' },
  binu: { email: `chat-binu-${run}@example.com`, full_name: 'Binu Student', role: 'student' },
};
const PASSWORD = 'chat-pass-123';
const className = `E2E Algebra ${run}`;

async function apiToken(request: APIRequestContext, email: string) {
  const res = await request.post(`${API}/auth/login`, { data: { email, password: PASSWORD } });
  return (await res.json()).access_token as string;
}

async function signIn(browser: Browser, email: string): Promise<Page> {
  const page = await (await browser.newContext()).newPage();
  page.on('dialog', (dialog) => dialog.accept());
  await page.goto('/login');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.goto('/chat');
  return page;
}

const conversationList = (page: Page) => page.getByRole('list', { name: 'Conversations' });

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ request }) => {
  const ids: Record<string, number> = {};
  for (const [key, p] of Object.entries(people)) {
    const res = await request.post(`${API}/auth/register`, { data: { ...p, password: PASSWORD } });
    expect(res.status()).toBe(200);
    ids[key] = (await res.json()).id;
  }
  const headers = { Authorization: `Bearer ${await apiToken(request, people.teacher.email)}` };
  const cls = await (await request.post(`${API}/classes/`, { headers, data: { name: className, subject: 'Math' } })).json();
  for (const student of [ids.amal, ids.binu]) {
    expect((await request.post(`${API}/classes/${cls.id}/enroll`, { headers, data: { student_id: student } })).status()).toBe(200);
  }
});

test('students chat directly, see unread counts, replies, reactions and read ticks', async ({ browser }) => {
  test.setTimeout(90_000);
  const amal = await signIn(browser, people.amal.email);
  await expect(conversationList(amal).getByText(className)).toBeVisible(); // class chat created from enrollment

  await amal.getByRole('button', { name: 'New conversation' }).click();
  await amal.getByRole('menuitem', { name: 'New chat' }).click();
  await amal.getByRole('dialog').getByText('Binu Student').click();
  await amal.getByRole('button', { name: 'Start chat' }).click();
  await amal.getByRole('textbox', { name: 'Message', exact: true }).fill('Hi Binu, did you finish problem 3?');
  await amal.getByRole('textbox', { name: 'Message', exact: true }).press('Enter');
  await expect(amal.getByTestId('message').filter({ hasText: 'problem 3' }).first()).toBeVisible();

  const binu = await signIn(browser, people.binu.email);
  const dm = conversationList(binu).getByRole('button', { name: /Amal Student/ });
  await expect(dm.getByLabel('1 unread')).toBeVisible({ timeout: 10_000 });
  await dm.click();
  const incoming = binu.getByTestId('message').filter({ hasText: 'problem 3' }).first();
  await expect(incoming).toBeVisible();

  await incoming.hover();
  await incoming.getByRole('button', { name: 'Reply' }).click();
  await binu.getByRole('textbox', { name: 'Message', exact: true }).fill('Yes! The answer is 42');
  await binu.getByRole('button', { name: 'Send message' }).click();
  await incoming.hover();
  await incoming.getByRole('button', { name: 'React' }).click();
  await binu.getByRole('button', { name: 'React 👍' }).click();
  await expect(incoming.getByRole('button', { name: /👍 1, you reacted/ })).toBeVisible();

  // Amal's open chat picks up the reply, the quoted message, the reaction and the read tick by polling.
  const reply = amal.getByTestId('message').filter({ hasText: 'The answer is 42' });
  await expect(reply).toBeVisible({ timeout: 10_000 });
  await expect(reply.getByText('Amal Student')).toBeVisible(); // quotes Amal's own message
  await expect(amal.getByTestId('message').filter({ hasText: 'problem 3' }).first().getByRole('button', { name: '👍 1' })).toBeVisible({ timeout: 10_000 });
  await expect(amal.getByTestId('message').filter({ hasText: 'problem 3' }).first().getByLabel('Read')).toBeVisible({ timeout: 10_000 });

  // Delete for everyone.
  const own = amal.getByTestId('message').filter({ hasText: 'problem 3' }).first();
  await own.hover();
  await own.getByRole('button', { name: 'Delete message' }).click();
  await expect(binu.getByText('This message was deleted').first()).toBeVisible({ timeout: 10_000 });
  await Promise.all([amal.context().close(), binu.context().close()]); // stop their polling
});

test('groups and communities', async ({ browser }) => {
  test.setTimeout(90_000);
  const amal = await signIn(browser, people.amal.email);
  await amal.getByRole('button', { name: 'New conversation' }).click();
  await expect(amal.getByRole('menuitem', { name: 'New community' })).toHaveCount(0); // students can't
  await amal.getByRole('menuitem', { name: 'New group' }).click();
  await amal.getByLabel('Group name').fill('Study buddies');
  await amal.getByRole('dialog').getByText('Binu Student').click();
  await amal.getByRole('dialog').getByText('Tara Teacher').click();
  await amal.getByRole('button', { name: 'Create' }).click();
  await amal.getByRole('textbox', { name: 'Message', exact: true }).fill('Welcome to the group');
  await amal.getByRole('textbox', { name: 'Message', exact: true }).press('Enter');

  const binu = await signIn(browser, people.binu.email);
  await conversationList(binu).getByRole('button', { name: /Study buddies/ }).click();
  await expect(binu.getByText('Welcome to the group')).toBeVisible();
  await binu.getByRole('button', { name: 'Conversation details' }).click();
  await expect(binu.getByRole('heading', { name: '3 members' })).toBeVisible();
  await expect(binu.getByRole('button', { name: 'Make admin' })).toHaveCount(0); // not an admin

  const teacher = await signIn(browser, people.teacher.email);
  await teacher.getByRole('button', { name: 'New conversation' }).click();
  await teacher.getByRole('menuitem', { name: 'New community' }).click();
  await teacher.getByLabel('Community name').fill(`Math Dept ${run}`);
  await teacher.getByRole('button', { name: 'Create' }).click();
  await teacher.getByRole('button', { name: 'Add a group' }).click();
  await teacher.getByRole('dialog').getByRole('listitem').filter({ hasText: className }).getByRole('button', { name: 'Add' }).click();
  await teacher.getByRole('button', { name: 'Announcements' }).click();
  await teacher.getByRole('textbox', { name: 'Message', exact: true }).fill('Exam on Friday');
  await teacher.getByRole('textbox', { name: 'Message', exact: true }).press('Enter');

  await amal.getByRole('tab', { name: 'communities' }).click();
  await amal.reload(); // pick up the new community
  await amal.getByRole('tab', { name: 'communities' }).click();
  await expect(amal.getByText(`Math Dept ${run}`)).toBeVisible();
  await amal.getByRole('button', { name: 'Announcements' }).click();
  await expect(amal.getByText('Exam on Friday')).toBeVisible();
  await expect(amal.getByText('Only community admins can post announcements.')).toBeVisible();
  await Promise.all([amal.context().close(), binu.context().close(), teacher.context().close()]);
});

test('sent, delivered and read ticks, typing, online status, message info and the sidebar badge', async ({ browser }) => {
  test.setTimeout(90_000);
  const amal = await signIn(browser, people.amal.email);
  await conversationList(amal).getByRole('button', { name: /Binu Student/ }).click();
  await amal.getByRole('textbox', { name: 'Message', exact: true }).fill('Are you there?');
  await amal.getByRole('textbox', { name: 'Message', exact: true }).press('Enter');
  const mine = amal.getByTestId('message').filter({ hasText: 'Are you there?' });
  await expect(mine.getByLabel('Sent')).toBeVisible(); // Binu has no app open

  // Binu opens the app (any page): the sidebar badge appears and Amal's tick turns to delivered.
  const binu = await signIn(browser, people.binu.email);
  await expect(binu.getByLabel(/unread messages/)).toBeVisible({ timeout: 20_000 });
  await expect(mine.getByLabel('Delivered')).toBeVisible({ timeout: 20_000 });

  // Binu types without sending: Amal sees "typing…" and that Binu is online.
  await conversationList(binu).getByRole('button', { name: /Amal Student/ }).click();
  await binu.getByRole('textbox', { name: 'Message', exact: true }).pressSequentially('Yes, one sec', { delay: 30 });
  await expect(amal.locator('header').getByText('typing…')).toBeVisible({ timeout: 10_000 });
  await expect(conversationList(amal).getByText('typing…')).toBeVisible({ timeout: 10_000 });
  await binu.getByRole('textbox', { name: 'Message', exact: true }).fill('');
  await expect(amal.locator('header').getByText('online')).toBeVisible({ timeout: 10_000 });

  // Binu opened the chat, so the message is read; Message info shows when.
  await expect(mine.getByLabel('Read')).toBeVisible({ timeout: 10_000 });
  await mine.hover();
  await mine.getByRole('button', { name: 'Message info' }).click();
  const info = amal.getByRole('dialog', { name: 'Message info' });
  await expect(info.getByText('Binu Student')).toBeVisible();
  await expect(info.getByText(/^Read today \d/)).toBeVisible();
  await Promise.all([amal.context().close(), binu.context().close()]);
});
