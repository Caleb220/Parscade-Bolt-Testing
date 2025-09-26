/**
 * Analytics Data Hooks
 * Type-safe hooks for advanced analytics
 */

import { useQuery } from '@tanstack/react-query';

import { analyticsApi } from '@/lib/api/modules/analytics';
import type { AnalyticsQueryParams } from '@/types/dashboard-types';

// Query keys
const QUERY_KEYS = {
  trends: ['analytics', 'trends'] as const,
  accuracy: ['analytics', 'accuracy'] as const,
  errors: ['analytics', 'errors'] as const,
  overview: ['analytics', 'overview'] as const,
};

/**
 * Analytics trends hook
 */
export const useAnalyticsTrends = (params?: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.trends, params],
    queryFn: () => analyticsApi.getTrends(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * Analytics accuracy breakdown hook
 */
export const useAnalyticsAccuracy = (params?: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.accuracy, params],
    queryFn: () => analyticsApi.getAccuracyBreakdown(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * Analytics error rates hook
 */
export const useAnalyticsErrors = (params?: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.errors, params],
    queryFn: () => analyticsApi.getErrorRates(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * Analytics overview hook
 */
export const useAnalyticsOverview = (params?: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.overview, params],
    queryFn: () => analyticsApi.getOverview(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
