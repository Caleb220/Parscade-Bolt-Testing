/**
 * Custom Reports Page - Enterprise Reporting Engine
 * Advanced report builder with drag-and-drop interface and scheduling
 */

import { motion } from 'framer-motion';
import {
  Plus,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Download,
  Edit3,
  Copy,
  Trash2,
  Share2,
  Filter,
  Search,
  Clock,
  Users,
  Star,
  Settings,
  Play,
  Pause,
  MoreHorizontal,
  DragHandleDots2Icon,
  Layout,
  Table,
  LineChart,
  Database,
  Eye,
  AlertCircle,
} from 'lucide-react';
import React, { useState } from 'react';

import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';

interface CustomReport {
  id: string;
  name: string;
  description: string;
  type: 'table' | 'chart' | 'dashboard' | 'export';
  status: 'active' | 'draft' | 'scheduled' | 'archived';
  lastRun: string;
  nextRun?: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  createdBy: string;
  createdAt: string;
  charts: number;
  dataPoints: number;
  isFavorite: boolean;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'operational' | 'compliance' | 'analytics';
  icon: React.ComponentType<{ className?: string }>;
  complexity: 'simple' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

const CustomReportsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'reports' | 'templates' | 'builder' | 'scheduled'>('reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  // Mock data
  const customReports: CustomReport[] = [
    {
      id: 'rep-001',
      name: 'Monthly Processing Summary',
      description: 'Comprehensive monthly report on document processing metrics and KPIs',
      type: 'dashboard',
      status: 'active',
      lastRun: '2024-02-20T09:00:00Z',
      nextRun: '2024-03-01T09:00:00Z',
      frequency: 'monthly',
      recipients: ['management@company.com', 'operations@company.com'],
      createdBy: 'Sarah Chen',
      createdAt: '2024-01-15',
      charts: 8,
      dataPoints: 15420,
      isFavorite: true,
    },
    {
      id: 'rep-002',
      name: 'Daily Operations Dashboard',
      description: 'Real-time operational metrics for daily team standup meetings',
      type: 'dashboard',
      status: 'active',
      lastRun: '2024-02-20T08:00:00Z',
      nextRun: '2024-02-21T08:00:00Z',
      frequency: 'daily',
      recipients: ['team-leads@company.com'],
      createdBy: 'Michael Rodriguez',
      createdAt: '2024-02-01',
      charts: 6,
      dataPoints: 8340,
      isFavorite: false,
    },
    {
      id: 'rep-003',
      name: 'Compliance Audit Report',
      description: 'Quarterly compliance review with detailed audit trails and findings',
      type: 'export',
      status: 'scheduled',
      lastRun: '2024-01-31T15:00:00Z',
      nextRun: '2024-04-30T15:00:00Z',
      frequency: 'monthly',
      recipients: ['compliance@company.com', 'legal@company.com'],
      createdBy: 'Emily Watson',
      createdAt: '2023-12-10',
      charts: 12,
      dataPoints: 23450,
      isFavorite: true,
    },
    {
      id: 'rep-004',
      name: 'Cost Analysis Deep Dive',
      description: 'Detailed cost breakdown and ROI analysis for processing operations',
      type: 'chart',
      status: 'draft',
      lastRun: '2024-02-18T14:30:00Z',
      frequency: 'weekly',
      recipients: ['finance@company.com'],
      createdBy: 'David Park',
      createdAt: '2024-02-15',
      charts: 4,
      dataPoints: 5620,
      isFavorite: false,
    },
  ];

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'tpl-001',
      name: 'Executive Summary',
      description: 'High-level KPIs and metrics for C-suite reporting',
      category: 'financial',
      icon: TrendingUp,
      complexity: 'simple',
      estimatedTime: '5 minutes',
    },
    {
      id: 'tpl-002',
      name: 'Processing Analytics',
      description: 'Detailed document processing performance analysis',
      category: 'operational',
      icon: BarChart3,
      complexity: 'intermediate',
      estimatedTime: '15 minutes',
    },
    {
      id: 'tpl-003',
      name: 'Compliance Dashboard',
      description: 'Regulatory compliance tracking and audit preparation',
      category: 'compliance',
      icon: AlertCircle,
      complexity: 'advanced',
      estimatedTime: '30 minutes',
    },
    {
      id: 'tpl-004',
      name: 'User Activity Report',
      description: 'Team productivity and usage pattern analysis',
      category: 'analytics',
      icon: Users,
      complexity: 'intermediate',
      estimatedTime: '12 minutes',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'scheduled':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'draft':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'archived':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dashboard':
        return <Layout className="w-4 h-4" />;
      case 'chart':
        return <BarChart3 className="w-4 h-4" />;
      case 'table':
        return <Table className="w-4 h-4" />;
      case 'export':
        return <Download className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'operational':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'compliance':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'analytics':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return 'text-green-600';
      case 'intermediate':
        return 'text-amber-600';
      case 'advanced':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <DashboardLayout
      title="Custom Reports"
      subtitle="Create, schedule, and manage enterprise reporting with advanced analytics"
      variant="analytics"
      backgroundPattern="subtle"
      headerVariant="extended"
      showBreadcrumbs={true}
      actions={
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Report</span>
          </button>
        </div>
      }
    >
      {/* Reports Overview Stats */}
      <div className="col-span-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardSection
            title="Reports Overview"
            subtitle="Current reporting status and usage analytics"
            className="bg-gradient-to-br from-white to-slate-50/30 border-slate-200/60"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              {[
                { icon: FileText, label: 'Total Reports', value: '47', change: '+8', color: 'blue' },
                { icon: Calendar, label: 'Scheduled Reports', value: '23', change: '+3', color: 'green' },
                { icon: Download, label: 'Downloads This Month', value: '1.2K', change: '+156', color: 'purple' },
                { icon: Clock, label: 'Avg Generation Time', value: '4.2s', change: '-1.3s', color: 'teal' },
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
                      stat.color === 'teal' ? 'bg-teal-100 text-teal-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' :
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
            { id: 'reports', label: 'My Reports', icon: FileText },
            { id: 'templates', label: 'Templates', icon: Layout },
            { id: 'builder', label: 'Report Builder', icon: Edit3 },
            { id: 'scheduled', label: 'Scheduled', icon: Calendar },
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

      {/* Reports List */}
      {selectedTab === 'reports' && (
        <div className="col-span-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardSection
              title="Custom Reports"
              subtitle="Manage and organize your custom reporting suite"
              className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/60"
            >
              <div className="p-6">
                {/* Search and Filters */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search reports..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="flex items-center space-x-2 border border-slate-300 px-3 py-2 rounded-lg hover:bg-slate-50">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                  </div>

                  {selectedReports.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-600">{selectedReports.length} selected</span>
                      <button className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700">
                        Bulk Actions
                      </button>
                    </div>
                  )}
                </div>

                {/* Reports Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {customReports.map((report) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-card-hover transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                            {getTypeIcon(report.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-slate-900">{report.name}</h3>
                              {report.isFavorite && (
                                <Star className="w-4 h-4 text-amber-500 fill-current" />
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{report.description}</p>
                            <div className="flex items-center space-x-3 text-xs text-slate-500">
                              <span>{report.charts} charts</span>
                              <span>{report.dataPoints.toLocaleString()} data points</span>
                              <span>by {report.createdBy}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                          <button className="p-1 hover:bg-slate-100 rounded">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Frequency</span>
                          <span className="font-medium capitalize">{report.frequency}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Last Run</span>
                          <span className="font-medium">{new Date(report.lastRun).toLocaleDateString()}</span>
                        </div>
                        {report.nextRun && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Next Run</span>
                            <span className="font-medium text-blue-600">{new Date(report.nextRun).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:bg-slate-100 rounded transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1">
                            <Play className="w-3 h-3" />
                            <span>Run</span>
                          </button>
                          <button className="border border-slate-300 px-3 py-1.5 rounded text-sm hover:bg-slate-50 transition-colors flex items-center space-x-1">
                            <Download className="w-3 h-3" />
                            <span>Export</span>
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

      {/* Templates */}
      {selectedTab === 'templates' && (
        <div className="col-span-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardSection
              title="Report Templates"
              subtitle="Professional templates to jumpstart your reporting"
              className="bg-gradient-to-br from-white to-green-50/30 border-green-200/60"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reportTemplates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-card-hover transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                          <template.icon className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(template.category)}`}>
                            {template.category}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 mb-4">{template.description}</p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-600">Complexity:</span>
                          <span className={`font-medium ${getComplexityColor(template.complexity)}`}>
                            {template.complexity}
                          </span>
                        </div>
                        <span className="text-slate-500">{template.estimatedTime}</span>
                      </div>

                      <button className="w-full bg-green-600 text-white py-2 rounded-lg mt-4 hover:bg-green-700 transition-colors">
                        Use Template
                      </button>
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

export default CustomReportsPage;