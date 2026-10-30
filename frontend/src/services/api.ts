import axios from 'axios';
import type {
  User, UserCreate, UserUpdate, Credentials, Token, LearningClass,
  ClassCreate, ClassUpdate, Enrollment, EnrolledStudent, GoogleSignInResult, GoogleOnboarding,
  ChatContact, ChatMessage, CommunitySummary, ConversationDetail, ConversationStatus, ConversationSummary, MemberRole,
  MessageReceipt, SendMessage, UploadUrl,
} from '../../../shared/types';

// Same-origin by default: Vercel serves the API at /api, and the dev server proxies /api to the backend.
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // A 401 from a sign-in attempt is a wrong password or Google token, not an expired session.
    const isSignIn = ['/auth/login', '/auth/google', '/auth/google/complete'].includes(error.config?.url ?? '');
    if (error.response?.status === 401 && !isSignIn) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: Credentials) => api.post<Token>('/auth/login', credentials),
  register: (userData: UserCreate) => api.post<User>('/auth/register', userData),
  getMe: () => api.get<User>('/auth/me'),
  google: (credential: string) => api.post<GoogleSignInResult>('/auth/google', { credential }),
  completeGoogleOnboarding: (data: GoogleOnboarding) => api.post<Token>('/auth/google/complete', data),
  createAdmin: (userData: UserCreate) => api.post<User>('/auth/create-admin', userData),
};

export const usersAPI = {
  getAll: () => api.get<User[]>('/users/'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  update: (id: number, userData: UserUpdate) => api.put<User>(`/users/${id}`, userData),
  delete: (id: number) => api.delete<{ message: string }>(`/users/${id}`),
  getTeachers: () => api.get<User[]>('/users/teachers/all'),
  getStudents: () => api.get<User[]>('/users/students/all'),
};

export const classesAPI = {
  getAll: () => api.get<LearningClass[]>('/classes/'),
  getById: (id: number) => api.get<LearningClass>(`/classes/${id}`),
  create: (classData: ClassCreate) => api.post<LearningClass>('/classes/', classData),
  update: (id: number, classData: ClassUpdate) => api.put<LearningClass>(`/classes/${id}`, classData),
  delete: (id: number) => api.delete<{ message: string }>(`/classes/${id}`),
  enrollStudent: (classId: number, studentData: { student_id: number }) => api.post<Enrollment>(`/classes/${classId}/enroll`, studentData),
  getStudents: (classId: number) => api.get<EnrolledStudent[]>(`/classes/${classId}/students`),
};

export default api;

export const filesAPI = {
  uploadUrl: (file: { filename: string; content_type: string; size: number }) => api.post<UploadUrl>('/files/upload-url', file),
};

export const chatAPI = {
  contacts: () => api.get<ChatContact[]>('/chat/contacts'),
  conversations: () => api.get<ConversationSummary[]>('/chat/conversations'),
  conversation: (id: number) => api.get<ConversationDetail>(`/chat/conversations/${id}`),
  startDirect: (userId: number) => api.post<ConversationDetail>('/chat/direct', { user_id: userId }),
  createGroup: (data: { name: string; description?: string; member_ids: number[] }) => api.post<ConversationDetail>('/chat/groups', data),
  updateGroup: (id: number, data: { name?: string; description?: string | null }) => api.patch<ConversationDetail>(`/chat/conversations/${id}`, data),
  addMembers: (id: number, userIds: number[]) => api.post<ConversationDetail>(`/chat/conversations/${id}/members`, { user_ids: userIds }),
  setMemberRole: (id: number, userId: number, role: MemberRole) => api.put<ConversationDetail>(`/chat/conversations/${id}/members/${userId}`, { role }),
  removeMember: (id: number, userId: number) => api.delete(`/chat/conversations/${id}/members/${userId}`),
  messages: (id: number, before?: number) => api.get<ChatMessage[]>(`/chat/conversations/${id}/messages`, { params: { before, limit: 50 } }),
  send: (id: number, message: SendMessage) => api.post<ChatMessage>(`/chat/conversations/${id}/messages`, message),
  markRead: (id: number, messageId: number) => api.post(`/chat/conversations/${id}/read`, { message_id: messageId }),
  unread: () => api.get<{ total: number }>('/chat/unread'),
  typing: (id: number, typing: boolean) => api.post(`/chat/conversations/${id}/typing`, { typing }),
  status: (id: number) => api.get<ConversationStatus>(`/chat/conversations/${id}/status`),
  receipts: (messageId: number) => api.get<MessageReceipt[]>(`/chat/messages/${messageId}/receipts`),
  deleteMessage: (messageId: number) => api.delete<ChatMessage>(`/chat/messages/${messageId}`),
  react: (messageId: number, emoji: string) => api.put<ChatMessage>(`/chat/messages/${messageId}/reaction`, { emoji }),
  unreact: (messageId: number) => api.delete<ChatMessage>(`/chat/messages/${messageId}/reaction`),
  attachmentUrl: (messageId: number) => api.get<{ download_url: string }>(`/chat/messages/${messageId}/attachment`),
  communities: () => api.get<CommunitySummary[]>('/chat/communities'),
  createCommunity: (data: { name: string; description?: string }) => api.post<{ id: number }>('/chat/communities', data),
  addGroupToCommunity: (communityId: number, conversationId: number) => api.post(`/chat/communities/${communityId}/groups`, { conversation_id: conversationId }),
  removeGroupFromCommunity: (communityId: number, conversationId: number) => api.delete(`/chat/communities/${communityId}/groups/${conversationId}`),
  addCommunityMembers: (communityId: number, userIds: number[]) => api.post(`/chat/communities/${communityId}/members`, { user_ids: userIds }),
  leaveCommunity: (communityId: number, userId: number) => api.delete(`/chat/communities/${communityId}/members/${userId}`),
};
