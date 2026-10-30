import 'dotenv/config';

const env = process.env;
const isProduction = env.NODE_ENV === 'production' || env.ENVIRONMENT === 'production';

function required(name: string, devDefault: string): string {
  const value = env[name];
  if (value) return value;
  if (isProduction) throw new Error(`Missing required environment variable ${name}`);
  return devDefault;
}

function databaseUrl(): string {
  if (env.DATABASE_URL) return env.DATABASE_URL;
  const user = env.POSTGRES_USER ?? 'postgres';
  const password = required('POSTGRES_PASSWORD', 'postgres');
  const host = env.POSTGRES_SERVER ?? 'localhost';
  const port = env.POSTGRES_PORT ?? '5432';
  const db = env.POSTGRES_DB ?? 'LMS';
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${db}`;
}

const corsOrigins = (env.CORS_ORIGINS ?? 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
if (env.FRONTEND_URL && !corsOrigins.includes(env.FRONTEND_URL)) corsOrigins.push(env.FRONTEND_URL);

const expireMinutes = Number(env.ACCESS_TOKEN_EXPIRE_MINUTES ?? '30');
if (!Number.isFinite(expireMinutes) || expireMinutes <= 0) {
  throw new Error('ACCESS_TOKEN_EXPIRE_MINUTES must be a positive number');
}

// R2 is optional locally; the /files endpoints answer 503 until all four values are set.
const r2 =
  env.R2_ACCOUNT_ID && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY && env.R2_BUCKET
    ? {
        accountId: env.R2_ACCOUNT_ID,
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        bucket: env.R2_BUCKET,
      }
    : null;

export const config = {
  isProduction,
  // OAuth Web client ID; Google sign-in answers 503 until it is set.
  googleClientId: env.GOOGLE_CLIENT_ID ?? null,
  // Vercel sets VERCEL=1; each function instance only needs a couple of connections.
  isServerless: Boolean(env.VERCEL),
  r2,
  port: Number(env.PORT ?? '8000'),
  databaseUrl: databaseUrl(),
  databaseSsl: env.DATABASE_SSL === 'true',
  secretKey: required('SECRET_KEY', 'dev-only-secret-change-me'),
  algorithm: 'HS256' as const,
  accessTokenExpireMinutes: expireMinutes,
  corsOrigins,
};
