export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface UserCreate {
  email: string;
  full_name: string;
  password: string;
  role: UserRole;
}

export type UserUpdate = Partial<Pick<User, 'email' | 'full_name' | 'role' | 'is_active'>>;
export interface Credentials { email: string; password: string }
export interface Token { access_token: string; token_type: 'bearer' }

export interface ClassCreate { name: string; description?: string | null; subject: string }
export interface LearningClass extends ClassCreate {
  id: number;
  teacher_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}
export type ClassUpdate = Partial<ClassCreate & { is_active: boolean }>;
export interface Enrollment {
  id: number;
  student_id: number;
  class_id: number;
  enrolled_at: string;
}
export interface EnrolledStudent {
  id: number;
  email: string;
  full_name: string;
  enrolled_at: string;
}
