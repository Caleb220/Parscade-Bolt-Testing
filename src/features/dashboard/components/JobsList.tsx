import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getErrorMessage } from '@/lib/api';
import CustomButton from '@/shared/components/forms/CustomButton';
import LoadingSpinner from '@/shared/components/forms/atoms/LoadingSpinner';
import StatusIcon from '@/shared/components/ui/status-icon';
import StatusBadge from '@/shared/components/ui/status-badge';
import { formatJobType } from '@/shared/utils/formatters';
import { formatDate } from '@/shared/utils/date';
import { useJobs } from '@/shared/hooks/api/useJobs';

const JobsList: React.FC = () => {
  const navigate = useNavigate();
  const { data: jobsData, isLoading, error, refetch } = useJobs({ 
    page: 1, 
    limit: 10 
  });

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center text-red-600 mb-4">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span className="text-sm">Failed to load jobs: {getErrorMessage(error)}</span>
        </div>
        <CustomButton variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </CustomButton>
      </div>
    );
  }

  // Ensure we have valid data structure
  const jobs = jobsData?.jobs || [];
  const pagination = jobsData?.pagination;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
        <p className="text-gray-600 text-sm mt-1">Track your document processing jobs</p>
      </div>

      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="p-6 text-center">
            <LoadingSpinner size="md" className="mx-auto mb-2" />
            <p className="text-gray-600 text-sm">Loading jobs...</p>
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="p-6 text-center">
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No processing jobs yet</h3>
            <p className="text-gray-600 mb-4">
              Document processing jobs will appear here once you upload and process your first document.
            </p>
            <p className="text-sm text-gray-500">
              Use the upload zone on the left to get started with document processing.
            </p>
          </div>
        ) : (
          jobs.map((job, index) => (
            <motion.div
              key={job?.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              onClick={() => job?.id && navigate(`/jobs/${job.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    <StatusIcon status={(job?.status as any) || 'pending'} size="sm" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {job?.type ? formatJobType(job.type) : 'Processing Job'}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      Created {job?.createdAt ? formatDate(job.createdAt) : 'Unknown'}
                    </p>
                    {job?.status === 'processing' && (
                      <div className="flex items-center mt-1">
                        <div className="w-24 bg-gray-200 rounded-full h-1.5 mr-2">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${job?.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{job?.progress || 0}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <StatusBadge status={(job?.status as any) || 'pending'} className="text-xs" />
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {pagination?.hasNext && (
        <div className="p-4 border-t border-gray-200">
          <CustomButton variant="outline" fullWidth>
            View All Jobs
          </CustomButton>
        </div>
      )}
    </div>
  );
};

export default JobsList;