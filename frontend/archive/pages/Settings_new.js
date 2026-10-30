import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { 
  CogIcon, 
  UserIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  GlobeAltIcon,
  ServerIcon,
  UsersIcon,
  ChartBarIcon,
  CircleStackIcon,
  CloudIcon,
  DocumentIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(user?.role === 'admin' ? 'overview' : 'profile');

  // Role-based settings tabs
  const getSettingsTabs = () => {
    const baseTabs = [
      { id: 'profile', name: 'Profile', icon: UserIcon },
      { id: 'notifications', name: 'Notifications', icon: BellIcon },
      { id: 'security', name: 'Security', icon: ShieldCheckIcon },
      { id: 'preferences', name: 'Preferences', icon: CogIcon },
      { id: 'privacy', name: 'Privacy', icon: GlobeAltIcon }
    ];

    if (user?.role === 'admin') {
      return [
        { id: 'overview', name: 'System Overview', icon: ChartBarIcon },
        { id: 'platform', name: 'Platform Config', icon: ServerIcon },
        { id: 'users', name: 'User Management', icon: UsersIcon },
        { id: 'security-admin', name: 'Security & Access', icon: ShieldCheckIcon },
        { id: 'backup', name: 'Backup & Recovery', icon: CircleStackIcon },
        { id: 'integrations', name: 'Integrations', icon: CloudIcon },
        { id: 'maintenance', name: 'Maintenance', icon: WrenchScrewdriverIcon },
        { id: 'logs', name: 'System Logs', icon: DocumentIcon }
      ];
    }

    return baseTabs;
  };

  const settingsTabs = getSettingsTabs();

  const renderTabContent = () => {
    if (user?.role === 'admin') {
      switch (activeTab) {
        case 'overview':
          return (
            <div className="space-y-8">
              <h3 className="text-2xl font-montserrat font-medium text-gray-800 mb-6">System Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-light text-gray-800 mt-2">1,247</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <UsersIcon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm text-green-600 mt-2">+12% from last month</p>
                </div>
                
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">System Health</p>
                      <p className="text-3xl font-light text-gray-800 mt-2">98.5%</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <ServerIcon className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-green-600 mt-2">All systems operational</p>
                </div>
                
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Storage Used</p>
                      <p className="text-3xl font-light text-gray-800 mt-2">2.4TB</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <CircleStackIcon className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">of 10TB capacity</p>
                </div>
                
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                      <p className="text-3xl font-light text-gray-800 mt-2">342</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <ChartBarIcon className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Currently online</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h4>
                  <div className="space-y-4">
                    {[
                      { action: 'User registration', count: 15, time: '2 hours ago' },
                      { action: 'Database backup', count: 1, time: '6 hours ago' },
                      { action: 'System update', count: 1, time: '1 day ago' },
                      { action: 'Security scan', count: 1, time: '2 days ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="text-gray-800 font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.time}</p>
                        </div>
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                          {activity.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="glass-card rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">System Alerts</h4>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium">All Systems Operational</p>
                      <p className="text-sm text-green-600">No critical issues detected</p>
                    </div>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 font-medium">Scheduled Maintenance</p>
                      <p className="text-sm text-yellow-600">Database optimization in 2 days</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 font-medium">Update Available</p>
                      <p className="text-sm text-blue-600">LMS Platform v2.1.4 ready for deployment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );

        case 'platform':
          return (
            <div className="space-y-8">
              <h3 className="text-2xl font-montserrat font-medium text-gray-800 mb-6">Platform Configuration</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">General Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Platform Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        defaultValue="Nova Learning Platform"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Admin Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        defaultValue="admin@novalearning.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Time Zone</label>
                      <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option>UTC-5 (Eastern Time)</option>
                        <option>UTC-6 (Central Time)</option>
                        <option>UTC-7 (Mountain Time)</option>
                        <option>UTC-8 (Pacific Time)</option>
                      </select>
                    </div>
                    <button className="btn-primary">Save Configuration</button>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">System Limits</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Max Upload Size (MB)</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        defaultValue="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        defaultValue="60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Max Users per Class</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        defaultValue="50"
                      />
                    </div>
                    <button className="btn-primary">Update Limits</button>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Feature Toggles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: 'registration', label: 'User Registration', description: 'Allow new users to register', enabled: true },
                    { id: 'messaging', label: 'Internal Messaging', description: 'Enable direct messaging between users', enabled: true },
                    { id: 'live-sessions', label: 'Live Sessions', description: 'Enable video conferencing features', enabled: true },
                    { id: 'file-sharing', label: 'File Sharing', description: 'Allow file uploads and sharing', enabled: true },
                    { id: 'notifications', label: 'Push Notifications', description: 'Enable browser notifications', enabled: false },
                    { id: 'analytics', label: 'Advanced Analytics', description: 'Enable detailed user analytics', enabled: true }
                  ].map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="text-gray-800 font-medium">{feature.label}</h5>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={feature.enabled} />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        case 'users':
          return (
            <div className="space-y-8">
              <h3 className="text-2xl font-montserrat font-medium text-gray-800 mb-6">User Management</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Registration Settings</h4>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-gray-800 font-medium">Allow Self Registration</h5>
                        <p className="text-gray-600 text-sm">Users can create accounts without admin approval</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-gray-800 font-medium">Require Email Verification</h5>
                        <p className="text-gray-600 text-sm">New users must verify their email address</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Default Role for New Users</label>
                      <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option value="student">Student</option>
                        <option value="teacher">Teacher (requires approval)</option>
                      </select>
                    </div>
                    
                    <button className="btn-primary">Save Settings</button>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Role Management</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-blue-800 font-medium">Students</h5>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">1,089</span>
                      </div>
                      <p className="text-blue-600 text-sm">Can access classes, assignments, and submit work</p>
                    </div>
                    
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-green-800 font-medium">Teachers</h5>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">142</span>
                      </div>
                      <p className="text-green-600 text-sm">Can create classes, manage students, and grade assignments</p>
                    </div>
                    
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-orange-800 font-medium">Admins</h5>
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">16</span>
                      </div>
                      <p className="text-orange-600 text-sm">Full system access and configuration privileges</p>
                    </div>
                    
                    <button className="btn-secondary bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 w-full">
                      Manage User Roles
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Bulk Operations</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="btn-secondary bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
                    Export User Data
                  </button>
                  <button className="btn-secondary bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
                    Import Users (CSV)
                  </button>
                  <button className="btn-secondary bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
                    Send Bulk Notifications
                  </button>
                </div>
              </div>
            </div>
          );

        case 'backup':
          return (
            <div className="space-y-8">
              <h3 className="text-2xl font-montserrat font-medium text-gray-800 mb-6">Backup & Recovery</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Backup Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Backup Frequency</label>
                      <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option value="daily">Daily at 2:00 AM</option>
                        <option value="weekly">Weekly on Sundays</option>
                        <option value="monthly">Monthly on 1st</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Retention Period</label>
                      <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option value="30">30 days</option>
                        <option value="90">90 days</option>
                        <option value="365">1 year</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-gray-800 font-medium">Automatic Backups</h5>
                        <p className="text-gray-600 text-sm">Enable scheduled automatic backups</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    <button className="btn-primary">Save Backup Settings</button>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Manual Operations</h4>
                  <div className="space-y-4">
                    <button className="btn-primary w-full">Create Backup Now</button>
                    <button className="btn-secondary bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 w-full">
                      Restore from Backup
                    </button>
                    <button className="btn-secondary bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 w-full">
                      Download Latest Backup
                    </button>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h5 className="text-gray-800 font-medium mb-2">Last Backup</h5>
                    <p className="text-sm text-gray-600">June 15, 2025 at 2:00 AM</p>
                    <p className="text-sm text-green-600">Successful - 2.4 GB</p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Backup History</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Size</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: 'Jun 15, 2025', type: 'Automatic', size: '2.4 GB', status: 'Success' },
                        { date: 'Jun 14, 2025', type: 'Automatic', size: '2.3 GB', status: 'Success' },
                        { date: 'Jun 13, 2025', type: 'Manual', size: '2.3 GB', status: 'Success' },
                        { date: 'Jun 12, 2025', type: 'Automatic', size: '2.2 GB', status: 'Success' }
                      ].map((backup, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-sm text-gray-800">{backup.date}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{backup.type}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{backup.size}</td>
                          <td className="py-3 px-4">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              {backup.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );

        default:
          return (
            <div className="text-center py-16">
              <ServerIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">Admin Settings</h3>
              <p className="text-gray-600">Select a tab to configure system settings</p>
            </div>
          );
      }
    }

    // Student/Teacher Settings
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Profile Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Your full name"
                  defaultValue={user?.name || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="your.email@example.com"
                  defaultValue={user?.email || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {user?.role === 'teacher' ? 'Department' : 'Major'}
                </label>
                <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>Select {user?.role === 'teacher' ? 'Department' : 'Major'}</option>
                  <option>Mathematics</option>
                  <option>Science</option>
                  <option>English</option>
                  <option>History</option>
                  <option>Computer Science</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Bio</label>
              <textarea
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>
            <button className="btn-primary">Save Changes</button>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { id: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                { id: 'push', label: 'Push Notifications', description: 'Receive browser push notifications' },
                { id: 'assignments', label: 'Assignment Reminders', description: 'Get reminded about upcoming assignments' },
                { id: 'classes', label: 'Class Updates', description: 'Notifications about class schedules and changes' },
                { id: 'messages', label: 'Direct Messages', description: `Notifications for direct messages from ${user?.role === 'teacher' ? 'students and colleagues' : 'teachers'}` },
                ...(user?.role === 'teacher' ? [
                  { id: 'submissions', label: 'Assignment Submissions', description: 'Notifications when students submit assignments' },
                  { id: 'grades', label: 'Grade Reminders', description: 'Reminders to grade pending assignments' }
                ] : [
                  { id: 'grades', label: 'Grade Updates', description: 'Notifications when grades are posted' }
                ])
              ].map((setting) => (
                <div key={setting.id} className="glass-card p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-gray-800 font-medium">{setting.label}</h4>
                      <p className="text-gray-600 text-sm">{setting.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Security Settings</h3>
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-xl">
                <h4 className="text-gray-800 font-medium mb-4">Change Password</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Current Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    />
                  </div>
                  <button className="btn-primary">Update Password</button>
                </div>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h4 className="text-gray-800 font-medium mb-4">Two-Factor Authentication</h4>
                <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                <button className="btn-secondary bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Preferences</h3>
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-xl">
                <h4 className="text-gray-800 font-medium mb-4">Appearance</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Theme</label>
                    <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>Light (Default)</option>
                      <option>Dark</option>
                      <option>Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Language</label>
                    <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h4 className="text-gray-800 font-medium mb-4">Dashboard</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-gray-800">Show recent activity</h5>
                      <p className="text-gray-600 text-sm">Display recent activities on dashboard</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Privacy Settings</h3>
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-xl">
                <h4 className="text-gray-800 font-medium mb-4">Profile Visibility</h4>
                <div className="space-y-4">
                  {[
                    { id: 'profile_public', label: 'Public Profile', description: 'Your profile is visible to all users' },
                    { id: 'show_email', label: 'Show Email', description: 'Display email on your profile' },
                    { id: 'show_phone', label: 'Show Phone', description: 'Display phone number on your profile' },
                  ].map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between">
                      <div>
                        <h5 className="text-gray-800">{setting.label}</h5>
                        <p className="text-gray-600 text-sm">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h4 className="text-gray-800 font-medium mb-4">Data & Privacy</h4>
                <div className="space-y-4">
                  <button className="btn-secondary bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 w-full text-left">
                    Download My Data
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full text-left">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{backgroundColor:"#fcfcf7"}}>
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
                {user?.role === 'admin' ? 'System ' : ''}<span className="text-gradient">Settings</span>
              </h1>
              <p className="text-body text-gray-600">
                {user?.role === 'admin' 
                  ? 'Manage system configuration and platform settings'
                  : 'Manage your account settings and preferences'
                }
              </p>
            </div>
          </div>

          {/* Settings Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 animate-slide-up">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Settings Content */}
          <div className="glass-card rounded-2xl p-8 animate-fade-scale">
            {renderTabContent()}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Settings;
