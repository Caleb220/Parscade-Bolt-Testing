/**
 * Admin API Module
 * Generated from OpenAPI spec - Admin endpoints (feature-flagged)
 */

import { apiClient } from '../client';
import type { paths } from '@/types/api-types';

type AdminUserListParams = paths['/v1/admin/users']['get']['parameters']['query'];
type UserList = paths['/v1/admin/users']['get']['responses']['200']['content']['application/json'];
type AdminJobListParams = paths['/v1/admin/jobs']['get']['parameters']['query'];
type JobList = paths['/v1/admin/jobs']['get']['responses']['200']['content']['application/json'];

/**
 * Admin endpoints for user and job management (admin role required)
 */
export const adminApi = {
  /**
   * List all users (admin only)
   */
  async listUsers(params?: AdminUserListParams): Promise<UserList> {
    return apiClient.get<UserList>('/v1/admin/users', params);
  },

  /**
   * List all jobs across users (admin only)
   */
  async listAllJobs(params?: AdminJobListParams): Promise<JobList> {
    return apiClient.get<JobList>('/v1/admin/jobs', params);
  },
} as const;