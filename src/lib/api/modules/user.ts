/**
 * User Authentication API Module
 * Fully aligned with OpenAPI schema definitions
 */

import { apiClient } from '../client';
import type { paths } from '@/types/api-types';

// Extract exact types from OpenAPI paths
type SignUpRequest = paths['/v1/auth/signup']['post']['requestBody']['content']['application/json'];
type SignUpResponse = paths['/v1/auth/signup']['post']['responses']['201']['content']['application/json'];

type SignInRequest = paths['/v1/auth/signin']['post']['requestBody']['content']['application/json'];
type SignInResponse = paths['/v1/auth/signin']['post']['responses']['200']['content']['application/json'];

type SignOutResponse = paths['/v1/auth/signout']['post']['responses']['200']['content']['application/json'];

type ResetPasswordRequest = paths['/v1/auth/reset-password']['post']['requestBody']['content']['application/json'];
type ResetPasswordResponse = paths['/v1/auth/reset-password']['post']['responses']['200']['content']['application/json'];

/**
 * User authentication API endpoints
 * All endpoints follow OpenAPI schema exactly
 */
export const userApi = {
  /**
   * Sign up with email/password and optional profile data
   * Backend handles email confirmation if enabled
   */
  async signUp(body: SignUpRequest): Promise<SignUpResponse> {
    return apiClient.post<SignUpResponse>('/v1/auth/signup', body, {
      retryable: false,
    });
  },

  /**
   * Sign in with email or username + password
   * Backend resolves username to email internally
   */
  async signIn(body: SignInRequest): Promise<SignInResponse> {
    return apiClient.post<SignInResponse>('/v1/auth/signin', body, {
      retryable: false,
    });
  },

  /**
   * Sign out current session
   * Requires valid bearer token
   */
  async signOut(): Promise<SignOutResponse> {
    return apiClient.post<SignOutResponse>('/v1/auth/signout', {}, {
      retryable: false,
    });
  },

  /**
   * Request password reset email
   * Public endpoint, no authentication required
   */
  async resetPassword(body: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return apiClient.post<ResetPasswordResponse>('/v1/auth/reset-password', body, {
      retryable: false,
    });
  },
} as const;