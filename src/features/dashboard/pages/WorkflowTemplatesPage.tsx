import { motion } from 'framer-motion';
import {
  Layers,
  Plus,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  Download,
  Upload,
  Share2,
  Star,
  Clock,
  Users,
  Settings,
  ArrowRight,
  CheckCircle,
  FileText,
  Zap,
  Database,
  Mail,
  Calendar,
  Filter,
  Search,
  GitBranch,
  Activity,
  Target,
  Code2,
  Workflow
} from 'lucide-react';
import React, { useState } from 'react';

import ParscadeButton from '@/shared/components/brand/ParscadeButton';
import ParscadeCard from '@/shared/components/brand/ParscadeCard';
import ParscadeStatusBadge from '@/shared/components/brand/ParscadeStatusBadge';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'document_processing' | 'approval' | 'automation' | 'integration' | 'notification' | 'analytics';
  complexity: 'simple' | 'moderate' | 'complex';
  status: 'active' | 'draft' | 'archived';
  creator: {
    name: string;
    email: string;
  };
  steps: {
    id: string;
    name: string;
    type: 'trigger' | 'condition' | 'action' | 'approval' | 'notification';
    description: string;
    config: any;
  }[];
  usage: {
    total: number;
    lastWeek: number;
    successRate: number;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  rating: number;
  reviews: number;
}

const WorkflowTemplatesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'my_templates' | 'shared' | 'builder'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);

  const templates: WorkflowTemplate[] = [
    {
      id: '1',
      name: 'Invoice Processing Pipeline',
      description: 'Automated invoice processing from receipt to approval and payment scheduling',
      category: 'document_processing',
      complexity: 'moderate',
      status: 'active',
      creator: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com'
      },
      steps: [
        {
          id: '1',
          name: 'Invoice Received',
          type: 'trigger',
          description: 'Trigger when invoice document is uploaded',
          config: { documentType: 'invoice' }
        },
        {
          id: '2',
          name: 'Extract Invoice Data',
          type: 'action',
          description: 'Extract key fields from invoice using OCR',
          config: { fields: ['amount', 'vendor', 'date', 'items'] }
        },
        {
          id: '3',
          name: 'Validate Amount',
          type: 'condition',
          description: 'Check if amount exceeds approval threshold',
          config: { threshold: 10000 }
        },
        {
          id: '4',
          name: 'Manager Approval',
          type: 'approval',
          description: 'Request approval for high-value invoices',
          config: { approvers: ['manager', 'finance_director'] }
        },
        {
          id: '5',
          name: 'Update Accounting System',
          type: 'action',
          description: 'Create invoice record in accounting system',
          config: { system: 'QuickBooks' }
        },
        {
          id: '6',
          name: 'Payment Notification',
          type: 'notification',
          description: 'Notify accounts payable team',
          config: { recipients: ['ap@company.com'] }
        }
      ],
      usage: {
        total: 847,
        lastWeek: 45,
        successRate: 97.2
      },
      tags: ['Finance', 'Automation', 'OCR', 'Approval'],
      createdAt: '2024-01-10',
      updatedAt: '2024-01-20',
      isPublic: true,
      rating: 4.8,
      reviews: 23
    },
    {
      id: '2',
      name: 'Employee Onboarding Workflow',
      description: 'Complete new employee onboarding process with task assignments and approvals',
      category: 'approval',
      complexity: 'complex',
      status: 'active',
      creator: {
        name: 'Mike Chen',
        email: 'mike.chen@company.com'
      },
      steps: [
        {
          id: '1',
          name: 'New Employee Added',
          type: 'trigger',
          description: 'Trigger when new employee is added to HR system',
          config: { source: 'HRIS' }
        },
        {
          id: '2',
          name: 'Create IT Accounts',
          type: 'action',
          description: 'Generate email account and system access',
          config: { systems: ['email', 'slack', 'jira'] }
        },
        {
          id: '3',
          name: 'Manager Assignment',
          type: 'approval',
          description: 'Assign direct manager and request confirmation',
          config: { escalation: 'hr_director' }
        },
        {
          id: '4',
          name: 'Equipment Request',
          type: 'action',
          description: 'Order laptop and equipment based on role',
          config: { vendor: 'IT_Supply' }
        },
        {
          id: '5',
          name: 'Welcome Package',
          type: 'notification',
          description: 'Send welcome email with first-day information',
          config: { template: 'welcome_template' }
        }
      ],
      usage: {
        total: 156,
        lastWeek: 8,
        successRate: 100
      },
      tags: ['HR', 'Onboarding', 'IT', 'Automation'],
      createdAt: '2024-01-05',
      updatedAt: '2024-01-18',
      isPublic: true,
      rating: 4.9,
      reviews: 12
    },
    {
      id: '3',
      name: 'Contract Renewal Reminder',
      description: 'Automated contract renewal alerts and approval workflow',
      category: 'notification',
      complexity: 'simple',
      status: 'active',
      creator: {
        name: 'Lisa Rodriguez',
        email: 'lisa.rodriguez@company.com'
      },
      steps: [
        {
          id: '1',
          name: 'Contract Expiry Check',
          type: 'trigger',
          description: 'Daily check for contracts expiring in 30 days',
          config: { schedule: 'daily', lookAhead: 30 }
        },
        {
          id: '2',
          name: 'Renewal Required?',
          type: 'condition',
          description: 'Check if contract is marked for renewal',
          config: { field: 'renewal_status' }
        },
        {
          id: '3',
          name: 'Notify Contract Manager',
          type: 'notification',
          description: 'Send renewal reminder to contract manager',
          config: { template: 'contract_renewal' }
        },
        {
          id: '4',
          name: 'Create Renewal Task',
          type: 'action',
          description: 'Create task in project management system',
          config: { system: 'Jira', project: 'CONTRACT' }
        }
      ],
      usage: {
        total: 234,
        lastWeek: 12,
        successRate: 95.7
      },
      tags: ['Contracts', 'Legal', 'Reminders', 'Task Management'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-22',
      isPublic: false,
      rating: 4.6,
      reviews: 8
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: Workflow, count: 24 },
    { id: 'document_processing', name: 'Document Processing', icon: FileText, count: 8 },
    { id: 'approval', name: 'Approval Workflows', icon: CheckCircle, count: 6 },
    { id: 'automation', name: 'Task Automation', icon: Zap, count: 4 },
    { id: 'integration', name: 'System Integration', icon: Database, count: 3 },
    { id: 'notification', name: 'Notifications', icon: Mail, count: 2 },
    { id: 'analytics', name: 'Analytics & Reports', icon: Activity, count: 1 }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-emerald-400 bg-emerald-500/20';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20';
      case 'complex': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'trigger': return Play;
      case 'condition': return GitBranch;
      case 'action': return Zap;
      case 'approval': return CheckCircle;
      case 'notification': return Mail;
      default: return Settings;
    }
  };

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'text-blue-400 bg-blue-500/20';
      case 'condition': return 'text-amber-400 bg-amber-500/20';
      case 'action': return 'text-emerald-400 bg-emerald-500/20';
      case 'approval': return 'text-purple-400 bg-purple-500/20';
      case 'notification': return 'text-orange-400 bg-orange-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Workflow Templates</h1>
          <p className="text-slate-400 mt-1">Build, share, and deploy reusable workflow templates</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <ParscadeButton variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </ParscadeButton>
          <ParscadeButton variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </ParscadeButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        {[
          { id: 'browse', label: 'Browse Templates', icon: Search },
          { id: 'my_templates', label: 'My Templates', icon: User },
          { id: 'shared', label: 'Shared Library', icon: Share2 },
          { id: 'builder', label: 'Template Builder', icon: Code2 }
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

      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {categories.filter(c => c.id !== 'all').map((category) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <ParscadeCard className={`p-4 text-center hover:border-blue-500/50 transition-all ${
                    selectedCategory === category.id ? 'border-blue-500/50 bg-blue-500/10' : ''
                  }`}>
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-sm font-medium text-white">{category.name}</p>
                    <p className="text-xs text-slate-400">{category.count} templates</p>
                  </ParscadeCard>
                </motion.div>
              );
            })}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ParscadeCard className="p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                        {template.isPublic && (
                          <Share2 className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <p className="text-sm text-slate-300 mb-3">{template.description}</p>

                      <div className="flex items-center space-x-3 mb-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getComplexityColor(template.complexity)}`}>
                          {template.complexity}
                        </span>
                        <ParscadeStatusBadge status={template.status} />
                        {template.rating > 0 && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-white">{template.rating}</span>
                            <span className="text-sm text-slate-400">({template.reviews})</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {template.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md">
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 3 && (
                          <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-md">
                            +{template.tags.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <p className="text-slate-400">Steps</p>
                          <p className="text-white font-medium">{template.steps.length}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Usage</p>
                          <p className="text-white font-medium">{template.usage.total}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Success</p>
                          <p className="text-white font-medium">{template.usage.successRate}%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <ParscadeButton variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </ParscadeButton>
                    <ParscadeButton size="sm" className="flex-1">
                      <Copy className="w-4 h-4 mr-1" />
                      Use Template
                    </ParscadeButton>
                  </div>
                </ParscadeCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'my_templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">My Templates ({templates.length})</h3>
            <div className="flex space-x-2">
              <ParscadeButton variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </ParscadeButton>
              <ParscadeButton size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </ParscadeButton>
            </div>
          </div>

          <div className="space-y-4">
            {templates.map((template) => (
              <ParscadeCard key={template.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{template.name}</h4>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getComplexityColor(template.complexity)}`}>
                        {template.complexity}
                      </span>
                      <ParscadeStatusBadge status={template.status} />
                    </div>
                    <p className="text-slate-300 mb-3">{template.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-slate-400">
                      <div className="flex items-center space-x-2">
                        <Layers className="w-4 h-4" />
                        <span>{template.steps.length} steps</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4" />
                        <span>{template.usage.total} uses</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>{template.usage.successRate}% success rate</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Updated {template.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </ParscadeCard>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'shared' && (
        <div className="space-y-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Community Templates</h3>
            <p className="text-slate-300 mb-6">
              Discover and use templates shared by the community. High-rated templates are verified for quality and performance.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {templates.filter(t => t.isPublic).map((template) => (
                <div key={template.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white">{template.name}</h4>
                      <p className="text-sm text-slate-400">by {template.creator.name}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-white">{template.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{template.usage.total} downloads</span>
                    <ParscadeButton size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Use
                    </ParscadeButton>
                  </div>
                </div>
              ))}
            </div>
          </ParscadeCard>
        </div>
      )}

      {activeTab === 'builder' && (
        <div className="space-y-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Visual Workflow Builder</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-white">Step Types</h4>
                {[
                  { type: 'trigger', name: 'Trigger', description: 'Start the workflow' },
                  { type: 'condition', name: 'Condition', description: 'Branching logic' },
                  { type: 'action', name: 'Action', description: 'Perform operation' },
                  { type: 'approval', name: 'Approval', description: 'Human approval' },
                  { type: 'notification', name: 'Notification', description: 'Send alerts' }
                ].map((step) => {
                  const Icon = getStepTypeIcon(step.type);
                  return (
                    <motion.div
                      key={step.type}
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 rounded-lg border-2 border-dashed cursor-pointer transition-all ${getStepTypeColor(step.type)} border-slate-600 hover:border-blue-500`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <p className="font-medium">{step.name}</p>
                          <p className="text-xs opacity-75">{step.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="lg:col-span-2 space-y-4">
                <h4 className="font-medium text-white">Workflow Canvas</h4>
                <div className="h-96 bg-slate-800/30 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center">
                  <div className="text-center">
                    <Code2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-400 mb-4">Drag steps here to build your workflow</p>
                    <ParscadeButton variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Step
                    </ParscadeButton>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    <ParscadeButton variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Save Draft
                    </ParscadeButton>
                    <ParscadeButton variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </ParscadeButton>
                  </div>
                  <ParscadeButton size="sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Publish Template
                  </ParscadeButton>
                </div>
              </div>
            </div>
          </ParscadeCard>
        </div>
      )}
    </div>
  );
};

export default WorkflowTemplatesPage;