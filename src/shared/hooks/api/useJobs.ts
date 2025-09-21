/**
 * Jobs API Hooks
 * Updated to match OpenAPI schema response structure
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api/modules/jobs';
import type { Job } from '@/types/api-types';

// Query keys
const QUERY_KEYS = {
  jobs: ['jobs'] as const,
  job: (id: string) => ['jobs', id] as const,
};

// Jobs queries
export const useJobs = (params?: { page?: number; limit?: number; status?: string; type?: string }) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.jobs, params],
    queryFn: async () => {
      try {
        return await jobsApi.listJobs(params);
      } catch (error) {
        return {
          jobs: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrevious: false,
          },
        };
      }
    },
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'statusCode' in error) {
        if (error.statusCode === 401 || error.statusCode === 404) {
          return false;
        }
      }
      return failureCount < 2;
    },
    select: (data) => ({
      jobs: data?.jobs || [],
      pagination: data?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
      },
    }),
  });
};

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
  });
};

// Job mutations
export const useCreateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: { type: string; source: string; documentId: string; options?: Record<string, unknown> }) => 
      jobsApi.createJob(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.jobs });
    },
  });
};

export const useSubmitParseJob = () => {
  const createJobMutation = useCreateJob();
  
  return useMutation({
    mutationFn: (documentId: string) => 
      createJobMutation.mutateAsync({
        type: 'parse_document',
        source: 'upload',
        documentId,
        options: {},
      }),
    onSuccess: () => {
      // Job creation success is handled by createJobMutation
    },
  });
};

export const useCancelJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobId: string) => jobsApi.cancelJob(jobId),
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.job(jobId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.jobs });
    },
  });
};