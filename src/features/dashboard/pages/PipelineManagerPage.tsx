/**
 * Pipeline Manager Page - Document Processing Pipeline Control
 * Visual pipeline builder with real-time monitoring and optimization
 */

import { motion } from 'framer-motion';
import {
  GitBranch,
  Play,
  Pause,
  Square,
  Settings,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Cpu,
  Database,
  FileText,
  Filter,
  Users,
  Calendar,
  Activity,
  BarChart3,
  RefreshCw,
  Download,
  Upload,
  Target,
  Layers,
  Code,
  Workflow,
} from 'lucide-react';
import React, { useState } from 'react';

import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';

interface Pipeline {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'paused' | 'stopped' | 'error' | 'draft';
  version: string;
  stages: PipelineStage[];
  performance: {
    throughput: number;
    avgProcessingTime: number;
    successRate: number;
    errorRate: number;
  };
  createdBy: string;
  lastModified: string;
  isTemplate: boolean;
}

interface PipelineStage {
  id: string;
  name: string;
  type: 'input' | 'processing' | 'validation' | 'output' | 'transformation';
  status: 'idle' | 'running' | 'completed' | 'error';
  config: Record<string, any>;
  dependencies: string[];
  metrics: {
    processed: number;
    failed: number;
    avgTime: number;
  };
  position: { x: number; y: number };
}

interface PipelineTemplate {
  id: string;
  name: string;
  description: string;
  category: 'document' | 'data' | 'ml' | 'integration';
  complexity: 'simple' | 'intermediate' | 'advanced';
  stages: number;
  estimatedSetupTime: string;
}

const PipelineManagerPage: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'overview' | 'builder' | 'templates' | 'monitoring'>('overview');
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);

  // Mock data
  const pipelines: Pipeline[] = [
    {
      id: 'pl-001',
      name: 'Financial Document Processing',
      description: 'Complete pipeline for processing financial documents with OCR, validation, and data extraction',
      status: 'running',
      version: '2.1.0',
      stages: [
        {
          id: 'stage-001',
          name: 'Document Input',
          type: 'input',
          status: 'running',
          config: { formats: ['pdf', 'jpg', 'png'] },
          dependencies: [],
          metrics: { processed: 1247, failed: 12, avgTime: 0.5 },
          position: { x: 100, y: 200 },
        },
        {
          id: 'stage-002',
          name: 'OCR Processing',
          type: 'processing',
          status: 'running',
          config: { engine: 'advanced', confidence: 0.85 },
          dependencies: ['stage-001'],
          metrics: { processed: 1235, failed: 8, avgTime: 2.3 },
          position: { x: 300, y: 200 },
        },
        {
          id: 'stage-003',
          name: 'Data Validation',
          type: 'validation',
          status: 'running',
          config: { rules: 'financial', strict: true },
          dependencies: ['stage-002'],
          metrics: { processed: 1227, failed: 15, avgTime: 1.1 },
          position: { x: 500, y: 200 },
        },
        {
          id: 'stage-004',
          name: 'Export Data',
          type: 'output',
          status: 'running',
          config: { format: 'json', destination: 's3' },
          dependencies: ['stage-003'],
          metrics: { processed: 1212, failed: 3, avgTime: 0.8 },
          position: { x: 700, y: 200 },
        },
      ],
      performance: {
        throughput: 845,
        avgProcessingTime: 4.7,
        successRate: 97.2,
        errorRate: 2.8,
      },
      createdBy: 'Sarah Chen',
      lastModified: '2024-02-20T14:30:00Z',
      isTemplate: false,
    },
    {
      id: 'pl-002',
      name: 'Invoice Processing Pipeline',
      description: 'Automated invoice processing with ML-powered field extraction and approval workflow',
      status: 'paused',
      version: '1.8.2',
      stages: [
        {
          id: 'stage-101',
          name: 'Invoice Upload',
          type: 'input',
          status: 'idle',
          config: { autoClassify: true },
          dependencies: [],
          metrics: { processed: 542, failed: 8, avgTime: 0.3 },
          position: { x: 100, y: 300 },
        },
        {
          id: 'stage-102',
          name: 'Field Extraction',
          type: 'processing',
          status: 'idle',
          config: { model: 'invoice-v3', confidence: 0.9 },
          dependencies: ['stage-101'],
          metrics: { processed: 534, failed: 12, avgTime: 3.2 },
          position: { x: 300, y: 300 },
        },
        {
          id: 'stage-103',
          name: 'Approval Workflow',
          type: 'validation',
          status: 'idle',
          config: { threshold: 1000, approvers: ['manager', 'finance'] },
          dependencies: ['stage-102'],
          metrics: { processed: 522, failed: 2, avgTime: 1440 },
          position: { x: 500, y: 300 },
        },
      ],
      performance: {
        throughput: 156,
        avgProcessingTime: 1443.5,
        successRate: 94.8,
        errorRate: 5.2,
      },
      createdBy: 'Michael Rodriguez',
      lastModified: '2024-02-19T09:15:00Z',
      isTemplate: false,
    },
    {
      id: 'pl-003',
      name: 'Contract Analysis Pipeline',
      description: 'AI-powered contract review and risk assessment with compliance checking',
      status: 'running',
      version: '3.0.1',
      stages: [],
      performance: {
        throughput: 234,
        avgProcessingTime: 12.4,
        successRate: 98.6,
        errorRate: 1.4,
      },
      createdBy: 'Emily Watson',
      lastModified: '2024-02-18T16:45:00Z',
      isTemplate: true,
    },
  ];

  const pipelineTemplates: PipelineTemplate[] = [
    {
      id: 'tpl-001',
      name: 'Basic Document OCR',
      description: 'Simple OCR pipeline for extracting text from documents',
      category: 'document',
      complexity: 'simple',
      stages: 3,
      estimatedSetupTime: '5 minutes',
    },
    {
      id: 'tpl-002',
      name: 'Advanced Data Extraction',
      description: 'ML-powered structured data extraction from complex documents',
      category: 'ml',
      complexity: 'advanced',
      stages: 7,
      estimatedSetupTime: '30 minutes',
    },
    {
      id: 'tpl-003',
      name: 'Compliance Document Review',
      description: 'Automated compliance checking and regulatory document processing',
      category: 'document',
      complexity: 'intermediate',
      stages: 5,
      estimatedSetupTime: '15 minutes',
    },
    {
      id: 'tpl-004',
      name: 'API Integration Pipeline',
      description: 'Connect external APIs for data enrichment and processing',
      category: 'integration',
      complexity: 'intermediate',
      stages: 4,
      estimatedSetupTime: '20 minutes',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'paused':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'stopped':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'draft':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStageStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      case 'idle':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStageTypeIcon = (type: string) => {
    switch (type) {
      case 'input':
        return <Upload className="w-4 h-4" />;
      case 'processing':
        return <Cpu className="w-4 h-4" />;
      case 'validation':
        return <CheckCircle className="w-4 h-4" />;
      case 'output':
        return <Download className="w-4 h-4" />;
      case 'transformation':
        return <GitBranch className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'document':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'data':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'ml':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'integration':
        return 'bg-amber-100 text-amber-700 border-amber-200';
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
      title="Pipeline Manager"
      subtitle="Visual pipeline builder and monitoring for enterprise document processing workflows"
      variant="processing"
      backgroundPattern="grid"
      headerVariant="extended"
      showBreadcrumbs={true}
      actions={
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Config</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Pipeline</span>
          </button>
        </div>
      }
    >
      {/* Pipeline Overview Stats */}
      <div className="col-span-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardSection
            title="Pipeline Overview"
            subtitle="Current pipeline status and performance metrics"
            className="bg-gradient-to-br from-white to-slate-50/30 border-slate-200/60"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              {[
                { icon: GitBranch, label: 'Active Pipelines', value: '8', change: '+2', color: 'blue' },
                { icon: Activity, label: 'Avg Throughput', value: '2.4K/hr', change: '+15%', color: 'green' },
                { icon: CheckCircle, label: 'Success Rate', value: '96.8%', change: '+1.2%', color: 'green' },
                { icon: Clock, label: 'Avg Processing Time', value: '4.2s', change: '-0.8s', color: 'purple' },
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
                      stat.change.startsWith('+') || stat.change.startsWith('-0') ? 'text-green-600' :
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
            { id: 'overview', label: 'Pipeline Overview', icon: BarChart3 },
            { id: 'builder', label: 'Visual Builder', icon: GitBranch },
            { id: 'templates', label: 'Templates', icon: Layers },
            { id: 'monitoring', label: 'Monitoring', icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                selectedView === tab.id
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

      {/* Pipeline Overview */}
      {selectedView === 'overview' && (
        <div className="col-span-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardSection
              title="Pipeline Inventory"
              subtitle="Manage and monitor all your processing pipelines"
              className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/60"
            >
              <div className="p-6">
                <div className="space-y-4">
                  {pipelines.map((pipeline, index) => (
                    <motion.div
                      key={pipeline.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-card-hover transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                            <GitBranch className="w-6 h-6 text-blue-600" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-slate-900">{pipeline.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(pipeline.status)}`}>
                                {pipeline.status}
                              </span>
                              <span className="text-sm text-slate-500">v{pipeline.version}</span>
                              {pipeline.isTemplate && (
                                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                                  Template
                                </span>
                              )}
                            </div>

                            <p className="text-slate-600 mb-4">{pipeline.description}</p>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                              <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="text-sm text-slate-600">Throughput</div>
                                <div className="font-semibold text-blue-600">{pipeline.performance.throughput}/hr</div>
                              </div>
                              <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="text-sm text-slate-600">Success Rate</div>
                                <div className="font-semibold text-green-600">{pipeline.performance.successRate}%</div>
                              </div>
                              <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <div className="text-sm text-slate-600">Avg Time</div>
                                <div className="font-semibold text-purple-600">{pipeline.performance.avgProcessingTime}s</div>
                              </div>
                              <div className="text-center p-3 bg-amber-50 rounded-lg">
                                <div className="text-sm text-slate-600">Error Rate</div>
                                <div className="font-semibold text-amber-600">{pipeline.performance.errorRate}%</div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                              <span>Created by {pipeline.createdBy}</span>
                              <span>Modified {new Date(pipeline.lastModified).toLocaleDateString()}</span>
                              <span>{pipeline.stages.length} stages</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {pipeline.status === 'running' && (
                            <button className="p-2 hover:bg-amber-50 text-amber-600 rounded">
                              <Pause className="w-5 h-5" />
                            </button>
                          )}
                          {(pipeline.status === 'paused' || pipeline.status === 'stopped') && (
                            <button className="p-2 hover:bg-green-50 text-green-600 rounded">
                              <Play className="w-5 h-5" />
                            </button>
                          )}
                          <button className="p-2 hover:bg-slate-100 rounded">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded">
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded">
                            <Copy className="w-5 h-5" />
                          </button>
                          <button className="p-2 hover:bg-red-50 text-red-600 rounded">
                            <Trash2 className="w-5 h-5" />
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

      {/* Pipeline Templates */}
      {selectedView === 'templates' && (
        <div className="col-span-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardSection
              title="Pipeline Templates"
              subtitle="Pre-built pipeline templates for common workflows"
              className="bg-gradient-to-br from-white to-green-50/30 border-green-200/60"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pipelineTemplates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-card-hover transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                          <Workflow className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(template.category)}`}>
                            {template.category}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 mb-4">{template.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Complexity:</span>
                          <span className={`font-medium ${getComplexityColor(template.complexity)}`}>
                            {template.complexity}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Stages:</span>
                          <span className="font-medium text-slate-900">{template.stages}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Setup Time:</span>
                          <span className="font-medium text-slate-900">{template.estimatedSetupTime}</span>
                        </div>
                      </div>

                      <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
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

export default PipelineManagerPage;