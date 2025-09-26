/**
 * API Management Page - Enterprise API Control Center
 * Comprehensive API management with rate limiting, analytics, and monitoring
 */

import { motion } from 'framer-motion';
import {
  Code,
  Key,
  Activity,
  Shield,
  Globe,
  Zap,
  Users,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Download,
  Search,
  Filter,
  Calendar,
  Clock,
  TrendingUp,
  Server,
} from 'lucide-react';
import React, { useState } from 'react';

import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: 'active' | 'inactive' | 'revoked';
  usage: number;
  limit: number;
  created: string;
  lastUsed: string;
  permissions: string[];
}

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  status: 'active' | 'deprecated' | 'beta';
  requests: number;
  avgResponseTime: number;
  errorRate: number;
  lastDeployed: string;
}

const ApiManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'keys' | 'endpoints' | 'analytics' | 'settings'>('keys');
  const [showKeyValue, setShowKeyValue] = useState<string | null>(null);

  // Mock data
  const apiKeys: ApiKey[] = [
    {
      id: 'key-1',
      name: 'Production API Key',
      key: 'pk_live_51HabcdEFGhIJKlmnoPqrStuvWxYZ1234567890abcdefghijklmnopqrstuvwxyz',
      status: 'active',
      usage: 45230,
      limit: 100000,
      created: '2024-01-15',
      lastUsed: '2024-02-20T14:30:00Z',
      permissions: ['read:documents', 'write:documents', 'read:analytics'],
    },
    {
      id: 'key-2',
      name: 'Development Key',
      key: 'pk_test_51HabcdEFGhIJKlmnoPqrStuvWxYZ1234567890abcdefghijklmnopqrstuvwxyz',
      status: 'active',
      usage: 12450,
      limit: 50000,
      created: '2024-01-20',
      lastUsed: '2024-02-20T12:15:00Z',
      permissions: ['read:documents', 'read:analytics'],
    },
    {
      id: 'key-3',
      name: 'Legacy Integration',
      key: 'pk_live_51HabcdEFGhIJKlmnoPqrStuvWxYZ1234567890abcdefghijklmnopqrstuvwxyz',
      status: 'revoked',
      usage: 8930,
      limit: 25000,
      created: '2023-12-10',
      lastUsed: '2024-01-15T09:45:00Z',
      permissions: ['read:documents'],
    },
  ];

  const apiEndpoints: ApiEndpoint[] = [
    {
      id: 'ep-1',
      method: 'POST',
      path: '/v1/documents/upload',
      description: 'Upload and process documents',
      status: 'active',
      requests: 23450,
      avgResponseTime: 245,
      errorRate: 0.12,
      lastDeployed: '2024-02-15',
    },
    {
      id: 'ep-2',
      method: 'GET',
      path: '/v1/documents/{id}',
      description: 'Retrieve document details',
      status: 'active',
      requests: 45670,
      avgResponseTime: 89,
      errorRate: 0.03,
      lastDeployed: '2024-02-15',
    },
    {
      id: 'ep-3',
      method: 'GET',
      path: '/v1/analytics/insights',
      description: 'Get analytics insights',
      status: 'beta',
      requests: 3420,
      avgResponseTime: 156,
      errorRate: 0.08,
      lastDeployed: '2024-02-18',
    },
    {
      id: 'ep-4',
      method: 'DELETE',
      path: '/v1/documents/{id}',
      description: 'Delete document',
      status: 'deprecated',
      requests: 890,
      avgResponseTime: 234,
      errorRate: 0.02,
      lastDeployed: '2024-01-20',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'inactive':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'revoked':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'deprecated':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'beta':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'POST':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'PUT':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'DELETE':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'PATCH':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const formatKey = (key: string) => {
    const visible = key.slice(0, 12);
    const hidden = '•'.repeat(20);
    return `${visible}${hidden}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could show toast notification here
  };

  return (
    <DashboardLayout
      title="API Management"
      subtitle="Manage API keys, endpoints, and monitor usage analytics"
      variant="integrations"
      backgroundPattern="subtle"
      headerVariant="extended"
      showBreadcrumbs={true}
      actions={
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New API Key</span>
          </button>
        </div>
      }
    >
      {/* API Overview Stats */}
      <div className="col-span-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardSection
            title="API Overview"
            subtitle="Current API usage and performance metrics"
            className="bg-gradient-to-br from-white to-slate-50/30 border-slate-200/60"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              {[
                { icon: Activity, label: 'Total Requests', value: '2.4M', change: '+12%', color: 'blue' },
                { icon: Zap, label: 'Avg Response Time', value: '124ms', change: '-8%', color: 'green' },
                { icon: Shield, label: 'Success Rate', value: '99.7%', change: '+0.2%', color: 'green' },
                { icon: Users, label: 'Active Keys', value: '23', change: '+3', color: 'purple' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      stat.color === 'green' ? 'bg-green-100 text-green-600' :
                      stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' :
                      stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-slate-600 mb-1">{stat.label}</h3>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </DashboardSection>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="col-span-12 mb-6">
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
          {[
            { id: 'keys', label: 'API Keys', icon: Key },
            { id: 'endpoints', label: 'Endpoints', icon: Server },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {selectedTab === 'keys' && (
        <div className="col-span-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardSection
              title="API Keys"
              subtitle="Manage and monitor API key usage"
              className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/60"
            >
              <div className="p-6">
                {/* Search and Filters */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search API keys..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="flex items-center space-x-2 border border-slate-300 px-3 py-2 rounded-lg hover:bg-slate-50">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>

                {/* API Keys List */}
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-card transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-slate-900">{key.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(key.status)}`}>
                              {key.status}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 mb-3">
                            <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">
                              {showKeyValue === key.id ? key.key : formatKey(key.key)}
                            </code>
                            <button
                              onClick={() => setShowKeyValue(showKeyValue === key.id ? null : key.id)}
                              className="p-1 hover:bg-slate-100 rounded"
                            >
                              {showKeyValue === key.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(key.key)}
                              className="p-1 hover:bg-slate-100 rounded"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center space-x-6 text-sm text-slate-600">
                            <span>Usage: {key.usage.toLocaleString()}/{key.limit.toLocaleString()}</span>
                            <span>Created: {new Date(key.created).toLocaleDateString()}</span>
                            <span>Last used: {new Date(key.lastUsed).toLocaleDateString()}</span>
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-slate-600">Usage this month</span>
                              <span className="text-slate-900 font-medium">
                                {((key.usage / key.limit) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  (key.usage / key.limit) > 0.9 ? 'bg-red-500' :
                                  (key.usage / key.limit) > 0.7 ? 'bg-amber-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${(key.usage / key.limit) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-1">
                            {key.permissions.map((permission) => (
                              <span
                                key={permission}
                                className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs"
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 hover:bg-slate-100 rounded">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-red-50 text-red-600 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DashboardSection>
          </motion.div>
        </div>
      )}

      {selectedTab === 'endpoints' && (
        <div className="col-span-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardSection
              title="API Endpoints"
              subtitle="Monitor endpoint performance and status"
              className="bg-gradient-to-br from-white to-green-50/30 border-green-200/60"
            >
              <div className="p-6">
                <div className="space-y-4">
                  {apiEndpoints.map((endpoint) => (
                    <div key={endpoint.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-card transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded text-sm font-semibold border ${getMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                          </span>
                          <code className="text-slate-800 font-mono">{endpoint.path}</code>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(endpoint.status)}`}>
                            {endpoint.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-slate-900">{endpoint.requests.toLocaleString()}</div>
                            <div className="text-slate-600">requests</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-slate-900">{endpoint.avgResponseTime}ms</div>
                            <div className="text-slate-600">avg time</div>
                          </div>
                          <div className="text-center">
                            <div className={`font-semibold ${endpoint.errorRate < 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                              {endpoint.errorRate}%
                            </div>
                            <div className="text-slate-600">error rate</div>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-600 mt-2">{endpoint.description}</p>
                      <p className="text-sm text-slate-500 mt-2">
                        Last deployed: {new Date(endpoint.lastDeployed).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </DashboardSection>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ApiManagementPage;