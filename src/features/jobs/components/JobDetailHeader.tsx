/**
 * Job Detail Header Component
 * Navigation and title for job detail page
 */

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

import Button from '@/shared/components/forms/atoms/Button';
import { Badge } from '@/shared/components/ui/badge';
import type { Job } from '@/types/api-types';

interface JobDetailHeaderProps {
  job: Job;
  onBack: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'failed':
      return 'destructive';
    case 'running':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'cancelled':
      return 'outline';
    default:
      return 'secondary';
  }
};

const JobDetailHeader: React.FC<JobDetailHeaderProps> = ({ job, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left side - Navigation and title */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={onBack}
          >
            Back to Jobs
          </Button>

          <div className="h-6 w-px bg-gray-300" />

          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">{job.name || `${job.type} Job`}</h1>
              <Badge
                variant={getStatusColor(job.status)}
                showIcon
                animated={job.status === 'running'}
              >
                {job.status}
              </Badge>
            </div>
            <p className="text-gray-600 mt-1">
              Job Details & Management • ID: {job.id.slice(0, 8)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(JobDetailHeader);
