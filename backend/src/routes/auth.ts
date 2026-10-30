import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { createAccessToken, currentUser, hashPassword, requireRoles, requireUser, verifyPassword, type UserRow } from '../auth';
import { config } from '../config';
import { pool, toDbRole } from '../db';
import { googleVerifier } from '../google';
import { HttpError, parseBody } from '../errors';
import { toUser } from '../serializers';

const role = z.enum(['admin', 'teacher', 'student']);
const userCreate = z.object({
  email: z.email(),
  full_name: z.string().min(1),
  password: z.string().min(1),
  role,
});
const login = z.object({ email: z.email(), password: z.string() });
const googleSignIn = z.object({ credential: z.string().min(1) });
const googleComplete = z.object({
  onboarding_token: z.string().min(1),
  full_name: z.string().trim().min(1).max(120),
  role: z.enum(['student', 'teacher']), // admins are only created by admins
});

// Proves "Google verified this email" between sign-in and onboarding. No `sub`, so it can't act as a login token.
const ONBOARDING_TTL_SECONDS = 15 * 60;
const signOnboardingToken = (email: string) =>
  jwt.sign({ purpose: 'onboarding', email }, config.secretKey, { algorithm: config.algorithm, expiresIn: ONBOARDING_TTL_SECONDS });

function readOnboardingToken(token: string): string {
  try {
    const payload = jwt.verify(token, config.secretKey, { algorithms: [config.algorithm] }) as jwt.JwtPayload;
    if (payload.purpose === 'onboarding' && typeof payload.email === 'string') return payload.email;
  } catch {
    // fall through
  }
  throw new HttpError(401, 'Sign-in session expired, please sign in with Google again');
}

type UserCreate = z.infer<typeof userCreate>;

async function insertUser(user: UserCreate): Promise<UserRow> {
  const existing = await pool.query('SELECT 1 FROM users WHERE lower(email) = lower($1)', [user.email]);
  if (existing.rowCount) throw new HttpError(400, 'Email already registered');
  const { rows } = await pool.query<UserRow>(
    `INSERT INTO users (email, full_name, hashed_password, role, is_active)
     VALUES ($1, $2, $3, $4, true) RETURNING *`,
    [user.email, user.full_name, await hashPassword(user.password), toDbRole(user.role)],
  );
  return rows[0];
}

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const user = parseBody(userCreate, req.body);
  // Changed from the Python API: public sign-up could create administrators.
  if (user.role === 'admin') throw new HttpError(403, 'Admin accounts can only be created by an administrator');
  res.json(toUser(await insertUser(user)));
});

authRouter.post('/login', async (req, res) => {
  const credentials = parseBody(login, req.body);
  const { rows } = await pool.query<UserRow>('SELECT * FROM users WHERE email = $1', [credentials.email]);
  const user = rows[0];
  if (!user || !(await verifyPassword(credentials.password, user.hashed_password))) {
    throw new HttpError(401, 'Incorrect email or password', { 'WWW-Authenticate': 'Bearer' });
  }
  if (!user.is_active) throw new HttpError(401, 'Account is inactive');
  res.json({ access_token: createAccessToken(user.email), token_type: 'bearer' });
});

authRouter.post('/google', async (req, res) => {
  const { credential } = parseBody(googleSignIn, req.body);
  const identity = await googleVerifier.verify(credential);
  const { rows } = await pool.query<UserRow>('SELECT * FROM users WHERE lower(email) = $1', [identity.email]);
  const user = rows[0];
  if (!user) {
    // First visit: the frontend shows onboarding (name + student/teacher) before the account exists.
    return res.json({ status: 'onboarding', onboarding_token: signOnboardingToken(identity.email), email: identity.email, full_name: identity.name });
  }
  if (!user.is_active) throw new HttpError(401, 'Account is inactive');
  res.json({ status: 'signed_in', access_token: createAccessToken(user.email), token_type: 'bearer' });
});

authRouter.post('/google/complete', async (req, res) => {
  const { onboarding_token, full_name, role } = parseBody(googleComplete, req.body);
  const email = readOnboardingToken(onboarding_token);
  // Google accounts get an unguessable password hash, so only Google sign-in works for them.
  const user = await insertUser({ email, full_name, role, password: randomBytes(32).toString('hex') });
  res.json({ access_token: createAccessToken(user.email), token_type: 'bearer' });
});

authRouter.get('/me', requireUser, (req, res) => {
  res.json(toUser(currentUser(req)));
});

authRouter.post('/create-admin', requireRoles('admin'), async (req, res) => {
  const user = parseBody(userCreate, req.body);
  if (user.role !== 'admin') throw new HttpError(400, 'This endpoint is only for creating admin users');
  res.json(toUser(await insertUser(user)));
});
