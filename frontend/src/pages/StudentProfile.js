import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {
  ArrowLeftIcon,
  UserIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PencilSquareIcon,
  BookOpenIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const StudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Mock student data - in real app, fetch based on studentId
  useEffect(() => {
    const fetchStudentData = () => {
      const mockStudentData = {
        id: parseInt(studentId),
        name: 'Emma Johnson',
        email: 'emma.johnson@student.edu',
        phone: '+1 (555) 123-4567',
        address: '123 University Ave, College Town, CT 06511',
        profileImage: null,
        studentId: 'STU2025001',
        enrollmentDate: '2024-09-01',
        status: 'active',
        gpa: 3.85,
        year: 'Sophomore',
        major: 'Computer Science',
        advisor: 'Dr. Sarah Wilson',
        
        // Academic Information
        currentSemester: 'Spring 2025',
        totalCredits: 45,
        creditsInProgress: 15,
        expectedGraduation: 'May 2027',
        
        // Contact Information
        emergencyContact: {
          name: 'Robert Johnson',
          relationship: 'Father',
          phone: '+1 (555) 987-6543',
          email: 'robert.johnson@email.com'
        },
        
        // Current Classes
        currentClasses: [
          {
            id: 1,
            name: 'Advanced Mathematics',
            code: 'MATH301',
            instructor: 'Dr. John Smith',
            schedule: 'MWF 10:00-11:00 AM',
            room: 'Math Building 201',
            grade: 'A-',
            attendance: 95,
            assignments: { completed: 8, total: 10 }
          },
          {
            id: 2,
            name: 'Physics Fundamentals',
            code: 'PHYS201',
            instructor: 'Dr. Emily Chen',
            schedule: 'TTh 2:00-3:30 PM',
            room: 'Science Building 105',
            grade: 'B+',
            attendance: 88,
            assignments: { completed: 6, total: 8 }
          },
          {
            id: 3,
            name: 'Computer Programming',
            code: 'CS202',
            instructor: 'Prof. Michael Davis',
            schedule: 'MWF 1:00-2:00 PM',
            room: 'Computer Lab 301',
            grade: 'A',
            attendance: 100,
            assignments: { completed: 12, total: 12 }
          },
          {
            id: 4,
            name: 'English Literature',
            code: 'ENG205',
            instructor: 'Prof. Jane Anderson',
            schedule: 'TTh 11:00-12:30 PM',
            room: 'Humanities 210',
            grade: 'B',
            attendance: 92,
            assignments: { completed: 5, total: 7 }
          }
        ],
        
        // Academic Performance
        semesterGrades: [
          { semester: 'Fall 2024', gpa: 3.7, credits: 15 },
          { semester: 'Spring 2024', gpa: 3.9, credits: 15 },
          { semester: 'Fall 2023', gpa: 3.8, credits: 15 }
        ],
        
        // Assignments & Tasks
        recentAssignments: [
          {
            id: 1,
            title: 'Calculus Problem Set 5',
            course: 'Advanced Mathematics',
            dueDate: '2025-06-20',
            status: 'completed',
            grade: 'A-',
            submittedDate: '2025-06-18'
          },
          {
            id: 2,
            title: 'Physics Lab Report',
            course: 'Physics Fundamentals',
            dueDate: '2025-06-22',
            status: 'in-progress',
            grade: null,
            submittedDate: null
          },
          {
            id: 3,
            title: 'Programming Project',
            course: 'Computer Programming',
            dueDate: '2025-06-25',
            status: 'pending',
            grade: null,
            submittedDate: null
          }
        ],
        
        // Attendance Records
        attendanceStats: {
          overall: 94,
          thisMonth: 96,
          absences: 3,
          tardies: 1
        },
        
        // Notes from Teachers
        teacherNotes: [
          {
            id: 1,
            teacher: 'Dr. John Smith',
            course: 'Advanced Mathematics',
            date: '2025-06-15',
            note: 'Excellent performance in calculus. Shows strong analytical thinking.',
            type: 'positive'
          },
          {
            id: 2,
            teacher: 'Prof. Michael Davis',
            course: 'Computer Programming',
            date: '2025-06-10',
            note: 'Outstanding programming skills. Helps other students frequently.',
            type: 'positive'
          },
          {
            id: 3,
            teacher: 'Dr. Emily Chen',
            course: 'Physics Fundamentals',
            date: '2025-06-08',
            note: 'Needs to focus more on lab participation. Theory understanding is good.',
            type: 'improvement'
          }
        ],
        
        // Achievements & Awards
        achievements: [
          {
            id: 1,
            title: "Dean's List",
            description: 'Fall 2024 Semester',
            date: '2024-12-15',
            type: 'academic'
          },
          {
            id: 2,
            title: 'Math Competition Winner',
            description: 'First place in University Math Challenge',
            date: '2024-11-20',
            type: 'competition'
          },
          {
            id: 3,
            title: 'Perfect Attendance',
            description: 'Spring 2024 Semester',
            date: '2024-05-15',
            type: 'attendance'
          }
        ]
      };
      
      setStudentData(mockStudentData);
      setLoading(false);
    };

    fetchStudentData();
  }, [studentId]);

  // Handler functions
  const handleEditProfile = () => {
    setEditFormData({
      name: studentData.name,
      email: studentData.email,
      phone: studentData.phone,
      address: studentData.address,
      major: studentData.major,
      year: studentData.year,
      advisor: studentData.advisor,
      emergencyContactName: studentData.emergencyContact.name,
      emergencyContactRelationship: studentData.emergencyContact.relationship,
      emergencyContactPhone: studentData.emergencyContact.phone,
      emergencyContactEmail: studentData.emergencyContact.email
    });
    setIsEditModalOpen(true);
  };
  const handleSaveProfile = () => {
    // Update the student data with the edited information
    setStudentData(prev => ({
      ...prev,
      name: editFormData.name,
      email: editFormData.email,
      phone: editFormData.phone,
      address: editFormData.address,
      major: editFormData.major,
      year: editFormData.year,
      advisor: editFormData.advisor,
      emergencyContact: {
        name: editFormData.emergencyContactName,
        relationship: editFormData.emergencyContactRelationship,
        phone: editFormData.emergencyContactPhone,
        email: editFormData.emergencyContactEmail
      }
    }));
    setIsEditModalOpen(false);
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    
    // In a real app, you would make an API call here to save the changes
  };

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'text-gray-500';
    const letter = grade.charAt(0);
    switch (letter) {
      case 'A': return 'text-green-600';
      case 'B': return 'text-blue-600';
      case 'C': return 'text-yellow-600';
      case 'D': return 'text-orange-600';
      case 'F': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 95) return 'text-green-600';
    if (percentage >= 85) return 'text-blue-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
        <Sidebar />
        <div className="ml-20 relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading student profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
        <Sidebar />
        <div className="ml-20 relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-light text-gray-800 mb-4">Student Not Found</h1>
            <button 
              onClick={() => navigate('/students')}
              className="btn-primary px-6 py-3 rounded-xl"
            >
              Back to Students
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
      <div className="ml-20 relative z-10 overflow-y-auto h-screen pb-12">
        <div className="max-w-7xl mx-auto px-8 py-12">
          
          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center mb-6">
              <button
                onClick={() => navigate('/students')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex-1">
                <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-2">
                  Student Profile
                </h1>
                <p className="text-body text-gray-600">
                  View and manage student information and academic progress
                </p>
              </div>
                {user?.role === 'teacher' && (
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleEditProfile()}
                    className="btn-secondary px-4 py-2 rounded-xl flex items-center space-x-2"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>              )}
            </div>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-xl animate-slide-up">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-green-800 font-medium">Profile updated successfully!</p>
              </div>
            </div>
          )}

          {/* Student Info Header Card */}
          <div className="glass-card rounded-3xl p-8 mb-8 animate-slide-up">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center">
                <UserIcon className="h-12 w-12 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-light text-gray-800 mb-2">{studentData.name}</h2>
                    <p className="text-gray-600 mb-1">Student ID: {studentData.studentId}</p>
                    <p className="text-gray-600 mb-4">{studentData.major} • {studentData.year}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <EnvelopeIcon className="h-4 w-4" />
                        <span>{studentData.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{studentData.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        studentData.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {studentData.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">GPA: <span className="font-semibold text-gray-800">{studentData.gpa}</span></p>
                    <p className="text-sm text-gray-600">Credits: {studentData.totalCredits}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Current GPA</p>
                  <p className="text-title font-light text-gray-800">{studentData.gpa}</p>
                </div>
                <TrophyIcon className="h-8 w-8 text-orange-500 opacity-60" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Attendance</p>
                  <p className={`text-title font-light ${getAttendanceColor(studentData.attendanceStats.overall)}`}>
                    {studentData.attendanceStats.overall}%
                  </p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-green-500 opacity-60" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Current Classes</p>
                  <p className="text-title font-light text-gray-800">{studentData.currentClasses.length}</p>
                </div>
                <BookOpenIcon className="h-8 w-8 text-blue-500 opacity-60" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Achievements</p>
                  <p className="text-title font-light text-gray-800">{studentData.achievements.length}</p>
                </div>
                <StarIcon className="h-8 w-8 text-purple-500 opacity-60" />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', name: 'Overview', icon: UserIcon },
                  { id: 'classes', name: 'Current Classes', icon: BookOpenIcon },
                  { id: 'assignments', name: 'Assignments', icon: DocumentTextIcon },
                  { id: 'performance', name: 'Performance', icon: ChartBarIcon },
                  { id: 'notes', name: 'Teacher Notes', icon: PencilSquareIcon }
                ].map((tab) => {
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
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Information */}
                <div className="lg:col-span-2">
                  <div className="glass-card rounded-3xl p-8 mb-8">
                    <h3 className="text-2xl font-light text-gray-800 mb-6">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700">{studentData.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700">{studentData.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700">{studentData.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="glass-card rounded-3xl p-8">
                    <h3 className="text-2xl font-light text-gray-800 mb-6">Emergency Contact</h3>
                    <div className="space-y-3">
                      <p className="text-gray-700 font-medium">{studentData.emergencyContact.name}</p>
                      <p className="text-gray-600">{studentData.emergencyContact.relationship}</p>
                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{studentData.emergencyContact.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{studentData.emergencyContact.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Info Sidebar */}
                <div className="space-y-8">
                  <div className="glass-card rounded-3xl p-8">
                    <h3 className="text-2xl font-light text-gray-800 mb-6">Academic Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Current Semester</p>
                        <p className="text-gray-800 font-medium">{studentData.currentSemester}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Academic Advisor</p>
                        <p className="text-gray-800 font-medium">{studentData.advisor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Expected Graduation</p>
                        <p className="text-gray-800 font-medium">{studentData.expectedGraduation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Enrollment Date</p>
                        <p className="text-gray-800 font-medium">{new Date(studentData.enrollmentDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Achievements */}
                  <div className="glass-card rounded-3xl p-8">
                    <h3 className="text-2xl font-light text-gray-800 mb-6">Recent Achievements</h3>
                    <div className="space-y-4">
                      {studentData.achievements.slice(0, 3).map((achievement) => (
                        <div key={achievement.id} className="flex items-start space-x-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <TrophyIcon className="h-4 w-4 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium text-sm">{achievement.title}</p>
                            <p className="text-gray-600 text-xs">{achievement.description}</p>
                            <p className="text-gray-500 text-xs">{new Date(achievement.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'classes' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {studentData.currentClasses.map((classItem) => (
                  <div key={classItem.id} className="glass-card rounded-3xl p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-medium text-gray-800 mb-1">{classItem.name}</h3>
                        <p className="text-gray-600 text-sm">{classItem.code}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(classItem.grade)} bg-gray-100`}>
                        {classItem.grade}
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <p className="text-gray-700 text-sm"><span className="font-medium">Instructor:</span> {classItem.instructor}</p>
                      <p className="text-gray-700 text-sm"><span className="font-medium">Schedule:</span> {classItem.schedule}</p>
                      <p className="text-gray-700 text-sm"><span className="font-medium">Room:</span> {classItem.room}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Attendance</p>
                        <p className={`text-sm font-medium ${getAttendanceColor(classItem.attendance)}`}>{classItem.attendance}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Assignments</p>
                        <p className="text-sm font-medium text-gray-800">{classItem.assignments.completed}/{classItem.assignments.total}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="glass-card rounded-3xl p-8">
                <h3 className="text-2xl font-light text-gray-800 mb-6">Recent Assignments</h3>
                <div className="space-y-4">
                  {studentData.recentAssignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{assignment.title}</h4>
                        <p className="text-gray-600 text-sm">{assignment.course}</p>
                        <p className="text-gray-500 text-sm">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                        {assignment.grade && (
                          <span className={`font-medium ${getGradeColor(assignment.grade)}`}>
                            {assignment.grade}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card rounded-3xl p-8">
                  <h3 className="text-2xl font-light text-gray-800 mb-6">Semester Performance</h3>
                  <div className="space-y-4">
                    {studentData.semesterGrades.map((semester, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-800">{semester.semester}</p>
                          <p className="text-gray-600 text-sm">{semester.credits} Credits</p>
                        </div>
                        <span className={`text-lg font-medium ${getGradeColor('A')}`}>
                          {semester.gpa}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-8">
                  <h3 className="text-2xl font-light text-gray-800 mb-6">Attendance Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Overall Attendance</span>
                      <span className={`font-medium ${getAttendanceColor(studentData.attendanceStats.overall)}`}>
                        {studentData.attendanceStats.overall}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">This Month</span>
                      <span className={`font-medium ${getAttendanceColor(studentData.attendanceStats.thisMonth)}`}>
                        {studentData.attendanceStats.thisMonth}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Total Absences</span>
                      <span className="font-medium text-gray-800">{studentData.attendanceStats.absences}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Total Tardies</span>
                      <span className="font-medium text-gray-800">{studentData.attendanceStats.tardies}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="glass-card rounded-3xl p-8">
                <h3 className="text-2xl font-light text-gray-800 mb-6">Teacher Notes</h3>
                <div className="space-y-6">
                  {studentData.teacherNotes.map((note) => (
                    <div key={note.id} className={`p-6 rounded-xl border-l-4 ${
                      note.type === 'positive' ? 'bg-green-50 border-green-500' : 
                      note.type === 'improvement' ? 'bg-yellow-50 border-yellow-500' : 
                      'bg-gray-50 border-gray-500'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-800">{note.teacher}</p>
                          <p className="text-gray-600 text-sm">{note.course}</p>
                        </div>
                        <span className="text-gray-500 text-sm">{new Date(note.date).toLocaleDateString()}</span>
                      </div>                      <p className="text-gray-700">{note.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-light text-gray-800">Edit Student Profile</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editFormData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
                    <input
                      type="text"
                      value={editFormData.major || ''}
                      onChange={(e) => handleInputChange('major', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <select
                      value={editFormData.year || ''}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Advisor</label>
                    <input
                      type="text"
                      value={editFormData.advisor || ''}
                      onChange={(e) => handleInputChange('advisor', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={editFormData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-4">Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                    <input
                      type="text"
                      value={editFormData.emergencyContactName || ''}
                      onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                    <input
                      type="text"
                      value={editFormData.emergencyContactRelationship || ''}
                      onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      value={editFormData.emergencyContactPhone || ''}
                      onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={editFormData.emergencyContactEmail || ''}
                      onChange={(e) => handleInputChange('emergencyContactEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="btn-primary px-6 py-2 rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default StudentProfile;
