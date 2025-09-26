import { motion } from 'framer-motion';
import {
  Zap,
  Plus,
  Play,
  Pause,
  Edit,
  Trash2,
  Clock,
  Filter,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Calendar,
  FileText,
  Mail,
  Database,
  Code2,
  Settings,
  Activity,
  Target,
  BarChart3,
  Users
} from 'lucide-react';
import React, { useState } from 'react';

import ParscadeButton from '@/shared/components/brand/ParscadeButton';
import ParscadeCard from '@/shared/components/brand/ParscadeCard';
import ParscadeStatusBadge from '@/shared/components/brand/ParscadeStatusBadge';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'document_uploaded' | 'processing_completed' | 'schedule' | 'webhook' | 'manual';
    conditions: string[];
  };
  actions: {
    type: 'send_email' | 'update_database' | 'run_workflow' | 'generate_report' | 'move_file';
    details: string;
  }[];
  status: 'active' | 'inactive' | 'draft';
  lastRun: string | null;
  runCount: number;
  successRate: number;
  createdAt: string;
  tags: string[];
}

const AutomationRulesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'templates' | 'logs' | 'analytics'>('rules');
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);

  const automationRules: AutomationRule[] = [
    {
      id: '1',
      name: 'Invoice Processing Complete',
      description: 'Send notification and update CRM when invoice processing is completed',
      trigger: {
        type: 'processing_completed',
        conditions: ['Document type = Invoice', 'Status = Processed Successfully']
      },
      actions: [
        { type: 'send_email', details: 'Send to accounts@company.com' },
        { type: 'update_database', details: 'Update invoice status in CRM' }
      ],
      status: 'active',
      lastRun: '2 hours ago',
      runCount: 847,
      successRate: 98.2,
      createdAt: '2024-01-15',
      tags: ['Finance', 'Notifications']
    },
    {
      id: '2',
      name: 'Daily Report Generation',
      description: 'Generate and distribute daily processing reports to stakeholders',
      trigger: {
        type: 'schedule',
        conditions: ['Daily at 9:00 AM', 'Weekdays only']
      },
      actions: [
        { type: 'generate_report', details: 'Processing summary report' },
        { type: 'send_email', details: 'Send to management team' }
      ],
      status: 'active',
      lastRun: '18 hours ago',
      runCount: 156,
      successRate: 100,
      createdAt: '2024-01-10',
      tags: ['Reports', 'Scheduled']
    },
    {
      id: '3',
      name: 'Quality Check Failed',
      description: 'Alert team when document quality validation fails',
      trigger: {
        type: 'processing_completed',
        conditions: ['Quality score < 85%', 'Contains errors = true']
      },
      actions: [
        { type: 'send_email', details: 'Alert quality team' },
        { type: 'move_file', details: 'Move to review folder' }
      ],
      status: 'active',
      lastRun: '30 minutes ago',
      runCount: 23,
      successRate: 95.7,
      createdAt: '2024-01-20',
      tags: ['Quality', 'Alerts']
    },
    {
      id: '4',
      name: 'Contract Expiry Reminder',
      description: 'Send reminders 30 days before contract expiration',
      trigger: {
        type: 'schedule',
        conditions: ['Check daily', 'Contract expiry within 30 days']
      },
      actions: [
        { type: 'send_email', details: 'Notify contract managers' },
        { type: 'run_workflow', details: 'Renewal preparation workflow' }
      ],
      status: 'draft',
      lastRun: null,
      runCount: 0,
      successRate: 0,
      createdAt: '2024-01-22',
      tags: ['Contracts', 'Reminders']
    }
  ];

  const ruleTemplates = [
    {
      name: 'Document Processing Pipeline',
      description: 'Complete automation for document intake to completion',
      triggers: ['Document Upload'],
      actions: ['Extract Data', 'Validate', 'Store', 'Notify'],
      icon: FileText,
      category: 'Processing'
    },
    {
      name: 'Approval Workflow',
      description: 'Multi-stage approval process with escalation',
      triggers: ['Manual Trigger'],
      actions: ['Request Approval', 'Send Reminders', 'Escalate'],
      icon: CheckCircle,
      category: 'Approval'
    },
    {
      name: 'Error Handling',
      description: 'Automated error detection and recovery',
      triggers: ['Processing Error'],
      actions: ['Log Error', 'Retry', 'Alert Team'],
      icon: AlertTriangle,
      category: 'Error Management'
    },
    {
      name: 'Scheduled Maintenance',
      description: 'Regular system maintenance and cleanup tasks',
      triggers: ['Schedule'],
      actions: ['Cleanup Files', 'Update Indexes', 'Generate Reports'],
      icon: Settings,
      category: 'Maintenance'
    }
  ];

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'document_uploaded': return FileText;
      case 'processing_completed': return CheckCircle;
      case 'schedule': return Clock;
      case 'webhook': return Code2;
      case 'manual': return Play;
      default: return Zap;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'send_email': return Mail;
      case 'update_database': return Database;
      case 'run_workflow': return Play;
      case 'generate_report': return BarChart3;
      case 'move_file': return FileText;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Automation Rules</h1>
          <p className="text-slate-400 mt-1">Create and manage intelligent automation workflows</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <ParscadeButton variant="outline">
            <Code2 className="w-4 h-4 mr-2" />
            Rule Builder
          </ParscadeButton>
          <ParscadeButton variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            New Rule
          </ParscadeButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        {[
          { id: 'rules', label: 'Rules', icon: Zap },
          { id: 'templates', label: 'Templates', icon: FileText },
          { id: 'logs', label: 'Execution Logs', icon: Activity },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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

      {activeTab === 'rules' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <ParscadeCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Rules</p>
                  <p className="text-2xl font-bold text-white mt-1">12</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Play className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Executions Today</p>
                  <p className="text-2xl font-bold text-white mt-1">1,247</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Success Rate</p>
                  <p className="text-2xl font-bold text-white mt-1">97.8%</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Time Saved</p>
                  <p className="text-2xl font-bold text-white mt-1">168h</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </ParscadeCard>
          </div>

          {/* Rules List */}
          <div className="space-y-4">
            {automationRules.map((rule) => {
              const TriggerIcon = getTriggerIcon(rule.trigger.type);
              return (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ParscadeCard className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <TriggerIcon className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{rule.name}</h3>
                            <p className="text-sm text-slate-400">{rule.description}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <ParscadeStatusBadge status={rule.status} />
                          {rule.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Last Run</p>
                            <p className="text-sm text-white">{rule.lastRun || 'Never'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Executions</p>
                            <p className="text-sm text-white">{rule.runCount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Success Rate</p>
                            <p className="text-sm text-white">{rule.successRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Created</p>
                            <p className="text-sm text-white">{rule.createdAt}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          className={`p-2 rounded-lg transition-colors ${
                            rule.status === 'active'
                              ? 'text-amber-400 hover:bg-amber-500/20'
                              : 'text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                        >
                          {rule.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Trigger and Actions Flow */}
                    <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400">Trigger:</span>
                          <span className="text-blue-400 font-medium">{rule.trigger.conditions[0]}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400">Actions:</span>
                          <div className="flex items-center space-x-2">
                            {rule.actions.slice(0, 2).map((action, index) => {
                              const ActionIcon = getActionIcon(action.type);
                              return (
                                <div key={index} className="flex items-center space-x-1">
                                  <ActionIcon className="w-4 h-4 text-emerald-400" />
                                  <span className="text-emerald-400 font-medium">
                                    {action.type.replace('_', ' ')}
                                  </span>
                                </div>
                              );
                            })}
                            {rule.actions.length > 2 && (
                              <span className="text-slate-400">+{rule.actions.length - 2} more</span>
                            )}
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

      {activeTab === 'templates' && (
        <div className="space-y-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Rule Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ruleTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <motion.div
                    key={template.name}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-blue-500/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{template.name}</p>
                        <p className="text-xs text-slate-400">{template.category}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mb-4">{template.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-500">Triggers:</span>
                        <span className="text-xs text-blue-400">{template.triggers.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-500">Actions:</span>
                        <span className="text-xs text-emerald-400">{template.actions.slice(0, 2).join(', ')}</span>
                        {template.actions.length > 2 && (
                          <span className="text-xs text-slate-400">+{template.actions.length - 2}</span>
                        )}
                      </div>
                    </div>
                    <ParscadeButton variant="outline" size="sm" className="w-full mt-4">
                      Use Template
                    </ParscadeButton>
                  </motion.div>
                );
              })}
            </div>
          </ParscadeCard>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Executions</h3>
            <div className="space-y-3">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${i % 4 === 0 ? 'bg-red-400' : 'bg-emerald-400'}`} />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {i % 4 === 0 ? 'Quality Check Failed' : 'Invoice Processing Complete'}
                      </p>
                      <p className="text-xs text-slate-400">
                        Executed {Math.floor(Math.random() * 60) + 1} minutes ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-slate-400">
                      Duration: {Math.floor(Math.random() * 5) + 1}.{Math.floor(Math.random() * 9)}s
                    </span>
                    <ParscadeStatusBadge status={i % 4 === 0 ? 'error' : 'active'} />
                  </div>
                </div>
              ))}
            </div>
          </ParscadeCard>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Execution Trends</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Today</span>
                <span className="text-sm font-medium text-white">1,247 executions</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '78%' }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Yesterday</span>
                <span className="text-sm font-medium text-white">1,156 executions</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Last Week Avg</span>
                <span className="text-sm font-medium text-white">1,089 executions</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-emerald-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '68%' }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
            </div>
          </ParscadeCard>

          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Performing Rules</h3>
            <div className="space-y-3">
              {automationRules
                .sort((a, b) => b.runCount - a.runCount)
                .slice(0, 4)
                .map((rule, index) => (
                  <div key={rule.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-400">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{rule.name}</p>
                        <p className="text-xs text-slate-400">{rule.successRate}% success rate</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{rule.runCount}</p>
                      <p className="text-xs text-slate-400">executions</p>
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

export default AutomationRulesPage;