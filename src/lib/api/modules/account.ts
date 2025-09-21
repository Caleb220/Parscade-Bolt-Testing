/**
 * Account Management API Module
 * Fully aligned with OpenAPI schema definitions
 */

import { apiClient } from '../client';
import type { paths, UserProfile, UserSession, SecurityEvent, ApiKey, PaginationMetadata } from '@/types/api-types';

// Extract exact types from OpenAPI paths
type GetProfileResponse = paths['/v1/account/me']['get']['responses']['200']['content']['application/json'];
type UpdateProfileRequest = paths['/v1/account/me']['patch']['requestBody']['content']['application/json'];
type UpdateProfileResponse = paths['/v1/account/me']['patch']['responses']['200']['content']['application/json'];
type DeleteAccountResponse = paths['/v1/account/me']['delete']['responses']['200']['content']['application/json'];

type UploadAvatarResponse = paths['/v1/account/avatar']['post']['responses']['200']['content']['application/json'];

type GetSessionsResponse = paths['/v1/account/sessions']['get']['responses']['200']['content']['application/json'];

type GetSecurityEventsParams = paths['/v1/account/security-events']['get']['parameters']['query'];
type GetSecurityEventsResponse = paths['/v1/account/security-events']['get']['responses']['200']['content']['application/json'];

type GetApiKeysResponse = paths['/v1/keys']['get']['responses']['200']['content']['application/json'];
type CreateApiKeyRequest = paths['/v1/keys']['post']['requestBody']['content']['application/json'];
type CreateApiKeyResponse = paths['/v1/keys']['post']['responses']['201']['content']['application/json'];

/**
 * Account management endpoints
 * All endpoints follow OpenAPI schema exactly
 */
export const accountApi = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<GetProfileResponse>('/v1/account/me');
  },

  /**
   * Update user profile
   */
  async updateProfile(updates: UpdateProfileRequest): Promise<UserProfile> {
    return apiClient.patch<UpdateProfileResponse>('/v1/account/me', updates);
  },

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<DeleteAccountResponse> {
    return apiClient.delete<DeleteAccountResponse>('/v1/account/me', {
      retryable: false,
    });
  },

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<UploadAvatarResponse> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiClient.post<UploadAvatarResponse>('/v1/account/avatar', formData, {
      headers: {
        'Content-Type': undefined, // Let browser set multipart boundary
      },
    });
  },

  /**
   * Get user sessions
   */
  async getSessions(): Promise<UserSession[]> {
    const response = await apiClient.get<GetSessionsResponse>('/v1/account/sessions');
    return response.sessions;
  },

  /**
   * Revoke specific session
   */
  async revokeSession(sessionId: string): Promise<void> {
    return apiClient.delete<void>(`/v1/account/sessions/${sessionId}`, {
      retryable: false,
    });
  },

  /**
   * Get security events
   */
  async getSecurityEvents(params?: GetSecurityEventsParams): Promise<SecurityEvent[]> {
    const response = await apiClient.get<GetSecurityEventsResponse>('/v1/account/security-events', params);
    return response.events;
  },

  /**
   * Get API keys
   */
  async getApiKeys(): Promise<ApiKey[]> {
    const response = await apiClient.get<GetApiKeysResponse>('/v1/keys');
    return response.keys;
  },

  /**
   * Create new API key
   */
  async createApiKey(data: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
    return apiClient.post<CreateApiKeyResponse>('/v1/keys', data);
  },

  /**
   * Revoke API key
   */
  async revokeApiKey(keyId: string): Promise<void> {
    return apiClient.delete<void>(`/v1/keys/${keyId}`, {
      retryable: false,
    });
  },
} as const;