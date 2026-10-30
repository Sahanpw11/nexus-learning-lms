import { Router } from 'express';
import { z } from 'zod';
import { currentUser, requireRoles, requireUser, type UserRow } from '../auth';
import { pool } from '../db';
import { HttpError, parseBody, parseId } from '../errors';
import { toClass, toEnrollment, type ClassRow, type EnrollmentRow } from '../serializers';

const classCreate = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  subject: z.string().min(1),
});
const classUpdate = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  subject: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
});
// class_id comes from the path; the Python schema also demanded it in the body, which the frontend never sent.
const enrollmentCreate = z.object({ student_id: z.number().int() });

export const classesRouter = Router();

async function findClass(id: number): Promise<ClassRow> {
  const { rows } = await pool.query<ClassRow>('SELECT * FROM classes WHERE id = $1', [id]);
  if (!rows[0]) throw new HttpError(404, 'Class not found');
  return rows[0];
}

const ownsOrAdmin = (user: UserRow, cls: ClassRow) => user.role === 'ADMIN' || cls.teacher_id === user.id;

classesRouter.post('/', requireRoles('admin', 'teacher'), async (req, res) => {
  const data = parseBody(classCreate, req.body);
  const { rows } = await pool.query<ClassRow>(
    `INSERT INTO classes (name, description, subject, teacher_id, is_active)
     VALUES ($1, $2, $3, $4, true) RETURNING *`,
    [data.name, data.description ?? null, data.subject, currentUser(req).id],
  );
  res.json(toClass(rows[0]));
});

classesRouter.get('/', requireUser, async (req, res) => {
  const me = currentUser(req);
  const query =
    me.role === 'ADMIN'
      ? pool.query<ClassRow>('SELECT * FROM classes WHERE is_active = true ORDER BY id')
      : me.role === 'TEACHER'
        ? pool.query<ClassRow>('SELECT * FROM classes WHERE teacher_id = $1 AND is_active = true ORDER BY id', [me.id])
        : pool.query<ClassRow>(
            `SELECT c.* FROM classes c
             WHERE c.is_active = true AND c.id IN (SELECT class_id FROM enrollments WHERE student_id = $1)
             ORDER BY c.id`,
            [me.id],
          );
  res.json((await query).rows.map(toClass));
});

classesRouter.get('/:id', requireUser, async (req, res) => {
  const id = parseId(req.params.id);
  const me = currentUser(req);
  const cls = await findClass(id);
  if (me.role === 'STUDENT') {
    const enrolled = await pool.query('SELECT 1 FROM enrollments WHERE student_id = $1 AND class_id = $2', [me.id, id]);
    if (!enrolled.rowCount) throw new HttpError(403, 'Not enrolled in this class');
  } else if (me.role === 'TEACHER' && cls.teacher_id !== me.id) {
    throw new HttpError(403, 'Not authorized to view this class');
  }
  res.json(toClass(cls));
});

classesRouter.put('/:id', requireUser, async (req, res) => {
  const id = parseId(req.params.id);
  const cls = await findClass(id);
  if (!ownsOrAdmin(currentUser(req), cls)) throw new HttpError(403, 'Not authorized to update this class');
  const update = parseBody(classUpdate, req.body);
  const next = { ...cls, ...update };
  const { rows } = await pool.query<ClassRow>(
    `UPDATE classes SET name = $2, description = $3, subject = $4, is_active = $5, updated_at = now()
     WHERE id = $1 RETURNING *`,
    [id, next.name, next.description, next.subject, next.is_active],
  );
  res.json(toClass(rows[0]));
});

classesRouter.delete('/:id', requireRoles('admin', 'teacher'), async (req, res) => {
  const id = parseId(req.params.id);
  const cls = await findClass(id);
  if (!ownsOrAdmin(currentUser(req), cls)) throw new HttpError(403, 'Not authorized to delete this class');
  await pool.query('UPDATE classes SET is_active = false, updated_at = now() WHERE id = $1', [id]);
  res.json({ message: 'Class deleted successfully' });
});

classesRouter.post('/:id/enroll', requireRoles('admin', 'teacher'), async (req, res) => {
  const id = parseId(req.params.id);
  const { student_id } = parseBody(enrollmentCreate, req.body);
  const cls = await findClass(id);
  // Changed from the Python API: teachers could enroll students into other teachers' classes.
  if (!ownsOrAdmin(currentUser(req), cls)) throw new HttpError(403, 'Not authorized to enroll students in this class');

  const student = await pool.query("SELECT 1 FROM users WHERE id = $1 AND role = 'STUDENT'", [student_id]);
  if (!student.rowCount) throw new HttpError(404, 'Student not found');
  const existing = await pool.query('SELECT 1 FROM enrollments WHERE student_id = $1 AND class_id = $2', [student_id, id]);
  if (existing.rowCount) throw new HttpError(400, 'Student already enrolled in this class');

  const { rows } = await pool.query<EnrollmentRow>(
    'INSERT INTO enrollments (student_id, class_id) VALUES ($1, $2) RETURNING *',
    [student_id, id],
  );
  res.json(toEnrollment(rows[0]));
});

classesRouter.get('/:id/students', requireRoles('admin', 'teacher'), async (req, res) => {
  const id = parseId(req.params.id);
  const cls = await findClass(id);
  if (!ownsOrAdmin(currentUser(req), cls)) throw new HttpError(403, "Not authorized to view this class's students");
  const { rows } = await pool.query<{ id: number; email: string; full_name: string; enrolled_at: Date }>(
    `SELECT u.id, u.email, u.full_name, e.enrolled_at
     FROM enrollments e JOIN users u ON u.id = e.student_id
     WHERE e.class_id = $1 ORDER BY e.id`,
    [id],
  );
  res.json(rows.map((row) => ({ ...row, enrolled_at: row.enrolled_at.toISOString() })));
});
