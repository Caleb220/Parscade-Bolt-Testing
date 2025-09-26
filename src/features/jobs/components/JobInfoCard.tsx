/**
 * Job Info Card Component
 * Basic job information display
 */

import { Zap, Calendar, User, Activity } from 'lucide-react';
import React from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import { formatDate, formatJobType } from '@/shared/utils/formatters';
import type { Job } from '@/types/api-types';

interface JobInfoCardProps {
  job: Job;
}

const JobInfoCard: React.FC<JobInfoCardProps> = ({ job }) => {
  return (
    <ParscadeCard className="p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Job Information</h3>
          <p className="text-sm text-gray-500">Core job details</p>
        </div>
      </div>

      <dl className="space-y-4">
        <div>
          <dt className="flex items-center text-sm font-medium text-gray-500">
            <Activity className="w-4 h-4 mr-2" />
            Job Type
          </dt>
          <dd className="mt-1 text-sm text-gray-900">{formatJobType(job.type)}</dd>
        </div>

        <div>
          <dt className="flex items-center text-sm font-medium text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            Created
          </dt>
          <dd className="mt-1 text-sm text-gray-900">{formatDate(job.created_at)}</dd>
        </div>

        <div>
          <dt className="flex items-center text-sm font-medium text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            Last Updated
          </dt>
          <dd className="mt-1 text-sm text-gray-900">{formatDate(job.updated_at)}</dd>
        </div>

        {job.started_at && (
          <div>
            <dt className="flex items-center text-sm font-medium text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              Started
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(job.started_at)}</dd>
          </div>
        )}

        {job.completed_at && (
          <div>
            <dt className="flex items-center text-sm font-medium text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              Completed
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(job.completed_at)}</dd>
          </div>
        )}

        <div>
          <dt className="flex items-center text-sm font-medium text-gray-500">
            <User className="w-4 h-4 mr-2" />
            Job ID
          </dt>
          <dd className="mt-1 text-xs font-mono text-gray-900 break-all">{job.id}</dd>
        </div>
      </dl>
    </ParscadeCard>
  );
};

export default React.memo(JobInfoCard);
