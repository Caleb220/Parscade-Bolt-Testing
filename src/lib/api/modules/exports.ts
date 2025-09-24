/**
 * Data Export API Module
 * Export functionality endpoints with type safety
 */

import type { 
  Export,
  ExportCreateData,
  ExportQueryParams,
  ExportResponse
} from '@/types/dashboard-types';

import { apiClient } from '../client';

/**
 * Data export endpoints
 * All endpoints follow OpenAPI schema with comprehensive error handling
 */
export const exportsApi = {
  /**
   * Create new export job
   */
  async createExport(data: ExportCreateData): Promise<Export> {
    return apiClient.post<Export>('/v1/exports', data);
  },

  /**
   * Get export status and details
   */
  async getExport(exportId: string): Promise<Export> {
    return apiClient.get<Export>(`/v1/exports/${exportId}`);
  },

  /**
   * List user exports
   */
  async listExports(params?: ExportQueryParams): Promise<ExportResponse> {
    try {
      return await apiClient.get<ExportResponse>('/v1/exports', params);
    } catch (error) {
      console.warn('Exports endpoint not available:', error);
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        total_pages: 0,
      };
    }
  },

  /**
   * Cancel pending export
   */
  async cancelExport(exportId: string): Promise<void> {
    return apiClient.delete<void>(`/v1/exports/${exportId}`, {
      retryable: false,
    });
  },
} as const;