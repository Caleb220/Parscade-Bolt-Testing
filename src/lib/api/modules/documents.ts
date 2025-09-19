/**
 * Documents API Module
 * Generated from OpenAPI spec - Document management endpoints
 */

import { apiClient } from '../client';
import type { paths } from '@/types/api-types';

type DocumentListParams = paths['/v1/documents']['get']['parameters']['query'];
type DocumentList = paths['/v1/documents']['get']['responses']['200']['content']['application/json'];
type Document = paths['/v1/documents/{documentId}']['get']['responses']['200']['content']['application/json'];
type DownloadResponse = paths['/v1/documents/{documentId}/download']['get']['responses']['200']['content']['application/json'];

/**
 * Document management endpoints for file operations
 */
export const documentsApi = {
  /**
   * List user documents with pagination and filtering
   */
  async listDocuments(params?: DocumentListParams): Promise<DocumentList> {
    return apiClient.get<DocumentList>('/v1/documents', params);
  },

  /**
   * Get document details by ID
   */
  async getDocument(documentId: string): Promise<Document> {
    return apiClient.get<Document>(`/v1/documents/${documentId}`);
  },

  /**
   * Delete document and all associated data
   */
  async deleteDocument(documentId: string): Promise<void> {
    return apiClient.delete<void>(`/v1/documents/${documentId}`, {
      retryable: false, // Deletion should not be retried
    });
  },

  /**
   * Generate pre-signed URL for downloading document
   */
  async getDownloadUrl(documentId: string): Promise<DownloadResponse> {
    return apiClient.get<DownloadResponse>(`/v1/documents/${documentId}/download`);
  },
} as const;