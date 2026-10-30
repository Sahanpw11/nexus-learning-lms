// Runs against a database the old Python backend created (setup_db.py) to prove the TypeScript
// API keeps working with existing tables, passlib bcrypt hashes and python-jose tokens.
// Skipped unless LEGACY_DATABASE_URL is set; LEGACY_TOKEN / LEGACY_SECRET_KEY add the JWT check.
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { startApi, type Client } from './helpers';

const legacyUrl = process.env.LEGACY_DATABASE_URL;
const skip = legacyUrl ? false : 'LEGACY_DATABASE_URL not set';

let api: Client;

before(async () => {
  if (skip) return;
  process.env.DATABASE_URL = legacyUrl;
  process.env.SECRET_KEY = process.env.LEGACY_SECRET_KEY ?? 'unused';
  api = await startApi(); // also re-runs initSchema against the existing tables
});

after(async () => {
  await api?.close();
});

test('logs in with passwords hashed by passlib', { skip }, async () => {
  for (const [email, password, role] of [
    ['admin@reactorminds.com', 'admin123', 'admin'],
    ['teacher@example.com', 'teacher123', 'teacher'],
    ['student@example.com', 'student123', 'student'],
  ]) {
    const login = await api.request('POST', '/auth/login', { body: { email, password } });
    assert.equal(login.status, 200, `${email}: ${JSON.stringify(login.body)}`);
    const me = await api.request('GET', '/auth/me', { token: login.body.access_token });
    assert.equal(me.body.role, role);
  }
});

test('accepts a token issued by the Python API', { skip: skip || (!process.env.LEGACY_TOKEN && 'LEGACY_TOKEN not set') }, async () => {
  const me = await api.request('GET', '/auth/me', { token: process.env.LEGACY_TOKEN });
  assert.equal(me.status, 200, JSON.stringify(me.body));
  assert.equal(me.body.email, 'teacher@example.com');
});

test('reads and writes the legacy uppercase enum', { skip }, async () => {
  const login = await api.request('POST', '/auth/login', { body: { email: 'teacher@example.com', password: 'teacher123' } });
  const token = login.body.access_token;
  const created = await api.request('POST', '/classes/', { token, body: { name: 'Legacy check', subject: 'Compat' } });
  assert.equal(created.status, 200);
  const students = await api.request('GET', '/users/students/all', { token });
  assert.ok(students.body.some((u: { email: string }) => u.email === 'student@example.com'));
});
