import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, ArrowRightIcon, UserIcon, AcademicCapIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (result.success) {
      navigate('/login', { 
        state: { message: 'Registration successful! Please sign in.' }
      });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };
  const roleOptions = [
    { value: 'student', label: 'Student', icon: AcademicCapIcon, description: 'Join classes and access learning materials' },
    { value: 'teacher', label: 'Teacher', icon: UserIcon, description: 'Create and manage classes and assignments' },
    { value: 'admin', label: 'Admin', icon: UserGroupIcon, description: 'Full platform administration access' }
  ];
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#fcfcf7' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full opacity-20"></div>
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-15"></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-md animate-slide-right">            <div className="mb-12">
              <h1 className="text-display font-sf font-extralight mb-6">
                <span className="text-gradient">Join</span>
                <br />
                <span className="text-gray-800">Reactor Minds</span>
              </h1>
              <p className="text-micro text-gray-600 font-medium tracking-wider">
                CREATE YOUR ACCOUNT
              </p>
            </div>
            
            <div className="space-y-6 text-body text-gray-700">
              <div className="flex items-start space-x-4">
                <div className="w-1 h-12 bg-gradient-orange rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="text-gray-800 font-medium mb-2">Advanced Learning Tools</h3>
                  <p>Access cutting-edge educational resources and interactive learning experiences.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-1 h-12 bg-gradient-orange rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="text-gray-800 font-medium mb-2">Global Community</h3>
                  <p>Connect with learners and educators from around the world in our vibrant community.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-1 h-12 bg-gradient-orange rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="text-gray-800 font-medium mb-2">Personalized Experience</h3>
                  <p>Tailored learning paths and recommendations based on your goals and progress.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md animate-slide-up">            {/* Mobile Branding */}
            <div className="lg:hidden text-center mb-12">
              <h1 className="text-title font-sf font-light mb-3">
                <span className="text-gradient">Reactor Minds</span>
              </h1>
              <p className="text-micro text-gray-600 font-medium tracking-wider">
                CREATE YOUR ACCOUNT
              </p>
            </div>

            {/* Welcome Message */}
            <div className="mb-10">
              <h2 className="text-title font-sf font-light text-gray-800 mb-3">
                Get started today
              </h2>
              <p className="text-body text-gray-600">
                Create your account and unlock the future of learning
              </p>
            </div>

            {/* Register Form */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 animate-fade-scale">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-caption animate-slide-up">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="full_name" className="block text-micro text-gray-700 font-medium mb-3 tracking-wider">
                      FULL NAME
                    </label>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      required
                      className="glass-input w-full px-5 py-4 rounded-xl text-white placeholder:text-text-white-subtle text-body font-light focus:outline-none"
                      placeholder="Enter your full name"
                      value={formData.full_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-micro text-gray-700 font-medium mb-3 tracking-wider">
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
                    <label htmlFor="role" className="block text-micro text-gray-700 font-medium mb-3 tracking-wider">
                      ACCOUNT TYPE
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {roleOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <label key={option.value} className="cursor-pointer">
                            <input
                              type="radio"
                              name="role"
                              value={option.value}
                              checked={formData.role === option.value}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <div className={`glass-input p-4 rounded-xl transition-all duration-200 flex items-start space-x-3 ${
                              formData.role === option.value 
                                ? 'border-primary-orange bg-primary-orange/10' 
                                : 'hover:bg-white/5'
                            }`}>
                              <IconComponent className="h-5 w-5 text-primary-orange flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <div className="text-body font-medium text-white">{option.label}</div>
                                <div className="text-caption text-gray-700 mt-1">{option.description}</div>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
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
                        className="glass-input w-full px-5 py-4 pr-12 rounded-xl text-white placeholder:text-text-white-subtle text-body font-light focus:outline-none"
                        placeholder="Create a secure password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-white transition-colors duration-200"
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

                  <div>
                    <label htmlFor="confirmPassword" className="block text-micro text-gray-700 font-medium mb-3 tracking-wider">
                      CONFIRM PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        className="glass-input w-full px-5 py-4 pr-12 rounded-xl text-white placeholder:text-text-white-subtle text-body font-light focus:outline-none"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-white transition-colors duration-200"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
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
                    <span>{loading ? 'Creating account...' : 'Create Account'}</span>
                    {!loading && (
                      <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-center text-caption text-gray-700">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-primary-orange hover:text-primary-orange-light font-medium transition-colors duration-200"
                  >
                    Sign in
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

export default Register;
