import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon, 
  BookOpenIcon, 
  CalendarIcon, 
  DocumentTextIcon,
  UserGroupIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Classes', href: '/classes', icon: BookOpenIcon },
      { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    ];

    if (user?.role === 'student') {
      return [
        ...baseItems,
        { name: 'My Notes', href: '/notes', icon: DocumentTextIcon },
      ];
    }

    if (user?.role === 'teacher') {
      return [
        ...baseItems,
        { name: 'Assignments', href: '/assignments', icon: DocumentTextIcon },
        { name: 'Students', href: '/students', icon: UserGroupIcon },
      ];
    }

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { name: 'Users', href: '/users', icon: UserGroupIcon },
        { name: 'Settings', href: '/settings', icon: CogIcon },
      ];
    }

    return baseItems;
  };

  const isActiveRoute = (href) => {
    return location.pathname === href;
  };

  return (
    <nav className="glass-card border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
      <div className="container-ai">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="flex items-center">              <div className="text-title font-sf font-light">
                <span className="text-gradient">Nexus</span>
                <span className="text-white ml-2">Learning</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-micro text-text-white-muted font-medium tracking-wider border-l border-white/20 pl-3">
                BY REACTOR MINDS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {getNavItems().map((item) => {
              const IconComponent = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-primary-orange/10 text-primary-orange border border-primary-orange/20' 
                      : 'text-text-white-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-caption font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <div className="text-caption font-medium text-white">
                  {user?.full_name?.split(' ')[0]}
                </div>
                <div className="text-micro text-text-white-muted capitalize">
                  {user?.role}
                </div>
              </div>
              <div className="w-10 h-10 bg-gradient-orange rounded-xl flex items-center justify-center text-white text-caption font-medium">
                {user?.full_name?.charAt(0)?.toUpperCase()}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="btn-secondary px-4 py-2 rounded-xl flex items-center space-x-2 text-caption"
              title="Sign out"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl glass-input"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5 text-white" />
              ) : (
                <Bars3Icon className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-6 animate-slide-up">
            <div className="space-y-3">
              {getNavItems().map((item) => {
                const IconComponent = item.icon;
                const isActive = isActiveRoute(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary-orange/10 text-primary-orange border border-primary-orange/20' 
                        : 'text-text-white-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="text-body font-medium">{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile User Info */}
              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="flex items-center space-x-3 px-4 py-2">
                  <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center text-white text-body font-medium">
                    {user?.full_name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <div className="text-body font-medium text-white">
                      {user?.full_name}
                    </div>
                    <div className="text-caption text-text-white-muted capitalize">
                      {user?.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
