import { motion } from 'framer-motion';
import {
  Users,
  Shield,
  Key,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  UserCheck,
  Settings,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Database,
  FileText,
  Code,
  Server,
  Globe,
  Activity,
  RotateCcw,
  RefreshCw
} from 'lucide-react';
import React, { useState } from 'react';

import ParscadeButton from '@/shared/components/brand/ParscadeButton';
import ParscadeCard from '@/shared/components/brand/ParscadeCard';
import ParscadeStatusBadge from '@/shared/components/brand/ParscadeStatusBadge';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  lastLogin: string | null;
  permissions: string[];
  createdAt: string;
  mfaEnabled: boolean;
  failedLogins: number;
  sessionCount: number;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  category: 'system' | 'business' | 'custom';
  createdAt: string;
  lastModified: string;
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

const AccessControlPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions' | 'sessions' | 'audit'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  const users: User[] = [
    {
      id: 'usr_001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Finance Manager',
      department: 'Finance',
      status: 'active',
      lastLogin: '2024-01-24 15:30:00',
      permissions: ['finance_read', 'finance_write', 'reports_generate', 'user_invite'],
      createdAt: '2023-06-15',
      mfaEnabled: true,
      failedLogins: 0,
      sessionCount: 3
    },
    {
      id: 'usr_002',
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      role: 'IT Administrator',
      department: 'IT',
      status: 'active',
      lastLogin: '2024-01-24 14:45:00',
      permissions: ['admin_full', 'system_config', 'user_management', 'audit_access'],
      createdAt: '2023-03-10',
      mfaEnabled: true,
      failedLogins: 0,
      sessionCount: 2
    },
    {
      id: 'usr_003',
      name: 'Lisa Rodriguez',
      email: 'lisa.rodriguez@company.com',
      role: 'Legal Counsel',
      department: 'Legal',
      status: 'active',
      lastLogin: '2024-01-24 12:20:00',
      permissions: ['contracts_full', 'compliance_read', 'documents_sensitive'],
      createdAt: '2023-08-22',
      mfaEnabled: true,
      failedLogins: 1,
      sessionCount: 1
    },
    {
      id: 'usr_004',
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'Sales Representative',
      department: 'Sales',
      status: 'suspended',
      lastLogin: '2024-01-20 09:15:00',
      permissions: ['sales_read', 'customer_contact'],
      createdAt: '2023-11-05',
      mfaEnabled: false,
      failedLogins: 7,
      sessionCount: 0
    },
    {
      id: 'usr_005',
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      role: 'Data Analyst',
      department: 'Analytics',
      status: 'pending',
      lastLogin: null,
      permissions: [],
      createdAt: '2024-01-24',
      mfaEnabled: false,
      failedLogins: 0,
      sessionCount: 0
    }
  ];

  const roles: Role[] = [
    {
      id: 'role_001',
      name: 'System Administrator',
      description: 'Full system access and configuration privileges',
      permissions: ['admin_full', 'system_config', 'user_management', 'audit_access', 'security_config'],
      userCount: 3,
      category: 'system',
      createdAt: '2023-01-15',
      lastModified: '2024-01-10'
    },
    {
      id: 'role_002',
      name: 'Finance Manager',
      description: 'Financial data access and reporting capabilities',
      permissions: ['finance_read', 'finance_write', 'reports_generate', 'budget_approve', 'user_invite'],
      userCount: 5,
      category: 'business',
      createdAt: '2023-02-20',
      lastModified: '2024-01-15'
    },
    {
      id: 'role_003',
      name: 'Legal Counsel',
      description: 'Legal document and contract management access',
      permissions: ['contracts_full', 'compliance_read', 'documents_sensitive', 'legal_review'],
      userCount: 2,
      category: 'business',
      createdAt: '2023-03-01',
      lastModified: '2023-12-20'
    },
    {
      id: 'role_004',
      name: 'Sales Representative',
      description: 'Customer interaction and sales data access',
      permissions: ['sales_read', 'customer_contact', 'leads_manage', 'reports_view'],
      userCount: 12,
      category: 'business',
      createdAt: '2023-01-30',
      lastModified: '2024-01-05'
    }
  ];

  const permissions: Permission[] = [
    {
      id: 'perm_001',
      name: 'admin_full',
      resource: 'System',
      action: 'Full Access',
      description: 'Complete administrative access to all system functions',
      category: 'Administration',
      riskLevel: 'critical'
    },
    {
      id: 'perm_002',
      name: 'finance_read',
      resource: 'Financial Data',
      action: 'Read',
      description: 'View financial records and reports',
      category: 'Finance',
      riskLevel: 'medium'
    },
    {
      id: 'perm_003',
      name: 'finance_write',
      resource: 'Financial Data',
      action: 'Write',
      description: 'Create and modify financial records',
      category: 'Finance',
      riskLevel: 'high'
    },
    {
      id: 'perm_004',
      name: 'user_management',
      resource: 'User Accounts',
      action: 'Manage',
      description: 'Create, modify, and deactivate user accounts',
      category: 'Administration',
      riskLevel: 'high'
    },
    {
      id: 'perm_005',
      name: 'documents_sensitive',
      resource: 'Sensitive Documents',
      action: 'Access',
      description: 'Access to confidential and sensitive documents',
      category: 'Documents',
      riskLevel: 'high'
    }
  ];

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-emerald-400 bg-emerald-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'system': return 'text-red-400';
      case 'business': return 'text-blue-400';
      case 'custom': return 'text-purple-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'inactive': return XCircle;
      case 'suspended': return AlertTriangle;
      case 'pending': return Clock;
      default: return Users;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || user.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Access Control</h1>
          <p className="text-slate-400 mt-1">Manage user access, roles, and permissions across your organization</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <ParscadeButton variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Directory
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
          { id: 'users', label: 'Users', icon: Users },
          { id: 'roles', label: 'Roles', icon: Shield },
          { id: 'permissions', label: 'Permissions', icon: Key },
          { id: 'sessions', label: 'Active Sessions', icon: Activity },
          { id: 'audit', label: 'Access Audit', icon: FileText }
        ].map(({ id, label, icon: Icon }) => (
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
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Users</p>
              <p className="text-2xl font-bold text-white mt-1">247</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Active Sessions</p>
              <p className="text-2xl font-bold text-white mt-1">156</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">MFA Enabled</p>
              <p className="text-2xl font-bold text-white mt-1">198</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Failed Logins (24h)</p>
              <p className="text-2xl font-bold text-white mt-1">23</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Roles</p>
              <p className="text-2xl font-bold text-white mt-1">12</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Key className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </ParscadeCard>
      </div>

      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Filters */}
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

          {/* User List */}
          <div className="space-y-4">
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
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <StatusIcon className={`w-6 h-6 ${
                            user.status === 'active' ? 'text-emerald-400' :
                            user.status === 'suspended' ? 'text-red-400' :
                            user.status === 'pending' ? 'text-yellow-400' :
                            'text-slate-400'
                          }`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                            <ParscadeStatusBadge status={user.status} />
                            {user.mfaEnabled && (
                              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md text-xs font-medium">
                                MFA
                              </span>
                            )}
                            {user.failedLogins > 5 && (
                              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-md text-xs font-medium">
                                HIGH RISK
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-slate-400 mb-1">Contact & Role</p>
                              <p className="text-white font-medium">{user.email}</p>
                              <p className="text-slate-300 text-sm">{user.role} • {user.department}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-400 mb-1">Activity</p>
                              <p className="text-white text-sm">
                                {user.lastLogin ? `Last login: ${user.lastLogin}` : 'Never logged in'}
                              </p>
                              <p className="text-slate-300 text-sm">
                                {user.sessionCount} active sessions
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-400 mb-1">Security</p>
                              <p className="text-white text-sm">
                                {user.failedLogins} failed logins
                              </p>
                              <p className="text-slate-300 text-sm">
                                {user.permissions.length} permissions
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-400">Created: {user.createdAt}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Key className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-400">
                                Permissions: {user.permissions.slice(0, 3).join(', ')}
                                {user.permissions.length > 3 && ` +${user.permissions.length - 3} more`}
                              </span>
                            </div>
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
                        {user.status === 'active' ? (
                          <button className="p-2 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors">
                            <Lock className="w-4 h-4" />
                          </button>
                        ) : user.status === 'suspended' ? (
                          <button className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors">
                            <Unlock className="w-4 h-4" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </ParscadeCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roles.map((role) => (
              <motion.div
                key={role.id}
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
                          <h3 className="text-lg font-semibold text-white">{role.name}</h3>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium bg-slate-700/50 ${getCategoryColor(role.category)}`}>
                            {role.category.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm">{role.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Users</p>
                      <p className="text-lg font-bold text-white">{role.userCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Permissions</p>
                      <p className="text-lg font-bold text-white">{role.permissions.length}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-white mb-2">Key Permissions</p>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.slice(0, 4).map((permission) => (
                        <span key={permission} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md">
                          {permission.replace('_', ' ')}
                        </span>
                      ))}
                      {role.permissions.length > 4 && (
                        <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-md">
                          +{role.permissions.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <span>Created: {role.createdAt}</span>
                    <span>Modified: {role.lastModified}</span>
                  </div>

                  <div className="flex space-x-2">
                    <ParscadeButton variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </ParscadeButton>
                    <ParscadeButton size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Role
                    </ParscadeButton>
                  </div>
                </ParscadeCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="space-y-4">
          {permissions.map((permission) => (
            <motion.div
              key={permission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ParscadeCard className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Key className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{permission.name}</h3>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getRiskLevelColor(permission.riskLevel)}`}>
                          {permission.riskLevel.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md">
                          {permission.category}
                        </span>
                      </div>
                      <p className="text-slate-400 mb-3">{permission.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500 uppercase tracking-wide text-xs mb-1">Resource</p>
                          <p className="text-white">{permission.resource}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 uppercase tracking-wide text-xs mb-1">Action</p>
                          <p className="text-white">{permission.action}</p>
                        </div>
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
                  </div>
                </div>
              </ParscadeCard>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Active User Sessions</h3>
            <div className="space-y-3">
              {users.filter(user => user.sessionCount > 0).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-slate-400">{user.email} • {user.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{user.sessionCount} sessions</p>
                      <p className="text-xs text-slate-400">Last login: {user.lastLogin}</p>
                    </div>
                    <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                      <XCircle className="w-4 h-4" />
                    </button>
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
            <h3 className="text-lg font-semibold text-white mb-4">Recent Access Events</h3>
            <div className="space-y-3">
              {[
                {
                  user: 'Sarah Johnson',
                  action: 'Login Success',
                  resource: 'Finance Dashboard',
                  timestamp: '2024-01-24 15:30:00',
                  ip: '192.168.1.104',
                  risk: 'low'
                },
                {
                  user: 'Mike Chen',
                  action: 'Permission Modified',
                  resource: 'User Management',
                  timestamp: '2024-01-24 14:45:00',
                  ip: '192.168.1.200',
                  risk: 'high'
                },
                {
                  user: 'John Smith',
                  action: 'Login Failed',
                  resource: 'Authentication System',
                  timestamp: '2024-01-24 14:30:00',
                  ip: '192.168.1.150',
                  risk: 'medium'
                },
                {
                  user: 'Unknown',
                  action: 'Multiple Login Attempts',
                  resource: 'Authentication System',
                  timestamp: '2024-01-24 14:15:00',
                  ip: '203.0.113.45',
                  risk: 'critical'
                }
              ].map((event, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      event.risk === 'critical' ? 'bg-red-400' :
                      event.risk === 'high' ? 'bg-orange-400' :
                      event.risk === 'medium' ? 'bg-yellow-400' :
                      'bg-emerald-400'
                    }`} />
                    <div>
                      <p className="font-medium text-white">{event.action}</p>
                      <p className="text-sm text-slate-400">{event.user} • {event.resource}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-white">{event.timestamp}</p>
                    <p className="text-slate-400">{event.ip}</p>
                  </div>
                </div>
              ))}
            </div>
          </ParscadeCard>
        </div>
      )}
    </div>
  );
};

export default AccessControlPage;