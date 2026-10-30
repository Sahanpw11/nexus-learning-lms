import { Pool } from 'pg';
import { config } from './config';
import type { UserRole } from '../../shared/types';

export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.databaseSsl ? { rejectUnauthorized: false } : undefined,
  max: config.isServerless ? 3 : 10,
});

// The legacy SQLAlchemy schema stores enum member names (ADMIN), the API speaks values (admin).
export type DbRole = 'ADMIN' | 'TEACHER' | 'STUDENT';
export const toDbRole = (role: UserRole) => role.toUpperCase() as DbRole;
export const fromDbRole = (role: DbRole) => role.toLowerCase() as UserRole;

// Mirrors the tables SQLAlchemy's create_all produced; IF NOT EXISTS leaves existing data untouched.
const schema = `
DO $$ BEGIN
  CREATE TYPE userrole AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL,
  full_name VARCHAR NOT NULL,
  hashed_password VARCHAR NOT NULL,
  role userrole NOT NULL,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email ON users (email);
CREATE INDEX IF NOT EXISTS ix_users_id ON users (id);

CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  teacher_id INTEGER NOT NULL REFERENCES users(id),
  subject VARCHAR NOT NULL,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS ix_classes_id ON classes (id);

CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES users(id),
  class_id INTEGER NOT NULL REFERENCES classes(id),
  enrolled_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_enrollments_id ON enrollments (id);

CREATE TABLE IF NOT EXISTS materials (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  file_url VARCHAR NOT NULL,
  file_type VARCHAR NOT NULL,
  file_size INTEGER,
  class_id INTEGER NOT NULL REFERENCES classes(id),
  uploaded_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_materials_id ON materials (id);

CREATE TABLE IF NOT EXISTS assignments (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  max_points INTEGER,
  class_id INTEGER NOT NULL REFERENCES classes(id),
  teacher_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_assignments_id ON assignments (id);

CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER NOT NULL REFERENCES assignments(id),
  student_id INTEGER NOT NULL REFERENCES users(id),
  file_url VARCHAR,
  text_content TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  grade INTEGER,
  feedback TEXT
);
CREATE INDEX IF NOT EXISTS ix_submissions_id ON submissions (id);

CREATE TABLE IF NOT EXISTS live_sessions (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  class_id INTEGER NOT NULL REFERENCES classes(id),
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  meeting_url VARCHAR,
  meeting_id VARCHAR,
  is_recorded BOOLEAN,
  recording_url VARCHAR,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_live_sessions_id ON live_sessions (id);

CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id),
  class_id INTEGER REFERENCES classes(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS ix_notes_id ON notes (id);

CREATE TABLE IF NOT EXISTS calendar_events (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  event_type VARCHAR NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id),
  reference_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_calendar_events_id ON calendar_events (id);

-- Chat (added after the SQLAlchemy era; not part of the legacy schema)
CREATE TABLE IF NOT EXISTS communities (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  kind VARCHAR NOT NULL CHECK (kind IN ('direct', 'group', 'class', 'announcement')),
  name VARCHAR,
  description TEXT,
  class_id INTEGER UNIQUE REFERENCES classes(id),
  community_id INTEGER REFERENCES communities(id),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  last_message_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_community_announcements ON conversations (community_id) WHERE kind = 'announcement';

CREATE TABLE IF NOT EXISTS conversation_members (
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  role VARCHAR NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  last_read_message_id INTEGER NOT NULL DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);
CREATE INDEX IF NOT EXISTS ix_conversation_members_user ON conversation_members (user_id);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  body TEXT,
  attachment_key VARCHAR,
  attachment_name VARCHAR,
  attachment_type VARCHAR,
  attachment_size INTEGER,
  reply_to_id INTEGER REFERENCES messages(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS ix_messages_conversation ON messages (conversation_id, id);

-- Delivery/read history: one row each time a member's delivered or read position moves forward.
ALTER TABLE conversation_members ADD COLUMN IF NOT EXISTS last_delivered_message_id INTEGER NOT NULL DEFAULT 0;
ALTER TABLE conversation_members ADD COLUMN IF NOT EXISTS typing_until TIMESTAMPTZ;
CREATE TABLE IF NOT EXISTS message_receipts (
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  kind VARCHAR NOT NULL CHECK (kind IN ('delivered', 'read')),
  up_to_message_id INTEGER NOT NULL,
  at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id, kind, up_to_message_id)
);
CREATE TABLE IF NOT EXISTS user_presence (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS message_reactions (
  message_id INTEGER NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  emoji VARCHAR(16) NOT NULL,
  PRIMARY KEY (message_id, user_id)
);
`;

export async function initSchema(): Promise<void> {
  // Serialise concurrent boots so two processes don't race on CREATE TYPE.
  const client = await pool.connect();
  try {
    await client.query('SELECT pg_advisory_lock(727001)');
    await client.query(schema);
  } finally {
    await client.query('SELECT pg_advisory_unlock(727001)').catch(() => undefined);
    client.release();
  }
}
