/**
 * Unified API Client Export
 * Enterprise-grade client for Parscade Backend Integration
 */

export { apiClient, ApiError, isApiError, getErrorMessage, getRequestId } from './client';
export { healthApi } from './modules/health';
export { authApi } from './modules/auth';
export { accountApi } from './modules/account';
export { documentsApi } from './modules/documents';
export { uploadsApi } from './modules/uploads';
export { jobsApi } from './modules/jobs';
export { adminApi } from './modules/admin';