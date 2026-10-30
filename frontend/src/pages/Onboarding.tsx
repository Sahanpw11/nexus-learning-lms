import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AcademicCapIcon, ArrowRightIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth, type PendingOnboarding } from '../contexts/AuthContext';

type ChosenRole = 'student' | 'teacher';

const roleOptions = [
  { value: 'student' as const, label: 'Student', icon: AcademicCapIcon, description: 'Join classes and access learning materials' },
  { value: 'teacher' as const, label: 'Teacher', icon: UserIcon, description: 'Create and manage classes and assignments' },
];

// First Google sign-in: confirm the name and choose student or teacher before the account is created.
const Onboarding = () => {
  const pending = useLocation().state as PendingOnboarding | null;
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(pending?.fullName ?? '');
  const [role, setRole] = useState<ChosenRole | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Reached without a Google sign-in (e.g. refreshed or typed the URL): start over.
  if (!pending) return <Navigate to="/login" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError('Choose whether you are a student or a teacher');
      return;
    }
    setLoading(true);
    setError('');
    const result = await completeOnboarding({ onboarding_token: pending.onboardingToken, full_name: fullName.trim(), role });
    setLoading(false);
    if (result.success) navigate('/dashboard', { replace: true });
    else setError(result.error ?? '');
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sf flex items-center justify-center p-6" style={{ backgroundColor: '#fcfcf7' }}>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full opacity-20"></div>

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="mb-10">
          <h1 className="text-title font-sf font-light text-gray-800 mb-3">Welcome to Nexus Learning</h1>
          <p className="text-body text-gray-600">
            Signed in as <span className="font-medium text-gray-800">{pending.email}</span>. Tell us a bit about you to finish setting up.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 animate-fade-scale">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-caption animate-slide-up">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="full_name" className="block text-micro text-gray-700 font-medium mb-3 tracking-wider">
                FULL NAME
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                maxLength={120}
                className="w-full px-5 py-4 rounded-xl bg-white border-2 border-gray-300 text-gray-800 placeholder:text-gray-500 text-body font-light focus:outline-none focus:border-orange-500 transition-all duration-200"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <fieldset>
              <legend className="block text-micro text-gray-700 font-medium mb-3 tracking-wider">I AM A</legend>
              <div className="grid grid-cols-1 gap-3">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  const selected = role === option.value;
                  return (
                    <label key={option.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value={option.value}
                        checked={selected}
                        onChange={() => setRole(option.value)}
                        className="sr-only peer"
                      />
                      <div
                        className={`p-4 rounded-xl transition-all duration-200 flex items-start space-x-3 border-2 peer-focus-visible:ring-2 peer-focus-visible:ring-orange-400 ${
                          selected ? 'border-orange-500 bg-orange-50' : 'bg-white border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Icon className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-body font-medium text-gray-800">{option.label}</div>
                          <div className="text-caption text-gray-700 mt-1">{option.description}</div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 px-6 rounded-xl text-body font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Setting up your account...' : 'Continue'}</span>
              {!loading && <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
