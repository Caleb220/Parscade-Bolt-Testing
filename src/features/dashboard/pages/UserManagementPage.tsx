import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Shield,
  Key,
  Mail,
  Phone,
  Calendar,
  Clock,
  Activity,
  Settings,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  RefreshCw,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Send,
  Globe,
  Building,
  Award,
  Target
} from 'lucide-react';
import React, { useState } from 'react';

import ParscadeButton from '@/shared/components/brand/ParscadeButton';
import ParscadeCard from '@/shared/components/brand/ParscadeCard';
import ParscadeStatusBadge from '@/shared/components/brand/ParscadeStatusBadge';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  role: string;
  title: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending' | 'locked';
  lastLogin: string | null;
  createdAt: string;
  lastModified: string;
  permissions: string[];
  groups: string[];
  manager?: string;
  location: string;
  timezone: string;
  mfaEnabled: boolean;
  failedLoginAttempts: number;
  sessionCount: number;
  profileImage?: string;
}

interface UserGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  permissions: string[];
  createdAt: string;
  type: 'department' | 'project' | 'role' | 'custom';
  manager: string;
}

interface BulkAction {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  requiresConfirmation: boolean;
}

const UserManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'groups' | 'invitations' | 'audit' | 'settings'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const users: User[] = [
    {
      id: 'usr_001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Finance',
      role: 'Finance Manager',
      title: 'Senior Finance Manager',
      status: 'active',
      lastLogin: '2024-01-24 15:30:00',
      createdAt: '2023-06-15',
      lastModified: '2024-01-20',
      permissions: ['finance_read', 'finance_write', 'reports_generate', 'user_invite'],
      groups: ['Finance Team', 'Managers', 'Report Access'],
      manager: 'David Kim',
      location: 'New York, NY',
      timezone: 'America/New_York',
      mfaEnabled: true,
      failedLoginAttempts: 0,
      sessionCount: 2
    },
    {
      id: 'usr_002',
      firstName: 'Mike',
      lastName: 'Chen',
      email: 'mike.chen@company.com',
      phone: '+1 (555) 234-5678',
      department: 'IT',
      role: 'IT Administrator',
      title: 'Senior System Administrator',
      status: 'active',
      lastLogin: '2024-01-24 14:45:00',
      createdAt: '2023-03-10',
      lastModified: '2024-01-22',
      permissions: ['admin_full', 'system_config', 'user_management', 'audit_access'],
      groups: ['IT Team', 'Administrators', 'Security Team'],
      manager: 'Patricia Brown',
      location: 'San Francisco, CA',
      timezone: 'America/Los_Angeles',
      mfaEnabled: true,
      failedLoginAttempts: 0,
      sessionCount: 3
    },
    {
      id: 'usr_003',
      firstName: 'Lisa',
      lastName: 'Rodriguez',
      email: 'lisa.rodriguez@company.com',
      phone: '+1 (555) 345-6789',
      department: 'Legal',
      role: 'Legal Counsel',
      title: 'Senior Legal Counsel',
      status: 'active',
      lastLogin: '2024-01-24 12:20:00',
      createdAt: '2023-08-22',
      lastModified: '2024-01-18',
      permissions: ['contracts_full', 'compliance_read', 'documents_sensitive'],
      groups: ['Legal Team', 'Compliance Officers'],
      manager: 'Robert Taylor',
      location: 'Austin, TX',
      timezone: 'America/Chicago',
      mfaEnabled: true,
      failedLoginAttempts: 1,
      sessionCount: 1
    },
    {
      id: 'usr_004',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 456-7890',
      department: 'Sales',
      role: 'Sales Representative',
      title: 'Account Executive',
      status: 'suspended',
      lastLogin: '2024-01-20 09:15:00',
      createdAt: '2023-11-05',
      lastModified: '2024-01-21',
      permissions: ['sales_read', 'customer_contact'],
      groups: ['Sales Team'],
      manager: 'Jennifer Adams',
      location: 'Chicago, IL',
      timezone: 'America/Chicago',
      mfaEnabled: false,
      failedLoginAttempts: 7,
      sessionCount: 0
    },
    {
      id: 'usr_005',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@company.com',
      department: 'Analytics',
      role: 'Data Analyst',
      title: 'Junior Data Analyst',
      status: 'pending',
      lastLogin: null,
      createdAt: '2024-01-24',
      lastModified: '2024-01-24',
      permissions: [],
      groups: ['Analytics Team'],
      location: 'Remote',
      timezone: 'America/New_York',
      mfaEnabled: false,
      failedLoginAttempts: 0,
      sessionCount: 0
    }
  ];

  const userGroups: UserGroup[] = [
    {
      id: 'grp_001',
      name: 'Finance Team',
      description: 'All financial department staff',
      memberCount: 12,
      permissions: ['finance_read', 'finance_write', 'reports_view'],
      createdAt: '2023-01-15',
      type: 'department',
      manager: 'Sarah Johnson'
    },
    {
      id: 'grp_002',
      name: 'IT Administrators',
      description: 'System administrators with full access',
      memberCount: 5,
      permissions: ['admin_full', 'system_config', 'user_management', 'audit_access'],
      createdAt: '2023-01-20',
      type: 'role',
      manager: 'Mike Chen'
    },
    {
      id: 'grp_003',
      name: 'Project Alpha',
      description: 'Members of the Alpha project initiative',
      memberCount: 8,
      permissions: ['project_alpha_access', 'document_collab'],
      createdAt: '2023-09-10',
      type: 'project',
      manager: 'Lisa Rodriguez'
    },
    {
      id: 'grp_004',
      name: 'Remote Workers',
      description: 'Employees working remotely',
      memberCount: 34,
      permissions: ['vpn_access', 'remote_tools'],
      createdAt: '2023-03-01',
      type: 'custom',
      manager: 'David Kim'
    }
  ];

  const bulkActions: BulkAction[] = [
    { id: 'activate', name: 'Activate Users', description: 'Enable selected user accounts', icon: CheckCircle, requiresConfirmation: true },
    { id: 'deactivate', name: 'Deactivate Users', description: 'Disable selected user accounts', icon: XCircle, requiresConfirmation: true },
    { id: 'suspend', name: 'Suspend Users', description: 'Temporarily suspend user access', icon: Lock, requiresConfirmation: true },
    { id: 'reset_password', name: 'Reset Passwords', description: 'Send password reset emails', icon: Key, requiresConfirmation: true },
    { id: 'enable_mfa', name: 'Enable MFA', description: 'Require multi-factor authentication', icon: Shield, requiresConfirmation: false },
    { id: 'export', name: 'Export Data', description: 'Export user information to CSV', icon: Download, requiresConfirmation: false }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'inactive': return XCircle;
      case 'suspended': return Lock;
      case 'pending': return Clock;
      case 'locked': return AlertTriangle;
      default: return Users;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400';
      case 'inactive': return 'text-slate-400';
      case 'suspended': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      case 'locked': return 'text-orange-400';
      default: return 'text-slate-400';
    }
  };

  const getGroupTypeColor = (type: string) => {
    switch (type) {
      case 'department': return 'text-blue-400';
      case 'project': return 'text-purple-400';
      case 'role': return 'text-emerald-400';
      case 'custom': return 'text-orange-400';
      default: return 'text-slate-400';
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || user.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(prev =>
      prev.length === filteredUsers.length ? [] : filteredUsers.map(u => u.id)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 mt-1">Manage user accounts, permissions, and organizational structure</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <ParscadeButton variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Users
          </ParscadeButton>
          <ParscadeButton variant="primary">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </ParscadeButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        {[
          { id: 'users', label: 'Users', icon: Users, count: users.length },
          { id: 'groups', label: 'Groups', icon: Shield, count: userGroups.length },
          { id: 'invitations', label: 'Invitations', icon: Send, count: 3 },
          { id: 'audit', label: 'User Audit', icon: Activity, count: 0 },
          { id: 'settings', label: 'Settings', icon: Settings, count: 0 }
        ].map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-blue-600/20 text-blue-400 shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
            {count > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-slate-600 text-slate-200 text-xs rounded-full">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Users</p>
              <p className="text-2xl font-bold text-white mt-1">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Active Users</p>
              <p className="text-2xl font-bold text-white mt-1">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Pending Approval</p>
              <p className="text-2xl font-bold text-white mt-1">
                {users.filter(u => u.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Groups</p>
              <p className="text-2xl font-bold text-white mt-1">{userGroups.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">MFA Enabled</p>
              <p className="text-2xl font-bold text-white mt-1">
                {users.filter(u => u.mfaEnabled).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </ParscadeCard>
      </div>

      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
              <option value="locked">Locked</option>
            </select>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="Finance">Finance</option>
              <option value="IT">IT</option>
              <option value="Legal">Legal</option>
              <option value="Sales">Sales</option>
              <option value="Analytics">Analytics</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <ParscadeCard className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-white">
                    {selectedUsers.length} user(s) selected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {bulkActions.slice(0, 4).map((action) => {
                    const Icon = action.icon;
                    return (
                      <ParscadeButton key={action.id} variant="outline" size="sm">
                        <Icon className="w-4 h-4 mr-2" />
                        {action.name}
                      </ParscadeButton>
                    );
                  })}
                </div>
              </div>
            </ParscadeCard>
          )}

          {/* User List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-400">Select all</span>
              </div>
              <div className="text-sm text-slate-400">
                {filteredUsers.length} of {users.length} users
              </div>
            </div>

            {filteredUsers.map((user) => {
              const StatusIcon = getStatusIcon(user.status);
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ParscadeCard className="p-6">
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelection(user.id)}
                        className="mt-1 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                      />

                      <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="text-lg font-semibold text-white">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">
                                {user.firstName} {user.lastName}
                              </h3>
                              <StatusIcon className={`w-5 h-5 ${getStatusColor(user.status)}`} />
                              {user.mfaEnabled && (
                                <Shield className="w-4 h-4 text-emerald-400" title="MFA Enabled" />
                              )}
                              {user.failedLoginAttempts > 3 && (
                                <AlertTriangle className="w-4 h-4 text-red-400" title="High Failed Login Attempts" />
                              )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-slate-400 mb-1">Contact Information</p>
                                <p className="text-white text-sm">{user.email}</p>
                                {user.phone && (
                                  <p className="text-slate-300 text-sm">{user.phone}</p>
                                )}
                              </div>
                              <div>
                                <p className="text-sm text-slate-400 mb-1">Role & Department</p>
                                <p className="text-white text-sm">{user.title}</p>
                                <p className="text-slate-300 text-sm">{user.department}</p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-400 mb-1">Location & Activity</p>
                                <p className="text-white text-sm">{user.location}</p>
                                <p className="text-slate-300 text-sm">
                                  {user.lastLogin ? `Last login: ${user.lastLogin}` : 'Never logged in'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-400">
                                  {user.groups.length} groups
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Key className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-400">
                                  {user.permissions.length} permissions
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Activity className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-400">
                                  {user.sessionCount} active sessions
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-400">
                                  Joined {user.createdAt}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                              <Settings className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ParscadeCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userGroups.map((group) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ParscadeCard className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">{group.name}</h3>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium bg-slate-700/50 ${getGroupTypeColor(group.type)}`}>
                            {group.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm">{group.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Members</p>
                      <p className="text-lg font-bold text-white">{group.memberCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Permissions</p>
                      <p className="text-lg font-bold text-white">{group.permissions.length}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-white mb-2">Manager</p>
                    <p className="text-slate-300 text-sm">{group.manager}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <span>Created: {group.createdAt}</span>
                    <span>Type: {group.type}</span>
                  </div>

                  <div className="flex space-x-2">
                    <ParscadeButton variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Members
                    </ParscadeButton>
                    <ParscadeButton size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Group
                    </ParscadeButton>
                  </div>
                </ParscadeCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'invitations' && (
        <div className="space-y-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Pending Invitations</h3>
            <div className="space-y-3">
              {[
                { email: 'new.user@company.com', role: 'Marketing Specialist', sentBy: 'Sarah Johnson', sentAt: '2024-01-23', status: 'pending' },
                { email: 'contractor@external.com', role: 'External Consultant', sentBy: 'Mike Chen', sentAt: '2024-01-22', status: 'expired' },
                { email: 'intern@company.com', role: 'Summer Intern', sentBy: 'Lisa Rodriguez', sentAt: '2024-01-24', status: 'pending' }
              ].map((invitation, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{invitation.email}</p>
                    <p className="text-sm text-slate-400">
                      {invitation.role} • Sent by {invitation.sentBy} on {invitation.sentAt}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ParscadeStatusBadge status={invitation.status} />
                    <div className="flex space-x-1">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ParscadeCard>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent User Activity</h3>
            <div className="space-y-3">
              {[
                {
                  user: 'Mike Chen',
                  action: 'Modified user permissions',
                  target: 'Sarah Johnson',
                  timestamp: '2024-01-24 15:30:00',
                  type: 'permission_change'
                },
                {
                  user: 'Sarah Johnson',
                  action: 'Created new user group',
                  target: 'Marketing Team',
                  timestamp: '2024-01-24 14:15:00',
                  type: 'group_creation'
                },
                {
                  user: 'Lisa Rodriguez',
                  action: 'Suspended user account',
                  target: 'John Smith',
                  timestamp: '2024-01-24 13:45:00',
                  type: 'account_suspension'
                },
                {
                  user: 'David Kim',
                  action: 'Reset user password',
                  target: 'Emily Davis',
                  timestamp: '2024-01-24 12:30:00',
                  type: 'password_reset'
                }
              ].map((event, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    event.type === 'permission_change' ? 'bg-blue-400' :
                    event.type === 'group_creation' ? 'bg-emerald-400' :
                    event.type === 'account_suspension' ? 'bg-red-400' :
                    'bg-yellow-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {event.user} {event.action}
                    </p>
                    <p className="text-xs text-slate-400">
                      Target: {event.target} • {event.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ParscadeCard>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">User Management Settings</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-white mb-2">Account Policies</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500" />
                    <span className="text-slate-300">Require MFA for new accounts</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500" />
                    <span className="text-slate-300">Auto-suspend accounts after 90 days of inactivity</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500" />
                    <span className="text-slate-300">Require manager approval for new accounts</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">Security Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Maximum failed login attempts</span>
                    <select className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-white text-sm">
                      <option>3</option>
                      <option>5</option>
                      <option>7</option>
                      <option>10</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Account lockout duration</span>
                    <select className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-white text-sm">
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>24 hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </ParscadeCard>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;