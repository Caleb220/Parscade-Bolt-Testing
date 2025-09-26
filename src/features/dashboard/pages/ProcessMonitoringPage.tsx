import { motion } from 'framer-motion';
import {
  Activity,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Users,
  Server,
  Database,
  Filter,
  Search,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Settings,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Cpu,
  HardDrive,
  Network,
  MemoryStick,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import React, { useState } from 'react';

import ParscadeButton from '@/shared/components/brand/ParscadeButton';
import ParscadeCard from '@/shared/components/brand/ParscadeCard';
import ParscadeStatusBadge from '@/shared/components/brand/ParscadeStatusBadge';

interface ProcessInstance {
  id: string;
  processName: string;
  workflow: string;
  status: 'running' | 'completed' | 'failed' | 'paused' | 'waiting';
  startTime: string;
  duration: string;
  progress: number;
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  stepsCurrent: number;
  stepsTotal: number;
  lastActivity: string;
}

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
}

const ProcessMonitoringPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'processes' | 'system' | 'analytics' | 'alerts'>('processes');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const processInstances: ProcessInstance[] = [
    {
      id: '1',
      processName: 'Invoice Processing - ABC Corp',
      workflow: 'Invoice Approval Workflow',
      status: 'running',
      startTime: '2024-01-24 14:30:00',
      duration: '00:45:32',
      progress: 67,
      assignee: 'Sarah Johnson',
      priority: 'high',
      tags: ['Finance', 'Automated'],
      stepsCurrent: 4,
      stepsTotal: 6,
      lastActivity: '2 minutes ago'
    },
    {
      id: '2',
      processName: 'Employee Onboarding - John Doe',
      workflow: 'HR Onboarding Workflow',
      status: 'waiting',
      startTime: '2024-01-24 13:15:00',
      duration: '02:00:15',
      progress: 33,
      assignee: 'Mike Chen',
      priority: 'medium',
      tags: ['HR', 'Manual Review'],
      stepsCurrent: 2,
      stepsTotal: 6,
      lastActivity: '15 minutes ago'
    },
    {
      id: '3',
      processName: 'Contract Renewal - TechCorp',
      workflow: 'Contract Management Workflow',
      status: 'completed',
      startTime: '2024-01-24 10:00:00',
      duration: '04:30:22',
      progress: 100,
      assignee: 'Lisa Rodriguez',
      priority: 'low',
      tags: ['Legal', 'Contracts'],
      stepsCurrent: 5,
      stepsTotal: 5,
      lastActivity: '1 hour ago'
    },
    {
      id: '4',
      processName: 'Quality Review - Document Batch',
      workflow: 'Quality Control Workflow',
      status: 'failed',
      startTime: '2024-01-24 12:45:00',
      duration: '01:15:08',
      progress: 60,
      assignee: 'David Kim',
      priority: 'urgent',
      tags: ['Quality', 'Error'],
      stepsCurrent: 3,
      stepsTotal: 5,
      lastActivity: '5 minutes ago'
    },
    {
      id: '5',
      processName: 'Budget Approval - Q2 Marketing',
      workflow: 'Budget Approval Workflow',
      status: 'paused',
      startTime: '2024-01-24 11:30:00',
      duration: '03:15:45',
      progress: 80,
      assignee: 'Jennifer Adams',
      priority: 'high',
      tags: ['Finance', 'Approval'],
      stepsCurrent: 4,
      stepsTotal: 5,
      lastActivity: '30 minutes ago'
    }
  ];

  const systemMetrics: SystemMetric[] = [
    {
      name: 'CPU Usage',
      value: 45,
      unit: '%',
      status: 'healthy',
      trend: 'stable',
      icon: Cpu
    },
    {
      name: 'Memory Usage',
      value: 68,
      unit: '%',
      status: 'warning',
      trend: 'up',
      icon: MemoryStick
    },
    {
      name: 'Disk Usage',
      value: 82,
      unit: '%',
      status: 'critical',
      trend: 'up',
      icon: HardDrive
    },
    {
      name: 'Network I/O',
      value: 34,
      unit: 'Mbps',
      status: 'healthy',
      trend: 'down',
      icon: Network
    },
    {
      name: 'Active Processes',
      value: 24,
      unit: 'processes',
      status: 'healthy',
      trend: 'stable',
      icon: Activity
    },
    {
      name: 'Queue Length',
      value: 8,
      unit: 'items',
      status: 'warning',
      trend: 'up',
      icon: Clock
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-emerald-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return ArrowUp;
      case 'down': return ArrowDown;
      case 'stable': return TrendingUp;
      default: return TrendingUp;
    }
  };

  const filteredProcesses = processInstances.filter(process => {
    const matchesSearch = process.processName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         process.workflow.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         process.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || process.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Process Monitoring</h1>
          <p className="text-slate-400 mt-1">Monitor workflow execution and system performance in real-time</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <ParscadeButton variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </ParscadeButton>
          <ParscadeButton variant="primary">
            <Monitor className="w-4 h-4 mr-2" />
            Real-time View
          </ParscadeButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        {[
          { id: 'processes', label: 'Active Processes', icon: Activity },
          { id: 'system', label: 'System Health', icon: Server },
          { id: 'analytics', label: 'Performance', icon: BarChart3 },
          { id: 'alerts', label: 'Alerts & Issues', icon: AlertTriangle }
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

      {/* Overview Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Running</p>
              <p className="text-2xl font-bold text-white mt-1">8</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Waiting</p>
              <p className="text-2xl font-bold text-white mt-1">3</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Completed</p>
              <p className="text-2xl font-bold text-white mt-1">156</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Failed</p>
              <p className="text-2xl font-bold text-white mt-1">4</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Avg Duration</p>
              <p className="text-2xl font-bold text-white mt-1">2.4h</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </ParscadeCard>
      </div>

      {activeTab === 'processes' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search processes..."
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
              <option value="running">Running</option>
              <option value="waiting">Waiting</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Process List */}
          <div className="space-y-4">
            {filteredProcesses.map((process) => (
              <motion.div
                key={process.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ParscadeCard className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{process.processName}</h3>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(process.priority)}`}>
                          {process.priority.toUpperCase()}
                        </span>
                        <ParscadeStatusBadge status={process.status} />
                      </div>
                      <p className="text-slate-400 mb-3">{process.workflow}</p>
                      <div className="flex items-center space-x-6 text-sm text-slate-400">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{process.assignee}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>Duration: {process.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4" />
                          <span>Step {process.stepsCurrent} of {process.stepsTotal}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>{process.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      {process.status === 'running' ? (
                        <button className="p-2 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors">
                          <Pause className="w-4 h-4" />
                        </button>
                      ) : process.status === 'paused' ? (
                        <button className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors">
                          <Play className="w-4 h-4" />
                        </button>
                      ) : process.status === 'failed' ? (
                        <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white font-medium">{process.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          process.status === 'completed' ? 'bg-emerald-500' :
                          process.status === 'failed' ? 'bg-red-500' :
                          process.status === 'paused' ? 'bg-amber-500' :
                          'bg-blue-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${process.progress}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {process.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500">
                      Started: {process.startTime}
                    </div>
                  </div>
                </ParscadeCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemMetrics.map((metric) => {
              const Icon = metric.icon;
              const TrendIcon = getTrendIcon(metric.trend);
              const statusColor = getMetricStatusColor(metric.status);

              return (
                <ParscadeCard key={metric.name} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${metric.status === 'critical' ? 'bg-red-500/20' : metric.status === 'warning' ? 'bg-yellow-500/20' : 'bg-emerald-500/20'} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${statusColor}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{metric.name}</h3>
                        <p className="text-sm text-slate-400 capitalize">{metric.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendIcon className={`w-4 h-4 ${
                        metric.trend === 'up' && metric.status === 'critical' ? 'text-red-400' :
                        metric.trend === 'up' ? 'text-emerald-400' :
                        metric.trend === 'down' && metric.status === 'healthy' ? 'text-emerald-400' :
                        'text-slate-400'
                      }`} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold text-white">{metric.value}</span>
                      <span className="text-sm text-slate-400">{metric.unit}</span>
                    </div>
                  </div>

                  {metric.unit === '%' && (
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          metric.status === 'critical' ? 'bg-red-500' :
                          metric.status === 'warning' ? 'bg-yellow-500' :
                          'bg-emerald-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  )}
                </ParscadeCard>
              );
            })}
          </div>

          {/* System Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ParscadeCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Resource Utilization Trends</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">CPU Load (24h avg)</span>
                  <span className="text-sm font-medium text-white">42%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    className="bg-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '42%' }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Memory Load (24h avg)</span>
                  <span className="text-sm font-medium text-white">65%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    className="bg-yellow-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Network Load (24h avg)</span>
                  <span className="text-sm font-medium text-white">28%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    className="bg-emerald-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '28%' }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Process Queue Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">High Priority Queue</p>
                    <p className="text-xs text-slate-400">Urgent and high priority processes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-400">3</p>
                    <p className="text-xs text-slate-400">items</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">Normal Queue</p>
                    <p className="text-xs text-slate-400">Standard processing queue</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-400">12</p>
                    <p className="text-xs text-slate-400">items</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">Background Queue</p>
                    <p className="text-xs text-slate-400">Low priority and batch processes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">7</p>
                    <p className="text-xs text-slate-400">items</p>
                  </div>
                </div>
              </div>
            </ParscadeCard>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Avg Completion Time</span>
                <span className="text-sm font-medium text-white">2.4 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Success Rate (24h)</span>
                <span className="text-sm font-medium text-emerald-400">94.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Processes/Hour</span>
                <span className="text-sm font-medium text-white">8.7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Error Rate</span>
                <span className="text-sm font-medium text-red-400">5.8%</span>
              </div>
            </div>
          </ParscadeCard>

          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Workflows</h3>
            <div className="space-y-3">
              {[
                { name: 'Invoice Processing', count: 47, success: 98 },
                { name: 'Document Review', count: 32, success: 92 },
                { name: 'Approval Workflow', count: 28, success: 89 },
                { name: 'Quality Control', count: 21, success: 95 }
              ].map((workflow, index) => (
                <div key={workflow.name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">{workflow.name}</p>
                    <p className="text-xs text-slate-400">{workflow.success}% success rate</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{workflow.count}</p>
                    <p className="text-xs text-slate-400">executions</p>
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
            <h3 className="text-lg font-semibold text-white mb-4">Active Alerts</h3>
            <div className="space-y-3">
              {[
                {
                  type: 'critical',
                  title: 'High Memory Usage',
                  description: 'System memory usage exceeded 80% threshold',
                  time: '5 minutes ago',
                  icon: AlertTriangle
                },
                {
                  type: 'warning',
                  title: 'Process Queue Backlog',
                  description: 'High priority queue has 8+ items waiting',
                  time: '12 minutes ago',
                  icon: Clock
                },
                {
                  type: 'info',
                  title: 'Scheduled Maintenance',
                  description: 'System maintenance scheduled for tonight at 2:00 AM',
                  time: '1 hour ago',
                  icon: Settings
                },
                {
                  type: 'warning',
                  title: 'Failed Process Recovery',
                  description: 'Invoice processing workflow failed and requires manual intervention',
                  time: '2 hours ago',
                  icon: RotateCcw
                }
              ].map((alert, index) => {
                const Icon = alert.icon;
                return (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'critical' ? 'bg-red-500/10 border-red-500' :
                    alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500' :
                    'bg-blue-500/10 border-blue-500'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <Icon className={`w-5 h-5 mt-0.5 ${
                        alert.type === 'critical' ? 'text-red-400' :
                        alert.type === 'warning' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-white">{alert.title}</p>
                        <p className="text-sm text-slate-300 mt-1">{alert.description}</p>
                        <p className="text-xs text-slate-500 mt-2">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ParscadeCard>
        </div>
      )}
    </div>
  );
};

export default ProcessMonitoringPage;