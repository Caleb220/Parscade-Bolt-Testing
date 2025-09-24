/**
 * Jobs Dashboard Page - Refactored
 * Simplified and optimized job management interface
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getErrorMessage } from '@/lib/api';
import { useToast } from '@/shared/components/ui/use-toast';
import {
  useJobs,
  useCreateJob,
  useStartJob,
  useCancelJob,
  useRetryJob,
  useDeleteJob
} from '@/shared/hooks/api/useJobs';
import { useProjects } from '@/shared/hooks/api/useProjects';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type {
  Job,
  JobCreateData,
  JobQueryParams,
  JobStatus
} from '@/types/api-types';

import {
  JobsHeader,
  JobsFilters,
  JobsTable,
  CreateJobDialog,
} from '../components/jobs';
import DashboardLayout from '../components/layout/DashboardLayout';

/**
 * Streamlined Jobs dashboard page
 */
const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | 'all'>(
    (searchParams.get('status') as JobStatus) || 'all'
  );
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedProject, setSelectedProject] = useState(searchParams.get('project_id') || 'all');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());

  // Debounced search
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Build query parameters
  const queryParams = useMemo((): JobQueryParams => {
    const params: JobQueryParams = {
      page: currentPage,
      limit: 20,
    };

    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedStatus !== 'all') params.status = selectedStatus;
    if (selectedType !== 'all') params.type = selectedType;
    if (selectedProject !== 'all') params.project_id = selectedProject;

    return params;
  }, [currentPage, debouncedSearch, selectedStatus, selectedType, selectedProject]);

  // API hooks
  const {
    data: jobsData,
    isLoading: jobsLoading,
    refetch: refetchJobs,
  } = useJobs(queryParams);

  const { data: projectsData } = useProjects({ limit: 100 });
  const createJob = useCreateJob();
  const startJob = useStartJob();
  const cancelJob = useCancelJob();
  const retryJob = useRetryJob();
  const deleteJob = useDeleteJob();

  const jobs = jobsData?.results || [];
  const totalJobs = jobsData?.total || 0;
  const projects = projectsData?.results || [];

  // Update URL when filters change
  const updateSearchParams = useCallback((updates: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        newParams.set(key, value.toString());
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Filter handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateSearchParams({ search: value, page: 1 });
  }, [updateSearchParams]);

  const handleStatusChange = useCallback((status: JobStatus | 'all') => {
    setSelectedStatus(status);
    setCurrentPage(1);
    updateSearchParams({ status, page: 1 });
  }, [updateSearchParams]);

  const handleTypeChange = useCallback((type: string) => {
    setSelectedType(type);
    setCurrentPage(1);
    updateSearchParams({ type, page: 1 });
  }, [updateSearchParams]);

  const handleProjectChange = useCallback((projectId: string) => {
    setSelectedProject(projectId);
    setCurrentPage(1);
    updateSearchParams({ project_id: projectId, page: 1 });
  }, [updateSearchParams]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedType('all');
    setSelectedProject('all');
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  // Job selection
  const handleSelectJob = useCallback((jobId: string) => {
    setSelectedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedJobs.size === jobs.length && jobs.length > 0) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(jobs.map(job => job.id)));
    }
  }, [jobs, selectedJobs.size]);

  // Job actions
  const handleView = useCallback((job: Job) => {
    navigate(`/dashboard/jobs/${job.id}`);
  }, [navigate]);

  const handleStart = useCallback(async (job: Job) => {
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
  }, [startJob, toast]);

  const handleCancel = useCallback(async (job: Job) => {
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

  const handleRetry = useCallback(async (job: Job) => {
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
  }, [retryJob, toast]);

  const handleDelete = useCallback(async (job: Job) => {
    if (!confirm(`Are you sure you want to delete job "${job.name || job.id}"?`)) return;

    try {
      await deleteJob.mutateAsync(job.id);
      toast({
        title: 'Job deleted',
        description: `Job "${job.name || job.id}" has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Failed to delete job',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [deleteJob, toast]);

  const handleCreateJob = useCallback(() => {
    setShowCreateDialog(true);
  }, []);

  const handleCreateJobSubmit = useCallback(async (jobData: any) => {
    try {
      await createJob.mutateAsync(jobData);
      setShowCreateDialog(false);
      toast({
        title: 'Job created',
        description: 'New job has been created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Failed to create job',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [createJob, toast]);

  const handleRefresh = useCallback(() => {
    refetchJobs();
  }, [refetchJobs]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <JobsHeader
          jobs={jobs}
          totalJobs={totalJobs}
          isLoading={jobsLoading}
          onCreateJob={handleCreateJob}
          onRefresh={handleRefresh}
        />

        <JobsFilters
          searchTerm={searchTerm}
          selectedStatus={selectedStatus}
          selectedType={selectedType}
          selectedProject={selectedProject}
          showFilters={showFilters}
          projects={projects}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onTypeChange={handleTypeChange}
          onProjectChange={handleProjectChange}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onClearFilters={handleClearFilters}
        />

        <JobsTable
          jobs={jobs}
          selectedJobs={selectedJobs}
          isLoading={jobsLoading}
          onSelectJob={handleSelectJob}
          onSelectAll={handleSelectAll}
          onView={handleView}
          onStart={handleStart}
          onCancel={handleCancel}
          onRetry={handleRetry}
          onDelete={handleDelete}
        />

        <CreateJobDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSubmit={handleCreateJobSubmit}
          projects={projects}
          isLoading={createJob.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default React.memo(JobsPage);