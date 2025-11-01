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
  };  return (
    <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full opacity-20"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-15"></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-md animate-slide-right">            <div className="mb-12">              <h1 className="brand-nexus mb-4">
                <span className="text-gradient">Nexus</span>
                <br />
                <span className="text-gray-800">Learning</span>
              </h1>              <p className="brand-reactor-minds text-gray-600">
                <span className="brand-by">by </span>
                <span className="brand-reactor-minds-text">Reactor</span>
                <span className="brand-reactor-minds-text brand-minds"> Minds</span>
              </p>
            </div>          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md animate-slide-up">            {/* Mobile Branding */}            <div className="lg:hidden text-center mb-12">              <h1 className="brand-mobile-nexus mb-3">
                <span className="text-gradient">Nexus Learning</span>
              </h1>              <p className="brand-mobile-reactor-minds text-gray-600">
                <span className="brand-by">by </span>
                <span className="brand-reactor-minds-text">Reactor</span>
                <span className="brand-reactor-minds-text brand-minds"> Minds</span>
              </p>
            </div>

            {/* Welcome Message */}
            <div className="mb-10">
              <h2 className="text-title font-sf font-light text-gray-800 mb-3">
                Welcome back
              </h2>
              <p className="text-body text-gray-600">
                Sign in to continue your learning journey
              </p>
            </div>

            {/* Login Form */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 animate-fade-scale">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-caption animate-slide-up">
                    {error}
                  </div>
                )}                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-micro text-gray-700 font-medium mb-3 tracking-wider">
                      EMAIL ADDRESS
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-gray-300 text-gray-800 placeholder:text-gray-500 text-body font-light focus:outline-none focus:border-orange-500 focus:bg-white transition-all duration-200"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-micro text-gray-700 font-medium mb-3 tracking-wider">
                      PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="w-full px-5 py-4 pr-12 rounded-xl bg-white border-2 border-gray-300 text-gray-800 placeholder:text-gray-500 text-body font-light focus:outline-none focus:border-orange-500 focus:bg-white transition-all duration-200"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                      />                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
              </form>              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-caption text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </div>            {/* Footer */}            <div className="mt-12 text-center">
              <p className="footer-branding text-gray-500">
                <span className="footer-normal">© 2025 NEXUS LEARNING — BY</span>
                <span className="footer-montserrat"> REACTOR</span>
                <span className="footer-montserrat brand-minds"> MINDS</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
