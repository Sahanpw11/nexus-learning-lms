import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  DocumentTextIcon,
  PlusIcon,
  BookOpenIcon,
  PencilSquareIcon,
  ClockIcon,
  StarIcon,
  EyeIcon,
  FolderOpenIcon,
  AcademicCapIcon,
  FolderIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  FolderPlusIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const Notes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('blue');

  useEffect(() => {
    if (!user) return;

    // Mock folders data - different for teachers and students
    let mockFolders = [];
    let mockNotes = [];

    if (user?.role === 'teacher') {
      // Teacher folders - focused on class management and teaching materials
      mockFolders = [
        {
          id: 1,
          name: 'Class Materials',
          color: 'blue',
          icon: 'academic',
          description: 'Lesson plans and teaching resources',
          noteCount: 4,
          createdAt: '2025-06-01'
        },
        {
          id: 2,
          name: 'Student Assessments',
          color: 'purple',
          icon: 'research',
          description: 'Evaluation notes and feedback',
          noteCount: 3,
          createdAt: '2025-06-02'
        },
        {
          id: 3,
          name: 'Curriculum Development',
          color: 'orange',
          icon: 'code',
          description: 'Course planning and syllabus notes',
          noteCount: 5,
          createdAt: '2025-06-03'
        },
        {
          id: 4,
          name: 'Research & Publications',
          color: 'pink',
          icon: 'book',
          description: 'Academic research and writing',
          noteCount: 2,
          createdAt: '2025-06-04'
        }
      ];

      // Teacher notes - focused on teaching and class management
      mockNotes = [
        {
          id: 1,
          title: 'Advanced Mathematics Lesson Plan - Week 3',
          content: 'Focus on integration techniques: substitution method, integration by parts, and partial fractions. Include practical examples and step-by-step demonstrations.',
          subject: 'Advanced Mathematics',
          category: 'lesson-plan',
          folderId: 1,
          tags: ['calculus', 'integration', 'lesson-plan'],
          createdAt: '2025-06-15T09:00:00',
          lastModified: '2025-06-15T14:30:00',
          priority: 'high',
          isStarred: true,
          color: 'blue',
          wordCount: 850,
          readTime: '4 min',
          sharedWith: ['all-students']
        },
        {
          id: 2,
          title: 'Physics Lab Safety Guidelines',
          content: 'Important safety protocols for quantum mechanics experiments. Always wear protective equipment and follow proper procedures.',
          subject: 'Physics Fundamentals',
          category: 'guidelines',
          folderId: 1,
          tags: ['safety', 'lab-work', 'physics'],
          createdAt: '2025-06-14T11:00:00',
          lastModified: '2025-06-15T10:20:00',
          priority: 'high',
          isStarred: true,
          color: 'red',
          wordCount: 650,
          readTime: '3 min',
          sharedWith: ['physics-students']
        },
        {
          id: 3,
          title: 'Student Performance Analysis - Midterm',
          content: 'Analysis of student performance patterns and areas for improvement. Focus on differential equations and integration techniques.',
          subject: 'Assessment',
          category: 'evaluation',
          folderId: 2,
          tags: ['assessment', 'student-progress', 'analysis'],
          createdAt: '2025-06-13T16:00:00',
          lastModified: '2025-06-14T09:15:00',
          priority: 'medium',
          isStarred: false,
          color: 'purple',
          wordCount: 1200,
          readTime: '5 min',
          sharedWith: []
        },
        {
          id: 4,
          title: 'Curriculum Update - Differential Equations',
          content: 'New teaching approach for differential equations incorporating real-world applications and modern computational methods.',
          subject: 'Curriculum',
          category: 'planning',
          folderId: 3,
          tags: ['curriculum', 'differential-equations', 'methodology'],
          createdAt: '2025-06-12T14:00:00',
          lastModified: '2025-06-13T11:30:00',
          priority: 'medium',
          isStarred: true,
          color: 'orange',
          wordCount: 950,
          readTime: '4 min',
          sharedWith: []
        },
        {
          id: 5,
          title: 'Research Notes - Quantum Computing Applications',
          content: 'Exploring quantum computing applications in mathematical modeling and their potential impact on computational physics.',
          subject: 'Research',
          category: 'research',
          folderId: 4,
          tags: ['quantum-computing', 'research', 'mathematics'],
          createdAt: '2025-06-11T10:00:00',
          lastModified: '2025-06-12T15:45:00',
          priority: 'low',
          isStarred: false,
          color: 'indigo',
          wordCount: 1800,
          readTime: '7 min',
          sharedWith: []
        }
      ];
    } else {
      // Student folders - focused on learning and assignments
      mockFolders = [
        {
          id: 1,
          name: 'Mathematics Study',
          color: 'blue',
          icon: 'academic',
          description: 'All math-related notes and formulas',
          noteCount: 3,
          createdAt: '2025-06-01'
        },
        {
          id: 2,
          name: 'Physics Research',
          color: 'purple',
          icon: 'research',
          description: 'Quantum mechanics and theoretical physics',
          noteCount: 2,
          createdAt: '2025-06-02'
        },
        {
          id: 3,
          name: 'Assignment Notes',
          color: 'orange',
          icon: 'code',
          description: 'Assignment solutions and study guides',
          noteCount: 4,
          createdAt: '2025-06-03'
        },
        {
          id: 4,
          name: 'Shared Class Notes',
          color: 'pink',
          icon: 'book',
          description: 'Notes shared by instructors',
          noteCount: 2,
          createdAt: '2025-06-04'
        }
      ];

      // Student notes - focused on learning and assignments
      mockNotes = [
        {
          id: 1,
          title: 'Integration Techniques Summary',
          content: 'Personal notes on various integration methods: substitution, by parts, partial fractions. Include key formulas and example problems.',
          subject: 'Advanced Mathematics',
          category: 'study-notes',
          folderId: 1,
          tags: ['calculus', 'integration', 'formulas'],
          createdAt: '2025-06-15T18:00:00',
          lastModified: '2025-06-15T19:30:00',
          priority: 'high',
          isStarred: true,
          color: 'blue',
          wordCount: 650,
          readTime: '3 min'
        },
        {
          id: 2,
          title: 'Physics Lab Report - Wave Interference',
          content: 'Experimental observations and calculations for wave interference patterns. Include data analysis and conclusions.',
          subject: 'Physics Fundamentals',
          category: 'lab-report',
          folderId: 2,
          tags: ['physics', 'lab', 'waves'],
          createdAt: '2025-06-14T20:00:00',
          lastModified: '2025-06-15T08:45:00',
          priority: 'high',
          isStarred: false,
          color: 'purple',
          wordCount: 1200,
          readTime: '5 min'
        },
        {
          id: 3,
          title: 'Assignment 3 - Linear Algebra Solutions',
          content: 'Step-by-step solutions for matrix operations and eigenvalue problems. Includes verification and alternative methods.',
          subject: 'Advanced Mathematics',
          category: 'assignment',
          folderId: 3,
          tags: ['linear-algebra', 'assignment', 'matrices'],
          createdAt: '2025-06-13T21:30:00',
          lastModified: '2025-06-14T16:20:00',
          priority: 'medium',
          isStarred: true,
          color: 'green',
          wordCount: 800,
          readTime: '4 min'
        },
        {
          id: 4,
          title: 'Class Notes - Differential Equations',
          content: 'Shared lesson notes from Dr. John Smith on solving first-order differential equations using separation of variables and integrating factors.',
          subject: 'Differential Equations',
          category: 'class-notes',
          folderId: 4,
          tags: ['differential-equations', 'shared', 'class'],
          createdAt: '2025-06-12T14:30:00',
          lastModified: '2025-06-12T14:30:00',
          priority: 'medium',
          isStarred: false,
          color: 'orange',
          wordCount: 950,
          readTime: '4 min',
          sharedBy: 'Dr. John Smith'
        }
      ];
    }

    setFolders(mockFolders);
    setNotes(mockNotes);
  }, [user]);

  const filteredNotes = notes.filter(note => {
    // Filter by folder first
    if (selectedFolder) {
      return note.folderId === selectedFolder;
    }
    
    // Then by general filter
    switch (filter) {
      case 'starred':
        return note.isStarred;
      case 'recent':
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return new Date(note.lastModified) > threeDaysAgo;
      case 'uncategorized':
        return !note.folderId;
      default:
        return true;
    }
  });

  const getFolderNotes = (folderId) => {
    return selectedFolder === folderId 
      ? notes.filter(note => note.folderId === folderId)
      : notes;
  };

  const toggleStar = (noteId) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, isStarred: !note.isStarred } : note
    ));
  };

  const handleFolderClick = (folderId) => {
    setSelectedFolder(folderId === selectedFolder ? null : folderId);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now(),
        name: newFolderName.trim(),
        color: newFolderColor,
        icon: 'folder',
        description: '',
        noteCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setNewFolderColor('blue');
      setShowFolderModal(false);
    }
  };

  const handleUpdateFolder = () => {
    if (newFolderName.trim() && editingFolder) {
      setFolders(folders.map(folder =>
        folder.id === editingFolder.id
          ? { ...folder, name: newFolderName.trim(), color: newFolderColor }
          : folder
      ));
      setEditingFolder(null);
      setNewFolderName('');
      setNewFolderColor('blue');
      setShowFolderModal(false);
    }
  };

  const handleDeleteFolder = (folderId) => {
    setFolders(folders.filter(folder => folder.id !== folderId));
    
    // Move notes from deleted folder to uncategorized
    setNotes(notes.map(note => 
      note.folderId === folderId ? { ...note, folderId: null } : note
    ));
    
    if (selectedFolder === folderId) {
      setSelectedFolder(null);
    }
  };

  const getNoteCountForFolder = (folderId) => {
    return notes.filter(note => note.folderId === folderId).length;
  };

  const getUncategorizedCount = () => {
    return notes.filter(note => note.folderId === null).length;
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
              <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-3">
                {user?.role === 'teacher' ? 'Teaching' : 'My'} <span className="text-gradient">Notes</span>
              </h1>
              <p className="text-body text-gray-600">
                {user?.role === 'teacher' 
                  ? 'Create and manage notes for your classes and students'
                  : 'Access your study materials and shared class notes'
                }
              </p>
            </div>
            <div className="flex space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  List
                </button>
              </div>
              
              <button
                onClick={() => setShowFolderModal(true)}
                className="btn-secondary px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
              >
                <FolderPlusIcon className="h-4 w-4" />
                <span>New Folder</span>
              </button>
              
              <button className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2">
                <PlusIcon className="h-5 w-5" />
                <span>{user?.role === 'teacher' ? 'Create Note' : 'New Note'}</span>
              </button>
            </div>
          </div>

          {/* Folders Section */}
          <div className="mb-12 animate-fade-scale">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-montserrat font-medium text-gray-800">Folders</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {folders.map((folder) => (
                <FolderCard 
                  key={folder.id} 
                  folder={folder} 
                  noteCount={getNoteCountForFolder(folder.id)}
                  isSelected={selectedFolder === folder.id}
                  onClick={() => handleFolderClick(folder.id)}
                  onEdit={(folder) => {
                    setEditingFolder(folder);
                    setNewFolderName(folder.name);
                    setNewFolderColor(folder.color);
                    setShowFolderModal(true);
                  }}
                  onDelete={handleDeleteFolder}
                />
              ))}
              
              {/* Uncategorized Folder */}
              <FolderCard 
                folder={{
                  id: null,
                  name: 'Uncategorized',
                  color: 'gray',
                  icon: 'folder',
                  description: 'Notes without a folder'
                }}
                noteCount={getUncategorizedCount()}
                isSelected={selectedFolder === null && filter === 'uncategorized'}
                onClick={() => {
                  setSelectedFolder(null);
                  setFilter('uncategorized');
                }}
                showActions={false}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between mb-8 animate-slide-up">
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All Notes', icon: DocumentTextIcon },
                { key: 'starred', label: 'Starred', icon: StarIcon },
                { key: 'recent', label: 'Recent', icon: ClockIcon }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setFilter(tab.key);
                    if (tab.key !== 'uncategorized') setSelectedFolder(null);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === tab.key && !selectedFolder
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            
            {selectedFolder && (
              <button
                onClick={() => setSelectedFolder(null)}
                className="text-gray-600 hover:text-gray-800 text-sm flex items-center space-x-1"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Clear folder filter</span>
              </button>
            )}
          </div>

          {/* Notes Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredNotes.map((note, index) => (
              <NoteCard
                key={note.id}
                note={note}
                viewMode={viewMode}
                index={index}
                onToggleStar={() => toggleStar(note.id)}
                userRole={user?.role}
              />
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-16">
              <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No notes found</h3>
              <p className="text-gray-600 mb-6">
                {selectedFolder ? 'This folder is empty.' : 'Create your first note to get started.'}
              </p>
              <button className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto">
                <PlusIcon className="h-5 w-5" />
                <span>Create Note</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-montserrat font-medium text-gray-800 mb-6">
              {editingFolder ? 'Edit Folder' : 'Create New Folder'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter folder name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex space-x-2">
                  {['blue', 'purple', 'orange', 'pink', 'green', 'indigo'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewFolderColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newFolderColor === color ? 'border-gray-800' : 'border-gray-300'
                      } bg-${color}-500`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-4 mt-8">
              <button
                onClick={() => {
                  setShowFolderModal(false);
                  setEditingFolder(null);
                  setNewFolderName('');
                  setNewFolderColor('blue');
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingFolder ? handleUpdateFolder : handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-6 py-2 btn-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingFolder ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FolderCard = ({ folder, noteCount, isSelected, onClick, onEdit, onDelete, showActions = true }) => {
  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'from-blue-400 to-blue-600 border-blue-200',
      purple: 'from-purple-400 to-purple-600 border-purple-200',
      orange: 'from-orange-400 to-orange-600 border-orange-200',
      pink: 'from-pink-400 to-pink-600 border-pink-200',
      green: 'from-green-400 to-green-600 border-green-200',
      indigo: 'from-indigo-400 to-indigo-600 border-indigo-200',
      gray: 'from-gray-400 to-gray-600 border-gray-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 group ${
        isSelected ? 'ring-2 ring-orange-500 shadow-glow' : 'hover:shadow-glow'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColorClasses(folder.color)} flex items-center justify-center`}>
          <FolderIcon className="h-6 w-6 text-white" />
        </div>
        
        {showActions && (
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(folder);
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <PencilIcon className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(folder.id);
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <TrashIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>
      
      <h3 className="font-semibold text-gray-800 mb-2">{folder.name}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{folder.description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {noteCount} {noteCount === 1 ? 'note' : 'notes'}
        </span>
        <span className="text-xs text-gray-500">{folder.createdAt}</span>
      </div>
    </div>
  );
};

const NoteCard = ({ note, viewMode, index, onToggleStar, userRole }) => {
  const getCategoryColor = (category) => {
    const colorMap = {
      'lesson-plan': 'bg-blue-500/20 text-blue-700 border-blue-500/30',
      'guidelines': 'bg-red-500/20 text-red-700 border-red-500/30',
      'evaluation': 'bg-purple-500/20 text-purple-700 border-purple-500/30',
      'planning': 'bg-orange-500/20 text-orange-700 border-orange-500/30',
      'research': 'bg-indigo-500/20 text-indigo-700 border-indigo-500/30',
      'study-notes': 'bg-green-500/20 text-green-700 border-green-500/30',
      'lab-report': 'bg-purple-500/20 text-purple-700 border-purple-500/30',
      'assignment': 'bg-orange-500/20 text-orange-700 border-orange-500/30',
      'class-notes': 'bg-blue-500/20 text-blue-700 border-blue-500/30',
      'theory': 'bg-indigo-500/20 text-indigo-700 border-indigo-500/30',
      'tutorial': 'bg-green-500/20 text-green-700 border-green-500/30',
      'formula': 'bg-blue-500/20 text-blue-700 border-blue-500/30',
      'analysis': 'bg-purple-500/20 text-purple-700 border-purple-500/30'
    };
    return colorMap[category] || 'bg-gray-500/20 text-gray-700 border-gray-500/30';
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      high: 'bg-red-500/20 text-red-700 border-red-500/30',
      medium: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
      low: 'bg-green-500/20 text-green-700 border-green-500/30'
    };
    return colorMap[priority] || 'bg-gray-500/20 text-gray-700 border-gray-500/30';
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="glass-card rounded-xl p-6 animate-slide-up hover:scale-[1.01] transition-all duration-300"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <DocumentTextIcon className="h-5 w-5 text-gray-600" />
              </div>
              
              <div>
                <h3 className="text-gray-800 font-semibold text-lg">{note.title}</h3>
                <p className="text-gray-600 text-sm">{note.subject}</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{note.content}</p>
            
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(note.category)}`}>
                {note.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(note.priority)}`}>
                {note.priority} priority
              </span>
              <span className="text-gray-600 text-xs">{note.readTime}</span>
              {note.sharedBy && (
                <span className="text-gray-600 text-xs">Shared by {note.sharedBy}</span>
              )}
              {userRole === 'teacher' && note.sharedWith && note.sharedWith.length > 0 && (
                <span className="text-gray-600 text-xs">Shared with students</span>
              )}
            </div>
          </div>
          
          <div className="text-right ml-6">
            <div className="flex items-center space-x-2 mb-2">
              <button
                onClick={onToggleStar}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                {note.isStarred ? (
                  <StarSolidIcon className="h-5 w-5 text-yellow-500" />
                ) : (
                  <StarIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {new Date(note.lastModified).toLocaleDateString()}
            </p>
            <div className="flex space-x-2">
              <button className="btn-secondary p-2 rounded-lg">
                <EyeIcon className="h-4 w-4" />
              </button>
              <button className="btn-secondary p-2 rounded-lg">
                <PencilSquareIcon className="h-4 w-4" />
              </button>
            </div>
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
        <div className="p-3 bg-gray-100 rounded-xl">
          <DocumentTextIcon className="h-6 w-6 text-gray-600" />
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleStar}
            className="p-1 hover:bg-gray-100 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            {note.isStarred ? (
              <StarSolidIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <StarIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(note.priority)}`}>
            {note.priority}
          </span>
        </div>
      </div>

      <h3 className="text-gray-800 font-semibold text-lg mb-2 group-hover:text-orange-400 transition-colors">
        {note.title}
      </h3>
      <p className="text-orange-400 text-sm font-medium mb-3">{note.subject}</p>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.content}</p>

      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(note.category)}`}>
          {note.category}
        </span>
        <span className="text-gray-600 text-xs">{note.readTime}</span>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600 text-xs">{note.wordCount} words</span>
          <span className="text-gray-600 text-xs">
            {new Date(note.lastModified).toLocaleDateString()}
          </span>
        </div>
        
        {note.sharedBy && (
          <p className="text-gray-600 text-xs mb-2">Shared by {note.sharedBy}</p>
        )}
        
        {userRole === 'teacher' && note.sharedWith && note.sharedWith.length > 0 && (
          <p className="text-gray-600 text-xs mb-2">Shared with students</p>
        )}
        
        <div className="flex space-x-2">
          <button className="btn-primary flex-1 py-2 px-4 rounded-lg text-sm">
            {userRole === 'teacher' ? 'Edit' : 'View'}
          </button>
          <button className="btn-secondary p-2 rounded-lg">
            <BookOpenIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notes;
