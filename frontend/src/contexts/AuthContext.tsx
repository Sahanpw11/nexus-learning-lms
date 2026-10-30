import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { isAxiosError } from 'axios';
import type { Credentials, User, UserCreate, UserRole } from '../../../shared/types';

interface SessionUser {
  id: number | string;
  name?: string;
  full_name?: string;
  email: string;
  role: UserRole;
}

interface AuthResult {
  success: boolean;
  error?: string;
  data?: User;
}

interface AuthContextValue {
  user: SessionUser | null;
  token: string | null;
  loading: boolean;
  login: (credentials: Credentials) => Promise<AuthResult>;
  register: (userData: UserCreate) => Promise<AuthResult>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);  useEffect(() => {
    const initAuth = () => {
      // Check for existing user data in localStorage first
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');

      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser) as SessionUser;
          setUser(parsedUser);
          setToken(savedToken);
          setLoading(false);
          return;
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }

      // No saved session: stay signed out so protected routes redirect to /login.
      setLoading(false);
    };

    initAuth();
  }, []);  const login = async (credentials: Credentials): Promise<AuthResult> => {
    try {
      // For development: mock authentication
      if (credentials.email && credentials.password) {
        let mockUser: SessionUser;
        
        // Different mock users based on email
        if (credentials.email.includes('teacher')) {
          mockUser = {
            id: 'teacher_1',
            name: 'Dr. John Smith',
            email: credentials.email,
            role: 'teacher'
          };
        } else if (credentials.email.includes('student')) {
          mockUser = {
            id: 'student_1',
            name: 'Alex Johnson',
            email: credentials.email,
            role: 'student'
          };
        } else if (credentials.email.includes('admin')) {
          mockUser = {
            id: 'admin_1',
            name: 'Admin User',
            email: credentials.email,
            role: 'admin'
          };
        } else {
          // Default to teacher for any other email
          mockUser = {
            id: 'teacher_1',
            name: 'Dr. John Smith',
            email: credentials.email,
            role: 'teacher'
          };
        }
        
        localStorage.setItem('token', 'mock_token');
        setToken('mock_token');
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        return { success: true };
      }
      
      return { success: false, error: 'Please enter valid credentials' };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: (isAxiosError<{ detail: string }>(error) && error.response?.data?.detail) || 'Login failed' 
      };
    }
  };

  const register = async (userData: UserCreate): Promise<AuthResult> => {
    try {
      const response = await authAPI.register(userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: (isAxiosError<{ detail: string }>(error) && error.response?.data?.detail) || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
