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
 * Dashboard statistics hook with real-time updates
 */
export const useDashboardStats = (options?: {
  enablePolling?: boolean;
  pollingInterval?: number;
}) => {
  const { enablePolling = true, pollingInterval = 30000 } = options || {};

  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: () => dashboardApi.getStats(),
    staleTime: 30 * 1000, // 30 seconds - more aggressive for real-time feel
    refetchInterval: enablePolling ? pollingInterval : false,
    refetchIntervalInBackground: false, // Only poll when tab is active
    refetchOnWindowFocus: true, // Refresh when user returns to tab
    refetchOnMount: true, // Always fetch fresh data on mount
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
        return false;
      }
      return failureCount < 3; // More retries for better reliability
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    // Add error and success handlers for better UX
    meta: {
      errorMessage: 'Failed to load dashboard statistics',
    },
  });
};

/**
 * Dashboard activity feed hook with real-time updates
 */
export const useDashboardActivity = (
  params?: ActivityQueryParams,
  options?: {
    enablePolling?: boolean;
    pollingInterval?: number;
  }
) => {
  const { enablePolling = true, pollingInterval = 15000 } = options || {};

  return useQuery({
    queryKey: [...QUERY_KEYS.activity, params],
    queryFn: () => dashboardApi.getActivity(params),
    staleTime: 15 * 1000, // 15 seconds - activity updates faster
    refetchInterval: enablePolling ? pollingInterval : false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      errorMessage: 'Failed to load dashboard activity',
    },
  });
};

/**
 * Hook to refresh all dashboard data
 */
export const useRefreshDashboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Invalidate all dashboard queries to force refresh
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    meta: {
      successMessage: 'Dashboard data refreshed',
    },
  });
};
