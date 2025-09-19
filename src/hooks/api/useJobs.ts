/**
 * Jobs API Hooks
 * React Query hooks for job management and document processing
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api';
import { logger } from '@/services/logger';
import { isApiError } from '@/lib/api/errors';

import type { paths } from '@/types/api-types';

type JobListParams = paths['/v1/jobs']['get']['parameters']['query'];
type JobList = paths['/v1/jobs']['get']['responses']['200']['content']['application/json'];
type CreateJobRequest = paths['/v1/jobs']['post']['requestBody']['content']['application/json'];
type Job = paths['/v1/jobs']['post']['responses']['201']['content']['application/json'];

/**
 * Query keys for job-related queries
 */
export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (params?: JobListParams) => [...jobKeys.lists(), params] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
} as const;

/**
 * Hook to fetch paginated list of user jobs
 */
export const useJobs = (params?: JobListParams) => {
  return useQuery({
    queryKey: jobKeys.list(params),
    queryFn: () => jobsApi.listJobs(params),
    staleTime: 30 * 1000, // Jobs data can be stale for 30 seconds
  });
};

/**
 * Hook to fetch specific job details with polling for active jobs
 */
export const useJob = (jobId: string) => {
  return useQuery({
    queryKey: jobKeys.detail(jobId),
    queryFn: () => jobsApi.getJob(jobId),
    refetchInterval: (data) => {
      // Poll every 2 seconds for active jobs
      if (data?.status === 'pending' || data?.status === 'processing') {
        return 2000;
      }
      // Stop polling for completed/failed/cancelled jobs
      return false;
    },
    staleTime: 10 * 1000, // Job details can be stale for 10 seconds
  });
};

/**
 * Hook to create new document processing job
 */
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateJobRequest) => jobsApi.createJob(request),
    onSuccess: (newJob) => {
      // Invalidate job lists to include the new job
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      
      // Add the new job to cache
      queryClient.setQueryData(jobKeys.detail(newJob.id), newJob);

      logger.info('Job created successfully', {
        context: { feature: 'jobs', action: 'createJob' },
        metadata: { jobId: newJob.id, jobType: newJob.type },
      });
    },
    onError: (error) => {
      logger.error('Failed to create job', {
        context: { feature: 'jobs', action: 'createJob' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
  });
};

/**
 * Hook to cancel a job
 */
export const useCancelJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => jobsApi.cancelJob(jobId),
    onSuccess: (updatedJob) => {
      // Update job in cache
      queryClient.setQueryData(jobKeys.detail(updatedJob.id), updatedJob);
      
      // Invalidate job lists
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });

      logger.info('Job cancelled successfully', {
        context: { feature: 'jobs', action: 'cancelJob' },
        metadata: { jobId: updatedJob.id },
      });
    },
    onError: (error, jobId) => {
      logger.error('Failed to cancel job', {
        context: { feature: 'jobs', action: 'cancelJob' },
        metadata: { jobId },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
  });
};

/**
 * Hook to submit a parsing job for an uploaded document
 * Combines document creation with job submission
 */
export const useSubmitParseJob = () => {
  const createJobMutation = useCreateJob();

  return {
    ...createJobMutation,
    submitParseJob: (documentId: string, options?: Record<string, unknown>) => {
      return createJobMutation.mutate({
        type: 'parse_document',
        source: 'upload',
        documentId,
        options: options || {},
      });
    },
  };
};