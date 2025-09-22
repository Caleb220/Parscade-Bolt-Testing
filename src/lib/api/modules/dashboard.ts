/**
 * Dashboard API Module
 * Comprehensive dashboard data endpoints with type safety
 */

import { apiClient } from '../client';
import type { 
  DashboardStats,
  ActivityResponse,
  ActivityQueryParams
} from '@/types/dashboard-types';

/**
 * Dashboard data endpoints
 * All endpoints follow OpenAPI schema with comprehensive error handling
 */
export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    try {
      return await apiClient.get<DashboardStats>('/v1/dashboard/stats');
    } catch (error) {
      // Return fallback data if endpoint not available
      console.warn('Dashboard stats endpoint not available:', error);
      return {
        total_documents_processed: 0,
        documents_processed_this_month: 0,
        jobs_processing_current: 0,
        average_accuracy: 0,
        average_processing_time_ms: 0,
      };
    }
  },

  /**
   * Get recent activity feed
   */
  async getActivity(params?: ActivityQueryParams): Promise<ActivityResponse> {
    try {
      return await apiClient.get<ActivityResponse>('/v1/dashboard/activity', params);
    } catch (error) {
      // Return empty data if endpoint not available
      console.warn('Dashboard activity endpoint not available:', error);
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        total_pages: 0,
      };
    }
  },
} as const;