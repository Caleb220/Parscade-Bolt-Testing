/**
 * Batch Processing Page - Enterprise Document Processing
 * Advanced batch processing with queue management and monitoring
 */

import { motion } from 'framer-motion';
import {
  PlayCircle,
  PauseCircle,
  StopCircle,
  Upload,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  Settings,
  Filter,
  Download,
  Plus,
  Eye,
  MoreHorizontal,
  Zap,
  Users,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import React, { useState } from 'react';

import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';

interface BatchJob {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'paused' | 'queued';
  progress: number;
  totalDocuments: number;
  processedDocuments: number;
  failedDocuments: number;
  startTime: string;
  estimatedCompletion?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdBy: string;
}

const BatchProcessingPage: React.FC = () => {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data
  const batchJobs: BatchJob[] = [
    {
      id: 'batch-001',
      name: 'Q1 Financial Reports Processing',
      status: 'running',
      progress: 67,
      totalDocuments: 1247,
      processedDocuments: 836,
      failedDocuments: 12,
      startTime: '2024-02-20T09:30:00Z',
      estimatedCompletion: '2024-02-20T16:45:00Z',
      priority: 'high',
      createdBy: 'Sarah Chen',
    },
    {
      id: 'batch-002',
      name: 'Contract Archive Migration',
      status: 'completed',
      progress: 100,
      totalDocuments: 856,
      processedDocuments: 851,
      failedDocuments: 5,
      startTime: '2024-02-19T14:20:00Z',
      estimatedCompletion: '2024-02-19T18:30:00Z',
      priority: 'normal',
      createdBy: 'Michael Rodriguez',
    },
    {
      id: 'batch-003',
      name: 'Invoice Batch Processing',
      status: 'queued',
      progress: 0,
      totalDocuments: 3420,
      processedDocuments: 0,
      failedDocuments: 0,
      startTime: '2024-02-20T18:00:00Z',
      priority: 'urgent',
      createdBy: 'Emily Watson',
    },
    {
      id: 'batch-004',
      name: 'Legal Document Review',
      status: 'failed',
      progress: 23,
      totalDocuments: 234,
      processedDocuments: 54,
      failedDocuments: 43,
      startTime: '2024-02-20T11:15:00Z',
      priority: 'normal',
      createdBy: 'David Park',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'completed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'paused':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'queued':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'normal':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'low':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      default:
        return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <PlayCircle className="w-5 h-5 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'paused':
        return <PauseCircle className="w-5 h-5 text-amber-600" />;
      case 'queued':
        return <Clock className="w-5 h-5 text-purple-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredJobs = filterStatus === 'all'
    ? batchJobs
    : batchJobs.filter(job => job.status === filterStatus);

  return (
    <DashboardLayout
      title="Batch Processing"
      subtitle="Enterprise-scale document processing with advanced queue management"
      variant="processing"
      backgroundPattern="subtle"
      headerVariant="extended"
      showBreadcrumbs={true}
      actions={
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Settings className="w-4 h-4" />
            <span>Configure</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Batch Job</span>
          </button>
        </div>
      }
    >
      {/* Processing Overview Stats */}
      <div className="col-span-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardSection
            title="Processing Overview"
            subtitle="Current batch processing status and performance"
            className="bg-gradient-to-br from-white to-slate-50/30 border-slate-200/60"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              {[
                { icon: Zap, label: 'Active Jobs', value: '2', change: '+1', color: 'blue' },
                { icon: FileText, label: 'Documents Queued', value: '5.2K', change: '+234', color: 'purple' },
                { icon: CheckCircle, label: 'Completion Rate', value: '94.2%', change: '+2.1%', color: 'green' },
                { icon: Clock, label: 'Avg Processing Time', value: '2.4min', change: '-18%', color: 'teal' },
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
                      stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                      stat.color === 'green' ? 'bg-green-100 text-green-600' :
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

      {/* Batch Jobs Management */}
      <div className="col-span-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DashboardSection
            title="Batch Jobs Queue"
            subtitle="Monitor and manage document processing jobs"
            className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/60"
          >
            <div className="p-6">
              {/* Filters and Actions */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Jobs</option>
                    <option value="running">Running</option>
                    <option value="queued">Queued</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="paused">Paused</option>
                  </select>
                  <button className="flex items-center space-x-2 border border-slate-300 px-3 py-2 rounded-lg hover:bg-slate-50">
                    <Filter className="w-4 h-4" />
                    <span>More Filters</span>
                  </button>
                </div>

                {selectedJobs.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600">{selectedJobs.length} selected</span>
                    <button className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700">
                      Bulk Actions
                    </button>
                  </div>
                )}
              </div>

              {/* Jobs List */}
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-card transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedJobs.includes(job.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedJobs([...selectedJobs, job.id]);
                            } else {
                              setSelectedJobs(selectedJobs.filter(id => id !== job.id));
                            }
                          }}
                          className="mt-1"
                        />

                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getStatusIcon(job.status)}
                            <h3 className="font-semibold text-slate-900">{job.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(job.priority)}`}>
                              {job.priority}
                            </span>
                          </div>

                          <div className="flex items-center space-x-6 text-sm text-slate-600 mb-3">
                            <span>{job.processedDocuments} / {job.totalDocuments} documents</span>
                            {job.failedDocuments > 0 && (
                              <span className="text-red-600">{job.failedDocuments} failed</span>
                            )}
                            <span>Created by {job.createdBy}</span>
                            <span>Started {new Date(job.startTime).toLocaleString()}</span>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-2">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-slate-600">Progress</span>
                              <span className="text-slate-900 font-medium">{job.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  job.status === 'running' ? 'bg-blue-500' :
                                  job.status === 'completed' ? 'bg-green-500' :
                                  job.status === 'failed' ? 'bg-red-500' :
                                  job.status === 'paused' ? 'bg-amber-500' : 'bg-purple-500'
                                }`}
                                style={{ width: `${job.progress}%` }}
                              />
                            </div>
                          </div>

                          {job.estimatedCompletion && job.status === 'running' && (
                            <p className="text-sm text-slate-500">
                              Estimated completion: {new Date(job.estimatedCompletion).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-2 hover:bg-slate-100 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        {job.status === 'running' && (
                          <button className="p-2 hover:bg-slate-100 rounded">
                            <PauseCircle className="w-4 h-4" />
                          </button>
                        )}
                        {job.status === 'paused' && (
                          <button className="p-2 hover:bg-slate-100 rounded">
                            <PlayCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 hover:bg-slate-100 rounded">
                          <MoreHorizontal className="w-4 h-4" />
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
    </DashboardLayout>
  );
};

export default BatchProcessingPage;