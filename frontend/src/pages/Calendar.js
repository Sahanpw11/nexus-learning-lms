import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  BookOpenIcon,
  UserGroupIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const Calendar = () => {  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock events data
  const getAllEvents = () => [
    {
      id: 1,
      title: 'Advanced Mathematics Lecture',
      date: new Date(2025, 5, 15),
      time: '10:00 AM',
      type: 'class',
      students: 25,
      duration: '1h 30m',
      instructor: 'Dr. Sarah Wilson',
      location: 'Room 205',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Physics Assignment Due',
      date: new Date(2025, 5, 16),
      time: '11:59 PM',
      type: 'assignment',
      priority: 'high',
      subject: 'Quantum Physics',
      points: 150
    },
    {
      id: 3,
      title: 'Chemistry Lab Session',
      date: new Date(2025, 5, 18),
      time: '2:00 PM',
      type: 'session',
      students: 15,
      duration: '2h',
      instructor: 'Dr. Emma Rodriguez',
      location: 'Chemistry Lab A'
    },
    {
      id: 4,
      title: 'Parent-Teacher Conference',
      date: new Date(2025, 5, 20),
      time: '4:00 PM',
      type: 'meeting',
      duration: '30m',
      attendees: ['John Smith', 'Sarah Smith'],
      status: 'pending'
    },
    {
      id: 5,
      title: 'Computer Science Exam',
      date: new Date(),
      time: '2:00 PM',
      type: 'exam',
      students: 18,
      duration: '3h',
      subject: 'Data Structures',
      location: 'Room 101'
    },
    {
      id: 6,
      title: 'Literature Essay Submission',
      date: new Date(2025, 5, 22),
      time: '11:59 PM',
      type: 'assignment',
      priority: 'medium',
      subject: 'English Literature',
      points: 100    }
  ];

  // Filter events based on user role
  const events = (() => {
    const allEvents = getAllEvents();
    
    if (user?.role === 'admin') {
      // Admin sees all events with additional metadata
      return allEvents.map(event => ({
        ...event,
        teacherId: event.instructor === 'Dr. Sarah Wilson' ? 'teacher_1' : 
                  event.instructor === 'Prof. Michael Chen' ? 'teacher_2' : 
                  event.instructor === 'Dr. Emma Rodriguez' ? 'teacher_3' : 'teacher_4'
      }));
    } else if (user?.role === 'teacher') {
      // Teachers see their own events
      const currentTeacherId = user?.id || 'teacher_1';
      const teacherName = currentTeacherId === 'teacher_1' ? 'Dr. Sarah Wilson' : 
                         currentTeacherId === 'teacher_2' ? 'Prof. Michael Chen' : 
                         currentTeacherId === 'teacher_3' ? 'Dr. Emma Rodriguez' : 'Prof. Jane Smith';
      return allEvents.filter(event => event.instructor === teacherName);
    }
    
    // Students see all relevant events
    return allEvents;
  })();

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return date && date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date && date.toDateString() === selectedDate.toDateString();
  };

  const hasEvents = (date) => {
    return date && events.some(event => event.date.toDateString() === date.toDateString());
  };

  const getEventsForDate = (date) => {
    return events.filter(event => event.date.toDateString() === date.toDateString());
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'class': return BookOpenIcon;
      case 'session': return VideoCameraIcon;
      case 'assignment': return DocumentTextIcon;
      case 'meeting': return UserGroupIcon;
      case 'exam': return AcademicCapIcon;
      default: return CalendarIcon;
    }
  };  const getEventColor = (type) => {
    switch (type) {
      case 'class': return 'bg-blue-500/15 text-blue-700 border-blue-500/25';
      case 'session': return 'bg-purple-500/15 text-purple-700 border-purple-500/25';
      case 'assignment': return 'bg-orange-500/15 text-orange-700 border-orange-500/25';
      case 'meeting': return 'bg-green-500/15 text-green-700 border-green-500/25';
      case 'exam': return 'bg-red-500/15 text-red-700 border-red-500/25';
      default: return 'bg-gray-500/15 text-gray-700 border-gray-500/25';
    }
  };
  const getEventStats = () => {
    const today = new Date();
    const thisWeek = events.filter(event => {
      const timeDiff = event.date - today;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return daysDiff >= 0 && daysDiff <= 7;
    });

    if (user?.role === 'admin') {
      // Admin sees system-wide stats with teacher breakdown
      const allEvents = getAllEvents();
      const teacherStats = allEvents.reduce((acc, event) => {
        const teacherId = event.teacherId || 'unknown';
        if (!acc[teacherId]) {
          acc[teacherId] = { name: event.instructor, events: 0, classes: 0, assignments: 0 };
        }
        acc[teacherId].events++;
        if (event.type === 'class') acc[teacherId].classes++;
        if (event.type === 'assignment') acc[teacherId].assignments++;
        return acc;
      }, {});

      return {
        total: allEvents.length,
        today: allEvents.filter(event => event.date.toDateString() === today.toDateString()).length,
        thisWeek: thisWeek.length,
        teachers: Object.keys(teacherStats).length,
        classes: allEvents.filter(event => event.type === 'class').length,
        assignments: allEvents.filter(event => event.type === 'assignment').length,
        teacherBreakdown: teacherStats
      };
    }

    return {
      total: events.length,
      today: events.filter(event => event.date.toDateString() === today.toDateString()).length,
      thisWeek: thisWeek.length,
      classes: events.filter(event => event.type === 'class').length,
      assignments: events.filter(event => event.type === 'assignment').length
    };
  };

  const filteredEvents = selectedCategory === 'all' 
    ? getEventsForDate(selectedDate)
    : getEventsForDate(selectedDate).filter(event => event.type === selectedCategory);
  const stats = getEventStats();
  const days = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-gradient-radial opacity-30"></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-radial opacity-20"></div>
      
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-12">          {/* Header */}
          <div className="flex items-center justify-between mb-12 animate-slide-up">            <div>              <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-3">
                {user?.role === 'admin' ? 'System ' : 'Academic '}<span className="text-gradient">Calendar</span>
              </h1>
              <p className="text-body text-gray-600">
                {user?.role === 'admin' 
                  ? 'Monitor and manage academic schedules across all teachers' 
                  : user?.role === 'student' 
                  ? 'Track your schedule and important dates' 
                  : 'Manage classes, events, and deadlines'
                }
              </p>
            </div>            {(user?.role === 'teacher' || user?.role === 'admin') && (
              <button 
                onClick={() => navigate('/event-creator')}
                className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>New Event</span>
              </button>
            )}
          </div>          {/* Stats Cards */}
          {user?.role === 'admin' ? (
            // Admin Stats - System-wide overview
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12 animate-fade-scale">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Total Events</p>
                    <p className="text-title font-light text-gray-800">{stats.total}</p>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Teachers</p>
                    <p className="text-title font-light text-gray-800">{stats.teachers}</p>
                  </div>
                  <AcademicCapIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Classes</p>
                    <p className="text-title font-light text-gray-800">{stats.classes}</p>
                  </div>
                  <BookOpenIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Assignments</p>
                    <p className="text-title font-light text-gray-800">{stats.assignments}</p>
                  </div>
                  <DocumentTextIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">This Week</p>
                    <p className="text-title font-light text-gray-800">{stats.thisWeek}</p>
                  </div>
                  <UserGroupIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>
            </div>
          ) : (
            // Student/Teacher Stats
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12 animate-fade-scale">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Total Events</p>
                    <p className="text-title font-light text-gray-800">{stats.total}</p>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Today</p>
                    <p className="text-title font-light text-gray-800">{stats.today}</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Classes</p>
                    <p className="text-title font-light text-gray-800">{stats.classes}</p>
                  </div>
                  <BookOpenIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Assignments</p>
                    <p className="text-title font-light text-gray-800">{stats.assignments}</p>
                  </div>
                  <DocumentTextIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">This Week</p>
                    <p className="text-title font-light text-gray-800">{stats.thisWeek}</p>
                  </div>
                  <UserGroupIcon className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
              </div>
            </div>          )}

          {/* Admin Teacher Breakdown */}
          {user?.role === 'admin' && stats.teacherBreakdown && (
            <div className="mb-8 animate-slide-up">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Teacher Schedule Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.teacherBreakdown).map(([teacherId, data]) => (
                  <div key={teacherId} className="glass-card rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">{data.name}</h4>
                      <span className="text-sm text-gray-600">{data.events} events</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-600">{data.classes} classes</span>
                      <span className="text-orange-600">{data.assignments} assignments</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendar and Events Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-scale">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-8">                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-medium text-gray-800">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Day Headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-3 text-center text-sm text-gray-600 font-medium">
                      {day}
                    </div>
                  ))}

                  {/* Calendar Days */}
                  {days.map((date, index) => (
                    <button
                      key={index}
                      onClick={() => date && setSelectedDate(date)}
                      className={`p-3 text-center relative transition-all duration-200 rounded-xl min-h-[50px] ${
                        !date                          ? 'cursor-default'
                          : isSelected(date)
                          ? 'bg-orange-500 text-white shadow-lg scale-105'
                          : isToday(date)
                          ? 'bg-orange-100 text-gray-800 border border-orange-500/50'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                      }`}
                    >
                      {date && (
                        <>
                          <span className="text-sm font-medium">{date.getDate()}</span>
                          {hasEvents(date) && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                              {getEventsForDate(date).slice(0, 3).map((event, i) => (
                                <div key={i} className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                              ))}
                              {getEventsForDate(date).length > 3 && (
                                <span className="text-xs text-orange-400">+</span>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Events for Selected Date */}
            <div className="lg:col-span-1">              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-800">
                    {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                  </h3>
                  
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-100 text-gray-800 text-sm rounded-lg px-3 py-1 border border-gray-300 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="all">All Events</option>
                    <option value="class">Classes</option>
                    <option value="assignment">Assignments</option>
                    <option value="session">Sessions</option>
                    <option value="meeting">Meetings</option>
                    <option value="exam">Exams</option>
                  </select>
                </div>
                  {filteredEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-500 text-sm">No events for this day</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEvents.map((event, index) => {
                      const Icon = getEventIcon(event.type);
                      return (
                        <div 
                          key={event.id} 
                          className={`p-4 rounded-xl border ${getEventColor(event.type)} animate-slide-up`}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-start space-x-3">
                            <Icon className="h-5 w-5 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 text-sm mb-1 truncate">{event.title}</h4>
                              <p className="text-xs text-gray-600 mb-2">{event.time}</p>
                              {event.duration && (
                                <p className="text-xs opacity-60">{event.duration}</p>
                              )}
                              {event.location && (
                                <p className="text-xs opacity-60">{event.location}</p>
                              )}
                              {event.students && (
                                <p className="text-xs opacity-60">{event.students} students</p>
                              )}
                              {event.points && (
                                <p className="text-xs opacity-60">{event.points} points</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Calendar;
