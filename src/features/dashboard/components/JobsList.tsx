/**
 * Jobs List Component - Professional Blue Theme
 * Clean job tracking with refined styling
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, ChevronRight, Zap, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ParscadeButton, ParscadeCard, ParscadeStatusBadge } from '@/shared/components/brand';
import { formatJobType } from '@/shared/utils/formatters';
import { formatDate } from '@/shared/utils/date';
import { useJobs } from '@/shared/hooks/api/useJobs';

/**
 * Professional jobs list with refined blue theme
 */
const JobsList: React.FC = () => {
  const navigate = useNavigate();
  const { data: jobsData, isLoading, error, refetch } = useJobs({ 
    page: 1, 
    limit: 10 
  });

  if (error) {
    return (
      <ParscadeCard className="p-6">
        <div className="flex items-center text-red-600 mb-4">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span className="text-sm">Failed to load jobs</span>
        </div>
        <ParscadeButton variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </ParscadeButton>
      </ParscadeCard>
    );
  }

  const jobs = jobsData?.jobs || [];
  const pagination = jobsData?.pagination;

  return (
    <ParscadeCard
      variant="default"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center">
          <Zap className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Processing Jobs</h2>
            <p className="text-blue-600 text-sm mt-1">Track your document processing</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {isLoading ? (
          <div className="p-6 text-center">
            <motion.div 
              className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-blue-600 text-sm">Loading jobs...</p>
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="p-6 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-parscade"
            >
              <Clock className="w-6 h-6 text-blue-500" />
            </motion.div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs yet</h3>
            <p className="text-slate-600 mb-4">
              Your processing jobs will appear here once you upload documents.
            </p>
            <p className="text-sm text-slate-500">
              Use the upload zone to start processing documents.
            </p>
          </div>
        ) : (
          jobs.map((job, index) => (
            <motion.div
              key={job?.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ 
                x: 2,
                backgroundColor: "rgba(14, 165, 233, 0.02)",
                transition: { duration: 0.2 }
              }}
              className="p-4 cursor-pointer transition-all duration-200 hover:shadow-sm group"
              onClick={() => job?.id && navigate(`/jobs/${job.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <motion.div 
                    className="flex-shrink-0 mt-1"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ParscadeStatusBadge status={(job?.status as any) || 'pending'} size="sm" />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-200">
                      {job?.type ? formatJobType(job.type) : 'Processing Job'}
                    </p>
                    <p className="text-sm text-slate-600 truncate">
                      Created {job?.createdAt ? formatDate(job.createdAt) : 'Unknown'}
                    </p>
                    {job?.status === 'processing' && (
                      <div className="flex items-center mt-2">
                        <div className="w-24 bg-blue-100 rounded-full h-1.5 mr-2 shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${job?.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-blue-600 font-medium">{job?.progress || 0}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors duration-200" />
                </motion.div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {pagination?.hasNext && (
        <div className="p-4 border-t border-slate-200">
          <ParscadeButton 
            variant="outline" 
            className="w-full"
          >
            View All Jobs
          </ParscadeButton>
        </div>
      )}
    </ParscadeCard>
  );
};

export default JobsList;