import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {
  BookOpenIcon,
  ArrowLeftIcon,
  UserGroupIcon,
  ClockIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ChartBarIcon,
  PlusIcon,
  PencilSquareIcon,
  PlayIcon,
  ChatBubbleLeftRightIcon,  BellIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const ClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classData, setClassData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Mock class data - in real app, fetch based on classId
  useEffect(() => {
    const fetchClassData = () => {
      const mockClassData = {
        id: parseInt(classId),
        name: 'Advanced Mathematics',
        description: 'Calculus, Linear Algebra, and Differential Equations',
        instructor: 'Dr. John Smith',
        students: 25,
        maxStudents: 30,
        nextSession: 'Today, 2:00 PM',
        progress: 75,
        status: 'active',
        room: 'Room 301',
        schedule: 'Mon, Wed, Fri - 2:00-3:30 PM',
        semester: 'Spring 2025',
        credits: 4,
        syllabus: 'Advanced calculus concepts including multivariable calculus, vector calculus, and differential equations.',
        
        // Recent activity
        recentActivities: [
          {
            id: 1,
            type: 'assignment',
            title: 'Integration Techniques Quiz',
            description: 'New assignment posted',
            time: '2 hours ago',
            status: 'new'
          },
          {
            id: 2,
            type: 'announcement',
            title: 'Class Schedule Update',
            description: 'Friday class moved to 3:00 PM',
            time: '1 day ago',
            status: 'info'
          },
          {
            id: 3,
            type: 'submission',
            title: 'Homework 5 Submitted',
            description: '18 students have submitted',
            time: '2 days ago',
            status: 'success'
          }
        ],
        
        // Upcoming events
        upcomingEvents: [
          {
            id: 1,
            title: 'Calculus III Lecture',
            date: 'Today',
            time: '2:00 PM',
            type: 'lecture',
            location: 'Room 301'
          },
          {
            id: 2,
            title: 'Assignment Due: Integration Methods',
            date: 'Tomorrow',
            time: '11:59 PM',
            type: 'assignment',
            priority: 'high'
          },
          {
            id: 3,
            title: 'Office Hours',
            date: 'Wednesday',
            time: '10:00 AM',
            type: 'office-hours',
            location: 'Office 205'
          }
        ],
          // Student roster (for teachers)
        studentRoster: [
          { id: 1, name: 'Alice Johnson', grade: 'A', attendance: 95, lastActive: '2 hours ago' },
          { id: 2, name: 'Bob Smith', grade: 'B+', attendance: 87, lastActive: '1 day ago' },
          { id: 3, name: 'Carol Davis', grade: 'A-', attendance: 92, lastActive: '3 hours ago' },
          { id: 4, name: 'David Wilson', grade: 'B', attendance: 78, lastActive: '2 days ago' },
          { id: 5, name: 'Eva Brown', grade: 'A+', attendance: 98, lastActive: '1 hour ago' }
        ],
        
        // Assignments
        assignments: [
          {
            id: 1,
            title: 'Integration Techniques Quiz',
            dueDate: '2025-06-18',
            points: 100,
            status: 'active',
            submitted: 12,
            total: 25
          },
          {
            id: 2,
            title: 'Vector Calculus Problem Set',
            dueDate: '2025-06-20',
            points: 150,
            status: 'active',
            submitted: 8,
            total: 25
          },
          {
            id: 3,
            title: 'Midterm Exam',
            dueDate: '2025-06-25',
            points: 200,
            status: 'upcoming',
            submitted: 0,
            total: 25
          }
        ],
        
        // Course materials
        materials: [
          {
            id: 1,
            title: 'Lecture 15: Integration by Parts',
            type: 'video',
            duration: '45 min',
            uploadDate: '2025-06-14'
          },
          {
            id: 2,
            title: 'Chapter 12 Notes',
            type: 'document',
            pages: 24,
            uploadDate: '2025-06-13'
          },
          {
            id: 3,
            title: 'Practice Problems Set 5',
            type: 'document',
            pages: 8,
            uploadDate: '2025-06-12'
          }
        ]
      };
      
      setClassData(mockClassData);
      setLoading(false);
    };

    fetchClassData();
  }, [classId]);

  const getTabContent = () => {
    if (!classData) return null;    switch (activeTab) {
      case 'overview':
        return <OverviewTab classData={classData} userRole={user?.role} navigate={navigate} setActiveTab={setActiveTab} />;
      case 'assignments':
        return <AssignmentsTab assignments={classData.assignments} userRole={user?.role} navigate={navigate} />;
      case 'materials':
        return <MaterialsTab materials={classData.materials} userRole={user?.role} />;
      case 'students':
        return <StudentsTab students={classData.studentRoster} userRole={user?.role} />;
      case 'analytics':
        return <AnalyticsTab classData={classData} userRole={user?.role} />;
      default:
        return <OverviewTab classData={classData} userRole={user?.role} navigate={navigate} setActiveTab={setActiveTab} />;
    }
  };

  const getTabs = () => {
    const baseTabs = [
      { id: 'overview', name: 'Overview', icon: InformationCircleIcon },
      { id: 'assignments', name: 'Assignments', icon: DocumentTextIcon },
      { id: 'materials', name: 'Materials', icon: BookOpenIcon }
    ];

    if (user?.role === 'teacher') {
      return [
        ...baseTabs,
        { id: 'students', name: 'Students', icon: UserGroupIcon },
        { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
      ];
    }

    return baseTabs;
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
        <Sidebar />
        <div className="ml-20 relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading class details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
        <Sidebar />
        <div className="ml-20 relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-light text-gray-800 mb-4">Class Not Found</h1>
            <button 
              onClick={() => navigate('/classes')}
              className="btn-primary px-6 py-3 rounded-xl"
            >
              Back to Classes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-gradient-radial opacity-30"></div>
      
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-12">
          
          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center mb-6">
              <button
                onClick={() => navigate('/classes')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex-1">
                <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-2">
                  {classData.name}
                </h1>
                <p className="text-body text-gray-600">{classData.description}</p>
              </div>
              {user?.role === 'teacher' && (                <div className="flex space-x-3">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className="btn-secondary px-4 py-2 rounded-xl flex items-center space-x-2"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    <span>Edit Class</span>
                  </button>
                  <button 
                    onClick={() => navigate('/live-sessions')}
                    className="btn-primary px-4 py-2 rounded-xl flex items-center space-x-2"
                  >
                    <VideoCameraIcon className="h-4 w-4" />
                    <span>Start Session</span>
                  </button>
                </div>
              )}
              {user?.role === 'student' && (
                <div className="flex space-x-3">
                  <button 
                    onClick={() => navigate('/notifications')}
                    className="btn-secondary px-4 py-2 rounded-xl flex items-center space-x-2"
                  >
                    <BellIcon className="h-4 w-4" />
                    <span>Notifications</span>
                  </button>
                  <button 
                    onClick={() => navigate('/live-sessions')}
                    className="btn-primary px-4 py-2 rounded-xl flex items-center space-x-2"
                  >
                    <PlayIcon className="h-4 w-4" />
                    <span>Join Session</span>
                  </button>
                </div>
              )}
            </div>

            {/* Class Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Students</p>
                    <p className="text-title font-light text-gray-800">{classData.students}/{classData.maxStudents}</p>
                  </div>
                  <UserGroupIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Progress</p>
                    <p className="text-title font-light text-gray-800">{classData.progress}%</p>
                  </div>
                  <ChartBarIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Next Session</p>
                    <p className="text-caption font-medium text-gray-800">{classData.nextSession}</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Credits</p>
                    <p className="text-title font-light text-gray-800">{classData.credits}</p>
                  </div>
                  <AcademicCapIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {getTabs().map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-scale">
            {getTabContent()}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ classData, userRole, navigate, setActiveTab }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Left Column - Main Info */}
    <div className="lg:col-span-2 space-y-8">
      {/* Course Information */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Course Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Instructor</p>
            <p className="text-lg font-medium text-gray-800">{classData.instructor}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Schedule</p>
            <p className="text-lg font-medium text-gray-800">{classData.schedule}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Room</p>
            <p className="text-lg font-medium text-gray-800">{classData.room}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Semester</p>
            <p className="text-lg font-medium text-gray-800">{classData.semester}</p>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-2">Course Description</p>
          <p className="text-gray-700 leading-relaxed">{classData.syllabus}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {classData.recentActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>

    {/* Right Column - Sidebar */}
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Quick Actions</h3>        <div className="space-y-3">
          {userRole === 'teacher' ? (
            <>
              <button 
                onClick={() => setActiveTab('assignments')}
                className="w-full btn-primary py-3 px-4 rounded-xl text-sm font-medium"
              >
                Create Assignment
              </button>
              <button 
                onClick={() => navigate('/notifications')}
                className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium"
              >
                Post Announcement
              </button>
              <button 
                onClick={() => setActiveTab('materials')}
                className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium"
              >
                Upload Material
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setActiveTab('assignments')}
                className="w-full btn-primary py-3 px-4 rounded-xl text-sm font-medium"
              >
                View Assignments
              </button>
              <button 
                onClick={() => setActiveTab('materials')}
                className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium"
              >
                Download Materials
              </button>
              <button 
                onClick={() => navigate('/notes')}
                className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium"
              >
                Ask Question
              </button>
            </>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Upcoming Events</h3>
        <div className="space-y-4">
          {classData.upcomingEvents.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Assignments Tab Component
const AssignmentsTab = ({ assignments, userRole, navigate }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-light text-gray-800">Assignments</h3>
      {userRole === 'teacher' && (
        <button className="btn-primary px-4 py-2 rounded-xl flex items-center space-x-2">
          <PlusIcon className="h-4 w-4" />
          <span>Create Assignment</span>
        </button>
      )}
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assignments.map((assignment) => (
        <AssignmentCard key={assignment.id} assignment={assignment} userRole={userRole} navigate={navigate} />
      ))}
    </div>
  </div>
);

// Materials Tab Component
const MaterialsTab = ({ materials, userRole }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-light text-gray-800">Course Materials</h3>
      {userRole === 'teacher' && (
        <button className="btn-primary px-4 py-2 rounded-xl flex items-center space-x-2">
          <PlusIcon className="h-4 w-4" />
          <span>Upload Material</span>
        </button>
      )}
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {materials.map((material) => (
        <MaterialCard key={material.id} material={material} />
      ))}
    </div>
  </div>
);

// Students Tab Component (Teacher only)
const StudentsTab = ({ students, userRole }) => {
  if (userRole !== 'teacher') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Access denied. Students tab is only available for teachers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-light text-gray-800">Student Roster</h3>
        <button className="btn-primary px-4 py-2 rounded-xl flex items-center space-x-2">
          <PlusIcon className="h-4 w-4" />
          <span>Add Student</span>
        </button>
      </div>
      
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <StudentRow key={student.id} student={student} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Analytics Tab Component (Teacher only)
const AnalyticsTab = ({ classData, userRole }) => {
  if (userRole !== 'teacher') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Access denied. Analytics tab is only available for teachers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-light text-gray-800">Class Analytics</h3>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Avg Grade</p>
              <p className="text-title font-light text-gray-800">B+</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-orange-500 opacity-60" />
          </div>
        </div>
        
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Attendance</p>
              <p className="text-title font-light text-gray-800">89%</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-orange-500 opacity-60" />
          </div>
        </div>
        
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Completion</p>
              <p className="text-title font-light text-gray-800">92%</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-orange-500 opacity-60" />
          </div>
        </div>
        
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Engagement</p>
              <p className="text-title font-light text-gray-800">85%</p>
            </div>
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-orange-500 opacity-60" />
          </div>
        </div>
      </div>
      
      <div className="text-center py-12">
        <p className="text-gray-600">Detailed analytics charts and visualizations would go here.</p>
      </div>
    </div>
  );
};

// Helper Components
const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'assignment': return DocumentTextIcon;
      case 'announcement': return BellIcon;
      case 'submission': return CheckCircleIcon;
      default: return InformationCircleIcon;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'new': return 'text-blue-600';
      case 'info': return 'text-gray-600';
      case 'success': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const Icon = getActivityIcon(activity.type);

  return (
    <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
      <div className={`p-2 rounded-lg bg-gray-100 ${getActivityColor(activity.status)}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-800 mb-1">{activity.title}</h4>
        <p className="text-xs text-gray-600 mb-1">{activity.description}</p>
        <p className="text-xs text-gray-500">{activity.time}</p>
      </div>
    </div>
  );
};

const EventItem = ({ event }) => {
  const getEventColor = (type) => {
    switch (type) {
      case 'lecture': return 'text-blue-600 bg-blue-50';
      case 'assignment': return 'text-red-600 bg-red-50';
      case 'office-hours': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
      <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
        <CalendarDaysIcon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-800 mb-1">{event.title}</h4>
        <div className="flex items-center space-x-4 text-xs text-gray-600">
          <span>{event.date} at {event.time}</span>
          {event.location && <span>• {event.location}</span>}
        </div>
      </div>
    </div>
  );
};

const AssignmentCard = ({ assignment, userRole, navigate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'upcoming': return 'text-blue-600 bg-blue-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <h4 className="text-lg font-medium text-gray-800">{assignment.title}</h4>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
          {assignment.status}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Due Date</span>
          <span className="text-gray-800">{assignment.dueDate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Points</span>
          <span className="text-gray-800">{assignment.points}</span>
        </div>
        {userRole === 'teacher' && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Submitted</span>
            <span className="text-gray-800">{assignment.submitted}/{assignment.total}</span>
          </div>
        )}
      </div>
      
      <button 
        onClick={() => navigate(`/assignment/${assignment.id}`)}
        className="w-full btn-primary py-2 px-4 rounded-xl text-sm font-medium mt-4"
      >
        {userRole === 'teacher' ? 'Manage Assignment' : 'View Assignment'}
      </button>
    </div>
  );
};

const MaterialCard = ({ material }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return VideoCameraIcon;
      case 'document': return DocumentTextIcon;
      default: return BookOpenIcon;
    }
  };

  const Icon = getTypeIcon(material.type);

  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-orange-100 rounded-xl">
          <Icon className="h-6 w-6 text-orange-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-medium text-gray-800 mb-2">{material.title}</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Type</span>
              <span className="capitalize">{material.type}</span>
            </div>
            {material.duration && (
              <div className="flex justify-between">
                <span>Duration</span>
                <span>{material.duration}</span>
              </div>
            )}
            {material.pages && (
              <div className="flex justify-between">
                <span>Pages</span>
                <span>{material.pages}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Uploaded</span>
              <span>{material.uploadDate}</span>
            </div>
          </div>
          <button className="w-full btn-secondary py-2 px-4 rounded-xl text-sm font-medium mt-4">
            {material.type === 'video' ? 'Watch' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentRow = ({ student }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
          <span className="text-xs font-medium text-gray-600">
            {student.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-900">{student.name}</span>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="text-sm text-gray-900">{student.grade}</span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="text-sm text-gray-900">{student.attendance}%</span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="text-sm text-gray-500">{student.lastActive}</span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button className="text-orange-600 hover:text-orange-900">View Details</button>
    </td>
  </tr>
);

export default ClassDetail;
