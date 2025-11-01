import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {
  BookOpenIcon,
  PlusIcon,
  UserGroupIcon,
  ClockIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const Classes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();  const [classes, setClasses] = useState([]);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [newClassData, setNewClassData] = useState({
    name: '',
    description: '',
    room: '',
    schedule: '',
    maxStudents: 30
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);// Mock data - replace with API call
  const getAllClasses = () => [
      // Teacher 1 classes
      {
        id: 1,
        name: 'Advanced Mathematics',
        description: 'Calculus, Linear Algebra, and Differential Equations',
        students: 25,
        nextSession: 'Today, 2:00 PM',
        progress: 75,
        status: 'active',
        teacherId: 'teacher_1',
        instructor: 'Dr. John Smith',
        room: 'Room 301',
        schedule: 'Mon, Wed, Fri - 2:00-3:30 PM'
      },
      {
        id: 2,
        name: 'Physics Fundamentals',
        description: 'Classical Mechanics and Thermodynamics',
        students: 18,
        nextSession: 'Tomorrow, 10:00 AM',
        progress: 60,
        status: 'active',
        teacherId: 'teacher_1',
        instructor: 'Dr. John Smith',
        room: 'Lab 205',
        schedule: 'Tue, Thu - 10:00-11:30 AM'
      },
      {
        id: 3,
        name: 'Calculus II',
        description: 'Integration Techniques and Series',
        students: 15,
        nextSession: 'Thursday, 1:00 PM',
        progress: 80,
        status: 'active',
        teacherId: 'teacher_1',
        instructor: 'Dr. John Smith',
        room: 'Room 302',        schedule: 'Mon, Thu - 1:00-2:30 PM'
      },
      {
        id: 8,
        name: 'Differential Equations',
        description: 'First and Second Order Differential Equations',
        students: 12,
        nextSession: 'Wednesday, 3:00 PM',
        progress: 70,
        status: 'active',
        teacherId: 'teacher_1',
        instructor: 'Dr. John Smith',
        room: 'Room 304',
        schedule: 'Wed, Fri - 3:00-4:30 PM'
      },
      {
        id: 9,
        name: 'Applied Physics Lab',
        description: 'Hands-on Physics Experiments and Analysis',
        students: 8,
        nextSession: 'Friday, 2:00 PM',
        progress: 85,
        status: 'active',
        teacherId: 'teacher_1',
        instructor: 'Dr. John Smith',
        room: 'Physics Lab 103',
        schedule: 'Fri - 2:00-5:00 PM'
      },

      // Teacher 2 classes
      {
        id: 4,
        name: 'Quantum Physics',
        description: 'Introduction to Quantum Mechanics',
        students: 22,
        nextSession: 'Wednesday, 3:00 PM',
        progress: 45,
        status: 'active',
        teacherId: 'teacher_2',
        instructor: 'Prof. Michael Chen',
        room: 'Lab 301',
        schedule: 'Wed, Fri - 3:00-4:30 PM'
      },
      {
        id: 5,
        name: 'Statistical Mechanics',
        description: 'Thermodynamics and Statistical Physics',
        students: 16,
        nextSession: 'Friday, 9:00 AM',
        progress: 55,
        status: 'active',
        teacherId: 'teacher_2',
        instructor: 'Prof. Michael Chen',
        room: 'Room 401',
        schedule: 'Tue, Fri - 9:00-10:30 AM'
      },

      // Teacher 3 classes
      {
        id: 6,
        name: 'Organic Chemistry',
        description: 'Chemical Reactions and Synthesis',
        students: 20,
        nextSession: 'Monday, 11:00 AM',
        progress: 65,
        status: 'active',
        teacherId: 'teacher_3',
        instructor: 'Dr. Emma Rodriguez',
        room: 'Chem Lab 101',
        schedule: 'Mon, Wed - 11:00-12:30 PM'
      },
      {
        id: 7,
        name: 'Biochemistry',
        description: 'Molecular Biology and Enzyme Kinetics',
        students: 14,
        nextSession: 'Tuesday, 2:00 PM',
        progress: 40,
        status: 'active',
        teacherId: 'teacher_3',
        instructor: 'Dr. Emma Rodriguez',
        room: 'Bio Lab 201',
        schedule: 'Tue, Thu - 2:00-3:30 PM'      }
    ];

  useEffect(() => {
    // Only run if user is available
    if (!user) return;

    const allClasses = getAllClasses();

    // Filter classes based on user role
    let filteredClasses = allClasses;
    
    if (user?.role === 'teacher') {
      // Teachers only see their own classes
      const currentTeacherId = user?.id || 'teacher_1';
      filteredClasses = allClasses.filter(classItem => 
        classItem.teacherId === currentTeacherId
      );
    } else if (user?.role === 'student') {
      // Students see classes they're enrolled in
      // For demo, show all classes as if student is enrolled in all
      filteredClasses = allClasses;
    }
    // Admins see all classes
      setClasses(filteredClasses);
  }, [user]);

  // Mock student data for adding to classes
  useEffect(() => {
    const allStudents = [
      {
        id: 1,
        name: 'Alex Johnson',
        email: 'alex.johnson@email.com',
        grade: 'A',
        enrolledClasses: [1, 2], // Currently enrolled in class IDs
        teacherId: 'teacher_1'
      },
      {
        id: 2,
        name: 'Sarah Wilson',
        email: 'sarah.wilson@email.com',
        grade: 'B+',
        enrolledClasses: [1],
        teacherId: 'teacher_1'
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@email.com',
        grade: 'A+',
        enrolledClasses: [2, 3],
        teacherId: 'teacher_1'
      },
      {
        id: 4,
        name: 'Marcus Thompson',
        email: 'marcus.thompson@email.com',
        grade: 'B',
        enrolledClasses: [3],
        teacherId: 'teacher_1'
      },
      {
        id: 5,
        name: 'Jessica Chen',
        email: 'jessica.chen@email.com',
        grade: 'A-',
        enrolledClasses: [1, 3],
        teacherId: 'teacher_1'
      },      {
        id: 6,
        name: 'David Kim',
        email: 'david.kim@email.com',
        grade: 'B+',
        enrolledClasses: [2],
        teacherId: 'teacher_1'
      },
      {
        id: 9,
        name: 'Amanda Taylor',
        email: 'amanda.taylor@email.com',
        grade: 'A-',
        enrolledClasses: [1, 2, 8],
        teacherId: 'teacher_1'
      },
      {
        id: 10,
        name: 'Jordan Brooks',
        email: 'jordan.brooks@email.com',
        grade: 'B',
        enrolledClasses: [3, 9],
        teacherId: 'teacher_1'
      },
      {
        id: 12,
        name: 'Connor Walsh',
        email: 'connor.walsh@email.com',
        grade: 'B+',
        enrolledClasses: [1, 3, 8],
        teacherId: 'teacher_1'
      },
      // Unassigned students that can be added to classes
      {
        id: 7,
        name: 'Lisa Anderson',
        email: 'lisa.anderson@email.com',
        grade: 'A',
        enrolledClasses: [],
        teacherId: 'teacher_1'
      },
      {
        id: 8,
        name: 'Ryan Martinez',
        email: 'ryan.martinez@email.com',
        grade: 'B',
        enrolledClasses: [],
        teacherId: 'teacher_1'
      },
      {
        id: 11,
        name: 'Maya Patel',
        email: 'maya.patel@email.com',
        grade: '-',
        enrolledClasses: [],
        teacherId: 'teacher_1'
      }
    ];

    // Filter students based on current teacher
    let filteredStudents = allStudents;
    if (user?.role === 'teacher') {
      const currentTeacherId = user?.id || 'teacher_1';
      filteredStudents = allStudents.filter(student => 
        student.teacherId === currentTeacherId
      );
    }

    setAvailableStudents(filteredStudents);
  }, [user]);

  const handleAddStudentToClass = (classId) => {
    setSelectedClass(classId);
    setShowAddStudentModal(true);
    setSelectedStudents([]);
    setSearchQuery('');
  };

  const handleSaveStudents = () => {
    if (selectedStudents.length > 0 && selectedClass) {
      // Update the student enrollment data
      setAvailableStudents(prev => 
        prev.map(student => {
          if (selectedStudents.includes(student.id)) {
            return {
              ...student,
              enrolledClasses: [...student.enrolledClasses, selectedClass]
            };
          }
          return student;
        })
      );

      // Update class student count
      setClasses(prev =>
        prev.map(classItem => {
          if (classItem.id === selectedClass) {
            return {
              ...classItem,
              students: classItem.students + selectedStudents.length
            };
          }
          return classItem;
        })
      );      setShowAddStudentModal(false);
      setSelectedClass(null);
      setSelectedStudents([]);
    }
  };

  const handleCreateClass = () => {
    setShowCreateClassModal(true);
    setNewClassData({
      name: '',
      description: '',
      room: '',
      schedule: '',
      maxStudents: 30
    });
  };  const handleSaveClass = () => {
    if (newClassData.name && newClassData.description) {
      const newClass = {
        id: Date.now(), // Use timestamp for unique ID
        name: newClassData.name,
        description: newClassData.description,
        students: 0,
        nextSession: 'TBD',
        progress: 0,
        status: 'active',
        teacherId: user?.id || 'current_teacher',
        instructor: user?.name || 'Current Teacher',
        room: newClassData.room || 'TBD',
        schedule: newClassData.schedule || 'TBD',
        isNewlyCreated: true // Mark as newly created
      };

      setClasses(prev => [...prev, newClass]);
      setShowCreateClassModal(false);
      setNewClassData({
        name: '',
        description: '',
        room: '',
        schedule: '',
        maxStudents: 30
      });

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

      // Remove the "newly created" flag after a few seconds
      setTimeout(() => {
        setClasses(prev => prev.map(c => 
          c.id === newClass.id ? { ...c, isNewlyCreated: false } : c
        ));
      }, 5000);
    }
  };

  const handleClassInputChange = (field, value) => {
    setNewClassData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getAvailableStudentsForClass = () => {
    if (!selectedClass) return [];
    
    return availableStudents.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchQuery.toLowerCase());
      const notEnrolled = !student.enrolledClasses.includes(selectedClass);
      return matchesSearch && notEnrolled;
    });
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const getClassStats = () => {
    if (user?.role === 'admin') {
      // Admin sees system-wide stats with teacher breakdown
      const allClasses = getAllClasses();
      const teacherStats = allClasses.reduce((acc, classItem) => {
        const teacherId = classItem.teacherId;
        if (!acc[teacherId]) {
          acc[teacherId] = { 
            name: classItem.instructor, 
            classes: 0, 
            students: 0, 
            avgProgress: 0 
          };
        }
        acc[teacherId].classes++;
        acc[teacherId].students += classItem.students;
        acc[teacherId].avgProgress += classItem.progress;
        return acc;
      }, {});

      // Calculate averages
      Object.values(teacherStats).forEach(teacher => {
        teacher.avgProgress = Math.round(teacher.avgProgress / teacher.classes);
      });

      return {
        totalClasses: allClasses.length,
        totalStudents: allClasses.reduce((sum, c) => sum + c.students, 0),
        activeTeachers: Object.keys(teacherStats).length,
        avgClassSize: Math.round(allClasses.reduce((sum, c) => sum + c.students, 0) / allClasses.length),
        teacherBreakdown: teacherStats
      };
    }

    return {
      totalClasses: classes.length,
      totalStudents: classes.reduce((sum, c) => sum + c.students, 0),
      activeSessions: 3
    };
  };

  const stats = getClassStats();

  return (
    <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-gradient-radial opacity-30"></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-radial opacity-20"></div>
      
      <Sidebar />      {/* Main Content */}
      <div className="ml-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-12">          {/* Header */}          <div className="flex items-center justify-between mb-12 animate-slide-up">            <div>              <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-3">
                {user?.role === 'admin' ? 'System ' : 'My '}<span className="text-gradient">Classes</span>
              </h1>
              <p className="text-body text-gray-600">
                {user?.role === 'admin' 
                  ? 'Manage classes across all teachers and subjects' 
                  : user?.role === 'student' 
                  ? 'Your enrolled courses and learning progress' 
                  : 'Manage your courses and student progress'
                }
              </p>
            </div>            {(user?.role === 'teacher' || user?.role === 'admin') && (
              <button 
                onClick={handleCreateClass}
                className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create New Class</span>
              </button>            )}
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-xl animate-slide-up">
              <div className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-green-800 font-medium">Class created successfully!</p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          {user?.role === 'admin' ? (
            // Admin Stats - System-wide overview
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-fade-scale">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Total Classes</p>
                    <p className="text-title font-light text-gray-800">{stats.totalClasses}</p>
                  </div>
                  <BookOpenIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Total Students</p>
                    <p className="text-title font-light text-gray-800">{stats.totalStudents}</p>
                  </div>
                  <UserGroupIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Active Teachers</p>
                    <p className="text-title font-light text-gray-800">{stats.activeTeachers}</p>
                  </div>
                  <AcademicCapIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Avg Class Size</p>
                    <p className="text-title font-light text-gray-800">{stats.avgClassSize}</p>
                  </div>
                  <CalendarDaysIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>
            </div>
          ) : (
            // Student/Teacher Stats
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-scale">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Total Classes</p>
                    <p className="text-title font-light text-gray-800">{stats.totalClasses}</p>
                  </div>
                  <BookOpenIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    {user?.role === 'teacher' ? (
                      <>
                        <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Total Students</p>
                        <p className="text-title font-light text-gray-800">{stats.totalStudents}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Study Hours</p>
                        <p className="text-title font-light text-gray-800">24.5</p>
                      </>
                    )}
                  </div>
                  {user?.role === 'teacher' ? (
                    <UserGroupIcon className="h-8 w-8 text-orange-500 opacity-60" />
                  ) : (
                    <AcademicCapIcon className="h-8 w-8 text-orange-500 opacity-60" />
                  )}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Active Sessions</p>
                    <p className="text-title font-light text-gray-800">3</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>              </div>
            </div>
          )}

          {/* Admin Teacher Breakdown */}
          {user?.role === 'admin' && stats.teacherBreakdown && (
            <div className="mb-8 animate-slide-up">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Teacher Class Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.teacherBreakdown).map(([teacherId, data]) => (
                  <div key={teacherId} className="glass-card rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">{data.name}</h4>
                      <span className="text-sm text-gray-600">{data.classes} classes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-orange-600">{data.students} students</span>
                      <span className="text-green-600">{data.avgProgress}% avg progress</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-fade-scale">            {classes.map((classItem) => (
              <ClassCard 
                key={classItem.id} 
                classData={classItem} 
                userRole={user?.role}
                onAddStudent={handleAddStudentToClass}
                onEnterClass={navigate}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-montserrat font-medium text-gray-800">
                Add Students to Class
              </h2>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto mb-6">
              <div className="space-y-3">
                {getAvailableStudentsForClass().map((student) => (
                  <div
                    key={student.id}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedStudents.includes(student.id)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleStudentSelection(student.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">Grade: {student.grade}</span>
                        {selectedStudents.includes(student.id) && (
                          <CheckIcon className="h-5 w-5 text-orange-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {getAvailableStudentsForClass().length === 0 && (
                <div className="text-center py-8">
                  <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    {searchQuery ? 'No students found matching your search.' : 'No available students to add.'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveStudents}
                  disabled={selectedStudents.length === 0}
                  className="px-6 py-2 btn-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Students
                </button>
              </div>
            </div>          </div>
        </div>
      )}

      {/* Create New Class Modal */}
      {showCreateClassModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-light text-gray-800">Create New Class</h3>
                <button
                  onClick={() => setShowCreateClassModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Name *
                </label>
                <input
                  type="text"
                  value={newClassData.name}
                  onChange={(e) => handleClassInputChange('name', e.target.value)}
                  placeholder="e.g., Advanced Mathematics"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newClassData.description}
                  onChange={(e) => handleClassInputChange('description', e.target.value)}
                  placeholder="e.g., Calculus, Linear Algebra, and Differential Equations"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room
                </label>
                <input
                  type="text"
                  value={newClassData.room}
                  onChange={(e) => handleClassInputChange('room', e.target.value)}
                  placeholder="e.g., Room 301"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule
                </label>
                <input
                  type="text"
                  value={newClassData.schedule}
                  onChange={(e) => handleClassInputChange('schedule', e.target.value)}
                  placeholder="e.g., Mon, Wed, Fri - 2:00-3:30 PM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Students
                </label>
                <input
                  type="number"
                  value={newClassData.maxStudents}
                  onChange={(e) => handleClassInputChange('maxStudents', parseInt(e.target.value) || 30)}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateClassModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClass}
                disabled={!newClassData.name || !newClassData.description}
                className="px-6 py-2 btn-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Class
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

const ClassCard = ({ classData, userRole, onAddStudent, onEnterClass }) => {
  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-glow transition-all duration-300 hover:transform hover:-translate-y-1 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-heading font-medium text-gray-800 mb-2">{classData.name}</h3>
          <p className="text-caption text-gray-600 mb-4">{classData.description}</p>
        </div>
        <div className="bg-green-500/20 px-3 py-1 rounded-full">
          <span className="text-micro text-green-600 font-medium uppercase">{classData.status}</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-caption text-gray-600">Progress</span>
          <span className="text-caption text-gray-800 font-medium">{classData.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-orange h-2 rounded-full transition-all duration-500" 
            style={{ width: `${classData.progress}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <UserGroupIcon className="h-4 w-4 text-gray-600" />
            <span className="text-caption text-gray-600">{classData.students} students</span>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarDaysIcon className="h-4 w-4 text-gray-600" />
            <span className="text-caption text-gray-600">{classData.nextSession}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">        <button 
          onClick={() => onEnterClass(`/class/${classData.id}`)}
          className="flex-1 btn-primary py-2 px-4 rounded-lg text-sm font-medium"
        >
          {userRole === 'student' ? 'Enter Class' : 'Manage Class'}
        </button>
        {userRole === 'teacher' && (
          <button 
            onClick={() => onAddStudent(classData.id)}
            className="btn-secondary p-2 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors"
            title="Add Student to Class"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        )}
        {userRole !== 'teacher' && (
          <button className="btn-secondary p-2 rounded-lg">
            <BookOpenIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Classes;
