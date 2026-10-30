import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  DocumentTextIcon,
  PlusIcon,
  StarIcon,
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
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Simple Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-light text-white mb-2">
                Notes
              </h1>
              <p className="text-gray-400 text-sm">
                {stats.total} notes • {stats.folders} folders
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFolderModal(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <FolderPlusIcon className="h-4 w-4" />
                <span>New Folder</span>
              </button>
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center space-x-2">
                <PlusIcon className="h-4 w-4" />
                <span>New Note</span>
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 mb-8 bg-white/5 p-1 rounded-lg w-fit">
            {[
              { key: 'all', label: 'All Notes', count: stats.total },
              { key: 'favorites', label: 'Favorites', count: stats.favorites },
              { key: 'recent', label: 'Recent', count: stats.recent }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-md text-sm transition-all duration-200 flex items-center space-x-2 ${
                  filter === tab.key
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Folder Management */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-400">Folder:</label>
              <select 
                value={selectedFolder || 'all'} 
                onChange={(e) => setSelectedFolder(e.target.value === 'all' ? null : e.target.value === 'uncategorized' ? 'uncategorized' : parseInt(e.target.value))}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="all">All Notes ({notes.length})</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name} ({getFolderStats(folder.id)})
                  </option>
                ))}
                {getUncategorizedCount() > 0 && (
                  <option value="uncategorized">Uncategorized ({getUncategorizedCount()})</option>
                )}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-400">View:</label>
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Notes Content */}
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredNotes.map((note) => (
              viewMode === 'grid' ? (
                <MinimalNoteCard key={note.id} note={note} onToggleFavorite={toggleFavorite} />
              ) : (
                <MinimalNoteListCard key={note.id} note={note} onToggleFavorite={toggleFavorite} />
              )
            ))}
            
            {filteredNotes.length === 0 && (
              <div className="text-center py-12 col-span-full">
                <DocumentTextIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">
                  {selectedFolder ? 'No notes in this folder' : 'No notes found'}
                </p>
              </div>
            )}
          </div>

          {/* Folder Modal */}
          {showFolderModal && (
            <FolderModal
              isEditing={!!editingFolder}
              folderName={newFolderName}
              folderColor={newFolderColor}
              onNameChange={setNewFolderName}
              onColorChange={setNewFolderColor}
              onSave={createFolder}
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

const MinimalNoteCard = ({ note, onToggleFavorite }) => {
  return (
    <div className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all duration-200 border border-white/10 hover:border-white/20">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-white text-sm mb-1 line-clamp-1">{note.title}</h3>
          <p className="text-xs text-gray-400 mb-2">{note.subject}</p>
        </div>
        <button
          onClick={() => onToggleFavorite(note.id)}
          className="text-gray-400 hover:text-yellow-400 transition-colors"
        >
          {note.isFavorite ? (
            <StarSolidIcon className="h-4 w-4 text-yellow-400" />
          ) : (
            <StarIcon className="h-4 w-4" />
          )}
        </button>
      </div>
      
      <p className="text-xs text-gray-300 mb-3 line-clamp-2">
        {note.content}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{note.readTime}</span>
        <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

const MinimalNoteListCard = ({ note, onToggleFavorite }) => {
  return (
    <div className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all duration-200 border border-white/10 hover:border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="font-medium text-white text-sm">{note.title}</h3>
            <span className="text-xs text-gray-400">{note.subject}</span>
          </div>
          <p className="text-xs text-gray-300 mt-1 line-clamp-1">
            {note.content}
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs text-gray-400">
          <span>{note.readTime}</span>
          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
          <button
            onClick={() => onToggleFavorite(note.id)}
            className="text-gray-400 hover:text-yellow-400 transition-colors"
          >
            {note.isFavorite ? (
              <StarSolidIcon className="h-4 w-4 text-yellow-400" />
            ) : (
              <StarIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const FolderModal = ({ isEditing, folderName, folderColor, onNameChange, onColorChange, onSave, onCancel }) => {
  const colorOptions = [
    { name: 'blue', class: 'bg-blue-500' },
    { name: 'purple', class: 'bg-purple-500' },
    { name: 'green', class: 'bg-green-500' },
    { name: 'orange', class: 'bg-orange-500' },
    { name: 'pink', class: 'bg-pink-500' },
    { name: 'indigo', class: 'bg-indigo-500' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-white/20 rounded-xl p-6 w-96">
        <h3 className="text-lg font-medium text-white mb-4">
          {isEditing ? 'Edit Folder' : 'Create New Folder'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Folder Name</label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              placeholder="Enter folder name"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Color</label>
            <div className="flex space-x-2">
              {colorOptions.map((color) => (
                <button
                  key={color.name}
                  onClick={() => onColorChange(color.name)}
                  className={`w-8 h-8 rounded-full ${color.class} border-2 ${
                    folderColor === color.name ? 'border-white' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            {isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notes;
