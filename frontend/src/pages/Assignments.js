import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {
  PlusIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  DocumentTextIcon,
  XMarkIcon,
  PaperClipIcon // Added for file attachments
} from '@heroicons/react/24/outline';

const Assignments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    dueDate: '',
    priority: 'medium',
    description: '',
    points: 100,
    estimatedTime: '',
    submissionType: 'Written Work',
    difficulty: 'Intermediate',
    attachments: [] // Adding attachments array to store uploaded files
  });

  // Mock data - replace with API call
  const getAllAssignments = () => [
      // Teacher 1 assignments (Mathematics & Physics)
      {
        id: 1,
        title: 'Calculus Integration Problems',
        subject: 'Advanced Mathematics',
        dueDate: '2025-06-17',
        status: 'pending',
        priority: 'high',
        description: 'Solve 10 integration problems using various techniques including substitution, integration by parts, and partial fractions.',
        points: 100,
        estimatedTime: '3 hours',
        submissionType: 'Written Work',
        instructor: 'Dr. John Smith',
        difficulty: 'Advanced',
        teacherId: 'teacher_1'
      },
      {
        id: 2,
        title: 'Linear Algebra Matrix Operations',
        subject: 'Advanced Mathematics',
        dueDate: '2025-06-20',
        status: 'pending',
        priority: 'medium',
        description: 'Complete matrix multiplication, determinant calculations, and eigenvalue problems.',
        points: 85,
        estimatedTime: '2.5 hours',
        submissionType: 'Written Work',
        instructor: 'Dr. John Smith',
        difficulty: 'Intermediate',
        teacherId: 'teacher_1'
      },
      {
        id: 3,
        title: 'Physics Lab Report - Pendulum Motion',
        subject: 'Physics Fundamentals',
        dueDate: '2025-06-19',
        status: 'in-progress',
        priority: 'high',
        description: 'Analyze pendulum motion data and calculate gravitational acceleration with error analysis.',
        points: 120,
        estimatedTime: '4 hours',
        submissionType: 'Lab Report',
        instructor: 'Dr. John Smith',
        difficulty: 'Advanced',
        teacherId: 'teacher_1'
      },
      {
        id: 4,
        title: 'Calculus II Series Convergence',
        subject: 'Calculus II',
        dueDate: '2025-06-22',
        status: 'pending',
        priority: 'medium',
        description: 'Determine convergence of infinite series using various tests.',
        points: 90,
        estimatedTime: '3 hours',
        submissionType: 'Written Work',
        instructor: 'Dr. John Smith',
        difficulty: 'Advanced',
        teacherId: 'teacher_1'
      },
      {
        id: 5,
        title: 'Thermodynamics Problem Set',
        subject: 'Physics Fundamentals',
        dueDate: '2025-06-15',
        status: 'overdue',
        priority: 'high',
        description: 'Solve problems related to heat, work, entropy, and the laws of thermodynamics.',
        points: 80,
        estimatedTime: '3 hours',
        submissionType: 'Written Work',
        instructor: 'Dr. John Smith',
        difficulty: 'Advanced',
        teacherId: 'teacher_1'
      },
      {
        id: 6,
        title: 'Vector Calculus Applications',
        subject: 'Advanced Mathematics',
        dueDate: '2025-06-14',
        status: 'completed',
        priority: 'medium',
        description: 'Apply gradient, divergence, and curl to physical problems.',
        points: 95,
        estimatedTime: '3 hours',
        submissionType: 'Written Work',
        instructor: 'Dr. John Smith',
        difficulty: 'Advanced',
        teacherId: 'teacher_1'
      },
      // Teacher 2 assignments (Computer Science & Programming)
      {
        id: 7,
        title: 'Database Design Project',
        subject: 'Database Systems',
        dueDate: '2025-06-25',
        status: 'pending',
        priority: 'high',
        description: 'Design a relational database schema for a library management system with proper normalization.',
        points: 150,
        estimatedTime: '5 hours',
        submissionType: 'Project',
        instructor: 'Prof. Emily Chen',
        difficulty: 'Advanced',
        teacherId: 'teacher_2'
      },
      {
        id: 8,
        title: 'Differential Equations Practice Set',
        subject: 'Differential Equations',
        dueDate: '2025-06-21',
        status: 'pending',
        priority: 'medium',
        description: 'Solve first and second-order differential equations using various methods including separation of variables and integrating factors.',
        points: 75,
        estimatedTime: '2 hours',
        submissionType: 'Written Work',
        instructor: 'Dr. John Smith',
        difficulty: 'Advanced',
        teacherId: 'teacher_1'
      },      {
        id: 9,
        title: 'Physics Lab Report: Wave Interference',
        subject: 'Applied Physics Lab',
        dueDate: '2025-06-19',
        status: 'pending',
        priority: 'high',
        description: 'Complete lab experiment on wave interference patterns and submit detailed analysis report with calculations and conclusions.',
        points: 120,
        estimatedTime: '4 hours',
        submissionType: 'File Upload',
        instructor: 'Dr. John Smith',
        difficulty: 'Intermediate',
        teacherId: 'teacher_1',
        attachments: [
          {
            id: '1234567890',
            name: 'Wave_Interference_Instructions.pdf',
            size: 1024000,
            type: 'application/pdf',
            uploadDate: '2025-06-01T12:00:00Z'
          },
          {
            id: '0987654321',
            name: 'Lab_Data_Template.xlsx',
            size: 512000,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            uploadDate: '2025-06-01T12:00:00Z'
          }
        ]
      },
      {
        id: 10,
        title: 'Vector Calculus Applications II',
        subject: 'Advanced Mathematics',
        dueDate: '2025-06-09',
        status: 'completed',
        priority: 'medium',
        description: 'Apply vector calculus concepts to solve problems involving gradient, divergence, and curl in three-dimensional space.',
        points: 90,
        estimatedTime: '3 hours',
        submissionType: 'Written Work',
        instructor: 'Dr. John Smith',
        difficulty: 'Advanced',
        teacherId: 'teacher_1'
      },
      // Teacher 3 assignments (Biology & Chemistry)
      {
        id: 11,
        title: 'Genetics Case Study Analysis',
        subject: 'Advanced Biology',
        dueDate: '2025-06-23',
        status: 'in-progress',
        priority: 'high',
        description: 'Analyze inheritance patterns and genetic disorders in provided case studies.',
        points: 100,
        estimatedTime: '3 hours',
        submissionType: 'Report',
        instructor: 'Dr. Michael Johnson',
        difficulty: 'Advanced',
        teacherId: 'teacher_3'
      },      {
        id: 12,
        title: 'Organic Chemistry Reactions',
        subject: 'Organic Chemistry',
        dueDate: '2025-06-24',
        status: 'pending',
        priority: 'high',
        description: 'Complete the synthesis problems and reaction mechanism analyses.',
        points: 90,
        estimatedTime: '3 hours',
        submissionType: 'Written Work',
        instructor: 'Dr. Sarah Davis',
        difficulty: 'Advanced',
        teacherId: 'teacher_3',
        attachments: [
          {
            id: 'abcdef123456',
            name: 'Organic_Chemistry_Reaction_Mechanisms.pdf',
            size: 2048000,
            type: 'application/pdf',
            uploadDate: '2025-06-15T10:30:00Z'
          }
        ]
      },
      // Teacher 4 & 5 assignments (Mathematics & English)
      {
        id: 13,
        title: 'Statistical Methods Problem Set',
        subject: 'Statistics & Probability',
        dueDate: '2025-06-26',
        status: 'pending',
        priority: 'medium',
        description: 'Apply statistical methods to analyze real-world data sets.',
        points: 85,
        estimatedTime: '2.5 hours',
        submissionType: 'Written Work',
        instructor: 'Prof. David Kim',
        difficulty: 'Intermediate',
        teacherId: 'teacher_4'
      },
      {
        id: 14,
        title: 'Physics Problem Set: Momentum',
        subject: 'Physics Fundamentals',
        dueDate: '2025-06-18',
        status: 'completed',
        priority: 'low',
        description: 'Practice problems on conservation of momentum, elastic and inelastic collisions, and impulse-momentum theorem.',
        points: 60,
        estimatedTime: '1.5 hours',
        submissionType: 'Online Quiz',
        instructor: 'Dr. John Smith',
        difficulty: 'Beginner',
        teacherId: 'teacher_1'
      },
      {
        id: 15,
        title: 'Literature Analysis Project',
        subject: 'English Literature',
        dueDate: '2025-06-25',
        status: 'pending',
        priority: 'low',
        description: 'Analyze themes and literary devices in Shakespeare\'s Hamlet with supporting evidence.',
        points: 90,
        estimatedTime: '4 hours',
        submissionType: 'Essay',
        instructor: 'Prof. Jane Smith',
        difficulty: 'Intermediate',
        teacherId: 'teacher_5'      
      }
    ];

  // Define function to load and normalize assignments with role-based filtering
  const loadAssignments = React.useCallback(() => {
    // Only run if user is available
    if (!user) return;

    const allAssignments = getAllAssignments();

    // Filter assignments based on user role
    let roleFilteredAssignments = allAssignments;
    
    if (user?.role === 'teacher') {
      // Teachers only see their own assignments
      const currentTeacherId = user?.id || 'teacher_1';
      roleFilteredAssignments = allAssignments.filter(assignment => 
        assignment.teacherId === currentTeacherId
      );
    } else if (user?.role === 'student') {
      // Students see assignments from all their enrolled classes
      // For demo, show all assignments as if student is enrolled in all classes
      roleFilteredAssignments = allAssignments;
    }
    
    // Normalize status values for consistency
    roleFilteredAssignments = roleFilteredAssignments.map(assignment => {
      let status = assignment.status || 'pending';
      if (status === 'submitted') {
        status = 'completed';
      }
      return {...assignment, status};
    });
    
    setAssignments(roleFilteredAssignments);
  }, [user]);

  // Load assignments when the component mounts
  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);
  const handleCreateAssignment = () => {
    setShowCreateModal(true);
  };
  
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewAssignment({
      title: '',
      subject: '',
      dueDate: '',
      priority: 'medium',
      description: '',
      points: 100,
      estimatedTime: '',
      submissionType: 'Written Work',
      difficulty: 'Intermediate',
      attachments: []
    });
  };

  const handleSaveAssignment = () => {
    if (newAssignment.title && newAssignment.subject && newAssignment.dueDate) {
      const assignment = {
        id: Date.now(), // Simple ID generation
        ...newAssignment,
        status: 'pending',
        instructor: user?.name || 'Dr. John Smith',
        teacherId: user?.id || 'teacher_1',
        attachments: newAssignment.attachments.map(att => ({
          id: att.id,
          name: att.name,
          size: att.size,
          type: att.type,
          uploadDate: att.uploadDate
        }))
      };

      setAssignments(prev => [assignment, ...prev]);
      setShowCreateModal(false);
      setNewAssignment({
        title: '',
        subject: '',
        dueDate: '',
        priority: 'medium',
        description: '',
        points: 100,
        estimatedTime: '',
        submissionType: 'Written Work',
        difficulty: 'Intermediate',
        attachments: []
      });
    }
  };

  const handleInputChange = (field, value) => {
    setNewAssignment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      // Allow PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
      const validExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return validExtensions.includes(extension);
    });

    if (validFiles.length !== files.length) {
      alert('Some files were not added. Only document files (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX) are allowed.');
    }

    // Add new files to the existing attachments
    const newAttachments = validFiles.map(file => ({
      id: Date.now() + Math.random().toString(36).substring(2, 15),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      uploadDate: new Date().toISOString()
    }));

    setNewAssignment(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  const removeAttachment = (id) => {
    setNewAssignment(prev => ({
      ...prev,
      attachments: prev.attachments.filter(attachment => attachment.id !== id)
    }));
  };

  // State to track drag events
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      // Allow PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
      const validExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return validExtensions.includes(extension);
    });

    if (validFiles.length !== files.length) {
      alert('Some files were not added. Only document files (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX) are allowed.');
    }

    // Add new files to the existing attachments
    const newAttachments = validFiles.map(file => ({
      id: Date.now() + Math.random().toString(36).substring(2, 15),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      uploadDate: new Date().toISOString()
    }));

    setNewAssignment(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  // Apply filter to assignments based on selected tab
  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    
    // Normalize status for filtering
    let status = assignment.status || 'pending';
    
    // Handle equivalent statuses
    if ((status === 'submitted' || status === 'completed') && filter === 'completed') {
      return true;
    }
    
    return status === filter;
  });

  const getStatusStats = () => {
    if (user?.role === 'admin') {
      // Admin sees system-wide stats with teacher breakdown
      const allAssignments = getAllAssignments();
      const teacherStats = allAssignments.reduce((acc, assignment) => {
        const teacherId = assignment.teacherId;
        if (!acc[teacherId]) {
          acc[teacherId] = { name: assignment.instructor, count: 0, pending: 0, overdue: 0 };
        }
        acc[teacherId].count++;
        if (assignment.status === 'pending') acc[teacherId].pending++;
        if (assignment.status === 'overdue') acc[teacherId].overdue++;
        return acc;
      }, {});

      return {
        total: allAssignments.length,
        pending: allAssignments.filter(a => a.status === 'pending').length,
        completed: allAssignments.filter(a => a.status === 'completed').length,
        overdue: allAssignments.filter(a => a.status === 'overdue').length,
        teachers: Object.keys(teacherStats).length,
        avgPerTeacher: Math.round(allAssignments.length / Object.keys(teacherStats).length),
        teacherBreakdown: teacherStats
      };
    }

    return {
      total: assignments.length,
      pending: assignments.filter(a => a.status === 'pending').length,
      inProgress: assignments.filter(a => a.status === 'in-progress').length,
      completed: assignments.filter(a => a.status === 'completed').length,
      overdue: assignments.filter(a => a.status === 'overdue').length
    };
  };

  const stats = getStatusStats();

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
          <div className="flex items-center justify-between mb-12 animate-slide-up">
            <div>
              <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-3">
                {user?.role === 'admin' ? 'System ' : 'My '}<span className="text-gradient">Assignments</span>
              </h1>
              <p className="text-body text-gray-600">
                {user?.role === 'admin' 
                  ? 'Manage assignments across all teachers and subjects' 
                  : user?.role === 'student' 
                  ? 'Track your assignments and deadlines' 
                  : 'Create and manage assignments for your classes'}
              </p>
            </div>
            
            {user?.role !== 'student' && (
              <button 
                onClick={handleCreateAssignment} 
                className="btn-primary flex items-center px-5 py-2.5 rounded-lg"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Create Assignment
              </button>
            )}
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up">
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-600 text-sm">Total Assignments</p>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <DocumentTextIcon className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <h3 className="text-2xl font-light text-gray-800">{stats.total}</h3>
            </div>
            
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-600 text-sm">Pending</p>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ClockIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-2xl font-light text-gray-800">{stats.pending}</h3>
            </div>
            
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-600 text-sm">Completed</p>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-light text-gray-800">{stats.completed}</h3>
            </div>
            
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-600 text-sm">Overdue</p>
                <div className="p-2 bg-red-100 rounded-lg">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <h3 className="text-2xl font-light text-gray-800">{stats.overdue}</h3>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between mb-8 animate-slide-up">
            <div className="flex space-x-2 bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10">
              {['all', 'pending', 'in-progress', 'completed', 'overdue'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === status
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/20'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9 0a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H15a3 3 0 01-3-3V6zm0 9a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H15a3 3 0 01-3-3V15zm-9 0a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V15z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Assignments Grid/List */}
          <div className={`animate-fade-scale ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'space-y-4'
          }`}>
            {filteredAssignments.map((assignment, index) => (
              <AssignmentCard
                key={assignment.id} 
                assignment={assignment} 
                userRole={user?.role}
                viewMode={viewMode}
                index={index}
                navigate={navigate}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium text-gray-800">Create New Assignment</h2>              <button 
                onClick={handleCloseModal}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Title
                </label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter assignment title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={newAssignment.subject}
                  onChange={e => handleInputChange('subject', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter subject"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={e => handleInputChange('dueDate', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={newAssignment.priority}
                  onChange={e => handleInputChange('priority', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  value={newAssignment.points}
                  onChange={e => handleInputChange('points', parseInt(e.target.value))}
                  min="0"
                  max="200"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Time
                </label>
                <input
                  type="text"
                  value={newAssignment.estimatedTime}
                  onChange={e => handleInputChange('estimatedTime', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., 2 hours"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Submission Type
                </label>
                <select
                  value={newAssignment.submissionType}
                  onChange={e => handleInputChange('submissionType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Written Work">Written Work</option>
                  <option value="File Upload">File Upload</option>
                  <option value="Online Quiz">Online Quiz</option>
                  <option value="Lab Report">Lab Report</option>
                  <option value="Project">Project</option>
                  <option value="Essay">Essay</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={newAssignment.difficulty}
                  onChange={e => handleInputChange('difficulty', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
                <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newAssignment.description}
                  onChange={e => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter assignment description"
                />
              </div>
              
              {/* File Upload Section */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments (PDF, DOC, DOCX, etc.)
                </label>
                <div 
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300'} border-dashed rounded-lg transition-all duration-200`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    <PaperClipIcon className={`mx-auto h-12 w-12 ${isDragging ? 'text-orange-500' : 'text-gray-400'} transition-colors duration-200`} />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500">
                        <span>Upload files</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          multiple 
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                          onChange={handleFileUpload} 
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX up to 10MB
                    </p>
                  </div>
                </div>
                
                {/* Display uploaded files */}
                {newAssignment.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h4>
                    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
                      {newAssignment.attachments.map((file) => (
                        <li key={file.id} className="px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(2)} KB • {file.type || 'Document'}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(file.id)}
                            className="text-gray-400 hover:text-gray-500 p-1"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>                )}
              </div>
            </div>
            
            <div className="flex justify-end mt-8">              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 mr-3 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignment}
                disabled={!newAssignment.title || !newAssignment.subject || !newAssignment.dueDate}
                className={`px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-sm hover:shadow-md disabled:opacity-50 disabled:pointer-events-none`}
              >
                Create Assignment
              </button>
            </div>          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

const AssignmentCard = ({ assignment, userRole, viewMode, index, navigate }) => {
  // Always ensure status is properly recognized and normalized
  let assignmentStatus = assignment.status || 'pending';
  
  // Normalize status values for consistency
  if (assignmentStatus === 'submitted') {
    assignmentStatus = 'completed';
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-300 bg-green-500/15';
      case 'in-progress': return 'text-blue-300 bg-blue-500/15';
      case 'pending': return 'text-orange-300 bg-orange-500/15';
      case 'overdue': return 'text-red-300 bg-red-500/15';
      default: return 'text-gray-400 bg-gray-500/15';
    }
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-red-500/15';
      case 'medium': return 'text-yellow-700 bg-yellow-500/15';
      case 'low': return 'text-green-700 bg-green-500/15';
      default: return 'text-gray-700 bg-gray-500/15';
    }
  };
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Advanced': return 'text-purple-700 bg-purple-500/15';
      case 'Intermediate': return 'text-blue-700 bg-blue-500/15';
      case 'Beginner': return 'text-green-700 bg-green-500/15';
      default: return 'text-gray-700 bg-gray-500/15';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'in-progress': return <PlayCircleIcon className="h-5 w-5" />;
      case 'pending': return <ClockIcon className="h-5 w-5" />;
      case 'overdue': return <ExclamationTriangleIcon className="h-5 w-5" />;
      default: return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const formatDate = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    
    // Check if date is today
    if (date.toDateString() === now.toDateString()) {
      return 'Due today';
    }
    
    // Check if date is in the past
    if (date < now) {
      const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) return '1 day overdue';
      return `${daysDiff} days overdue`;
    }
    
    // Date is in the future
    const daysDiff = Math.floor((date - now) / (1000 * 60 * 60 * 24));
    if (daysDiff === 0) {
      return 'Due today';
    } else if (daysDiff === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${daysDiff} days`;
    }
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="glass-card rounded-xl p-6 animate-slide-up hover:scale-[1.01] transition-all duration-300"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-lg ${getStatusColor(assignmentStatus)}`}>
                {getStatusIcon(assignmentStatus)}
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="text-gray-800 font-semibold text-lg">{assignment.title}</h3>
                  {assignmentStatus === 'completed' && 
                    <span className="ml-2 text-green-500 text-sm flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Completed
                    </span>
                  }
                </div>
                <p className="text-gray-600 text-sm">{assignment.subject}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{assignment.description}</p>
            
            {/* Display attachments if there are any */}
            {assignment.attachments && assignment.attachments.length > 0 && (
              <div className="mb-1 flex items-center">
                <PaperClipIcon className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-xs text-gray-500">
                  {assignment.attachments.length} attachment{assignment.attachments.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(assignment.priority)}`}>
                {assignment.priority} priority
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(assignment.difficulty)}`}>
                {assignment.difficulty}
              </span>
              <span className="text-gray-600 text-xs">{assignment.estimatedTime}</span>
            </div>
          </div>
          <div className="text-right ml-6">
            <div className="flex items-center justify-end space-x-2 mb-2">
              <span className="text-gray-800 font-bold text-lg">{assignment.points}</span>
              <span className="text-gray-600 text-sm">pts</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{formatDate(assignment.dueDate)}</p>
            <button 
              onClick={() => navigate(`/assignment/${assignment.id}`)}
              className={`${assignmentStatus === 'completed' ? 'bg-green-500 hover:bg-green-600 text-white' : 'btn-primary'} px-4 py-2 rounded-lg text-sm`}
            >
              {assignmentStatus === 'completed'
                ? 'Submitted'
                : userRole === 'student' 
                  ? assignmentStatus === 'in-progress' ? 'Continue' : 'View Assignment' 
                  : 'View Submissions'}
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
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${getStatusColor(assignmentStatus)}`}>
          {getStatusIcon(assignmentStatus)}
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            <span className="text-gray-800 font-bold text-xl">{assignment.points}</span>
            <span className="text-gray-600 text-sm">pts</span>
          </div>
          <p className="text-gray-600 text-xs">{assignment.submissionType}</p>
        </div>
      </div>

      <h3 className="text-gray-800 font-semibold text-lg mb-2 group-hover:text-orange-400 transition-colors flex items-center">
        {assignment.title}
        {assignmentStatus === 'completed' && 
          <span className="ml-2 text-green-500 text-sm flex items-center">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Completed
          </span>
        }
      </h3>
      <p className="text-orange-400 text-sm font-medium mb-3">{assignment.subject}</p>
      <p className="text-gray-600 text-sm mb-2 line-clamp-3">{assignment.description}</p>
      
      {/* Display attachments if there are any */}
      {assignment.attachments && assignment.attachments.length > 0 && (
        <div className="mb-4 flex items-center">
          <PaperClipIcon className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-xs text-gray-500">
            {assignment.attachments.length} attachment{assignment.attachments.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(assignment.priority)}`}>
          {assignment.priority} priority
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(assignment.difficulty)}`}>
          {assignment.difficulty}
        </span>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600 text-xs">Instructor: {assignment.instructor}</span>
          <span className="text-gray-600 text-xs">{assignment.estimatedTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 text-sm">{formatDate(assignment.dueDate)}</p>
          <button 
            onClick={() => navigate(`/assignment/${assignment.id}`)}
            className={`${assignmentStatus === 'completed' ? 'bg-green-500 hover:bg-green-600 text-white' : 'btn-primary'} px-4 py-2 rounded-lg text-sm`}
          >
            {assignmentStatus === 'completed' 
              ? 'Submitted' 
              : userRole === 'student' 
                ? assignmentStatus === 'in-progress' ? 'Continue' : 'Start' 
                : 'Grade'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
