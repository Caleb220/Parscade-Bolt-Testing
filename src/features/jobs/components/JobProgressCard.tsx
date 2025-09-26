/**
 * Job Progress Card Component
 * Progress visualization and status display
 */

import { motion } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import React from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import { formatDuration } from '@/shared/utils/formatters';
import type { Job } from '@/types/api-types';

interface JobProgressCardProps {
  job: Job;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'failed':
      return <XCircle className="w-5 h-5 text-red-600" />;
    case 'running':
      return <Activity className="w-5 h-5 text-blue-600" />;
    case 'pending':
      return <Clock className="w-5 h-5 text-yellow-600" />;
    case 'cancelled':
      return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    default:
      return <Clock className="w-5 h-5 text-gray-600" />;
  }
};

const getStatusMessage = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Job completed successfully';
    case 'failed':
      return 'Job failed during processing';
    case 'running':
      return 'Job is currently processing';
    case 'pending':
      return 'Job is waiting to be processed';
    case 'cancelled':
      return 'Job was cancelled';
    default:
      return 'Unknown status';
  }
};

const JobProgressCard: React.FC<JobProgressCardProps> = ({ job }) => {
  const progress = job.progress || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <ParscadeCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Processing Status</h2>
          <div className="flex items-center space-x-2">
            {getStatusIcon(job.status)}
            <span className="text-sm font-medium text-gray-900">
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {job.status === 'running' && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-blue-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Status Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-gray-700">{getStatusMessage(job.status)}</span>
          </div>

          {job.duration && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Duration</span>
              <span className="text-gray-900">{formatDuration(job.duration)}</span>
            </div>
          )}

          {job.error_message && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 mb-1">Error Details</h4>
                  <p className="text-sm text-red-700">{job.error_message}</p>
                </div>
              </div>
            </div>
          )}

          {job.status === 'completed' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-800 mb-1">Processing Complete</h4>
                  <p className="text-sm text-green-700">
                    Your job has been processed successfully. Results are available for download.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ParscadeCard>
    </motion.div>
  );
};

export default React.memo(JobProgressCard);
