/**
 * System Console Page - Enterprise Administration Dashboard
 * Comprehensive system monitoring and administration tools
 */

import { motion } from 'framer-motion';
import {
  Server,
  Activity,
  Database,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Zap,
  Settings,
  Monitor,
  RefreshCw,
  Download,
  Terminal,
  Cloud,
  Lock,
  Eye,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Wifi,
  Globe,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  lastRestart: string;
  version: string;
  services: ServiceStatus[];
}

interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  uptime: string;
  memoryUsage: number;
  cpuUsage: number;
  port?: number;
}

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
}

const SystemConsolePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'monitoring' | 'logs' | 'maintenance'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Mock data - in real app would come from APIs
  const systemHealth: SystemHealth = {
    status: 'healthy',
    uptime: '47 days, 3 hours, 22 minutes',
    lastRestart: '2024-01-05T14:30:00Z',
    version: 'Parscade Enterprise v2.4.1',
    services: [
      { name: 'API Gateway', status: 'running', uptime: '47 days', memoryUsage: 512, cpuUsage: 23, port: 8080 },
      { name: 'Document Processor', status: 'running', uptime: '47 days', memoryUsage: 2048, cpuUsage: 67, port: 8081 },
      { name: 'AI Engine', status: 'running', uptime: '12 hours', memoryUsage: 8192, cpuUsage: 89, port: 8082 },
      { name: 'Database', status: 'running', uptime: '47 days', memoryUsage: 4096, cpuUsage: 34, port: 5432 },
      { name: 'Cache Layer', status: 'running', uptime: '47 days', memoryUsage: 1024, cpuUsage: 12, port: 6379 },
      { name: 'Message Queue', status: 'running', uptime: '47 days', memoryUsage: 256, cpuUsage: 8, port: 5672 },
      { name: 'File Storage', status: 'warning', uptime: '2 hours', memoryUsage: 128, cpuUsage: 3, port: 9000 },
      { name: 'Monitoring', status: 'running', uptime: '47 days', memoryUsage: 64, cpuUsage: 2, port: 3000 },
    ]
  };

  const systemMetrics: SystemMetric[] = [
    { name: 'CPU Usage', value: 67, unit: '%', status: 'warning', trend: 'up', icon: Cpu },
    { name: 'Memory Usage', value: 78, unit: '%', status: 'good', trend: 'stable', icon: MemoryStick },
    { name: 'Disk Usage', value: 45, unit: '%', status: 'good', trend: 'up', icon: HardDrive },
    { name: 'Network I/O', value: 234, unit: 'Mbps', status: 'good', trend: 'up', icon: Network },
    { name: 'Active Connections', value: 1247, unit: 'conns', status: 'good', trend: 'stable', icon: Wifi },
    { name: 'Response Time', value: 89, unit: 'ms', status: 'good', trend: 'down', icon: Clock },
  ];

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastRefresh(new Date());
      // In real app, would trigger data refresh here
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
      case 'good':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'warning':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'critical':
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'stopped':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      default:
        return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'critical':
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-600" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <DashboardLayout
      title="System Console"
      subtitle="Enterprise system monitoring and administration"
      variant="admin"
      backgroundPattern="grid"
      headerVariant="extended"
      showBreadcrumbs={true}
      actions={
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-200/60">
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium">
              Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
            </span>
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center space-x-2 bg-white border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Terminal className="w-4 h-4" />
            <span>Console</span>
          </button>
        </div>
      }
    >
      {/* System Health Overview */}
      <div className="col-span-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`p-6 rounded-2xl border shadow-card ${
            systemHealth.status === 'healthy' ? 'bg-gradient-to-br from-green-50 to-white border-green-200/60' :
            systemHealth.status === 'warning' ? 'bg-gradient-to-br from-amber-50 to-white border-amber-200/60' :
            'bg-gradient-to-br from-red-50 to-white border-red-200/60'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getStatusIcon(systemHealth.status)}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">System Status: {systemHealth.status.charAt(0).toUpperCase() + systemHealth.status.slice(1)}</h2>
                  <p className="text-slate-600">{systemHealth.version}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600">Uptime</div>
                <div className="text-lg font-semibold text-slate-900">{systemHealth.uptime}</div>
                <div className="text-xs text-slate-500">Last restart: {new Date(systemHealth.lastRestart).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* System Metrics Grid */}
      <div className="col-span-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <DashboardSection
            title="System Metrics"
            subtitle={`Real-time performance monitoring • Last updated: ${lastRefresh.toLocaleTimeString()}`}
            className="bg-gradient-to-br from-white to-slate-50/30 border-slate-200/60"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {systemMetrics.map((metric, index) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <metric.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(metric.trend)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(metric.status)}`}>
                        {metric.status}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-1">{metric.name}</h3>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold text-slate-900">
                      {metric.value.toLocaleString()}
                      <span className="text-sm font-normal text-slate-600 ml-1">{metric.unit}</span>
                    </p>
                  </div>
                  {metric.unit === '%' && (
                    <div className="mt-3">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            metric.status === 'good' ? 'bg-green-500' :
                            metric.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${metric.value}%` }}
                        />
                      </div>
                    </div>
                  )}
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
            { id: 'overview', label: 'Overview', icon: Monitor },
            { id: 'services', label: 'Services', icon: Server },
            { id: 'monitoring', label: 'Monitoring', icon: Activity },
            { id: 'logs', label: 'Logs', icon: FileText },
            { id: 'maintenance', label: 'Maintenance', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
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

      {/* Services Status */}
      {activeTab === 'services' && (
        <div className="col-span-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardSection
              title="Service Status"
              subtitle="Monitor all system services and their health"
              className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/60"
            >
              <div className="p-6">
                <div className="space-y-4">
                  {systemHealth.services.map((service, index) => (
                    <motion.div
                      key={service.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-card transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(service.status)}
                        <div>
                          <h3 className="font-semibold text-slate-900">{service.name}</h3>
                          <p className="text-sm text-slate-600">Uptime: {service.uptime}</p>
                          {service.port && (
                            <p className="text-xs text-slate-500">Port: {service.port}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-slate-900">{service.memoryUsage} MB</div>
                          <div className="text-xs text-slate-600">Memory</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-sm font-semibold ${
                            service.cpuUsage > 80 ? 'text-red-600' :
                            service.cpuUsage > 60 ? 'text-amber-600' : 'text-green-600'
                          }`}>
                            {service.cpuUsage}%
                          </div>
                          <div className="text-xs text-slate-600">CPU</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </DashboardSection>
          </motion.div>
        </div>
      )}

      {/* System Overview */}
      {activeTab === 'overview' && (
        <div className="col-span-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DashboardSection
                title="Recent System Events"
                subtitle="Latest system activities and alerts"
                className="bg-gradient-to-br from-white to-purple-50/30 border-purple-200/60"
              >
                <div className="p-6 space-y-4">
                  {[
                    { time: '2 minutes ago', event: 'AI Engine service restarted', type: 'warning' },
                    { time: '15 minutes ago', event: 'Database backup completed', type: 'success' },
                    { time: '1 hour ago', event: 'File Storage service warning cleared', type: 'success' },
                    { time: '2 hours ago', event: 'High CPU usage alert triggered', type: 'warning' },
                    { time: '3 hours ago', event: 'Security scan completed', type: 'success' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-slate-200/60">
                      <div className={`w-2 h-2 mt-2 rounded-full ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-slate-900">{activity.event}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardSection>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DashboardSection
                title="Quick Actions"
                subtitle="Common administrative tasks"
                className="bg-gradient-to-br from-white to-teal-50/30 border-teal-200/60"
              >
                <div className="p-6 space-y-3">
                  {[
                    { icon: RefreshCw, label: 'Restart Services', description: 'Restart all system services' },
                    { icon: Database, label: 'Database Maintenance', description: 'Run database optimization' },
                    { icon: Shield, label: 'Security Scan', description: 'Perform security audit' },
                    { icon: Download, label: 'Export Logs', description: 'Download system logs' },
                    { icon: Cloud, label: 'Backup System', description: 'Create system backup' },
                    { icon: Lock, label: 'Update Certificates', description: 'Renew SSL certificates' },
                  ].map((action, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center space-x-3 p-3 bg-white border border-slate-200/60 rounded-lg hover:shadow-card hover:border-teal-300/60 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                        <action.icon className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-slate-900">{action.label}</p>
                        <p className="text-xs text-slate-600">{action.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </DashboardSection>
            </motion.div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SystemConsolePage;