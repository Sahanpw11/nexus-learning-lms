import { isAxiosError } from 'axios';
import { filesAPI } from '../../services/api';
import type { ChatAttachment } from '../../../../shared/types';

// Must match the API's allow-list in backend/src/routes/files.ts.
export const ALLOWED_TYPES = [
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
export const MAX_FILE_BYTES = 50 * 1024 * 1024;

export const apiError = (error: unknown, fallback: string) => {
  const detail = isAxiosError<{ detail: unknown }>(error) ? error.response?.data?.detail : undefined;
  return typeof detail === 'string' ? detail : fallback;
};

export const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

export const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const formatListTime = (iso: string) => {
  const date = new Date(iso);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return formatTime(iso);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
};

export const dayLabel = (iso: string) => {
  const label = formatListTime(iso);
  if (label === 'Yesterday') return label;
  return new Date(iso).toDateString() === new Date().toDateString()
    ? 'Today'
    : new Date(iso).toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });
};

export const formatSize = (bytes: number) =>
  bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

// Upload straight to R2 with a signed URL, then hand the key to the message.
export async function uploadFile(file: File): Promise<ChatAttachment> {
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error('This file type cannot be shared');
  if (file.size > MAX_FILE_BYTES) throw new Error('Files can be up to 50 MB');
  const { data } = await filesAPI.uploadUrl({ filename: file.name, content_type: file.type, size: file.size });
  const response = await fetch(data.upload_url, { method: data.method, headers: data.headers, body: file });
  if (!response.ok) throw new Error('Upload failed. Please try again.');
  return { key: data.key, name: file.name, content_type: file.type, size: file.size };
}

// "online" / "last seen today at 10:42" / "last seen 12 Oct", like a phone messenger.
export const presenceLabel = (presence: { online: boolean; last_seen_at: string | null } | undefined) => {
  if (!presence) return '';
  if (presence.online) return 'online';
  if (!presence.last_seen_at) return '';
  const when = formatListTime(presence.last_seen_at);
  if (when === 'Yesterday') return `last seen yesterday at ${formatTime(presence.last_seen_at)}`;
  return when.includes(':') ? `last seen today at ${when}` : `last seen ${when}`;
};
