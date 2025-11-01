import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {
  ArrowLeftIcon,
  VideoCameraIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  CameraIcon,
  BookOpenIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const ScheduleSession = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState({
    title: '',
    subject: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    maxParticipants: 30,
    recordingEnabled: true,
    chatEnabled: true,
    whiteboardEnabled: true,
    isRecurring: false,
    recurringPattern: 'weekly',
    recurringEnd: '',
    sessionType: 'lecture',
    visibility: 'class'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setSessionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Session scheduled successfully!');
      navigate('/live-sessions');
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Title *
                </label>
                <input
                  type="text"
                  value={sessionData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Advanced Calculus - Integration Techniques"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  value={sessionData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Literature">Literature</option>
                  <option value="History">History</option>
                  <option value="Economics">Economics</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={sessionData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Describe what will be covered in this session..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Type
                </label>
                <select
                  value={sessionData.sessionType}
                  onChange={(e) => handleInputChange('sessionType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="lecture">Lecture</option>
                  <option value="workshop">Workshop</option>
                  <option value="discussion">Discussion</option>
                  <option value="lab">Lab Session</option>
                  <option value="seminar">Seminar</option>
                  <option value="tutorial">Tutorial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibility
                </label>
                <select
                  value={sessionData.visibility}
                  onChange={(e) => handleInputChange('visibility', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="class">Class Only</option>
                  <option value="department">Department</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Schedule & Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={sessionData.scheduledDate}
                  onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  value={sessionData.scheduledTime}
                  onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <select
                  value={sessionData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Participants
              </label>
              <input
                type="number"
                value={sessionData.maxParticipants}
                onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="1"
                max="100"
              />
            </div>

            {/* Recurring Options */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={sessionData.isRecurring}
                  onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                  Make this a recurring session
                </label>
              </div>

              {sessionData.isRecurring && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-7">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Repeat Pattern
                    </label>
                    <select
                      value={sessionData.recurringPattern}
                      onChange={(e) => handleInputChange('recurringPattern', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={sessionData.recurringEnd}
                      onChange={(e) => handleInputChange('recurringEnd', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Features & Permissions</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <CameraIcon className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-800">Recording</p>
                    <p className="text-sm text-gray-600">Allow session recording for later viewing</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={sessionData.recordingEnabled}
                  onChange={(e) => handleInputChange('recordingEnabled', e.target.checked)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-800">Chat</p>
                    <p className="text-sm text-gray-600">Enable live chat during session</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={sessionData.chatEnabled}
                  onChange={(e) => handleInputChange('chatEnabled', e.target.checked)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <PencilSquareIcon className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-800">Whiteboard</p>
                    <p className="text-sm text-gray-600">Interactive whiteboard for teaching</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={sessionData.whiteboardEnabled}
                  onChange={(e) => handleInputChange('whiteboardEnabled', e.target.checked)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
              </div>
            </div>

            {/* Session Summary */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-gray-800 mb-4">Session Summary</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Title:</span> {sessionData.title || 'Not specified'}</p>
                <p><span className="font-medium">Subject:</span> {sessionData.subject || 'Not specified'}</p>
                <p><span className="font-medium">Date & Time:</span> {sessionData.scheduledDate} at {sessionData.scheduledTime}</p>
                <p><span className="font-medium">Duration:</span> {sessionData.duration} minutes</p>
                <p><span className="font-medium">Max Participants:</span> {sessionData.maxParticipants}</p>
                <p><span className="font-medium">Features:</span> 
                  {sessionData.recordingEnabled && ' Recording'}
                  {sessionData.chatEnabled && ' Chat'}
                  {sessionData.whiteboardEnabled && ' Whiteboard'}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-20 relative z-10">
        <div className="max-w-4xl mx-auto px-8 py-12">
          
          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center mb-6">
              <button
                onClick={() => navigate('/live-sessions')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-2">
                  Schedule <span className="text-gradient">Session</span>
                </h1>
                <p className="text-body text-gray-600">Create a new live session for your students</p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  currentStep >= step 
                    ? 'bg-orange-500 border-orange-500 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step ? (
                    <CheckCircleIcon className="h-5 w-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-20 h-0.5 mx-4 transition-colors ${
                    currentStep > step ? 'bg-orange-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="glass-card rounded-3xl p-8 mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            <div className="flex space-x-3">
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={!sessionData.title || !sessionData.subject}
                  className={`px-6 py-3 rounded-xl transition-colors ${
                    !sessionData.title || !sessionData.subject
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !sessionData.scheduledDate || !sessionData.scheduledTime}
                  className={`px-6 py-3 rounded-xl transition-colors flex items-center space-x-2 ${
                    isSubmitting || !sessionData.scheduledDate || !sessionData.scheduledTime
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <>
                      <VideoCameraIcon className="h-4 w-4" />
                      <span>Schedule Session</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ScheduleSession;
