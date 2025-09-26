import { motion } from 'framer-motion';
import {
  Database,
  Cloud,
  Plug,
  Activity,
  CheckCircle,
  AlertCircle,
  Plus,
  Settings,
  Zap,
  RefreshCw,
  Shield,
  Clock,
  Server,
  Globe,
  Lock,
  TrendingUp
} from 'lucide-react';
import React, { useState } from 'react';

import ParscadeButton from '@/shared/components/brand/ParscadeButton';
import ParscadeCard from '@/shared/components/brand/ParscadeCard';
import ParscadeStatusBadge from '@/shared/components/brand/ParscadeStatusBadge';

interface DataConnector {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'cloud';
  status: 'active' | 'inactive' | 'error';
  provider: string;
  lastSync: string;
  recordsProcessed: number;
  dataTransferred: string;
  latency: number;
}

const DataConnectorsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'connectors' | 'templates' | 'monitoring'>('overview');
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);

  const connectors: DataConnector[] = [
    {
      id: '1',
      name: 'Production Database',
      type: 'database',
      status: 'active',
      provider: 'PostgreSQL',
      lastSync: '2 minutes ago',
      recordsProcessed: 15847,
      dataTransferred: '2.4 GB',
      latency: 45
    },
    {
      id: '2',
      name: 'Salesforce CRM',
      type: 'api',
      status: 'active',
      provider: 'Salesforce',
      lastSync: '5 minutes ago',
      recordsProcessed: 3254,
      dataTransferred: '847 MB',
      latency: 120
    },
    {
      id: '3',
      name: 'AWS S3 Documents',
      type: 'cloud',
      status: 'inactive',
      provider: 'Amazon S3',
      lastSync: '2 hours ago',
      recordsProcessed: 8921,
      dataTransferred: '5.2 GB',
      latency: 200
    },
    {
      id: '4',
      name: 'Excel Imports',
      type: 'file',
      status: 'error',
      provider: 'File System',
      lastSync: 'Failed',
      recordsProcessed: 0,
      dataTransferred: '0 B',
      latency: 0
    }
  ];

  const connectorTemplates = [
    { name: 'MySQL Database', icon: Database, category: 'Database' },
    { name: 'MongoDB Atlas', icon: Database, category: 'Database' },
    { name: 'Google Drive', icon: Cloud, category: 'Cloud Storage' },
    { name: 'Dropbox', icon: Cloud, category: 'Cloud Storage' },
    { name: 'REST API', icon: Globe, category: 'Web Services' },
    { name: 'GraphQL', icon: Zap, category: 'Web Services' },
    { name: 'SharePoint', icon: Server, category: 'Enterprise' },
    { name: 'SAP', icon: Server, category: 'Enterprise' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-500';
      case 'inactive': return 'text-amber-500';
      case 'error': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database': return Database;
      case 'api': return Globe;
      case 'file': return Server;
      case 'cloud': return Cloud;
      default: return Plug;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Data Connectors</h1>
          <p className="text-slate-400 mt-1">Manage enterprise data integrations and real-time synchronization</p>
        </div>
        <ParscadeButton
          variant="primary"
          className="w-fit lg:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Connector
        </ParscadeButton>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'connectors', label: 'Connectors', icon: Database },
          { id: 'templates', label: 'Templates', icon: Plug },
          { id: 'monitoring', label: 'Monitoring', icon: TrendingUp }
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

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <ParscadeCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Connectors</p>
                <p className="text-2xl font-bold text-white mt-1">8</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </ParscadeCard>

          <ParscadeCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Data Processed Today</p>
                <p className="text-2xl font-bold text-white mt-1">24.7 GB</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </ParscadeCard>

          <ParscadeCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Latency</p>
                <p className="text-2xl font-bold text-white mt-1">89ms</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </ParscadeCard>

          <ParscadeCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Sync Errors</p>
                <p className="text-2xl font-bold text-white mt-1">2</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </ParscadeCard>

          {/* Recent Activity */}
          <ParscadeCard className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">Data Flow Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Database className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="font-medium text-white">Production Database</p>
                    <p className="text-sm text-slate-400">PostgreSQL • Last sync: 2 min ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">15,847</p>
                  <p className="text-sm text-emerald-400">+247 records</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Globe className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="font-medium text-white">Salesforce CRM</p>
                    <p className="text-sm text-slate-400">REST API • Last sync: 5 min ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">3,254</p>
                  <p className="text-sm text-blue-400">+89 records</p>
                </div>
              </div>
            </div>
          </ParscadeCard>

          {/* Real-time Monitoring */}
          <ParscadeCard className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">Performance Monitor</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">CPU Usage</span>
                <span className="text-sm font-medium text-white">34%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '34%' }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Memory Usage</span>
                <span className="text-sm font-medium text-white">67%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-emerald-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '67%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Network I/O</span>
                <span className="text-sm font-medium text-white">28%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '28%' }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
            </div>
          </ParscadeCard>
        </div>
      )}

      {activeTab === 'connectors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {connectors.map((connector) => {
              const TypeIcon = getTypeIcon(connector.type);
              return (
                <motion.div
                  key={connector.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ParscadeCard className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                          <TypeIcon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{connector.name}</h3>
                          <p className="text-sm text-slate-400">{connector.provider} • {connector.lastSync}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <ParscadeStatusBadge status={connector.status} />
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 mt-4 pt-4 border-t border-slate-700/50">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Records Processed</p>
                        <p className="text-lg font-bold text-white mt-1">{connector.recordsProcessed.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Data Transferred</p>
                        <p className="text-lg font-bold text-white mt-1">{connector.dataTransferred}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Avg Latency</p>
                        <p className="text-lg font-bold text-white mt-1">{connector.latency}ms</p>
                      </div>
                    </div>
                  </ParscadeCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Connector Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {connectorTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <motion.div
                    key={template.name}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-blue-500/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{template.name}</p>
                        <p className="text-xs text-slate-400">{template.category}</p>
                      </div>
                    </div>
                    <ParscadeButton variant="outline" size="sm" className="w-full">
                      Configure
                    </ParscadeButton>
                  </motion.div>
                );
              })}
            </div>
          </ParscadeCard>
        </div>
      )}

      {activeTab === 'monitoring' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span className="text-white">Security Status</span>
                </div>
                <ParscadeStatusBadge status="active" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <span className="text-white">Connection Pool</span>
                </div>
                <span className="text-white font-medium">87% utilized</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span className="text-white">Queue Status</span>
                </div>
                <span className="text-white font-medium">12 pending</span>
              </div>
            </div>
          </ParscadeCard>

          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Error Analysis</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">Excel Import Failed</p>
                    <p className="text-xs text-slate-400 mt-1">Connection timeout after 30 seconds</p>
                    <p className="text-xs text-slate-500 mt-1">2 minutes ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">Rate Limit Warning</p>
                    <p className="text-xs text-slate-400 mt-1">Salesforce API approaching daily limit</p>
                    <p className="text-xs text-slate-500 mt-1">15 minutes ago</p>
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

export default DataConnectorsPage;