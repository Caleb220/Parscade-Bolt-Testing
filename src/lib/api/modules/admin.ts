/**
 * Admin API Module
 * Fully aligned with OpenAPI schema definitions
 */

import { apiClient } from '../client';
import type { paths } from '@/types/api-types';

// Extract exact types from OpenAPI paths
type GetUsersParams = paths['/v1/admin/users']['get']['parameters']['query'];
type GetUsersResponse = paths['/v1/admin/users']['get']['responses']['200']['content']['application/json'];

type GetJobsParams = paths['/v1/admin/jobs']['get']['parameters']['query'];
type GetJobsResponse = paths['/v1/admin/jobs']['get']['responses']['200']['content']['application/json'];

/**
 * Admin endpoints (admin role required)
 * All endpoints follow OpenAPI schema exactly
 */
export const adminApi = {
  /**
   * List all users (admin only)
   */
  async listUsers(params?: GetUsersParams): Promise<GetUsersResponse> {
    return apiClient.get<GetUsersResponse>('/v1/admin/users', params);
  },

  /**
   * List all jobs across users (admin only)
   */
  async listAllJobs(params?: GetJobsParams): Promise<GetJobsResponse> {
    return apiClient.get<GetJobsResponse>('/v1/admin/jobs', params);
  },
} as const;