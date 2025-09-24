/**
 * Analytics API Module
 * Advanced analytics endpoints with type safety
 */

import type { 
  AnalyticsTrendsResponse,
  AnalyticsAccuracyResponse,
  AnalyticsErrorRatesResponse,
  AnalyticsOverviewResponse,
  AnalyticsQueryParams
} from '@/types/dashboard-types';

import { apiClient } from '../client';

/**
 * Analytics endpoints
 * All endpoints follow OpenAPI schema with comprehensive error handling
 */
export const analyticsApi = {
  /**
   * Get processing trends data
   */
  async getTrends(params?: AnalyticsQueryParams): Promise<AnalyticsTrendsResponse> {
    try {
      return await apiClient.get<AnalyticsTrendsResponse>('/v1/analytics/trends', params);
    } catch (error) {
      console.warn('Analytics trends endpoint not available:', error);
      return {
        data: [],
        timeframe: 'month',
        date_range: {},
      };
    }
  },

  /**
   * Get accuracy breakdown by document type
   */
  async getAccuracyBreakdown(params?: AnalyticsQueryParams): Promise<AnalyticsAccuracyResponse> {
    try {
      return await apiClient.get<AnalyticsAccuracyResponse>('/v1/analytics/accuracy-breakdown', params);
    } catch (error) {
      console.warn('Analytics accuracy endpoint not available:', error);
      return {
        data: [],
        timeframe: 'month',
        date_range: {},
        filters: {},
      };
    }
  },

  /**
   * Get error rates and common issues
   */
  async getErrorRates(params?: AnalyticsQueryParams): Promise<AnalyticsErrorRatesResponse> {
    try {
      return await apiClient.get<AnalyticsErrorRatesResponse>('/v1/analytics/error-rates', params);
    } catch (error) {
      console.warn('Analytics error rates endpoint not available:', error);
      return {
        data: [],
        timeframe: 'month',
        date_range: {},
      };
    }
  },

  /**
   * Get comprehensive analytics overview
   */
  async getOverview(params?: AnalyticsQueryParams): Promise<AnalyticsOverviewResponse> {
    try {
      return await apiClient.get<AnalyticsOverviewResponse>('/v1/analytics/overview', params);
    } catch (error) {
      console.warn('Analytics overview endpoint not available:', error);
      return {
        trends: {
          data: [],
          summary: {
            total_data_points: 0,
            latest_processing_time: 0,
            trend_direction: 'stable',
          },
        },
        accuracy: {
          data: [],
          summary: {
            total_document_types: 0,
            overall_average_accuracy: 0,
            best_performing_type: null,
          },
        },
        errors: {
          data: [],
          summary: {
            total_error_types: 0,
            total_errors: 0,
            most_common_error: null,
          },
        },
        metadata: {
          timeframe: 'month',
          date_range: {},
          generated_at: new Date().toISOString(),
        },
      };
    }
  },
} as const;