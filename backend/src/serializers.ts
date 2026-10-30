import type { Enrollment, LearningClass, User } from '../../shared/types';
import type { UserRow } from './auth';
import { fromDbRole } from './db';

export interface ClassRow {
  id: number;
  name: string;
  description: string | null;
  teacher_id: number;
  subject: string;
  is_active: boolean | null;
  created_at: Date;
  updated_at: Date | null;
}

export interface EnrollmentRow {
  id: number;
  student_id: number;
  class_id: number;
  enrolled_at: Date;
}

const iso = (date: Date | null) => (date ? date.toISOString() : null);

export const toUser = (row: UserRow): User => ({
  id: row.id,
  email: row.email,
  full_name: row.full_name,
  role: fromDbRole(row.role),
  is_active: Boolean(row.is_active),
  created_at: row.created_at.toISOString(),
  updated_at: iso(row.updated_at),
});

export const toClass = (row: ClassRow): LearningClass => ({
  id: row.id,
  name: row.name,
  description: row.description,
  subject: row.subject,
  teacher_id: row.teacher_id,
  is_active: Boolean(row.is_active),
  created_at: row.created_at.toISOString(),
  updated_at: iso(row.updated_at),
});

export const toEnrollment = (row: EnrollmentRow): Enrollment => ({
  id: row.id,
  student_id: row.student_id,
  class_id: row.class_id,
  enrolled_at: row.enrolled_at.toISOString(),
});
