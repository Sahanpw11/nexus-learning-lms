import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  PaperClipIcon,
  DocumentIcon,
  DocumentDuplicateIcon,
  DocumentChartBarIcon,
  DocumentCheckIcon,
  ArrowDownTrayIcon,
  UserCircleIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

const AssignmentDetails = () => {
  const { assignmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  const fileInputRef = useRef(null);
  
  // Assignment state
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // File upload states
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Student submission states (for teachers to view)
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
    // Student submission status (for students)
  const [submissionStatus, setSubmissionStatus] = useState('not-submitted'); // not-submitted, pending, submitted
  
  // Feedback state (for teachers)
  const [feedback, setFeedback] = useState('');
  const [grade, setGrade] = useState('');
  
  useEffect(() => {
    // Fetch assignment details (mock data for now)
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock assignment data based on ID
        const mockAssignment = {
          id: parseInt(assignmentId),
          title: `Assignment ${assignmentId}: ${getAssignmentTitle(parseInt(assignmentId))}`,
          subject: getAssignmentSubject(parseInt(assignmentId)),
          dueDate: '2025-06-20T23:59:59',
          status: getAssignmentStatus(parseInt(assignmentId)),
          priority: 'high',
          description: 'This assignment requires students to demonstrate understanding of key concepts covered in the course. Please submit all work with proper formatting and citations as discussed in class.',
          detailedInstructions: `<p>Complete the following tasks:</p>
            <ol>
              <li>Solve problems 1-10 in Chapter 5 of the textbook</li>
              <li>Write a 500-word analysis of the key concepts</li>
              <li>Create a diagram illustrating the main process</li>
              <li>Submit all work as a single PDF document</li>
            </ol>
            <p>Your submission will be evaluated based on the following criteria:</p>
            <ul>
              <li>Accuracy of solutions (40%)</li>
              <li>Clarity of explanations (30%)</li>
              <li>Application of concepts (20%)</li>
              <li>Presentation and formatting (10%)</li>
            </ul>`,
          points: 100,
          estimatedTime: '3 hours',
          submissionType: 'File Upload',
          difficulty: 'Advanced',
          resources: [
            { 
              id: 1, 
              name: 'Assignment Guidelines.pdf', 
              type: 'application/pdf', 
              size: 1248000, 
              url: '#'
            },
            { 
              id: 2, 
              name: 'Dataset for Analysis.xlsx', 
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
              size: 524000, 
              url: '#'
            }
          ],
          rubric: [
            { criterion: 'Understanding of Concepts', weight: 30, description: 'Demonstrates thorough understanding of all concepts' },
            { criterion: 'Application', weight: 25, description: 'Correctly applies concepts to solve problems' },
            { criterion: 'Analysis', weight: 25, description: 'Provides insightful analysis with supporting evidence' },
            { criterion: 'Organization', weight: 10, description: 'Work is well-organized and clearly presented' },
            { criterion: 'Citations & Format', weight: 10, description: 'Proper citations and formatting throughout' }
          ]
        };
        
        setAssignment(mockAssignment);
        
        if (isTeacher) {
          // For teachers, fetch student submissions
          const mockSubmissions = [
            { 
              id: 1, 
              studentName: 'Emma Johnson', 
              studentId: 'S10045', 
              submittedAt: '2025-06-18T14:23:00',
              status: 'submitted',
              grade: null,
              feedback: '',
              files: [{ id: 1, name: 'Johnson_Assignment5.pdf', type: 'application/pdf', size: 2345000, url: '#' }] 
            },
            { 
              id: 2, 
              studentName: 'Noah Williams', 
              studentId: 'S10062', 
              submittedAt: '2025-06-19T09:45:00',
              status: 'submitted',
              grade: 85,
              feedback: 'Good work overall. Your analysis section was particularly strong.',
              files: [{ id: 1, name: 'Noah_Williams_Assignment.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 1248000, url: '#' }] 
            },
            { 
              id: 3, 
              studentName: 'Olivia Smith', 
              studentId: 'S10078', 
              submittedAt: '2025-06-17T16:10:00',
              status: 'submitted',
              grade: 92,
              feedback: 'Excellent work. Your diagram was very clear and your explanations were precise.',
              files: [
                { id: 1, name: 'Smith_Assignment_5.pdf', type: 'application/pdf', size: 3145000, url: '#' },
                { id: 2, name: 'Diagrams.png', type: 'image/png', size: 845000, url: '#' }
              ] 
            },
            { 
              id: 4, 
              studentName: 'Liam Brown', 
              studentId: 'S10083', 
              submittedAt: null,
              status: 'not-submitted',
              grade: null,
              feedback: '',
              files: [] 
            },
            { 
              id: 5, 
              studentName: 'Ava Davis', 
              studentId: 'S10091', 
              submittedAt: '2025-06-19T22:05:00',
              status: 'submitted',
              grade: null,
              feedback: '',
              files: [{ id: 1, name: 'Davis_Ava_Assignment5.pdf', type: 'application/pdf', size: 2715000, url: '#' }] 
            }
          ];
          
          setStudentSubmissions(mockSubmissions);
        } else {
          // For students, check their submission status
          const studentHasSubmitted = Math.random() > 0.5;
          if (studentHasSubmitted) {
            setSubmissionStatus('submitted');
            setUploadedFiles([{ 
              id: 1, 
              name: 'My_Assignment_Submission.pdf', 
              type: 'application/pdf', 
              size: 2458000, 
              url: '#' 
            }]);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch assignment details');
        setLoading(false);
      }
    };
    
    fetchAssignment();
  }, [assignmentId, isTeacher]);
  
  // Helper functions for mock data
  const getAssignmentTitle = (id) => {
    const titles = {
      1: 'Calculus Integration Problems',
      2: 'Linear Algebra Matrix Operations',
      3: 'Physics Lab Report - Pendulum Motion',
      4: 'Calculus II Series Convergence',
      5: 'Thermodynamics Problem Set'
    };
    return titles[id] || 'Course Assignment';
  };
  
  const getAssignmentSubject = (id) => {
    const subjects = {
      1: 'Advanced Mathematics',
      2: 'Advanced Mathematics',
      3: 'Physics Fundamentals',
      4: 'Calculus II',
      5: 'Physics Fundamentals'
    };
    return subjects[id] || 'General Studies';
  };
  
  const getAssignmentStatus = (id) => {
    const statuses = {
      1: 'pending',
      2: 'pending',
      3: 'in-progress',
      4: 'pending',
      5: 'overdue'
    };
    return statuses[id] || 'pending';
  };
  
  // File upload handlers
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    
    setUploadingFile(true);
    
    // Simulate upload progress
    const timer = setInterval(() => {
      setUploadProgress(oldProgress => {
        const newProgress = Math.min(oldProgress + 10, 100);
        if (newProgress === 100) {
          clearInterval(timer);
          setTimeout(() => {
            // Process uploaded files
            const newFiles = files.map(file => ({
              id: Date.now() + Math.random().toString(36).substring(2, 9),
              name: file.name,
              type: file.type,
              size: file.size,
              url: URL.createObjectURL(file)
            }));
            
            setUploadedFiles(prev => [...prev, ...newFiles]);
            setUploadingFile(false);
            setUploadProgress(0);
            
            if (!isTeacher) {
              setSubmissionStatus('pending');
            }
          }, 500);
        }
        return newProgress;
      });
    }, 200);
  };
  
  const handleFileDelete = (fileId) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    if (uploadedFiles.length <= 1 && !isTeacher) {
      setSubmissionStatus('not-submitted');
    }
  };
  
  // Submit handlers
  const handleStudentSubmission = () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one file before submitting.');
      return;
    }
    
    // Simulate submission
    setSubmissionStatus('submitting');
    setTimeout(() => {
      setSubmissionStatus('submitted');
      alert('Assignment submitted successfully!');
    }, 1500);
  };
  
  // Feedback and grading handlers (for teachers)
  const handleSubmitFeedback = (studentId) => {
    if (!grade || isNaN(parseInt(grade)) || parseInt(grade) < 0 || parseInt(grade) > 100) {
      alert('Please enter a valid grade between 0 and 100.');
      return;
    }
    
    // Update the submission with feedback and grade
    const updatedSubmissions = studentSubmissions.map(submission => 
      submission.id === selectedSubmission?.id 
        ? { 
            ...submission, 
            grade: parseInt(grade), 
            feedback 
          } 
        : submission
    );
    
    setStudentSubmissions(updatedSubmissions);
    alert('Feedback submitted successfully!');
    setSelectedSubmission(null);
  };
  
  // Function to get file icon based on type
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) {
      return <DocumentIcon className="h-6 w-6 text-red-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <DocumentDuplicateIcon className="h-6 w-6 text-blue-500" />;
    } else if (fileType.includes('sheet') || fileType.includes('excel')) {
      return <DocumentChartBarIcon className="h-6 w-6 text-green-500" />;
    } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
      return <DocumentCheckIcon className="h-6 w-6 text-orange-500" />;
    } else {
      return <DocumentTextIcon className="h-6 w-6 text-gray-500" />;
    }
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
      case 'submitted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
      case 'pending':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'submitted':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'in-progress':
      case 'pending':
        return <ClockIcon className="h-5 w-5" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      default:
        return <DocumentTextIcon className="h-5 w-5" />;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: '#fcfcf7' }}>
        <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error || !assignment) {
    return (
      <div className="min-h-screen flex justify-center items-center flex-col" style={{ backgroundColor: '#fcfcf7' }}>
        <DocumentTextIcon className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-xl font-medium text-gray-800 mb-2">Failed to load assignment</h1>
        <p className="text-gray-600 mb-4">{error || 'Assignment not found'}</p>
        <button
          onClick={() => navigate('/assignments')}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Return to Assignments
        </button>
      </div>
    );
  }

  const dueDate = new Date(assignment.dueDate);
  const formattedDueDate = dueDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const formattedDueTime = dueDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-gradient-radial opacity-30"></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-radial opacity-20"></div>
      
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 animate-slide-up">
            <div>
              <button 
                onClick={() => navigate('/assignments')} 
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
              >
                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                Back to Assignments
              </button>
              
              <div className="flex items-center">              <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-3 mr-3">
                  {assignment.title}
                </h1>
                <div className={`px-3 py-1 rounded-full border text-sm flex items-center space-x-1 ${getStatusBadgeClass(assignment.status)}`}>
                  {getStatusIcon(assignment.status)}
                  <span className="capitalize">{assignment.status.replace('-', ' ')}</span>
                </div>
              </div>
              
              <p className="text-body text-gray-600">
                {assignment.subject} • {assignment.points} points • Due {formattedDueDate} at {formattedDueTime}
              </p>
            </div>
          </div>
          
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Assignment Details */}
              <div className="glass-card rounded-2xl p-8">                <h2 className="text-xl font-medium text-gray-800 mb-4">Assignment Details</h2>
                
                <div className="prose prose-sm max-w-none mb-6">
                  <p className="text-gray-800 mb-4">{assignment.description}</p>
                  <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: assignment.detailedInstructions }} />
                </div>
                
                {/* Attachment Resources */}
                {assignment.resources && assignment.resources.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Resources</h3>
                    <div className="space-y-2">
                      {assignment.resources.map(resource => (
                        <div key={resource.id} className="flex items-center border border-gray-200 p-3 rounded-lg bg-gray-50">
                          <div className="flex-shrink-0 mr-3">
                            {getFileIcon(resource.type)}
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-gray-800 font-medium truncate">{resource.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(resource.size)}</p>
                          </div>
                          <a 
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700"
                          >
                            <ArrowDownTrayIcon className="h-5 w-5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Rubric */}
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-xl font-medium text-gray-800 mb-4">Grading Rubric</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>                      <tr>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Criterion</th>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Weight (%)</th>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Description</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {assignment.rubric.map((item, index) => (                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.criterion}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.weight}%</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* File Upload and Submission Section - For Students */}
              {!isTeacher && (
                <div className="glass-card rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium text-gray-800">Your Submission</h2>
                    <div className={`px-3 py-1 rounded-full border text-sm flex items-center space-x-1 ${
                      submissionStatus === 'submitted' ? 'bg-green-100 text-green-700 border-green-200' :
                      submissionStatus === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {submissionStatus === 'submitted' ? <CheckCircleIcon className="h-4 w-4" /> :
                       submissionStatus === 'pending' ? <ClockIcon className="h-4 w-4" /> :
                       <DocumentTextIcon className="h-4 w-4" />
                      }
                      <span className="capitalize">{submissionStatus.replace('-', ' ')}</span>
                    </div>
                  </div>
                  
                  {uploadedFiles.length > 0 ? (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h3>
                      <div className="space-y-2">
                        {uploadedFiles.map(file => (
                          <div key={file.id} className="flex items-center border border-gray-200 p-3 rounded-lg bg-gray-50">
                            <div className="flex-shrink-0 mr-3">
                              {getFileIcon(file.type)}
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-gray-800 font-medium truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                            {submissionStatus !== 'submitted' && (
                              <button 
                                onClick={() => handleFileDelete(file.id)}
                                className="flex-shrink-0 p-2 text-red-500 hover:text-red-700"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            )}
                            <a 
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-xl mb-6">
                      <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-700">No files uploaded</h3>
                      <p className="mt-1 text-xs text-gray-500">Upload your assignment files to submit</p>
                      {submissionStatus !== 'submitted' && (
                        <button
                          type="button"
                          onClick={handleFileUploadClick}
                          className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                          Upload Files
                        </button>
                      )}
                    </div>
                  )}
                  
                  {submissionStatus !== 'submitted' && (
                    <>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileUpload}
                        multiple
                      />
                      
                      {uploadingFile && (
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Uploading...</span>
                            <span className="text-sm text-gray-500">{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-orange-500 h-2.5 rounded-full transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={handleFileUploadClick}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none flex items-center space-x-2"
                          disabled={uploadingFile}
                        >
                          <ArrowUpTrayIcon className="h-5 w-5" />
                          <span>{uploadedFiles.length > 0 ? 'Upload More Files' : 'Upload Files'}</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={handleStudentSubmission}
                          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={uploadedFiles.length === 0 || uploadingFile || submissionStatus === 'submitting'}
                        >
                          {submissionStatus === 'submitting' ? (
                            <>
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <PaperClipIcon className="h-5 w-5" />
                              <span>Submit Assignment</span>
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                  
                  {submissionStatus === 'submitted' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                      <div>
                        <h4 className="font-medium text-green-800">Assignment submitted successfully</h4>
                        <p className="text-sm text-green-600">Your work has been submitted and is awaiting review by your instructor.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Student Submissions - For Teachers */}
              {isTeacher && (
                <div className="glass-card rounded-2xl p-8">
                  <h2 className="text-xl font-medium text-gray-800 mb-6">Student Submissions</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>                          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Student</th>
                          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Submission Date</th>
                          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Grade</th>
                          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {studentSubmissions.map((submission) => (
                          <tr key={submission.id}>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <UserCircleIcon className="h-8 w-8 text-gray-400 mr-3" />
                                <div>
                                  <div className="text-sm font-medium text-gray-800">{submission.studentName}</div>
                                  <div className="text-xs text-gray-500">{submission.studentId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs ${
                                submission.status === 'submitted' ? 'bg-green-100 text-green-700' :
                                submission.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {submission.status === 'submitted' ? 'Submitted' :
                                 submission.status === 'in-progress' ? 'In Progress' :
                                 'Not Submitted'
                                }
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-700">
                                {submission.submittedAt ? 
                                  new Date(submission.submittedAt).toLocaleDateString() + ' at ' + 
                                  new Date(submission.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                                  'N/A'
                                }
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium">
                                {submission.grade !== null ? 
                                  <span className={`${
                                    submission.grade >= 90 ? 'text-green-600' :
                                    submission.grade >= 80 ? 'text-blue-600' :
                                    submission.grade >= 70 ? 'text-yellow-600' :
                                    'text-red-600'
                                  }`}>
                                    {submission.grade}/100
                                  </span> : 
                                  <span className="text-gray-500">Not graded</span>
                                }
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {submission.status === 'submitted' && (
                                <button 
                                  onClick={() => setSelectedSubmission(submission)}
                                  className="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition-colors"
                                >
                                  {submission.grade !== null ? 'Edit Feedback' : 'Grade Submission'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Teacher File Upload Section */}
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Upload Assignment Resources</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Add reference materials, lecture notes, or assignment templates for students.
                    </p>
                    
                    {uploadedFiles.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Your Uploaded Resources</h4>
                        <div className="space-y-2">
                          {uploadedFiles.map(file => (
                            <div key={file.id} className="flex items-center border border-gray-200 p-3 rounded-lg bg-gray-50">
                              <div className="flex-shrink-0 mr-3">
                                {getFileIcon(file.type)}
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="text-gray-800 font-medium truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>
                              <button 
                                onClick={() => handleFileDelete(file.id)}
                                className="flex-shrink-0 p-2 text-red-500 hover:text-red-700"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileUpload}
                      multiple
                    />
                    
                    {uploadingFile && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Uploading...</span>
                          <span className="text-sm text-gray-500">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-orange-500 h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={handleFileUploadClick}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none flex items-center space-x-2"
                      disabled={uploadingFile}
                    >
                      <ArrowUpTrayIcon className="h-5 w-5" />
                      <span>Upload Resources</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Assignment Meta */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Assignment Information</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <ClockIcon className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Due Date</p>
                      <p className="text-sm text-gray-600">{formattedDueDate}</p>
                      <p className="text-sm text-gray-600">{formattedDueTime}</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <StarIcon className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Points</p>
                      <p className="text-sm text-gray-600">{assignment.points} points</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ClockIcon className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Estimated Time</p>
                      <p className="text-sm text-gray-600">{assignment.estimatedTime}</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <DocumentTextIcon className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Submission Type</p>
                      <p className="text-sm text-gray-600">{assignment.submissionType}</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <AcademicCapIcon className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Difficulty</p>
                      <p className="text-sm text-gray-600">{assignment.difficulty}</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              {/* Teacher Feedback (for students) */}
              {!isTeacher && submissionStatus === 'submitted' && (
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-800">Teacher Feedback</h2>
                    {Math.random() > 0.5 ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg">
                        Graded
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-lg">
                        Pending
                      </span>
                    )}
                  </div>
                  
                  {Math.random() > 0.5 ? (
                    <>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-800">Grade</h3>
                          <span className="text-lg font-medium text-green-600">92/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">Comments</h3>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                          Excellent work on this assignment. Your analysis was thorough and you showed a deep understanding of the concepts. Your presentation could be improved slightly for clarity, but overall this is outstanding work.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Your submission is being reviewed</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Feedback Modal - For Teachers */}
      {isTeacher && selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 shadow-xl animate-fade-scale">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-gray-800">
                  Submission Feedback
                </h2>
                <button 
                  onClick={() => setSelectedSubmission(null)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 mb-1">Student: <span className="font-medium">{selectedSubmission.studentName}</span></p>
                <p className="text-gray-700 mb-1">ID: <span className="font-medium">{selectedSubmission.studentId}</span></p>
                <p className="text-gray-700">
                  Submitted: <span className="font-medium">
                    {selectedSubmission.submittedAt ? 
                      new Date(selectedSubmission.submittedAt).toLocaleDateString() + ' at ' + 
                      new Date(selectedSubmission.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                      'Not submitted'
                    }
                  </span>
                </p>
              </div>
              
              {/* Student Files */}
              {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Submission Files</h3>
                  <div className="space-y-2">
                    {selectedSubmission.files.map(file => (
                      <div key={file.id} className="flex items-center border border-gray-200 p-3 rounded-lg bg-gray-50">
                        <div className="flex-shrink-0 mr-3">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-gray-800 font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                        <a 
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Grade Input */}
              <div className="mb-4">
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                  Grade (out of 100)
                </label>                <input
                  type="number"
                  id="grade"
                  min="0"
                  max="100"
                  value={grade !== null ? grade : selectedSubmission.grade || ''}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
                  placeholder="Enter grade (0-100)"
                />
              </div>
              
              {/* Feedback Input */}
              <div className="mb-6">
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback
                </label>                <textarea
                  id="feedback"
                  value={feedback !== '' ? feedback : selectedSubmission.feedback || ''}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
                  placeholder="Provide feedback to the student on their submission"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmitFeedback(selectedSubmission.id)}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default AssignmentDetails;
