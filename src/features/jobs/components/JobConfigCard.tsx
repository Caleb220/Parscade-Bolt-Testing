/**
 * Job Config Card Component
 * Job configuration and metadata display
 */

import React from 'react';
import { Database, Settings } from 'lucide-react';
import { ParscadeCard } from '@/shared/components/brand';
import type { Job } from '@/types/api-types';

interface JobConfigCardProps {
  job: Job;
}

const JobConfigCard: React.FC<JobConfigCardProps> = ({ job }) => {
  // Parse options if they exist
  const options = job.options ? JSON.parse(job.options) : {};
  const hasConfig = Object.keys(options).length > 0;

  return (
    <ParscadeCard className="p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Configuration</h3>
          <p className="text-sm text-gray-500">Job settings and options</p>
        </div>
      </div>

      {hasConfig ? (
        <div className="space-y-4">
          <dl className="space-y-3">
            {Object.entries(options).map(([key, value]) => (
              <div key={key}>
                <dt className="text-sm font-medium text-gray-500 capitalize">
                  {key.replace(/_/g, ' ')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {typeof value === 'boolean'
                    ? (value ? 'Enabled' : 'Disabled')
                    : typeof value === 'object'
                    ? JSON.stringify(value, null, 2)
                    : String(value)
                  }
                </dd>
              </div>
            ))}
          </dl>

          {/* Raw Configuration */}
          <details className="mt-4">
            <summary className="text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700">
              Raw Configuration
            </summary>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
                {JSON.stringify(options, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      ) : (
        <div className="text-center py-6">
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            No custom configuration set for this job
          </p>
        </div>
      )}
    </ParscadeCard>
  );
};

export default React.memo(JobConfigCard);