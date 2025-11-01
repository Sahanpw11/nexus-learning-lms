import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {
  CalendarIcon,
  ChevronLeftIcon,
  UserGroupIcon,
  BookOpenIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  AcademicCapIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const EventCreator = () => {
  const { user } = useAuth(); // Used for displaying role-specific UI
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  
  // Form state
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '10:00',
    endTime: '11:00',
    type: 'class',
    location: '',
    description: '',
    students: [],
    selectedClass: '',
    recurring: false,
    recurrencePattern: 'weekly',
    priority: 'medium'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch classes and students data (mock data for now)
  useEffect(() => {
    // Mock classes data
    const mockClasses = [
      { id: 1, name: 'Advanced Mathematics', students: 25 },
      { id: 2, name: 'Physics Fundamentals', students: 18 },
      { id: 3, name: 'Chemistry Lab', students: 15 },
      { id: 4, name: 'Computer Science', students: 20 },
      { id: 5, name: 'Literature Studies', students: 22 }
    ];
    
    // Mock students data
    const mockStudents = [
      { id: 1, name: 'Emma Johnson', grade: 'A' },
      { id: 2, name: 'Noah Williams', grade: 'B+' },
      { id: 3, name: 'Olivia Smith', grade: 'A-' },
      { id: 4, name: 'Liam Brown', grade: 'B' },
      { id: 5, name: 'Ava Davis', grade: 'A' },
      { id: 6, name: 'Ethan Wilson', grade: 'B+' },
      { id: 7, name: 'Sophia Miller', grade: 'A-' },
      { id: 8, name: 'Mason Garcia', grade: 'B' },
      { id: 9, name: 'Isabella Rodriguez', grade: 'A' },
      { id: 10, name: 'Logan Martinez', grade: 'B+' }
    ];
    
    setClasses(mockClasses);
    setStudents(mockStudents);
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleStudentSelection = (studentId) => {
    const studentIdInt = parseInt(studentId);
    if (studentIdInt === 0) { // "All Students" option
      const allStudentIds = students.map(student => student.id);
      setEventData({
        ...eventData,
        students: allStudentIds
      });
      return;
    }
    
    // Toggle student selection
    if (eventData.students.includes(studentIdInt)) {
      setEventData({
        ...eventData,
        students: eventData.students.filter(id => id !== studentIdInt)
      });
    } else {
      setEventData({
        ...eventData,
        students: [...eventData.students, studentIdInt]
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!eventData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!eventData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!eventData.time) {
      newErrors.time = 'Start time is required';
    }
    
    if (!eventData.endTime) {
      newErrors.endTime = 'End time is required';
    }
    
    if (eventData.time >= eventData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }
    
    if (eventData.type === 'meeting' && eventData.students.length === 0) {
      newErrors.students = 'Please select at least one student for the meeting';
    }
    
    if (eventData.type === 'class' && !eventData.selectedClass) {
      newErrors.selectedClass = 'Please select a class';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Here you would normally submit to your API
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success message
      alert('Event created successfully!');
      // Redirect back to the calendar
      navigate('/calendar');
    }, 1500);
  };
  
  const handleCancel = () => {
    navigate('/calendar');
  };
  
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'class': return <BookOpenIcon className="h-5 w-5" />;
      case 'meeting': return <UserGroupIcon className="h-5 w-5" />;
      case 'assignment': return <DocumentTextIcon className="h-5 w-5" />;
      case 'session': return <VideoCameraIcon className="h-5 w-5" />;
      case 'exam': return <AcademicCapIcon className="h-5 w-5" />;
      default: return <CalendarIcon className="h-5 w-5" />;
    }
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
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-12 animate-slide-up">
            <div>
              <button 
                onClick={handleCancel} 
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
              >
                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                Back to Calendar
              </button>
              
              <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-3">
                Create New <span className="text-gradient">Event</span>
              </h1>
              <p className="text-body text-gray-600">
                Schedule a new event in the academic calendar
              </p>
            </div>
          </div>
          
          {/* Create Event Form */}
          <div className="glass-card rounded-2xl p-8 animate-fade-scale max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Event Title */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Event Title
                  </label>                  <input
                    type="text"
                    name="title"
                    value={eventData.title}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800`}
                    placeholder="Enter event title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                
                {/* Event Type */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Event Type
                  </label>
                  <div className="relative">                    <select
                      name="type"
                      value={eventData.type}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-800"
                    >
                      <option value="class">Class</option>
                      <option value="meeting">Meeting</option>
                      <option value="assignment">Assignment</option>
                      <option value="session">Live Session</option>
                      <option value="exam">Exam</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                      <span>{getEventTypeIcon(eventData.type)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Date */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Date
                  </label>                  <input
                    type="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800`}
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>
                
                {/* Start Time */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Start Time
                  </label>
                  <div className="relative">                    <input
                      type="time"
                      name="time"
                      value={eventData.time}
                      onChange={handleChange}
                      className={`w-full p-3 border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800`}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                      <ClockIcon className="h-5 w-5" />
                    </div>
                  </div>
                  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                </div>
                
                {/* End Time */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    End Time
                  </label>
                  <div className="relative">                    <input
                      type="time"
                      name="endTime"
                      value={eventData.endTime}
                      onChange={handleChange}
                      className={`w-full p-3 border ${errors.endTime ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800`}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                      <ClockIcon className="h-5 w-5" />
                    </div>
                  </div>
                  {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
                </div>
                
                {/* Location - only for classes, sessions, exams */}
                {(eventData.type === 'class' || eventData.type === 'session' || eventData.type === 'exam') && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="location"
                        value={eventData.location}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter location"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                        <MapPinIcon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Class Selection - only for class type */}
                {eventData.type === 'class' && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Class
                    </label>
                    <select
                      name="selectedClass"
                      value={eventData.selectedClass}
                      onChange={handleChange}
                      className={`w-full p-3 border ${errors.selectedClass ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    >
                      <option value="">Select a class</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} ({cls.students} students)
                        </option>
                      ))}
                    </select>
                    {errors.selectedClass && <p className="text-red-500 text-sm mt-1">{errors.selectedClass}</p>}
                  </div>
                )}
                
                {/* Priority - only for assignments */}
                {eventData.type === 'assignment' && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={eventData.priority}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                )}
                
                {/* Recurring Option */}
                <div className="col-span-1 md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="recurring"
                      checked={eventData.recurring}
                      onChange={() => setEventData({...eventData, recurring: !eventData.recurring})}
                      className="form-checkbox h-5 w-5 text-orange-500 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-gray-700">Recurring Event</span>
                  </label>
                </div>
                
                {/* Recurrence Pattern */}
                {eventData.recurring && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Recurrence Pattern
                    </label>
                    <select
                      name="recurrencePattern"
                      value={eventData.recurrencePattern}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}
                
                {/* Description */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Description
                  </label>                  <textarea
                    name="description"
                    value={eventData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
                    placeholder="Enter event description"
                  ></textarea>
                </div>
                
                {/* Student Selection - for meetings */}
                {eventData.type === 'meeting' && (
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                      <UsersIcon className="h-5 w-5 mr-2" />
                      Select Students
                    </label>
                    {errors.students && <p className="text-red-500 text-sm mb-2">{errors.students}</p>}
                    
                    <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                      <div className="mb-2">
                        <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            value={0}
                            onChange={() => handleStudentSelection(0)}
                            checked={eventData.students.length === students.length}
                            className="form-checkbox h-4 w-4 text-orange-500 rounded focus:ring-orange-500"
                          />
                          <span className="ml-2 text-gray-800 font-medium">All Students</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {students.map(student => (
                          <label key={student.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <input
                              type="checkbox"
                              value={student.id}
                              onChange={() => handleStudentSelection(student.id)}
                              checked={eventData.students.includes(student.id)}
                              className="form-checkbox h-4 w-4 text-orange-500 rounded focus:ring-orange-500"
                            />
                            <span className="ml-2 text-gray-800">{student.name}</span>
                            <span className="ml-auto text-xs bg-gray-100 text-gray-600 py-1 px-2 rounded">
                              {student.grade}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-5 w-5" />
                      <span>Create Event</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EventCreator;
