import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {
  ArrowLeftIcon,
  PhotoIcon,
  LinkIcon,
  ListBulletIcon,
  NumberedListIcon,
  BoltIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  SwatchIcon,
  PaintBrushIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  Bars3BottomLeftIcon,
  Bars3Icon,
  Bars3BottomRightIcon,
  CodeBracketIcon,
  ChatBubbleLeftIcon,
  MinusIcon,
  TableCellsIcon,
  EyeIcon,
  ShareIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const NoteEditor = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const mode = searchParams.get('mode') || 'edit';
  const isViewMode = mode === 'view';
  
  const [note, setNote] = useState({
    title: '',
    content: '',
    folderId: null,
    tags: [],
    isStarred: false,
    isPublic: false,
    subject: '',
    category: 'general'
  });
  
  const [folders, setFolders] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  
  // Refs for color pickers
  const colorPickerRef = useRef(null);
  const highlightPickerRef = useRef(null);

  // Click outside handler for color pickers
  useEffect(() => {
    function handleClickOutside(event) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
      if (highlightPickerRef.current && !highlightPickerRef.current.contains(event.target)) {
        setShowHighlightPicker(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };  }, []);

  // Formatting functions
  const updateContentFromEditor = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setNote(prev => ({ ...prev, content }));
      
      // Update word and character count
      const textContent = editorRef.current.innerText || '';
      const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharacterCount(textContent.length);
    }
  }, []);
    
  const execCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      updateContentFromEditor();
    }
  }, [updateContentFromEditor]);

  // Save cursor position
  const saveCursorPosition = useCallback(() => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
      };
    }
    return null;
  }, []);

  // Restore cursor position
  const restoreCursorPosition = useCallback((position) => {
    if (position && editorRef.current) {
      try {
        const selection = window.getSelection();
        const range = document.createRange();
        range.setStart(position.startContainer, position.startOffset);
        range.setEnd(position.endContainer, position.endOffset);
        selection.removeAllRanges();
        selection.addRange(range);
      } catch (error) {
        // If restoration fails, just put cursor at end
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, []);

  // Update editor content when note.content changes (but preserve cursor)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== note.content) {
      const cursorPosition = saveCursorPosition();
      editorRef.current.innerHTML = note.content;
      // Small delay to allow DOM to update before restoring cursor
      setTimeout(() => restoreCursorPosition(cursorPosition), 0);
    }
  }, [note.content, saveCursorPosition, restoreCursorPosition]);
  
  // Load initial content when component mounts
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && note.content) {
      editorRef.current.innerHTML = note.content;
    }
  }, [note.content]);

  // File upload handler
  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.margin = '10px 0';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        
        // Insert at cursor position
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.insertNode(img);
          range.collapse(false);
        }
        updateContentFromEditor();
      };
      reader.readAsDataURL(file);
    }  }, [updateContentFromEditor]);

  // Mock data for folders and tags
  useEffect(() => {
    // Mock folders based on user role
    let mockFolders = [];
    let mockTags = [];

    if (user?.role === 'admin') {
      mockFolders = [
        { id: 1, name: 'System Administration', color: 'red' },
        { id: 2, name: 'User Management', color: 'blue' },
        { id: 3, name: 'Policy & Procedures', color: 'green' },
        { id: 4, name: 'Analytics & Reports', color: 'purple' },
        { id: 5, name: 'Security & Compliance', color: 'orange' }
      ];
      mockTags = ['system', 'policy', 'security', 'users', 'backup', 'analytics', 'compliance'];
    } else if (user?.role === 'teacher') {
      mockFolders = [
        { id: 1, name: 'Lesson Plans', color: 'blue' },
        { id: 2, name: 'Student Progress', color: 'green' },
        { id: 3, name: 'Curriculum Development', color: 'purple' },
        { id: 4, name: 'Assessment Notes', color: 'orange' },
        { id: 5, name: 'Research & Resources', color: 'indigo' }
      ];
      mockTags = ['lesson', 'assessment', 'curriculum', 'students', 'research', 'homework', 'grades'];
    } else {
      mockFolders = [
        { id: 1, name: 'Study Notes', color: 'blue' },
        { id: 2, name: 'Assignment Ideas', color: 'green' },
        { id: 3, name: 'Research', color: 'purple' },
        { id: 4, name: 'Personal', color: 'pink' },
        { id: 5, name: 'Project Work', color: 'orange' }
      ];
      mockTags = ['study', 'homework', 'research', 'exam', 'project', 'notes', 'ideas'];
    }

    setFolders(mockFolders);
    setAvailableTags(mockTags);

    // If editing an existing note, fetch its data
    if (noteId && noteId !== 'new') {
      // Mock existing note data
      const mockNote = {
        id: parseInt(noteId),
        title: 'Advanced Mathematics Study Guide',
        content: `# Advanced Mathematics Study Guide

## Integration Techniques

### Integration by Parts
The formula for integration by parts is:
∫u dv = uv - ∫v du

**When to use:**
- Products of polynomials and exponentials
- Products of polynomials and trigonometric functions
- Logarithmic functions

### Example Problems
1. ∫x·e^x dx
2. ∫x·sin(x) dx
3. ∫ln(x) dx

## Practice Problems
- Complete exercises 1-15 from textbook chapter 7
- Review integration techniques worksheet
- Prepare for upcoming quiz on Friday

## Important Formulas
- ∫e^x dx = e^x + C
- ∫sin(x) dx = -cos(x) + C
- ∫cos(x) dx = sin(x) + C
- ∫1/x dx = ln|x| + C

## Study Schedule
- Monday: Review integration by parts
- Tuesday: Practice substitution method
- Wednesday: Work on partial fractions
- Thursday: Mixed practice problems
- Friday: Quiz preparation`,
        folderId: 1,
        tags: ['mathematics', 'integration', 'study-guide'],
        isStarred: true,
        isPublic: false,
        subject: 'Mathematics',
        category: 'study',
        createdAt: '2025-06-14T10:30:00',
        updatedAt: '2025-06-15T14:20:00'
      };
      setNote(mockNote);
    }
  }, [noteId, user]);

  // Update word count when content changes
  useEffect(() => {
    const words = note.content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [note.content]);
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setLastSaved(new Date());
    
    // In real app, this would save to backend
    console.log('Saving note:', note);
  }, [note]);
  const handleAutoSave = useCallback(() => {
    if (note.title || note.content) {
      handleSave();
    }
  }, [note.title, note.content, handleSave]);
  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(handleAutoSave, 30000);
    return () => clearInterval(interval);
  }, [note, handleAutoSave]);

  const handleAddTag = () => {
    if (newTag.trim() && !note.tags.includes(newTag.trim())) {
      setNote(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNote(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handlePublish = () => {
    setNote(prev => ({ ...prev, isPublic: !prev.isPublic }));
    handleSave();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      // In real app, delete from backend
      navigate('/notes');
    }
  };

  const getFolderColor = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    return folder?.color || 'gray';
  };

  const isNewNote = !noteId || noteId === 'new';

  return (
    <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-gradient-radial opacity-30"></div>
      
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-12">
          
          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/notes')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-display font-montserrat font-extralight text-gray-800">
                    {isNewNote ? 'Create New Note' : 'Edit Note'}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span>{wordCount} words</span>
                    {lastSaved && (
                      <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                    )}
                    {isSaving && (
                      <span className="text-orange-600">Saving...</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`btn-secondary px-4 py-2 rounded-xl flex items-center space-x-2 ${
                    previewMode ? 'bg-orange-100 text-orange-600' : ''
                  }`}
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>{previewMode ? 'Edit' : 'Preview'}</span>
                </button>
                
                <button
                  onClick={() => setNote(prev => ({ ...prev, isStarred: !prev.isStarred }))}
                  className="btn-secondary px-4 py-2 rounded-xl flex items-center space-x-2"
                >
                  {note.isStarred ? (
                    <StarSolidIcon className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <StarIcon className="h-4 w-4" />
                  )}
                  <span>Star</span>
                </button>
                
                {!isNewNote && (
                  <>
                    <button
                      onClick={handlePublish}
                      className={`btn-secondary px-4 py-2 rounded-xl flex items-center space-x-2 ${
                        note.isPublic ? 'bg-green-100 text-green-600' : ''
                      }`}
                    >
                      <ShareIcon className="h-4 w-4" />
                      <span>{note.isPublic ? 'Public' : 'Private'}</span>
                    </button>
                    
                    <button
                      onClick={handleDelete}
                      className="btn-secondary px-4 py-2 rounded-xl flex items-center space-x-2 text-red-600 hover:bg-red-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
                
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary px-6 py-2 rounded-xl flex items-center space-x-2"
                >
                  <CheckIcon className="h-4 w-4" />
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>          {/* Editor Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Editor */}
            <div className="lg:col-span-3">
              <div className="glass-card rounded-3xl overflow-hidden">
                {!previewMode ? (                  <>                    {/* Enhanced Rich Text Editor Toolbar */}
                    <div className="border-b border-gray-200 p-2 bg-white">                      {/* First Row - Main Controls */}
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                        <div className="flex items-center flex-wrap">                          {/* Undo/Redo */}
                          <div className="flex items-center mr-5 bg-gray-50 px-1 rounded-md">
                            <button onClick={() => execCommand('undo')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors" title="Undo">
                              <ArrowUturnLeftIcon className="h-4 w-4" />
                            </button>
                            <button onClick={() => execCommand('redo')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors" title="Redo">
                              <ArrowUturnRightIcon className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="h-6 w-px bg-gray-300 mr-5"></div>
                          
                          {/* Text Style Dropdowns */}
                          <div className="flex items-center gap-2 mr-5">
                            <select onChange={(e) => execCommand('formatBlock', e.target.value)} className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:border-blue-500 focus:outline-none" defaultValue="">
                              <option value="">Normal</option>
                              <option value="h1">Heading 1</option>
                              <option value="h2">Heading 2</option>
                              <option value="h3">Heading 3</option>
                              <option value="h4">Heading 4</option>
                              <option value="h5">Heading 5</option>
                            </select>
                            
                            <select onChange={(e) => execCommand('fontName', e.target.value)} className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:border-blue-500 focus:outline-none" defaultValue="">
                              <option value="">Font Family</option>
                              <option value="Arial">Arial</option>
                              <option value="Times New Roman">Times New Roman</option>
                              <option value="Georgia">Georgia</option>
                              <option value="Helvetica">Helvetica</option>
                              <option value="Courier New">Courier New</option>
                              <option value="Verdana">Verdana</option>
                            </select>
                            
                            <select onChange={(e) => execCommand('fontSize', e.target.value)} className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:border-blue-500 focus:outline-none" defaultValue="3">
                              <option value="1">8pt</option>
                              <option value="2">10pt</option>
                              <option value="3">12pt</option>
                              <option value="4">14pt</option>
                              <option value="5">18pt</option>
                              <option value="6">24pt</option>
                              <option value="7">36pt</option>
                            </select>
                          </div>
                          
                          <div className="h-6 w-px bg-gray-300 mr-5"></div>
                            {/* Basic Formatting */}
                          <div className="flex items-center bg-gray-50 px-1 rounded-md">
                            <button onClick={() => execCommand('bold')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors" title="Bold">
                              <BoltIcon className="h-4 w-4" />
                            </button>
                            <button onClick={() => execCommand('italic')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors" title="Italic">
                              <ItalicIcon className="h-4 w-4" />
                            </button>
                            <button onClick={() => execCommand('underline')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors" title="Underline">
                              <UnderlineIcon className="h-4 w-4" />
                            </button>
                            <button onClick={() => execCommand('strikeThrough')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors" title="Strikethrough">
                              <StrikethroughIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Right Side Info */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{wordCount} words</span>
                          <span>{characterCount} characters</span>
                          <span className={isSaving ? 'text-blue-600' : 'text-green-600'}>
                            {isSaving ? 'Saving...' : 'Saved'}
                          </span>
                        </div>
                      </div>                      {/* Second Row - Formatting Controls */}
                      <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-1">
                        <div className="flex items-center flex-wrap">
                          {/* Formatting Groups with visual separators */}
                          
                          {/* Colors Group */}
                          <div className="flex items-center mr-5 relative color-picker-container bg-gray-50 px-1 rounded-md">
                            <button 
                              onClick={() => setShowColorPicker(!showColorPicker)} 
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors relative" 
                              title="Text Color"
                            >
                              <SwatchIcon className="h-4 w-4" />
                            </button>
                            {showColorPicker && (
                              <div className="absolute top-10 left-0 z-50 bg-white border border-gray-300 rounded-lg p-3 shadow-lg" ref={colorPickerRef}>
                                <div className="text-sm font-medium mb-2">Text Color</div>
                                <div className="grid grid-cols-8 gap-1">
                                  {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', 
                                    '#800080', '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000', '#800000', '#008080'].map(color => (
                                    <button
                                      key={color}
                                      onClick={() => {
                                        execCommand('foreColor', color);
                                        setShowColorPicker(false);
                                      }}
                                      className="w-5 h-5 rounded border border-gray-300 hover:border-gray-600 transition-colors"
                                      style={{ backgroundColor: color }}
                                      title={color}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <button 
                              onClick={() => setShowHighlightPicker(!showHighlightPicker)} 
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors relative" 
                              title="Highlight Color"
                            >
                              <PaintBrushIcon className="h-4 w-4" />
                            </button>
                            {showHighlightPicker && (
                              <div className="absolute top-10 left-8 z-50 bg-white border border-gray-300 rounded-lg p-3 shadow-lg" ref={highlightPickerRef}>
                                <div className="text-sm font-medium mb-2">Highlight Color</div>
                                <div className="grid grid-cols-6 gap-1">
                                  {['#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#FFA500', '#FF69B4'].map(color => (
                                    <button
                                      key={color}
                                      onClick={() => {
                                        execCommand('hiliteColor', color);
                                        setShowHighlightPicker(false);
                                      }}
                                      className="w-5 h-5 rounded border border-gray-300 hover:border-gray-600 transition-colors"
                                      style={{ backgroundColor: color }}
                                      title={color}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="h-6 w-px bg-gray-300 mr-5"></div>                          
                          {/* Alignment Group */}
                          <div className="flex items-center mr-5 bg-gray-50 px-1 rounded-md">
                            <button onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors" title="Align Left">
                              <Bars3BottomLeftIcon className="h-4 w-4" />
                            </button>
                            <button onClick={() => execCommand('justifyCenter')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors" title="Align Center">
                              <Bars3Icon className="h-4 w-4" />
                            </button>
                            <button onClick={() => execCommand('justifyRight')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors" title="Align Right">
                              <Bars3BottomRightIcon className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="h-6 w-px bg-gray-300 mr-5"></div>                          
                          {/* Lists Group */}
                          <div className="flex items-center mr-5 bg-gray-50 px-1 rounded-md">
                            <button onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors" title="Bullet List">
                              <ListBulletIcon className="h-4 w-4" />
                            </button>
                            <button onClick={() => execCommand('insertOrderedList')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors" title="Numbered List">
                              <NumberedListIcon className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="h-6 w-px bg-gray-300 mr-5"></div>                          
                          {/* Insert Elements Group */}
                          <div className="flex items-center mr-5 bg-gray-50 px-1 rounded-md">
                            <button onClick={() => { const url = prompt('Enter URL:'); if (url) execCommand('createLink', url); }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors" title="Insert Link">
                              <LinkIcon className="h-4 w-4" />
                            </button>
                            <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors" title="Insert Image">
                              <PhotoIcon className="h-4 w-4" />
                            </button>
                            <button onClick={() => execCommand('insertHTML', false, '<table style="border-collapse: collapse; width: 100%; border: 1px solid #ddd;"><tr><td style="border: 1px solid #ddd; padding: 8px;">&nbsp;</td><td style="border: 1px solid #ddd; padding: 8px;">&nbsp;</td></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">&nbsp;</td><td style="border: 1px solid #ddd; padding: 8px;">&nbsp;</td></tr></table>')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors" title="Insert Table">
                              <TableCellsIcon className="h-4 w-4" />
                            </button>
                            <button onClick={() => execCommand('insertHorizontalRule')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors" title="Insert Horizontal Line">
                              <MinusIcon className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="h-6 w-px bg-gray-300 mr-5"></div>                          
                          {/* Special Formatting */}
                          <div className="flex items-center bg-gray-50 px-1 rounded-md">
                            <button onClick={() => execCommand('formatBlock', 'blockquote')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors" title="Quote">
                              <ChatBubbleLeftIcon className="h-4 w-4" />
                            </button>
                            <button onClick={() => execCommand('formatBlock', 'pre')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors" title="Code Block">
                              <CodeBracketIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div><input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {/* Title Input */}
                    <div className="p-8 pb-4">
                      <input
                        type="text"
                        value={note.title}
                        onChange={(e) => setNote(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter note title..."
                        className="w-full text-3xl font-light text-gray-800 bg-transparent border-none outline-none placeholder-gray-400"
                      />
                    </div>
                      {/* Rich Text Content Editor */}
                    <div
                      ref={editorRef}
                      contentEditable
                      onInput={updateContentFromEditor}
                      onPaste={(e) => {
                        // Allow pasting images
                        const items = e.clipboardData.items;
                        for (let item of items) {
                          if (item.type.indexOf('image') !== -1) {
                            const file = item.getAsFile();
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const img = document.createElement('img');
                              img.src = event.target.result;
                              img.style.maxWidth = '100%';
                              img.style.height = 'auto';
                              img.style.margin = '10px 0';
                              img.style.borderRadius = '8px';
                              img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                              
                              const selection = window.getSelection();
                              if (selection.rangeCount > 0) {
                                const range = selection.getRangeAt(0);
                                range.insertNode(img);
                                range.collapse(false);
                              }
                              updateContentFromEditor();
                            };
                            reader.readAsDataURL(file);
                          }
                        }
                      }}
                      className="w-full min-h-[500px] text-gray-700 bg-transparent border-none outline-none leading-relaxed p-8 pt-4 prose prose-lg max-w-none"                      style={{ 
                        minHeight: '500px',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        direction: 'ltr',
                        textAlign: 'left'
                      }}
                      data-placeholder="Start writing your note..."
                    />
                    
                    {/* Add CSS for placeholder and editor styling */}                    <style jsx>{`
                      div[contenteditable="true"] {
                        direction: ltr !important;
                        text-align: left !important;
                        unicode-bidi: embed;
                      }
                      
                      div[contenteditable="true"]:empty:before {
                        content: attr(data-placeholder);
                        color: #9CA3AF;
                        pointer-events: none;
                        direction: ltr;
                        text-align: left;
                      }
                      
                      div[contenteditable="true"] h1 {
                        font-size: 2.25rem;
                        font-weight: 300;
                        margin: 1.5rem 0 1rem 0;
                        line-height: 1.2;
                        color: #1F2937;
                      }
                      
                      div[contenteditable="true"] h2 {
                        font-size: 1.875rem;
                        font-weight: 400;
                        margin: 1.25rem 0 0.75rem 0;
                        line-height: 1.3;
                        color: #374151;
                      }
                      
                      div[contenteditable="true"] h3 {
                        font-size: 1.5rem;
                        font-weight: 500;
                        margin: 1rem 0 0.5rem 0;
                        line-height: 1.4;
                        color: #4B5563;
                      }
                      
                      div[contenteditable="true"] h4 {
                        font-size: 1.25rem;
                        font-weight: 600;
                        margin: 0.875rem 0 0.5rem 0;
                        line-height: 1.4;
                        color: #6B7280;
                      }
                      
                      div[contenteditable="true"] h5 {
                        font-size: 1.125rem;
                        font-weight: 600;
                        margin: 0.75rem 0 0.375rem 0;
                        line-height: 1.4;
                        color: #6B7280;
                      }
                      
                      div[contenteditable="true"] h6 {
                        font-size: 1rem;
                        font-weight: 700;
                        margin: 0.75rem 0 0.375rem 0;
                        line-height: 1.4;
                        color: #6B7280;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                      }
                      
                      div[contenteditable="true"] blockquote {
                        border-left: 4px solid #F59E0B;
                        padding-left: 1rem;
                        margin: 1rem 0;
                        font-style: italic;
                        color: #6B7280;
                        background: #FFFBEB;
                        padding: 1rem;
                        border-radius: 0.5rem;
                      }
                      
                      div[contenteditable="true"] pre {
                        background: #1F2937;
                        color: #F3F4F6;
                        padding: 1rem;
                        border-radius: 0.5rem;
                        overflow-x: auto;
                        font-family: 'Courier New', monospace;
                        margin: 1rem 0;
                      }
                      
                      div[contenteditable="true"] ul, div[contenteditable="true"] ol {
                        margin: 1rem 0;
                        padding-left: 2rem;
                      }
                      
                      div[contenteditable="true"] li {
                        margin: 0.25rem 0;
                      }
                      
                      div[contenteditable="true"] table {
                        border-collapse: collapse;
                        width: 100%;
                        margin: 1rem 0;
                        border: 1px solid #D1D5DB;
                        border-radius: 0.5rem;
                        overflow: hidden;
                      }
                      
                      div[contenteditable="true"] td, div[contenteditable="true"] th {
                        border: 1px solid #D1D5DB;
                        padding: 0.75rem;
                        text-align: left;
                      }
                      
                      div[contenteditable="true"] th {
                        background: #F3F4F6;
                        font-weight: 600;
                        color: #374151;
                      }
                      
                      div[contenteditable="true"] hr {
                        border: none;
                        height: 2px;
                        background: linear-gradient(to right, transparent, #D1D5DB, transparent);
                        margin: 2rem 0;
                      }
                      
                      div[contenteditable="true"] a {
                        color: #3B82F6;
                        text-decoration: underline;
                      }
                      
                      div[contenteditable="true"] a:hover {
                        color: #1D4ED8;
                      }
                    `}</style>
                    
                    {/* Editor Status Bar */}
                    <div className="border-t border-gray-200 px-8 py-3 bg-gray-50 text-sm text-gray-600 flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <span>{wordCount} words</span>
                        <span>{characterCount} characters</span>
                        {lastSaved && (
                          <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                        )}
                        {isSaving && (
                          <span className="text-orange-600 flex items-center space-x-1">
                            <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
                            <span>Saving...</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => execCommand('undo')}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Undo"
                        >
                          ↶
                        </button>
                        <button
                          onClick={() => execCommand('redo')}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Redo"
                        >
                          ↷
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Preview Mode */}
                    <div className="p-8">
                      <h1 className="text-3xl font-light text-gray-800 mb-6">
                        {note.title || 'Untitled Note'}
                      </h1>
                      <div 
                        className="prose prose-gray max-w-none"
                        dangerouslySetInnerHTML={{ __html: note.content || '<p>No content yet...</p>' }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Note Properties */}
              <div className="glass-card rounded-3xl p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Note Properties</h3>
                
                {/* Folder Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Folder</label>
                  <select
                    value={note.folderId || ''}
                    onChange={(e) => setNote(prev => ({ ...prev, folderId: parseInt(e.target.value) || null }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">No folder</option>
                    {folders.map(folder => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Subject</label>
                  <input
                    type="text"
                    value={note.subject}
                    onChange={(e) => setNote(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="e.g. Mathematics, Physics..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
                  <select
                    value={note.category}
                    onChange={(e) => setNote(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="study">Study Notes</option>
                    <option value="lecture">Lecture Notes</option>
                    <option value="research">Research</option>
                    <option value="assignment">Assignment</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="glass-card rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Tags</h3>
                  <button
                    onClick={() => setShowTagInput(!showTagInput)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Add New Tag */}
                {showTagInput && (
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Add tag..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
                    >
                      Add
                    </button>
                  </div>
                )}
                
                {/* Current Tags */}
                <div className="flex flex-wrap gap-2">
                  {note.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                
                {/* Suggested Tags */}
                {availableTags.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Suggested:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableTags
                        .filter(tag => !note.tags.includes(tag))
                        .slice(0, 5)
                        .map(tag => (
                          <button
                            key={tag}
                            onClick={() => setNote(prev => ({ ...prev, tags: [...prev.tags, tag] }))}
                            className="px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded-full hover:bg-orange-100"
                          >
                            {tag}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Note Statistics */}
              <div className="glass-card rounded-3xl p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Words</span>
                    <span className="text-sm font-medium text-gray-800">{wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Characters</span>
                    <span className="text-sm font-medium text-gray-800">{note.content.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Reading time</span>
                    <span className="text-sm font-medium text-gray-800">
                      {Math.ceil(wordCount / 200)} min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NoteEditor;
