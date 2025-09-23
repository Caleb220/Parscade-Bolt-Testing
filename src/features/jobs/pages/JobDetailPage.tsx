/**
 * Job Detail Page - Refactored
 * Simplified and optimized job management interface
 */

import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/shared/components/ui/use-toast';
import Layout from '@/shared/components/layout/templates/Layout';
import LoadingSpinner from '@/shared/components/forms/atoms/LoadingSpinner';
import {
  JobDetailHeader,
  JobProgressCard,
  JobActionsCard,
  JobInfoSidebar,
} from '../components';
import {
  useJob,
  useCancelJob,
  useStartJob,
  useRetryJob,
  useDeleteJob,
} from '@/shared/hooks/api/useJobs';
import { useDocument, useDocumentDownload } from '@/shared/hooks/api/useDocuments';
import { useProject } from '@/shared/hooks/api/useProjects';
import { getErrorMessage } from '@/lib/api';

/**
 * Streamlined Job Detail page
 */
const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Dialog states
  const [showEditDialog, setShowEditDialog] = useState(false);

  // API hooks
  const {
    data: job,
    isLoading: jobLoading,
    error: jobError,
    refetch: refetchJob,
  } = useJob(jobId!);

  const { data: document } = useDocument(job?.document_id!, {
    enabled: !!job?.document_id,
  });

  const { data: project } = useProject(job?.project_id!, {
    enabled: !!job?.project_id,
  });

  // Mutations
  const startJob = useStartJob();
  const cancelJob = useCancelJob();
  const retryJob = useRetryJob();
  const deleteJob = useDeleteJob();
  const downloadDocument = useDocumentDownload();

  // Action handlers
  const handleStart = useCallback(async () => {
    if (!job) return;

    try {
      await startJob.mutateAsync(job.id);
      toast({
        title: 'Job started',
        description: `Job "${job.name || job.id}" has been started successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Failed to start job',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [job, startJob, toast]);

  const handleCancel = useCallback(async () => {
    if (!job) return;

    const confirmed = confirm(`Are you sure you want to cancel job "${job.name || job.id}"?`);
    if (!confirmed) return;

    try {
      await cancelJob.mutateAsync(job.id);
      toast({
        title: 'Job cancelled',
        description: `Job "${job.name || job.id}" has been cancelled.`,
      });
    } catch (error) {
      toast({
        title: 'Failed to cancel job',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [job, cancelJob, toast]);

  const handleRetry = useCallback(async () => {
    if (!job) return;

    try {
      await retryJob.mutateAsync(job.id);
      toast({
        title: 'Job retried',
        description: `Job "${job.name || job.id}" has been restarted.`,
      });
    } catch (error) {
      toast({
        title: 'Failed to retry job',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [job, retryJob, toast]);

  const handleEdit = useCallback(() => {
    setShowEditDialog(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!job) return;

    const confirmed = confirm(
      `Are you sure you want to delete job "${job.name || job.id}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteJob.mutateAsync(job.id);
      toast({
        title: 'Job deleted',
        description: `Job "${job.name || job.id}" has been deleted successfully.`,
      });
      navigate('/dashboard/jobs');
    } catch (error) {
      toast({
        title: 'Failed to delete job',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [job, deleteJob, toast, navigate]);

  const handleRefresh = useCallback(() => {
    refetchJob();
  }, [refetchJob]);

  const handleDownload = useCallback(async () => {
    if (!document) return;

    try {
      await downloadDocument.mutateAsync(document.id);
      toast({
        title: 'Download started',
        description: 'Document download has been initiated.',
      });
    } catch (error) {
      toast({
        title: 'Failed to download document',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [document, downloadDocument, toast]);

  const handleBack = useCallback(() => {
    navigate('/dashboard/jobs');
  }, [navigate]);

  // Loading and error states
  if (jobLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (jobError || !job) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Job not found
          </h2>
          <p className="text-gray-600 mb-4">
            The job you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </Layout>
    );
  }

  const isLoading = startJob.isPending ||
                   cancelJob.isPending ||
                   retryJob.isPending ||
                   deleteJob.isPending ||
                   downloadDocument.isPending;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JobDetailHeader job={job} onBack={handleBack} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <JobProgressCard job={job} />

            <JobActionsCard
              job={job}
              onStart={handleStart}
              onCancel={handleCancel}
              onRetry={handleRetry}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRefresh={handleRefresh}
              onDownload={job.status === 'completed' && document ? handleDownload : undefined}
              isLoading={isLoading}
            />
          </div>

          {/* Sidebar */}
          <JobInfoSidebar
            job={job}
            project={project}
            document={document}
          />
        </div>

        {/* TODO: Add EditJobDialog when needed */}
        {showEditDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Edit Job</h3>
              <p className="text-gray-600 mb-4">
                Job editing functionality will be implemented here.
              </p>
              <button
                onClick={() => setShowEditDialog(false)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default React.memo(JobDetailPage);