import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {
  VideoCameraIcon,
  PlusIcon,
  UserGroupIcon,
  ClockIcon,
  PlayIcon,
  StopIcon,
  SignalIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const LiveSessions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  // Mock data - replace with API call
  const getAllSessions = () => [
      {
        id: 1,
        title: 'Advanced Calculus - Integration Techniques',
        subject: 'Mathematics',
        instructor: 'Dr. Sarah Wilson',
        scheduledTime: '2025-06-15T14:00:00',
        duration: 90,
        status: 'live',
        participants: 24,
        maxParticipants: 30,
        description: 'Deep dive into advanced integration methods including integration by parts, substitution, and partial fractions.',
        recordingEnabled: true,
        chatEnabled: true,
        whiteboardEnabled: true,
        meetingLink: 'https://meet.lms.com/calc-advanced-001',
        thumbnail: '/images/math-session.jpg'
      },
      {
        id: 2,
        title: 'Quantum Physics Discussion',
        subject: 'Physics',
        instructor: 'Prof. Michael Chen',
        scheduledTime: '2025-06-15T16:30:00',
        duration: 60,
        status: 'scheduled',
        participants: 18,
        maxParticipants: 25,
        description: 'Interactive discussion on quantum mechanics principles and their real-world applications.',
        recordingEnabled: true,
        chatEnabled: true,
        whiteboardEnabled: false,
        meetingLink: 'https://meet.lms.com/physics-quantum-002',
        thumbnail: '/images/physics-session.jpg'
      },
      {
        id: 3,
        title: 'Organic Chemistry Lab Demo',
        subject: 'Chemistry',
        instructor: 'Dr. Emma Rodriguez',
        scheduledTime: '2025-06-16T10:00:00',
        duration: 120,
        status: 'scheduled',
        participants: 15,
        maxParticipants: 20,
        description: 'Virtual demonstration of complex organic synthesis reactions with step-by-step explanations.',
        recordingEnabled: true,
        chatEnabled: true,
        whiteboardEnabled: true,
        meetingLink: 'https://meet.lms.com/chem-lab-003',
        thumbnail: '/images/chemistry-session.jpg'
      },
      {
        id: 4,
        title: 'Data Structures & Algorithms',
        subject: 'Computer Science',
        instructor: 'Prof. David Kim',
        scheduledTime: '2025-06-14T13:00:00',
        duration: 75,
        status: 'completed',
        participants: 28,
        maxParticipants: 30,
        description: 'Comprehensive review of binary trees, graphs, and dynamic programming algorithms.',
        recordingEnabled: true,
        chatEnabled: true,
        whiteboardEnabled: true,
        meetingLink: 'https://meet.lms.com/cs-algorithms-004',
        recordingUrl: 'https://recordings.lms.com/cs-algorithms-004',
        thumbnail: '/images/cs-session.jpg'
      },
      {
        id: 5,
        title: 'Literature Analysis Workshop',
        subject: 'English Literature',
        instructor: 'Prof. Jane Smith',
        scheduledTime: '2025-06-17T11:00:00',
        duration: 90,
        status: 'scheduled',
        participants: 22,
        maxParticipants: 25,
        description: 'Interactive workshop analyzing themes and literary devices in contemporary literature.',
        recordingEnabled: false,
        chatEnabled: true,
        whiteboardEnabled: false,
        meetingLink: 'https://meet.lms.com/lit-workshop-005',
        thumbnail: '/images/literature-session.jpg'
      },
      {
        id: 6,
        title: 'Biology Research Seminar',
        subject: 'Biology',
        instructor: 'Dr. Alex Thompson',
        scheduledTime: '2025-06-15T09:00:00',
        duration: 45,
        status: 'cancelled',
        participants: 0,
        maxParticipants: 15,
        description: 'Seminar on latest research in molecular biology and genetic engineering.',
        recordingEnabled: true,
        chatEnabled: true,
        whiteboardEnabled: false,
        meetingLink: '',
        thumbnail: '/images/biology-session.jpg'      }
    ];

  useEffect(() => {
    const allSessions = getAllSessions();
    
    // Role-based filtering
    let filteredSessions = allSessions;
    
    if (user?.role === 'teacher') {
      // Teachers only see their own sessions
      const currentTeacherId = user?.id || 'teacher_1';
      const teacherName = currentTeacherId === 'teacher_1' ? 'Dr. Sarah Wilson' : 
                         currentTeacherId === 'teacher_2' ? 'Prof. Michael Chen' : 
                         currentTeacherId === 'teacher_3' ? 'Dr. Emma Rodriguez' : 'Prof. Jane Smith';
      filteredSessions = allSessions.filter(session => session.instructor === teacherName);
    }
    // Students and admins see all sessions
    
    setSessions(filteredSessions);
  }, [user]);

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.status === filter;
  });
  const getSessionStats = () => {
    if (user?.role === 'admin') {
      // Admin sees system-wide stats
      const allSessions = getAllSessions();
      const instructorStats = allSessions.reduce((acc, session) => {
        const instructor = session.instructor;
        if (!acc[instructor]) {
          acc[instructor] = { 
            total: 0, 
            live: 0, 
            scheduled: 0, 
            completed: 0,
            participants: 0 
          };
        }
        acc[instructor].total++;
        acc[instructor][session.status]++;
        acc[instructor].participants += session.participants;
        return acc;
      }, {});

      return {
        total: allSessions.length,
        live: allSessions.filter(s => s.status === 'live').length,
        scheduled: allSessions.filter(s => s.status === 'scheduled').length,
        completed: allSessions.filter(s => s.status === 'completed').length,
        totalParticipants: allSessions.reduce((sum, s) => sum + s.participants, 0),
        instructors: Object.keys(instructorStats).length,
        instructorBreakdown: instructorStats
      };
    }

    return {
      total: sessions.length,
      live: sessions.filter(s => s.status === 'live').length,
      scheduled: sessions.filter(s => s.status === 'scheduled').length,
      completed: sessions.filter(s => s.status === 'completed').length,
      totalParticipants: sessions.reduce((sum, s) => sum + s.participants, 0)
    };
  };
  const stats = getSessionStats();  // Handler functions
  const handleSessionAction = (session) => {
    if (session.status === 'completed' && session.recordingUrl) {
      // Navigate to recording viewer for completed sessions with recordings
      navigate(`/recording/${session.id}`);
    } else {
      // Navigate to session detail page for all other interactions
      navigate(`/session/${session.id}`);
    }
  };

  const handleScheduleSession = () => {
    // Navigate to schedule session page or show modal
    navigate('/schedule-session');
  };

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
          <div className="flex items-center justify-between mb-12 animate-slide-up">            <div>              <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-3">
                {user?.role === 'admin' ? 'System ' : ''}Live <span className="text-gradient">Sessions</span>
              </h1>
              <p className="text-body text-gray-600">
                {user?.role === 'admin' 
                  ? 'Monitor and manage all live sessions across the platform' 
                  : user?.role === 'student' 
                  ? 'Join interactive live sessions and workshops' 
                  : 'Manage live sessions and virtual classrooms'
                }
              </p>
            </div>            {(user?.role === 'teacher' || user?.role === 'admin') && (
              <button 
                onClick={handleScheduleSession}
                className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Schedule Session</span>
              </button>
            )}
          </div>          {/* Stats Cards */}
          {user?.role === 'admin' ? (
            // Admin Stats - System-wide overview
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12 animate-fade-scale">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Total Sessions</p>
                    <p className="text-title font-light text-gray-800">{stats.total}</p>
                  </div>
                  <VideoCameraIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Instructors</p>
                    <p className="text-title font-light text-gray-800">{stats.instructors}</p>
                  </div>
                  <AcademicCapIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Live Now</p>
                    <p className="text-title font-light text-gray-800">{stats.live}</p>
                  </div>
                  <SignalIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Scheduled</p>
                    <p className="text-title font-light text-gray-800">{stats.scheduled}</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Participants</p>
                    <p className="text-title font-light text-gray-800">{stats.totalParticipants}</p>
                  </div>
                  <UserGroupIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>
            </div>
          ) : (
            // Student/Teacher Stats
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-scale">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Total Sessions</p>
                    <p className="text-title font-light text-gray-800">{stats.total}</p>
                  </div>
                  <VideoCameraIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Live Now</p>
                    <p className="text-title font-light text-gray-800">{stats.live}</p>
                  </div>
                  <SignalIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Scheduled</p>
                    <p className="text-title font-light text-gray-800">{stats.scheduled}</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Completed</p>
                    <p className="text-title font-light text-gray-800">{stats.completed}</p>
                  </div>
                  <AcademicCapIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>
            </div>          )}

          {/* Admin Instructor Breakdown */}
          {user?.role === 'admin' && stats.instructorBreakdown && (
            <div className="mb-8 animate-slide-up">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Instructor Session Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.instructorBreakdown).map(([instructor, data]) => (
                  <div key={instructor} className="glass-card rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">{instructor}</h4>
                      <span className="text-sm text-gray-600">{data.total} sessions</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-red-600">{data.live} live</span>
                      <span className="text-orange-600">{data.scheduled} scheduled</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">{data.completed} completed</span>
                      <span className="text-blue-600">{data.participants} participants</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between mb-8 animate-slide-up">
            <div className="flex space-x-2 bg-gray-100 backdrop-blur-md rounded-xl p-1 border border-gray-200">
              {['all', 'live', 'scheduled', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === status
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                }`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                }`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sessions Grid/List */}
          <div className={`animate-fade-scale ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'space-y-4'
          }`}>            {filteredSessions.map((session, index) => (
              <SessionCard 
                key={session.id} 
                session={session} 
                userRole={user?.role}
                viewMode={viewMode}
                index={index}
                onSessionAction={handleSessionAction}
              />            ))}
          </div>
        </div>      </div>
      
      <Footer />
    </div>
  );
};

const SessionCard = ({ session, userRole, viewMode, index, onSessionAction }) => {  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'text-orange-700 bg-orange-500/20 border-orange-500/30';
      case 'scheduled': return 'text-blue-700 bg-blue-500/15 border-blue-500/25';
      case 'completed': return 'text-green-700 bg-green-500/15 border-green-500/25';
      case 'cancelled': return 'text-gray-700 bg-gray-500/15 border-gray-500/25';
      default: return 'text-gray-700 bg-gray-500/15 border-gray-500/25';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'live': return <SignalIcon className="h-4 w-4" />;
      case 'scheduled': return <ClockIcon className="h-4 w-4" />;
      case 'completed': return <PlayIcon className="h-4 w-4" />;
      case 'cancelled': return <StopIcon className="h-4 w-4" />;
      default: return <VideoCameraIcon className="h-4 w-4" />;
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getParticipationPercentage = () => {
    return Math.round((session.participants / session.maxParticipants) * 100);
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="glass-card rounded-xl p-6 animate-slide-up hover:scale-[1.01] transition-all duration-300"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className={`p-3 rounded-xl border ${getStatusColor(session.status)}`}>
              {getStatusIcon(session.status)}
            </div>
            <div className="flex-1">              <div className="flex items-center space-x-3 mb-2">                <h3 className="text-gray-800 font-semibold text-lg">{session.title}</h3>
                {session.status === 'live' && (
                  <span className="px-2 py-1 bg-orange-500/80 text-white text-xs rounded-full animate-pulse">
                    LIVE
                  </span>
                )}
              </div>
              <p className="text-orange-600 text-sm font-medium mb-1">{session.subject}</p>
              <p className="text-gray-600 text-sm mb-2">Instructor: {session.instructor}</p>
              <p className="text-gray-600 text-sm line-clamp-2">{session.description}</p>
            </div>
          </div>
          
          <div className="text-right ml-6">
            <p className="text-gray-800 font-medium mb-1">{formatDateTime(session.scheduledTime)}</p>
            <p className="text-gray-600 text-sm mb-2">{session.duration} minutes</p>
            <div className="flex items-center space-x-2 mb-3">
              <UserGroupIcon className="h-4 w-4 text-gray-600" />
              <span className="text-gray-600 text-sm">
                {session.participants}/{session.maxParticipants}
              </span>
            </div>            <button 
              onClick={() => onSessionAction(session)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                session.status === 'live' 
                  ? 'bg-orange-500/80 hover:bg-orange-500 text-white'
                  : session.status === 'scheduled'
                  ? 'btn-primary'
                  : session.status === 'completed' && session.recordingUrl
                  ? 'bg-green-500/70 hover:bg-green-500 text-white'
                  : 'bg-gray-600/60 hover:bg-gray-600 text-white'
              }`}
              disabled={session.status === 'cancelled'}
            >
              {session.status === 'live' && 'Join Now'}
              {session.status === 'scheduled' && 'Join Session'}
              {session.status === 'completed' && session.recordingUrl && 'View Recording'}
              {session.status === 'completed' && !session.recordingUrl && 'Completed'}
              {session.status === 'cancelled' && 'Cancelled'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="glass-card rounded-2xl p-6 animate-slide-up hover:scale-[1.02] transition-all duration-300 group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl border ${getStatusColor(session.status)}`}>
          {getStatusIcon(session.status)}
        </div>        <div className="flex items-center space-x-2">
          {session.status === 'live' && (
            <span className="px-2 py-1 bg-orange-500/80 text-white text-xs rounded-full animate-pulse">
              LIVE
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
            {session.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <h3 className="text-gray-800 font-semibold text-lg mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
        {session.title}      </h3>
      <p className="text-orange-600 text-sm font-medium mb-2">{session.subject}</p>
      <p className="text-gray-600 text-sm mb-3">Instructor: {session.instructor}</p>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{session.description}</p>

      {/* Session Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Scheduled</p>
          <p className="text-gray-800 text-sm font-medium">{formatDateTime(session.scheduledTime)}</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Duration</p>
          <p className="text-gray-800 text-sm font-medium">{session.duration} min</p>
        </div>
      </div>

      {/* Participants */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-xs uppercase tracking-wider">Participants</span>
          <span className="text-gray-800 text-sm">
            {session.participants}/{session.maxParticipants}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-orange-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getParticipationPercentage()}%` }}
          ></div>
        </div>
      </div>      {/* Features */}
      <div className="flex items-center space-x-3 mb-4">
        {session.recordingEnabled && (
          <div className="flex items-center space-x-1 text-green-300/80">
            <VideoCameraIcon className="h-3 w-3" />
            <span className="text-xs">Recording</span>
          </div>
        )}
        {session.chatEnabled && (
          <div className="flex items-center space-x-1 text-blue-300/80">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Chat</span>
          </div>
        )}
        {session.whiteboardEnabled && (
          <div className="flex items-center space-x-1 text-purple-300/80">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1v6h10V5H5z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Whiteboard</span>
          </div>
        )}
      </div>      {/* Action Button */}
      <button 
        onClick={() => onSessionAction(session)}
        disabled={session.status === 'cancelled'}
        className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
          session.status === 'live' 
            ? 'bg-orange-500/80 hover:bg-orange-500 text-white'
            : session.status === 'scheduled'
            ? 'btn-primary'
            : session.status === 'completed' && session.recordingUrl
            ? 'bg-green-500/70 hover:bg-green-500 text-white'
            : 'bg-gray-600/60 hover:bg-gray-600 text-white cursor-not-allowed'
        }`}
      >
        {session.status === 'live' && 'Join Live Session'}
        {session.status === 'scheduled' && 'Join Session'}
        {session.status === 'completed' && session.recordingUrl && 'View Recording'}
        {session.status === 'completed' && !session.recordingUrl && 'Session Completed'}
        {session.status === 'cancelled' && 'Session Cancelled'}
      </button>
    </div>
  );
};

export default LiveSessions;
