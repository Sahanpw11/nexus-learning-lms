import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { 
  BookOpenIcon, 
  CalendarIcon, 
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon,
  PlayIcon,
  ChartBarIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  BeakerIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    classes: 0,
    assignments: 0,
    upcomingEvents: 0,
    completedTasks: 0
  });
  // Mock upcoming events data
  const upcomingEvents = [
    {
      id: 1,
      title: 'Physics Assignment Due',
      time: '2h left',
      type: 'assignment',
      priority: 'high',
      date: 'Today, 11:59 PM'
    },    {
      id: 2,
      title: 'Advanced Mathematics Class',
      time: 'Starting soon',
      type: 'class',
      priority: 'medium',
      date: '10:00 AM'
    },
    {
      id: 3,
      title: 'Chemistry Lab Session',
      time: 'In 2 days',
      type: 'session',
      priority: 'medium',
      date: 'Wed, 2:00 PM'
    },
    {
      id: 4,
      title: 'Computer Science Exam',
      time: 'In 3 days',
      type: 'exam',
      priority: 'high',
      date: 'Thu, 2:00 PM'
    },
    {
      id: 5,
      title: 'Literature Essay Submission',
      time: 'In 5 days',
      type: 'assignment',
      priority: 'medium',
      date: 'Sat, 11:59 PM'
    },
    {
      id: 6,
      title: 'Biology Field Trip',
      time: 'Next week',
      type: 'session',
      priority: 'low',
      date: 'Mon, 9:00 AM'
    }
  ];

  const fetchDashboardData = useCallback(async () => {
    // This would normally fetch real data from the API
    // For now, we'll use mock data
    setStats({
      classes: user?.role === 'student' ? 5 : user?.role === 'teacher' ? 3 : 15,
      assignments: user?.role === 'student' ? 8 : user?.role === 'teacher' ? 12 : 45,
      upcomingEvents: 4,
      completedTasks: user?.role === 'student' ? 15 : 25
    });
  }, [user]);

  useEffect(() => {
    // Fetch dashboard data based on user role
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };  const getRoleDashboard = () => {
    if (user?.role === 'student') {      return (
        <>
          <MinimalStatCard 
            title="Classes" 
            value={stats.classes} 
            icon={BookOpenIcon} 
            onClick={() => navigate('/classes')}
          />
          <MinimalStatCard 
            title="Tasks" 
            value={stats.assignments} 
            icon={DocumentTextIcon} 
            onClick={() => navigate('/assignments')}
          />
          <MinimalStatCard 
            title="Events" 
            value={stats.upcomingEvents} 
            icon={CalendarIcon} 
            onClick={() => navigate('/calendar')}
          />
          <MinimalStatCard 
            title="Completed" 
            value={stats.completedTasks} 
            icon={CheckCircleIcon} 
            onClick={() => navigate('/assignments')}
          />
        </>
      );
    }    if (user?.role === 'teacher') {
      return (
        <>
          <MinimalStatCard 
            title="Classes" 
            value={stats.classes} 
            icon={BookOpenIcon} 
            onClick={() => navigate('/classes')}
          />
          <MinimalStatCard 
            title="Assignments" 
            value={stats.assignments} 
            icon={DocumentTextIcon} 
            onClick={() => navigate('/assignments')}
          />
          <MinimalStatCard 
            title="Students" 
            value="45" 
            icon={UserGroupIcon} 
            onClick={() => navigate('/students')}
          />
          <MinimalStatCard 
            title="Sessions" 
            value={stats.upcomingEvents} 
            icon={ClockIcon} 
            onClick={() => navigate('/live-sessions')}
          />
        </>
      );
    }    // Admin dashboard - completely different
    return (
      <>
        <AdminStatCard 
          title="Total Users" 
          value="1,247" 
          subtitle="↗ 12% this month" 
          icon={UserGroupIcon} 
          color="blue" 
          onClick={() => navigate('/users')}
        />
        <AdminStatCard 
          title="Active Classes" 
          value="89" 
          subtitle="↗ 8% this week" 
          icon={BookOpenIcon} 
          color="green" 
          onClick={() => navigate('/classes')}
        />
        <AdminStatCard 
          title="System Health" 
          value="99.2%" 
          subtitle="All systems operational" 
          icon={ChartBarIcon} 
          color="emerald" 
          onClick={() => navigate('/analytics')}
        />
        <AdminStatCard 
          title="Storage Used" 
          value="68%" 
          subtitle="2.1TB of 3TB" 
          icon={BeakerIcon} 
          color="orange" 
          onClick={() => navigate('/settings')}
        />
      </>
    );
  };return (
    <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
      {/* Minimal Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-radial opacity-20"></div>
      
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-20 relative z-10">
        <div className="max-w-6xl mx-auto px-8 py-16">
          {/* Minimal Header */}          <div className="mb-16 animate-slide-up">            <h1 className="text-5xl font-montserrat font-extralight text-gray-800 mb-4">
              {getGreeting()}, <span className="text-gradient">{user?.name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p className="text-lg text-gray-600 font-light max-w-2xl">
              Your learning overview
            </p>
          </div>

          {/* Simplified Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16 animate-fade-scale">
            {getRoleDashboard()}
          </div>          {/* Conditional Content Based on Role */}
          {user?.role === 'admin' ? (
            /* Admin Control Panel */
            <div className="space-y-8 animate-slide-up">
              {/* System Overview Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="glass-card rounded-3xl p-8">
                  <h3 className="text-2xl font-light text-gray-800 mb-6">User Management</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Teachers</span>
                      <span className="font-medium text-gray-800">89</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Students</span>
                      <span className="font-medium text-gray-800">1,158</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600">Pending Approvals</span>
                      <span className="font-medium text-orange-600">12</span>
                    </div>
                  </div>                  <button 
                    onClick={() => navigate('/users')}
                    className="w-full btn-primary py-3 px-6 rounded-2xl text-sm font-medium mt-6"
                  >
                    Manage Users
                  </button>
                </div>

                <div className="glass-card rounded-3xl p-8">
                  <h3 className="text-2xl font-light text-gray-800 mb-6">System Activity</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Active Sessions</span>
                      <span className="font-medium text-green-600">234</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Assignments Due Today</span>
                      <span className="font-medium text-gray-800">47</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600">Server Load</span>
                      <span className="font-medium text-blue-600">68%</span>
                    </div>
                  </div>                  <button 
                    onClick={() => navigate('/analytics')}
                    className="w-full btn-secondary py-3 px-6 rounded-2xl text-sm font-medium mt-6"
                  >
                    View Analytics
                  </button>
                </div>

                <div className="glass-card rounded-3xl p-8">
                  <h3 className="text-2xl font-light text-gray-800 mb-6">Quick Actions</h3>                  <div className="space-y-3">
                    <button 
                      onClick={() => navigate('/users')}
                      className="w-full btn-primary py-3 px-6 rounded-2xl text-sm font-medium text-left"
                    >
                      Add New Teacher
                    </button>
                    <button 
                      onClick={() => navigate('/notifications')}
                      className="w-full btn-secondary py-3 px-6 rounded-2xl text-sm font-medium text-left"
                    >
                      Create Announcement
                    </button>
                    <button 
                      onClick={() => navigate('/analytics')}
                      className="w-full btn-secondary py-3 px-6 rounded-2xl text-sm font-medium text-left"
                    >
                      Generate Reports
                    </button>
                    <button 
                      onClick={() => navigate('/settings')}
                      className="w-full btn-secondary py-3 px-6 rounded-2xl text-sm font-medium text-left"
                    >
                      System Settings
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity & Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card rounded-3xl p-8">
                  <h3 className="text-2xl font-light text-gray-800 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-gray-800 font-medium text-sm">New teacher registered</p>
                        <p className="text-gray-600 text-xs">Dr. Sarah Wilson joined Mathematics department</p>
                        <p className="text-gray-500 text-xs">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-gray-800 font-medium text-sm">System backup completed</p>
                        <p className="text-gray-600 text-xs">Daily backup finished successfully</p>
                        <p className="text-gray-500 text-xs">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-gray-800 font-medium text-sm">Storage warning</p>
                        <p className="text-gray-600 text-xs">System storage is 85% full</p>
                        <p className="text-gray-500 text-xs">6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-8">
                  <h3 className="text-2xl font-light text-gray-800 mb-6">System Alerts</h3>
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <h4 className="font-medium text-red-800">Security Alert</h4>
                      </div>
                      <p className="text-red-700 text-sm">Multiple failed login attempts detected</p>                      <button 
                        onClick={() => navigate('/settings')}
                        className="text-red-600 text-xs font-medium mt-2 hover:underline"
                      >
                        View Details →
                      </button>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <h4 className="font-medium text-yellow-800">Performance</h4>
                      </div>
                      <p className="text-yellow-700 text-sm">Server response time increased</p>                      <button 
                        onClick={() => navigate('/analytics')}
                        className="text-yellow-600 text-xs font-medium mt-2 hover:underline"
                      >
                        Investigate →
                      </button>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <h4 className="font-medium text-green-800">All Clear</h4>
                      </div>
                      <p className="text-green-700 text-sm">All systems operating normally</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Student/Teacher Dashboard */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-slide-up">
            {/* Left Column - Main Content */}
            <div className="space-y-8">
              {/* Today's Focus */}
              <div className="glass-card rounded-3xl p-8">
                <h3 className="text-2xl font-light text-gray-800 mb-6">Today's Focus</h3>                <div className="space-y-4">
                  <FocusItem
                    title="Physics Live Session"
                    time="3:00 PM"
                    status="upcoming"
                    priority="high"
                    type="session"
                    navigate={navigate}
                  />
                  <FocusItem
                    title="Math Assignment"
                    time="Due Tomorrow"
                    status="pending"
                    priority="medium"
                    type="assignment"
                    navigate={navigate}
                  />
                  <FocusItem
                    title="Chemistry Notes"
                    time="Review"
                    status="optional"
                    priority="low"
                    type="notes"
                    navigate={navigate}
                  />
                </div>
              </div>

              {/* Quick Progress */}
              <div className="glass-card rounded-3xl p-8">
                <h3 className="text-2xl font-light text-gray-800 mb-6">Weekly Progress</h3>
                <div className="space-y-6">
                  <ProgressBar label="Assignments" value={67} total="8/12" />
                  <ProgressBar label="Attendance" value={83} total="5/6" />
                </div>
              </div>
            </div>

            {/* Right Column - Quick Actions & Updates */}
            <div className="space-y-8">              {/* Essential Actions */}
              <div className="glass-card rounded-3xl p-8">
                <h3 className="text-2xl font-light text-gray-800 mb-6">Quick Actions</h3>                <div className="space-y-4">
                  <button 
                    onClick={() => navigate('/live-sessions')}
                    className="w-full btn-primary py-4 px-6 rounded-2xl text-base font-medium flex items-center justify-center space-x-3 hover:transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <PlayIcon className="h-5 w-5" />
                    <span>Join Live Session</span>
                  </button>
                  <button 
                    onClick={() => navigate('/assignments')}
                    className="w-full glass-input py-4 px-6 rounded-2xl text-base font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  >
                    View Assignments
                  </button>
                </div>
              </div>              {/* Upcoming Events */}
              <div className="glass-card rounded-3xl p-8">
                <h3 className="text-2xl font-light text-gray-800 mb-6">Upcoming Events</h3>                <div className="space-y-4">
                  {upcomingEvents.slice(0, 3).map((event) => (
                    <UpcomingEventItem
                      key={event.id}
                      title={event.title}
                      time={event.time}
                      date={event.date}
                      type={event.type}
                      priority={event.priority}
                      navigate={navigate}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Minimal Component Definitions
const MinimalStatCard = ({ title, value, icon: Icon, onClick }) => (
  <div 
    className="glass-card rounded-3xl p-8 hover:transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-lg text-gray-600 font-light mb-2">{title}</p>
        <p className="text-4xl font-extralight text-gray-800">{value}</p>
      </div>
      <Icon className="h-8 w-8 text-orange-500 opacity-60" />
    </div>
  </div>
);

const FocusItem = ({ title, time, status, priority, type, navigate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-orange-700 bg-orange-500/10';
      case 'pending': return 'text-blue-700 bg-blue-500/10';
      case 'optional': return 'text-gray-700 bg-gray-500/10';
      default: return 'text-gray-700 bg-gray-500/10';
    }
  };

  const getPriorityDot = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleClick = () => {
    switch (type) {
      case 'assignment':
        navigate('/assignments');
        break;
      case 'session':
        navigate('/live-sessions');
        break;
      case 'notes':
        navigate('/notes');
        break;
      case 'class':
        navigate('/classes');
        break;
      default:
        navigate('/calendar');
        break;
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-100/50 transition-all duration-200 cursor-pointer hover:scale-[1.02]"
    >
      <div className="flex items-center space-x-4">
        <div className={`w-3 h-3 rounded-full ${getPriorityDot(priority)}`}></div>
        <div>
          <p className="text-lg font-light text-gray-800">{title}</p>
          <p className="text-sm text-gray-600">{time}</p>
        </div>
      </div>      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {status}
      </span>
    </div>
  );
};

const ProgressBar = ({ label, value, total }) => (  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-lg text-gray-600 font-light">{label}</span>
      <span className="text-lg text-gray-800 font-light">{total}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div 
        className="bg-gradient-to-r from-primary-orange to-orange-600 h-3 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const UpcomingEventItem = ({ title, time, date, type, priority, navigate }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'assignment': return PencilSquareIcon;
      case 'class': return AcademicCapIcon;
      case 'session': 
      case 'exam': return BeakerIcon;
      default: return CalendarIcon;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'assignment': return 'text-blue-700';
      case 'class': return 'text-green-700';
      case 'session': return 'text-purple-700';
      case 'exam': return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  const getPriorityIndicator = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleClick = () => {
    switch (type) {
      case 'assignment':
        navigate('/assignments');
        break;
      case 'class':
        navigate('/classes');
        break;
      case 'session':
        navigate('/live-sessions');
        break;
      case 'exam':
        navigate('/calendar');
        break;
      default:
        navigate('/calendar');
        break;
    }
  };

  const TypeIcon = getTypeIcon(type);

  return (
    <div 
      onClick={handleClick}
      className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100 cursor-pointer hover:scale-[1.02]"
    >
      <div className={`p-2 rounded-lg bg-gray-100 ${getTypeColor(type)}`}>
        <TypeIcon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <h4 className="text-base font-medium text-gray-800">{title}</h4>
          <div className={`w-2 h-2 rounded-full ${getPriorityIndicator(priority)}`}></div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center space-x-1">
            <ClockIcon className="h-3 w-3" />
            <span>{time}</span>          </span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

// Admin-specific stat card with enhanced styling
const AdminStatCard = ({ title, value, subtitle, icon: Icon, color, onClick }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'blue': return 'from-blue-50 to-blue-100 border-blue-200 text-blue-700';
      case 'green': return 'from-green-50 to-green-100 border-green-200 text-green-700';
      case 'emerald': return 'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700';
      case 'orange': return 'from-orange-50 to-orange-100 border-orange-200 text-orange-700';
      default: return 'from-gray-50 to-gray-100 border-gray-200 text-gray-700';
    }
  };

  return (
    <div 
      className={`bg-gradient-to-br ${getColorClasses(color)} border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/50 rounded-xl">
          <Icon className="h-6 w-6" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
      <div>
        <h3 className="font-medium text-gray-800 mb-1">{title}</h3>
        <p className="text-xs opacity-75">{subtitle}</p>
      </div>
    </div>
  );
};

export default Dashboard;
