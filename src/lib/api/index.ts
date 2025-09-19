/**
 * Unified API Client Export
 * Enterprise-grade client for Parscade Backend Integration
 */

export { apiClient } from './client';
export * from './errors';
export { healthApi } from './modules/health';
export { authApi } from './modules/auth';
export { accountApi } from './modules/account';
export { documentsApi } from './modules/documents';
export { uploadsApi } from './modules/uploads';
export { jobsApi } from './modules/jobs';
export { adminApi } from './modules/admin';

// Re-export key types for convenience
export type {
  ApiError,
  NetworkError,
  ValidationError,
  AuthError,
} from './errors';