/**
 * Job Progress Indicator
 * Real-time progress tracking for document processing jobs
 */

import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  AlertCircle,
  FileText,
  Zap
} from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';
import { useJobStatus } from '@/lib/websocket/hooks';

interface JobProgressIndicatorProps {
  jobId: string;
  documentName?: string;
  showDetails?: boolean;
  compact?: boolean;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
}

export function JobProgressIndicator({
  jobId,
  documentName,
  showDetails = true,
  compact = false,
  onComplete,
  onError,
}: JobProgressIndicatorProps) {
  const {
    status,
    progress,
    message,
    result,
    error,
    isProcessing,
    isCompleted,
    isFailed,
  } = useJobStatus(jobId);

  React.useEffect(() => {
    if (isCompleted && result) {
      onComplete?.(result);
    }
    if (isFailed && error) {
      onError?.(error);
    }
  }, [isCompleted, isFailed, result, error, onComplete, onError]);

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-500" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 border-gray-200';
      case 'processing':
        return 'bg-blue-50 border-blue-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'cancelled':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getProgressBarColor = () => {
    switch (status) {
      case 'processing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={cn('h-full', getProgressBarColor())}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <span className="text-sm text-gray-600">{progress}%</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-lg border-2 p-4 transition-all duration-300',
        getStatusColor()
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{getStatusIcon()}</div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">
                {documentName || `Job ${jobId.slice(0, 8)}`}
              </h4>
              {showDetails && message && (
                <p className="text-sm text-gray-600 mt-1">{message}</p>
              )}
            </div>

            {isProcessing && (
              <div className="flex items-center gap-1 text-blue-600">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">Processing</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">{progress}%</span>
            </div>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={cn('h-full relative', getProgressBarColor())}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                )}
              </motion.div>
            </div>
          </div>

          {showDetails && (
            <div className="flex flex-wrap gap-2 mt-3">
              <StatusBadge label="Status" value={status} />
              {result?.metadata?.pages && (
                <StatusBadge label="Pages" value={result.metadata.pages} />
              )}
              {result?.metadata?.processingTime && (
                <StatusBadge
                  label="Time"
                  value={`${(result.metadata.processingTime / 1000).toFixed(1)}s`}
                />
              )}
              {result?.metadata?.confidence && (
                <StatusBadge
                  label="Confidence"
                  value={`${Math.round(result.metadata.confidence * 100)}%`}
                />
              )}
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-700"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Processing failed</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {isCompleted && result?.extractedData && showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-2 bg-green-100 border border-green-200 rounded text-sm text-green-700"
            >
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Processing complete</p>
                  <p className="mt-1">
                    Successfully extracted {Object.keys(result.extractedData).length} fields
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-md border border-gray-200">
      <span className="text-xs text-gray-500">{label}:</span>
      <span className="text-xs font-medium text-gray-900">{value}</span>
    </div>
  );
}

export default JobProgressIndicator;