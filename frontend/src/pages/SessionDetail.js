import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {
  ArrowLeftIcon,
  VideoCameraIcon,
  ClockIcon,
  PlayIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  CameraIcon,
  CalendarDaysIcon,
  CogIcon,
  ShareIcon,  UserGroupIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  ListBulletIcon,
  FolderOpenIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const SessionDetail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Mock session data - replace with API call
  const getSessionById = (id) => {
    const sessions = [
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
        description: 'Deep dive into advanced integration methods including integration by parts, substitution, and partial fractions. This session will cover complex mathematical concepts with practical examples and interactive problem-solving.',
        recordingEnabled: true,
        chatEnabled: true,
        whiteboardEnabled: true,
        meetingLink: 'https://meet.lms.com/calc-advanced-001',
        thumbnail: '/images/math-session.jpg',
        agenda: [
          'Review of basic integration rules',
          'Integration by parts technique',
          'Trigonometric substitution',
          'Partial fractions decomposition',
          'Interactive problem solving',
          'Q&A session'
        ],
        materials: [
          { name: 'Integration Handbook.pdf', size: '2.3 MB', type: 'pdf' },
          { name: 'Practice Problems.docx', size: '1.1 MB', type: 'doc' },
          { name: 'Formula Sheet.pdf', size: '890 KB', type: 'pdf' }
        ],
        currentParticipants: [
          { name: 'Alice Johnson', joined: '2025-06-15T14:02:00' },
          { name: 'Bob Smith', joined: '2025-06-15T14:01:00' },
          { name: 'Carol Davis', joined: '2025-06-15T14:03:00' }
        ]
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
        thumbnail: '/images/physics-session.jpg',
        agenda: [
          'Quantum superposition principles',
          'Wave-particle duality',
          'Real-world applications',
          'Group discussion and analysis'
        ],
        materials: [
          { name: 'Quantum Mechanics Overview.pdf', size: '3.2 MB', type: 'pdf' },
          { name: 'Discussion Questions.docx', size: '756 KB', type: 'doc' }
        ]
      }
    ];
    
    return sessions.find(s => s.id === parseInt(id));
  };
  useEffect(() => {
    const sessionData = getSessionById(sessionId);
    if (sessionData) {
      setSession(sessionData);
    } else {
      navigate('/live-sessions');
    }
    setLoading(false);
  }, [sessionId, navigate]);

  const getTabContent = () => {
    if (!session) return null;

    switch (activeTab) {
      case 'overview':
        return <OverviewTab session={session} userRole={user?.role} handleJoinSession={handleJoinSession} isJoining={isJoining} joinError={joinError} />;
      case 'agenda':
        return <AgendaTab session={session} />;
      case 'materials':
        return <MaterialsTab session={session} />;
      case 'participants':
        return <ParticipantsTab session={session} userRole={user?.role} />;
      default:
        return <OverviewTab session={session} userRole={user?.role} handleJoinSession={handleJoinSession} isJoining={isJoining} joinError={joinError} />;
    }
  };

  const getTabs = () => {
    const baseTabs = [
      { id: 'overview', name: 'Overview', icon: InformationCircleIcon },
      { id: 'agenda', name: 'Agenda', icon: ListBulletIcon },
      { id: 'materials', name: 'Materials', icon: FolderOpenIcon }
    ];

    if (user?.role === 'teacher' || session?.currentParticipants) {
      return [
        ...baseTabs,
        { id: 'participants', name: 'Participants', icon: UserGroupIcon }
      ];
    }

    return baseTabs;
  };

  const handleJoinSession = async () => {
    if (!session?.meetingLink) {
      setJoinError('Meeting link not available');
      return;
    }

    setIsJoining(true);
    setJoinError(null);

    try {
      // Simulate joining process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Open meeting in new tab
      window.open(session.meetingLink, '_blank');
      
      // Update participant count (in real app, this would be handled by the server)
      setSession(prev => ({
        ...prev,
        participants: prev.participants + 1
      }));
      
    } catch (error) {
      setJoinError('Failed to join session. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleViewRecording = () => {
    if (session?.recordingUrl) {
      window.open(session.recordingUrl, '_blank');
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'text-orange-700 bg-orange-500/20 border-orange-500/30';
      case 'scheduled': return 'text-blue-700 bg-blue-500/15 border-blue-500/25';
      case 'completed': return 'text-green-700 bg-green-500/15 border-green-500/25';
      case 'cancelled': return 'text-gray-700 bg-gray-500/15 border-gray-500/25';      default: return 'text-gray-700 bg-gray-500/15 border-gray-500/25';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
        <Sidebar />
        <div className="ml-20 relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading session details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
        <Sidebar />
        <div className="ml-20 relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-light text-gray-800 mb-4">Session Not Found</h1>
            <button 
              onClick={() => navigate('/live-sessions')}
              className="btn-primary px-6 py-3 rounded-xl"
            >
              Back to Live Sessions
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { date, time } = formatDateTime(session.scheduledTime);
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
                onClick={() => navigate('/live-sessions')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex-1">                <div className="flex items-baseline space-x-3 mb-2">
                  <h1 className="text-display font-montserrat font-extralight text-gray-800">
                    {session.title}
                  </h1>
                  <span className={`self-start mt-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(session.status)} ${
                    session.status === 'live' ? 'animate-pulse' : ''
                  }`}>
                    {session.status === 'live' ? 'LIVE NOW' : session.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-body text-gray-600">{session.subject} • {session.instructor}</p>
              </div>
              
              {/* Action Buttons */}
              {user?.role === 'teacher' && (
                <div className="flex space-x-3">
                  <button className="btn-secondary px-4 py-2 rounded-xl flex items-center space-x-2">
                    <CogIcon className="h-4 w-4" />
                    <span>Session Settings</span>
                  </button>
                  <button className="btn-primary px-4 py-2 rounded-xl flex items-center space-x-2">
                    <VideoCameraIcon className="h-4 w-4" />
                    <span>Start Session</span>
                  </button>
                </div>
              )}
              
              {user?.role === 'student' && (
                <div className="flex space-x-3">
                  <button className="btn-secondary px-4 py-2 rounded-xl flex items-center space-x-2">
                    <ShareIcon className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                  {session.status === 'live' || session.status === 'scheduled' ? (
                    <button 
                      onClick={handleJoinSession}
                      disabled={isJoining}
                      className={`btn-primary px-4 py-2 rounded-xl flex items-center space-x-2 ${
                        session.status === 'live' 
                          ? 'bg-orange-500 hover:bg-orange-600'
                          : ''
                      } ${isJoining ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <VideoCameraIcon className="h-4 w-4" />
                      <span>{isJoining ? 'Joining...' : 'Join Session'}</span>
                    </button>
                  ) : (
                    <button 
                      onClick={handleViewRecording}
                      className="btn-primary px-4 py-2 rounded-xl flex items-center space-x-2"
                    >
                      <PlayIcon className="h-4 w-4" />
                      <span>View Recording</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Session Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Date & Time</p>
                    <p className="text-title font-light text-gray-800">{date}</p>
                    <p className="text-caption text-gray-600">{time}</p>
                  </div>
                  <CalendarDaysIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Duration</p>
                    <p className="text-title font-light text-gray-800">{session.duration} min</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Participants</p>
                    <p className="text-title font-light text-gray-800">{session.participants}/{session.maxParticipants}</p>
                  </div>
                  <UserGroupIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Status</p>
                    <p className="text-title font-light text-gray-800">{session.status}</p>
                  </div>
                  {session.status === 'live' ? (
                    <VideoCameraIcon className="h-8 w-8 text-orange-500 opacity-60" />
                  ) : session.status === 'completed' ? (
                    <CheckCircleIcon className="h-8 w-8 text-green-500 opacity-60" />
                  ) : (
                    <ClockIcon className="h-8 w-8 text-blue-500 opacity-60" />
                  )}
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
const OverviewTab = ({ session, userRole, handleJoinSession, isJoining, joinError }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Left Column - Main Content */}
    <div className="lg:col-span-2 space-y-8">
      {/* Session Description */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Session Description</h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed">{session.description}</p>
        </div>
      </div>

      {/* Join Session Card */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Session Access</h3>
        
        {joinError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {joinError}
          </div>
        )}
        
        {session.status === 'live' || session.status === 'scheduled' ? (
          <button 
            onClick={handleJoinSession}
            disabled={isJoining}
            className={`w-full py-4 rounded-xl text-lg font-medium transition-all ${
              session.status === 'live' 
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg'
                : 'btn-primary'
            } ${isJoining ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isJoining ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Joining...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <VideoCameraIcon className="h-6 w-6" />
                <span>
                  {session.status === 'live' ? 'Join Live Session' : 'Join Session'}
                </span>
              </div>
            )}
          </button>
        ) : session.status === 'completed' && session.recordingUrl ? (
          <button 
            className="w-full py-4 rounded-xl text-lg font-medium bg-green-500 hover:bg-green-600 text-white transition-colors"
          >
            <div className="flex items-center justify-center space-x-2">
              <PlayIcon className="h-6 w-6" />
              <span>View Recording</span>
            </div>
          </button>
        ) : (
          <div className="w-full py-4 rounded-xl bg-gray-100 text-gray-600 text-lg font-medium text-center">
            Session {session.status}
          </div>
        )}
      </div>
    </div>

    {/* Right Column - Sidebar */}
    <div className="space-y-8">
      {/* Instructor Info */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Instructor</h3>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-orange-600 font-semibold">
              {session.instructor.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-800">{session.instructor}</p>
            <p className="text-sm text-gray-600">{session.subject}</p>
          </div>
        </div>
      </div>

      {/* Session Features */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Session Features</h3>
        <div className="space-y-3">
          <div className={`flex items-center space-x-3 ${session.recordingEnabled ? 'text-green-600' : 'text-gray-400'}`}>
            <CameraIcon className="h-5 w-5" />
            <span className="text-sm">Recording {session.recordingEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className={`flex items-center space-x-3 ${session.chatEnabled ? 'text-green-600' : 'text-gray-400'}`}>
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
            <span className="text-sm">Live Chat {session.chatEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className={`flex items-center space-x-3 ${session.whiteboardEnabled ? 'text-green-600' : 'text-gray-400'}`}>
            <PencilSquareIcon className="h-5 w-5" />
            <span className="text-sm">Whiteboard {session.whiteboardEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium">
            Set Reminder
          </button>
          <button className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium">
            Add to Calendar
          </button>
          <button className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium">
            Share Session
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Agenda Tab Component
const AgendaTab = ({ session }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Left Column - Main Content */}
    <div className="lg:col-span-2">
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Session Agenda</h3>
        
        {session.agenda && session.agenda.length > 0 ? (
          <div className="space-y-4">
            {session.agenda.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 text-sm font-medium">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{item}</p>
                  <p className="text-sm text-gray-600 mt-1">Estimated time: 10-15 minutes</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No agenda items available for this session.</p>
        )}
      </div>
    </div>

    {/* Right Column - Sidebar */}
    <div className="space-y-8">
      {/* Agenda Summary */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Agenda Summary</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Items</p>
            <p className="text-gray-800">{session.agenda?.length || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Estimated Duration</p>
            <p className="text-gray-800">{session.duration} minutes</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Session Type</p>
            <p className="text-gray-800">Interactive Learning</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Materials Tab Component
const MaterialsTab = ({ session }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Left Column - Main Content */}
    <div className="lg:col-span-2">
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Session Materials</h3>
        
        {session.materials && session.materials.length > 0 ? (
          <div className="space-y-4">
            {session.materials.map((material, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <DocumentTextIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{material.name}</h4>
                    <p className="text-sm text-gray-600">Size: {material.size}</p>
                    <p className="text-xs text-gray-500">Type: {material.type.toUpperCase()}</p>
                  </div>
                </div>
                <button className="btn-secondary px-4 py-2 rounded-lg text-sm">
                  Download
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No materials available for this session.</p>
        )}
      </div>
    </div>

    {/* Right Column - Sidebar */}
    <div className="space-y-8">
      {/* Materials Summary */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Materials Overview</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Files</p>
            <p className="text-gray-800">{session.materials?.length || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">PDF Documents</p>
            <p className="text-gray-800">{session.materials?.filter(m => m.type === 'pdf').length || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Other Files</p>
            <p className="text-gray-800">{session.materials?.filter(m => m.type !== 'pdf').length || 0}</p>
          </div>
        </div>
      </div>

      {/* Download Help */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Need Help?</h3>
        <div className="space-y-3">
          <button className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium">
            Download All
          </button>
          <button className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium">
            Technical Support
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Participants Tab Component
const ParticipantsTab = ({ session, userRole }) => {
  const getParticipationPercentage = () => {
    return Math.round((session.participants / session.maxParticipants) * 100);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Participation Overview */}
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-2xl font-light text-gray-800 mb-6">Participation Overview</h3>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Current Participants</span>
            <span className="font-medium text-gray-800">
              {session.participants}/{session.maxParticipants}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-orange-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getParticipationPercentage()}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {getParticipationPercentage()}% capacity filled
          </p>
        </div>

        {/* Live Participants */}
        {session.status === 'live' && session.currentParticipants && (
          <div className="glass-card rounded-3xl p-8">
            <h3 className="text-2xl font-light text-gray-800 mb-6">Currently Online</h3>
            <div className="space-y-3">
              {session.currentParticipants.map((participant, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 text-sm font-medium">
                        {participant.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-gray-700">{participant.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Joined {new Date(participant.joined).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-8">
        {/* Participation Stats */}
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-2xl font-light text-gray-800 mb-6">Statistics</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Max Capacity</p>
              <p className="text-gray-800">{session.maxParticipants}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Currently Joined</p>
              <p className="text-gray-800">{session.participants}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Available Spots</p>
              <p className="text-gray-800">{session.maxParticipants - session.participants}</p>
            </div>
            {session.status === 'live' && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Online Now</p>
                <p className="text-gray-800">{session.currentParticipants?.length || 0}</p>
              </div>
            )}
          </div>
        </div>

        {/* Session Controls (Teacher only) */}
        {userRole === 'teacher' && (
          <div className="glass-card rounded-3xl p-8">
            <h3 className="text-2xl font-light text-gray-800 mb-6">Session Controls</h3>
            <div className="space-y-3">
              <button className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium">
                Manage Participants
              </button>
              <button className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium">
                Send Message
              </button>
              <button className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium">
                Session Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionDetail;
