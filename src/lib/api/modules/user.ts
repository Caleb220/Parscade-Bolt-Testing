/**
 * Auth & Account API (frontend SDK)
 * Typed from OpenAPI `paths`, using your apiClient.
 */

import { apiClient } from '../client';
import type { paths } from '@/types/api-types';
import { RequestOptions } from '../client'

type WithAuth = { accessToken?: string; retryable?: boolean };

/** Small helper to build per-call options with optional bearer */
function withAuth(opts?: WithAuth): RequestOptions {
  const headers: HeadersInit | undefined = opts?.accessToken
    ? { Authorization: `Bearer ${opts.accessToken}` }
    : undefined;

  return { ...(headers ? { headers } : {}), retryable: opts?.retryable ?? false };
}

/* =========================
 *  Type aliases from OpenAPI
 * ========================= */

// /v1/auth/signup
type SignUpReq =
  paths['/v1/auth/signup']['post']['requestBody']['content']['application/json'];
type SignUpRes =
  paths['/v1/auth/signup']['post']['responses']['201']['content']['application/json'];

// /v1/auth/signin
type SignInReq =
  paths['/v1/auth/signin']['post']['requestBody']['content']['application/json'];
type SignInRes =
  paths['/v1/auth/signin']['post']['responses']['200']['content']['application/json'];

// /v1/auth/signout (protected)
type SignOutRes =
  paths['/v1/auth/signout']['post']['responses']['200']['content']['application/json'];

// /v1/auth/reset-password
type ResetPasswordReq =
  paths['/v1/auth/reset-password']['post']['requestBody']['content']['application/json'];
type ResetPasswordRes =
  paths['/v1/auth/reset-password']['post']['responses']['200']['content']['application/json'];


/* =========================
 *  Public API
 * ========================= */

export const userApi = {
  /**
   * Sign up with email/password (+ optional full_name & username).
   * Backend may return `session === null` if email confirmations are enabled.
   */
  async signUp(body: SignUpReq) {
    return apiClient.post<SignUpRes>('/v1/auth/signup', body, {
      retryable: false,
    });
  },

  /**
   * Sign in with email or username + password.
   * If using username, the backend resolves username -> email.
   * Returns `{ user, session }` on success.
   */
  async signIn(body: SignInReq) {
    return apiClient.post<SignInRes>('/v1/auth/signin', body, {
      retryable: false,
    });
  },

  /**
   * Sign out (requires bearer token).
   * Pass `accessToken` if your apiClient doesn't inject it automatically.
   */
  async signOut(opts?: WithAuth) {
    return apiClient.post<SignOutRes>('/v1/auth/signout', {}, withAuth(opts));
  },

  /**
   * Request password reset email (public).
   */
  async resetPassword(body: ResetPasswordReq) {
    return apiClient.post<ResetPasswordRes>('/v1/auth/reset-password', body, {
      retryable: false,
    });
  },
} as const;
