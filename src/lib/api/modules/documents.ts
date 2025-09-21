/**
 * Documents API Module
 * Fully aligned with OpenAPI schema definitions
 */

import { apiClient } from '../client';
import type { paths, Document, PaginationMetadata } from '@/types/api-types';

// Extract exact types from OpenAPI paths
type GetDocumentsParams = paths['/v1/documents']['get']['parameters']['query'];
type GetDocumentsResponse = paths['/v1/documents']['get']['responses']['200']['content']['application/json'];

type GetDocumentResponse = paths['/v1/documents/{documentId}']['get']['responses']['200']['content']['application/json'];

type GetDownloadResponse = paths['/v1/documents/{documentId}/download']['get']['responses']['200']['content']['application/json'];

/**
 * Document management endpoints
 * All endpoints follow OpenAPI schema exactly
 */
export const documentsApi = {
  /**
   * List user documents with pagination and filtering
   */
  async listDocuments(params?: GetDocumentsParams): Promise<GetDocumentsResponse> {
    return apiClient.get<GetDocumentsResponse>('/v1/documents', params);
  },

  /**
   * Get document details by ID
   */
  async getDocument(documentId: string): Promise<Document> {
    return apiClient.get<GetDocumentResponse>(`/v1/documents/${documentId}`);
  },

  /**
   * Delete document and all associated data
   */
  async deleteDocument(documentId: string): Promise<void> {
    return apiClient.delete<void>(`/v1/documents/${documentId}`, {
      retryable: false,
    });
  },

  /**
   * Generate download URL for document
   */
  async getDownloadUrl(documentId: string): Promise<GetDownloadResponse> {
    return apiClient.get<GetDownloadResponse>(`/v1/documents/${documentId}/download`);
  },
} as const;