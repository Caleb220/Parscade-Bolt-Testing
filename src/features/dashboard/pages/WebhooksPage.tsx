/**
 * Webhooks Page - Real-time Integration Management
 * Comprehensive webhook management with event monitoring and debugging tools
 */

import { motion } from 'framer-motion';
import {
  Webhook,
  Plus,
  Play,
  Pause,
  Edit3,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  Settings,
  RefreshCw,
  Download,
  Filter,
  Search,
  ExternalLink,
  Code,
  Globe,
  Lock,
  Unlock,
  TestTube,
  BarChart3,
  FileText,
  Calendar,
  Key,
} from 'lucide-react';
import React, { useState } from 'react';

import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'paused' | 'failed' | 'testing';
  isSecure: boolean;
  secretVisible: boolean;
  headers: Record<string, string>;
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
    initialDelay: number;
  };
  stats: {
    totalCalls: number;
    successRate: number;
    avgResponseTime: number;
    lastSuccess: string;
    lastFailure?: string;
  };
  createdAt: string;
  createdBy: string;
  description?: string;
}

interface WebhookEvent {
  id: string;
  webhookId: string;
  eventType: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending' | 'retry';
  responseCode?: number;
  responseTime?: number;
  payload: Record<string, any>;
  response?: string;
  error?: string;
  retryCount?: number;
}

interface EventType {
  id: string;
  name: string;
  description: string;
  category: 'document' | 'processing' | 'user' | 'system';
  frequency: 'high' | 'medium' | 'low';
  payloadExample: Record<string, any>;
}

const WebhooksPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'endpoints' | 'events' | 'logs' | 'settings'>('endpoints');
  const [selectedWebhook, setSelectedWebhook] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState<string | null>(null);

  // Mock data
  const webhookEndpoints: WebhookEndpoint[] = [
    {
      id: 'wh-001',
      name: 'Document Processing Notifications',
      url: 'https://api.example.com/webhooks/document-processed',
      events: ['document.processed', 'document.failed', 'document.approved'],
      status: 'active',
      isSecure: true,
      secretVisible: false,
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        'Content-Type': 'application/json',
      },
      retryPolicy: {
        maxRetries: 3,
        backoffMultiplier: 2,
        initialDelay: 1000,
      },
      stats: {
        totalCalls: 1247,
        successRate: 98.2,
        avgResponseTime: 234,
        lastSuccess: '2024-02-20T14:30:00Z',
      },
      createdAt: '2024-01-15T10:30:00Z',
      createdBy: 'Sarah Chen',
      description: 'Sends notifications when documents are processed, failed, or approved',
    },
    {
      id: 'wh-002',
      name: 'User Activity Tracker',
      url: 'https://analytics.company.com/events',
      events: ['user.login', 'user.logout', 'document.uploaded'],
      status: 'active',
      isSecure: false,
      secretVisible: false,
      headers: {
        'X-API-Key': 'sk_live_abcd1234567890',
      },
      retryPolicy: {
        maxRetries: 2,
        backoffMultiplier: 1.5,
        initialDelay: 500,
      },
      stats: {
        totalCalls: 3456,
        successRate: 95.7,
        avgResponseTime: 145,
        lastSuccess: '2024-02-20T15:45:00Z',
      },
      createdAt: '2024-02-01T09:15:00Z',
      createdBy: 'Michael Rodriguez',
      description: 'Tracks user activities for analytics and reporting',
    },
    {
      id: 'wh-003',
      name: 'Error Monitoring System',
      url: 'https://monitoring.internal.com/alerts',
      events: ['system.error', 'processing.failed', 'api.timeout'],
      status: 'failed',
      isSecure: true,
      secretVisible: false,
      headers: {
        'Authorization': 'Bearer token...',
      },
      retryPolicy: {
        maxRetries: 5,
        backoffMultiplier: 2,
        initialDelay: 2000,
      },
      stats: {
        totalCalls: 89,
        successRate: 23.4,
        avgResponseTime: 5000,
        lastSuccess: '2024-02-18T08:20:00Z',
        lastFailure: '2024-02-20T16:00:00Z',
      },
      createdAt: '2024-02-10T14:20:00Z',
      createdBy: 'Emily Watson',
      description: 'Monitors system errors and processing failures',
    },
  ];

  const recentEvents: WebhookEvent[] = [
    {
      id: 'evt-001',
      webhookId: 'wh-001',
      eventType: 'document.processed',
      timestamp: '2024-02-20T16:30:00Z',
      status: 'success',
      responseCode: 200,
      responseTime: 234,
      payload: {
        documentId: 'doc-12345',
        status: 'completed',
        processingTime: 2.3,
        confidence: 94.2,
      },
      response: '{"status": "received", "id": "webhook-123"}',
    },
    {
      id: 'evt-002',
      webhookId: 'wh-002',
      eventType: 'user.login',
      timestamp: '2024-02-20T16:28:00Z',
      status: 'success',
      responseCode: 201,
      responseTime: 145,
      payload: {
        userId: 'user-456',
        timestamp: '2024-02-20T16:28:00Z',
        ipAddress: '192.168.1.100',
      },
      response: '{"received": true}',
    },
    {
      id: 'evt-003',
      webhookId: 'wh-003',
      eventType: 'system.error',
      timestamp: '2024-02-20T16:25:00Z',
      status: 'failed',
      responseCode: 500,
      responseTime: 5000,
      payload: {
        error: 'Database connection timeout',
        severity: 'high',
        affectedServices: ['api', 'processing'],
      },
      error: 'Internal Server Error: Connection timeout after 5000ms',
      retryCount: 3,
    },
  ];

  const availableEvents: EventType[] = [
    {
      id: 'document.processed',
      name: 'Document Processed',
      description: 'Triggered when a document is successfully processed',
      category: 'document',
      frequency: 'high',
      payloadExample: {
        documentId: 'doc-123',
        status: 'completed',
        processingTime: 2.3,
        confidence: 94.2,
        extractedData: {},
      },
    },
    {
      id: 'document.failed',
      name: 'Document Processing Failed',
      description: 'Triggered when document processing fails',
      category: 'document',
      frequency: 'low',
      payloadExample: {
        documentId: 'doc-456',
        status: 'failed',
        error: 'OCR confidence too low',
        retryable: true,
      },
    },
    {
      id: 'user.login',
      name: 'User Login',
      description: 'Triggered when a user logs into the system',
      category: 'user',
      frequency: 'medium',
      payloadExample: {
        userId: 'user-789',
        timestamp: '2024-02-20T16:00:00Z',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
      },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'paused':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'failed':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'testing':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-amber-600 bg-amber-100';
      case 'retry':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'document':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'user':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'system':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const maskSecret = (secret: string) => {
    return secret.slice(0, 8) + '•'.repeat(20) + secret.slice(-8);
  };

  return (
    <DashboardLayout
      title="Webhooks"
      subtitle="Real-time event notifications and integration management"
      variant="integrations"
      backgroundPattern="subtle"
      headerVariant="extended"
      showBreadcrumbs={true}
      actions={
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Logs</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Webhook</span>
          </button>
        </div>
      }
    >
      {/* Webhooks Overview Stats */}
      <div className="col-span-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardSection
            title="Webhooks Overview"
            subtitle="Real-time integration monitoring and performance metrics"
            className="bg-gradient-to-br from-white to-slate-50/30 border-slate-200/60"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              {[
                { icon: Webhook, label: 'Active Endpoints', value: '12', change: '+3', color: 'blue' },
                { icon: Activity, label: 'Events Today', value: '2.4K', change: '+15%', color: 'green' },
                { icon: CheckCircle, label: 'Success Rate', value: '96.8%', change: '+1.2%', color: 'green' },
                { icon: Clock, label: 'Avg Response Time', value: '234ms', change: '-12ms', color: 'purple' },
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
                      stat.change.startsWith('+') || stat.change.startsWith('-') && stat.change.includes('ms') ? 'text-green-600' :
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
            { id: 'endpoints', label: 'Endpoints', icon: Webhook },
            { id: 'events', label: 'Event Types', icon: Zap },
            { id: 'logs', label: 'Activity Logs', icon: FileText },
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

      {/* Webhook Endpoints */}
      {selectedTab === 'endpoints' && (
        <div className="col-span-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardSection
              title="Webhook Endpoints"
              subtitle="Manage your webhook endpoints and monitor their performance"
              className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/60"
            >
              <div className="p-6">
                <div className="space-y-4">
                  {webhookEndpoints.map((webhook, index) => (
                    <motion.div
                      key={webhook.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-card-hover transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                            <Webhook className="w-6 h-6 text-blue-600" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-slate-900">{webhook.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(webhook.status)}`}>
                                {webhook.status}
                              </span>
                              {webhook.isSecure ? (
                                <Lock className="w-4 h-4 text-green-600" />
                              ) : (
                                <Unlock className="w-4 h-4 text-amber-600" />
                              )}
                            </div>

                            {webhook.description && (
                              <p className="text-slate-600 mb-3">{webhook.description}</p>
                            )}

                            <div className="flex items-center space-x-2 mb-3 p-2 bg-slate-50 rounded-lg">
                              <Globe className="w-4 h-4 text-slate-500 flex-shrink-0" />
                              <code className="text-sm text-slate-800 font-mono truncate">
                                {webhook.url}
                              </code>
                              <button
                                onClick={() => navigator.clipboard.writeText(webhook.url)}
                                className="p-1 hover:bg-slate-200 rounded"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              <button className="p-1 hover:bg-slate-200 rounded">
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {webhook.events.map((event) => (
                                <span
                                  key={event}
                                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-200"
                                >
                                  {event}
                                </span>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                              <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="text-sm text-slate-600">Total Calls</div>
                                <div className="font-semibold text-blue-600">{webhook.stats.totalCalls.toLocaleString()}</div>
                              </div>
                              <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="text-sm text-slate-600">Success Rate</div>
                                <div className="font-semibold text-green-600">{webhook.stats.successRate}%</div>
                              </div>
                              <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <div className="text-sm text-slate-600">Avg Response</div>
                                <div className="font-semibold text-purple-600">{webhook.stats.avgResponseTime}ms</div>
                              </div>
                              <div className="text-center p-3 bg-amber-50 rounded-lg">
                                <div className="text-sm text-slate-600">Last Success</div>
                                <div className="font-semibold text-amber-600 text-xs">
                                  {new Date(webhook.stats.lastSuccess).toLocaleDateString()}
                                </div>
                              </div>
                            </div>

                            {/* Headers Preview */}
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-slate-800 mb-2">Headers</h4>
                              <div className="space-y-1">
                                {Object.entries(webhook.headers).map(([key, value]) => (
                                  <div key={key} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                                    <span className="font-medium text-slate-600">{key}:</span>
                                    <div className="flex items-center space-x-2">
                                      {key.toLowerCase().includes('authorization') || key.toLowerCase().includes('secret') || key.toLowerCase().includes('key') ? (
                                        <span className="font-mono text-slate-800">
                                          {showSecret === `${webhook.id}-${key}` ? value : maskSecret(value)}
                                        </span>
                                      ) : (
                                        <span className="font-mono text-slate-800">{value}</span>
                                      )}
                                      {(key.toLowerCase().includes('authorization') || key.toLowerCase().includes('secret') || key.toLowerCase().includes('key')) && (
                                        <button
                                          onClick={() => setShowSecret(showSecret === `${webhook.id}-${key}` ? null : `${webhook.id}-${key}`)}
                                          className="p-1 hover:bg-slate-200 rounded"
                                        >
                                          {showSecret === `${webhook.id}-${key}` ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                              <span>Created by {webhook.createdBy}</span>
                              <span>Created {new Date(webhook.createdAt).toLocaleDateString()}</span>
                              <span>Retry policy: {webhook.retryPolicy.maxRetries} attempts</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 hover:bg-slate-100 rounded">
                            <TestTube className="w-4 h-4" />
                          </button>
                          {webhook.status === 'active' && (
                            <button className="p-2 hover:bg-amber-50 text-amber-600 rounded">
                              <Pause className="w-4 h-4" />
                            </button>
                          )}
                          {webhook.status === 'paused' && (
                            <button className="p-2 hover:bg-green-50 text-green-600 rounded">
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-2 hover:bg-slate-100 rounded">
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-red-50 text-red-600 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </DashboardSection>
          </motion.div>
        </div>
      )}

      {/* Recent Events/Logs */}
      {selectedTab === 'logs' && (
        <div className="col-span-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardSection
              title="Activity Logs"
              subtitle="Recent webhook events and delivery attempts"
              className="bg-gradient-to-br from-white to-green-50/30 border-green-200/60"
            >
              <div className="p-6">
                <div className="space-y-4">
                  {recentEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-card transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-slate-900">{event.eventType}</h3>
                              <span className="text-sm text-slate-500">
                                {new Date(event.timestamp).toLocaleString()}
                              </span>
                              {event.responseCode && (
                                <span className={`text-sm font-medium ${
                                  event.responseCode < 300 ? 'text-green-600' :
                                  event.responseCode < 400 ? 'text-amber-600' : 'text-red-600'
                                }`}>
                                  HTTP {event.responseCode}
                                </span>
                              )}
                              {event.responseTime && (
                                <span className="text-sm text-slate-500">{event.responseTime}ms</span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                              <div>
                                <h4 className="font-medium text-slate-800 mb-1">Payload</h4>
                                <pre className="bg-slate-50 p-2 rounded text-xs overflow-auto">
{JSON.stringify(event.payload, null, 2)}
                                </pre>
                              </div>

                              {event.response && (
                                <div>
                                  <h4 className="font-medium text-slate-800 mb-1">Response</h4>
                                  <pre className="bg-green-50 p-2 rounded text-xs overflow-auto">
{event.response}
                                  </pre>
                                </div>
                              )}

                              {event.error && (
                                <div className="lg:col-span-2">
                                  <h4 className="font-medium text-red-800 mb-1">Error</h4>
                                  <pre className="bg-red-50 p-2 rounded text-xs overflow-auto text-red-700">
{event.error}
                                  </pre>
                                  {event.retryCount && (
                                    <p className="text-xs text-red-600 mt-1">
                                      Retry attempts: {event.retryCount}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 hover:bg-slate-100 rounded">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
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

export default WebhooksPage;