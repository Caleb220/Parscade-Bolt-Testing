/**
 * Health Check API Module
 * Fully aligned with OpenAPI schema definitions
 */

import type { paths } from '@/types/api-types';

import { apiClient } from '../client';

// Extract exact types from OpenAPI paths
type HealthResponse = paths['/health']['get']['responses']['200']['content']['application/json'];
type ReadinessResponse = paths['/ready']['get']['responses']['200']['content']['application/json'];

/**
 * Health check endpoints
 * All endpoints follow OpenAPI schema exactly
 */
export const healthApi = {
  /**
   * Basic health check
   */
  async getHealth(): Promise<HealthResponse> {
    return apiClient.get<HealthResponse>('/health');
  },

  /**
   * Comprehensive readiness check
   */
  async getReadiness(): Promise<ReadinessResponse> {
    return apiClient.get<ReadinessResponse>('/ready');
  },
} as const;
