import { motion } from 'framer-motion';
import {
  Monitor,
  Server,
  Activity,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  RefreshCw,
  Eye,
  Download,
  Globe,
  Database,
  Shield,
  Cloud,
  Wifi,
  Battery,
  Thermometer,
  Users,
  FileText,
  Archive,
  PlayCircle,
  StopCircle,
  RotateCcw
} from 'lucide-react';
import React, { useState } from 'react';

import ParscadeButton from '@/shared/components/brand/ParscadeButton';
import ParscadeCard from '@/shared/components/brand/ParscadeCard';
import ParscadeStatusBadge from '@/shared/components/brand/ParscadeStatusBadge';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface ServiceStatus {
  id: string;
  name: string;
  type: 'application' | 'database' | 'cache' | 'queue' | 'api' | 'storage';
  status: 'running' | 'stopped' | 'error' | 'maintenance';
  uptime: string;
  responseTime: number;
  version: string;
  host: string;
  port: number;
  healthCheck: string;
  dependencies: string[];
}

interface ServerNode {
  id: string;
  name: string;
  role: 'web' | 'database' | 'cache' | 'worker' | 'load_balancer';
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  location: string;
  ipAddress: string;
  lastSeen: string;
}

interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  source: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

const SystemMonitoringPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'servers' | 'alerts' | 'logs'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const systemMetrics: SystemMetric[] = [
    {
      id: 'cpu',
      name: 'CPU Usage',
      value: 42,
      unit: '%',
      threshold: 80,
      status: 'healthy',
      trend: 'stable',
      lastUpdated: '2024-01-24 15:45:00'
    },
    {
      id: 'memory',
      name: 'Memory Usage',
      value: 68,
      unit: '%',
      threshold: 85,
      status: 'warning',
      trend: 'up',
      lastUpdated: '2024-01-24 15:45:00'
    },
    {
      id: 'disk',
      name: 'Disk Usage',
      value: 34,
      unit: '%',
      threshold: 90,
      status: 'healthy',
      trend: 'stable',
      lastUpdated: '2024-01-24 15:45:00'
    },
    {
      id: 'network',
      name: 'Network I/O',
      value: 156,
      unit: 'Mbps',
      threshold: 1000,
      status: 'healthy',
      trend: 'down',
      lastUpdated: '2024-01-24 15:45:00'
    },
    {
      id: 'connections',
      name: 'Active Connections',
      value: 1247,
      unit: 'connections',
      threshold: 5000,
      status: 'healthy',
      trend: 'up',
      lastUpdated: '2024-01-24 15:45:00'
    },
    {
      id: 'requests',
      name: 'Requests/sec',
      value: 89,
      unit: 'req/s',
      threshold: 1000,
      status: 'healthy',
      trend: 'stable',
      lastUpdated: '2024-01-24 15:45:00'
    }
  ];

  const services: ServiceStatus[] = [
    {
      id: 'svc_001',
      name: 'Web Application',
      type: 'application',
      status: 'running',
      uptime: '15 days, 8 hours',
      responseTime: 245,
      version: '2.1.4',
      host: 'web-01.internal',
      port: 8080,
      healthCheck: '/health',
      dependencies: ['Database', 'Redis Cache', 'File Storage']
    },
    {
      id: 'svc_002',
      name: 'PostgreSQL Database',
      type: 'database',
      status: 'running',
      uptime: '32 days, 14 hours',
      responseTime: 12,
      version: '14.9',
      host: 'db-01.internal',
      port: 5432,
      healthCheck: 'SELECT 1',
      dependencies: []
    },
    {
      id: 'svc_003',
      name: 'Redis Cache',
      type: 'cache',
      status: 'running',
      uptime: '8 days, 3 hours',
      responseTime: 5,
      version: '7.0.5',
      host: 'cache-01.internal',
      port: 6379,
      healthCheck: 'PING',
      dependencies: []
    },
    {
      id: 'svc_004',
      name: 'Background Worker',
      type: 'queue',
      status: 'error',
      uptime: '0 days, 0 hours',
      responseTime: 0,
      version: '1.8.2',
      host: 'worker-01.internal',
      port: 9000,
      healthCheck: '/status',
      dependencies: ['Database', 'Redis Cache']
    },
    {
      id: 'svc_005',
      name: 'API Gateway',
      type: 'api',
      status: 'running',
      uptime: '12 days, 21 hours',
      responseTime: 89,
      version: '3.4.1',
      host: 'api-01.internal',
      port: 443,
      healthCheck: '/api/health',
      dependencies: ['Web Application']
    },
    {
      id: 'svc_006',
      name: 'File Storage',
      type: 'storage',
      status: 'maintenance',
      uptime: '0 days, 0 hours',
      responseTime: 0,
      version: '5.2.0',
      host: 'storage-01.internal',
      port: 9090,
      healthCheck: '/storage/health',
      dependencies: []
    }
  ];

  const servers: ServerNode[] = [
    {
      id: 'srv_001',
      name: 'web-01.internal',
      role: 'web',
      status: 'online',
      cpu: 45,
      memory: 62,
      disk: 78,
      network: 234,
      location: 'US-East-1',
      ipAddress: '10.0.1.10',
      lastSeen: '2024-01-24 15:45:00'
    },
    {
      id: 'srv_002',
      name: 'db-01.internal',
      role: 'database',
      status: 'online',
      cpu: 72,
      memory: 84,
      disk: 45,
      network: 89,
      location: 'US-East-1',
      ipAddress: '10.0.2.10',
      lastSeen: '2024-01-24 15:45:00'
    },
    {
      id: 'srv_003',
      name: 'cache-01.internal',
      role: 'cache',
      status: 'online',
      cpu: 28,
      memory: 45,
      disk: 12,
      network: 156,
      location: 'US-East-1',
      ipAddress: '10.0.3.10',
      lastSeen: '2024-01-24 15:45:00'
    },
    {
      id: 'srv_004',
      name: 'worker-01.internal',
      role: 'worker',
      status: 'degraded',
      cpu: 95,
      memory: 91,
      disk: 67,
      network: 45,
      location: 'US-East-1',
      ipAddress: '10.0.4.10',
      lastSeen: '2024-01-24 15:44:30'
    },
    {
      id: 'srv_005',
      name: 'lb-01.internal',
      role: 'load_balancer',
      status: 'online',
      cpu: 34,
      memory: 56,
      disk: 23,
      network: 567,
      location: 'US-East-1',
      ipAddress: '10.0.5.10',
      lastSeen: '2024-01-24 15:45:00'
    }
  ];

  const alerts: Alert[] = [
    {
      id: 'alert_001',
      severity: 'critical',
      title: 'Background Worker Service Down',
      description: 'Background worker service has stopped responding and requires immediate attention',
      source: 'worker-01.internal',
      timestamp: '2024-01-24 15:30:00',
      status: 'active'
    },
    {
      id: 'alert_002',
      severity: 'high',
      title: 'Database Server High CPU Usage',
      description: 'Database server CPU usage has exceeded 80% for more than 5 minutes',
      source: 'db-01.internal',
      timestamp: '2024-01-24 15:25:00',
      status: 'acknowledged'
    },
    {
      id: 'alert_003',
      severity: 'medium',
      title: 'Memory Usage Warning',
      description: 'System memory usage is approaching the warning threshold of 85%',
      source: 'web-01.internal',
      timestamp: '2024-01-24 15:20:00',
      status: 'active'
    },
    {
      id: 'alert_004',
      severity: 'low',
      title: 'Scheduled Maintenance Reminder',
      description: 'File storage service scheduled for maintenance at 2:00 AM tonight',
      source: 'storage-01.internal',
      timestamp: '2024-01-24 14:00:00',
      status: 'acknowledged'
    }
  ];

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-emerald-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case 'application': return Monitor;
      case 'database': return Database;
      case 'cache': return Zap;
      case 'queue': return Archive;
      case 'api': return Globe;
      case 'storage': return HardDrive;
      default: return Server;
    }
  };

  const getServerRoleIcon = (role: string) => {
    switch (role) {
      case 'web': return Monitor;
      case 'database': return Database;
      case 'cache': return Zap;
      case 'worker': return Cpu;
      case 'load_balancer': return Network;
      default: return Server;
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">System Monitoring</h1>
          <p className="text-slate-400 mt-1">Monitor system health, services, and infrastructure performance</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-300">Auto-refresh</span>
          </label>
          <ParscadeButton variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </ParscadeButton>
          <ParscadeButton variant="primary">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </ParscadeButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'services', label: 'Services', icon: Server },
          { id: 'servers', label: 'Infrastructure', icon: Monitor },
          { id: 'alerts', label: 'Alerts', icon: AlertTriangle, count: alerts.filter(a => a.status === 'active').length },
          { id: 'logs', label: 'System Logs', icon: FileText }
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
            {count !== undefined && count > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ParscadeCard className="p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4">System Performance</h3>
              <div className="grid grid-cols-2 gap-6">
                {systemMetrics.slice(0, 4).map((metric) => (
                  <div key={metric.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">{metric.name}</span>
                      <span className={`text-sm font-medium ${getMetricStatusColor(metric.status)}`}>
                        {metric.value}{metric.unit}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          metric.status === 'healthy' ? 'bg-emerald-500' :
                          metric.status === 'warning' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{
                          width: metric.unit === '%' ? `${metric.value}%` :
                                 metric.unit === 'Mbps' ? `${Math.min((metric.value / metric.threshold) * 100, 100)}%` :
                                 `${Math.min((metric.value / metric.threshold) * 100, 100)}%`
                        }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">0</span>
                      <span className="text-slate-500">{metric.threshold}{metric.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Services Running</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-emerald-400">
                      {services.filter(s => s.status === 'running').length}
                    </span>
                    <span className="text-sm text-slate-400">/ {services.length}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Servers Online</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-emerald-400">
                      {servers.filter(s => s.status === 'online').length}
                    </span>
                    <span className="text-sm text-slate-400">/ {servers.length}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Active Alerts</span>
                  <span className="text-lg font-bold text-red-400">
                    {alerts.filter(a => a.status === 'active').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Avg Response Time</span>
                  <span className="text-lg font-bold text-white">89ms</span>
                </div>
              </div>
            </ParscadeCard>
          </div>

          {/* Service Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ParscadeCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Service Health</h3>
              <div className="space-y-3">
                {services.map((service) => {
                  const Icon = getServiceTypeIcon(service.type);
                  return (
                    <div key={service.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${
                          service.status === 'running' ? 'text-emerald-400' :
                          service.status === 'error' ? 'text-red-400' :
                          service.status === 'maintenance' ? 'text-yellow-400' :
                          'text-slate-400'
                        }`} />
                        <div>
                          <p className="font-medium text-white">{service.name}</p>
                          <p className="text-xs text-slate-400">
                            {service.host}:{service.port} • {service.version}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-slate-400">{service.responseTime}ms</span>
                        <ParscadeStatusBadge status={service.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <h3 className="text-lg font-semibent text-white mb-4">Recent Alerts</h3>
              <div className="space-y-3">
                {alerts.slice(0, 4).map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-4 h-4 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-xs opacity-75 mt-1">{alert.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-60">{alert.source}</span>
                          <span className="text-xs opacity-60">{alert.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ParscadeCard>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-4">
          {services.map((service) => {
            const Icon = getServiceTypeIcon(service.type);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ParscadeCard className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        service.status === 'running' ? 'bg-emerald-500/20' :
                        service.status === 'error' ? 'bg-red-500/20' :
                        service.status === 'maintenance' ? 'bg-yellow-500/20' :
                        'bg-slate-500/20'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          service.status === 'running' ? 'text-emerald-400' :
                          service.status === 'error' ? 'text-red-400' :
                          service.status === 'maintenance' ? 'text-yellow-400' :
                          'text-slate-400'
                        }`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                          <ParscadeStatusBadge status={service.status} />
                          <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md">
                            {service.type.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Host</p>
                            <p className="text-white text-sm">{service.host}:{service.port}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Version</p>
                            <p className="text-white text-sm">{service.version}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Uptime</p>
                            <p className="text-white text-sm">{service.uptime}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Response Time</p>
                            <p className="text-white text-sm">{service.responseTime}ms</p>
                          </div>
                        </div>

                        {service.dependencies.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Dependencies</p>
                            <div className="flex flex-wrap gap-2">
                              {service.dependencies.map((dep) => (
                                <span key={dep} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md">
                                  {dep}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-400">Health: {service.healthCheck}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                      {service.status === 'running' ? (
                        <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                          <StopCircle className="w-4 h-4" />
                        </button>
                      ) : service.status === 'stopped' || service.status === 'error' ? (
                        <button className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors">
                          <PlayCircle className="w-4 h-4" />
                        </button>
                      ) : null}
                      {service.status === 'error' && (
                        <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </ParscadeCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {activeTab === 'servers' && (
        <div className="space-y-4">
          {servers.map((server) => {
            const Icon = getServerRoleIcon(server.role);
            return (
              <motion.div
                key={server.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ParscadeCard className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        server.status === 'online' ? 'bg-emerald-500/20' :
                        server.status === 'degraded' ? 'bg-yellow-500/20' :
                        server.status === 'offline' ? 'bg-red-500/20' :
                        'bg-slate-500/20'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          server.status === 'online' ? 'text-emerald-400' :
                          server.status === 'degraded' ? 'text-yellow-400' :
                          server.status === 'offline' ? 'text-red-400' :
                          'text-slate-400'
                        }`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-white">{server.name}</h3>
                          <ParscadeStatusBadge status={server.status} />
                          <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md">
                            {server.role.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">CPU Usage</p>
                            <div className="flex items-center space-x-2">
                              <p className={`text-sm font-medium ${
                                server.cpu > 80 ? 'text-red-400' :
                                server.cpu > 60 ? 'text-yellow-400' : 'text-emerald-400'
                              }`}>
                                {server.cpu}%
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Memory</p>
                            <p className={`text-sm font-medium ${
                              server.memory > 80 ? 'text-red-400' :
                              server.memory > 60 ? 'text-yellow-400' : 'text-emerald-400'
                            }`}>
                              {server.memory}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Disk Usage</p>
                            <p className={`text-sm font-medium ${
                              server.disk > 80 ? 'text-red-400' :
                              server.disk > 60 ? 'text-yellow-400' : 'text-emerald-400'
                            }`}>
                              {server.disk}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Network</p>
                            <p className="text-white text-sm">{server.network} Mbps</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-400">{server.ipAddress}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Cloud className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-400">{server.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-400">Last seen: {server.lastSeen}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </ParscadeCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ParscadeCard className={`p-6 border ${getAlertSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <AlertTriangle className="w-6 h-6 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          alert.severity === 'critical' ? 'bg-red-500/30 text-red-300' :
                          alert.severity === 'high' ? 'bg-orange-500/30 text-orange-300' :
                          alert.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                          'bg-blue-500/30 text-blue-300'
                        }`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <ParscadeStatusBadge status={alert.status} />
                      </div>
                      <p className="text-slate-300 mb-3">{alert.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Server className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400">{alert.source}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400">{alert.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {alert.status === 'active' && (
                      <ParscadeButton size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Acknowledge
                      </ParscadeButton>
                    )}
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </ParscadeCard>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Logs</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="p-2 bg-slate-800/50 rounded text-slate-300">
                <span className="text-slate-500">[2024-01-24 15:45:00]</span> INFO: System health check completed successfully
              </div>
              <div className="p-2 bg-slate-800/50 rounded text-slate-300">
                <span className="text-slate-500">[2024-01-24 15:44:30]</span> WARN: High CPU usage detected on worker-01.internal (95%)
              </div>
              <div className="p-2 bg-red-500/10 rounded text-red-300">
                <span className="text-slate-500">[2024-01-24 15:30:00]</span> ERROR: Background worker service stopped responding
              </div>
              <div className="p-2 bg-slate-800/50 rounded text-slate-300">
                <span className="text-slate-500">[2024-01-24 15:25:00]</span> INFO: Database connection pool status: 45/100 connections active
              </div>
              <div className="p-2 bg-yellow-500/10 rounded text-yellow-300">
                <span className="text-slate-500">[2024-01-24 15:20:00]</span> WARN: Memory usage approaching threshold on web-01.internal (68%)
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <ParscadeButton variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Full Logs
              </ParscadeButton>
            </div>
          </ParscadeCard>
        </div>
      )}
    </div>
  );
};

export default SystemMonitoringPage;