// Creates any missing tables; existing tables and data are left untouched. Safe to run on every deploy.
import { initSchema, pool } from './db';

initSchema()
  .then(() => {
    console.log('Database schema is up to date');
    return pool.end();
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
