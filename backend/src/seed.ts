// Creates the tables plus demo admin/teacher/student accounts (replaces setup_db.py).
import { hashPassword } from './auth';
import { initSchema, pool, type DbRole } from './db';

const demoUsers: { email: string; full_name: string; password: string; role: DbRole }[] = [
  { email: 'admin@reactorminds.com', full_name: 'Admin User', password: 'admin123', role: 'ADMIN' },
  { email: 'teacher@example.com', full_name: 'John Teacher', password: 'teacher123', role: 'TEACHER' },
  { email: 'student@example.com', full_name: 'Jane Student', password: 'student123', role: 'STUDENT' },
];

async function main() {
  await initSchema();
  console.log('Database tables ready');

  for (const user of demoUsers) {
    const { rowCount } = await pool.query(
      `INSERT INTO users (email, full_name, hashed_password, role, is_active)
       VALUES ($1, $2, $3, $4, true) ON CONFLICT (email) DO NOTHING`,
      [user.email, user.full_name, await hashPassword(user.password), user.role],
    );
    console.log(rowCount ? `Created ${user.email} / ${user.password}` : `${user.email} already exists`);
  }
  await pool.end();
}

main().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
