/**
 * Job Actions Card Component
 * Action buttons and controls for job management
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  RotateCcw,
  XCircle,
  Edit3,
  Trash2,
  RefreshCw,
  Download
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { ParscadeCard } from '@/shared/components/brand';
import type { Job } from '@/types/api-types';

interface JobActionsCardProps {
  job: Job;
  onStart: () => void;
  onCancel: () => void;
  onRetry: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRefresh: () => void;
  onDownload?: () => void;
  isLoading?: boolean;
}

const JobActionsCard: React.FC<JobActionsCardProps> = ({
  job,
  onStart,
  onCancel,
  onRetry,
  onEdit,
  onDelete,
  onRefresh,
  onDownload,
  isLoading = false,
}) => {
  const canStart = job.status === 'pending';
  const canCancel = job.status === 'running';
  const canRetry = job.status === 'failed';
  const canDownload = job.status === 'completed' && onDownload;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <ParscadeCard className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Job Actions
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Primary Actions */}
          {canStart && (
            <Button
              leftIcon={<Play className="w-4 h-4" />}
              onClick={onStart}
              disabled={isLoading}
              className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
              glow
            >
              Start Job
            </Button>
          )}

          {canCancel && (
            <Button
              leftIcon={<XCircle className="w-4 h-4" />}
              onClick={onCancel}
              disabled={isLoading}
              className="text-yellow-600 hover:text-yellow-700 border-yellow-200 hover:border-yellow-300"
            >
              Cancel Job
            </Button>
          )}

          {canRetry && (
            <Button
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={onRetry}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
              glow
            >
              Retry Job
            </Button>
          )}

          {canDownload && (
            <Button
              leftIcon={<Download className="w-4 h-4" />}
              onClick={onDownload}
              disabled={isLoading}
              className="text-purple-600 hover:text-purple-700 border-purple-200 hover:border-purple-300"
            >
              Download Results
            </Button>
          )}

          {/* Secondary Actions */}
          <Button
            variant="outline"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={onRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>

          <Button
            variant="outline"
            leftIcon={<Edit3 className="w-4 h-4" />}
            onClick={onEdit}
            disabled={isLoading || job.status === 'running'}
          >
            Edit Job
          </Button>

          <Button
            variant="outline"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={onDelete}
            disabled={isLoading || job.status === 'running'}
            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 col-span-2"
          >
            Delete Job
          </Button>
        </div>

        {/* Action Hints */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Tips</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {canStart && (
              <li>• Click "Start Job" to begin processing</li>
            )}
            {canCancel && (
              <li>• Click "Cancel Job" to stop processing (cannot be undone)</li>
            )}
            {canRetry && (
              <li>• Click "Retry Job" to restart with the same configuration</li>
            )}
            {canDownload && (
              <li>• Click "Download Results" to get the processed output</li>
            )}
            <li>• Edit job settings when not running</li>
            <li>• Refresh to get the latest status</li>
          </ul>
        </div>
      </ParscadeCard>
    </motion.div>
  );
};

export default React.memo(JobActionsCard);