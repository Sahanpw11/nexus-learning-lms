import React, { useState, useEffect } from 'react';
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
    // Mock folders data - replace with API call
    const mockFolders = [
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
        name: 'Programming Notes',
        color: 'orange',
        icon: 'code',
        description: 'Web development and algorithms',
        noteCount: 4,
        createdAt: '2025-06-03'
      },
      {
        id: 4,
        name: 'Literature & Essays',
        color: 'pink',
        icon: 'book',
        description: 'Literary analysis and writing notes',
        noteCount: 2,
        createdAt: '2025-06-04'
      }
    ];
    setFolders(mockFolders);

    // Mock notes data - replace with API call
    const mockNotes = [
      {
        id: 1,
        title: 'Calculus Integration Techniques',
        subject: 'Advanced Mathematics',
        content: 'Integration by parts, substitution methods, and partial fractions. Key formulas and example problems with step-by-step solutions.',
        tags: ['calculus', 'integration', 'mathematics'],
        createdAt: '2025-06-10',
        updatedAt: '2025-06-14',
        isFavorite: true,
        category: 'lecture',
        folderId: 1,
        color: 'blue',
        wordCount: 1250,
        readTime: '5 min'
      },
      {
        id: 2,
        title: 'Quantum Mechanics Principles',
        subject: 'Physics',
        content: 'Wave-particle duality, uncertainty principle, and Schrödinger equation. Applications in modern technology and theoretical implications.',
        tags: ['quantum', 'physics', 'theory'],
        createdAt: '2025-06-12',
        updatedAt: '2025-06-13',
        isFavorite: false,
        category: 'research',
        folderId: 2,
        color: 'purple',
        wordCount: 980,
        readTime: '4 min'
      },
      {
        id: 3,
        title: 'Organic Chemistry Reactions',
        subject: 'Chemistry',
        content: 'Synthesis pathways, reaction mechanisms, and stereochemistry. Focus on pharmaceutical applications and industrial processes.',
        tags: ['organic', 'chemistry', 'synthesis'],
        createdAt: '2025-06-08',
        updatedAt: '2025-06-15',
        isFavorite: true,
        category: 'lab',
        folderId: null, // Uncategorized
        color: 'green',
        wordCount: 1500,
        readTime: '6 min'
      },
      {
        id: 4,
        title: 'React Hooks Deep Dive',
        subject: 'Computer Science',
        content: 'useState, useEffect, useContext, and custom hooks. Best practices for state management and performance optimization.',
        tags: ['react', 'hooks', 'javascript'],
        createdAt: '2025-06-11',
        updatedAt: '2025-06-11',
        isFavorite: false,
        category: 'tutorial',
        folderId: 3,
        color: 'orange',
        wordCount: 800,
        readTime: '3 min'
      },
      {
        id: 5,
        title: 'Literature Analysis - Modern Poetry',
        subject: 'English Literature',
        content: 'Themes in contemporary poetry, stylistic devices, and cultural context. Analysis of major works and movements.',
        tags: ['literature', 'poetry', 'analysis'],
        createdAt: '2025-06-09',
        updatedAt: '2025-06-14',
        isFavorite: true,
        category: 'essay',
        folderId: 4,
        color: 'pink',
        wordCount: 1100,
        readTime: '4 min'
      },
      {
        id: 6,
        title: 'Data Structures and Algorithms',
        subject: 'Computer Science',
        content: 'Arrays, linked lists, trees, graphs, and sorting algorithms. Time complexity analysis and practical implementations.',
        tags: ['algorithms', 'data-structures', 'programming'],
        createdAt: '2025-06-07',
        updatedAt: '2025-06-12',
        isFavorite: false,
        category: 'study',
        folderId: 3,
        color: 'indigo',
        wordCount: 2200,
        readTime: '9 min'
      }
    ];
    setNotes(mockNotes);
  }, []);

  const filteredNotes = notes.filter(note => {
    // Filter by folder first
    if (selectedFolder) {
      if (selectedFolder === 'uncategorized') {
        if (note.folderId !== null) return false;
      } else {
        if (note.folderId !== selectedFolder) return false;
      }
    }
    
    // Then apply category/status filter
    if (filter === 'all') return true;
    if (filter === 'favorites') return note.isFavorite;
    return note.category === filter;
  });

  const getStatusStats = () => {
    const filteredByFolder = selectedFolder 
      ? notes.filter(note => 
          selectedFolder === 'uncategorized' 
            ? note.folderId === null 
            : note.folderId === selectedFolder
        )
      : notes;
      
    return {
      total: filteredByFolder.length,
      favorites: filteredByFolder.filter(n => n.isFavorite).length,
      recent: filteredByFolder.filter(n => {
        const noteDate = new Date(n.updatedAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return noteDate >= weekAgo;
      }).length,
      folders: folders.length
    };
  };

  const stats = getStatusStats();

  const toggleFavorite = (noteId) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note
    ));
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder = {
      id: folders.length + 1,
      name: newFolderName,
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
  };

  const editFolder = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      setEditingFolder(folder);
      setNewFolderName(folder.name);
      setNewFolderColor(folder.color);
      setShowFolderModal(true);
    }
  };

  const updateFolder = () => {
    if (!newFolderName.trim() || !editingFolder) return;
    
    setFolders(folders.map(folder => 
      folder.id === editingFolder.id 
        ? { ...folder, name: newFolderName, color: newFolderColor }
        : folder
    ));
    
    setEditingFolder(null);
    setNewFolderName('');
    setNewFolderColor('blue');
    setShowFolderModal(false);
  };

  const deleteFolder = (folderId) => {
    // Move notes from deleted folder to uncategorized
    setNotes(notes.map(note => 
      note.folderId === folderId ? { ...note, folderId: null } : note
    ));
    
    setFolders(folders.filter(folder => folder.id !== folderId));
    
    if (selectedFolder === folderId) {
      setSelectedFolder(null);
    }
  };

  const getFolderStats = (folderId) => {
    return notes.filter(note => note.folderId === folderId).length;
  };

  const getUncategorizedCount = () => {
    return notes.filter(note => note.folderId === null).length;
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-sf">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-gradient-radial opacity-30"></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-radial opacity-20"></div>
      
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-80 relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-12 animate-slide-up">
            <div>
              <h1 className="text-display font-extralight text-white mb-3">
                <span className="text-gradient">Notes</span>
              </h1>
              <p className="text-body text-text-white-muted">
                Organize your study materials and important insights
              </p>
            </div>
            <div className="flex space-x-4">
              <div className="flex bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md text-caption transition-all duration-200 ${
                    viewMode === 'grid' ? 'bg-primary-orange text-white' : 'text-text-white-muted hover:text-white'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md text-caption transition-all duration-200 ${
                    viewMode === 'list' ? 'bg-primary-orange text-white' : 'text-text-white-muted hover:text-white'
                  }`}
                >
                  List
                </button>
              </div>
              <button className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2">
                <PlusIcon className="h-5 w-5" />
                <span>New Note</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-fade-scale">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-caption text-text-white-muted font-medium tracking-wider uppercase">Total Notes</p>
                  <p className="text-title font-light text-white">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-xl">
                  <StarIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-caption text-text-white-muted font-medium tracking-wider uppercase">Favorites</p>
                  <p className="text-title font-light text-white">{stats.favorites}</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-caption text-text-white-muted font-medium tracking-wider uppercase">Recent</p>
                  <p className="text-title font-light text-white">{stats.recent}</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl">
                  <FolderOpenIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-caption text-text-white-muted font-medium tracking-wider uppercase">Folders</p>
                  <p className="text-title font-light text-white">{stats.folders}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Folder Management Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8 animate-fade-scale">
            {/* Folder Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-h3 font-sf font-medium text-white">My Folders</h3>
                  <button 
                    onClick={() => setShowFolderModal(true)}
                    className="p-2 text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    <FolderPlusIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {/* All Notes */}
                  <button
                    onClick={() => setSelectedFolder(null)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center space-x-3 ${
                      selectedFolder === null
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'text-text-white-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <BookOpenIcon className="h-4 w-4" />
                    <div className="flex-1">
                      <span className="text-caption font-medium">All Notes</span>
                      <div className="text-micro text-text-white-muted">{notes.length} notes</div>
                    </div>
                  </button>

                  {/* Custom Folders */}
                  {folders.map((folder) => (
                    <FolderItem 
                      key={folder.id} 
                      folder={folder} 
                      isSelected={selectedFolder === folder.id}
                      noteCount={getFolderStats(folder.id)}
                      onSelect={() => setSelectedFolder(folder.id)}
                      onEdit={() => editFolder(folder.id)}
                      onDelete={() => deleteFolder(folder.id)}
                    />
                  ))}

                  {/* Uncategorized */}
                  {getUncategorizedCount() > 0 && (
                    <button
                      onClick={() => setSelectedFolder('uncategorized')}
                      className={`w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center space-x-3 ${
                        selectedFolder === 'uncategorized'
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : 'text-text-white-muted hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <DocumentTextIcon className="h-4 w-4" />
                      <div className="flex-1">
                        <span className="text-caption font-medium">Uncategorized</span>
                        <div className="text-micro text-text-white-muted">{getUncategorizedCount()} notes</div>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Selected Folder Info */}
              {selectedFolder && selectedFolder !== 'uncategorized' && (
                <div className="glass-card rounded-2xl p-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-${folders.find(f => f.id === selectedFolder)?.color || 'blue'}-500 to-${folders.find(f => f.id === selectedFolder)?.color || 'blue'}-600`}>
                      <FolderOpenIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-heading font-medium text-white">
                        {folders.find(f => f.id === selectedFolder)?.name}
                      </h4>
                      <p className="text-caption text-text-white-muted">
                        {folders.find(f => f.id === selectedFolder)?.description || 'No description'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-caption text-white">{getFolderStats(selectedFolder)} notes</p>
                      <p className="text-micro text-text-white-muted">in this folder</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Filter Tabs */}
              <div className="flex space-x-2 mb-6">
                {['all', 'favorites', 'lecture', 'research', 'lab', 'tutorial', 'essay', 'study'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 rounded-lg text-caption font-medium transition-all duration-200 ${
                      filter === category
                        ? 'bg-primary-orange text-white'
                        : 'text-text-white-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              {/* Notes List/Grid */}
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
                  : 'space-y-4'
              }`}>
                {filteredNotes.map((note) => (
                  viewMode === 'grid' ? (
                    <NoteGridCard key={note.id} note={note} onToggleFavorite={toggleFavorite} />
                  ) : (
                    <NoteListCard key={note.id} note={note} onToggleFavorite={toggleFavorite} />
                  )
                ))}
                
                {filteredNotes.length === 0 && (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">
                      {selectedFolder ? 'No notes in this folder' : 'No notes found'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Folder Modal */}
          {showFolderModal && (
            <FolderModal
              isEditing={!!editingFolder}
              folderName={newFolderName}
              folderColor={newFolderColor}
              onNameChange={setNewFolderName}
              onColorChange={setNewFolderColor}
              onSave={editingFolder ? updateFolder : createFolder}
              onCancel={() => {
                setShowFolderModal(false);
                setEditingFolder(null);
                setNewFolderName('');
                setNewFolderColor('blue');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const NoteGridCard = ({ note, onToggleFavorite }) => {
  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
      green: 'from-green-500/20 to-green-600/20 border-green-500/30',
      orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
      pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
      indigo: 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className={`glass-card rounded-2xl p-6 hover:shadow-glow transition-all duration-300 hover:transform hover:-translate-y-1 bg-gradient-to-br border ${getColorClasses(note.color)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-heading font-medium text-white mb-2 line-clamp-2">{note.title}</h3>
          <p className="text-caption text-text-white-muted mb-3">{note.subject}</p>
        </div>
        <button
          onClick={() => onToggleFavorite(note.id)}
          className="text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          {note.isFavorite ? (
            <StarSolidIcon className="h-5 w-5" />
          ) : (
            <StarIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <p className="text-body text-text-white-muted mb-4 line-clamp-3">{note.content}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {note.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-2 py-1 bg-white/10 text-text-white-muted text-micro rounded-full">
            #{tag}
          </span>
        ))}
        {note.tags.length > 3 && (
          <span className="px-2 py-1 bg-white/10 text-text-white-muted text-micro rounded-full">
            +{note.tags.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center space-x-4 text-text-white-muted">
          <span className="text-micro flex items-center space-x-1">
            <EyeIcon className="h-3 w-3" />
            <span>{note.readTime}</span>
          </span>
          <span className="text-micro">{note.wordCount} words</span>
        </div>
        <button className="btn-primary px-4 py-2 rounded-lg text-caption font-medium">
          Open
        </button>
      </div>
    </div>
  );
};

const NoteListCard = ({ note, onToggleFavorite }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'lecture': return AcademicCapIcon;
      case 'research': return BookOpenIcon;
      case 'lab': return PencilSquareIcon;
      case 'tutorial': return DocumentTextIcon;
      case 'essay': return PencilSquareIcon;
      case 'study': return BookOpenIcon;
      default: return DocumentTextIcon;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'lecture': return 'text-blue-400';
      case 'research': return 'text-purple-400';
      case 'lab': return 'text-green-400';
      case 'tutorial': return 'text-orange-400';
      case 'essay': return 'text-pink-400';
      case 'study': return 'text-indigo-400';
      default: return 'text-gray-400';
    }
  };

  const CategoryIcon = getCategoryIcon(note.category);

  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-glow transition-all duration-300">
      <div className="flex items-start space-x-6">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <CategoryIcon className={`h-5 w-5 ${getCategoryColor(note.category)}`} />
              <h3 className="text-heading font-medium text-white">{note.title}</h3>
              <span className={`px-2 py-1 rounded-full text-micro font-medium uppercase ${getCategoryColor(note.category)} bg-current bg-opacity-20`}>
                {note.category}
              </span>
            </div>
            <button
              onClick={() => onToggleFavorite(note.id)}
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              {note.isFavorite ? (
                <StarSolidIcon className="h-5 w-5" />
              ) : (
                <StarIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          
          <p className="text-caption text-text-white-muted mb-3">{note.subject}</p>
          <p className="text-body text-text-white-muted mb-4 line-clamp-2">{note.content}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-white/10 text-text-white-muted text-micro rounded-full">
                #{tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-text-white-muted">
              <span className="text-micro flex items-center space-x-1">
                <ClockIcon className="h-3 w-3" />
                <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
              </span>
              <span className="text-micro flex items-center space-x-1">
                <EyeIcon className="h-3 w-3" />
                <span>{note.readTime}</span>
              </span>
              <span className="text-micro">{note.wordCount} words</span>
            </div>
            <button className="btn-primary px-4 py-2 rounded-lg text-caption font-medium">
              Open Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FolderItem = ({ folder, isSelected, noteCount, onSelect, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  
  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600',
      pink: 'from-pink-500 to-pink-600',
      indigo: 'from-indigo-500 to-indigo-600',
      red: 'from-red-500 to-red-600',
      yellow: 'from-yellow-500 to-yellow-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div
      className={`relative group p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
        isSelected
          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
          : 'text-text-white-muted hover:text-white hover:bg-white/5'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`p-2 rounded-lg bg-gradient-to-br ${getColorClasses(folder.color)}`}>
        <FolderIcon className="h-4 w-4 text-white" />
      </div>
      
      <button onClick={onSelect} className="flex-1 text-left">
        <div className="flex-1">
          <span className="text-caption font-medium block">{folder.name}</span>
          <div className="text-micro">{noteCount} notes</div>
        </div>
      </button>

      {showActions && (
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 text-text-white-muted hover:text-white transition-colors"
          >
            <PencilIcon className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-text-white-muted hover:text-red-400 transition-colors"
          >
            <TrashIcon className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};

const FolderModal = ({ isEditing, folderName, folderColor, onNameChange, onColorChange, onSave, onCancel }) => {
  const colorOptions = [
    { name: 'blue', class: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600' },
    { name: 'purple', class: 'bg-purple-500', gradient: 'from-purple-500 to-purple-600' },
    { name: 'green', class: 'bg-green-500', gradient: 'from-green-500 to-green-600' },
    { name: 'orange', class: 'bg-orange-500', gradient: 'from-orange-500 to-orange-600' },
    { name: 'pink', class: 'bg-pink-500', gradient: 'from-pink-500 to-pink-600' },
    { name: 'indigo', class: 'bg-indigo-500', gradient: 'from-indigo-500 to-indigo-600' },
    { name: 'red', class: 'bg-red-500', gradient: 'from-red-500 to-red-600' },
    { name: 'yellow', class: 'bg-yellow-500', gradient: 'from-yellow-500 to-yellow-600' }
  ];

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 animate-fade-in">
      <div className="glass-card rounded-2xl p-8 w-96 max-w-[90vw] animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-heading font-medium text-white">
            {isEditing ? 'Edit Folder' : 'Create New Folder'}
          </h3>
          <button
            onClick={onCancel}
            className="text-text-white-muted hover:text-white transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-caption text-text-white-muted mb-2">Folder Name</label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-body focus:outline-none focus:border-primary-orange transition-colors"
              placeholder="Enter folder name..."
            />
          </div>
          
          <div>
            <label className="block text-caption text-text-white-muted mb-3">Choose Color</label>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.name}
                  onClick={() => onColorChange(color.name)}
                  className={`w-full h-12 rounded-lg bg-gradient-to-br ${color.gradient} border-2 transition-all duration-200 ${
                    folderColor === color.name 
                      ? 'border-primary-orange shadow-glow' 
                      : 'border-transparent hover:border-white/30'
                  }`}
                >
                  {folderColor === color.name && (
                    <CheckIcon className="h-6 w-6 text-white mx-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4 mt-8">
          <button
            onClick={onCancel}
            className="flex-1 btn-secondary py-3 px-6 rounded-lg text-caption font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!folderName.trim()}
            className="flex-1 btn-primary py-3 px-6 rounded-lg text-caption font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? 'Update Folder' : 'Create Folder'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notes;
