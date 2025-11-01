import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { 
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

const Students = () => {
  const { user } = useAuth();
  const navigate = useNavigate();const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');// Mock students data - in a real app, this would be filtered by teacher ID on the backend
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Only run if user is available
    if (!user) return;

    const allStudents = [
    // Teacher 1 students (Mathematics & Physics classes)
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      phone: '+1 (555) 123-4567',
      enrolledDate: '2024-01-10',
      status: 'active',
      grade: 'A',
      attendance: 95,
      assignmentsCompleted: 18,
      totalAssignments: 20,
      subjects: ['Advanced Mathematics', 'Physics Fundamentals'],
      lastActive: '2024-01-15T14:30:00',
      avatar: null,
      teacherId: 'teacher_1'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+1 (555) 234-5678',
      enrolledDate: '2024-01-08',
      status: 'active',
      grade: 'B+',
      attendance: 88,
      assignmentsCompleted: 16,
      totalAssignments: 20,
      subjects: ['Advanced Mathematics'],
      lastActive: '2024-01-15T10:15:00',
      avatar: null,
      teacherId: 'teacher_1'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '+1 (555) 456-7890',
      enrolledDate: '2024-01-12',
      status: 'active',
      grade: 'A+',
      attendance: 98,
      assignmentsCompleted: 19,
      totalAssignments: 20,
      subjects: ['Physics Fundamentals', 'Advanced Mathematics'],
      lastActive: '2024-01-15T15:20:00',
      avatar: null,
      teacherId: 'teacher_1'
    },
    {
      id: 4,
      name: 'Marcus Thompson',
      email: 'marcus.thompson@email.com',
      phone: '+1 (555) 567-8901',
      enrolledDate: '2024-01-15',
      status: 'active',
      grade: 'B',
      attendance: 92,
      assignmentsCompleted: 17,
      totalAssignments: 20,
      subjects: ['Calculus II'],
      lastActive: '2024-01-15T12:45:00',
      avatar: null,
      teacherId: 'teacher_1'
    },
    {
      id: 5,
      name: 'Jessica Chen',
      email: 'jessica.chen@email.com',
      phone: '+1 (555) 678-9012',
      enrolledDate: '2024-01-09',
      status: 'active',
      grade: 'A-',
      attendance: 94,
      assignmentsCompleted: 18,
      totalAssignments: 20,
      subjects: ['Advanced Mathematics', 'Calculus II'],
      lastActive: '2024-01-15T16:20:00',
      avatar: null,
      teacherId: 'teacher_1'
    },
    {
      id: 6,
      name: 'David Park',
      email: 'david.park@email.com',
      phone: '+1 (555) 789-0123',
      enrolledDate: '2024-01-11',
      status: 'active',
      grade: 'B+',
      attendance: 89,
      assignmentsCompleted: 15,
      totalAssignments: 20,
      subjects: ['Physics Fundamentals'],
      lastActive: '2024-01-15T11:30:00',
      avatar: null,
      teacherId: 'teacher_1'
    },
    {
      id: 7,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      phone: '+1 (555) 890-1234',
      enrolledDate: '2024-01-13',
      status: 'pending',
      grade: '-',
      attendance: 0,
      assignmentsCompleted: 0,
      totalAssignments: 0,
      subjects: ['Advanced Mathematics'],
      lastActive: null,
      avatar: null,
      teacherId: 'teacher_1'
    },
    {
      id: 8,
      name: 'Ryan Foster',
      email: 'ryan.foster@email.com',
      phone: '+1 (555) 901-2345',
      enrolledDate: '2024-01-07',
      status: 'inactive',
      grade: 'C+',
      attendance: 76,
      assignmentsCompleted: 12,
      totalAssignments: 20,
      subjects: ['Calculus II'],
      lastActive: '2024-01-10T09:15:00',
      avatar: null,      teacherId: 'teacher_1'
    },
    {
      id: 9,
      name: 'Amanda Taylor',
      email: 'amanda.taylor@email.com',
      phone: '+1 (555) 012-3456',
      enrolledDate: '2024-01-14',
      status: 'active',
      grade: 'A-',
      attendance: 96,
      assignmentsCompleted: 19,
      totalAssignments: 20,
      subjects: ['Physics Fundamentals', 'Advanced Mathematics'],
      lastActive: '2024-01-15T14:15:00',
      avatar: null,
      teacherId: 'teacher_1'
    },
    {
      id: 10,
      name: 'Jordan Brooks',
      email: 'jordan.brooks@email.com',
      phone: '+1 (555) 123-0567',
      enrolledDate: '2024-01-10',
      status: 'active',
      grade: 'B',
      attendance: 91,
      assignmentsCompleted: 17,
      totalAssignments: 20,
      subjects: ['Calculus II'],
      lastActive: '2024-01-15T13:40:00',
      avatar: null,
      teacherId: 'teacher_1'
    },
    {
      id: 11,
      name: 'Maya Patel',
      email: 'maya.patel@email.com',
      phone: '+1 (555) 234-6789',
      enrolledDate: '2024-01-16',
      status: 'pending',
      grade: '-',
      attendance: 0,
      assignmentsCompleted: 0,
      totalAssignments: 0,
      subjects: ['Physics Fundamentals'],
      lastActive: null,
      avatar: null,
      teacherId: 'teacher_1'
    },
    {
      id: 12,
      name: 'Connor Walsh',
      email: 'connor.walsh@email.com',
      phone: '+1 (555) 345-7890',
      enrolledDate: '2024-01-05',
      status: 'active',
      grade: 'B+',
      attendance: 87,
      assignmentsCompleted: 16,
      totalAssignments: 20,
      subjects: ['Advanced Mathematics', 'Calculus II'],
      lastActive: '2024-01-15T09:25:00',
      avatar: null,
      teacherId: 'teacher_1'
    },

    // Teacher 2 students (Different classes)
    {
      id: 9,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 345-6789',
      enrolledDate: '2024-01-05',
      status: 'inactive',
      grade: 'B',
      attendance: 72,
      assignmentsCompleted: 12,
      totalAssignments: 20,
      subjects: ['Quantum Physics', 'Chemistry'],
      lastActive: '2024-01-12T16:45:00',
      avatar: null,
      teacherId: 'teacher_2'
    },
    {
      id: 10,
      name: 'David Thompson',
      email: 'david.thompson@email.com',
      phone: '+1 (555) 567-8901',
      enrolledDate: '2024-01-06',
      status: 'pending',
      grade: '-',
      attendance: 0,
      assignmentsCompleted: 0,
      totalAssignments: 0,
      subjects: ['History', 'English'],
      lastActive: null,
      avatar: null,
      teacherId: 'teacher_2'
    },
    {
      id: 11,
      name: 'Emma Watson',
      email: 'emma.watson@email.com',
      phone: '+1 (555) 123-4567',
      enrolledDate: '2024-01-14',
      status: 'active',
      grade: 'A',
      attendance: 96,
      assignmentsCompleted: 19,
      totalAssignments: 20,
      subjects: ['Organic Chemistry'],
      lastActive: '2024-01-15T14:00:00',
      avatar: null,
      teacherId: 'teacher_3'    }
  ];

    // Filter students based on user role
    let filteredStudents = allStudents;
    
    if (user?.role === 'teacher') {
      // Teachers only see their own students
      const currentTeacherId = user?.id || 'teacher_1';
      filteredStudents = allStudents.filter(student => 
        student.teacherId === currentTeacherId
      );
    } else if (user?.role === 'admin') {
      // Admins see all students
      filteredStudents = allStudents;
    } else {
      // Students see empty array (they shouldn't access this page)
      filteredStudents = [];
    }

    setStudents(filteredStudents);
  }, [user]);

  const getStatusStats = () => {
    return {
      total: students.length,
      active: students.filter(s => s.status === 'active').length,
      inactive: students.filter(s => s.status === 'inactive').length,
      pending: students.filter(s => s.status === 'pending').length
    };
  };
  const getFilteredStudents = () => {
    let filtered = students;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(student => student.status === filterStatus);
    }

    // Filter by class/subject
    if (filterClass !== 'all') {
      filtered = filtered.filter(student => 
        student.subjects.some(subject => subject === filterClass)
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort students
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'grade':
        filtered.sort((a, b) => {
          const gradeOrder = { 'A+': 5, 'A': 4, 'B+': 3, 'B': 2, 'C': 1, '-': 0 };
          return (gradeOrder[b.grade] || 0) - (gradeOrder[a.grade] || 0);
        });
        break;
      case 'attendance':
        filtered.sort((a, b) => b.attendance - a.attendance);
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.lastActive || 0) - new Date(a.lastActive || 0));
        break;
      default:
        break;
    }    return filtered;
  };

  // Get unique classes/subjects from students
  const getAvailableClasses = () => {
    const allSubjects = students.flatMap(student => student.subjects);
    const uniqueSubjects = [...new Set(allSubjects)];
    return uniqueSubjects.sort();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const formatLastActive = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const handleAddStudent = () => {
    navigate('/add-student');
  };const StudentCard = ({ student, viewMode, index }) => {
    const getInitials = (name) => {
      return name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U';
    };

    if (viewMode === 'list') {
      return (
        <div 
          className="glass-card rounded-xl p-6 animate-slide-up hover:scale-[1.01] transition-all duration-300"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">
                  {getInitials(student.name)}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{student.email}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Grade: <span className="font-medium">{student.grade}</span></span>
                  <span>Attendance: <span className="font-medium">{student.attendance}%</span></span>
                  <span>Assignments: <span className="font-medium">{student.assignmentsCompleted}/{student.totalAssignments}</span></span>
                </div>
              </div>
            </div>
              <div className="flex items-center space-x-2">
              <button 
                onClick={() => navigate(`/student/${student.id}`)}
                className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200"
              >
                <EyeIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200">
                <PencilIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200">
                <TrashIcon className="w-5 h-5" />
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
          <div className="p-3 rounded-xl bg-orange-500/20">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {getInitials(student.name)}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <span className="text-gray-800 font-bold text-xl">{student.grade}</span>
              <span className="text-gray-600 text-sm">grade</span>
            </div>
            <p className="text-gray-600 text-xs">{student.attendance}% attendance</p>
          </div>
        </div>

        <h3 className="text-gray-800 font-semibold text-lg mb-2 group-hover:text-orange-400 transition-colors">
          {student.name}
        </h3>
        <p className="text-orange-400 text-sm font-medium mb-3">{student.email}</p>
        <p className="text-gray-600 text-sm mb-4">
          {student.subjects.join(' • ')}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
          </span>
          <span className="text-gray-600 text-xs">
            {student.assignmentsCompleted}/{student.totalAssignments} assignments
          </span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600 text-xs">Enrolled: {formatDate(student.enrolledDate)}</span>
            <span className="text-gray-600 text-xs">Last active: {formatLastActive(student.lastActive)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200">
                <EnvelopeIcon className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200">
                <PhoneIcon className="w-4 h-4" />
              </button>            </div>            <button 
              onClick={() => navigate(`/student/${student.id}`)}
              className="btn-primary px-4 py-2 rounded-lg text-sm"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    );
  };

  const filteredStudents = getFilteredStudents();
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
          <div className="flex items-center justify-between mb-12 animate-slide-up">            <div>
              <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-3">
                {user?.role === 'teacher' ? 'My ' : 'Student '}
                <span className="text-gradient">{user?.role === 'teacher' ? 'Students' : 'Management'}</span>
              </h1>
              <p className="text-body text-gray-600">
                {user?.role === 'teacher' 
                  ? 'Manage and monitor your students\' progress and performance'
                  : 'Manage and monitor all students\' progress and performance'
                }
              </p>
            </div>            {(user?.role === 'teacher' || user?.role === 'admin') && (
              <button 
                onClick={handleAddStudent}
                className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>{user?.role === 'teacher' ? 'Add Student to Class' : 'Add Student'}</span>
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-scale">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Total</p>
                  <p className="text-title font-light text-gray-800">{stats.total}</p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-orange-500 opacity-60" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Active</p>
                  <p className="text-title font-light text-gray-800">{stats.active}</p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-orange-500 opacity-60" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Pending</p>
                  <p className="text-title font-light text-gray-800">{stats.pending}</p>
                </div>
                <ClockIcon className="h-8 w-8 text-orange-500 opacity-60" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Inactive</p>
                  <p className="text-title font-light text-gray-800">{stats.inactive}</p>
                </div>
                <ExclamationTriangleIcon className="h-8 w-8 text-orange-500 opacity-60" />
              </div>
            </div>
          </div>          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between mb-8 animate-slide-up">
            <div className="flex flex-wrap items-center space-x-4">
              <div className="flex space-x-2 bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10">
                {['all', 'active', 'pending', 'inactive'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filterStatus === status
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/20'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              {/* Class Filter */}
              <div className="flex space-x-2">
                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="px-3 py-2 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Classes</option>
                  {getAvailableClasses().map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/20'
                }`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/20'
                }`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search and Sort */}
          <div className="flex flex-wrap items-center gap-4 mb-8 animate-slide-up">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="grade">Sort by Grade</option>
              <option value="attendance">Sort by Attendance</option>
              <option value="recent">Sort by Recent Activity</option>
            </select>
          </div>          {/* Students Count */}
          <div className="mb-6 animate-slide-up">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredStudents.length} of {students.length} students
                {user?.role === 'teacher' && (
                  <span className="ml-2 text-orange-500 text-sm">(Your students only)</span>
                )}
              </p>
              {user?.role === 'teacher' && students.length === 0 && (
                <div className="text-sm text-gray-500 bg-orange-50 px-3 py-1 rounded-lg">
                  Contact admin to assign students to your classes
                </div>
              )}
            </div>
          </div>

          {/* Students Grid */}
          {filteredStudents.length > 0 ? (
            <div className={`grid gap-6 animate-fade-scale ${
              viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
            }`}>
              {filteredStudents.map((student, index) => (
                <StudentCard key={student.id} student={student} viewMode={viewMode} index={index} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-heading font-medium text-gray-800 mb-2">
                No students found
              </h3>
              <p className="text-body text-gray-600 mb-6">
                {searchQuery ? 'Try adjusting your search terms or filters' : 'Start by adding your first student'}
              </p>
              <button className="btn-primary px-6 py-3 rounded-xl">
                Add Your First Student
              </button>
            </div>          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Students;
