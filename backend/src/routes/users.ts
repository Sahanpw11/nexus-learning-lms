import { Router } from 'express';
import { z } from 'zod';
import { currentUser, requireRoles, requireUser, type UserRow } from '../auth';
import { pool, toDbRole } from '../db';
import { HttpError, parseBody, parseId } from '../errors';
import { toUser } from '../serializers';

const userUpdate = z.object({
  email: z.email().optional(),
  full_name: z.string().min(1).optional(),
  role: z.enum(['admin', 'teacher', 'student']).optional(),
  is_active: z.boolean().optional(),
});

export const usersRouter = Router();

usersRouter.get('/', requireRoles('admin'), async (_req, res) => {
  const { rows } = await pool.query<UserRow>('SELECT * FROM users ORDER BY id');
  res.json(rows.map(toUser));
});

// Registered before /:id so "teachers" is never parsed as an id.
usersRouter.get('/teachers/all', requireUser, async (_req, res) => {
  const { rows } = await pool.query<UserRow>(
    "SELECT * FROM users WHERE role = 'TEACHER' AND is_active = true ORDER BY id",
  );
  res.json(rows.map(toUser));
});

usersRouter.get('/students/all', requireRoles('admin', 'teacher'), async (_req, res) => {
  const { rows } = await pool.query<UserRow>(
    "SELECT * FROM users WHERE role = 'STUDENT' AND is_active = true ORDER BY id",
  );
  res.json(rows.map(toUser));
});

async function findUser(id: number): Promise<UserRow> {
  const { rows } = await pool.query<UserRow>('SELECT * FROM users WHERE id = $1', [id]);
  if (!rows[0]) throw new HttpError(404, 'User not found');
  return rows[0];
}

usersRouter.get('/:id', requireUser, async (req, res) => {
  const id = parseId(req.params.id);
  const me = currentUser(req);
  if (me.role !== 'ADMIN' && me.id !== id) throw new HttpError(403, 'Not enough permissions');
  res.json(toUser(await findUser(id)));
});

usersRouter.put('/:id', requireUser, async (req, res) => {
  const id = parseId(req.params.id);
  const me = currentUser(req);
  if (me.role !== 'ADMIN' && me.id !== id) throw new HttpError(403, 'Not enough permissions');
  const update = parseBody(userUpdate, req.body);
  // Changed from the Python API: non-admins could promote themselves or reactivate their account.
  if (me.role !== 'ADMIN' && (update.role !== undefined || update.is_active !== undefined)) {
    throw new HttpError(403, 'Only administrators can change role or active status');
  }
  await findUser(id);

  const values: Record<string, unknown> = {
    email: update.email,
    full_name: update.full_name,
    role: update.role && toDbRole(update.role),
    is_active: update.is_active,
  };
  const fields = Object.keys(values).filter((key) => values[key] !== undefined);
  if (fields.length === 0) return res.json(toUser(await findUser(id)));

  // Column names come from the fixed list above, never from the request.
  const assignments = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
  const { rows } = await pool.query<UserRow>(
    `UPDATE users SET ${assignments}, updated_at = now() WHERE id = $1 RETURNING *`,
    [id, ...fields.map((field) => values[field])],
  );
  res.json(toUser(rows[0]));
});

usersRouter.delete('/:id', requireRoles('admin'), async (req, res) => {
  const id = parseId(req.params.id);
  await findUser(id);
  await pool.query('UPDATE users SET is_active = false, updated_at = now() WHERE id = $1', [id]);
  res.json({ message: 'User deactivated successfully' });
});
