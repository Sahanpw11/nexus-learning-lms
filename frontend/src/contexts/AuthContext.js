import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);  useEffect(() => {
    const initAuth = () => {
      // Check for existing user data in localStorage first
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');

      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setToken(savedToken);
          setLoading(false);
          return;
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }      // For development: provide a mock user if no saved data exists
      const mockUser = {
        id: 'teacher_1',
        name: 'Dr. John Smith',
        email: 'john.smith@university.edu',
        role: 'teacher'
      };
      
      setUser(mockUser);
      setToken('mock_token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock_token');
      setLoading(false);
    };

    initAuth();
  }, []);  const login = async (credentials) => {
    try {
      // For development: mock authentication
      if (credentials.email && credentials.password) {
        let mockUser;
        
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
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
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
