/**
 * Enterprise System Status Indicator
 * Real-time system health monitoring with professional status display
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Activity,
  Wifi,
  Server,
  Database,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { ParscadeCard } from '@/shared/components/brand';

type ServiceStatus = 'healthy' | 'degraded' | 'down' | 'maintenance' | 'unknown';

interface SystemService {
  id: string;
  name: string;
  status: ServiceStatus;
  responseTime?: number;
  lastChecked: string;
  uptime?: number;
  description?: string;
}

interface SystemStatusData {
  overall: ServiceStatus;
  services: SystemService[];
  lastUpdated: string;
  incidentCount: number;
}

/**
 * Status color and icon mappings
 */
const STATUS_CONFIG = {
  healthy: {
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    icon: CheckCircle,
    label: 'All Systems Operational',
  },
  degraded: {
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
    icon: AlertCircle,
    label: 'Degraded Performance',
  },
  down: {
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    icon: XCircle,
    label: 'Service Outage',
  },
  maintenance: {
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    icon: Clock,
    label: 'Scheduled Maintenance',
  },
  unknown: {
    color: 'gray',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700',
    icon: Activity,
    label: 'Status Unknown',
  },
};

/**
 * Mock system status data (replace with real API call)
 */
const fetchSystemStatus = async (): Promise<SystemStatusData> => {
  // This would normally be an API call to your status endpoint
  return {
    overall: 'healthy',
    lastUpdated: new Date().toISOString(),
    incidentCount: 0,
    services: [
      {
        id: 'api',
        name: 'API Gateway',
        status: 'healthy',
        responseTime: 120,
        lastChecked: new Date().toISOString(),
        uptime: 99.97,
        description: 'Core API services',
      },
      {
        id: 'database',
        name: 'Database',
        status: 'healthy',
        responseTime: 45,
        lastChecked: new Date().toISOString(),
        uptime: 99.99,
        description: 'Primary database cluster',
      },
      {
        id: 'auth',
        name: 'Authentication',
        status: 'healthy',
        responseTime: 89,
        lastChecked: new Date().toISOString(),
        uptime: 99.95,
        description: 'User authentication service',
      },
      {
        id: 'processing',
        name: 'Document Processing',
        status: 'healthy',
        responseTime: 1250,
        lastChecked: new Date().toISOString(),
        uptime: 99.92,
        description: 'Document analysis pipeline',
      },
    ],
  };
};

interface SystemStatusIndicatorProps {
  showDetails?: boolean;
  className?: string;
  refreshInterval?: number;
}

/**
 * Enterprise System Status Indicator Component
 */
const SystemStatusIndicator: React.FC<SystemStatusIndicatorProps> = ({
  showDetails = false,
  className = '',
  refreshInterval = 30000, // 30 seconds
}) => {
  const [systemStatus, setSystemStatus] = useState<SystemStatusData | null>(null);
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSystemStatus = async () => {
      try {
        setIsLoading(true);
        const status = await fetchSystemStatus();
        setSystemStatus(status);
        setError(null);
      } catch (err) {
        setError('Failed to load system status');
        console.error('System status error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial load
    loadSystemStatus();

    // Set up refresh interval
    const interval = setInterval(loadSystemStatus, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (isLoading || !systemStatus) {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
        <span className="text-sm text-gray-500">Checking status...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <div className="w-2 h-2 bg-gray-400 rounded-full" />
        <span className="text-sm text-gray-500">Status unavailable</span>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[systemStatus.overall];
  const StatusIcon = statusConfig.icon;

  return (
    <div className={className}>
      {/* Main Status Indicator */}
      <div
        className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${statusConfig.bgColor} ${statusConfig.borderColor} border`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <motion.div
          animate={{ rotate: systemStatus.overall === 'healthy' ? 0 : [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: systemStatus.overall !== 'healthy' ? Infinity : 0 }}
        >
          <StatusIcon className={`w-4 h-4 ${statusConfig.textColor}`} />
        </motion.div>

        <span className={`text-sm font-medium ${statusConfig.textColor}`}>
          {statusConfig.label}
        </span>

        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className={`w-4 h-4 ${statusConfig.textColor}`} />
        </motion.div>
      </div>

      {/* Detailed Status Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-80 right-0"
          >
            <ParscadeCard className="p-4 shadow-lg border">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">System Status</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full bg-${statusConfig.color}-400`} />
                    <span className="text-xs text-gray-500">
                      Updated {new Date(systemStatus.lastUpdated).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {/* Services */}
                <div className="space-y-3">
                  {systemStatus.services.map(service => {
                    const serviceConfig = STATUS_CONFIG[service.status];
                    const ServiceIcon = serviceConfig.icon;

                    return (
                      <div key={service.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <ServiceIcon className={`w-4 h-4 text-${serviceConfig.color}-600`} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{service.name}</p>
                            <p className="text-xs text-gray-500">{service.description}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          {service.responseTime && (
                            <p className="text-xs text-gray-600">{service.responseTime}ms</p>
                          )}
                          {service.uptime && (
                            <p className="text-xs text-green-600">{service.uptime}% uptime</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {systemStatus.incidentCount === 0
                        ? 'No active incidents'
                        : `${systemStatus.incidentCount} active incidents`}
                    </span>
                    <a
                      href="https://status.parscade.com"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Status Page
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </ParscadeCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SystemStatusIndicator;
