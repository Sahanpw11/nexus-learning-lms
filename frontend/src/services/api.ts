import axios from 'axios';
import type {
  User, UserCreate, UserUpdate, Credentials, Token, LearningClass,
  ClassCreate, ClassUpdate, Enrollment, EnrolledStudent,
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
    if (error.response?.status === 401) {
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
