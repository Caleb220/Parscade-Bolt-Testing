/**
 * Jobs API Hooks
 * Comprehensive job management with all workflow operations
 * Updated to match backend handoff specification
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api/modules/jobs';
import { useToast } from '@/shared/components/ui/use-toast';
import { getErrorMessage } from '@/lib/api';
import type { 
  Job, 
  JobCreateData, 
  JobUpdateData, 
  JobQueryParams, 
  PaginatedResponse 
} from '@/types/api-types';

// Query keys
const QUERY_KEYS = {
  jobs: ['jobs'] as const,
  job: (id: string) => ['jobs', id] as const,
};

/**
 * Jobs list query with comprehensive filtering
 */
export const useJobs = (params?: JobQueryParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.jobs, params],
    queryFn: () => jobsApi.listJobs(params),
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'statusCode' in error) {
        if (error.statusCode === 401 || error.statusCode === 404) {
          return false;
        }
      }
      return failureCount < 2;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Single job query with real-time polling for active jobs
 */
export const useJob = (jobId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.job(jobId),
    queryFn: () => jobsApi.getJob(jobId),
    enabled: !!jobId,
    refetchInterval: (data) => {
      // Poll every 2 seconds for active jobs
      if (data?.status === 'pending' || data?.status === 'processing') {
        return 2000;
      }
      return false;
    },
    staleTime: 10 * 1000, // 10 seconds
  });
};

/**
 * Create job mutation
 */
export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: JobCreateData) => jobsApi.createJob(data),
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.jobs });
      
      toast({
        title: 'Job created',
        description: `Processing job "${job.type}" has been created successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Job creation failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

/**
 * Update job mutation
 */
export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: JobUpdateData }) => 
      jobsApi.updateJob(jobId, data),
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.job(job.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.jobs });
      
      toast({
        title: 'Job updated',
        description: 'Job has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Update failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

/**
 * Delete job mutation
 */
export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (jobId: string) => jobsApi.deleteJob(jobId),
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.job(jobId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.jobs });
      
      toast({
        title: 'Job deleted',
        description: 'The job has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Deletion failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

/**
 * Start job mutation
 */
export const useStartJob = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (jobId: string) => jobsApi.startJob(jobId),
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.job(job.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.jobs });
      
      toast({
        title: 'Job started',
        description: 'The job has been started and is now processing.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Start failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

/**
 * Cancel job mutation
 */
export const useCancelJob = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (jobId: string) => jobsApi.cancelJob(jobId),
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.job(job.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.jobs });
      
      toast({
        title: 'Job cancelled',
        description: 'The job has been cancelled successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Cancellation failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

/**
 * Retry job mutation
 */
export const useRetryJob = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (jobId: string) => jobsApi.retryJob(jobId),
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.job(job.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.jobs });
      
      toast({
        title: 'Job retrying',
        description: 'The job has been reset and will retry processing.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Retry failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

/**
 * Submit parse job for document (convenience hook)
 */
export const useSubmitParseJob = () => {
  const createJobMutation = useCreateJob();
  
  return useMutation({
    mutationFn: ({ documentId, projectId, options }: { 
      documentId: string; 
      projectId?: string; 
      options?: Record<string, unknown> 
    }) => 
      jobsApi.submitParseJob(documentId, projectId, options),
    onSuccess: (job) => {
      // Success handling is done by createJobMutation
    },
    onError: (error) => {
      // Error handling is done by createJobMutation
    },
  });
};