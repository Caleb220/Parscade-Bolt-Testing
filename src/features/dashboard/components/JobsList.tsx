import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import StatusIcon from '@/shared/components/ui/status-icon';
import StatusBadge from '@/shared/components/ui/status-badge';
import { formatJobType } from '@/shared/utils/formatters';
import { formatDate } from '@/shared/utils/date';
import { useJobs } from '@/shared/hooks/api/useJobs';

/**
 * Jobs list component with real-time updates
 */
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
          <span className="text-sm">Failed to load jobs</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const jobs = jobsData?.jobs || [];
  const pagination = jobsData?.pagination;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl border border-gray-200/60 shadow-premium hover:shadow-premium-lg transition-all duration-300"
    >
      <div className="p-6 border-b border-gray-200/60 bg-gradient-to-r from-blue-50/30 to-indigo-50/30">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Recent Jobs</h2>
        <p className="text-gray-600 text-sm mt-1 font-medium">Track your document processing jobs</p>
      </div>

      <div className="divide-y divide-gray-200/60">
        {isLoading ? (
          <div className="p-6 text-center">
            <motion.div 
              className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-600 text-sm font-medium">Loading jobs...</p>
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="p-6 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
            >
              <FileText className="w-8 h-8 text-gray-400" />
            </motion.div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">No processing jobs yet</h3>
            <p className="text-gray-600 mb-4 font-medium leading-relaxed">
              Document processing jobs will appear here once you upload and process your first document.
            </p>
            <p className="text-sm text-gray-500 font-medium">
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
              whileHover={{ 
                x: 4,
                backgroundColor: "rgba(59, 130, 246, 0.02)",
                transition: { duration: 0.2 }
              }}
              className="p-5 cursor-pointer transition-all duration-200 hover:shadow-sm group"
              onClick={() => job?.id && navigate(`/jobs/${job.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <motion.div 
                    className="flex-shrink-0 mt-1"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <StatusIcon status={(job?.status as any) || 'pending'} size="sm" />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-200">
                      {job?.type ? formatJobType(job.type) : 'Processing Job'}
                    </p>
                    <p className="text-sm text-gray-600 truncate font-medium">
                      Created {job?.createdAt ? formatDate(job.createdAt) : 'Unknown'}
                    </p>
                    {job?.status === 'processing' && (
                      <div className="flex items-center mt-1">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2 shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${job?.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{job?.progress || 0}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <StatusBadge status={(job?.status as any) || 'pending'} className="text-xs" />
                  <motion.div
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {pagination?.hasNext && (
        <div className="p-4 border-t border-gray-200/60">
          <Button 
            variant="outline" 
            className="w-full hover:shadow-sm transition-all duration-200 font-medium"
          >
            View All Jobs
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default JobsList;