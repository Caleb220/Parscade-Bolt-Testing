/**
 * Project Detail Page - Refactored
 * Simplified and optimized project management interface
 */

import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { getErrorMessage } from '@/lib/api';
import LoadingSpinner from '@/shared/components/forms/atoms/LoadingSpinner';
import { useToast } from '@/shared/components/ui/use-toast';
import { useDocuments } from '@/shared/hooks/api/useDocuments';
import { useCreateExport } from '@/shared/hooks/api/useExports';
import { useJobs ,
  useStartJob,
  useCancelJob,
  useRetryJob
} from '@/shared/hooks/api/useJobs';
import {
  useProject,
  useUpdateProject,
  useDeleteProject,
  useAssociateDocument,
  useRemoveDocument
} from '@/shared/hooks/api/useProjects';
import type { Document, Job } from '@/types/api-types';

import DashboardLayout from '../components/layout/DashboardLayout';
import {
  ProjectDetailHeader,
  ProjectOverviewCard,
  ProjectDocumentsSection,
  ProjectJobsSection,
  EditProjectDialog,
  AddDocumentDialog,
} from '../components/project-detail';

/**
 * Streamlined Project Detail page
 */
const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Dialog states
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false);

  // API hooks
  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useProject(projectId!);

  const { data: documentsData } = useDocuments({ project_id: projectId, limit: 100 });
  const { data: allDocumentsData } = useDocuments({ limit: 1000 }); // For add dialog
  const { data: jobsData } = useJobs({ project_id: projectId, limit: 100 });

  // Mutations
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const associateDocument = useAssociateDocument();
  const removeDocument = useRemoveDocument();
  const createExport = useCreateExport();
  const startJob = useStartJob();
  const cancelJob = useCancelJob();
  const retryJob = useRetryJob();

  const documents = documentsData?.results || [];
  const allDocuments = allDocumentsData?.results || [];
  const jobs = jobsData?.results || [];

  // Project actions
  const handleEdit = useCallback(() => {
    setShowEditDialog(true);
  }, []);

  const handleEditSubmit = useCallback(async (projectData: any) => {
    if (!projectId) return;

    try {
      await updateProject.mutateAsync({ id: projectId, ...projectData });
      setShowEditDialog(false);
      toast({
        title: 'Project updated',
        description: 'Project details have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Failed to update project',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [projectId, updateProject, toast]);

  const handleDelete = useCallback(async () => {
    if (!projectId || !project) return;

    const confirmed = confirm(`Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      await deleteProject.mutateAsync(projectId);
      toast({
        title: 'Project deleted',
        description: 'Project has been deleted successfully.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Failed to delete project',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [projectId, project, deleteProject, toast, navigate]);

  const handleExport = useCallback(async () => {
    if (!projectId) return;

    try {
      await createExport.mutateAsync({
        type: 'project',
        project_id: projectId,
        format: 'json',
      });
      toast({
        title: 'Export started',
        description: 'Project export has been initiated. You will be notified when it\'s ready.',
      });
    } catch (error) {
      toast({
        title: 'Failed to start export',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [projectId, createExport, toast]);

  // Document actions
  const handleAddDocument = useCallback(() => {
    setShowAddDocumentDialog(true);
  }, []);

  const handleAddDocumentSubmit = useCallback(async (documentIds: string[]) => {
    if (!projectId) return;

    try {
      await Promise.all(
        documentIds.map(documentId =>
          associateDocument.mutateAsync({ projectId, documentId })
        )
      );
      setShowAddDocumentDialog(false);
      toast({
        title: 'Documents added',
        description: `${documentIds.length} document(s) have been added to the project.`,
      });
    } catch (error) {
      toast({
        title: 'Failed to add documents',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [projectId, associateDocument, toast]);

  const handleViewDocument = useCallback((document: Document) => {
    navigate(`/dashboard/documents/${document.id}`);
  }, [navigate]);

  const handleRemoveDocument = useCallback(async (document: Document) => {
    if (!projectId) return;

    const confirmed = confirm(`Are you sure you want to remove "${document.name}" from this project?`);
    if (!confirmed) return;

    try {
      await removeDocument.mutateAsync({ projectId, documentId: document.id });
      toast({
        title: 'Document removed',
        description: `"${document.name}" has been removed from the project.`,
      });
    } catch (error) {
      toast({
        title: 'Failed to remove document',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [projectId, removeDocument, toast]);

  // Job actions
  const handleStartJob = useCallback(async (job: Job) => {
    try {
      await startJob.mutateAsync(job.id);
      toast({
        title: 'Job started',
        description: `Job "${job.name || job.id}" has been started.`,
      });
    } catch (error) {
      toast({
        title: 'Failed to start job',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [startJob, toast]);

  const handleCancelJob = useCallback(async (job: Job) => {
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
  }, [cancelJob, toast]);

  const handleRetryJob = useCallback(async (job: Job) => {
    try {
      await retryJob.mutateAsync(job.id);
      toast({
        title: 'Job retried',
        description: `Job "${job.name || job.id}" has been retried.`,
      });
    } catch (error) {
      toast({
        title: 'Failed to retry job',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [retryJob, toast]);

  // Loading and error states
  if (projectLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (projectError || !project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Project not found
          </h2>
          <p className="text-gray-600 mb-4">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <ProjectDetailHeader
          project={project}
          isLoading={updateProject.isPending || deleteProject.isPending}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onExport={handleExport}
        />

        <ProjectOverviewCard
          project={project}
          documents={documents}
          jobs={jobs}
          isLoading={projectLoading}
        />

        <ProjectDocumentsSection
          documents={documents}
          isLoading={projectLoading}
          onAddDocument={handleAddDocument}
          onViewDocument={handleViewDocument}
          onRemoveDocument={handleRemoveDocument}
        />

        <ProjectJobsSection
          jobs={jobs}
          isLoading={projectLoading}
          onStartJob={handleStartJob}
          onCancelJob={handleCancelJob}
          onRetryJob={handleRetryJob}
        />

        {/* Dialogs */}
        <EditProjectDialog
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          onSubmit={handleEditSubmit}
          project={project}
          isLoading={updateProject.isPending}
        />

        <AddDocumentDialog
          isOpen={showAddDocumentDialog}
          onClose={() => setShowAddDocumentDialog(false)}
          onSubmit={handleAddDocumentSubmit}
          availableDocuments={allDocuments}
          currentDocumentIds={documents.map(d => d.id)}
          isLoading={associateDocument.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default React.memo(ProjectDetailPage);