import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { config } from './config';
import { fromDbRole, pool, type DbRole } from './db';
import { HttpError } from './errors';
import type { UserRole } from '../../shared/types';

export interface UserRow {
  id: number;
  email: string;
  full_name: string;
  hashed_password: string;
  role: DbRole;
  is_active: boolean | null;
  created_at: Date;
  updated_at: Date | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserRow;
    }
  }
}

// bcryptjs reads the $2b$ hashes passlib wrote, so existing passwords keep working.
export const hashPassword = (password: string) => bcrypt.hash(password, 12);
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export function createAccessToken(email: string): string {
  return jwt.sign({ sub: email }, config.secretKey, {
    algorithm: config.algorithm,
    expiresIn: config.accessTokenExpireMinutes * 60,
  });
}

const unauthorized = (detail: string) => new HttpError(401, detail, { 'WWW-Authenticate': 'Bearer' });

async function authenticate(req: Request): Promise<UserRow> {
  const header = req.headers.authorization;
  if (!header) throw new HttpError(403, 'Not authenticated'); // FastAPI HTTPBearer's response
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) throw new HttpError(403, 'Invalid authentication credentials');

  let email: unknown;
  try {
    email = (jwt.verify(token, config.secretKey, { algorithms: [config.algorithm] }) as jwt.JwtPayload).sub;
  } catch {
    throw unauthorized('Invalid authentication credentials');
  }
  if (typeof email !== 'string') throw unauthorized('Invalid authentication credentials');

  const { rows } = await pool.query<UserRow>('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];
  if (!user) throw unauthorized('User not found');
  if (!user.is_active) throw new HttpError(400, 'Inactive user');
  return user;
}

export async function requireUser(req: Request, _res: Response, next: NextFunction) {
  req.user = await authenticate(req);
  next();
}

export const requireRoles =
  (...roles: UserRole[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const user = await authenticate(req);
    if (!roles.includes(fromDbRole(user.role))) throw new HttpError(403, 'Not enough permissions');
    req.user = user;
    next();
  };

export function currentUser(req: Request): UserRow {
  if (!req.user) throw new Error('requireUser must run before this handler');
  return req.user;
}
