import { randomUUID } from 'node:crypto';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Router } from 'express';
import { z } from 'zod';
import { currentUser, requireUser, type UserRow } from '../auth';
import { config } from '../config';
import { HttpError, parseBody } from '../errors';

// Files go straight between the browser and R2 via short-lived signed URLs,
// so uploads are not limited by Vercel's ~4.5 MB request body cap.
const URL_TTL_SECONDS = 300;
const MAX_FILE_BYTES = 50 * 1024 * 1024;
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'video/mp4',
];

const uploadRequest = z.object({
  filename: z.string().min(1).max(200),
  content_type: z.enum(ALLOWED_TYPES),
  size: z.number().int().positive().max(MAX_FILE_BYTES),
});
const downloadRequest = z.object({ key: z.string().min(1).max(400) });

let client: S3Client | null = null;
function r2() {
  if (!config.r2) throw new HttpError(503, 'File storage is not configured');
  client ??= new S3Client({
    region: 'auto',
    endpoint: `https://${config.r2.accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: { accessKeyId: config.r2.accessKeyId, secretAccessKey: config.r2.secretAccessKey },
  });
  return { client, bucket: config.r2.bucket };
}

// Keys are namespaced by owner: users/<id>/<uuid>-<name>.
const ownerPrefix = (user: UserRow) => `users/${user.id}/`;
const safeName = (filename: string) => filename.replace(/[^A-Za-z0-9._-]+/g, '_').slice(-100);

export const filesRouter = Router();

filesRouter.post('/upload-url', requireUser, async (req, res) => {
  const { filename, content_type, size } = parseBody(uploadRequest, req.body);
  const { client, bucket } = r2();
  const key = `${ownerPrefix(currentUser(req))}${randomUUID()}-${safeName(filename)}`;
  // ContentType and ContentLength are signed, so the browser must upload exactly what was declared.
  const upload_url = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: content_type, ContentLength: size }),
    { expiresIn: URL_TTL_SECONDS },
  );
  res.json({ key, upload_url, method: 'PUT', headers: { 'Content-Type': content_type }, expires_in: URL_TTL_SECONDS });
});

// Callers must check the user may see the file; chat uses this for attachments shared with a conversation.
export async function signedDownloadUrl(key: string, filename?: string) {
  const { client, bucket } = r2();
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      // Strip characters that could break out of the quoted header value.
      ...(filename && { ResponseContentDisposition: `inline; filename="${filename.replace(/["\\\r\n]/g, '_')}"` }),
    }),
    { expiresIn: URL_TTL_SECONDS },
  );
}

export const isOwnFileKey = (user: UserRow, key: string) => key.startsWith(ownerPrefix(user));

filesRouter.post('/download-url', requireUser, async (req, res) => {
  const { key } = parseBody(downloadRequest, req.body);
  const me = currentUser(req);
  if (me.role !== 'ADMIN' && !isOwnFileKey(me, key)) throw new HttpError(403, 'Not authorized to access this file');
  res.json({ download_url: await signedDownloadUrl(key), expires_in: URL_TTL_SECONDS });
});
