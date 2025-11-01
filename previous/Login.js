import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaSignInAlt
} from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';
import AuthWrapper from './AuthWrapper';
import './Login.css';

const Login = ({ onLogin, switchToRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        email_or_username: formData.username,
        password: formData.password
      });

      if (response.data.access_token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
          // Call onLogin callback
        onLogin(response.data.user, response.data.access_token);
        
        // Force navigation to home page
        window.location.href = '/';
      }
    } catch (error) {
      // Handle common error cases
      if (error.response?.status === 401) {
        setError('Invalid username or password');
      } else if (error.response?.status === 429) {
        setError('Too many login attempts. Please try again later.');
      } else if (!navigator.onLine) {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };return (
    <AuthWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="auth-form-container"
      >
        <div className="auth-form">          <div className="auth-header">            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: '15px' }}
            >
              <FaUser style={{ fontSize: '2rem', color: 'var(--primary-orange)' }} />
            </motion.div>
            <h2>Welcome Back</h2>
            <p>Sign in to access your AI Canvas</p>
          </div>{error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ 
                  duration: 0.4,
                  type: 'spring',
                  stiffness: 100
                }}
                className="error-message"
              >
                {error}
              </motion.div>
            )}

          <form onSubmit={handleSubmit} className="auth-form-fields">
            <div className="form-group">
              <label className="form-label">USERNAME</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">PASSWORD</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>            <button
              type="submit"
              className={`btn btn-primary auth-submit ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              <FaSignInAlt style={{marginRight: '10px', flexShrink: 0}} />
              <span style={{textAlign: 'center', whiteSpace: 'nowrap'}}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </span>
            </button>
          </form>
          
          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <motion.button 
                type="button" 
                className="link-button"
                onClick={switchToRegister}
                whileHover={{ scale: 1.05 }}
              >
                Sign up here
              </motion.button>
            </p>
          </div>
        </div>
      </motion.div>
    </AuthWrapper>
  );
};

export default Login;
