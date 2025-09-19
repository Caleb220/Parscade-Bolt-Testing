/**
 * Health API Module
 * Auto-generated from OpenAPI spec
 */

import { apiClient } from '../client';
import type { paths } from '@/types/api-types';

type HealthResponse = paths['/health']['get']['responses']['200']['content']['application/json'];
type ReadinessResponse = paths['/ready']['get']['responses']['200']['content']['application/json'];

/**
 * Health endpoints for monitoring API status
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