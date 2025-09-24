/**
 * File Upload API Module
 * Fully aligned with OpenAPI schema definitions
 */

import type { paths, Document } from '@/types/api-types';

import { apiClient } from '../client';

// Extract exact types from OpenAPI paths
type SignedUploadRequest = paths['/v1/uploads/sign']['post']['requestBody']['content']['application/json'];
type SignedUploadResponse = paths['/v1/uploads/sign']['post']['responses']['200']['content']['application/json'];

type CompleteUploadRequest = paths['/v1/uploads/{storageKey}/complete']['post']['requestBody']['content']['application/json'];
type CompleteUploadResponse = paths['/v1/uploads/{storageKey}/complete']['post']['responses']['201']['content']['application/json'];

/**
 * File upload endpoints
 * All endpoints follow OpenAPI schema exactly
 */
export const uploadsApi = {
  /**
   * Get signed URL for direct file upload
   */
  async getSignedUploadUrl(request: SignedUploadRequest): Promise<SignedUploadResponse> {
    return apiClient.post<SignedUploadResponse>('/v1/uploads/sign', request);
  },

  /**
   * Complete upload and create document record
   */
  async completeUpload(storageKey: string, request: CompleteUploadRequest): Promise<Document> {
    return apiClient.post<CompleteUploadResponse>(`/v1/uploads/${storageKey}/complete`, request);
  },

  /**
   * Upload file to signed URL with progress tracking
   */
  async uploadFileToSignedUrl(
    signedUrl: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return apiClient.uploadFile(signedUrl, file, onProgress);
  },
} as const;