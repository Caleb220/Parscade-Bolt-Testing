import { motion } from 'framer-motion';
import {
  Shield,
  Eye,
  Download,
  Filter,
  Search,
  Calendar,
  Clock,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  FileText,
  Database,
  Key,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  Edit,
  Trash2,
  ExternalLink,
  Archive,
  RefreshCw
} from 'lucide-react';
import React, { useState } from 'react';

import ParscadeButton from '@/shared/components/brand/ParscadeButton';
import ParscadeCard from '@/shared/components/brand/ParscadeCard';
import ParscadeStatusBadge from '@/shared/components/brand/ParscadeStatusBadge';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: {
    name: string;
    email: string;
    role: string;
    id: string;
  };
  action: {
    type: 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'access' | 'download' | 'share' | 'admin';
    resource: string;
    description: string;
  };
  metadata: {
    ipAddress: string;
    userAgent: string;
    location?: string;
    success: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  category: 'authentication' | 'data_access' | 'system_change' | 'permission_change' | 'file_operation' | 'security';
  details?: any;
}

const AuditLogsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logs' | 'analytics' | 'alerts' | 'exports'>('logs');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('today');

  const auditLogs: AuditLogEntry[] = [
    {
      id: '1',
      timestamp: '2024-01-24 15:42:33',
      user: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        role: 'Finance Manager',
        id: 'usr_001'
      },
      action: {
        type: 'download',
        resource: 'Invoice_ABC_Corp_2024.pdf',
        description: 'Downloaded confidential invoice document'
      },
      metadata: {
        ipAddress: '192.168.1.104',
        userAgent: 'Mozilla/5.0 Chrome/120.0.0.0',
        location: 'New York, USA',
        success: true,
        riskLevel: 'medium'
      },
      category: 'file_operation'
    },
    {
      id: '2',
      timestamp: '2024-01-24 15:38:21',
      user: {
        name: 'Mike Chen',
        email: 'mike.chen@company.com',
        role: 'IT Admin',
        id: 'usr_002'
      },
      action: {
        type: 'admin',
        resource: 'User Permissions',
        description: 'Modified user permissions for Finance team'
      },
      metadata: {
        ipAddress: '192.168.1.200',
        userAgent: 'Mozilla/5.0 Firefox/121.0',
        location: 'San Francisco, USA',
        success: true,
        riskLevel: 'high'
      },
      category: 'permission_change',
      details: { changedPermissions: ['read_financial_data', 'export_reports'] }
    },
    {
      id: '3',
      timestamp: '2024-01-24 15:35:18',
      user: {
        name: 'Unknown User',
        email: 'unknown@external.com',
        role: 'External',
        id: 'ext_001'
      },
      action: {
        type: 'login',
        resource: 'Authentication System',
        description: 'Failed login attempt from unknown location'
      },
      metadata: {
        ipAddress: '203.0.113.45',
        userAgent: 'curl/7.68.0',
        location: 'Unknown',
        success: false,
        riskLevel: 'critical'
      },
      category: 'authentication'
    },
    {
      id: '4',
      timestamp: '2024-01-24 15:30:45',
      user: {
        name: 'Lisa Rodriguez',
        email: 'lisa.rodriguez@company.com',
        role: 'Legal Counsel',
        id: 'usr_003'
      },
      action: {
        type: 'access',
        resource: 'Contracts Database',
        description: 'Accessed contract management system'
      },
      metadata: {
        ipAddress: '192.168.1.156',
        userAgent: 'Mozilla/5.0 Safari/605.1.15',
        location: 'Austin, USA',
        success: true,
        riskLevel: 'low'
      },
      category: 'data_access'
    },
    {
      id: '5',
      timestamp: '2024-01-24 15:25:12',
      user: {
        name: 'David Kim',
        email: 'david.kim@company.com',
        role: 'System Admin',
        id: 'usr_004'
      },
      action: {
        type: 'update',
        resource: 'Security Settings',
        description: 'Updated system security configuration'
      },
      metadata: {
        ipAddress: '192.168.1.210',
        userAgent: 'Mozilla/5.0 Chrome/120.0.0.0',
        location: 'Seattle, USA',
        success: true,
        riskLevel: 'high'
      },
      category: 'system_change'
    }
  ];

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'create': return FileText;
      case 'read': return Eye;
      case 'update': return Edit;
      case 'delete': return Trash2;
      case 'login': return Unlock;
      case 'logout': return Lock;
      case 'access': return Key;
      case 'download': return Download;
      case 'share': return ExternalLink;
      case 'admin': return Settings;
      default: return Activity;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-emerald-400 bg-emerald-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'authentication': return 'text-blue-400';
      case 'data_access': return 'text-purple-400';
      case 'system_change': return 'text-red-400';
      case 'permission_change': return 'text-orange-400';
      case 'file_operation': return 'text-emerald-400';
      case 'security': return 'text-pink-400';
      default: return 'text-slate-400';
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.action.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.action.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesRisk = filterRisk === 'all' || log.metadata.riskLevel === filterRisk;
    return matchesSearch && matchesCategory && matchesRisk;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
          <p className="text-slate-400 mt-1">Monitor system activity and security events with detailed audit trails</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <ParscadeButton variant="outline">
            <Archive className="w-4 h-4 mr-2" />
            Archive Logs
          </ParscadeButton>
          <ParscadeButton variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </ParscadeButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        {[
          { id: 'logs', label: 'Audit Trail', icon: Shield },
          { id: 'analytics', label: 'Analytics', icon: Activity },
          { id: 'alerts', label: 'Security Alerts', icon: AlertTriangle },
          { id: 'exports', label: 'Compliance Reports', icon: FileText }
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
              <p className="text-sm text-slate-400">Total Events</p>
              <p className="text-2xl font-bold text-white mt-1">2,847</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Critical Events</p>
              <p className="text-2xl font-bold text-white mt-1">7</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Failed Logins</p>
              <p className="text-2xl font-bold text-white mt-1">23</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Data Downloads</p>
              <p className="text-2xl font-bold text-white mt-1">156</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Permission Changes</p>
              <p className="text-2xl font-bold text-white mt-1">8</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Key className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </ParscadeCard>
      </div>

      {activeTab === 'logs' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="authentication">Authentication</option>
              <option value="data_access">Data Access</option>
              <option value="system_change">System Changes</option>
              <option value="permission_change">Permission Changes</option>
              <option value="file_operation">File Operations</option>
              <option value="security">Security Events</option>
            </select>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>

          {/* Audit Log Entries */}
          <div className="space-y-4">
            {filteredLogs.map((log) => {
              const ActionIcon = getActionIcon(log.action.type);
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ParscadeCard className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          log.metadata.success ? 'bg-emerald-500/20' : 'bg-red-500/20'
                        }`}>
                          <ActionIcon className={`w-6 h-6 ${
                            log.metadata.success ? 'text-emerald-400' : 'text-red-400'
                          }`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {log.action.description}
                            </h3>
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getRiskColor(log.metadata.riskLevel)}`}>
                              {log.metadata.riskLevel.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded-md text-xs font-medium bg-slate-700/50 ${getCategoryColor(log.category)}`}>
                              {log.category.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-slate-400 mb-1">User Details</p>
                              <div className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-slate-400" />
                                <span className="text-white font-medium">{log.user.name}</span>
                                <span className="text-slate-400">({log.user.role})</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{log.user.email}</p>
                            </div>

                            <div>
                              <p className="text-sm text-slate-400 mb-1">Resource</p>
                              <div className="flex items-center space-x-2">
                                <Database className="w-4 h-4 text-slate-400" />
                                <span className="text-white font-medium">{log.action.resource}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-300">{log.timestamp}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <ExternalLink className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-300">{log.metadata.ipAddress}</span>
                              {log.metadata.location && (
                                <span className="text-slate-500">({log.metadata.location})</span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {log.metadata.success ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                              <span className={log.metadata.success ? 'text-emerald-400' : 'text-red-400'}>
                                {log.metadata.success ? 'Success' : 'Failed'}
                              </span>
                            </div>
                          </div>

                          {log.details && (
                            <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                              <p className="text-sm text-slate-400 mb-2">Additional Details</p>
                              <pre className="text-xs text-slate-300 font-mono">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </ParscadeCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Activity Trends</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Authentication Events</span>
                <span className="text-sm font-medium text-white">842 events</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Data Access Events</span>
                <span className="text-sm font-medium text-white">1,245 events</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">System Changes</span>
                <span className="text-sm font-medium text-white">156 events</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-orange-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '25%' }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
            </div>
          </ParscadeCard>

          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Risk Distribution</h3>
            <div className="space-y-3">
              {[
                { level: 'Low Risk', count: 2156, color: 'bg-emerald-500', percentage: 76 },
                { level: 'Medium Risk', count: 489, color: 'bg-yellow-500', percentage: 17 },
                { level: 'High Risk', count: 165, color: 'bg-orange-500', percentage: 6 },
                { level: 'Critical Risk', count: 37, color: 'bg-red-500', percentage: 1 }
              ].map((item) => (
                <div key={item.level} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-white">{item.level}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-slate-400">{item.count} events</span>
                    <span className="text-sm font-medium text-white">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </ParscadeCard>

          <ParscadeCard className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">Top Users by Activity</h3>
            <div className="space-y-3">
              {[
                { name: 'Sarah Johnson', role: 'Finance Manager', events: 342, risk: 'medium' },
                { name: 'Mike Chen', role: 'IT Admin', events: 289, risk: 'high' },
                { name: 'Lisa Rodriguez', role: 'Legal Counsel', events: 178, risk: 'low' },
                { name: 'David Kim', role: 'System Admin', events: 156, risk: 'high' }
              ].map((user, index) => (
                <div key={user.name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-400">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{user.events}</p>
                      <p className="text-xs text-slate-400">events</p>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getRiskColor(user.risk)}`}>
                      {user.risk}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ParscadeCard>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Security Alerts</h3>
            <div className="space-y-3">
              {[
                {
                  type: 'critical',
                  title: 'Multiple Failed Login Attempts',
                  description: 'User attempted to login 5 times from unknown IP address',
                  time: '5 minutes ago',
                  ip: '203.0.113.45'
                },
                {
                  type: 'warning',
                  title: 'Unusual Data Download Pattern',
                  description: 'User downloaded 15+ confidential documents in short timeframe',
                  time: '23 minutes ago',
                  user: 'sarah.johnson@company.com'
                },
                {
                  type: 'info',
                  title: 'Permission Change Alert',
                  description: 'Admin user modified permissions for 8 users simultaneously',
                  time: '1 hour ago',
                  user: 'mike.chen@company.com'
                }
              ].map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'critical' ? 'bg-red-500/10 border-red-500' :
                  alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500' :
                  'bg-blue-500/10 border-blue-500'
                }`}>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                      alert.type === 'critical' ? 'text-red-400' :
                      alert.type === 'warning' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-white">{alert.title}</p>
                      <p className="text-sm text-slate-300 mt-1">{alert.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500 mt-2">
                        <span>{alert.time}</span>
                        {alert.ip && <span>IP: {alert.ip}</span>}
                        {alert.user && <span>User: {alert.user}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ParscadeCard>
        </div>
      )}

      {activeTab === 'exports' && (
        <div className="space-y-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Compliance Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'SOC 2 Audit Report', description: 'Complete audit trail for SOC 2 compliance', format: 'PDF' },
                { name: 'GDPR Data Access Log', description: 'Data access events for GDPR compliance', format: 'CSV' },
                { name: 'PCI DSS Security Events', description: 'Security events related to payment data', format: 'JSON' },
                { name: 'HIPAA Audit Trail', description: 'Healthcare data access compliance report', format: 'PDF' },
                { name: 'ISO 27001 Security Log', description: 'Information security management events', format: 'CSV' },
                { name: 'Custom Compliance Report', description: 'Generate custom report with specific criteria', format: 'Multiple' }
              ].map((report) => (
                <div key={report.name} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <FileText className="w-8 h-8 text-blue-400" />
                    <div>
                      <h4 className="font-medium text-white">{report.name}</h4>
                      <p className="text-xs text-slate-400">{report.format} format</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">{report.description}</p>
                  <ParscadeButton size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </ParscadeButton>
                </div>
              ))}
            </div>
          </ParscadeCard>
        </div>
      )}
    </div>
  );
};

export default AuditLogsPage;