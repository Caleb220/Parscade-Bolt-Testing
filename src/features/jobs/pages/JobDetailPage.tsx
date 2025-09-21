import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  RefreshCw,
  Trash2,
  FileText,
  Database
} from 'lucide-react';

import Layout from '@/shared/components/layout/templates/Layout';
import Button from '@/shared/components/forms/Button';
import LoadingSpinner from '@/shared/components/forms/LoadingSpinner';
import { useJob, useCancelJob } from '@/shared/hooks/api/useJobs';
import { useDocument, useDocumentDownload } from '@/shared/hooks/api/useDocuments';
import { getErrorMessage, isApiError } from '@/lib/api';

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  const { data: job, isLoading, error, refetch } = useJob(jobId!);
  const { data: document } = useDocument(job?.documentId || '');
  const cancelJobMutation = useCancelJob();
  const downloadMutation = useDocumentDownload();

  const handleCancel = async () => {
    if (!job || !['pending', 'processing'].includes(job.status)) return;
    
    try {
      await cancelJobMutation.mutateAsync(job.id);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDownload = async () => {
    if (!document) return;
    
    try {
      const downloadData = await downloadMutation.mutateAsync(document.id);
      window.open(downloadData.downloadUrl, '_blank');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const getStatusIcon = () => {
    if (!job) return <Clock className="w-5 h-5" />;
    
    switch (job.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    if (!job) return 'bg-gray-100 text-gray-800';
    
    switch (job.status) {
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

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !job) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">
                {error ? getErrorMessage(error) : 'Job not found'}
              </span>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
              <p className="text-gray-600 mt-1">
                {document?.name || 'Document processing job'}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="ml-2 capitalize">{job.status}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-medium">{job.progress}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${job.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {job.status === 'processing' && (
                  <div className="flex items-center text-sm text-blue-600">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Processing document...
                  </div>
                )}

                {job.status === 'failed' && job.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{job.error}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Results */}
            {job.status === 'completed' && job.resultRef && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Results</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <Database className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-green-900">Processing Complete</p>
                        <p className="text-sm text-green-700">Structured data extracted successfully</p>
                      </div>
                    </div>
                    {document && (
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Download className="w-4 h-4" />}
                        onClick={handleDownload}
                        isLoading={downloadMutation.isPending}
                      >
                        Download
                      </Button>
                    )}
                  </div>

                  <div className="text-sm text-gray-600">
                    <p><strong>Result Reference:</strong> {job.resultRef}</p>
                    {job.completedAt && (
                      <p><strong>Completed:</strong> {new Date(job.completedAt).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Job Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h3>
              
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-600">Job ID</dt>
                  <dd className="font-mono text-gray-900">{job.id}</dd>
                </div>
                
                <div>
                  <dt className="text-gray-600">Type</dt>
                  <dd className="text-gray-900 capitalize">{job.type.replace('_', ' ')}</dd>
                </div>
                
                <div>
                  <dt className="text-gray-600">Source</dt>
                  <dd className="text-gray-900 capitalize">{job.source}</dd>
                </div>
                
                <div>
                  <dt className="text-gray-600">Created</dt>
                  <dd className="text-gray-900">{new Date(job.createdAt).toLocaleString()}</dd>
                </div>
                
                {job.startedAt && (
                  <div>
                    <dt className="text-gray-600">Started</dt>
                    <dd className="text-gray-900">{new Date(job.startedAt).toLocaleString()}</dd>
                  </div>
                )}
                
                <div>
                  <dt className="text-gray-600">Attempts</dt>
                  <dd className="text-gray-900">{job.attempts} / {job.maxAttempts}</dd>
                </div>
              </dl>
            </motion.div>

            {/* Document Info */}
            {document && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Document</h3>
                
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{document.name}</p>
                    <p className="text-sm text-gray-600">{document.originalName}</p>
                    <p className="text-sm text-gray-500">
                      {(document.size / 1024 / 1024).toFixed(2)} MB • {document.mimeType}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              {['pending', 'processing'].includes(job.status) && (
                <Button
                  variant="danger"
                  fullWidth
                  leftIcon={<XCircle className="w-4 h-4" />}
                  onClick={handleCancel}
                  isLoading={cancelJobMutation.isPending}
                >
                  Cancel Job
                </Button>
              )}

              {job.status === 'failed' && (
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                  onClick={() => refetch()}
                >
                  Refresh Status
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetailPage;