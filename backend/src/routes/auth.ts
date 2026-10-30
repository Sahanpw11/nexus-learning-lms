import { Router } from 'express';
import { z } from 'zod';
import { createAccessToken, currentUser, hashPassword, requireRoles, requireUser, verifyPassword, type UserRow } from '../auth';
import { pool, toDbRole } from '../db';
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

type UserCreate = z.infer<typeof userCreate>;

async function insertUser(user: UserCreate): Promise<UserRow> {
  const existing = await pool.query('SELECT 1 FROM users WHERE email = $1', [user.email]);
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

authRouter.get('/me', requireUser, (req, res) => {
  res.json(toUser(currentUser(req)));
});

authRouter.post('/create-admin', requireRoles('admin'), async (req, res) => {
  const user = parseBody(userCreate, req.body);
  if (user.role !== 'admin') throw new HttpError(400, 'This endpoint is only for creating admin users');
  res.json(toUser(await insertUser(user)));
});
