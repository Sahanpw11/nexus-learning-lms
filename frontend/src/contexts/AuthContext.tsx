import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { isAxiosError } from 'axios';
import type { Credentials, GoogleOnboarding, User, UserCreate, UserRole } from '../../../shared/types';

interface SessionUser {
  // shortcut: the mock-data pages filter by demo ids like "teacher_1"; drop once those pages read the API.
  id: string;
  apiId: number; // the real account id from the API
  name: string;
  full_name: string;
  email: string;
  role: UserRole;
}

interface AuthResult {
  success: boolean;
  error?: string;
  data?: User;
}

export interface PendingOnboarding {
  onboardingToken: string;
  email: string;
  fullName: string;
}

type GoogleResult = { success: true; onboarding?: PendingOnboarding } | { success: false; error: string };

interface AuthContextValue {
  user: SessionUser | null;
  token: string | null;
  loading: boolean;
  login: (credentials: Credentials) => Promise<AuthResult>;
  loginWithGoogle: (credential: string) => Promise<GoogleResult>;
  completeOnboarding: (data: GoogleOnboarding) => Promise<AuthResult>;
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

const toSessionUser = (me: User): SessionUser => ({
  id: `${me.role}_1`,
  apiId: me.id,
  name: me.full_name,
  full_name: me.full_name,
  email: me.email,
  role: me.role,
});

const errorMessage = (error: unknown, fallback: string) =>
  (isAxiosError<{ detail: unknown }>(error) && typeof error.response?.data?.detail === 'string' && error.response.data.detail) ||
  fallback;

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    // Sessions from the old demo login (token "mock_token") are not real accounts; make them sign in again.
    if (savedUser && savedToken && savedToken !== 'mock_token') {
      try {
        setUser(JSON.parse(savedUser) as SessionUser);
        setToken(savedToken);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, []);

  const startSession = async (accessToken: string) => {
    localStorage.setItem('token', accessToken); // the API client reads it for the /auth/me call
    const { data: me } = await authAPI.getMe();
    const sessionUser = toSessionUser(me);
    localStorage.setItem('user', JSON.stringify(sessionUser));
    setToken(accessToken);
    setUser(sessionUser);
  };

  const login = async (credentials: Credentials): Promise<AuthResult> => {
    try {
      const { data } = await authAPI.login(credentials);
      await startSession(data.access_token);
      return { success: true };
    } catch (error) {
      return { success: false, error: errorMessage(error, 'Login failed') };
    }
  };

  const loginWithGoogle = async (credential: string): Promise<GoogleResult> => {
    try {
      const { data } = await authAPI.google(credential);
      if (data.status === 'onboarding') {
        return {
          success: true,
          onboarding: { onboardingToken: data.onboarding_token, email: data.email, fullName: data.full_name },
        };
      }
      await startSession(data.access_token);
      return { success: true };
    } catch (error) {
      return { success: false, error: errorMessage(error, 'Google sign-in failed') };
    }
  };

  const completeOnboarding = async (data: GoogleOnboarding): Promise<AuthResult> => {
    try {
      const { data: tokenData } = await authAPI.completeGoogleOnboarding(data);
      await startSession(tokenData.access_token);
      return { success: true };
    } catch (error) {
      return { success: false, error: errorMessage(error, 'Could not finish setting up your account') };
    }
  };

  const register = async (userData: UserCreate): Promise<AuthResult> => {
    try {
      const response = await authAPI.register(userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: errorMessage(error, 'Registration failed') };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.google?.accounts.id.disableAutoSelect();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    loginWithGoogle,
    completeOnboarding,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
