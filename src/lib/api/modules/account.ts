/**
 * Account API Module
 * Generated from OpenAPI spec - Account management endpoints
 */

import { apiClient } from '../client';
import type { paths } from '@/types/api-types';

type UserProfile = paths['/v1/account/me']['get']['responses']['200']['content']['application/json'];
type UpdateProfileRequest = paths['/v1/account/me']['patch']['requestBody']['content']['application/json'];
type DeleteAccountResponse = paths['/v1/account/me']['delete']['responses']['200']['content']['application/json'];

/**
 * Account management endpoints for user profile operations
 */
export const accountApi = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/v1/account/me');
  },

  /**
   * Update user profile
   */
  async updateProfile(updates: UpdateProfileRequest): Promise<UserProfile> {
    return apiClient.patch<UserProfile>('/v1/account/me', updates);
  },

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<DeleteAccountResponse> {
    return apiClient.delete<DeleteAccountResponse>('/v1/account/me', {
      retryable: false, // Account deletion should not be retried
    });
  },
} as const;