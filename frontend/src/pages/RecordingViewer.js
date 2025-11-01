import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  ClockIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  BookmarkIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const RecordingViewer = () => {  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  // Mock recording data - replace with API call
  useEffect(() => {
    const fetchRecording = () => {
      const mockRecording = {
        id: parseInt(sessionId),
        title: 'Advanced Calculus - Integration Techniques',
        subject: 'Mathematics',
        instructor: 'Dr. Sarah Wilson',
        recordedDate: '2025-06-14T13:00:00',
        duration: 5400, // 90 minutes in seconds
        participants: 28,
        quality: '1080p',
        size: '2.1 GB',
        views: 147,
        description: 'Complete recording of the advanced calculus session covering integration by parts, substitution, and partial fractions with interactive problem-solving.',
        videoUrl: 'https://recordings.lms.com/calc-advanced-001.mp4',
        thumbnail: '/images/recording-thumbnail.jpg',
        
        // Session materials
        materials: [
          { name: 'Integration Handbook.pdf', size: '2.3 MB', type: 'pdf', downloadUrl: '/materials/integration-handbook.pdf' },
          { name: 'Practice Problems.docx', size: '1.1 MB', type: 'doc', downloadUrl: '/materials/practice-problems.docx' },
          { name: 'Formula Sheet.pdf', size: '890 KB', type: 'pdf', downloadUrl: '/materials/formula-sheet.pdf' }
        ],
        
        // Transcript
        transcript: [
          { time: '00:02:15', speaker: 'Dr. Sarah Wilson', text: 'Welcome everyone to today\'s session on advanced integration techniques.' },
          { time: '00:03:42', speaker: 'Dr. Sarah Wilson', text: 'Let\'s start with integration by parts, which follows the formula: ∫u dv = uv - ∫v du' },
          { time: '00:15:20', speaker: 'Student', text: 'Could you explain when to use substitution versus integration by parts?' },
          { time: '00:15:35', speaker: 'Dr. Sarah Wilson', text: 'Great question! The choice depends on the form of the integrand...' }
        ],
        
        // Key moments/chapters
        chapters: [
          { time: 0, title: 'Introduction and Overview', duration: 180 },
          { time: 180, title: 'Integration by Parts', duration: 900 },
          { time: 1080, title: 'Trigonometric Substitution', duration: 1200 },
          { time: 2280, title: 'Partial Fractions', duration: 1020 },
          { time: 3300, title: 'Problem Solving Session', duration: 1800 },
          { time: 5100, title: 'Q&A and Wrap-up', duration: 300 }
        ],
        
        // Related recordings
        relatedRecordings: [
          { id: 2, title: 'Calculus II - Fundamentals Review', instructor: 'Dr. Sarah Wilson', duration: 3600 },
          { id: 3, title: 'Advanced Integration Applications', instructor: 'Dr. Sarah Wilson', duration: 4200 }
        ]
      };
      
      setRecording(mockRecording);
      setDuration(mockRecording.duration);
      setLoading(false);
    };

    fetchRecording();
  }, [sessionId]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In real implementation, control video player
  };

  const handleSeek = (time) => {
    setCurrentTime(time);
    // In real implementation, seek video to specific time
  };

  const handleDownloadMaterial = (material) => {
    // In real implementation, trigger download
    alert(`Downloading ${material.name}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
        <Sidebar />
        <div className="ml-20 relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading recording...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!recording) {
    return (
      <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
        <Sidebar />
        <div className="ml-20 relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-light text-gray-800 mb-4">Recording Not Found</h1>
            <button 
              onClick={() => navigate('/live-sessions')}
              className="btn-primary px-6 py-3 rounded-xl"
            >
              Back to Sessions
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
                onClick={() => navigate('/live-sessions')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex-1">
                <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-2">
                  {recording.title}
                </h1>
                <p className="text-body text-gray-600">{recording.subject} • {recording.instructor}</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button className="btn-secondary px-4 py-2 rounded-xl flex items-center space-x-2">
                  <BookmarkIcon className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button className="btn-secondary px-4 py-2 rounded-xl flex items-center space-x-2">
                  <ShareIcon className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Recording Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Duration</p>
                    <p className="text-title font-light text-gray-800">{formatTime(recording.duration)}</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Recorded</p>
                    <p className="text-title font-light text-gray-800">
                      {new Date(recording.recordedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <CalendarDaysIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Participants</p>
                    <p className="text-title font-light text-gray-800">{recording.participants}</p>
                  </div>
                  <UserGroupIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Views</p>
                    <p className="text-title font-light text-gray-800">{recording.views}</p>
                  </div>
                  <AcademicCapIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>
            </div>
          </div>

          {/* Video Player Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            {/* Left Column - Video Player */}
            <div className="lg:col-span-3">
              <div className="glass-card rounded-3xl p-8">
                {/* Video Player Placeholder */}
                <div className="relative bg-black rounded-2xl overflow-hidden mb-6">
                  <div className="aspect-video flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        {isPlaying ? (
                          <PauseIcon className="h-10 w-10" />
                        ) : (
                          <PlayIcon className="h-10 w-10 ml-1" />
                        )}
                      </div>
                      <p className="text-lg font-medium">{recording.title}</p>
                      <p className="text-sm opacity-80">{formatTime(duration)} • {recording.quality}</p>
                    </div>
                  </div>
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePlayPause}
                        className="text-white hover:text-orange-400 transition-colors"
                      >
                        {isPlaying ? (
                          <PauseIcon className="h-6 w-6" />
                        ) : (
                          <PlayIcon className="h-6 w-6" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-white hover:text-orange-400 transition-colors"
                      >
                        {isMuted ? (
                          <SpeakerXMarkIcon className="h-6 w-6" />
                        ) : (
                          <SpeakerWaveIcon className="h-6 w-6" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="bg-white/20 rounded-full h-1">
                          <div 
                            className="bg-orange-500 h-1 rounded-full transition-all"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                      
                      <button className="text-white hover:text-orange-400 transition-colors">
                        <ArrowsPointingOutIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recording Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-light text-gray-800 mb-3">About This Recording</h3>
                  <p className="text-gray-700 leading-relaxed">{recording.description}</p>
                </div>

                {/* Chapters */}
                <div>
                  <h3 className="text-xl font-light text-gray-800 mb-4">Chapters</h3>
                  <div className="space-y-2">
                    {recording.chapters.map((chapter, index) => (
                      <button
                        key={index}
                        onClick={() => handleSeek(chapter.time)}
                        className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">{chapter.title}</p>
                            <p className="text-sm text-gray-600">{formatTime(chapter.time)}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatTime(chapter.duration)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Session Materials */}
              <div className="glass-card rounded-3xl p-8">
                <h3 className="text-xl font-light text-gray-800 mb-6">Session Materials</h3>
                <div className="space-y-3">
                  {recording.materials.map((material, index) => (
                    <button
                      key={index}
                      onClick={() => handleDownloadMaterial(material)}
                      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <DocumentArrowDownIcon className="h-5 w-5 text-blue-600" />
                        <div className="text-left">
                          <p className="font-medium text-gray-800">{material.name}</p>
                          <p className="text-xs text-gray-500">{material.size}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transcript Toggle */}
              <div className="glass-card rounded-3xl p-8">
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="w-full flex items-center justify-between p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-gray-800">View Transcript</span>
                  </div>
                  <div className={`transform transition-transform ${showTranscript ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </button>
                
                {showTranscript && (
                  <div className="mt-4 max-h-96 overflow-y-auto space-y-3">
                    {recording.transcript.map((entry, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-800">{entry.speaker}</span>
                          <span className="text-xs text-gray-500">{entry.time}</span>
                        </div>
                        <p className="text-sm text-gray-700">{entry.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Related Recordings */}
              <div className="glass-card rounded-3xl p-8">
                <h3 className="text-xl font-light text-gray-800 mb-6">Related Recordings</h3>
                <div className="space-y-3">
                  {recording.relatedRecordings.map((related) => (
                    <button
                      key={related.id}
                      onClick={() => navigate(`/recording/${related.id}`)}
                      className="w-full text-left p-3 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <p className="font-medium text-gray-800 mb-1">{related.title}</p>
                      <p className="text-sm text-gray-600">{related.instructor}</p>
                      <p className="text-xs text-gray-500">{formatTime(related.duration)}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RecordingViewer;
