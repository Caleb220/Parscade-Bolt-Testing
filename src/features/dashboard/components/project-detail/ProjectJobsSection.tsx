/**
 * Project Jobs Section Component
 * Job monitoring and management for a project
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Activity, Eye, Play, Square, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import { ParscadeCard } from '@/shared/components/brand';
import { formatDate, formatDuration } from '@/shared/utils/formatters';
import type { Job } from '@/types/api-types';

interface ProjectJobsSectionProps {
  jobs: Job[];
  isLoading?: boolean;
  onStartJob: (job: Job) => void;
  onCancelJob: (job: Job) => void;
  onRetryJob: (job: Job) => void;
}

interface JobCardProps {
  job: Job;
  onView: () => void;
  onStart: () => void;
  onCancel: () => void;
  onRetry: () => void;
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

const JobCard: React.FC<JobCardProps> = React.memo(({
  job,
  onView,
  onStart,
  onCancel,
  onRetry,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    whileHover={{ y: -2 }}
  >
    <ParscadeCard className="p-6 h-full hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center">
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {job.name || `${job.type} Job`}
            </h3>
            <p className="text-sm text-gray-500">
              {job.type} • {job.id.slice(0, 8)}
            </p>
          </div>
        </div>

        <Badge
          variant={getStatusColor(job.status)}
          showIcon
          animated={job.status === 'running'}
        >
          {job.status}
        </Badge>
      </div>

      {/* Progress Bar */}
      {job.status === 'running' && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Progress</span>
            <span className="text-gray-900">{job.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${job.progress || 0}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Duration</span>
          <span className="text-gray-900">
            {job.duration ? formatDuration(job.duration) : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Created</span>
          <span className="text-gray-900">
            {formatDate(job.created_at)}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Eye className="w-4 h-4" />}
          onClick={onView}
          fullWidth
        >
          View
        </Button>

        {job.status === 'pending' && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Play className="w-4 h-4" />}
            onClick={onStart}
            className="text-green-600 hover:text-green-700"
          >
            Start
          </Button>
        )}

        {job.status === 'running' && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Square className="w-4 h-4" />}
            onClick={onCancel}
            className="text-yellow-600 hover:text-yellow-700"
          >
            Cancel
          </Button>
        )}

        {job.status === 'failed' && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={onRetry}
            className="text-blue-600 hover:text-blue-700"
          >
            Retry
          </Button>
        )}
      </div>
    </ParscadeCard>
  </motion.div>
));

JobCard.displayName = 'JobCard';

const ProjectJobsSection: React.FC<ProjectJobsSectionProps> = ({
  jobs,
  isLoading = false,
  onStartJob,
  onCancelJob,
  onRetryJob,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = useMemo(() => {
    if (!searchTerm) return jobs;
    return jobs.filter(job =>
      (job.name && job.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      job.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-6"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Processing Jobs
          </h2>
          <p className="text-gray-600 mt-1">
            Monitor and manage processing jobs for this project
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          fullWidth
        />
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ParscadeCard key={i} className="p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </ParscadeCard>
          ))}
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <JobCard
                job={job}
                onView={() => navigate(`/dashboard/jobs/${job.id}`)}
                onStart={() => onStartJob(job)}
                onCancel={() => onCancelJob(job)}
                onRetry={() => onRetryJob(job)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <ParscadeCard className="p-12 text-center">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No jobs found' : 'No processing jobs yet'}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Processing jobs will appear here when documents are processed'
            }
          </p>
        </ParscadeCard>
      )}
    </motion.div>
  );
};

export default React.memo(ProjectJobsSection);