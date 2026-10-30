export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface UserCreate {
  email: string;
  full_name: string;
  password: string;
  role: UserRole;
}

export type UserUpdate = Partial<Pick<User, 'email' | 'full_name' | 'role' | 'is_active'>>;
export interface Credentials { email: string; password: string }
export interface Token { access_token: string; token_type: 'bearer' }

export interface ClassCreate { name: string; description?: string | null; subject: string }
export interface LearningClass extends ClassCreate {
  id: number;
  teacher_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}
export type ClassUpdate = Partial<ClassCreate & { is_active: boolean }>;
export interface Enrollment {
  id: number;
  student_id: number;
  class_id: number;
  enrolled_at: string;
}
export interface EnrolledStudent {
  id: number;
  email: string;
  full_name: string;
  enrolled_at: string;
}

export type GoogleSignInResult =
  | { status: 'signed_in'; access_token: string; token_type: 'bearer' }
  | { status: 'onboarding'; onboarding_token: string; email: string; full_name: string };
export interface GoogleOnboarding {
  onboarding_token: string;
  full_name: string;
  role: Exclude<UserRole, 'admin'>;
}

// ---- Chat ----
export type ConversationKind = 'direct' | 'group' | 'class' | 'announcement';
export type MemberRole = 'admin' | 'member';

export interface ChatContact {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
}

export interface ChatAttachment {
  key: string;
  name: string;
  content_type: string;
  size: number;
}

export interface ConversationSummary {
  id: number;
  kind: ConversationKind;
  name: string;
  class_id: number | null;
  community_id: number | null;
  other_user_id: number | null; // direct chats: the other person
  my_role: MemberRole;
  member_count: number;
  unread_count: number;
  typing: string[]; // names of other members typing right now
  can_post: boolean;
  last_message: { body: string | null; attachment_name: string | null; sender_name: string; deleted: boolean; created_at: string } | null;
  last_message_at: string;
}

export interface ConversationMember extends ChatContact {
  member_role: MemberRole;
}

export interface ConversationDetail extends ConversationSummary {
  description: string | null;
  community_name: string | null;
  members: ConversationMember[];
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_name: string;
  body: string | null;
  attachment: Omit<ChatAttachment, 'key'> | null;
  reply_to: { id: number; sender_name: string; body: string | null; deleted: boolean } | null;
  reactions: { emoji: string; count: number; mine: boolean }[];
  read_count: number; // members other than the sender who have read it
  delivered_count: number; // ...whose app has received it (includes those who read it)
  recipients: number; // members other than the sender
  deleted: boolean;
  created_at: string;
}

export interface SendMessage {
  body?: string;
  attachment?: ChatAttachment;
  reply_to_id?: number;
}

export interface CommunitySummary {
  id: number;
  name: string;
  description: string | null;
  announcement_conversation_id: number;
  my_role: MemberRole;
  groups: { id: number; name: string; kind: ConversationKind; member_count: number; is_member: boolean }[];
}

export interface UploadUrl {
  key: string;
  upload_url: string;
  method: 'PUT';
  headers: Record<string, string>;
  expires_in: number;
}

export interface Presence {
  user_id: number;
  online: boolean;
  last_seen_at: string | null;
}

export interface ConversationStatus {
  typing: { id: number; full_name: string }[];
  presence: Presence[];
}

export interface MessageReceipt {
  user_id: number;
  full_name: string;
  delivered: boolean;
  delivered_at: string | null; // null when it happened before receipts were recorded
  read: boolean;
  read_at: string | null;
}
