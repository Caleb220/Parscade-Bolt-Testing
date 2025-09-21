import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, ChevronRight, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ParscadeButton, ParscadeCard, ParscadeStatusBadge } from '@/shared/components/brand';
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
      variant="gradient"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="p-6 border-b border-purple-200/30 bg-gradient-to-r from-purple-50/30 to-cyan-50/30">
        <div className="flex items-center">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Zap className="w-6 h-6 text-purple-600 mr-3" />
          </motion.div>
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Transformation Jobs</h2>
            <p className="text-purple-600 text-sm mt-1 font-bold">Track your document processing pipeline</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-purple-200/30">
        {isLoading ? (
          <div className="p-6 text-center">
            <motion.div 
              className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full mx-auto mb-3"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-purple-600 text-sm font-bold">Loading transformation jobs...</p>
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="p-6 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-parscade"
            >
              <Sparkles className="w-8 h-8 text-purple-500" />
            </motion.div>
            <h3 className="text-lg font-black text-gray-900 mb-3 tracking-tight">No transformations yet</h3>
            <p className="text-purple-600 mb-4 font-bold leading-relaxed">
              Your document transformation jobs will appear here once you begin processing.
            </p>
            <p className="text-sm text-purple-500 font-bold">
              Use the upload zone to start transforming documents into structured data.
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
                backgroundColor: "rgba(124, 109, 242, 0.02)",
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
                    <ParscadeStatusBadge status={(job?.status as any) || 'pending'} size="sm" />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-gray-900 truncate group-hover:text-purple-700 transition-colors duration-200">
                      {job?.type ? formatJobType(job.type) : 'Processing Job'}
                    </p>
                    <p className="text-sm text-purple-600/70 truncate font-bold">
                      Created {job?.createdAt ? formatDate(job.createdAt) : 'Unknown'}
                    </p>
                    {job?.status === 'processing' && (
                      <div className="flex items-center mt-1">
                        <div className="w-24 bg-purple-100 rounded-full h-2 mr-2 shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-cyan-500 h-2 rounded-full transition-all duration-500 shadow-parscade"
                            style={{ width: `${job?.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-purple-500 font-bold">{job?.progress || 0}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <motion.div
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4 text-purple-400 group-hover:text-purple-600 transition-colors duration-200" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {pagination?.hasNext && (
        <div className="p-4 border-t border-purple-200/30">
          <ParscadeButton 
            variant="outline" 
            className="w-full font-bold"
          >
            View All Jobs
          </ParscadeButton>
        </div>
      )}
    </ParscadeCard>
  );
};

export default JobsList;