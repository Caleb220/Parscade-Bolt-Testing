/**
 * Account Management API Module
 * Fully aligned with OpenAPI schema definitions using snake_case
 */

import type {
  paths,
  UserProfile,
  UpdateProfileRequest,
  UserSession,
  UserSessionListResponse,
  SecurityEvent,
  SecurityEventListResponse,
  ApiKey,
  ApiKeyListResponse,
  ApiKeyWithSecret,
  CreateApiKeyRequest,
} from '@/types/api-types';

import { apiClient } from '../client';

// Extract exact types from OpenAPI paths
type GetProfileResponse =
  paths['/v1/account/me']['get']['responses']['200']['content']['application/json'];
type UpdateProfileResponse =
  paths['/v1/account/me']['patch']['responses']['200']['content']['application/json'];
type UploadAvatarResponse =
  paths['/v1/account/avatar']['post']['responses']['200']['content']['application/json'];

/**
 * Account management endpoints
 * All endpoints follow OpenAPI schema exactly with snake_case
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
    // Filter out undefined values and prepare request
    const cleanedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    ) as UpdateProfileRequest;

    return await apiClient.patch<UpdateProfileResponse>('/v1/account/me', cleanedUpdates);
  },

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<UploadAvatarResponse> {
    const formData = new FormData();
    formData.append('avatar', file);

    return apiClient.post<UploadAvatarResponse>('/v1/account/avatar', formData, {
      headers: {
        'Content-Type': null, // Let browser set multipart boundary
      },
    });
  },

  /**
   * Get user sessions with proper data extraction
   */
  async getSessions(): Promise<UserSession[]> {
    const response = await apiClient.get<UserSessionListResponse>('/v1/account/sessions');
    return response.data || [];
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
   * Get security events with proper data extraction
   */
  async getSecurityEvents(): Promise<SecurityEvent[]> {
    const response = await apiClient.get<SecurityEventListResponse>('/v1/account/security-events');
    return response.data || [];
  },

  /**
   * Get API keys with proper data extraction
   */
  async getApiKeys(): Promise<ApiKey[]> {
    const response = await apiClient.get<ApiKeyListResponse>('/v1/keys');
    return response.data || [];
  },

  /**
   * Create new API key
   */
  async createApiKey(data: CreateApiKeyRequest): Promise<ApiKeyWithSecret> {
    return apiClient.post<ApiKeyWithSecret>('/v1/keys', data);
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
