/**
 * Quality Control Page - Document Processing Quality Assurance
 * Advanced quality control with manual review workflows and validation rules
 */

import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw,
  Settings,
  BarChart3,
  Target,
  Clock,
  Users,
  FileText,
  Zap,
  Activity,
  TrendingUp,
  TrendingDown,
  Edit3,
  MessageSquare,
  Star,
  Calendar,
  ArrowRight,
  CheckSquare,
  Square,
} from 'lucide-react';
import React, { useState } from 'react';

import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';

interface QualityReviewItem {
  id: string;
  documentId: string;
  documentName: string;
  documentType: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  priority: 'low' | 'normal' | 'high' | 'critical';
  aiConfidence: number;
  reviewer?: string;
  reviewedAt?: string;
  issues: QualityIssue[];
  extractedFields: ExtractedField[];
  assignedTo?: string;
}

interface QualityIssue {
  id: string;
  type: 'accuracy' | 'completeness' | 'formatting' | 'validation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  field?: string;
  suggestion?: string;
  resolved: boolean;
}

interface ExtractedField {
  name: string;
  value: string;
  confidence: number;
  verified: boolean;
  correctedValue?: string;
}

interface QualityMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  type: 'required_field' | 'format_validation' | 'range_check' | 'custom_logic';
  documentTypes: string[];
  isActive: boolean;
  severity: 'warning' | 'error';
  conditions: Record<string, any>;
}

const QualityControlPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'review' | 'metrics' | 'rules' | 'reports'>('review');
  const [selectedFilter, setSelectedFilter] = useState<string>('pending');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Mock data
  const reviewItems: QualityReviewItem[] = [
    {
      id: 'qr-001',
      documentId: 'doc-12345',
      documentName: 'Invoice_ABC_Corp_2024.pdf',
      documentType: 'Invoice',
      submittedAt: '2024-02-20T10:30:00Z',
      status: 'pending',
      priority: 'high',
      aiConfidence: 87,
      issues: [
        {
          id: 'issue-001',
          type: 'accuracy',
          severity: 'medium',
          description: 'Invoice amount appears inconsistent with line items',
          field: 'total_amount',
          suggestion: 'Verify calculation: $1,247.50',
          resolved: false,
        },
        {
          id: 'issue-002',
          type: 'completeness',
          severity: 'low',
          description: 'Purchase order number not detected',
          field: 'po_number',
          resolved: false,
        },
      ],
      extractedFields: [
        { name: 'Invoice Number', value: 'INV-2024-001', confidence: 98, verified: false },
        { name: 'Date', value: '2024-02-15', confidence: 95, verified: false },
        { name: 'Total Amount', value: '$1,247.50', confidence: 87, verified: false },
        { name: 'Vendor Name', value: 'ABC Corporation', confidence: 92, verified: false },
      ],
      assignedTo: 'Sarah Chen',
    },
    {
      id: 'qr-002',
      documentId: 'doc-12346',
      documentName: 'Contract_XYZ_Services.pdf',
      documentType: 'Contract',
      submittedAt: '2024-02-20T09:15:00Z',
      status: 'approved',
      priority: 'normal',
      aiConfidence: 94,
      reviewer: 'Michael Rodriguez',
      reviewedAt: '2024-02-20T11:30:00Z',
      issues: [],
      extractedFields: [
        { name: 'Contract Title', value: 'Professional Services Agreement', confidence: 96, verified: true },
        { name: 'Start Date', value: '2024-03-01', confidence: 89, verified: true },
        { name: 'Contract Value', value: '$50,000', confidence: 91, verified: true },
      ],
    },
    {
      id: 'qr-003',
      documentId: 'doc-12347',
      documentName: 'Receipt_Office_Supplies.jpg',
      documentType: 'Receipt',
      submittedAt: '2024-02-20T08:45:00Z',
      status: 'rejected',
      priority: 'low',
      aiConfidence: 65,
      reviewer: 'Emily Watson',
      reviewedAt: '2024-02-20T10:15:00Z',
      issues: [
        {
          id: 'issue-003',
          type: 'accuracy',
          severity: 'high',
          description: 'Text quality too poor for reliable extraction',
          suggestion: 'Request higher quality scan',
          resolved: false,
        },
      ],
      extractedFields: [
        { name: 'Date', value: '2024-02-??', confidence: 45, verified: false },
        { name: 'Amount', value: '$??.??', confidence: 32, verified: false },
      ],
    },
  ];

  const qualityMetrics: QualityMetric[] = [
    { name: 'Overall Accuracy', value: 94.2, target: 95.0, unit: '%', trend: 'up', status: 'warning' },
    { name: 'Review Completion Rate', value: 89.7, target: 90.0, unit: '%', trend: 'up', status: 'warning' },
    { name: 'Avg Review Time', value: 4.3, target: 5.0, unit: 'min', trend: 'down', status: 'good' },
    { name: 'Auto-Approval Rate', value: 76.8, target: 80.0, unit: '%', trend: 'stable', status: 'warning' },
    { name: 'Rejection Rate', value: 3.2, target: 5.0, unit: '%', trend: 'down', status: 'good' },
    { name: 'Rework Rate', value: 12.1, target: 10.0, unit: '%', trend: 'up', status: 'warning' },
  ];

  const validationRules: ValidationRule[] = [
    {
      id: 'rule-001',
      name: 'Invoice Amount Validation',
      description: 'Ensure invoice amounts are within expected ranges and match line items',
      type: 'range_check',
      documentTypes: ['Invoice', 'Bill'],
      isActive: true,
      severity: 'error',
      conditions: { min_amount: 0, max_amount: 50000 },
    },
    {
      id: 'rule-002',
      name: 'Required Date Fields',
      description: 'All documents must have a valid date field',
      type: 'required_field',
      documentTypes: ['Invoice', 'Receipt', 'Contract'],
      isActive: true,
      severity: 'error',
      conditions: { field: 'date', format: 'YYYY-MM-DD' },
    },
    {
      id: 'rule-003',
      name: 'Vendor Name Completeness',
      description: 'Vendor name must be fully extracted and not truncated',
      type: 'completeness',
      documentTypes: ['Invoice', 'Purchase Order'],
      isActive: true,
      severity: 'warning',
      conditions: { min_length: 3, max_length: 100 },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'approved':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'needs_revision':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'normal':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'low':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-green-700 bg-green-50 border-green-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-amber-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredItems = selectedFilter === 'all'
    ? reviewItems
    : reviewItems.filter(item => item.status === selectedFilter);

  return (
    <DashboardLayout
      title="Quality Control"
      subtitle="Manual review workflows and quality assurance for document processing"
      variant="processing"
      backgroundPattern="subtle"
      headerVariant="extended"
      showBreadcrumbs={true}
      actions={
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Settings className="w-4 h-4" />
            <span>Configure Rules</span>
          </button>
        </div>
      }
    >
      {/* Quality Metrics Overview */}
      <div className="col-span-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardSection
            title="Quality Metrics Overview"
            subtitle="Current quality control performance and accuracy metrics"
            className="bg-gradient-to-br from-white to-slate-50/30 border-slate-200/60"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {qualityMetrics.map((metric, index) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-slate-600">{metric.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`text-sm ${
                        metric.trend === 'up' ? 'text-green-600' :
                        metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                        {metric.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                        {metric.trend === 'stable' && <Activity className="w-4 h-4" />}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getMetricStatusColor(metric.status)
                      }`}>
                        {metric.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-bold text-slate-900">
                        {metric.value}{metric.unit}
                      </span>
                      <p className="text-xs text-slate-500">
                        Target: {metric.target}{metric.unit}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metric.value >= metric.target ? 'bg-green-500' :
                          metric.value >= metric.target * 0.8 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
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
            { id: 'review', label: 'Review Queue', icon: CheckCircle2 },
            { id: 'metrics', label: 'Quality Metrics', icon: BarChart3 },
            { id: 'rules', label: 'Validation Rules', icon: Settings },
            { id: 'reports', label: 'Reports', icon: FileText },
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

      {/* Review Queue */}
      {selectedTab === 'review' && (
        <div className="col-span-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardSection
              title="Quality Review Queue"
              subtitle="Documents requiring manual review and validation"
              className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/60"
            >
              <div className="p-6">
                {/* Filters and Controls */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Items</option>
                      <option value="pending">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="needs_revision">Needs Revision</option>
                    </select>

                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search documents..."
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {selectedItems.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-600">{selectedItems.length} selected</span>
                      <button className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Bulk Approve</span>
                      </button>
                      <button className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 flex items-center space-x-1">
                        <ThumbsDown className="w-4 h-4" />
                        <span>Bulk Reject</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Review Items List */}
                <div className="space-y-4">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-card-hover transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems([...selectedItems, item.id]);
                              } else {
                                setSelectedItems(selectedItems.filter(id => id !== item.id));
                              }
                            }}
                            className="mt-1"
                          />

                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-slate-900">{item.documentName}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                {item.status.replace('_', ' ')}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                                {item.priority}
                              </span>
                              <span className="text-sm text-slate-500">{item.documentType}</span>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                              <span>AI Confidence: {item.aiConfidence}%</span>
                              <span>Submitted: {new Date(item.submittedAt).toLocaleString()}</span>
                              {item.assignedTo && <span>Assigned to: {item.assignedTo}</span>}
                              {item.reviewer && <span>Reviewed by: {item.reviewer}</span>}
                            </div>

                            {/* Issues */}
                            {item.issues.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-sm font-semibold text-slate-800 mb-2">Issues ({item.issues.length})</h4>
                                <div className="space-y-2">
                                  {item.issues.map((issue) => (
                                    <div
                                      key={issue.id}
                                      className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-medium capitalize">{issue.type}</span>
                                            <span className="text-xs capitalize">{issue.severity}</span>
                                            {issue.field && (
                                              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">
                                                {issue.field}
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-sm">{issue.description}</p>
                                          {issue.suggestion && (
                                            <p className="text-sm text-blue-700 mt-1">
                                              <strong>Suggestion:</strong> {issue.suggestion}
                                            </p>
                                          )}
                                        </div>
                                        <button
                                          className={`p-1 rounded ${
                                            issue.resolved ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
                                          }`}
                                        >
                                          {issue.resolved ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Extracted Fields */}
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-slate-800 mb-2">
                                Extracted Fields ({item.extractedFields.length})
                              </h4>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                {item.extractedFields.map((field, idx) => (
                                  <div key={idx} className="bg-slate-50 p-3 rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs font-medium text-slate-600">{field.name}</span>
                                      <span className={`text-xs ${field.verified ? 'text-green-600' : 'text-amber-600'}`}>
                                        {field.confidence}%
                                      </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-900">{field.value}</p>
                                    {field.correctedValue && (
                                      <p className="text-xs text-blue-600 mt-1">
                                        Corrected: {field.correctedValue}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 hover:bg-slate-100 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {item.status === 'pending' && (
                            <>
                              <button className="p-2 hover:bg-green-50 text-green-600 rounded">
                                <ThumbsUp className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-red-50 text-red-600 rounded">
                                <ThumbsDown className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button className="p-2 hover:bg-slate-100 rounded">
                            <MessageSquare className="w-4 h-4" />
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

export default QualityControlPage;