import cors from 'cors';
import express from 'express';
import { config } from './config';
import { errorHandler } from './errors';
import { authRouter } from './routes/auth';
import { classesRouter } from './routes/classes';
import { filesRouter } from './routes/files';
import { usersRouter } from './routes/users';

// Replaces FastAPI's generated /docs page with a plain endpoint index.
const endpoints = [
  'POST /auth/register',
  'POST /auth/login',
  'GET /auth/me',
  'POST /auth/create-admin (admin)',
  'GET /users/ (admin)',
  'GET /users/teachers/all',
  'GET /users/students/all (admin, teacher)',
  'GET /users/:id',
  'PUT /users/:id',
  'DELETE /users/:id (admin)',
  'POST /classes/ (admin, teacher)',
  'GET /classes/',
  'GET /classes/:id',
  'PUT /classes/:id',
  'DELETE /classes/:id (admin, teacher)',
  'POST /classes/:id/enroll (admin, teacher)',
  'GET /classes/:id/students (admin, teacher)',
  'POST /files/upload-url (signed R2 PUT, owner-scoped key)',
  'POST /files/download-url (own files, or any for admin)',
];

export function createApp() {
  const app = express();
  // Deployed behind /api on the frontend's domain; local tools may call the bare paths.
  app.use((req, _res, next) => {
    if (req.url === '/api' || req.url.startsWith('/api/') || req.url.startsWith('/api?')) req.url = req.url.slice(4) || '/';
    next();
  });
  app.use(cors({ origin: config.corsOrigins, credentials: true }));
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({
      message: 'Welcome to Nexus Learning API',
      version: '1.0.0',
      docs: '/docs',
      status: 'active',
    });
  });
  app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'Nexus Learning' });
  });
  app.get('/docs', (_req, res) => {
    res.json({ title: 'Nexus Learning API', auth: 'Authorization: Bearer <token>', endpoints });
  });

  app.use('/auth', authRouter);
  app.use('/users', usersRouter);
  app.use('/classes', classesRouter);
  app.use('/files', filesRouter);

  app.use((_req, res) => {
    res.status(404).json({ detail: 'Not Found' });
  });
  app.use(errorHandler);
  return app;
}
