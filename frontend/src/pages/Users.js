import React, { useState } from 'react';
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
  ShieldCheckIcon,
  UserIcon,
  AcademicCapIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const Users = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Check if user has permission to access user management
  if (user?.role === 'teacher' || user?.role === 'student') {
    return (
      <div className="min-h-screen relative overflow-hidden font-sf" style={{ backgroundColor: '#fcfcf7' }}>
        <Sidebar />
        <div className="ml-20 relative z-10">
          <div className="max-w-7xl mx-auto px-8 py-12 text-center">
            <h1 className="text-display font-montserrat font-extralight text-gray-800 mb-3">
              Access <span className="text-gradient">Denied</span>
            </h1>
            <p className="text-body text-gray-600">
              {user?.role === 'teacher' 
                ? 'Teachers do not have access to user management. Use the Students page to manage your students.' 
                : 'Students do not have access to user management.'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Mock users data
  const users = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@reactorminds.com',
      phone: '+1 (555) 123-4567',
      role: 'teacher',
      status: 'active',
      joinedDate: '2023-09-15',
      lastActive: '2024-01-15T14:30:00',
      subjects: ['Mathematics', 'Physics'],
      students: 45,
      avatar: null,
      permissions: ['create_classes', 'manage_students', 'grade_assignments']
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      email: 'michael.chen@reactorminds.com',
      phone: '+1 (555) 234-5678',
      role: 'teacher',
      status: 'active',
      joinedDate: '2023-10-20',
      lastActive: '2024-01-15T10:15:00',
      subjects: ['Chemistry', 'Biology'],
      students: 38,
      avatar: null,
      permissions: ['create_classes', 'manage_students', 'grade_assignments']
    },
    {
      id: 3,
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      phone: '+1 (555) 345-6789',
      role: 'student',
      status: 'active',
      joinedDate: '2024-01-10',
      lastActive: '2024-01-15T16:45:00',
      subjects: ['Mathematics', 'Physics'],
      grade: 'A',
      avatar: null,
      permissions: ['view_classes', 'submit_assignments']
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '+1 (555) 456-7890',
      role: 'student',
      status: 'active',
      joinedDate: '2024-01-12',
      lastActive: '2024-01-15T15:20:00',
      subjects: ['Chemistry', 'Biology'],
      grade: 'A+',
      avatar: null,
      permissions: ['view_classes', 'submit_assignments']
    },
    {
      id: 5,
      name: 'John Admin',
      email: 'john.admin@reactorminds.com',
      phone: '+1 (555) 567-8901',
      role: 'admin',
      status: 'active',
      joinedDate: '2023-08-01',
      lastActive: '2024-01-15T17:00:00',
      subjects: [],
      avatar: null,
      permissions: ['full_access', 'manage_users', 'system_settings', 'view_analytics']
    },
    {
      id: 6,
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 678-9012',
      role: 'student',
      status: 'inactive',
      joinedDate: '2024-01-05',
      lastActive: '2024-01-10T12:30:00',
      subjects: ['History', 'English'],
      grade: 'B',
      avatar: null,
      permissions: ['view_classes']
    }
  ];

  const getFilteredUsers = () => {
    let filtered = users;

    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort users
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'role':
        filtered.sort((a, b) => a.role.localeCompare(b.role));
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.lastActive || 0) - new Date(a.lastActive || 0));
        break;
      case 'joined':
        filtered.sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate));
        break;
      default:
        break;
    }

    return filtered;
  };
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'teacher': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'student': return 'bg-green-500/20 text-green-700 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return ShieldCheckIcon;
      case 'teacher': return AcademicCapIcon;
      case 'student': return UserIcon;
      default: return UserIcon;
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };  const UserCard = ({ user, index }) => {
    const RoleIcon = getRoleIcon(user.role);
    
    return (
      <div 
        className="glass-card rounded-2xl p-6 animate-slide-up hover:scale-[1.02] transition-all duration-300 group"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          {/* Avatar or Initials */}
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <span className="text-white font-medium text-sm">{getInitials(user.name)}</span>
            </div>
          )}
          
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="mb-4">
          <h3 className="text-lg font-light text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
            {user.name}
          </h3>
          <div className="flex items-center space-x-2 mb-1">
            <RoleIcon className="h-4 w-4 text-gray-500" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4">{user.email}</p>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 text-xs">
              <PhoneIcon className="h-4 w-4 inline mr-1" />
              {user.phone}
            </span>
            <span className="text-gray-600 text-xs">
              Joined {formatDate(user.joinedDate)}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-sm">Last active: {formatLastActive(user.lastActive)}</p>
            <div className="flex space-x-2">
              <button 
                className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200" 
                title="View Details"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
              <button 
                className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200" 
                title="Edit User"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button 
                className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200" 
                title="Delete User"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>        </div>
      </div>
    );
  };

  const filteredUsers = getFilteredUsers();
  const roleCounts = {
    all: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    teacher: users.filter(u => u.role === 'teacher').length,
    student: users.filter(u => u.role === 'student').length
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
                System <span className="text-gradient">Users</span>
              </h1>
              <p className="text-body text-gray-600">
                Manage system users and their permissions
              </p>
            </div>
            
            <button className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2">
              <PlusIcon className="h-5 w-5" />
              <span>Add User</span>
            </button>
          </div>          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-fade-scale">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Total Users</p>
                  <p className="text-title font-light text-gray-800">{roleCounts.all}</p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-orange-500 opacity-60" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Admins</p>
                  <p className="text-title font-light text-gray-800">{roleCounts.admin}</p>
                </div>
                <ShieldCheckIcon className="h-8 w-8 text-red-500 opacity-60" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Teachers</p>
                  <p className="text-title font-light text-gray-800">{roleCounts.teacher}</p>
                </div>
                <AcademicCapIcon className="h-8 w-8 text-blue-500 opacity-60" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 font-medium tracking-wider uppercase">Students</p>
                  <p className="text-title font-light text-gray-800">{roleCounts.student}</p>                </div>
                <UserIcon className="h-8 w-8 text-green-500 opacity-60" />
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="glass-card rounded-2xl p-6 mb-8 animate-fade-scale">
            <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>            {/* Role Filter */}            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>            {/* Status Filter */}            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>            {/* Sort */}            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            >
              <option value="name">Sort by Name</option>
              <option value="role">Sort by Role</option>
              <option value="recent">Sort by Recent</option>
              <option value="joined">Sort by Joined</option>
            </select>
          </div>
        </div>        {/* Results Count */}
        <div className="mb-6">
          <p className="text-body text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>

        {/* Users Grid */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-fade-scale">
            {filteredUsers.map((user, index) => (
              <UserCard key={user.id} user={user} index={index} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center animate-slide-up">
            <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-light text-gray-800 mb-2">
              No users found
            </h3>
            <p className="text-body text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search terms or filters' : 'Start by adding your first user'}
            </p>
            <button className="btn-primary px-6 py-3 rounded-xl">
              Add Your First User
            </button>
          </div>
        )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Users;
