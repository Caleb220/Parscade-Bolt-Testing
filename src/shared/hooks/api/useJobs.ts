/**
 * Jobs Hooks
 * React Query hooks for job-related operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api';
import type { Job, PaginatedResponse } from '@/shared/types/api-types';

// Query keys
const QUERY_KEYS = {
  jobs: ['jobs'] as const,
  job: (id: string) => ['jobs', id] as const,
};

// Jobs queries
export const useJobs = (params?: { page?: number; limit?: number; status?: string; type?: string }) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.jobs, params],
    queryFn: () => jobsApi.listJobs(params),
  });
};

export const useJob = (jobId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.job(jobId),
    queryFn: () => jobsApi.getJob(jobId),
    enabled: !!jobId,
  });
};

// Job mutations
export const useSubmitParseJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (documentId: string) => jobsApi.submitParseJob(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.jobs });
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