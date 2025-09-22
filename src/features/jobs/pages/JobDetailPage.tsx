import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  XCircle, 
  FileText, 
  Database,
  Play,
  RotateCcw,
  Trash2,
  Edit3,
  Calendar,
  User,
  Folder,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

import { getErrorMessage } from '@/lib/api';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Skeleton } from '@/shared/components/ui/skeleton';
import ConfirmationDialog from '@/shared/components/ui/confirmation-dialog';
import { ParscadeCard, ParscadeButton } from '@/shared/components/brand';
import Layout from '@/shared/components/layout/templates/Layout';
import LoadingSpinner from '@/shared/components/forms/atoms/LoadingSpinner';
import StatusIcon from '@/shared/components/ui/status-icon';
import StatusBadge from '@/shared/components/ui/status-badge';
import { formatJobType, formatBytes } from '@/shared/utils/formatters';
import { formatDate } from '@/shared/utils/date';
import { 
  useJob, 
  useCancelJob, 
  useStartJob, 
  useRetryJob, 
  useDeleteJob,
  useUpdateJob
} from '@/shared/hooks/api/useJobs';
import { useDocument, useDocumentDownload } from '@/shared/hooks/api/useDocuments';
import { useProject } from '@/shared/hooks/api/useProjects';
import type { JobUpdateData } from '@/types/api-types';

/**
 * Comprehensive job detail page with full workflow management
 */
const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  const { data: job, isLoading, error, refetch } = useJob(jobId!);
  const { data: document } = useDocument(job?.document_id || '');
  const { data: project } = useProject(job?.project_id || '');
  
  const cancelJobMutation = useCancelJob();
  const startJobMutation = useStartJob();
  const retryJobMutation = useRetryJob();
  const deleteJobMutation = useDeleteJob();
  const updateJobMutation = useUpdateJob();
  const downloadMutation = useDocumentDownload();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    project_id: '',
    metadata: '{}',
    options: '{}',
    max_attempts: 3,
  });

  // Initialize edit form when job loads
  React.useEffect(() => {
    if (job) {
      setEditForm({
        project_id: job.project_id || '',
        metadata: JSON.stringify(job.metadata, null, 2),
        options: JSON.stringify(job.options, null, 2),
        max_attempts: job.max_attempts,
      });
    }
  }, [job]);

  const handleStart = async () => {
    if (!job || job.status !== 'pending') return;
    
    try {
      await startJobMutation.mutateAsync(job.id);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCancel = async () => {
    if (!job || !['pending', 'processing'].includes(job.status)) return;
    
    try {
      await cancelJobMutation.mutateAsync(job.id);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleRetry = async () => {
    if (!job || job.status !== 'failed') return;
    
    try {
      await retryJobMutation.mutateAsync(job.id);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDelete = async () => {
    if (!job) return;
    
    try {
      await deleteJobMutation.mutateAsync(job.id);
      navigate('/dashboard');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleEdit = async () => {
    if (!job) return;
    
    try {
      let metadata: Record<string, unknown> = {};
      let options: Record<string, unknown> = {};
      
      try {
        metadata = JSON.parse(editForm.metadata);
      } catch {
        metadata = job.metadata;
      }
      
      try {
        options = JSON.parse(editForm.options);
      } catch {
        options = job.options;
      }

      const updateData: JobUpdateData = {
        project_id: editForm.project_id || null,
        metadata,
        options,
        max_attempts: editForm.max_attempts,
      };

      await updateJobMutation.mutateAsync({ jobId: job.id, data: updateData });
      setShowEditDialog(false);
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

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-48" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Skeleton className="h-96 lg:col-span-2" />
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !job) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ParscadeCard className="p-8">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
              <p className="text-gray-600 mb-6">
                {error ? getErrorMessage(error) : 'The requested job could not be found.'}
              </p>
              <div className="flex justify-center space-x-3">
                <ParscadeButton
                  variant="outline"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Dashboard
                </ParscadeButton>
                <ParscadeButton onClick={() => refetch()}>
                  Try Again
                </ParscadeButton>
              </div>
            </div>
          </ParscadeCard>
        </div>
      </Layout>
    );
  }

  const canStart = job.status === 'pending';
  const canCancel = ['pending', 'processing'].includes(job.status);
  const canRetry = job.status === 'failed';
  const canEdit = !['processing'].includes(job.status);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <ParscadeButton
            variant="ghost"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            Back to Dashboard
          </ParscadeButton>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
              <p className="text-gray-600 mt-1">
                {formatJobType(job.type)} • {document?.name || 'Document processing job'}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <StatusIcon status={job.status as any} />
              <StatusBadge status={job.status as any} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Progress */}
            <ParscadeCard variant="default" className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Processing Progress
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-medium">{job.progress}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-blue-600 to-blue-500 h-3 rounded-full shadow-sm"
                    initial={{ width: 0 }}
                    animate={{ width: `${job.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Attempts:</span>
                    <span className="font-medium ml-2">{job.attempts} / {job.max_attempts}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium ml-2 capitalize">{job.status}</span>
                  </div>
                </div>

                {job.status === 'processing' && (
                  <div className="flex items-center text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Processing document... This may take a few moments.
                  </div>
                )}

                {job.status === 'failed' && job.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <XCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-900 mb-1">Processing Failed</p>
                        <p className="text-red-800 text-sm">{job.error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ParscadeCard>

            {/* Results */}
            {job.status === 'completed' && job.result_ref && (
              <ParscadeCard variant="default" className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-green-600" />
                  Processing Results
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-green-900">Processing Complete</p>
                        <p className="text-sm text-green-700">Structured data extracted successfully</p>
                      </div>
                    </div>
                    {document && (
                      <ParscadeButton
                        variant="outline"
                        size="sm"
                        leftIcon={<Download className="w-4 h-4" />}
                        onClick={handleDownload}
                        disabled={downloadMutation.isPending}
                      >
                        {downloadMutation.isPending ? 'Preparing...' : 'Download'}
                      </ParscadeButton>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm space-y-2">
                      <div>
                        <span className="font-medium text-gray-700">Result Reference:</span>
                        <span className="ml-2 font-mono text-gray-900">{job.result_ref}</span>
                      </div>
                      {job.completed_at && (
                        <div>
                          <span className="font-medium text-gray-700">Completed:</span>
                          <span className="ml-2 text-gray-900">{formatDate(job.completed_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ParscadeCard>
            )}

            {/* Job Actions */}
            <ParscadeCard variant="default" className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Actions</h2>
              
              <div className="flex flex-wrap gap-3">
                {canStart && (
                  <ParscadeButton
                    variant="primary"
                    leftIcon={<Play className="w-4 h-4" />}
                    onClick={handleStart}
                    disabled={startJobMutation.isPending}
                  >
                    {startJobMutation.isPending ? 'Starting...' : 'Start Job'}
                  </ParscadeButton>
                )}

                {canCancel && (
                  <ParscadeButton
                    variant="outline"
                    leftIcon={<XCircle className="w-4 h-4" />}
                    onClick={handleCancel}
                    disabled={cancelJobMutation.isPending}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    {cancelJobMutation.isPending ? 'Cancelling...' : 'Cancel Job'}
                  </ParscadeButton>
                )}

                {canRetry && (
                  <ParscadeButton
                    variant="primary"
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                    onClick={handleRetry}
                    disabled={retryJobMutation.isPending}
                  >
                    {retryJobMutation.isPending ? 'Retrying...' : 'Retry Job'}
                  </ParscadeButton>
                )}

                {canEdit && (
                  <ParscadeButton
                    variant="outline"
                    leftIcon={<Edit3 className="w-4 h-4" />}
                    onClick={() => setShowEditDialog(true)}
                  >
                    Edit Job
                  </ParscadeButton>
                )}

                <ParscadeButton
                  variant="outline"
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  onClick={() => setShowDeleteDialog(true)}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  Delete Job
                </ParscadeButton>

                <ParscadeButton
                  variant="ghost"
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                  onClick={() => refetch()}
                >
                  Refresh
                </ParscadeButton>
              </div>
            </ParscadeCard>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Job Information */}
            <ParscadeCard variant="default" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-600" />
                Job Information
              </h3>
              
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-gray-600 font-medium">Job ID</dt>
                  <dd className="font-mono text-gray-900 mt-1 break-all">{job.id}</dd>
                </div>
                
                <div>
                  <dt className="text-gray-600 font-medium">Type</dt>
                  <dd className="text-gray-900 mt-1">{formatJobType(job.type)}</dd>
                </div>
                
                <div>
                  <dt className="text-gray-600 font-medium">Source</dt>
                  <dd className="text-gray-900 mt-1 capitalize">{job.source}</dd>
                </div>
                
                <div>
                  <dt className="text-gray-600 font-medium">Created</dt>
                  <dd className="text-gray-900 mt-1">{formatDate(job.created_at)}</dd>
                </div>
                
                <div>
                  <dt className="text-gray-600 font-medium">Last Updated</dt>
                  <dd className="text-gray-900 mt-1">{formatDate(job.updated_at)}</dd>
                </div>
                
                {job.started_at && (
                  <div>
                    <dt className="text-gray-600 font-medium">Started</dt>
                    <dd className="text-gray-900 mt-1">{formatDate(job.started_at)}</dd>
                  </div>
                )}
                
                {job.completed_at && (
                  <div>
                    <dt className="text-gray-600 font-medium">Completed</dt>
                    <dd className="text-gray-900 mt-1">{formatDate(job.completed_at)}</dd>
                  </div>
                )}
                
                {job.source_url && (
                  <div>
                    <dt className="text-gray-600 font-medium">Source URL</dt>
                    <dd className="text-gray-900 mt-1 break-all">{job.source_url}</dd>
                  </div>
                )}
                
                {job.source_key && (
                  <div>
                    <dt className="text-gray-600 font-medium">Source Key</dt>
                    <dd className="font-mono text-gray-900 mt-1 break-all">{job.source_key}</dd>
                  </div>
                )}
              </dl>
            </ParscadeCard>

            {/* Project Information */}
            {project && (
              <ParscadeCard variant="default" className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Folder className="w-5 h-5 mr-2 text-purple-600" />
                  Project
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">{project.name}</p>
                    {project.description && (
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    )}
                  </div>
                  
                  <ParscadeButton
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                    className="w-full"
                  >
                    View Project
                  </ParscadeButton>
                </div>
              </ParscadeCard>
            )}

            {/* Document Information */}
            {document && (
              <ParscadeCard variant="default" className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-600" />
                  Document
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{document.name}</p>
                      <p className="text-sm text-gray-600 truncate">{document.original_name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatBytes(document.size)} • {document.mime_type}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Uploaded {formatDate(document.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <ParscadeButton
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/dashboard/documents/${document.id}`)}
                    className="w-full"
                  >
                    View Document
                  </ParscadeButton>
                </div>
              </ParscadeCard>
            )}

            {/* Metadata */}
            {(Object.keys(job.metadata).length > 0 || Object.keys(job.options).length > 0) && (
              <ParscadeCard variant="default" className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
                
                <div className="space-y-4">
                  {Object.keys(job.metadata).length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Metadata</Label>
                      <pre className="mt-1 text-xs bg-gray-50 p-3 rounded border overflow-auto max-h-32">
                        {JSON.stringify(job.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {Object.keys(job.options).length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Options</Label>
                      <pre className="mt-1 text-xs bg-gray-50 p-3 rounded border overflow-auto max-h-32">
                        {JSON.stringify(job.options, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </ParscadeCard>
            )}
          </div>
        </div>

        {/* Edit Job Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Job</DialogTitle>
              <DialogDescription>
                Update job configuration and settings.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_project_id">Project ID (Optional)</Label>
                <Input
                  id="edit_project_id"
                  value={editForm.project_id}
                  onChange={(e) => setEditForm({ ...editForm, project_id: e.target.value })}
                  placeholder="Enter project ID or leave empty"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_max_attempts">Max Attempts</Label>
                <Input
                  id="edit_max_attempts"
                  type="number"
                  min="1"
                  max="10"
                  value={editForm.max_attempts}
                  onChange={(e) => setEditForm({ ...editForm, max_attempts: parseInt(e.target.value) || 3 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_metadata">Metadata (JSON)</Label>
                <textarea
                  id="edit_metadata"
                  value={editForm.metadata}
                  onChange={(e) => setEditForm({ ...editForm, metadata: e.target.value })}
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none font-mono"
                  placeholder='{"key": "value"}'
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_options">Options (JSON)</Label>
                <textarea
                  id="edit_options"
                  value={editForm.options}
                  onChange={(e) => setEditForm({ ...editForm, options: e.target.value })}
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none font-mono"
                  placeholder='{"option": "value"}'
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEdit}
                  disabled={updateJobMutation.isPending}
                >
                  {updateJobMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          title="Delete Job"
          description={`Are you sure you want to delete this ${formatJobType(job.type).toLowerCase()} job? This action cannot be undone.`}
          confirmText="Delete Job"
          variant="destructive"
          isLoading={deleteJobMutation.isPending}
        />
      </div>
    </Layout>
  );
};

export default JobDetailPage;