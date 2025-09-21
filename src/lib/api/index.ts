/**
 * Unified API Client Export
 * Enterprise-grade client for Parscade Backend Integration
 */

export { apiClient } from './client';
export { isApiError, getErrorMessage, getRequestId } from './errors';
export { healthApi } from './modules/health';
export { authApi } from './modules/auth';
export { accountApi } from './modules/account';
export { notificationsApi } from './modules/notifications';
export { integrationsApi } from './modules/integrations';
export { documentsApi } from './modules/documents';
export { uploadsApi } from './modules/uploads';
export { jobsApi } from './modules/jobs';
export { adminApi } from './modules/admin';