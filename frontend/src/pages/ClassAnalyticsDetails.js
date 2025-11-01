import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {
  ArrowLeftIcon,
  BookOpenIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const ClassAnalyticsDetails = () => {
  const { classId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get class data from location state or fetch it
    if (location.state?.classData) {
      setClassData(location.state.classData);
      setLoading(false);
    } else {
      // Fetch class data by ID (mock implementation)
      fetchClassData(classId);
    }
  }, [classId, location.state]);

  const fetchClassData = (id) => {
    // Mock implementation - in real app, fetch from API
    const mockClassData = {
      1: {
        id: 1,
        name: 'Calculus II',
        students: 15,
        engagement: 94,
        instructor: 'Dr. John Smith',
        avgGrade: 90.1,
        completionRate: 96,
        schedule: 'MWF 10:00-11:00 AM',
        room: 'Math Building 201',
        description: 'Advanced calculus covering integration techniques, sequences, and series.'
      },
      2: {
        id: 2,
        name: 'Advanced Mathematics',
        students: 25,
        engagement: 87,
        instructor: 'Dr. John Smith',
        avgGrade: 88.5,
        completionRate: 89,
        schedule: 'TTh 2:00-3:30 PM',
        room: 'Science Building 105',
        description: 'Higher-level mathematical concepts including linear algebra and differential equations.'
      },
      3: {
        id: 3,
        name: 'Physics Fundamentals',
        students: 18,
        engagement: 83,
        instructor: 'Dr. John Smith',
        avgGrade: 85.2,
        completionRate: 85,
        schedule: 'MWF 1:00-2:00 PM',
        room: 'Physics Lab 301',
        description: 'Introduction to fundamental physics principles including mechanics and thermodynamics.'
      }
    };

    setClassData(mockClassData[id] || null);
    setLoading(false);
  };

  // Mock detailed analytics data
  const getDetailedAnalytics = () => {
    return {
      recentPerformance: [
        { week: 'Week 1', avgGrade: 88, attendance: 95, engagement: 92 },
        { week: 'Week 2', avgGrade: 89, attendance: 92, engagement: 88 },
        { week: 'Week 3', avgGrade: 91, attendance: 97, engagement: 94 },
        { week: 'Week 4', avgGrade: 90, attendance: 94, engagement: 91 }
      ],
      studentPerformance: [
        { name: 'Sarah Johnson', grade: 'A', attendance: 100, engagement: 95, submissions: '12/12' },
        { name: 'Michael Chen', grade: 'A-', attendance: 95, engagement: 92, submissions: '11/12' },
        { name: 'Emma Davis', grade: 'B+', attendance: 88, engagement: 85, submissions: '10/12' },
        { name: 'Alex Rodriguez', grade: 'B', attendance: 92, engagement: 78, submissions: '9/12' },
        { name: 'Lisa Thompson', grade: 'A', attendance: 98, engagement: 96, submissions: '12/12' }
      ],
      assignments: [
        { name: 'Problem Set 1', avgGrade: 92, submitted: 15, total: 15, dueDate: '2025-06-01' },
        { name: 'Midterm Exam', avgGrade: 88, submitted: 14, total: 15, dueDate: '2025-06-08' },
        { name: 'Problem Set 2', avgGrade: 94, submitted: 13, total: 15, dueDate: '2025-06-15' },
        { name: 'Final Project', avgGrade: 0, submitted: 5, total: 15, dueDate: '2025-06-25' }
      ],
      attendanceData: {
        present: 14,
        absent: 1,
        late: 0,
        trend: '+2.1%'
      },
      engagementMetrics: {
        activeParticipation: 89,
        questionAsked: 23,
        resourceAccess: 156,
        forumPosts: 45
      }
    };
  };

  const analytics = getDetailedAnalytics();

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
        <Sidebar />
        <div className="ml-20 relative z-10">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading class analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
        <Sidebar />
        <div className="ml-20 relative z-10">
          <div className="max-w-7xl mx-auto px-8 py-12 text-center">
            <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-3">
              Class Not Found
            </h1>
            <p className="text-body text-gray-600 mb-6">
              The requested class analytics could not be found.
            </p>
            <button
              onClick={() => navigate('/analytics')}
              className="btn-primary px-6 py-3 rounded-xl"
            >
              Back to Analytics
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600 bg-green-100';
    if (grade >= 80) return 'text-blue-600 bg-blue-100';
    if (grade >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getEngagementColor = (engagement) => {
    if (engagement >= 90) return 'text-green-600';
    if (engagement >= 80) return 'text-blue-600';
    if (engagement >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
      <Sidebar />
      
      <div className="ml-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/analytics')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-2">
                {classData.name} <span className="text-gradient">Analytics</span>
              </h1>
              <p className="text-body text-gray-600">
                Detailed performance insights and student analytics
              </p>
            </div>
              <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/students')}
                className="btn-secondary px-4 py-2 rounded-xl flex items-center space-x-2"
              >
                <UsersIcon className="h-4 w-4" />
                <span>Manage Students</span>
              </button>
              
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>

          {/* Class Overview Card */}
          <div className="glass-card rounded-3xl p-8 mb-8 animate-slide-up">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center">
                <BookOpenIcon className="h-10 w-10 text-white" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-light text-gray-800 mb-2">{classData.name}</h2>
                <p className="text-gray-600 mb-1">Instructor: {classData.instructor}</p>
                <p className="text-gray-600 mb-1">Schedule: {classData.schedule}</p>
                <p className="text-gray-600 mb-4">Room: {classData.room}</p>
                <p className="text-gray-700">{classData.description}</p>
              </div>
              
              <div className="text-right space-y-2">
                <div className="flex items-center space-x-2">
                  <UsersIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-2xl font-light text-gray-800">{classData.students}</span>
                  <span className="text-gray-600 text-sm">students</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(classData.avgGrade)}`}>
                  {classData.avgGrade}% avg grade
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-500/20">
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                </div>
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-light text-gray-800 mb-1">{classData.completionRate}%</h3>
              <p className="text-gray-600 text-sm">Completion Rate</p>
            </div>

            <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <EyeIcon className="h-6 w-6 text-blue-500" />
                </div>
                <ArrowTrendingUpIcon className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className={`text-2xl font-light mb-1 ${getEngagementColor(classData.engagement)}`}>
                {classData.engagement}%
              </h3>
              <p className="text-gray-600 text-sm">Engagement</p>
            </div>

            <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-500/20">
                  <AcademicCapIcon className="h-6 w-6 text-orange-500" />
                </div>
                <span className="text-green-500 text-sm font-medium">+1.2%</span>
              </div>
              <h3 className="text-2xl font-light text-gray-800 mb-1">{analytics.attendanceData.present}/{classData.students}</h3>
              <p className="text-gray-600 text-sm">Present Today</p>
            </div>

            <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <DocumentTextIcon className="h-6 w-6 text-purple-500" />
                </div>
                <span className="text-orange-500 text-sm font-medium">2 pending</span>
              </div>
              <h3 className="text-2xl font-light text-gray-800 mb-1">{analytics.assignments.length}</h3>
              <p className="text-gray-600 text-sm">Assignments</p>
            </div>
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Trends */}
            <div className="glass-card rounded-3xl p-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <h3 className="text-xl font-light text-gray-800 mb-6 flex items-center">
                <ChartBarIcon className="h-6 w-6 text-orange-500 mr-3" />
                Performance Trends
              </h3>
              <div className="space-y-4">
                {analytics.recentPerformance.map((week, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{week.week}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-600">Grade: {week.avgGrade}%</span>
                        <span className="text-sm text-gray-600">Attendance: {week.attendance}%</span>
                        <span className="text-sm text-gray-600">Engagement: {week.engagement}%</span>
                      </div>
                    </div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                        style={{ width: `${week.engagement}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Assignments */}
            <div className="glass-card rounded-3xl p-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <h3 className="text-xl font-light text-gray-800 mb-6 flex items-center">
                <DocumentTextIcon className="h-6 w-6 text-blue-500 mr-3" />
                Recent Assignments
              </h3>
              <div className="space-y-4">
                {analytics.assignments.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{assignment.name}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-600">
                          {assignment.submitted}/{assignment.total} submitted
                        </span>
                        <span className="text-sm text-gray-600">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-medium ${assignment.avgGrade > 0 ? 'text-gray-800' : 'text-gray-400'}`}>
                        {assignment.avgGrade > 0 ? `${assignment.avgGrade}%` : 'Pending'}
                      </p>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                          style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student Performance Table */}
          <div className="glass-card rounded-3xl p-8 mb-8 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <h3 className="text-xl font-light text-gray-800 mb-6 flex items-center">
              <UsersIcon className="h-6 w-6 text-purple-500 mr-3" />
              Student Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Grade</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Attendance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Engagement</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Submissions</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.studentPerformance.map((student, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mr-3">
                            <UserIcon className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium text-gray-800">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(student.grade === 'A' ? 95 : student.grade === 'A-' ? 90 : student.grade === 'B+' ? 87 : 83)}`}>
                          {student.grade}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{student.attendance}%</td>
                      <td className="py-4 px-4">
                        <span className={`font-medium ${getEngagementColor(student.engagement)}`}>
                          {student.engagement}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{student.submissions}</td>                      <td className="py-4 px-4">
                        <button 
                          onClick={() => navigate(`/students/profile/${index + 1}`)}
                          className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="glass-card rounded-3xl p-8 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <h3 className="text-xl font-light text-gray-800 mb-6 flex items-center">
              <EyeIcon className="h-6 w-6 text-green-500 mr-3" />
              Engagement Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-white">{analytics.engagementMetrics.activeParticipation}</span>
                </div>
                <p className="text-gray-700 font-medium">Active Participation</p>
                <p className="text-gray-500 text-sm">out of 100 points</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-white">{analytics.engagementMetrics.questionAsked}</span>
                </div>
                <p className="text-gray-700 font-medium">Questions Asked</p>
                <p className="text-gray-500 text-sm">this month</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-white">{analytics.engagementMetrics.resourceAccess}</span>
                </div>
                <p className="text-gray-700 font-medium">Resource Access</p>
                <p className="text-gray-500 text-sm">total views</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-white">{analytics.engagementMetrics.forumPosts}</span>
                </div>
                <p className="text-gray-700 font-medium">Forum Posts</p>
                <p className="text-gray-500 text-sm">this month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ClassAnalyticsDetails;
