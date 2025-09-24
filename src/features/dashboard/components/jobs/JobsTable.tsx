/**
 * Jobs Table Component
 * Main table displaying jobs with actions and selection
 */

import { motion } from 'framer-motion';
import {
  Eye, Play, Square, RotateCcw, Trash2, FileText
} from 'lucide-react';
import React from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { formatDate, formatDuration } from '@/shared/utils/formatters';
import type { Job } from '@/types/api-types';

interface JobsTableProps {
  jobs: Job[];
  selectedJobs: Set<string>;
  isLoading: boolean;
  onSelectJob: (jobId: string) => void;
  onSelectAll: () => void;
  onView: (job: Job) => void;
  onStart: (job: Job) => void;
  onCancel: (job: Job) => void;
  onRetry: (job: Job) => void;
  onDelete: (job: Job) => void;
}

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

const JobsTable: React.FC<JobsTableProps> = ({
  jobs,
  selectedJobs,
  isLoading,
  onSelectJob,
  onSelectAll,
  onView,
  onStart,
  onCancel,
  onRetry,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <ParscadeCard className="overflow-hidden">
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="w-20 h-6 bg-gray-200 rounded"></div>
              <div className="w-24 h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </ParscadeCard>
    );
  }

  if (jobs.length === 0) {
    return (
      <ParscadeCard className="p-12 text-center">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </ParscadeCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <ParscadeCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-8 px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedJobs.size === jobs.length && jobs.length > 0}
                    onChange={onSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job, index) => (
                <motion.tr
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedJobs.has(job.id)}
                      onChange={() => onSelectJob(job.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 truncate max-w-xs">
                        {job.name || `${job.type} Job`}
                      </div>
                      <div className="text-sm text-gray-500">
                        Type: {job.type} • ID: {job.id.slice(0, 8)}
                      </div>
                      {job.project && (
                        <div className="text-sm text-gray-500">
                          Project: {job.project.name}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={getStatusColor(job.status)}
                      showIcon
                      animated={job.status === 'running'}
                    >
                      {job.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress || 0}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {job.progress || 0}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.duration ? formatDuration(job.duration) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(job.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Eye className="w-4 h-4" />}
                        onClick={() => onView(job)}
                      >
                        View
                      </Button>

                      {job.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Play className="w-4 h-4" />}
                          onClick={() => onStart(job)}
                          className="text-green-600 hover:text-green-700"
                        >
                          Start
                        </Button>
                      )}

                      {job.status === 'running' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Square className="w-4 h-4" />}
                          onClick={() => onCancel(job)}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          Cancel
                        </Button>
                      )}

                      {job.status === 'failed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<RotateCcw className="w-4 h-4" />}
                          onClick={() => onRetry(job)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Retry
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Trash2 className="w-4 h-4" />}
                        onClick={() => onDelete(job)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </ParscadeCard>
    </motion.div>
  );
};

export default React.memo(JobsTable);