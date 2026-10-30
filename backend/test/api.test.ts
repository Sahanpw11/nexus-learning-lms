import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import jwt from 'jsonwebtoken';
import { Client as PgClient } from 'pg';
import { startApi, type Client } from './helpers';

const databaseUrl = process.env.TEST_DATABASE_URL ?? 'postgresql://postgres:test@localhost:55432/lms_test';
if (!/_test$/.test(new URL(databaseUrl).pathname)) throw new Error('TEST_DATABASE_URL must point at a *_test database');
process.env.DATABASE_URL = databaseUrl;
process.env.SECRET_KEY = 'api-test-secret';
// URL signing is local computation, so dummy R2 credentials are enough.
Object.assign(process.env, {
  R2_ACCOUNT_ID: 'testaccount',
  R2_ACCESS_KEY_ID: 'test-key',
  R2_SECRET_ACCESS_KEY: 'test-secret',
  R2_BUCKET: 'nexus-files',
});

let api: Client;
const tokens: Record<string, string> = {};
const ids: Record<string, number> & { teacherFileKey?: string } = {};

async function login(email: string, password: string) {
  const res = await api.request('POST', '/auth/login', { body: { email, password } });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  return res.body.access_token as string;
}

before(async () => {
  // Start from an empty schema; the guard above keeps this away from real databases.
  const pg = new PgClient({ connectionString: databaseUrl });
  await pg.connect();
  await pg.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await pg.end();

  api = await startApi();

  // Admins can't self-register, so seed one the way the seed script does.
  const { hashPassword } = await import('../src/auth.js');
  const { pool } = await import('../src/db.js');
  await pool.query(
    "INSERT INTO users (email, full_name, hashed_password, role, is_active) VALUES ('admin@test.dev', 'Admin', $1, 'ADMIN', true)",
    [await hashPassword('admin-pass')],
  );
  tokens.admin = await login('admin@test.dev', 'admin-pass');
});

after(async () => {
  await api?.close();
});

describe('service endpoints', () => {
  test('health and root keep their response shape', async () => {
    assert.deepEqual((await api.request('GET', '/health')).body, { status: 'healthy', service: 'Nexus Learning' });
    const root = await api.request('GET', '/');
    assert.equal(root.body.docs, '/docs');
    assert.ok((await api.request('GET', '/docs')).body.endpoints.length > 0);
  });

  test('unknown routes return 404 with a detail', async () => {
    const res = await api.request('GET', '/nope');
    assert.equal(res.status, 404);
    assert.equal(res.body.detail, 'Not Found');
  });
});

describe('authentication', () => {
  test('registers teachers and students with lowercase roles', async () => {
    for (const [key, role] of [['teacher', 'teacher'], ['teacher2', 'teacher'], ['student', 'student'], ['student2', 'student']]) {
      const res = await api.request('POST', '/auth/register', {
        body: { email: `${key}@test.dev`, full_name: `Test ${key}`, password: 'secret', role },
      });
      assert.equal(res.status, 200, JSON.stringify(res.body));
      assert.equal(res.body.role, role);
      assert.equal(res.body.is_active, true);
      assert.equal(res.body.updated_at, null);
      assert.equal(res.body.hashed_password, undefined);
      ids[key] = res.body.id;
      tokens[key] = await login(`${key}@test.dev`, 'secret');
    }
  });

  test('public registration cannot create an admin', async () => {
    const res = await api.request('POST', '/auth/register', {
      body: { email: 'sneaky@test.dev', full_name: 'Sneaky', password: 'x', role: 'admin' },
    });
    assert.equal(res.status, 403);
  });

  test('rejects duplicate and invalid registrations', async () => {
    const dup = await api.request('POST', '/auth/register', {
      body: { email: 'teacher@test.dev', full_name: 'Again', password: 'x', role: 'teacher' },
    });
    assert.equal(dup.status, 400);
    assert.equal(dup.body.detail, 'Email already registered');

    const invalid = await api.request('POST', '/auth/register', { body: { email: 'not-an-email', full_name: 'X', password: 'x', role: 'student' } });
    assert.equal(invalid.status, 422);
    assert.ok(Array.isArray(invalid.body.detail));
  });

  test('rejects a wrong password', async () => {
    const res = await api.request('POST', '/auth/login', { body: { email: 'teacher@test.dev', password: 'wrong' } });
    assert.equal(res.status, 401);
    assert.equal(res.body.detail, 'Incorrect email or password');
  });

  test('/auth/me requires a valid, unexpired token', async () => {
    assert.equal((await api.request('GET', '/auth/me')).status, 403);
    assert.equal((await api.request('GET', '/auth/me', { token: 'garbage' })).status, 401);
    const expired = jwt.sign({ sub: 'teacher@test.dev', exp: Math.floor(Date.now() / 1000) - 10 }, 'api-test-secret');
    assert.equal((await api.request('GET', '/auth/me', { token: expired })).status, 401);
    const forged = jwt.sign({ sub: 'teacher@test.dev' }, 'some-other-secret');
    assert.equal((await api.request('GET', '/auth/me', { token: forged })).status, 401);

    const me = await api.request('GET', '/auth/me', { token: tokens.teacher });
    assert.equal(me.status, 200);
    assert.equal(me.body.email, 'teacher@test.dev');
  });

  test('only admins can create admins', async () => {
    const body = { email: 'admin2@test.dev', full_name: 'Admin Two', password: 'x', role: 'admin' };
    assert.equal((await api.request('POST', '/auth/create-admin', { token: tokens.teacher, body })).status, 403);
    assert.equal((await api.request('POST', '/auth/create-admin', { token: tokens.admin, body: { ...body, role: 'teacher' } })).status, 400);
    const res = await api.request('POST', '/auth/create-admin', { token: tokens.admin, body });
    assert.equal(res.status, 200);
    assert.equal(res.body.role, 'admin');
  });
});

describe('users', () => {
  test('listing all users is admin-only', async () => {
    assert.equal((await api.request('GET', '/users/', { token: tokens.teacher })).status, 403);
    const res = await api.request('GET', '/users/', { token: tokens.admin });
    assert.equal(res.status, 200);
    assert.ok(res.body.length >= 5);
  });

  test('teacher and student directories respect roles', async () => {
    const teachers = await api.request('GET', '/users/teachers/all', { token: tokens.student });
    assert.equal(teachers.status, 200);
    assert.ok(teachers.body.every((u: { role: string }) => u.role === 'teacher'));
    assert.equal((await api.request('GET', '/users/students/all', { token: tokens.student })).status, 403);
    assert.equal((await api.request('GET', '/users/students/all', { token: tokens.teacher })).status, 200);
  });

  test('users can read only themselves unless admin', async () => {
    assert.equal((await api.request('GET', `/users/${ids.student}`, { token: tokens.student })).status, 200);
    assert.equal((await api.request('GET', `/users/${ids.teacher}`, { token: tokens.student })).status, 403);
    assert.equal((await api.request('GET', `/users/${ids.teacher}`, { token: tokens.admin })).status, 200);
    assert.equal((await api.request('GET', '/users/999999', { token: tokens.admin })).status, 404);
    assert.equal((await api.request('GET', '/users/abc', { token: tokens.admin })).status, 422);
  });

  test('users can edit their profile but not escalate their role', async () => {
    const ok = await api.request('PUT', `/users/${ids.student}`, { token: tokens.student, body: { full_name: 'Renamed Student' } });
    assert.equal(ok.status, 200);
    assert.equal(ok.body.full_name, 'Renamed Student');
    assert.notEqual(ok.body.updated_at, null);

    assert.equal((await api.request('PUT', `/users/${ids.student}`, { token: tokens.student, body: { role: 'admin' } })).status, 403);
    assert.equal((await api.request('PUT', `/users/${ids.student}`, { token: tokens.student, body: { is_active: true } })).status, 403);
    assert.equal((await api.request('PUT', `/users/${ids.teacher}`, { token: tokens.student, body: { full_name: 'x' } })).status, 403);
    assert.equal((await api.request('PUT', `/users/${ids.student}`, { token: tokens.student, body: { email: 'teacher@test.dev' } })).status, 400);
  });

  test('admins can change roles', async () => {
    const res = await api.request('PUT', `/users/${ids.student2}`, { token: tokens.admin, body: { role: 'teacher' } });
    assert.equal(res.status, 200);
    assert.equal(res.body.role, 'teacher');
    await api.request('PUT', `/users/${ids.student2}`, { token: tokens.admin, body: { role: 'student' } });
  });
});

describe('classes and enrollment', () => {
  test('teachers create classes, students cannot', async () => {
    const res = await api.request('POST', '/classes/', { token: tokens.teacher, body: { name: 'Algebra', subject: 'Math' } });
    assert.equal(res.status, 200, JSON.stringify(res.body));
    assert.equal(res.body.teacher_id, ids.teacher);
    assert.equal(res.body.description, null);
    assert.equal(res.body.is_active, true);
    ids.algebra = res.body.id;

    assert.equal((await api.request('POST', '/classes/', { token: tokens.student, body: { name: 'X', subject: 'Y' } })).status, 403);
    assert.equal((await api.request('POST', '/classes/', { token: tokens.teacher, body: { name: 'No subject' } })).status, 422);
  });

  test('enrollment is limited to the owning teacher or an admin', async () => {
    const path = `/classes/${ids.algebra}/enroll`;
    assert.equal((await api.request('POST', path, { token: tokens.teacher2, body: { student_id: ids.student } })).status, 403);
    assert.equal((await api.request('POST', path, { token: tokens.teacher, body: { student_id: ids.teacher2 } })).status, 404);

    const res = await api.request('POST', path, { token: tokens.teacher, body: { student_id: ids.student } });
    assert.equal(res.status, 200, JSON.stringify(res.body));
    assert.equal(res.body.class_id, ids.algebra);

    const dup = await api.request('POST', path, { token: tokens.teacher, body: { student_id: ids.student } });
    assert.equal(dup.status, 400);
    assert.equal((await api.request('POST', '/classes/999999/enroll', { token: tokens.admin, body: { student_id: ids.student } })).status, 404);
  });

  test('class visibility follows role and enrollment', async () => {
    const forStudent = await api.request('GET', '/classes/', { token: tokens.student });
    assert.deepEqual(forStudent.body.map((c: { id: number }) => c.id), [ids.algebra]);
    assert.deepEqual((await api.request('GET', '/classes/', { token: tokens.student2 })).body, []);
    assert.deepEqual((await api.request('GET', '/classes/', { token: tokens.teacher2 })).body, []);
    assert.equal((await api.request('GET', '/classes/', { token: tokens.admin })).body.length, 1);

    assert.equal((await api.request('GET', `/classes/${ids.algebra}`, { token: tokens.student })).status, 200);
    assert.equal((await api.request('GET', `/classes/${ids.algebra}`, { token: tokens.student2 })).status, 403);
    assert.equal((await api.request('GET', `/classes/${ids.algebra}`, { token: tokens.teacher2 })).status, 403);
    assert.equal((await api.request('GET', '/classes/999999', { token: tokens.admin })).status, 404);
  });

  test('enrolled students are listed for the owner', async () => {
    const res = await api.request('GET', `/classes/${ids.algebra}/students`, { token: tokens.teacher });
    assert.equal(res.status, 200);
    assert.deepEqual(Object.keys(res.body[0]).sort(), ['email', 'enrolled_at', 'full_name', 'id']);
    assert.equal((await api.request('GET', `/classes/${ids.algebra}/students`, { token: tokens.teacher2 })).status, 403);
    assert.equal((await api.request('GET', `/classes/${ids.algebra}/students`, { token: tokens.student })).status, 403);
  });

  test('only the owner or an admin can update and delete', async () => {
    const path = `/classes/${ids.algebra}`;
    assert.equal((await api.request('PUT', path, { token: tokens.teacher2, body: { name: 'Hijacked' } })).status, 403);
    const res = await api.request('PUT', path, { token: tokens.teacher, body: { description: 'Linear equations' } });
    assert.equal(res.status, 200);
    assert.equal(res.body.description, 'Linear equations');
    assert.equal(res.body.name, 'Algebra');

    assert.equal((await api.request('DELETE', path, { token: tokens.teacher2 })).status, 403);
    assert.equal((await api.request('DELETE', path, { token: tokens.teacher })).status, 200);
    assert.deepEqual((await api.request('GET', '/classes/', { token: tokens.teacher })).body, []);
  });
});

describe('deactivation', () => {
  test('deactivated users cannot log in or use existing tokens', async () => {
    assert.equal((await api.request('DELETE', `/users/${ids.student2}`, { token: tokens.teacher })).status, 403);
    const res = await api.request('DELETE', `/users/${ids.student2}`, { token: tokens.admin });
    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'User deactivated successfully');

    const loginRes = await api.request('POST', '/auth/login', { body: { email: 'student2@test.dev', password: 'secret' } });
    assert.equal(loginRes.status, 401);
    assert.equal(loginRes.body.detail, 'Account is inactive');
    const me = await api.request('GET', '/auth/me', { token: tokens.student2 });
    assert.equal(me.status, 400);
    assert.equal(me.body.detail, 'Inactive user');
  });
});

describe('file storage (R2)', () => {
  const upload = { filename: 'My Notes (final).pdf', content_type: 'application/pdf', size: 1024 };

  test('issues an owner-scoped signed upload URL', async () => {
    const res = await api.request('POST', '/files/upload-url', { token: tokens.teacher, body: upload });
    assert.equal(res.status, 200, JSON.stringify(res.body));
    assert.match(res.body.key, new RegExp(`^users/${ids.teacher}/[0-9a-f-]{36}-My_Notes_final_.pdf$`));
    const url = new URL(res.body.upload_url);
    assert.equal(url.host, 'testaccount.r2.cloudflarestorage.com');
    assert.equal(url.pathname, `/nexus-files/${res.body.key}`);
    assert.ok(url.searchParams.get('X-Amz-Signature'));
    assert.equal(url.searchParams.get('X-Amz-Expires'), '300');
    ids.teacherFileKey = res.body.key;
  });

  test('rejects unauthenticated, oversized and disallowed uploads', async () => {
    assert.equal((await api.request('POST', '/files/upload-url', { body: upload })).status, 403);
    assert.equal((await api.request('POST', '/files/upload-url', { token: tokens.teacher, body: { ...upload, size: 60 * 1024 * 1024 } })).status, 422);
    assert.equal((await api.request('POST', '/files/upload-url', { token: tokens.teacher, body: { ...upload, content_type: 'text/html' } })).status, 422);
  });

  test('download URLs are limited to the owner or an admin', async () => {
    const body = { key: ids.teacherFileKey };
    const own = await api.request('POST', '/files/download-url', { token: tokens.teacher, body });
    assert.equal(own.status, 200);
    assert.ok(new URL(own.body.download_url).searchParams.get('X-Amz-Signature'));
    assert.equal((await api.request('POST', '/files/download-url', { token: tokens.student, body })).status, 403);
    assert.equal((await api.request('POST', '/files/download-url', { token: tokens.admin, body })).status, 200);
  });
});

describe('vercel entry', () => {
  test('api/index default export serves requests as a plain Node handler', async () => {
    const { createServer } = await import('node:http');
    // The root api/index compiles to CommonJS, so require() yields the module with the app on .default.
    const { default: handler } = require('../../api/index') as { default: import('node:http').RequestListener };
    const server = createServer(handler);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const { port } = server.address() as import('node:net').AddressInfo;
    // Vercel forwards the original /api/... path; bare paths keep working for local tools.
    for (const path of ['/api/health', '/health', '/api/docs?x=1']) {
      assert.equal((await fetch(`http://127.0.0.1:${port}${path}`)).status, 200, path);
    }
    assert.equal((await fetch(`http://127.0.0.1:${port}/apix`)).status, 404);
    await new Promise((resolve) => server.close(resolve));
  });
});
