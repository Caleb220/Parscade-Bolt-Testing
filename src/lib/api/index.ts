/**
 * Unified API Client Export
 * Enterprise-grade client for Parscade Backend Integration
 */

export { apiClient, ApiError } from './client';
export { healthApi } from './modules/health';
export { authApi } from './modules/auth';
export { accountApi } from './modules/account';
export { documentsApi } from './modules/documents';
export { uploadsApi } from './modules/uploads';
export { jobsApi } from './modules/jobs';
export { adminApi } from './modules/admin';

// Utility functions
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.getUserMessage();
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export const getRequestId = (error: unknown): string | undefined => {
  if (isApiError(error)) {
    return error.requestId;
  }
  
  return undefined;
};