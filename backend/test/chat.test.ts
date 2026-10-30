import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import { Client as PgClient } from 'pg';
import { startApi, type Client } from './helpers';

// Own database: test files run in parallel and api.test.ts resets lms_test.
const baseUrl = process.env.TEST_DATABASE_URL ?? 'postgresql://postgres:test@localhost:55432/lms_test';
const chatUrl = new URL(baseUrl);
chatUrl.pathname = '/lms_chat_test';
process.env.DATABASE_URL = chatUrl.toString();
process.env.SECRET_KEY = 'chat-test-secret';
Object.assign(process.env, { R2_ACCOUNT_ID: 'acct', R2_ACCESS_KEY_ID: 'k', R2_SECRET_ACCESS_KEY: 's', R2_BUCKET: 'b' });

let api: Client;
const ids: Record<string, number> = {};
const tok: Record<string, string> = {};
type Req = { token?: string; body?: unknown };
const as = (who: string) => ({
  get: (path: string) => api.request('GET', `/chat${path}`, { token: tok[who] }),
  post: (path: string, body: unknown = {}) => api.request('POST', `/chat${path}`, { token: tok[who], body } as Req),
  put: (path: string, body: unknown = {}) => api.request('PUT', `/chat${path}`, { token: tok[who], body } as Req),
  patch: (path: string, body: unknown) => api.request('PATCH', `/chat${path}`, { token: tok[who], body } as Req),
  del: (path: string) => api.request('DELETE', `/chat${path}`, { token: tok[who] }),
});

before(async () => {
  const admin = new PgClient({ connectionString: baseUrl });
  await admin.connect();
  await admin.query('DROP DATABASE IF EXISTS lms_chat_test WITH (FORCE)');
  await admin.query('CREATE DATABASE lms_chat_test');
  await admin.end();

  api = await startApi();
  const { pool } = await import('../src/db.js');
  const { createAccessToken } = await import('../src/auth.js');
  const people: [string, string][] = [
    ['teacher', 'TEACHER'],
    ['teacher2', 'TEACHER'],
    ['s1', 'STUDENT'],
    ['s2', 'STUDENT'],
    ['outsider', 'STUDENT'],
    ['admin', 'ADMIN'],
  ];
  for (const [key, role] of people) {
    const { rows } = await pool.query<{ id: number }>(
      "INSERT INTO users (email, full_name, hashed_password, role, is_active) VALUES ($1, $2, 'x', $3, true) RETURNING id",
      [`${key}@chat.dev`, `User ${key}`, role],
    );
    ids[key] = rows[0].id;
    tok[key] = createAccessToken(`${key}@chat.dev`);
  }
  const cls = await pool.query<{ id: number }>(
    "INSERT INTO classes (name, subject, teacher_id, is_active) VALUES ('Algebra', 'Math', $1, true) RETURNING id",
    [ids.teacher],
  );
  ids.class = cls.rows[0].id;
  await pool.query('INSERT INTO enrollments (student_id, class_id) VALUES ($1, $3), ($2, $3)', [ids.s1, ids.s2, ids.class]);
});

after(async () => {
  await api?.close();
});

describe('contacts and direct chats', () => {
  test('students reach classmates and their teacher only; staff reach everyone', async () => {
    const forStudent = (await as('s1').get('/contacts')).body.map((c: { id: number }) => c.id).sort();
    assert.deepEqual(forStudent, [ids.teacher, ids.s2].sort());
    const forTeacher = (await as('teacher').get('/contacts')).body.map((c: { id: number }) => c.id);
    assert.ok(forTeacher.includes(ids.outsider) && forTeacher.includes(ids.teacher2));
  });

  test('direct chats respect contacts and are reused', async () => {
    const first = await as('s1').post('/direct', { user_id: ids.s2 });
    assert.equal(first.status, 200, JSON.stringify(first.body));
    assert.equal(first.body.kind, 'direct');
    assert.equal(first.body.name, 'User s2');
    ids.dm = first.body.id;
    assert.equal((await as('s2').post('/direct', { user_id: ids.s1 })).body.id, ids.dm);

    assert.equal((await as('s1').post('/direct', { user_id: ids.outsider })).status, 403);
    assert.equal((await as('s1').post('/direct', { user_id: ids.teacher2 })).status, 403);
    assert.equal((await as('s1').post('/direct', { user_id: ids.s1 })).status, 400);
    assert.equal((await as('teacher').post('/direct', { user_id: ids.outsider })).status, 200);
  });

  test('non-members cannot see a conversation', async () => {
    assert.equal((await as('outsider').get(`/conversations/${ids.dm}`)).status, 404);
    assert.equal((await as('outsider').get(`/conversations/${ids.dm}/messages`)).status, 404);
    assert.equal((await as('outsider').post(`/conversations/${ids.dm}/messages`, { body: 'hi' })).status, 404);
  });
});

describe('messages', () => {
  test('send, unread counts and read receipts', async () => {
    const sent = await as('s1').post(`/conversations/${ids.dm}/messages`, { body: '  Hello there  ' });
    assert.equal(sent.status, 200, JSON.stringify(sent.body));
    assert.equal(sent.body.body, 'Hello there');
    assert.deepEqual([sent.body.read_count, sent.body.recipients], [0, 1]);
    ids.msg = sent.body.id;

    const list = (await as('s2').get('/conversations')).body;
    const dm = list.find((c: { id: number }) => c.id === ids.dm);
    assert.equal(dm.unread_count, 1);
    assert.equal(dm.last_message.body, 'Hello there');
    assert.equal(dm.last_message.sender_name, 'User s1');

    await as('s2').post(`/conversations/${ids.dm}/read`, { message_id: ids.msg });
    assert.equal((await as('s2').get('/conversations')).body.find((c: { id: number }) => c.id === ids.dm).unread_count, 0);
    const [msg] = (await as('s1').get(`/conversations/${ids.dm}/messages`)).body;
    assert.equal(msg.read_count, 1);
  });

  test('validates content, replies and attachments', async () => {
    assert.equal((await as('s1').post(`/conversations/${ids.dm}/messages`, {})).status, 422);
    assert.equal((await as('s1').post(`/conversations/${ids.dm}/messages`, { body: '   ' })).status, 422);
    const attachment = { key: `users/${ids.s2}/abc-notes.pdf`, name: 'notes.pdf', content_type: 'application/pdf', size: 10 };
    assert.equal((await as('s1').post(`/conversations/${ids.dm}/messages`, { attachment })).status, 403);

    const own = { ...attachment, key: `users/${ids.s1}/abc-notes.pdf` };
    const withFile = await as('s1').post(`/conversations/${ids.dm}/messages`, { attachment: own, reply_to_id: ids.msg });
    assert.equal(withFile.status, 200, JSON.stringify(withFile.body));
    assert.deepEqual(withFile.body.attachment, { name: 'notes.pdf', content_type: 'application/pdf', size: 10 });
    assert.equal(withFile.body.reply_to.body, 'Hello there');
    assert.equal(withFile.body.attachment.key, undefined);

    const url = await as('s2').get(`/messages/${withFile.body.id}/attachment`);
    assert.equal(url.status, 200);
    assert.match(url.body.download_url, /X-Amz-Signature/);
    assert.equal((await as('outsider').get(`/messages/${withFile.body.id}/attachment`)).status, 404);

    const otherChat = (await as('teacher').post('/direct', { user_id: ids.s1 })).body.id;
    assert.equal((await as('s1').post(`/conversations/${otherChat}/messages`, { body: 'x', reply_to_id: ids.msg })).status, 400);
  });

  test('reactions add, change and remove', async () => {
    const r1 = await as('s2').put(`/messages/${ids.msg}/reaction`, { emoji: '👍' });
    assert.deepEqual(r1.body.reactions, [{ emoji: '👍', count: 1, mine: true }]);
    await as('s1').put(`/messages/${ids.msg}/reaction`, { emoji: '👍' });
    const r2 = await as('s2').put(`/messages/${ids.msg}/reaction`, { emoji: '❤️' });
    assert.equal(r2.body.reactions.length, 2);
    const r3 = await as('s2').del(`/messages/${ids.msg}/reaction`);
    assert.deepEqual(r3.body.reactions, [{ emoji: '👍', count: 1, mine: false }]);
    assert.equal((await as('outsider').put(`/messages/${ids.msg}/reaction`, { emoji: '👍' })).status, 404);
  });

  test('only the sender can delete, and deleted messages are blanked', async () => {
    assert.equal((await as('s2').del(`/messages/${ids.msg}`)).status, 403);
    const res = await as('s1').del(`/messages/${ids.msg}`);
    assert.equal(res.status, 200);
    assert.deepEqual([res.body.deleted, res.body.body, res.body.reactions], [true, null, []]);
    assert.equal((await as('s2').put(`/messages/${ids.msg}/reaction`, { emoji: '😂' })).status, 400);
    const msgs = (await as('s2').get(`/conversations/${ids.dm}/messages`)).body;
    assert.equal(msgs.find((m: { id: number }) => m.id !== ids.msg).reply_to.deleted, true);
  });

  test('pagination returns older messages before a given id', async () => {
    const sent: number[] = [];
    for (let i = 0; i < 5; i += 1) sent.push((await as('s2').post(`/conversations/${ids.dm}/messages`, { body: `m${i}` })).body.id);
    const latest = (await as('s1').get(`/conversations/${ids.dm}/messages?limit=2`)).body.map((m: { id: number }) => m.id);
    assert.deepEqual(latest, sent.slice(3));
    const older = (await as('s1').get(`/conversations/${ids.dm}/messages?limit=2&before=${sent[3]}`)).body.map((m: { id: number }) => m.id);
    assert.deepEqual(older, sent.slice(1, 3));
  });
});

describe('class chats', () => {
  test('are created from enrollment with the teacher as admin', async () => {
    const forS1 = (await as('s1').get('/conversations')).body.find((c: { kind: string }) => c.kind === 'class');
    assert.equal(forS1.name, 'Algebra');
    assert.equal(forS1.my_role, 'member');
    ids.classChat = forS1.id;
    const detail = (await as('teacher').get(`/conversations/${ids.classChat}`)).body;
    assert.deepEqual(
      detail.members.map((m: { id: number; member_role: string }) => [m.id, m.member_role]).sort(),
      [[ids.teacher, 'admin'], [ids.s1, 'member'], [ids.s2, 'member']].sort(),
    );
    assert.equal((await as('outsider').get('/conversations')).body.some((c: { kind: string }) => c.kind === 'class'), false);
  });

  test('membership cannot be edited by hand', async () => {
    assert.equal((await as('s1').del(`/conversations/${ids.classChat}/members/${ids.s1}`)).status, 400);
    assert.equal((await as('teacher').post(`/conversations/${ids.classChat}/members`, { user_ids: [ids.outsider] })).status, 400);
  });
});

describe('groups', () => {
  test('students form groups with classmates only', async () => {
    assert.equal((await as('s1').post('/groups', { name: 'Study', member_ids: [ids.outsider] })).status, 403);
    const res = await as('s1').post('/groups', { name: 'Study', member_ids: [ids.s2] });
    assert.equal(res.status, 200);
    assert.equal(res.body.my_role, 'admin');
    assert.equal(res.body.member_count, 2);
    ids.group = res.body.id;
  });

  test('only admins rename, add, remove and promote', async () => {
    assert.equal((await as('s2').patch(`/conversations/${ids.group}`, { name: 'Mine' })).status, 403);
    assert.equal((await as('s1').patch(`/conversations/${ids.group}`, { name: 'Algebra study', description: 'Weekly' })).body.name, 'Algebra study');
    assert.equal((await as('s2').post(`/conversations/${ids.group}/members`, { user_ids: [ids.teacher] })).status, 403);
    assert.equal((await as('s1').post(`/conversations/${ids.group}/members`, { user_ids: [ids.teacher] })).body.member_count, 3);
    assert.equal((await as('s2').del(`/conversations/${ids.group}/members/${ids.teacher}`)).status, 403);
    const promoted = await as('s1').put(`/conversations/${ids.group}/members/${ids.s2}`, { role: 'admin' });
    assert.equal(promoted.body.members.find((m: { id: number }) => m.id === ids.s2).member_role, 'admin');
  });

  test('the last admin leaving hands admin to the longest member', async () => {
    const res = await as('s1').post('/groups', { name: 'Handover', member_ids: [ids.s2] });
    assert.equal((await as('s1').del(`/conversations/${res.body.id}/members/${ids.s1}`)).status, 200);
    assert.equal((await as('s2').get(`/conversations/${res.body.id}`)).body.my_role, 'admin');
    assert.equal((await as('s1').get(`/conversations/${res.body.id}`)).status, 404);
  });
});

describe('communities', () => {
  test('only staff can create one; announcements are admin-only', async () => {
    assert.equal((await as('s1').post('/communities', { name: 'Math Dept' })).status, 403);
    const res = await as('teacher').post('/communities', { name: 'Math Dept', description: 'All math classes' });
    assert.equal(res.status, 200);
    ids.community = res.body.id;
    const [community] = (await as('teacher').get('/communities')).body;
    assert.equal(community.my_role, 'admin');
    ids.announcements = community.announcement_conversation_id;
    assert.equal((await as('teacher').post(`/conversations/${ids.announcements}/messages`, { body: 'Welcome' })).status, 200);
  });

  test('adding a class chat brings its members in, but they cannot announce', async () => {
    assert.equal((await as('s1').post(`/communities/${ids.community}/groups`, { conversation_id: ids.classChat })).status, 404);
    const res = await as('teacher').post(`/communities/${ids.community}/groups`, { conversation_id: ids.classChat });
    assert.equal(res.status, 200, JSON.stringify(res.body));
    assert.equal((await as('teacher').post(`/communities/${ids.community}/groups`, { conversation_id: ids.classChat })).status, 400);

    const [forS1] = (await as('s1').get('/communities')).body;
    assert.equal(forS1.name, 'Math Dept');
    assert.deepEqual(forS1.groups.map((g: { id: number; is_member: boolean }) => [g.id, g.is_member]), [[ids.classChat, true]]);
    const announcements = (await as('s1').get('/conversations')).body.find((c: { id: number }) => c.id === ids.announcements);
    assert.equal(announcements.can_post, false);
    assert.equal((await as('s1').post(`/conversations/${ids.announcements}/messages`, { body: 'me too' })).status, 403);
  });

  test('members can leave; only admins remove others or detach groups', async () => {
    assert.equal((await as('s2').del(`/communities/${ids.community}/members/${ids.s1}`)).status, 403);
    assert.equal((await as('s2').del(`/communities/${ids.community}/members/${ids.s2}`)).status, 200);
    assert.deepEqual((await as('s2').get('/communities')).body, []);
    assert.equal((await as('s1').del(`/communities/${ids.community}/groups/${ids.classChat}`)).status, 403);
    assert.equal((await as('teacher').del(`/communities/${ids.community}/groups/${ids.classChat}`)).status, 200);
  });
});


describe('delivery, typing, presence and unread', () => {
  test('a message is sent, then delivered when the recipient app polls, then read', async () => {
    const dm = (await as('teacher').post('/direct', { user_id: ids.s2 })).body.id;
    const sent = (await as('teacher').post(`/conversations/${dm}/messages`, { body: 'Homework is due Monday' })).body;
    assert.deepEqual([sent.delivered_count, sent.read_count, sent.recipients], [0, 0, 1]);

    // s2's app checks the unread count (any page) -> delivered, not read.
    const unread = await as('s2').get('/unread');
    assert.ok(unread.body.total >= 1);
    let [msg] = (await as('teacher').get(`/conversations/${dm}/messages`)).body.slice(-1);
    assert.deepEqual([msg.delivered_count, msg.read_count], [1, 0]);

    const info = (await as('teacher').get(`/messages/${sent.id}/receipts`)).body;
    assert.equal(info.length, 1);
    assert.equal(info[0].user_id, ids.s2);
    assert.equal(info[0].delivered, true);
    assert.ok(info[0].delivered_at);
    assert.deepEqual([info[0].read, info[0].read_at], [false, null]);

    await as('s2').post(`/conversations/${dm}/read`, { message_id: sent.id });
    [msg] = (await as('teacher').get(`/conversations/${dm}/messages`)).body.slice(-1);
    assert.deepEqual([msg.delivered_count, msg.read_count], [1, 1]);
    const after = (await as('teacher').get(`/messages/${sent.id}/receipts`)).body[0];
    assert.equal(after.read, true);
    assert.ok(new Date(after.read_at) >= new Date(after.delivered_at));

    // Only the sender sees message info; reading past the newest message is ignored.
    assert.equal((await as('s2').get(`/messages/${sent.id}/receipts`)).status, 403);
    await as('s2').post(`/conversations/${dm}/read`, { message_id: 999999 });
    assert.equal((await as('s2').get('/conversations')).body.find((c: { id: number }) => c.id === dm).unread_count, 0);
  });

  test('typing shows to others, clears on send and can be stopped', async () => {
    const dm = (await as('teacher').post('/direct', { user_id: ids.s2 })).body.id;
    await as('s2').post(`/conversations/${dm}/typing`, { typing: true });
    assert.deepEqual((await as('teacher').get(`/conversations/${dm}/status`)).body.typing.map((t: { id: number }) => t.id), [ids.s2]);
    assert.deepEqual((await as('teacher').get('/conversations')).body.find((c: { id: number }) => c.id === dm).typing, ['User s2']);
    assert.deepEqual((await as('s2').get(`/conversations/${dm}/status`)).body.typing, []); // never your own

    await as('s2').post(`/conversations/${dm}/messages`, { body: 'ok!' });
    assert.deepEqual((await as('teacher').get(`/conversations/${dm}/status`)).body.typing, []);

    await as('s2').post(`/conversations/${dm}/typing`, { typing: true });
    await as('s2').post(`/conversations/${dm}/typing`, { typing: false });
    assert.deepEqual((await as('teacher').get(`/conversations/${dm}/status`)).body.typing, []);
    assert.equal((await as('outsider').post(`/conversations/${dm}/typing`, { typing: true })).status, 404);
  });

  test('presence: online while the app is in use, otherwise last seen', async () => {
    const dm = (await as('teacher').post('/direct', { user_id: ids.s2 })).body.id;
    const { pool } = await import('../src/db.js');
    const presenceOf = async () =>
      (await as('teacher').get(`/conversations/${dm}/status`)).body.presence.find((p: { user_id: number }) => p.user_id === ids.s2);
    await as('s2').get('/unread');
    assert.equal((await presenceOf()).online, true);

    await pool.query("UPDATE user_presence SET last_seen_at = now() - interval '10 minutes' WHERE user_id = $1", [ids.s2]);
    const away = await presenceOf();
    assert.equal(away.online, false);
    assert.ok(Date.now() - new Date(away.last_seen_at).getTime() >= 9 * 60 * 1000);
  });
});
