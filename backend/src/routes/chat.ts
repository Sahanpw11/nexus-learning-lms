import { Router } from 'express';
import type { PoolClient } from 'pg';
import { z } from 'zod';
import type {
  ChatContact,
  ChatMessage,
  CommunitySummary,
  ConversationStatus,
  MessageReceipt,
  ConversationDetail,
  ConversationKind,
  ConversationSummary,
  MemberRole,
} from '../../../shared/types';
import { currentUser, requireRoles, requireUser, type UserRow } from '../auth';
import { fromDbRole, pool, type DbRole } from '../db';
import { HttpError, parseBody, parseId } from '../errors';
import { isOwnFileKey, signedDownloadUrl } from './files';

// Chat is delivered by client polling (Vercel functions can't hold sockets), so every read is a plain query.

const idList = z.array(z.number().int()).min(1).max(200);
const groupCreate = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).optional(),
  member_ids: z.array(z.number().int()).max(200).default([]),
});
const conversationUpdate = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(500).nullable().optional(),
});
const messageCreate = z
  .object({
    body: z.string().trim().max(4000).optional(),
    attachment: z
      .object({
        key: z.string().min(1).max(400),
        name: z.string().min(1).max(200),
        content_type: z.string().min(1).max(200),
        size: z.number().int().positive(),
      })
      .optional(),
    reply_to_id: z.number().int().optional(),
  })
  .refine((m) => Boolean(m.body) || Boolean(m.attachment), { message: 'A message needs text or an attachment' });
const reaction = z.object({ emoji: z.string().min(1).max(16) });
const readUpTo = z.object({ message_id: z.number().int().nonnegative() });
const communityCreate = z.object({ name: z.string().trim().min(1).max(100), description: z.string().trim().max(500).optional() });

export const chatRouter = Router();
chatRouter.use(requireUser);

// "Last seen": any chat request (the app polls while open) counts; write at most every 15 seconds.
const ONLINE_WINDOW_SECONDS = 45;
const TYPING_SECONDS = 6;
chatRouter.use(async (req, _res, next) => {
  await pool.query(
    `INSERT INTO user_presence (user_id, last_seen_at) VALUES ($1, now())
     ON CONFLICT (user_id) DO UPDATE SET last_seen_at = now()
     WHERE user_presence.last_seen_at < now() - interval '15 seconds'`,
    [currentUser(req).id],
  );
  next();
});

// ---------- access rules ----------

const isStaff = (user: UserRow) => user.role === 'ADMIN' || user.role === 'TEACHER';

// Students reach classmates and their own teachers; staff reach every active user.
async function contactsOf(me: UserRow): Promise<ChatContact[]> {
  const sql = isStaff(me)
    ? 'SELECT id, full_name, email, role FROM users WHERE is_active = true AND id <> $1 ORDER BY full_name'
    : `WITH my_classes AS (
         SELECT c.id, c.teacher_id FROM classes c JOIN enrollments e ON e.class_id = c.id
         WHERE e.student_id = $1 AND c.is_active = true)
       SELECT id, full_name, email, role FROM users
       WHERE is_active = true AND id <> $1 AND (
         id IN (SELECT teacher_id FROM my_classes)
         OR id IN (SELECT e.student_id FROM enrollments e WHERE e.class_id IN (SELECT id FROM my_classes)))
       ORDER BY full_name`;
  const { rows } = await pool.query<{ id: number; full_name: string; email: string; role: DbRole }>(sql, [me.id]);
  return rows.map((r) => ({ ...r, role: fromDbRole(r.role) }));
}

async function assertContacts(me: UserRow, ids: number[]) {
  const allowed = new Set((await contactsOf(me)).map((c) => c.id));
  const blocked = ids.filter((id) => id !== me.id && !allowed.has(id));
  if (blocked.length) throw new HttpError(403, 'You can only add people you share a class with');
}

interface Membership {
  id: number;
  kind: ConversationKind;
  name: string | null;
  description: string | null;
  class_id: number | null;
  community_id: number | null;
  role: MemberRole;
  last_read_message_id: number;
}

async function membership(conversationId: number, userId: number, db: Pick<PoolClient, 'query'> = pool): Promise<Membership> {
  const { rows } = await db.query<Membership>(
    `SELECT cv.id, cv.kind, cv.name, cv.description, cv.class_id, cv.community_id, cm.role, cm.last_read_message_id
     FROM conversations cv JOIN conversation_members cm ON cm.conversation_id = cv.id AND cm.user_id = $2
     WHERE cv.id = $1`,
    [conversationId, userId],
  );
  if (!rows[0]) throw new HttpError(404, 'Conversation not found');
  return rows[0];
}

const canPost = (m: Pick<Membership, 'kind' | 'role'>) => m.kind !== 'announcement' || m.role === 'admin';

async function withTransaction<T>(work: (db: PoolClient) => Promise<T>): Promise<T> {
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const result = await work(db);
    await db.query('COMMIT');
    return result;
  } catch (error) {
    await db.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    db.release();
  }
}

// Class chats follow enrollment: create them and add teacher + students whenever a member lists chats.
async function syncClassChats(userId: number) {
  const mine = `SELECT c.id FROM classes c WHERE c.is_active = true
                AND (c.teacher_id = $1 OR c.id IN (SELECT class_id FROM enrollments WHERE student_id = $1))`;
  await pool.query(
    `INSERT INTO conversations (kind, name, class_id, created_by)
     SELECT 'class', c.name, c.id, c.teacher_id FROM classes c WHERE c.id IN (${mine})
     ON CONFLICT (class_id) DO NOTHING`,
    [userId],
  );
  await pool.query(
    `INSERT INTO conversation_members (conversation_id, user_id, role)
     SELECT cv.id, m.user_id, CASE WHEN m.user_id = c.teacher_id THEN 'admin' ELSE 'member' END
     FROM conversations cv JOIN classes c ON c.id = cv.class_id
     CROSS JOIN LATERAL (SELECT c.teacher_id AS user_id UNION SELECT e.student_id FROM enrollments e WHERE e.class_id = c.id) m
     WHERE cv.kind = 'class' AND c.id IN (${mine})
     ON CONFLICT DO NOTHING`,
    [userId],
  );
}

// ---------- delivery, read and presence ----------

// Reading implies delivery; each forward move is kept in message_receipts for "Message info" times.
async function markRead(conversationId: number, userId: number, upTo: number) {
  await pool.query(
    `WITH moved AS (
       UPDATE conversation_members
       SET last_read_message_id = $3, last_delivered_message_id = GREATEST(last_delivered_message_id, $3)
       WHERE conversation_id = $1 AND user_id = $2 AND last_read_message_id < $3
         AND $3 <= (SELECT COALESCE(max(id), 0) FROM messages WHERE conversation_id = $1)
       RETURNING 1)
     INSERT INTO message_receipts (conversation_id, user_id, kind, up_to_message_id)
     SELECT $1, $2, 'read', $3 FROM moved ON CONFLICT DO NOTHING`,
    [conversationId, userId, upTo],
  );
}

// Called whenever the user's app fetches chats or the unread count: everything so far has reached them.
async function markDelivered(userId: number) {
  await pool.query(
    `WITH latest AS (
       SELECT cm.conversation_id, (SELECT max(m.id) FROM messages m WHERE m.conversation_id = cm.conversation_id) AS up_to
       FROM conversation_members cm WHERE cm.user_id = $1),
     moved AS (
       UPDATE conversation_members cm SET last_delivered_message_id = l.up_to
       FROM latest l
       WHERE cm.conversation_id = l.conversation_id AND cm.user_id = $1 AND l.up_to > cm.last_delivered_message_id
       RETURNING cm.conversation_id, l.up_to)
     INSERT INTO message_receipts (conversation_id, user_id, kind, up_to_message_id)
     SELECT conversation_id, $1, 'delivered', up_to FROM moved ON CONFLICT DO NOTHING`,
    [userId],
  );
}

chatRouter.get('/unread', async (req, res) => {
  const me = currentUser(req);
  await markDelivered(me.id);
  const { rows } = await pool.query<{ total: number }>(
    `SELECT count(*)::int AS total FROM conversation_members cm
     JOIN messages m ON m.conversation_id = cm.conversation_id
     WHERE cm.user_id = $1 AND m.id > cm.last_read_message_id AND m.sender_id <> $1 AND m.deleted_at IS NULL`,
    [me.id],
  );
  res.json(rows[0]);
});

chatRouter.post('/conversations/:id/typing', async (req, res) => {
  const id = parseId(req.params.id);
  const me = currentUser(req);
  const { typing } = parseBody(z.object({ typing: z.boolean() }), req.body);
  const m = await membership(id, me.id);
  if (!canPost(m)) throw new HttpError(403, 'Only community admins can post announcements');
  await pool.query(
    `UPDATE conversation_members SET typing_until = CASE WHEN $3 THEN now() + make_interval(secs => $4) END
     WHERE conversation_id = $1 AND user_id = $2`,
    [id, me.id, typing, TYPING_SECONDS],
  );
  res.json({ message: 'ok' });
});

chatRouter.get('/conversations/:id/status', async (req, res) => {
  const id = parseId(req.params.id);
  const me = currentUser(req);
  await membership(id, me.id);
  const { rows } = await pool.query<{ id: number; full_name: string; typing: boolean; last_seen_at: Date | null; online: boolean }>(
    `SELECT u.id, u.full_name, (cm.typing_until > now()) IS TRUE AS typing, p.last_seen_at,
            (p.last_seen_at > now() - make_interval(secs => $3)) IS TRUE AS online
     FROM conversation_members cm JOIN users u ON u.id = cm.user_id
     LEFT JOIN user_presence p ON p.user_id = u.id
     WHERE cm.conversation_id = $1 AND cm.user_id <> $2`,
    [id, me.id, ONLINE_WINDOW_SECONDS],
  );
  const status: ConversationStatus = {
    typing: rows.filter((r) => r.typing).map(({ id: userId, full_name }) => ({ id: userId, full_name })),
    presence: rows.map((r) => ({ user_id: r.id, online: r.online, last_seen_at: r.last_seen_at?.toISOString() ?? null })),
  };
  res.json(status);
});

// ---------- conversation listing ----------

const summarySql = `
  SELECT cv.id, cv.kind, cv.class_id, cv.community_id, cv.description, cv.last_message_at, cm.role AS my_role,
         CASE WHEN cv.kind = 'direct' THEN other.full_name ELSE cv.name END AS name,
         other.id AS other_user_id,
         (SELECT count(*)::int FROM conversation_members x WHERE x.conversation_id = cv.id) AS member_count,
         (SELECT count(*)::int FROM messages m WHERE m.conversation_id = cv.id AND m.id > cm.last_read_message_id
            AND m.sender_id <> cm.user_id AND m.deleted_at IS NULL) AS unread_count,
         COALESCE((SELECT array_agg(tu.full_name ORDER BY tu.full_name) FROM conversation_members t JOIN users tu ON tu.id = t.user_id
                   WHERE t.conversation_id = cv.id AND t.user_id <> cm.user_id AND t.typing_until > now()), '{}') AS typing,
         lm.id AS lm_id, lm.body AS lm_body, lm.attachment_name AS lm_attachment, lm.deleted_at AS lm_deleted,
         lm.created_at AS lm_created_at, lmu.full_name AS lm_sender
  FROM conversation_members cm
  JOIN conversations cv ON cv.id = cm.conversation_id
  LEFT JOIN LATERAL (
    SELECT u.id, u.full_name FROM conversation_members o JOIN users u ON u.id = o.user_id
    WHERE o.conversation_id = cv.id AND o.user_id <> cm.user_id LIMIT 1) other ON cv.kind = 'direct'
  LEFT JOIN LATERAL (SELECT * FROM messages m WHERE m.conversation_id = cv.id ORDER BY m.id DESC LIMIT 1) lm ON true
  LEFT JOIN users lmu ON lmu.id = lm.sender_id
  WHERE cm.user_id = $1`;

interface SummaryRow {
  id: number;
  kind: ConversationKind;
  class_id: number | null;
  community_id: number | null;
  description: string | null;
  last_message_at: Date;
  my_role: MemberRole;
  name: string | null;
  other_user_id: number | null;
  member_count: number;
  unread_count: number;
  typing: string[];
  lm_id: number | null;
  lm_body: string | null;
  lm_attachment: string | null;
  lm_deleted: Date | null;
  lm_created_at: Date | null;
  lm_sender: string | null;
}

const toSummary = (r: SummaryRow): ConversationSummary => ({
  id: r.id,
  kind: r.kind,
  name: r.name ?? 'Conversation',
  class_id: r.class_id,
  community_id: r.community_id,
  other_user_id: r.other_user_id,
  my_role: r.my_role,
  member_count: r.member_count,
  unread_count: r.unread_count,
  typing: r.typing,
  can_post: canPost({ kind: r.kind, role: r.my_role }),
  last_message: r.lm_id
    ? {
        body: r.lm_deleted ? null : r.lm_body,
        attachment_name: r.lm_deleted ? null : r.lm_attachment,
        sender_name: r.lm_sender ?? '',
        deleted: Boolean(r.lm_deleted),
        created_at: r.lm_created_at!.toISOString(),
      }
    : null,
  last_message_at: r.last_message_at.toISOString(),
});

chatRouter.get('/contacts', async (req, res) => {
  res.json(await contactsOf(currentUser(req)));
});

chatRouter.get('/conversations', async (req, res) => {
  const me = currentUser(req);
  await syncClassChats(me.id);
  await markDelivered(me.id);
  const { rows } = await pool.query<SummaryRow>(`${summarySql} ORDER BY cv.last_message_at DESC, cv.id DESC`, [me.id]);
  res.json(rows.map(toSummary));
});

async function detail(conversationId: number, me: UserRow): Promise<ConversationDetail> {
  await membership(conversationId, me.id);
  const { rows } = await pool.query<SummaryRow>(`${summarySql} AND cv.id = $2`, [me.id, conversationId]);
  const members = await pool.query<{ id: number; full_name: string; email: string; role: DbRole; member_role: MemberRole }>(
    `SELECT u.id, u.full_name, u.email, u.role, cm.role AS member_role
     FROM conversation_members cm JOIN users u ON u.id = cm.user_id
     WHERE cm.conversation_id = $1 ORDER BY cm.role, u.full_name`,
    [conversationId],
  );
  const community = rows[0].community_id
    ? (await pool.query<{ name: string }>('SELECT name FROM communities WHERE id = $1', [rows[0].community_id])).rows[0]
    : null;
  return {
    ...toSummary(rows[0]),
    description: rows[0].description,
    community_name: community?.name ?? null,
    members: members.rows.map((m) => ({ ...m, role: fromDbRole(m.role) })),
  };
}

chatRouter.get('/conversations/:id', async (req, res) => {
  res.json(await detail(parseId(req.params.id), currentUser(req)));
});

// ---------- starting chats ----------

chatRouter.post('/direct', async (req, res) => {
  const { user_id } = parseBody(z.object({ user_id: z.number().int() }), req.body);
  const me = currentUser(req);
  if (user_id === me.id) throw new HttpError(400, 'You cannot start a chat with yourself');
  await assertContacts(me, [user_id]);
  const id = await withTransaction(async (db) => {
    // Serialise per pair so two clicks can't create two chats between the same people.
    await db.query('SELECT pg_advisory_xact_lock(hashtext($1))', [`dm:${Math.min(me.id, user_id)}:${Math.max(me.id, user_id)}`]);
    const existing = await db.query<{ id: number }>(
      `SELECT cv.id FROM conversations cv
       JOIN conversation_members a ON a.conversation_id = cv.id AND a.user_id = $1
       JOIN conversation_members b ON b.conversation_id = cv.id AND b.user_id = $2
       WHERE cv.kind = 'direct' LIMIT 1`,
      [me.id, user_id],
    );
    if (existing.rows[0]) return existing.rows[0].id;
    const created = await db.query<{ id: number }>(
      "INSERT INTO conversations (kind, created_by) VALUES ('direct', $1) RETURNING id",
      [me.id],
    );
    await db.query('INSERT INTO conversation_members (conversation_id, user_id) VALUES ($1, $2), ($1, $3)', [
      created.rows[0].id,
      me.id,
      user_id,
    ]);
    return created.rows[0].id;
  });
  res.json(await detail(id, me));
});

chatRouter.post('/groups', async (req, res) => {
  const data = parseBody(groupCreate, req.body);
  const me = currentUser(req);
  const memberIds = [...new Set(data.member_ids.filter((id) => id !== me.id))];
  await assertContacts(me, memberIds);
  const id = await withTransaction(async (db) => {
    const { rows } = await db.query<{ id: number }>(
      "INSERT INTO conversations (kind, name, description, created_by) VALUES ('group', $1, $2, $3) RETURNING id",
      [data.name, data.description ?? null, me.id],
    );
    await db.query("INSERT INTO conversation_members (conversation_id, user_id, role) VALUES ($1, $2, 'admin')", [rows[0].id, me.id]);
    if (memberIds.length) {
      await db.query(
        'INSERT INTO conversation_members (conversation_id, user_id) SELECT $1, unnest($2::int[])',
        [rows[0].id, memberIds],
      );
    }
    return rows[0].id;
  });
  res.json(await detail(id, me));
});

// ---------- managing groups ----------

async function adminOfGroup(conversationId: number, me: UserRow, db: Pick<PoolClient, 'query'> = pool) {
  const m = await membership(conversationId, me.id, db);
  if (m.kind === 'class') throw new HttpError(400, 'Class chat members follow class enrollment');
  if (m.kind !== 'group') throw new HttpError(400, 'Only groups can be changed this way');
  if (m.role !== 'admin') throw new HttpError(403, 'Only group admins can do this');
  return m;
}

chatRouter.patch('/conversations/:id', async (req, res) => {
  const id = parseId(req.params.id);
  const me = currentUser(req);
  await adminOfGroup(id, me);
  const update = parseBody(conversationUpdate, req.body);
  await pool.query(
    `UPDATE conversations SET name = COALESCE($2, name),
       description = CASE WHEN $4 THEN $3 ELSE description END WHERE id = $1`,
    [id, update.name ?? null, update.description ?? null, update.description !== undefined],
  );
  res.json(await detail(id, me));
});

chatRouter.post('/conversations/:id/members', async (req, res) => {
  const id = parseId(req.params.id);
  const me = currentUser(req);
  const { user_ids } = parseBody(z.object({ user_ids: idList }), req.body);
  const group = await adminOfGroup(id, me);
  await assertContacts(me, user_ids);
  await pool.query(
    'INSERT INTO conversation_members (conversation_id, user_id) SELECT $1, unnest($2::int[]) ON CONFLICT DO NOTHING',
    [id, user_ids],
  );
  if (group.community_id) await addToAnnouncements(group.community_id, user_ids);
  res.json(await detail(id, me));
});

chatRouter.put('/conversations/:id/members/:userId', async (req, res) => {
  const id = parseId(req.params.id);
  const userId = parseId(req.params.userId);
  const me = currentUser(req);
  const { role } = parseBody(z.object({ role: z.enum(['admin', 'member']) }), req.body);
  await adminOfGroup(id, me);
  const { rowCount } = await pool.query('UPDATE conversation_members SET role = $3 WHERE conversation_id = $1 AND user_id = $2', [
    id,
    userId,
    role,
  ]);
  if (!rowCount) throw new HttpError(404, 'Member not found');
  await ensureAnAdmin(id);
  res.json(await detail(id, me));
});

// Leaving (yourself) or removing someone (group admins).
chatRouter.delete('/conversations/:id/members/:userId', async (req, res) => {
  const id = parseId(req.params.id);
  const userId = parseId(req.params.userId);
  const me = currentUser(req);
  const m = await membership(id, me.id);
  if (m.kind === 'class') throw new HttpError(400, 'Class chat members follow class enrollment');
  if (m.kind === 'direct') throw new HttpError(400, 'Direct chats cannot be left');
  if (m.kind === 'announcement') throw new HttpError(400, 'Leave the community instead');
  if (userId !== me.id && m.role !== 'admin') throw new HttpError(403, 'Only group admins can remove members');
  const { rowCount } = await pool.query('DELETE FROM conversation_members WHERE conversation_id = $1 AND user_id = $2', [id, userId]);
  if (!rowCount) throw new HttpError(404, 'Member not found');
  await ensureAnAdmin(id);
  res.json({ message: userId === me.id ? 'You left the group' : 'Member removed' });
});

// A group never ends up without an admin while it still has members.
async function ensureAnAdmin(conversationId: number) {
  await pool.query(
    `UPDATE conversation_members SET role = 'admin'
     WHERE conversation_id = $1
       AND NOT EXISTS (SELECT 1 FROM conversation_members WHERE conversation_id = $1 AND role = 'admin')
       AND user_id = (SELECT user_id FROM conversation_members WHERE conversation_id = $1 ORDER BY joined_at, user_id LIMIT 1)`,
    [conversationId],
  );
}

// ---------- messages ----------

const messageSql = `
  SELECT m.id, m.conversation_id, m.sender_id, u.full_name AS sender_name, m.body,
         m.attachment_name, m.attachment_type, m.attachment_size, m.created_at, m.deleted_at,
         r.id AS reply_id, r.body AS reply_body, r.deleted_at AS reply_deleted, ru.full_name AS reply_sender,
         (SELECT count(*)::int FROM conversation_members x
            WHERE x.conversation_id = m.conversation_id AND x.user_id <> m.sender_id AND x.last_read_message_id >= m.id) AS read_count,
         (SELECT count(*)::int FROM conversation_members x
            WHERE x.conversation_id = m.conversation_id AND x.user_id <> m.sender_id AND x.last_delivered_message_id >= m.id) AS delivered_count,
         (SELECT count(*)::int FROM conversation_members x
            WHERE x.conversation_id = m.conversation_id AND x.user_id <> m.sender_id) AS recipients,
         COALESCE((SELECT json_agg(json_build_object('emoji', mr.emoji, 'user_id', mr.user_id))
                   FROM message_reactions mr WHERE mr.message_id = m.id), '[]') AS reactions
  FROM messages m
  JOIN users u ON u.id = m.sender_id
  LEFT JOIN messages r ON r.id = m.reply_to_id
  LEFT JOIN users ru ON ru.id = r.sender_id`;

interface MessageRow {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_name: string;
  body: string | null;
  attachment_name: string | null;
  attachment_type: string | null;
  attachment_size: number | null;
  created_at: Date;
  deleted_at: Date | null;
  reply_id: number | null;
  reply_body: string | null;
  reply_deleted: Date | null;
  reply_sender: string | null;
  read_count: number;
  delivered_count: number;
  recipients: number;
  reactions: { emoji: string; user_id: number }[];
}

function toMessage(r: MessageRow, meId: number): ChatMessage {
  const deleted = Boolean(r.deleted_at);
  const reactions = new Map<string, { emoji: string; count: number; mine: boolean }>();
  for (const { emoji, user_id } of r.reactions) {
    const entry = reactions.get(emoji) ?? { emoji, count: 0, mine: false };
    entry.count += 1;
    entry.mine ||= user_id === meId;
    reactions.set(emoji, entry);
  }
  return {
    id: r.id,
    conversation_id: r.conversation_id,
    sender_id: r.sender_id,
    sender_name: r.sender_name,
    body: deleted ? null : r.body,
    attachment:
      !deleted && r.attachment_name
        ? { name: r.attachment_name, content_type: r.attachment_type ?? 'application/octet-stream', size: r.attachment_size ?? 0 }
        : null,
    reply_to: r.reply_id
      ? { id: r.reply_id, sender_name: r.reply_sender ?? '', body: r.reply_deleted ? null : r.reply_body, deleted: Boolean(r.reply_deleted) }
      : null,
    reactions: [...reactions.values()],
    read_count: r.read_count,
    delivered_count: r.delivered_count,
    recipients: r.recipients,
    deleted,
    created_at: r.created_at.toISOString(),
  };
}

async function messageById(messageId: number, meId: number) {
  const { rows } = await pool.query<MessageRow & { member: boolean }>(
    `${messageSql} WHERE m.id = $1 AND EXISTS (
       SELECT 1 FROM conversation_members cm WHERE cm.conversation_id = m.conversation_id AND cm.user_id = $2)`,
    [messageId, meId],
  );
  if (!rows[0]) throw new HttpError(404, 'Message not found');
  return rows[0];
}

chatRouter.get('/conversations/:id/messages', async (req, res) => {
  const id = parseId(req.params.id);
  const me = currentUser(req);
  await membership(id, me.id);
  const before = req.query.before === undefined ? null : parseId(req.query.before);
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
  const { rows } = await pool.query<MessageRow>(
    `${messageSql} WHERE m.conversation_id = $1 AND ($2::int IS NULL OR m.id < $2) ORDER BY m.id DESC LIMIT $3`,
    [id, before, limit],
  );
  res.json(rows.reverse().map((r) => toMessage(r, me.id)));
});

chatRouter.post('/conversations/:id/messages', async (req, res) => {
  const id = parseId(req.params.id);
  const me = currentUser(req);
  const data = parseBody(messageCreate, req.body);
  const m = await membership(id, me.id);
  if (!canPost(m)) throw new HttpError(403, 'Only community admins can post announcements');
  // Attachments must be files this user uploaded through /files/upload-url.
  if (data.attachment && !isOwnFileKey(me, data.attachment.key)) throw new HttpError(403, 'Attachment must be your own upload');
  if (data.reply_to_id) {
    const reply = await pool.query('SELECT 1 FROM messages WHERE id = $1 AND conversation_id = $2', [data.reply_to_id, id]);
    if (!reply.rowCount) throw new HttpError(400, 'Reply target is not in this conversation');
  }
  const messageId = await withTransaction(async (db) => {
    const { rows } = await db.query<{ id: number }>(
      `INSERT INTO messages (conversation_id, sender_id, body, attachment_key, attachment_name, attachment_type, attachment_size, reply_to_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        id,
        me.id,
        data.body || null,
        data.attachment?.key ?? null,
        data.attachment?.name ?? null,
        data.attachment?.content_type ?? null,
        data.attachment?.size ?? null,
        data.reply_to_id ?? null,
      ],
    );
    await db.query('UPDATE conversations SET last_message_at = now() WHERE id = $1', [id]);
    await db.query(
      `UPDATE conversation_members SET last_read_message_id = $3, last_delivered_message_id = $3, typing_until = NULL
       WHERE conversation_id = $1 AND user_id = $2`,
      [id, me.id, rows[0].id],
    );
    return rows[0].id;
  });
  res.json(toMessage(await messageById(messageId, me.id), me.id));
});

chatRouter.post('/conversations/:id/read', async (req, res) => {
  const id = parseId(req.params.id);
  const me = currentUser(req);
  const { message_id } = parseBody(readUpTo, req.body);
  await membership(id, me.id);
  await markRead(id, me.id, message_id);
  res.json({ message: 'ok' });
});

chatRouter.delete('/messages/:id', async (req, res) => {
  const id = parseId(req.params.id);
  const me = currentUser(req);
  const message = await messageById(id, me.id);
  if (message.sender_id !== me.id) throw new HttpError(403, 'You can only delete your own messages');
  await pool.query(
    `UPDATE messages SET deleted_at = now(), body = NULL, attachment_key = NULL, attachment_name = NULL,
       attachment_type = NULL, attachment_size = NULL WHERE id = $1`,
    [id],
  );
  await pool.query('DELETE FROM message_reactions WHERE message_id = $1', [id]);
  res.json(toMessage(await messageById(id, me.id), me.id));
});

chatRouter.put('/messages/:id/reaction', async (req, res) => {
  const id = parseId(req.params.id);
  const me = currentUser(req);
  const { emoji } = parseBody(reaction, req.body);
  const message = await messageById(id, me.id);
  if (message.deleted_at) throw new HttpError(400, 'Cannot react to a deleted message');
  await pool.query(
    `INSERT INTO message_reactions (message_id, user_id, emoji) VALUES ($1, $2, $3)
     ON CONFLICT (message_id, user_id) DO UPDATE SET emoji = EXCLUDED.emoji`,
    [id, me.id, emoji],
  );
  res.json(toMessage(await messageById(id, me.id), me.id));
});

chatRouter.delete('/messages/:id/reaction', async (req, res) => {
  const id = parseId(req.params.id);
  const me = currentUser(req);
  await messageById(id, me.id);
  await pool.query('DELETE FROM message_reactions WHERE message_id = $1 AND user_id = $2', [id, me.id]);
  res.json(toMessage(await messageById(id, me.id), me.id));
});

// "Message info" for the sender: who received and read it, and when.
chatRouter.get('/messages/:id/receipts', async (req, res) => {
  const id = parseId(req.params.id);
  const me = currentUser(req);
  const message = await messageById(id, me.id);
  if (message.sender_id !== me.id) throw new HttpError(403, 'Only the sender can see message info');
  const { rows } = await pool.query<{
    user_id: number;
    full_name: string;
    delivered: boolean;
    delivered_at: Date | null;
    read: boolean;
    read_at: Date | null;
  }>(
    `SELECT u.id AS user_id, u.full_name,
            cm.last_delivered_message_id >= m.id AS delivered,
            (SELECT min(r.at) FROM message_receipts r WHERE r.conversation_id = m.conversation_id AND r.user_id = cm.user_id
               AND r.up_to_message_id >= m.id) AS delivered_at,
            cm.last_read_message_id >= m.id AS read,
            (SELECT min(r.at) FROM message_receipts r WHERE r.conversation_id = m.conversation_id AND r.user_id = cm.user_id
               AND r.kind = 'read' AND r.up_to_message_id >= m.id) AS read_at
     FROM messages m
     JOIN conversation_members cm ON cm.conversation_id = m.conversation_id AND cm.user_id <> m.sender_id
     JOIN users u ON u.id = cm.user_id
     WHERE m.id = $1
     ORDER BY read_at NULLS LAST, delivered_at NULLS LAST, u.full_name`,
    [id],
  );
  const receipts: MessageReceipt[] = rows.map((r) => ({
    ...r,
    delivered_at: r.delivered_at?.toISOString() ?? null,
    read_at: r.read_at?.toISOString() ?? null,
  }));
  res.json(receipts);
});

chatRouter.get('/messages/:id/attachment', async (req, res) => {
  const id = parseId(req.params.id);
  const me = currentUser(req);
  await messageById(id, me.id); // membership check
  const { rows } = await pool.query<{ attachment_key: string | null; attachment_name: string | null }>(
    'SELECT attachment_key, attachment_name FROM messages WHERE id = $1',
    [id],
  );
  if (!rows[0].attachment_key) throw new HttpError(404, 'This message has no attachment');
  res.json({ download_url: await signedDownloadUrl(rows[0].attachment_key, rows[0].attachment_name ?? undefined) });
});

// ---------- communities ----------

async function addToAnnouncements(communityId: number, userIds: number[], db: Pick<PoolClient, 'query'> = pool) {
  await db.query(
    `INSERT INTO conversation_members (conversation_id, user_id)
     SELECT cv.id, unnest($2::int[]) FROM conversations cv WHERE cv.community_id = $1 AND cv.kind = 'announcement'
     ON CONFLICT DO NOTHING`,
    [communityId, userIds],
  );
}

// Community admins are the admins of its announcements channel.
async function communityRole(communityId: number, userId: number): Promise<{ announcementId: number; role: MemberRole }> {
  const { rows } = await pool.query<{ id: number; role: MemberRole }>(
    `SELECT cv.id, cm.role FROM conversations cv
     JOIN conversation_members cm ON cm.conversation_id = cv.id AND cm.user_id = $2
     WHERE cv.community_id = $1 AND cv.kind = 'announcement'`,
    [communityId, userId],
  );
  if (!rows[0]) throw new HttpError(404, 'Community not found');
  return { announcementId: rows[0].id, role: rows[0].role };
}

async function communityAdmin(communityId: number, me: UserRow) {
  const c = await communityRole(communityId, me.id);
  if (c.role !== 'admin') throw new HttpError(403, 'Only community admins can do this');
  return c;
}

chatRouter.get('/communities', async (req, res) => {
  const me = currentUser(req);
  const { rows } = await pool.query<{ id: number; name: string; description: string | null; announcement_id: number; my_role: MemberRole }>(
    `SELECT co.id, co.name, co.description, cv.id AS announcement_id, cm.role AS my_role
     FROM communities co
     JOIN conversations cv ON cv.community_id = co.id AND cv.kind = 'announcement'
     JOIN conversation_members cm ON cm.conversation_id = cv.id AND cm.user_id = $1
     ORDER BY co.name`,
    [me.id],
  );
  const groups = rows.length
    ? (
        await pool.query<{ id: number; name: string; kind: ConversationKind; community_id: number; member_count: number; is_member: boolean }>(
          `SELECT cv.id, cv.name, cv.kind, cv.community_id,
                  (SELECT count(*)::int FROM conversation_members x WHERE x.conversation_id = cv.id) AS member_count,
                  EXISTS (SELECT 1 FROM conversation_members x WHERE x.conversation_id = cv.id AND x.user_id = $2) AS is_member
           FROM conversations cv WHERE cv.community_id = ANY($1::int[]) AND cv.kind <> 'announcement' ORDER BY cv.name`,
          [rows.map((r) => r.id), me.id],
        )
      ).rows
    : [];
  const result: CommunitySummary[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    announcement_conversation_id: r.announcement_id,
    my_role: r.my_role,
    groups: groups.filter((g) => g.community_id === r.id).map(({ community_id: _, ...g }) => ({ ...g, name: g.name ?? 'Group' })),
  }));
  res.json(result);
});

chatRouter.post('/communities', requireRoles('admin', 'teacher'), async (req, res) => {
  const data = parseBody(communityCreate, req.body);
  const me = currentUser(req);
  const id = await withTransaction(async (db) => {
    const { rows } = await db.query<{ id: number }>(
      'INSERT INTO communities (name, description, created_by) VALUES ($1, $2, $3) RETURNING id',
      [data.name, data.description ?? null, me.id],
    );
    const announcement = await db.query<{ id: number }>(
      "INSERT INTO conversations (kind, name, community_id, created_by) VALUES ('announcement', $1, $2, $3) RETURNING id",
      [data.name, rows[0].id, me.id],
    );
    await db.query("INSERT INTO conversation_members (conversation_id, user_id, role) VALUES ($1, $2, 'admin')", [
      announcement.rows[0].id,
      me.id,
    ]);
    return rows[0].id;
  });
  res.json({ id });
});

chatRouter.post('/communities/:id/groups', async (req, res) => {
  const communityId = parseId(req.params.id);
  const me = currentUser(req);
  const { conversation_id } = parseBody(z.object({ conversation_id: z.number().int() }), req.body);
  await communityAdmin(communityId, me);
  const group = await membership(conversation_id, me.id);
  if (group.kind !== 'group' && group.kind !== 'class') throw new HttpError(400, 'Only groups and class chats can join a community');
  if (group.role !== 'admin') throw new HttpError(403, 'You must be an admin of that group');
  if (group.community_id) throw new HttpError(400, 'That group already belongs to a community');
  await withTransaction(async (db) => {
    await db.query('UPDATE conversations SET community_id = $2 WHERE id = $1', [conversation_id, communityId]);
    const members = await db.query<{ user_id: number }>('SELECT user_id FROM conversation_members WHERE conversation_id = $1', [
      conversation_id,
    ]);
    await addToAnnouncements(communityId, members.rows.map((m) => m.user_id), db);
  });
  res.json({ message: 'Group added to community' });
});

chatRouter.delete('/communities/:id/groups/:conversationId', async (req, res) => {
  const communityId = parseId(req.params.id);
  const conversationId = parseId(req.params.conversationId);
  await communityAdmin(communityId, currentUser(req));
  const { rowCount } = await pool.query(
    "UPDATE conversations SET community_id = NULL WHERE id = $1 AND community_id = $2 AND kind <> 'announcement'",
    [conversationId, communityId],
  );
  if (!rowCount) throw new HttpError(404, 'Group is not in this community');
  res.json({ message: 'Group removed from community' });
});

chatRouter.post('/communities/:id/members', async (req, res) => {
  const communityId = parseId(req.params.id);
  const me = currentUser(req);
  const { user_ids } = parseBody(z.object({ user_ids: idList }), req.body);
  await communityAdmin(communityId, me);
  await assertContacts(me, user_ids);
  await addToAnnouncements(communityId, user_ids);
  res.json({ message: 'Members added' });
});

chatRouter.delete('/communities/:id/members/:userId', async (req, res) => {
  const communityId = parseId(req.params.id);
  const userId = parseId(req.params.userId);
  const me = currentUser(req);
  const { announcementId, role } = await communityRole(communityId, me.id);
  if (userId !== me.id && role !== 'admin') throw new HttpError(403, 'Only community admins can remove members');
  await pool.query('DELETE FROM conversation_members WHERE conversation_id = $1 AND user_id = $2', [announcementId, userId]);
  await ensureAnAdmin(announcementId);
  res.json({ message: userId === me.id ? 'You left the community' : 'Member removed' });
});
