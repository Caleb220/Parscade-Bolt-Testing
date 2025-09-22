/**
 * Documents API Module
 * Comprehensive document management with upload, ingest, and full CRUD operations
 * Fully aligned with backend handoff specification
 */

import { apiClient } from '../client';
import type { 
  Document,
  DocumentCreateData,
  DocumentUpdateData,
  DocumentQueryParams,
  DocumentUploadResponse,
  DocumentDownloadResponse,
  PaginatedResponse
} from '@/types/api-types';

/**
 * Document management endpoints
 * All endpoints follow backend specification exactly
 */
export const documentsApi = {
  /**
   * Upload a new document file
   */
  async uploadDocument(
    file: File,
    name?: string,
    projectId?: string,
    metadata?: Record<string, unknown>
  ): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (name) {
      formData.append('name', name);
    }
    
    if (projectId) {
      formData.append('project_id', projectId);
    }
    
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    return apiClient.post<DocumentUploadResponse>('/v1/documents/upload', formData, {
      headers: {
        'Content-Type': undefined, // Let browser set multipart boundary
      },
    });
  },

  /**
   * Ingest document from URL
   */
  async ingestDocument(data: {
    url: string;
    name?: string;
    projectId?: string;
    mime_type?: string;
    metadata?: Record<string, unknown>;
  }): Promise<Document> {
    const requestBody = {
      url: data.url,
      ...(data.name && { name: data.name }),
      ...(data.projectId && { project_id: data.projectId }),
      ...(data.mime_type && { mime_type: data.mime_type }),
      ...(data.metadata && { metadata: data.metadata }),
    };

    return apiClient.post<Document>('/v1/documents/ingest', requestBody);
  },

  /**
   * List user documents with comprehensive filtering and pagination
   */
  async listDocuments(params?: DocumentQueryParams): Promise<PaginatedResponse<Document>> {
    return apiClient.get<PaginatedResponse<Document>>('/v1/documents', params);
  },

  /**
   * Get detailed document information by ID
   */
  async getDocument(documentId: string): Promise<Document> {
    return apiClient.get<Document>(`/v1/documents/${documentId}`);
  },

  /**
   * Update document metadata and properties
   */
  async updateDocument(documentId: string, data: DocumentUpdateData): Promise<Document> {
    return apiClient.patch<Document>(`/v1/documents/${documentId}`, data);
  },

  /**
   * Delete document and associated file from storage
   */
  async deleteDocument(documentId: string): Promise<void> {
    return apiClient.delete<void>(`/v1/documents/${documentId}`, {
      retryable: false,
    });
  },

  /**
   * Generate time-limited signed download URL
   */
  async getDownloadUrl(documentId: string): Promise<DocumentDownloadResponse> {
    return apiClient.get<DocumentDownloadResponse>(`/v1/documents/${documentId}/download`);
  },
} as const;