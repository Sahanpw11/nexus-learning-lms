import type { ErrorRequestHandler } from 'express';
import { z } from 'zod';

export class HttpError extends Error {
  constructor(
    public status: number,
    public detail: string,
    public headers: Record<string, string> = {},
  ) {
    super(detail);
  }
}

export const parseBody = <T extends z.ZodType>(schema: T, body: unknown): z.infer<T> => {
  const result = schema.safeParse(body);
  if (!result.success) throw new ValidationError(result.error);
  return result.data;
};

export const parseId = (value: unknown): number => {
  const id = Number(value);
  if (!Number.isInteger(id)) throw new HttpError(422, 'Path parameter must be an integer');
  return id;
};

class ValidationError extends Error {
  constructor(public error: z.ZodError) {
    super('Validation failed');
  }
}

// Keeps FastAPI's {"detail": ...} error shape that the frontend already reads.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.set(err.headers).status(err.status).json({ detail: err.detail });
  } else if (err instanceof ValidationError) {
    res.status(422).json({
      detail: err.error.issues.map((issue) => ({ loc: ['body', ...issue.path], msg: issue.message, type: issue.code })),
    });
  } else if (err?.type === 'entity.parse.failed') {
    res.status(422).json({ detail: 'Request body is not valid JSON' });
  } else if (err?.code === '23505' || err?.code === '23503') {
    res.status(400).json({ detail: 'Database integrity error. Check for duplicate entries or missing references.' });
  } else {
    console.error(err);
    res.status(500).json({ detail: 'Internal server error' });
  }
};
