import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Users,
  ArrowRight,
  ArrowUp,
  MessageSquare,
  Calendar,
  Filter,
  Search,
  Plus,
  Edit,
  Eye,
  AlertTriangle,
  FileText,
  Settings,
  Timer,
  CheckCircle2,
  UserCheck,
  Send
} from 'lucide-react';
import React, { useState } from 'react';

import ParscadeButton from '@/shared/components/brand/ParscadeButton';
import ParscadeCard from '@/shared/components/brand/ParscadeCard';
import ParscadeStatusBadge from '@/shared/components/brand/ParscadeStatusBadge';

interface ApprovalWorkflow {
  id: string;
  title: string;
  requestor: {
    name: string;
    email: string;
    avatar?: string;
  };
  type: 'document_approval' | 'budget_request' | 'access_request' | 'contract_review' | 'policy_change';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'escalated';
  currentStep: number;
  totalSteps: number;
  approvers: {
    step: number;
    name: string;
    role: string;
    status: 'pending' | 'approved' | 'rejected';
    timestamp?: string;
    comments?: string;
  }[];
  dueDate: string;
  createdAt: string;
  description: string;
  attachments: string[];
  tags: string[];
}

const ApprovalWorkflowPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'templates' | 'analytics'>('pending');
  const [selectedWorkflow, setSelectedWorkflow] = useState<ApprovalWorkflow | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const workflows: ApprovalWorkflow[] = [
    {
      id: '1',
      title: 'Q4 Marketing Budget Approval',
      requestor: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com'
      },
      type: 'budget_request',
      priority: 'high',
      status: 'in_review',
      currentStep: 2,
      totalSteps: 3,
      approvers: [
        {
          step: 1,
          name: 'Mike Chen',
          role: 'Department Manager',
          status: 'approved',
          timestamp: '2024-01-20 14:30',
          comments: 'Budget allocation looks reasonable for Q4 targets'
        },
        {
          step: 2,
          name: 'Lisa Rodriguez',
          role: 'Finance Director',
          status: 'pending'
        },
        {
          step: 3,
          name: 'David Kim',
          role: 'CFO',
          status: 'pending'
        }
      ],
      dueDate: '2024-01-25',
      createdAt: '2024-01-18',
      description: 'Request for $150,000 marketing budget allocation for Q4 campaign initiatives',
      attachments: ['Q4_Marketing_Plan.pdf', 'Budget_Breakdown.xlsx'],
      tags: ['Finance', 'Marketing', 'Q4']
    },
    {
      id: '2',
      title: 'New Vendor Contract Review',
      requestor: {
        name: 'Tom Wilson',
        email: 'tom.wilson@company.com'
      },
      type: 'contract_review',
      priority: 'medium',
      status: 'pending',
      currentStep: 1,
      totalSteps: 2,
      approvers: [
        {
          step: 1,
          name: 'Jennifer Adams',
          role: 'Legal Counsel',
          status: 'pending'
        },
        {
          step: 2,
          name: 'Robert Taylor',
          role: 'VP Operations',
          status: 'pending'
        }
      ],
      dueDate: '2024-01-28',
      createdAt: '2024-01-19',
      description: 'Review and approval of new cloud infrastructure vendor contract',
      attachments: ['Vendor_Contract.pdf', 'Service_Level_Agreement.pdf'],
      tags: ['Legal', 'Contracts', 'Infrastructure']
    },
    {
      id: '3',
      title: 'Employee Database Access Request',
      requestor: {
        name: 'Alex Thompson',
        email: 'alex.thompson@company.com'
      },
      type: 'access_request',
      priority: 'low',
      status: 'escalated',
      currentStep: 3,
      totalSteps: 3,
      approvers: [
        {
          step: 1,
          name: 'Maria Garcia',
          role: 'Team Lead',
          status: 'approved',
          timestamp: '2024-01-17 09:15',
          comments: 'Access needed for project analytics'
        },
        {
          step: 2,
          name: 'James Wilson',
          role: 'IT Security Manager',
          status: 'rejected',
          timestamp: '2024-01-17 16:45',
          comments: 'Need additional security clearance documentation'
        },
        {
          step: 3,
          name: 'Patricia Brown',
          role: 'CISO',
          status: 'pending'
        }
      ],
      dueDate: '2024-01-22',
      createdAt: '2024-01-16',
      description: 'Request for read access to employee database for analytics purposes',
      attachments: ['Access_Justification.pdf'],
      tags: ['Security', 'Database', 'Analytics']
    }
  ];

  const workflowTemplates = [
    {
      name: 'Document Approval',
      steps: 3,
      avgTime: '2 days',
      description: 'Standard document review and approval process',
      icon: FileText,
      approvers: ['Manager', 'Department Head', 'Executive']
    },
    {
      name: 'Budget Request',
      steps: 4,
      avgTime: '5 days',
      description: 'Financial budget approval with multiple stakeholders',
      icon: Users,
      approvers: ['Manager', 'Finance', 'Director', 'C-Level']
    },
    {
      name: 'Access Request',
      steps: 2,
      avgTime: '1 day',
      description: 'System access and permission requests',
      icon: UserCheck,
      approvers: ['Manager', 'IT Security']
    },
    {
      name: 'Policy Change',
      steps: 3,
      avgTime: '7 days',
      description: 'Organizational policy updates and changes',
      icon: Settings,
      approvers: ['Department Head', 'Legal', 'Executive']
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document_approval': return FileText;
      case 'budget_request': return Users;
      case 'access_request': return UserCheck;
      case 'contract_review': return FileText;
      case 'policy_change': return Settings;
      default: return CheckCircle;
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.requestor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || workflow.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Approval Workflows</h1>
          <p className="text-slate-400 mt-1">Manage approval processes and track workflow status</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <ParscadeButton variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Workflow Builder
          </ParscadeButton>
          <ParscadeButton variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </ParscadeButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        {[
          { id: 'pending', label: 'Pending Approval', icon: Clock },
          { id: 'completed', label: 'Completed', icon: CheckCircle },
          { id: 'templates', label: 'Templates', icon: FileText },
          { id: 'analytics', label: 'Analytics', icon: Users }
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

      {/* Search and Filters */}
      {(activeTab === 'pending' || activeTab === 'completed') && (
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search workflows..."
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
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="escalated">Escalated</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      )}

      {/* Quick Stats */}
      {activeTab === 'pending' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <ParscadeCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending Approval</p>
                <p className="text-2xl font-bold text-white mt-1">12</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </ParscadeCard>

          <ParscadeCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Overdue</p>
                <p className="text-2xl font-bold text-white mt-1">3</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </ParscadeCard>

          <ParscadeCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Processing Time</p>
                <p className="text-2xl font-bold text-white mt-1">2.8d</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Timer className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </ParscadeCard>

          <ParscadeCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Approval Rate</p>
                <p className="text-2xl font-bold text-white mt-1">94%</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </ParscadeCard>
        </div>
      )}

      {(activeTab === 'pending' || activeTab === 'completed') && (
        <div className="space-y-4">
          {filteredWorkflows.map((workflow) => {
            const TypeIcon = getTypeIcon(workflow.type);
            const isOverdue = new Date(workflow.dueDate) < new Date();

            return (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ParscadeCard className={`p-6 ${isOverdue ? 'border-red-500/30' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{workflow.title}</h3>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(workflow.priority)}`}>
                            {workflow.priority.toUpperCase()}
                          </span>
                          {isOverdue && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-md text-xs font-medium">
                              OVERDUE
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 mb-3">{workflow.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-slate-400">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{workflow.requestor.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {workflow.dueDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>Created: {workflow.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ParscadeStatusBadge status={workflow.status} />
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Approval Progress */}
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-white">
                        Approval Progress ({workflow.currentStep}/{workflow.totalSteps})
                      </span>
                      <span className="text-sm text-slate-400">
                        {Math.round((workflow.currentStep / workflow.totalSteps) * 100)}% complete
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      {workflow.approvers.map((approver, index) => (
                        <React.Fragment key={index}>
                          <div className="flex flex-col items-center space-y-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                              approver.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                              approver.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              approver.status === 'pending' && index < workflow.currentStep ? 'bg-amber-500/20 text-amber-400' :
                              'bg-slate-700 text-slate-400'
                            }`}>
                              {approver.status === 'approved' ? <CheckCircle className="w-5 h-5" /> :
                               approver.status === 'rejected' ? <XCircle className="w-5 h-5" /> :
                               approver.status === 'pending' && index < workflow.currentStep ? <Clock className="w-5 h-5" /> :
                               <User className="w-5 h-5" />}
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-medium text-white">{approver.name}</p>
                              <p className="text-xs text-slate-400">{approver.role}</p>
                              {approver.timestamp && (
                                <p className="text-xs text-slate-500 mt-1">{approver.timestamp}</p>
                              )}
                            </div>
                            {approver.comments && (
                              <div className="max-w-32 p-2 bg-slate-700/50 rounded-lg">
                                <p className="text-xs text-slate-300">{approver.comments}</p>
                              </div>
                            )}
                          </div>
                          {index < workflow.approvers.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {workflow.status === 'pending' && workflow.currentStep <= workflow.approvers.length && (
                      <div className="flex justify-end space-x-2 mt-4">
                        <ParscadeButton variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Add Comment
                        </ParscadeButton>
                        <ParscadeButton variant="destructive" size="sm">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </ParscadeButton>
                        <ParscadeButton size="sm">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </ParscadeButton>
                      </div>
                    )}
                  </div>

                  {/* Tags and Attachments */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center space-x-2">
                      {workflow.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <FileText className="w-4 h-4" />
                      <span>{workflow.attachments.length} attachments</span>
                    </div>
                  </div>
                </ParscadeCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Workflow Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {workflowTemplates.map((template) => {
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
                        <p className="text-xs text-slate-400">{template.steps} steps • {template.avgTime}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mb-4">{template.description}</p>
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Approvers</p>
                      <div className="flex flex-wrap gap-1">
                        {template.approvers.map((approver, index) => (
                          <span key={index} className="px-2 py-1 bg-slate-700/30 text-slate-400 text-xs rounded-md">
                            {approver}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ParscadeButton variant="outline" size="sm" className="w-full">
                      Use Template
                    </ParscadeButton>
                  </motion.div>
                );
              })}
            </div>
          </ParscadeCard>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Approval Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Average Processing Time</span>
                <span className="text-sm font-medium text-white">2.8 days</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '70%' }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Approval Rate</span>
                <span className="text-sm font-medium text-white">94%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-emerald-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '94%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Escalation Rate</span>
                <span className="text-sm font-medium text-white">12%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-amber-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '12%' }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
            </div>
          </ParscadeCard>

          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Workflow Types</h3>
            <div className="space-y-3">
              {[
                { type: 'Budget Requests', count: 24, color: 'bg-blue-500' },
                { type: 'Document Approval', count: 18, color: 'bg-purple-500' },
                { type: 'Access Requests', count: 15, color: 'bg-emerald-500' },
                { type: 'Contract Reviews', count: 12, color: 'bg-amber-500' }
              ].map((item, index) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-white">{item.type}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-400">{item.count}</span>
                </div>
              ))}
            </div>
          </ParscadeCard>
        </div>
      )}
    </div>
  );
};

export default ApprovalWorkflowPage;