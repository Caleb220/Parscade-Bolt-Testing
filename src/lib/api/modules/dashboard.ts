/**
 * Dashboard API Module
 * Comprehensive dashboard data endpoints with type safety
 */

import type { 
  DashboardStats,
  ActivityResponse,
  ActivityQueryParams
} from '@/types/dashboard-types';

import { apiClient } from '../client';

/**
 * Dashboard data endpoints
 * All endpoints follow OpenAPI schema with comprehensive error handling
 */
export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    return await apiClient.get<DashboardStats>('/v1/dashboard/stats');
  },

  /**
   * Get recent activity feed
   */
  async getActivity(params?: ActivityQueryParams): Promise<ActivityResponse> {
    return await apiClient.get<ActivityResponse>('/v1/dashboard/activity', params);
  },
} as const;