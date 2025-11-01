import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { 
  ChartBarIcon,
  UsersIcon,
  BookOpenIcon,
  DocumentTextIcon,
  CalendarIcon,
  EyeIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [filter, setFilter] = useState('all');

  // Check if user has permission to view analytics
  if (user?.role === 'student') {
    return (
      <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
        <Sidebar />
        <div className="ml-20 relative z-10">
          <div className="max-w-7xl mx-auto px-8 py-12 text-center">
            <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-3">
              Access <span className="text-gradient">Denied</span>
            </h1>
            <p className="text-body text-gray-600">
              Students do not have access to platform analytics.
            </p>
          </div>
        </div>
      </div>
    );
  }  // Mock analytics data - completely different structure for admin
  const getAllAnalyticsData = () => {
    if (user?.role === 'admin') {
      // Admin sees system-wide analytics
      return {
        systemOverview: {
          totalUsers: 1247,
          activeUsers: 987,
          totalTeachers: 89,
          totalStudents: 1158,
          totalClasses: 156,
          totalAssignments: 2847,
          systemUptime: 99.8,
          storageUsed: 68.2,
          averageSystemLoad: 42.3,
          securityIncidents: 3
        },
        userMetrics: {
          newUsersThisMonth: 156,
          activeUserGrowth: 12.4,
          userRetentionRate: 89.7,
          averageSessionTime: 45.2
        },
        performance: {
          averagePageLoadTime: 1.2,
          serverResponseTime: 180,
          errorRate: 0.02,
          uptime: 99.8
        },
        engagement: {
          totalLogins: 15847,
          assignmentsCompleted: 12450,
          classesAttended: 8965,
          notesCreated: 5678
        },
        financials: {
          monthlyRevenue: 125000,
          yearlyRevenue: 1350000,
          costs: 85000,
          profitMargin: 31.5
        },
        topClasses: [
          { 
            id: 1,
            name: 'Advanced Mathematics', 
            students: 45, 
            engagement: 94, 
            instructor: 'Dr. Sarah Johnson',
            avgGrade: 88.5,
            completionRate: 96
          },
          { 
            id: 2,
            name: 'Physics Fundamentals', 
            students: 38, 
            engagement: 87, 
            instructor: 'Prof. Michael Chen',
            avgGrade: 85.2,
            completionRate: 89
          },
          { 
            id: 3,
            name: 'Chemistry Lab', 
            students: 32, 
            engagement: 91, 
            instructor: 'Dr. Emily Rodriguez',
            avgGrade: 90.1,
            completionRate: 93
          },
          { 
            id: 4,
            name: 'History of Science', 
            students: 28, 
            engagement: 83, 
            instructor: 'Prof. David Wilson',
            avgGrade: 82.7,
            completionRate: 85
          }
        ],
        recentActivity: [
          { 
            id: 1,
            type: 'assignment', 
            title: 'Physics Assignment #5 submitted', 
            user: 'Alex Johnson', 
            time: '2 hours ago',
            status: 'completed'
          },
          { 
            id: 2,
            type: 'class', 
            title: 'New Mathematics class created', 
            user: 'Dr. Sarah Johnson', 
            time: '4 hours ago',
            status: 'active'
          },
          { 
            id: 3,
            type: 'user', 
            title: 'New student enrolled', 
            user: 'Emily Rodriguez', 
            time: '6 hours ago',
            status: 'pending'
          },
          { 
            id: 4,
            type: 'grade', 
            title: 'Chemistry Quiz graded', 
            user: 'Prof. Michael Chen', 
            time: '8 hours ago',
            status: 'completed'
          }
        ]
      };
    }
    
    if (user?.role === 'teacher') {
      // Teachers only see their own class analytics
      return {
        overview: {
          totalUsers: 8, // 8 students assigned to teacher_1
          activeUsers: 6, // Active students in their classes
          totalClasses: 3, // Teacher 1 has 3 classes
          totalAssignments: 6, // Teacher 1 has 6 assignments
          averageGrade: 88.7, // Higher average for this teacher
          attendanceRate: 92.5
        },
        growth: {
          userGrowth: 14.3, // Good growth in student enrollment
          classGrowth: 0, // Teachers typically don't create new classes often
          assignmentGrowth: 25.0, // Active in creating assignments
          gradeImprovement: 5.8, // Students improving
          attendanceGrowth: 2.1, // Positive attendance trend
          engagementGrowth: 18.9
        },
        topClasses: [
          // Only show classes taught by this teacher (teacher_1)
          { 
            id: 1,
            name: 'Calculus II', 
            students: 15, 
            engagement: 94, 
            instructor: user?.name || 'You',
            avgGrade: 90.1,
            completionRate: 96,
            teacherId: user?.id || 'teacher_1'
          },
          { 
            id: 2,
            name: 'Advanced Mathematics', 
            students: 25, 
            engagement: 87, 
            instructor: user?.name || 'You',
            avgGrade: 88.5,
            completionRate: 89,
            teacherId: user?.id || 'teacher_1'
          },
          { 
            id: 3,
            name: 'Physics Fundamentals', 
            students: 18, 
            engagement: 83, 
            instructor: user?.name || 'You',
            avgGrade: 85.2,
            completionRate: 85,
            teacherId: user?.id || 'teacher_1'
          }
        ],
        recentActivity: [
          // Only show activities related to their classes
          { 
            id: 1,
            type: 'assignment', 
            title: 'Alex Johnson submitted Calculus Integration Problems', 
            user: 'Alex Johnson', 
            time: '2 hours ago',
            status: 'completed',
            teacherId: user?.id || 'teacher_1'
          },
          { 
            id: 2,
            type: 'grade', 
            title: 'Graded Physics Lab Report - Pendulum Motion', 
            user: user?.name || 'You', 
            time: '4 hours ago',
            status: 'completed',
            teacherId: user?.id || 'teacher_1'
          },
          { 
            id: 3,
            type: 'assignment', 
            title: 'Created Vector Calculus Applications assignment', 
            user: user?.name || 'You', 
            time: '6 hours ago',
            status: 'active',
            teacherId: user?.id || 'teacher_1'
          },
          { 
            id: 4,
            type: 'user', 
            title: 'Lisa Anderson enrolled in Advanced Mathematics', 
            user: 'Lisa Anderson', 
            time: '1 day ago',
            status: 'pending',
            teacherId: user?.id || 'teacher_1'
          }
        ]
      };
    } else {
      // Admins see full system analytics
      return {
        overview: {
          totalUsers: 1248,
          activeUsers: 987,
          totalClasses: 45,
          totalAssignments: 128,
          averageGrade: 85.2,
          attendanceRate: 92.5
        },
        growth: {
          userGrowth: 12.5,
          classGrowth: 8.3,
          assignmentGrowth: 15.7,
          gradeImprovement: 3.2,
          attendanceGrowth: -2.1,
          engagementGrowth: 18.9
        },
        topClasses: [
          { 
            id: 1,
            name: 'Advanced Mathematics', 
            students: 45, 
            engagement: 94, 
            instructor: 'Dr. Sarah Johnson',
            avgGrade: 88.5,
            completionRate: 96
          },
          { 
            id: 2,
            name: 'Physics Fundamentals', 
            students: 38, 
            engagement: 87, 
            instructor: 'Prof. Michael Chen',
            avgGrade: 85.2,
            completionRate: 89
          },
          { 
            id: 3,
            name: 'Chemistry Lab', 
            students: 32, 
            engagement: 91, 
            instructor: 'Dr. Emily Rodriguez',
            avgGrade: 90.1,
            completionRate: 93
          },
          { 
            id: 4,
            name: 'History of Science', 
            students: 28, 
            engagement: 83, 
            instructor: 'Prof. David Wilson',
            avgGrade: 82.7,
            completionRate: 85
          }
        ],
        recentActivity: [
          { 
            id: 1,
            type: 'assignment', 
            title: 'Physics Assignment #5 submitted', 
            user: 'Alex Johnson', 
            time: '2 hours ago',
            status: 'completed'
          },
          { 
            id: 2,
            type: 'class', 
            title: 'New Mathematics class created', 
            user: 'Dr. Sarah Johnson', 
            time: '4 hours ago',
            status: 'active'
          },
          { 
            id: 3,
            type: 'user', 
            title: 'New student enrolled', 
            user: 'Emily Rodriguez', 
            time: '6 hours ago',
            status: 'pending'
          },
          { 
            id: 4,
            type: 'grade', 
            title: 'Chemistry Quiz graded', 
            user: 'Prof. Michael Chen', 
            time: '8 hours ago',
            status: 'completed'
          }
        ]
      };
    }
  };
  const analyticsData = getAllAnalyticsData();
  const getStatsData = () => {
    // Handle different data structures for admin vs teacher/student
    if (user?.role === 'admin') {
      return {
        total: analyticsData.systemOverview.totalUsers,
        active: analyticsData.systemOverview.activeUsers,
        classes: analyticsData.systemOverview.totalClasses,
        assignments: analyticsData.systemOverview.totalAssignments,
        avgGrade: 0, // Not applicable for admin system overview
        attendance: 0 // Not applicable for admin system overview
      };
    } else {
      return {
        total: analyticsData.overview.totalUsers,
        active: analyticsData.overview.activeUsers,
        classes: analyticsData.overview.totalClasses,
        assignments: analyticsData.overview.totalAssignments,
        avgGrade: analyticsData.overview.averageGrade,
        attendance: analyticsData.overview.attendanceRate
      };
    }
  };
  // Filter classes based on user role and filter criteria
  const filteredClasses = analyticsData.topClasses ? analyticsData.topClasses.filter(classItem => {
    if (filter === 'all') return true;
    if (user?.role === 'teacher') {
      if (filter === 'high-engagement') return classItem.engagement >= 90;
      if (filter === 'needs-attention') return classItem.engagement < 80;
    } else if (user?.role === 'admin') {
      if (filter === 'high-performance') return classItem.engagement >= 90;
      if (filter === 'needs-attention') return classItem.engagement < 80;
    }
    return true;
  }) : [];

  const stats = getStatsData();

  return (
    <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-gradient-radial opacity-30"></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-radial opacity-20"></div>
      
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-12">          {/* Header */}
          <div className="flex items-center justify-between mb-12 animate-slide-up">
            <div>
              <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-3">
                {user?.role === 'teacher' ? 'My ' : 'Platform '}
                <span className="text-gradient">Analytics</span>
              </h1>
              <p className="text-body text-gray-600">
                {user?.role === 'teacher' 
                  ? 'Track your classes performance and student progress' 
                  : 'Track performance and monitor platform usage'
                }
              </p>
            </div>            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
              </select>
              
              <button className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2">
                <DocumentTextIcon className="h-5 w-5" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-fade-scale">            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">
                    {user?.role === 'teacher' ? 'My Students' : 'Total Users'}
                  </p>
                  <p className="text-title font-light text-gray-800">{stats.total}</p>
                </div>
                <UsersIcon className="h-8 w-8 text-orange-500 opacity-60" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">
                    {user?.role === 'teacher' ? 'Active Students' : 'Active Users'}
                  </p>
                  <p className="text-title font-light text-gray-800">{stats.active}</p>
                </div>
                <EyeIcon className="h-8 w-8 text-orange-500 opacity-60" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">
                    {user?.role === 'teacher' ? 'My Classes' : 'Total Classes'}
                  </p>
                  <p className="text-title font-light text-gray-800">{stats.classes}</p>
                </div>
                <BookOpenIcon className="h-8 w-8 text-orange-500 opacity-60" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Assignments</p>
                  <p className="text-title font-light text-gray-800">{stats.assignments}</p>
                </div>
                <DocumentTextIcon className="h-8 w-8 text-orange-500 opacity-60" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Average Grade</p>
                  <p className="text-title font-light text-gray-800">{stats.avgGrade}%</p>
                </div>
                <ChartBarIcon className="h-8 w-8 text-orange-500 opacity-60" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Attendance</p>
                  <p className="text-title font-light text-gray-800">{stats.attendance}%</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-orange-500 opacity-60" />
              </div>
            </div>
          </div>          {/* Conditional Content Based on Role */}
          {user?.role === 'admin' ? (
            /* Admin System Analytics */
            <div className="space-y-8">
              {/* System Performance Metrics */}
              <div>
                <h2 className="text-heading font-montserrat font-extralight text-gray-800 mb-6">
                  System <span className="text-gradient">Performance</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white/50 rounded-xl">
                        <ChartBarIcon className="h-6 w-6 text-blue-700" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-700">{analyticsData.systemOverview.systemUptime}%</div>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">System Uptime</h3>
                    <p className="text-xs text-blue-600">Last 30 days</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white/50 rounded-xl">
                        <ClockIcon className="h-6 w-6 text-green-700" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-700">{analyticsData.performance.averagePageLoadTime}s</div>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">Avg Load Time</h3>
                    <p className="text-xs text-green-600">↓ 15% improvement</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white/50 rounded-xl">
                        <DocumentTextIcon className="h-6 w-6 text-orange-700" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-700">{analyticsData.systemOverview.storageUsed}%</div>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">Storage Used</h3>
                    <p className="text-xs text-orange-600">2.1TB of 3TB</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white/50 rounded-xl">
                        <UserGroupIcon className="h-6 w-6 text-purple-700" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-700">{analyticsData.systemOverview.activeUsers}</div>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">Active Users</h3>
                    <p className="text-xs text-purple-600">↗ 12% this month</p>
                  </div>
                </div>
              </div>

              {/* User Analytics */}
              <div>
                <h2 className="text-heading font-montserrat font-extralight text-gray-800 mb-6">
                  User <span className="text-gradient">Analytics</span>
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass-card rounded-3xl p-8">
                    <h3 className="text-xl font-medium text-gray-800 mb-6">Growth Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                        <span className="text-gray-700">New Users This Month</span>
                        <span className="font-bold text-green-600">+{analyticsData.userMetrics.newUsersThisMonth}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                        <span className="text-gray-700">User Retention Rate</span>
                        <span className="font-bold text-blue-600">{analyticsData.userMetrics.userRetentionRate}%</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                        <span className="text-gray-700">Avg Session Time</span>
                        <span className="font-bold text-purple-600">{analyticsData.userMetrics.averageSessionTime}min</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-3xl p-8">
                    <h3 className="text-xl font-medium text-gray-800 mb-6">Engagement Stats</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                        <span className="text-gray-700">Total Logins</span>
                        <span className="font-bold text-gray-800">{analyticsData.engagement.totalLogins.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                        <span className="text-gray-700">Assignments Completed</span>
                        <span className="font-bold text-gray-800">{analyticsData.engagement.assignmentsCompleted.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                        <span className="text-gray-700">Classes Attended</span>
                        <span className="font-bold text-gray-800">{analyticsData.engagement.classesAttended.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Overview */}
              <div>
                <h2 className="text-heading font-montserrat font-extralight text-gray-800 mb-6">
                  Financial <span className="text-gradient">Overview</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass-card rounded-2xl p-6 border-l-4 border-green-500">
                    <div className="text-sm text-gray-600 mb-2">Monthly Revenue</div>
                    <div className="text-2xl font-bold text-gray-800">${analyticsData.financials.monthlyRevenue.toLocaleString()}</div>
                    <div className="text-xs text-green-600 mt-1">↗ 8% vs last month</div>
                  </div>
                  <div className="glass-card rounded-2xl p-6 border-l-4 border-blue-500">
                    <div className="text-sm text-gray-600 mb-2">Yearly Revenue</div>
                    <div className="text-2xl font-bold text-gray-800">${analyticsData.financials.yearlyRevenue.toLocaleString()}</div>
                    <div className="text-xs text-blue-600 mt-1">↗ 15% vs last year</div>
                  </div>
                  <div className="glass-card rounded-2xl p-6 border-l-4 border-orange-500">
                    <div className="text-sm text-gray-600 mb-2">Monthly Costs</div>
                    <div className="text-2xl font-bold text-gray-800">${analyticsData.financials.costs.toLocaleString()}</div>
                    <div className="text-xs text-orange-600 mt-1">↓ 3% optimized</div>
                  </div>
                  <div className="glass-card rounded-2xl p-6 border-l-4 border-purple-500">
                    <div className="text-sm text-gray-600 mb-2">Profit Margin</div>
                    <div className="text-2xl font-bold text-gray-800">{analyticsData.financials.profitMargin}%</div>
                    <div className="text-xs text-purple-600 mt-1">↗ 2% improvement</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Teacher Analytics (Existing Content) */
            <div>
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center justify-between mb-8 animate-slide-up">
                <div className="flex space-x-2 bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10">
              {user?.role === 'teacher' 
                ? ['all', 'high-engagement', 'needs-attention'].map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === filterType
                          ? 'bg-orange-500 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-white/20'
                      }`}
                    >
                      {filterType === 'all' ? 'My Classes' : 
                       filterType === 'high-engagement' ? 'High Engagement' : 'Needs Attention'}
                    </button>
                  ))
                : ['all', 'high-performance', 'needs-attention'].map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === filterType
                          ? 'bg-orange-500 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-white/20'
                      }`}
                    >
                      {filterType === 'all' ? 'All Classes' : 
                       filterType === 'high-performance' ? 'High Performance' : 'Needs Attention'}
                    </button>
                  ))
              }
            </div>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-scale">
            {filteredClasses.map((classItem, index) => (
              <ClassCard 
                key={classItem.id} 
                classData={classItem} 
                index={index}
              />
            ))}
          </div>

          {/* Recent Activity Section */}
          <div className="mt-12">
            <h2 className="text-heading font-montserrat font-extralight text-gray-800 mb-6">
              Recent <span className="text-gradient">Activity</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">              {analyticsData.recentActivity.map((activity, index) => (
                <ActivityCard key={activity.id} activity={activity} index={index} />
              ))}
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

const ClassCard = ({ classData, index }) => {
  const navigate = useNavigate();
  
  const getEngagementColor = (engagement) => {
    if (engagement >= 90) return 'text-green-700 bg-green-500/15';
    if (engagement >= 80) return 'text-blue-700 bg-blue-500/15';
    if (engagement >= 70) return 'text-yellow-700 bg-yellow-500/15';
    return 'text-red-700 bg-red-500/15';
  };

  const handleViewDetails = () => {
    navigate(`/analytics/class/${classData.id}`, { 
      state: { classData } 
    });
  };

  return (
    <div 
      className="glass-card rounded-2xl p-6 animate-slide-up hover:scale-[1.02] transition-all duration-300 group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-orange-500/20">
          <BookOpenIcon className="h-8 w-8 text-orange-500" />
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-1">
            <span className="text-gray-800 font-bold text-xl">{classData.students}</span>
            <span className="text-gray-600 text-sm">students</span>
          </div>
          <p className="text-gray-600 text-xs">{classData.avgGrade}% avg grade</p>
        </div>
      </div>

      <h3 className="text-gray-800 font-semibold text-lg mb-2 group-hover:text-orange-400 transition-colors">
        {classData.name}
      </h3>
      <p className="text-orange-400 text-sm font-medium mb-3">{classData.instructor}</p>
      <p className="text-gray-600 text-sm mb-4">
        Completion Rate: {classData.completionRate}%
      </p>

      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEngagementColor(classData.engagement)}`}>
          {classData.engagement}% engagement
        </span>
        <span className="text-gray-600 text-xs">
          {classData.students} enrolled
        </span>
      </div>      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600 text-sm">Performance: High</p>
          <button 
            onClick={handleViewDetails}
            className="btn-primary px-4 py-2 rounded-lg text-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

const ActivityCard = ({ activity, index }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'assignment': return DocumentTextIcon;
      case 'class': return BookOpenIcon;
      case 'user': return UsersIcon;
      case 'grade': return ChartBarIcon;
      default: return CalendarIcon;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'assignment': return 'text-blue-700 bg-blue-500/15';
      case 'class': return 'text-green-700 bg-green-500/15';
      case 'user': return 'text-purple-700 bg-purple-500/15';
      case 'grade': return 'text-yellow-700 bg-yellow-500/15';
      default: return 'text-gray-700 bg-gray-500/15';
    }
  };

  const Icon = getActivityIcon(activity.type);

  return (
    <div 
      className="glass-card rounded-xl p-6 animate-slide-up hover:scale-[1.01] transition-all duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${getActivityColor(activity.type)}`}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1">
          <h4 className="text-gray-800 font-medium mb-1">
            {activity.title}
          </h4>
          <p className="text-gray-600 text-sm">
            by {activity.user}
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-gray-600 text-sm">
            {activity.time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
