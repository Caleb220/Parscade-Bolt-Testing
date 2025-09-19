/**
 * Health API Module
 * Generated from OpenAPI spec - Health endpoints
 */

import { apiClient } from '../client';
import type { paths } from '@/types/api-types';

type HealthResponse = paths['/health']['get']['responses']['200']['content']['application/json'];
type ReadinessResponse = paths['/ready']['get']['responses']['200']['content']['application/json'];

/**
 * Health check endpoints for monitoring API Gateway status
 */
export const healthApi = {
  /**
   * Basic health check
   */
  async getHealth(): Promise<HealthResponse> {
    return apiClient.get<HealthResponse>('/health');
  },

  /**
   * Comprehensive readiness check including dependencies
   */
  async getReadiness(): Promise<ReadinessResponse> {
    return apiClient.get<ReadinessResponse>('/ready');
  },
} as const;