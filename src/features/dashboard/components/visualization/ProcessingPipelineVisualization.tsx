/**
 * Processing Pipeline Visualization Component
 * Interactive real-time visualization of document processing workflow
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Bot,
  Database,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  ArrowRight,
  Gauge,
  Activity,
  TrendingUp,
  Filter,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { parscadeAnimations } from '@/shared/design/theme';

interface PipelineStage {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'idle' | 'active' | 'completed' | 'error';
  metrics: {
    processed: number;
    pending: number;
    errors: number;
    avgTime: number;
  };
  color: string;
}

interface ProcessingJob {
  id: string;
  filename: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  currentStage: number;
  progress: number;
  startTime: number;
  estimatedCompletion?: number;
}

interface ProcessingPipelineProps {
  className?: string;
  realTimeUpdates?: boolean;
  showMetrics?: boolean;
  variant?: 'compact' | 'detailed' | 'minimal';
}

const ProcessingPipelineVisualization: React.FC<ProcessingPipelineProps> = ({
  className = '',
  realTimeUpdates = true,
  showMetrics = true,
  variant = 'detailed',
}) => {
  // Mock pipeline stages - in real app, this would come from API
  const [stages] = useState<PipelineStage[]>([
    {
      id: 'upload',
      name: 'Document Upload',
      description: 'Receiving and validating documents',
      icon: <Upload className="w-5 h-5" />,
      status: 'completed',
      metrics: { processed: 1247, pending: 3, errors: 2, avgTime: 0.5 },
      color: 'primary',
    },
    {
      id: 'preprocessing',
      name: 'Preprocessing',
      description: 'OCR and format standardization',
      icon: <Filter className="w-5 h-5" />,
      status: 'active',
      metrics: { processed: 1244, pending: 8, errors: 1, avgTime: 2.3 },
      color: 'purple',
    },
    {
      id: 'extraction',
      name: 'AI Extraction',
      description: 'Extracting structured data with AI',
      icon: <Bot className="w-5 h-5" />,
      status: 'active',
      metrics: { processed: 1236, pending: 12, errors: 3, avgTime: 4.7 },
      color: 'teal',
    },
    {
      id: 'validation',
      name: 'Data Validation',
      description: 'Validating and enriching extracted data',
      icon: <CheckCircle className="w-5 h-5" />,
      status: 'active',
      metrics: { processed: 1224, pending: 7, errors: 1, avgTime: 1.8 },
      color: 'success',
    },
    {
      id: 'storage',
      name: 'Data Storage',
      description: 'Storing processed data and metadata',
      icon: <Database className="w-5 h-5" />,
      status: 'active',
      metrics: { processed: 1217, pending: 4, errors: 0, avgTime: 0.9 },
      color: 'neutral',
    },
  ]);

  // Mock processing jobs for visualization
  const [jobs, setJobs] = useState<ProcessingJob[]>([
    {
      id: '1',
      filename: 'invoice_batch_001.pdf',
      status: 'processing',
      currentStage: 2,
      progress: 65,
      startTime: Date.now() - 30000,
      estimatedCompletion: Date.now() + 15000,
    },
    {
      id: '2',
      filename: 'contract_legal_v2.docx',
      status: 'processing',
      currentStage: 1,
      progress: 25,
      startTime: Date.now() - 10000,
      estimatedCompletion: Date.now() + 35000,
    },
    {
      id: '3',
      filename: 'financial_report_q3.xlsx',
      status: 'queued',
      currentStage: 0,
      progress: 0,
      startTime: Date.now(),
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeUpdates) return;

    const interval = setInterval(() => {
      setJobs(prevJobs =>
        prevJobs.map(job => {
          if (job.status === 'processing' && job.progress < 100) {
            const newProgress = Math.min(job.progress + Math.random() * 5, 100);
            const newStage = Math.floor(newProgress / 20);

            return {
              ...job,
              progress: newProgress,
              currentStage: Math.min(newStage, stages.length - 1),
              status: newProgress >= 100 ? 'completed' : 'processing',
            };
          }
          return job;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [realTimeUpdates, stages.length]);

  const getStageColor = (color: string, variant: 'bg' | 'text' | 'border') => {
    const colors = {
      primary: {
        bg: 'bg-primary-100',
        text: 'text-primary-600',
        border: 'border-primary-200',
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        border: 'border-purple-200',
      },
      teal: {
        bg: 'bg-teal-100',
        text: 'text-teal-600',
        border: 'border-teal-200',
      },
      success: {
        bg: 'bg-success-100',
        text: 'text-success-600',
        border: 'border-success-200',
      },
      neutral: {
        bg: 'bg-neutral-100',
        text: 'text-neutral-600',
        border: 'border-neutral-200',
      },
    };
    return colors[color as keyof typeof colors]?.[variant] || colors.neutral[variant];
  };

  const getStatusIcon = (status: PipelineStage['status']) => {
    switch (status) {
      case 'active':
        return <Activity className="w-4 h-4 text-primary-600 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-error-600" />;
      default:
        return <Clock className="w-4 h-4 text-neutral-500" />;
    }
  };

  if (variant === 'minimal') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900">Processing Pipeline</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
            <span className="text-sm text-neutral-600">Active</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center space-x-2 flex-shrink-0">
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center border-2
                ${getStageColor(stage.color, 'bg')} ${getStageColor(stage.color, 'border')}
              `}
              >
                {stage.status === 'active' ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Zap className="w-4 h-4 text-primary-600" />
                  </motion.div>
                ) : (
                  stage.icon
                )}
              </div>
              {index < stages.length - 1 && <ArrowRight className="w-4 h-4 text-neutral-400" />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        {...parscadeAnimations.fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center shadow-parscade-xs"
            >
              <Gauge className="w-5 h-5 text-primary-600" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900">Processing Pipeline</h3>
              <p className="text-sm text-neutral-600">Real-time document processing workflow</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-success-600">Pipeline Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-primary-600" />
            <span className="text-sm text-neutral-600">98.5% efficiency</span>
          </div>
        </div>
      </motion.div>

      {/* Pipeline Stages */}
      <div className="relative">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.id}
              {...parscadeAnimations.staggerItem}
              style={{ animationDelay: `${index * 100}ms` }}
              className="flex-1 relative"
            >
              {/* Stage Card */}
              <div
                className={`
                relative bg-white/95 backdrop-blur-sm border rounded-2xl p-4 lg:p-6
                shadow-card hover:shadow-card-hover transition-all duration-300 group
                ${stage.status === 'active' ? 'border-primary-300 bg-gradient-to-br from-primary-25/50 to-white' : 'border-neutral-200/60'}
              `}
              >
                {/* Status Indicator */}
                <div className="absolute -top-2 -right-2">
                  <motion.div
                    animate={stage.status === 'active' ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`
                      w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-parscade-xs
                      ${
                        stage.status === 'active'
                          ? 'bg-primary-500'
                          : stage.status === 'completed'
                            ? 'bg-success-500'
                            : stage.status === 'error'
                              ? 'bg-error-500'
                              : 'bg-neutral-400'
                      }
                    `}
                  >
                    {getStatusIcon(stage.status)}
                  </motion.div>
                </div>

                {/* Stage Icon */}
                <div
                  className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-parscade-xs
                  ${getStageColor(stage.color, 'bg')} ${getStageColor(stage.color, 'text')}
                `}
                >
                  {stage.status === 'active' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      {stage.icon}
                    </motion.div>
                  ) : (
                    stage.icon
                  )}
                </div>

                {/* Stage Info */}
                <div className="space-y-2">
                  <h4 className="font-bold text-neutral-900">{stage.name}</h4>
                  <p className="text-sm text-neutral-600 line-clamp-2">{stage.description}</p>

                  {/* Metrics */}
                  {showMetrics && (
                    <div className="space-y-2 pt-2 border-t border-neutral-100">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Processed:</span>
                          <span className="font-medium text-neutral-700">
                            {stage.metrics.processed.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Pending:</span>
                          <span className="font-medium text-warning-700">
                            {stage.metrics.pending}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Avg Time:</span>
                          <span className="font-medium text-neutral-700">
                            {stage.metrics.avgTime}s
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Errors:</span>
                          <span className="font-medium text-error-700">{stage.metrics.errors}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Connection Arrow */}
              {index < stages.length - 1 && (
                <div className="hidden lg:block absolute -right-8 top-1/2 transform -translate-y-1/2 z-10">
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center border border-primary-200 shadow-parscade-xs"
                  >
                    <ArrowRight className="w-4 h-4 text-primary-600" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live Processing Jobs */}
      {variant === 'detailed' && jobs.length > 0 && (
        <motion.div
          {...parscadeAnimations.slideInRight}
          className="bg-white/95 backdrop-blur-sm border border-neutral-200/60 rounded-2xl p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary-600" />
              <h4 className="font-bold text-neutral-900">Live Processing Jobs</h4>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              <span className="text-sm text-primary-600">Real-time</span>
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {jobs.map(job => (
                <motion.div
                  key={job.id}
                  {...parscadeAnimations.slideInLeft}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200/60"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div
                      className={`
                      w-8 h-8 rounded-lg flex items-center justify-center
                      ${
                        job.status === 'processing'
                          ? 'bg-primary-100 text-primary-600'
                          : job.status === 'completed'
                            ? 'bg-success-100 text-success-600'
                            : job.status === 'failed'
                              ? 'bg-error-100 text-error-600'
                              : 'bg-neutral-100 text-neutral-600'
                      }
                    `}
                    >
                      <FileText className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {job.filename}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-neutral-500">
                          Stage: {stages[job.currentStage]?.name || 'Unknown'}
                        </span>
                        {job.estimatedCompletion && (
                          <span className="text-xs text-neutral-500">
                            • ETA:{' '}
                            {Math.max(0, Math.round((job.estimatedCompletion - Date.now()) / 1000))}
                            s
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-neutral-900">
                        {Math.round(job.progress)}%
                      </div>
                      <div className="w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${job.progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProcessingPipelineVisualization;
