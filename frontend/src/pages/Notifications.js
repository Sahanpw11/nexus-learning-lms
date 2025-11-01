import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { 
  BellIcon, 
  CheckIcon, 
  EyeIcon,
  TrashIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const Notifications = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  
  // Base notifications for all users
  const baseNotifications = [
    {
      id: 1,
      type: 'assignment',
      title: 'New Assignment: Mathematics Quiz',
      message: 'A new assignment has been posted for your Mathematics class.',
      time: '2 minutes ago',
      read: false,
      priority: 'medium',
      icon: AcademicCapIcon,
      color: 'text-blue-400'
    },
    {
      id: 2,
      type: 'class',
      title: 'Class Cancelled: Physics Lab',
      message: 'Tomorrow\'s Physics Lab has been cancelled due to equipment maintenance.',
      time: '15 minutes ago',
      read: false,
      priority: 'high',
      icon: ExclamationTriangleIcon,
      color: 'text-red-400'
    },
    {
      id: 3,
      type: 'calendar',
      title: 'Upcoming Event: Parent-Teacher Conference',
      message: 'Parent-Teacher Conference is scheduled for next week.',
      time: '1 hour ago',
      read: true,
      priority: 'low',
      icon: CalendarIcon,
      color: 'text-green-400'
    },
    {
      id: 4,
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2 AM to 4 AM.',
      time: '3 hours ago',
      read: true,
      priority: 'medium',
      icon: InformationCircleIcon,
      color: 'text-yellow-400'
    },
    {
      id: 5,
      type: 'grade',
      title: 'Grade Updated: Chemistry Test',
      message: 'Your Chemistry test has been graded. View your results now.',
      time: '1 day ago',
      read: false,
      priority: 'medium',
      icon: CheckCircleIcon,
      color: 'text-green-400'
    },
    {
      id: 6,
      type: 'collaboration',
      title: 'New Group Assignment',
      message: 'You have been added to a new group for the History project.',      time: '2 days ago',
      read: true,
      priority: 'low',
      icon: UserGroupIcon,
      color: 'text-purple-400'
    },
  ];

  // Admin-specific notifications
  const adminNotifications = [
    {
      id: 7,
      type: 'system',
      title: 'Database Backup Completed',
      message: 'Automated database backup completed successfully at 2:00 AM.',
      time: '6 hours ago',
      read: false,
      priority: 'low',
      icon: InformationCircleIcon,
      color: 'text-blue-400'
    },
    {
      id: 8,
      type: 'user',
      title: 'New User Registration',
      message: '5 new users have registered and are pending approval.',
      time: '1 day ago',
      read: false,
      priority: 'medium',
      icon: UserGroupIcon,
      color: 'text-orange-400'
    },
    {
      id: 9,
      type: 'system',
      title: 'Server Performance Alert',
      message: 'CPU usage has exceeded 80% for the past 2 hours.',
      time: '2 hours ago',
      read: false,
      priority: 'high',
      icon: ExclamationTriangleIcon,
      color: 'text-red-400'
    },
    {
      id: 10,
      type: 'security',
      title: 'Failed Login Attempts',
      message: 'Multiple failed login attempts detected from IP 192.168.1.100.',
      time: '30 minutes ago',
      read: false,
      priority: 'high',
      icon: ExclamationTriangleIcon,
      color: 'text-red-400'
    }
  ];

  // Combine notifications based on role
  const [notifications, setNotifications] = useState(() => {
    if (user?.role === 'admin') {
      return [...baseNotifications, ...adminNotifications];
    }
    return baseNotifications;
  });
  const filterOptions = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'assignment', label: 'Assignments', count: notifications.filter(n => n.type === 'assignment').length },
    { id: 'class', label: 'Classes', count: notifications.filter(n => n.type === 'class').length },
    { id: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length },
    ...(user?.role === 'admin' ? [
      { id: 'security', label: 'Security', count: notifications.filter(n => n.type === 'security').length },
      { id: 'user', label: 'Users', count: notifications.filter(n => n.type === 'user').length },
    ] : [])
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500/50 bg-red-500/10';
      case 'medium': return 'border-orange-500/50 bg-orange-500/10';
      case 'low': return 'border-green-500/50 bg-green-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{backgroundColor:"#fcfcf7"}}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-gradient-radial opacity-30"></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-radial opacity-20"></div>
      
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-12">          {/* Header */}
          <div className="flex items-center justify-between mb-12 animate-slide-up">            <div>              <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-3">
                {user?.role === 'admin' ? 'System ' : ''}<span className="text-orange-500">Notifications</span>
              </h1>
              <p className="text-body text-gray-600">
                {user?.role === 'admin' 
                  ? 'Monitor system alerts and platform activity'
                  : 'Stay updated with your latest activities'
                }
              </p>
            </div>            <div className="flex space-x-4">
              <button
                onClick={markAllAsRead}
                className="px-6 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl text-gray-700 font-medium hover:bg-white/90 hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <CheckIcon className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:shadow-lg hover:transform hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2">
                <BellIcon className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>          {/* Filter Tabs */}
          <div className="flex space-x-2 mb-8 animate-slide-up">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === option.id
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                {option.label}
                <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                  filter === option.id ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {option.count}
                </span>
              </button>
            ))}
          </div>          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-scale">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-lg hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-gray-600 font-light mb-2">Unread</p>
                  <p className="text-4xl font-extralight text-gray-800">{notifications.filter(n => !n.read).length}</p>
                </div>
                <BellIcon className="h-8 w-8 text-orange-500 opacity-60" />
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-lg hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-gray-600 font-light mb-2">High Priority</p>
                  <p className="text-4xl font-extralight text-gray-800">{notifications.filter(n => n.priority === 'high').length}</p>
                </div>
                <ExclamationTriangleIcon className="h-8 w-8 text-orange-500 opacity-60" />
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-lg hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-gray-600 font-light mb-2">Today</p>
                  <p className="text-4xl font-extralight text-gray-800">{notifications.filter(n => n.time.includes('minute') || n.time.includes('hour')).length}</p>
                </div>
                <ClockIcon className="h-8 w-8 text-orange-500 opacity-60" />
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-lg hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-gray-600 font-light mb-2">Total</p>
                  <p className="text-4xl font-extralight text-gray-800">{notifications.length}</p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-orange-500 opacity-60" />
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4 animate-fade-scale">            {filteredNotifications.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 text-center shadow-lg">
                <BellIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No notifications</h3>
                <p className="text-gray-600">You're all caught up! No new notifications to show.</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const Icon = notification.icon;
                return (                  <div
                    key={notification.id}
                    className={`bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 border-l-4 transition-all duration-200 hover:shadow-lg shadow-lg ${
                      !notification.read ? 'bg-white/90' : ''
                    } ${getPriorityColor(notification.priority)}`}
                  ><div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg bg-gray-100 ${notification.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className={`font-semibold ${
                              !notification.read ? 'text-gray-800' : 'text-gray-600'
                            }`}>
                              {notification.title}
                              {!notification.read && (
                                <span className="inline-block w-2 h-2 bg-orange-500 rounded-full ml-2"></span>
                              )}
                            </h4>
                            <p className="text-gray-600 mt-1">{notification.message}</p>                            <div className="flex items-center space-x-4 mt-3">
                              <div className="flex items-center space-x-1 text-gray-500 text-sm">
                                <ClockIcon className="w-4 h-4" />
                                <span>{notification.time}</span>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                notification.priority === 'high' ? 'bg-red-500/20 text-red-600' :
                                notification.priority === 'medium' ? 'bg-orange-500/20 text-orange-600' :
                                'bg-green-500/20 text-green-600'
                              }`}>
                                {notification.priority} priority
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-2 text-gray-500 hover:text-green-500 transition-colors"
                                title="Mark as read"
                              >
                                <EyeIcon className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                              title="Delete notification"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Load More Button */}
          {filteredNotifications.length > 0 && (
            <div className="mt-8 text-center">
              <button className="btn-secondary">
                Load More Notifications
              </button>
            </div>
          )}        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Notifications;
