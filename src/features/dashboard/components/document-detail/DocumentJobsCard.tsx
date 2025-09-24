/**
 * Document Jobs Card Component
 * Processing jobs list and management
 */

import { motion } from 'framer-motion';
import { Activity, Eye, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ParscadeCard } from '@/shared/components/brand';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { formatDate, formatDuration } from '@/shared/utils/formatters';
import type { Job } from '@/types/api-types';

interface DocumentJobsCardProps {
  jobs: Job[];
  isLoading?: boolean;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'failed':
      return <XCircle className="w-4 h-4 text-red-600" />;
    case 'running':
      return <Activity className="w-4 h-4 text-blue-600" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-600" />;
    case 'cancelled':
      return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    default:
      return <Clock className="w-4 h-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'success';
    case 'failed': return 'destructive';
    case 'running': return 'default';
    case 'pending': return 'secondary';
    case 'cancelled': return 'outline';
    default: return 'secondary';
  }
};

const DocumentJobsCard: React.FC<DocumentJobsCardProps> = ({
  jobs,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ParscadeCard className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </ParscadeCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <ParscadeCard className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Processing Jobs
            </h2>
            <p className="text-sm text-gray-500">
              Jobs related to this document
            </p>
          </div>
        </div>

        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <div className="font-medium text-gray-900">
                        {job.name || `${job.type} Job`}
                      </div>
                      <div className="text-sm text-gray-500 space-x-2">
                        <span>Type: {job.type}</span>
                        <span>•</span>
                        <span>Created: {formatDate(job.created_at)}</span>
                        {job.duration && (
                          <>
                            <span>•</span>
                            <span>Duration: {formatDuration(job.duration)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={getStatusColor(job.status)}
                      showIcon
                      animated={job.status === 'running'}
                    >
                      {job.status}
                    </Badge>

                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Eye className="w-4 h-4" />}
                      onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
                    >
                      View
                    </Button>
                  </div>
                </div>

                {job.status === 'running' && job.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-gray-900">{job.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Processing Jobs
            </h3>
            <p className="text-gray-500">
              No processing jobs are associated with this document yet.
            </p>
          </div>
        )}
      </ParscadeCard>
    </motion.div>
  );
};

export default React.memo(DocumentJobsCard);