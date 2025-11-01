import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial opacity-50"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-radial opacity-30"></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-md animate-slide-right">
            <div className="mb-12">
              <h1 className="text-display font-sf font-extralight mb-6">
                <span className="text-gradient">Reactor</span>
                <br />
                <span className="text-white">Minds</span>
              </h1>
              <p className="text-micro text-text-white-muted font-medium tracking-wider">
                LEARNING MANAGEMENT SYSTEM
              </p>
            </div>
            
            <div className="space-y-6 text-body text-text-white-muted">
              <div className="flex items-start space-x-4">
                <div className="w-1 h-12 bg-gradient-orange rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="text-white font-medium mb-2">Seamless Learning</h3>
                  <p>Experience education like never before with our cutting-edge platform designed for modern learners.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-1 h-12 bg-gradient-orange rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="text-white font-medium mb-2">Interactive Classes</h3>
                  <p>Join live sessions, collaborate with peers, and engage with interactive content in real-time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md animate-slide-up">
            {/* Mobile Branding */}
            <div className="lg:hidden text-center mb-12">
              <h1 className="text-title font-sf font-light mb-3">
                <span className="text-gradient">Reactor Minds</span>
              </h1>
              <p className="text-micro text-text-white-muted font-medium tracking-wider">
                LEARNING MANAGEMENT SYSTEM
              </p>
            </div>

            {/* Welcome Message */}
            <div className="mb-10">
              <h2 className="text-title font-sf font-light text-white mb-3">
                Welcome back
              </h2>
              <p className="text-body text-text-white-muted">
                Sign in to continue your learning journey
              </p>
            </div>

            {/* Login Form */}
            <div className="glass-card rounded-2xl p-8 animate-fade-scale">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-caption animate-slide-up">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-micro text-text-white-muted font-medium mb-3 tracking-wider">
                      EMAIL ADDRESS
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="glass-input w-full px-5 py-4 rounded-xl text-white placeholder:text-text-white-subtle text-body font-light focus:outline-none"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-micro text-text-white-muted font-medium mb-3 tracking-wider">
                      PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="glass-input w-full px-5 py-4 pr-12 rounded-xl text-white placeholder:text-text-white-subtle text-body font-light focus:outline-none"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-white-muted hover:text-white transition-colors duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 px-6 rounded-xl text-body font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:transform hover:-translate-y-0.5 group flex items-center justify-center space-x-2"
                  >
                    <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                    {!loading && (
                      <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-center text-caption text-text-white-muted">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-primary-orange hover:text-primary-orange-light font-medium transition-colors duration-200"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center">
              <p className="text-micro text-text-white-subtle font-light tracking-wide">
                © 2025 REACTOR MINDS — ALL RIGHTS RESERVED
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
