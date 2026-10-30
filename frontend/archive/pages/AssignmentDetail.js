import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {
  ArrowLeftIcon,
  ClockIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
  EyeIcon,
  StarIcon,
  AcademicCapIcon,
  BookmarkIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

// Custom styles for this component
const customStyles = {
  customButton: {
    color: "#333",  // Ensure text is dark and visible
    background: "rgba(255, 255, 255, 0.5)",
    border: "1px solid rgba(200, 200, 200, 0.8)",
  },
  customTabButton: {
    color: "#333",  // Dark text for tab buttons
  },
  cardWithPadding: {
    paddingTop: "1.5rem",
    paddingBottom: "1.5rem",
  }
};

const AssignmentDetail = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignmentData, setAssignmentData] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState({
    text: '',
    files: [],
    status: 'draft'
  });

  // Mock assignment data - in real app, fetch based on assignmentId
  useEffect(() => {
    const fetchAssignmentData = () => {
      const mockAssignmentData = {
        id: parseInt(assignmentId),
        title: 'Advanced Mathematics Assignment #3',
        subject: 'Advanced Mathematics',
        instructor: 'Dr. John Smith',
        dueDate: '2025-06-18T23:59:00',
        submittedDate: null,
        status: 'pending',
        priority: 'high',
        points: 100,
        estimatedTime: '3 hours',
        timeLimit: 180, // 3 hours in minutes
        attempts: 1,
        maxAttempts: 2,
        difficulty: 'Advanced',
        submissionType: 'Written Work',
        
        description: `Complete the assigned mathematics problems by downloading the assignment file, working through the problems, and uploading your completed solutions. Show all your work and provide clear explanations for each step.
        
        This assignment covers:
        - Advanced mathematical concepts
        - Problem-solving techniques
        - Mathematical reasoning and proofs
        - Applications of mathematical principles
        
        Please submit your solutions as a PDF document with clear handwriting or typed responses.`,
        
        // Assignment instructions and materials
        instructions: [
          'Download the assignment file from the resources section',
          'Complete all problems showing your work',
          'Scan or type your solutions into a single PDF',
          'Upload your completed assignment before the deadline',
          'Include your name and student ID on each page'
        ],
        
        // Assignment files provided by teacher
        assignmentFiles: [
          {
            id: 1,
            name: 'Mathematics_Assignment_3.pdf',
            type: 'application/pdf',
            size: '2.4 MB',
            uploadedBy: 'Dr. John Smith',
            uploadedAt: '2025-06-10T09:00:00',
            description: 'Main assignment file with all mathematics problems'
          },
          {
            id: 2,
            name: 'Formula_Reference_Sheet.pdf',
            type: 'application/pdf',
            size: '1.1 MB',
            uploadedBy: 'Dr. John Smith',
            uploadedAt: '2025-06-10T09:05:00',
            description: 'Reference formulas and solution techniques'
          }
        ],
        
        // Resources and materials
        resources: [
          {
            id: 1,
            title: 'Mathematics Reference Guide',
            type: 'document',
            url: '/resources/math-reference.pdf',
            description: 'Comprehensive guide to mathematical methods'
          },
          {
            id: 2,
            title: 'Video: Problem Solving Techniques',
            type: 'video',
            url: '/videos/problem-solving',
            duration: '20 min',
            description: 'Step-by-step tutorial on mathematical problem solving'
          },
          {
            id: 3,
            title: 'Practice Problems',
            type: 'document',
            url: '/practice/math-practice.pdf',
            description: 'Additional practice problems with solutions'
          }
        ],
        
        // Submission details
        submissionDetails: {
          allowedFormats: ['.pdf', '.doc', '.docx'],
          maxFileSize: '10 MB',
          submissionMethod: 'File Upload',
          latePolicy: 'Late submissions lose 10% per day',
          rubric: [
            { criteria: 'Correctness', points: 40, description: 'Mathematical accuracy and correct solutions' },
            { criteria: 'Work Shown', points: 30, description: 'Clear demonstration of problem-solving steps' },
            { criteria: 'Presentation', points: 20, description: 'Neat, organized, and readable submission' },
            { criteria: 'Following Instructions', points: 10, description: 'Adherence to submission guidelines' }
          ]
        },
        
        // Class context
        classInfo: {
          id: 1,
          name: 'Advanced Mathematics',
          room: 'Room 301',
          nextClass: '2025-06-17T14:00:00'
        },
        
        // Submission history (for students who have submitted)
        previousSubmissions: [],
        
        // Comments and feedback
        comments: [],
        
        // For teachers - submission statistics
        submissionStats: {
          total: 25,
          submitted: 8,
          pending: 17,
          graded: 3,
          averageScore: 78
        }
      };
      
      setAssignmentData(mockAssignmentData);
      setLoading(false);
    };

    fetchAssignmentData();
  }, [assignmentId]);

  const handleSubmit = () => {
    setSubmission(prev => ({ ...prev, status: 'submitted' }));
    // In real app, send to API
    alert('Assignment submitted successfully!');
  };

  const handleSaveDraft = () => {
    setSubmission(prev => ({ ...prev, status: 'draft' }));
    // In real app, save to API
    alert('Draft saved!');
  };

  const getTabContent = () => {
    if (!assignmentData) return null;

    switch (activeTab) {
      case 'details':
        return <DetailsTab assignmentData={assignmentData} userRole={user?.role} />;      case 'work':
        return <WorkTab assignmentData={assignmentData} submission={submission} setSubmission={setSubmission} userRole={user?.role} handleSaveDraft={handleSaveDraft} handleSubmit={handleSubmit} />;
      case 'resources':
        return <ResourcesTab resources={assignmentData.resources} />;
      case 'submissions':
        return <SubmissionsTab assignmentData={assignmentData} userRole={user?.role} />;
      case 'rubric':
        return <RubricTab rubric={assignmentData.submissionDetails.rubric} />;
      default:
        return <DetailsTab assignmentData={assignmentData} userRole={user?.role} />;
    }
  };

  const getTabs = () => {
    const baseTabs = [
      { id: 'details', name: 'Details', icon: DocumentTextIcon },
      { id: 'work', name: 'Work Area', icon: PencilSquareIcon },
      { id: 'resources', name: 'Resources', icon: BookmarkIcon },
      { id: 'rubric', name: 'Rubric', icon: StarIcon }
    ];

    if (user?.role === 'teacher') {
      return [
        ...baseTabs,
        { id: 'submissions', name: 'Submissions', icon: UserGroupIcon }
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
            <p className="text-gray-600">Loading assignment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!assignmentData) {
    return (
      <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
        <Sidebar />
        <div className="ml-20 relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-light text-gray-800 mb-4">Assignment Not Found</h1>
            <button 
              onClick={() => navigate('/assignments')}
              className="btn-primary px-6 py-3 rounded-xl"
            >
              Back to Assignments
            </button>
          </div>
        </div>
      </div>    );
  }
  return (
    <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-gradient-radial opacity-30"></div>
      
      <Sidebar />
      
      {/* Main Content */}      <div className="ml-20 relative z-10 overflow-y-auto h-screen pb-12" style={{ paddingBottom: '2rem' }}>
        <div className="max-w-7xl mx-auto px-8 py-12">
          
          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center mb-6">
              <button
                onClick={() => navigate('/assignments')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex-1">
                <div className="flex items-baseline space-x-3 mb-2">
                  <h1 className="text-display font-montserrat font-extralight text-gray-800">
                    {assignmentData.title}
                  </h1>
                  <span className={`self-start mt-2 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    assignmentData.priority === 'high' 
                      ? 'bg-red-100 text-red-600' 
                      : assignmentData.priority === 'medium' 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {assignmentData.priority} priority
                  </span>
                </div>
                <p className="text-body text-gray-600">{assignmentData.subject} • {assignmentData.instructor}</p>
              </div>
                {/* Action Buttons */}
              {user?.role === 'teacher' && (
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setActiveTab('submissions')}
                    className="btn-secondary px-4 py-2 rounded-xl flex items-center space-x-2"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    <span>Edit Assignment</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('submissions')}
                    className="btn-primary px-4 py-2 rounded-xl flex items-center space-x-2"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span>View Submissions</span>
                  </button>
                </div>
              )}
              
              {user?.role === 'student' && (
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setActiveTab('work')}
                    className="btn-primary px-4 py-2 rounded-xl flex items-center space-x-2"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    <span>Start Working</span>
                  </button>
                </div>
              )}
            </div>

            {/* Assignment Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Due Date</p>
                    <p className="text-title font-light text-gray-800">
                      {new Date(assignmentData.dueDate).toLocaleDateString()}
                    </p>
                    <p className="text-caption text-gray-600">
                      {new Date(assignmentData.dueDate).toLocaleTimeString()}
                    </p>
                  </div>
                  <CalendarDaysIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Points</p>
                    <p className="text-title font-light text-gray-800">{assignmentData.points}</p>
                  </div>
                  <StarIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Time Limit</p>
                    <p className="text-title font-light text-gray-800">{assignmentData.estimatedTime}</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Attempts</p>
                    <p className="text-title font-light text-gray-800">
                      {assignmentData.attempts}/{assignmentData.maxAttempts}
                    </p>
                  </div>
                  <CheckCircleIcon className="h-8 w-8 text-orange-500 opacity-60" />
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
                      onClick={() => setActiveTab(tab.id)}                      className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      style={customStyles.customTabButton}
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
        </div>      </div>
      
      <div className="ml-20 relative z-10 pb-6">
        <Footer />
      </div>
    </div>
  );
};

// Details Tab Component
const DetailsTab = ({ assignmentData, userRole }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Left Column - Main Content */}
    <div className="lg:col-span-2 space-y-8">
      {/* Description */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Assignment Description</h3>
        <div className="prose prose-gray max-w-none">
          <div className="whitespace-pre-line text-gray-700 leading-relaxed">
            {assignmentData.description}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Instructions</h3>
        <ul className="space-y-3">
          {assignmentData.instructions.map((instruction, index) => (
            <li key={index} className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <span className="text-gray-700">{instruction}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Assignment Files */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Assignment Files ({assignmentData.assignmentFiles.length})</h3>
        <div className="space-y-4">
          {assignmentData.assignmentFiles.map((file) => (
            <div key={file.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{file.name}</h4>
                    <p className="text-sm text-gray-600">{file.description}</p>
                    <p className="text-xs text-gray-500">{file.size}</p>
                  </div>
                </div>
                <button className="btn-secondary px-3 py-2 rounded-lg text-sm">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Right Column - Sidebar */}
    <div className="space-y-8">
      {/* Assignment Info */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Assignment Info</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Difficulty</p>
            <p className="text-gray-800">{assignmentData.difficulty}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Type</p>
            <p className="text-gray-800">{assignmentData.submissionType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
              assignmentData.status === 'completed' 
                ? 'bg-green-100 text-green-600' 
                : assignmentData.status === 'submitted' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-yellow-100 text-yellow-600'
            }`}>
              {assignmentData.status}
            </span>
          </div>
        </div>
      </div>

      {/* Submission Requirements */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Submission Details</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Format</p>
            <p className="text-gray-800">{assignmentData.submissionDetails.allowedFormats.join(', ')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Max File Size</p>
            <p className="text-gray-800">{assignmentData.submissionDetails.maxFileSize}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Method</p>
            <p className="text-gray-800">{assignmentData.submissionDetails.submissionMethod}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Late Policy</p>
            <p className="text-gray-800">{assignmentData.submissionDetails.latePolicy}</p>
          </div>
        </div>
      </div>

      {/* Class Information */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Class Information</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">Class</p>
            <p className="text-gray-800">{assignmentData.classInfo.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Room</p>
            <p className="text-gray-800">{assignmentData.classInfo.room}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Next Class</p>
            <p className="text-gray-800">
              {new Date(assignmentData.classInfo.nextClass).toLocaleDateString()} at{' '}
              {new Date(assignmentData.classInfo.nextClass).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {userRole === 'student' && (
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-2xl font-light text-gray-800 mb-6">Quick Actions</h3>
          <div className="space-y-3">            <button className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium" style={customStyles.customButton}>
              Ask Question
            </button>
            <button className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium" style={customStyles.customButton}>
              Set Reminder
            </button>
            <button className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium" style={customStyles.customButton}>
              View Calendar
            </button>
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Upcoming Events</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Next Class</p>
              <p className="text-xs text-gray-600">
                {new Date(assignmentData.classInfo.nextClass).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <ClockIcon className="h-5 w-5 text-orange-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Assignment Due</p>
              <p className="text-xs text-gray-600">
                {new Date(assignmentData.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Work Tab Component
const WorkTab = ({ assignmentData, submission, setSubmission, userRole, handleSaveDraft, handleSubmit }) => {
  if (userRole !== 'student') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Work area is only available for students.</p>
      </div>
    );
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setSubmission(prev => ({ 
      ...prev, 
      files: [...prev.files, ...files.map(file => ({
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      }))]
    }));
  };

  const removeFile = (fileId) => {
    setSubmission(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Main Work Area */}
      <div className="lg:col-span-2 space-y-8">
        {/* Assignment Files to Download */}
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-2xl font-light text-gray-800 mb-6">Assignment Files</h3>
          <p className="text-gray-600 mb-6">Download the assignment files below to complete your work:</p>
          
          <div className="space-y-4">
            {assignmentData.assignmentFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{file.name}</h4>
                    <p className="text-sm text-gray-600">{file.description}</p>
                    <p className="text-xs text-gray-500">
                      {file.size} • Uploaded by {file.uploadedBy} on {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="btn-secondary px-4 py-2 rounded-lg flex items-center space-x-2">
                  <CloudArrowUpIcon className="h-4 w-4 rotate-180" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* File Upload Area */}
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-2xl font-light text-gray-800 mb-6">Submit Your Work</h3>
          
          {/* Upload Zone */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors mb-6">
            <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Upload your completed assignment</p>
            <p className="text-sm text-gray-500 mb-4">
              Supports: {assignmentData.submissionDetails.allowedFormats.join(', ')} 
              (Max: {assignmentData.submissionDetails.maxFileSize})
            </p>
            <input
              type="file"
              id="fileUpload"
              multiple
              accept={assignmentData.submissionDetails.allowedFormats.join(',')}
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="fileUpload"
              className="btn-secondary px-6 py-3 rounded-xl cursor-pointer inline-block"
            >
              Choose Files
            </label>
          </div>

          {/* Uploaded Files List */}
          {submission.files.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Uploaded Files:</h4>
              {submission.files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DocumentTextIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(file.size)} • {file.type}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-red-600 hover:text-red-800 px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}          {/* Additional Comments */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              value={submission.text}
              onChange={(e) => setSubmission(prev => ({ ...prev, text: e.target.value }))}
              className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Add any additional comments or notes about your submission..."
            />
          </div>          {/* Submit Buttons */}
          <div className="mt-8 flex space-x-4">
            <button 
              onClick={handleSaveDraft}
              className="flex-1 btn-secondary px-6 py-3 rounded-xl flex items-center justify-center space-x-2"
            >
              <CheckCircleIcon className="h-5 w-5" />
              <span>Save Draft</span>
            </button>
            <button 
              onClick={handleSubmit}
              disabled={submission.files.length === 0}
              className={`flex-1 px-6 py-3 rounded-xl flex items-center justify-center space-x-2 ${
                submission.files.length === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'btn-primary hover:bg-orange-600'
              }`}
            >
              <CloudArrowUpIcon className="h-5 w-5" />
              <span>Submit Assignment</span>
            </button>
          </div>
          
          {submission.files.length === 0 && (
            <p className="text-sm text-gray-500 text-center mt-2">
              Please upload at least one file before submitting
            </p>
          )}
        </div>
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-8">
        {/* Submission Status */}
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-2xl font-light text-gray-800 mb-6">Submission Status</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                submission.status === 'submitted' 
                  ? 'bg-green-100 text-green-600' 
                  : submission.status === 'draft' 
                  ? 'bg-yellow-100 text-yellow-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {submission.status || 'Not Started'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Files Uploaded</p>
              <p className="text-gray-800">{submission.files.length} file(s)</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Last Saved</p>
              <p className="text-gray-800">
                {submission.files.length > 0 ? 'Just now' : 'Never'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-2xl font-light text-gray-800 mb-6">Progress</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-700">Download assignment files</span>
            </div>
            <div className={`flex items-center space-x-3 ${submission.files.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
              <CheckCircleIcon className="h-5 w-5" />
              <span className="text-sm">Upload completed work</span>
            </div>
            <div className={`flex items-center space-x-3 ${submission.status === 'submitted' ? 'text-green-600' : 'text-gray-400'}`}>
              <CheckCircleIcon className="h-5 w-5" />
              <span className="text-sm">Submit assignment</span>
            </div>
          </div>
        </div>

        {/* Time Remaining */}
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-2xl font-light text-gray-800 mb-6">Time Remaining</h3>
          <div className="text-center">
            <div className="text-3xl font-light text-orange-500 mb-2">
              {Math.ceil((new Date(assignmentData.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days
            </div>
            <p className="text-sm text-gray-600">
              Due: {new Date(assignmentData.dueDate).toLocaleDateString()} at {new Date(assignmentData.dueDate).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Help & Resources */}
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-2xl font-light text-gray-800 mb-6">Need Help?</h3>
          <div className="space-y-3">            <button className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium" style={customStyles.customButton}>
              Contact Instructor
            </button>
            <button className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium" style={customStyles.customButton}>
              View Resources
            </button>
            <button className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium" style={customStyles.customButton}>
              Technical Support
            </button>
          </div>
        </div>      </div>
    </div>
  );
};

// Resources Tab Component
const ResourcesTab = ({ resources }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Left Column - Main Content */}
    <div className="lg:col-span-2">
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Course Resources</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    </div>

    {/* Right Column - Sidebar */}
    <div className="space-y-8">
      {/* Resource Help */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Need Help?</h3>
        <div className="space-y-3">
          <button className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium">
            Request Resource
          </button>
          <button className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium">
            Report Issue
          </button>
          <button className="w-full btn-secondary py-3 px-4 rounded-xl text-sm font-medium">
            Contact Support
          </button>
        </div>
      </div>

      {/* Resource Stats */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Resources Overview</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Resources</p>
            <p className="text-gray-800">{resources.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Video Content</p>
            <p className="text-gray-800">{resources.filter(r => r.type === 'video').length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Documents</p>
            <p className="text-gray-800">{resources.filter(r => r.type === 'document').length}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Submissions Tab Component (Teacher only)
const SubmissionsTab = ({ assignmentData, userRole }) => {
  if (userRole !== 'teacher') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Submissions tab is only available for teachers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Submission Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Total</p>
              <p className="text-title font-light text-gray-800">{assignmentData.submissionStats.total}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-orange-500 opacity-60" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Submitted</p>
              <p className="text-title font-light text-gray-800">{assignmentData.submissionStats.submitted}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500 opacity-60" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Graded</p>
              <p className="text-title font-light text-gray-800">{assignmentData.submissionStats.graded}</p>
            </div>
            <StarIcon className="h-8 w-8 text-blue-500 opacity-60" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Avg Score</p>
              <p className="text-title font-light text-gray-800">{assignmentData.submissionStats.averageScore}%</p>
            </div>
            <AcademicCapIcon className="h-8 w-8 text-purple-500 opacity-60" />
          </div>
        </div>
      </div>

      <div className="text-center py-12">
        <p className="text-gray-600">Detailed submission list and grading interface would go here.</p>
      </div>
    </div>
  );
};

// Rubric Tab Component
const RubricTab = ({ rubric }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Left Column - Main Content */}
    <div className="lg:col-span-2">
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Grading Rubric</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criteria</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rubric.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{item.criteria}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{item.points}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{item.description}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* Right Column - Sidebar */}
    <div className="space-y-8">
      {/* Rubric Summary */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Rubric Summary</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Points</p>
            <p className="text-gray-800">{rubric.reduce((sum, item) => sum + item.points, 0)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Criteria Count</p>
            <p className="text-gray-800">{rubric.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Grading Scale</p>
            <p className="text-gray-800">Points-based</p>
          </div>
        </div>
      </div>

      {/* Grading Help */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-light text-gray-800 mb-6">Understanding Grades</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-800">90-100%</p>
              <p className="text-xs text-gray-600">Excellent</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-800">80-89%</p>
              <p className="text-xs text-gray-600">Good</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-800">70-79%</p>
              <p className="text-xs text-gray-600">Satisfactory</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-800">Below 70%</p>
              <p className="text-xs text-gray-600">Needs Improvement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Helper Components
const ResourceCard = ({ resource }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return PencilSquareIcon;
      case 'document':
        return DocumentTextIcon;
      default:
        return BookmarkIcon;
    }
  };

  const Icon = getTypeIcon(resource.type);

  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-orange-100 rounded-xl">
          <Icon className="h-6 w-6 text-orange-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-medium text-gray-800 mb-2">{resource.title}</h4>
          <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
          {resource.duration && (
            <p className="text-xs text-gray-500 mb-3">Duration: {resource.duration}</p>
          )}
          <button className="w-full btn-secondary py-2 px-4 rounded-xl text-sm font-medium">
            {resource.type === 'video' ? 'Watch' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetail;
