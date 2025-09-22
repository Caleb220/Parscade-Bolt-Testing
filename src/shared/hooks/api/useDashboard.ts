/**
 * Dashboard Data Hooks
 * Type-safe hooks for dashboard statistics and activity
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/modules/dashboard';
import type { ActivityQueryParams } from '@/types/dashboard-types';

// Query keys
const QUERY_KEYS = {
  stats: ['dashboard', 'stats'] as const,
  activity: ['dashboard', 'activity'] as const,
};

/**
 * Dashboard statistics hook
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: () => dashboardApi.getStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * Dashboard activity feed hook
 */
export const useDashboardActivity = (params?: ActivityQueryParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.activity, params],
    queryFn: () => dashboardApi.getActivity(params),
    staleTime: 30 * 1000, // 30 seconds
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};