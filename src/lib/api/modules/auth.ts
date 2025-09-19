/**
 * Authentication API Module
 * Generated from OpenAPI spec - Authentication endpoints
 */

import { apiClient } from '../client';
import type { paths } from '@/types/api-types';

type AuthCallbackRequest = paths['/v1/auth/callback']['post']['requestBody']['content']['application/json'];
type AuthResponse = paths['/v1/auth/callback']['post']['responses']['200']['content']['application/json'];

/**
 * Authentication endpoints for backend session management
 */
export const authApi = {
  /**
   * Handle authentication callback from Supabase
   */
  async callback(request: AuthCallbackRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/v1/auth/callback', request, {
      retryable: false, // Auth operations should not be retried
    });
  },
} as const;