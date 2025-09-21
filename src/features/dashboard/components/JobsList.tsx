import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

import LoadingSpinner from '@/shared/components/forms/LoadingSpinner';
import Button from '@/shared/components/forms/Button';
import { useJobs } from '@/shared/hooks/api/useJobs';
import { getErrorMessage } from '@/lib/api';

const JobsList: React.FC = () => {
  const navigate = useNavigate();
  const { data: jobsData, isLoading, error } = useJobs({ 
    page: 1, 
    limit: 10 
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center text-red-600 mb-4">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>Failed to load jobs: {getErrorMessage(error)}</span>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

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
        ) : !jobsData?.jobs.length ? (
          <div className="p-6 text-center">
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No jobs yet</p>
            <p className="text-gray-500 text-sm">Upload a document to get started</p>
          </div>
        ) : (
          jobsData.jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(job.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {job.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      Created {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                    {job.status === 'processing' && (
                      <div className="flex items-center mt-1">
                        <div className="w-24 bg-gray-200 rounded-full h-1.5 mr-2">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{job.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {jobsData && jobsData.pagination.hasNext && (
        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" fullWidth>
            View All Jobs
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobsList;