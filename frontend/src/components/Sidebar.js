import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  BookOpenIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserGroupIcon,
  VideoCameraIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  AcademicCapIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Classes', href: '/classes', icon: BookOpenIcon },
      { name: 'Assignments', href: '/assignments', icon: DocumentTextIcon },
      { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
      { name: 'Live Sessions', href: '/live-sessions', icon: VideoCameraIcon },
      { name: 'Notes', href: '/notes', icon: AcademicCapIcon },
    ];

    if (user?.role === 'teacher') {
      return [
        ...baseItems,
        { name: 'Students', href: '/students', icon: UserGroupIcon },
        { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
        { name: 'Settings', href: '/settings', icon: CogIcon },
      ];
    }

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { name: 'Users', href: '/users', icon: UserGroupIcon },
        { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
        { name: 'Settings', href: '/settings', icon: CogIcon },
      ];
    }

    // Student role
    return [
      ...baseItems,
      { name: 'Settings', href: '/settings', icon: CogIcon },
    ];
  };

  const navigationItems = getNavigationItems();

  const isActive = (href) => {
    return location.pathname === href;
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 z-40 flex flex-col">      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
          <span className="font-montserrat font-bold text-xl">
            <span className="text-orange-500">N</span>
            <span className="text-gray-800">L</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 space-y-2 px-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <div key={item.name} className="relative group">
              <Link
                to={item.href}
                className={`flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-orange-100 text-orange-600 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                <Icon className="h-6 w-6" />
              </Link>
              
              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.name}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-200 space-y-2">
        {/* Notifications */}
        <div className="relative group">
          <Link
            to="/notifications"
            className="flex items-center justify-center w-14 h-14 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 relative"
          >
            <BellIcon className="h-6 w-6" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full"></div>
          </Link>
          
          <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            Notifications
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </div>

        {/* User Profile */}
        <div className="relative group">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-medium text-sm cursor-pointer hover:shadow-md transition-all duration-200">
            {getInitials(user?.full_name)}
          </div>
          
          <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {user?.full_name || 'User'}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </div>

        {/* Logout */}
        <div className="relative group">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-14 h-14 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
          </button>
          
          <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            Sign Out
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
