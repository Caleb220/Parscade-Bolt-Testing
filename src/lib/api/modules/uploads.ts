/**
 * Uploads API Module
 * Generated from OpenAPI spec - File upload endpoints
 */

import { apiClient } from '../client';
import type { paths } from '@/types/api-types';

type SignedUploadRequest = paths['/v1/uploads/sign']['post']['requestBody']['content']['application/json'];
type SignedUploadResponse = paths['/v1/uploads/sign']['post']['responses']['200']['content']['application/json'];
type CompleteUploadRequest = paths['/v1/uploads/{storageKey}/complete']['post']['requestBody']['content']['application/json'];
type CompleteUploadResponse = paths['/v1/uploads/{storageKey}/complete']['post']['responses']['201']['content']['application/json'];

/**
 * File upload endpoints for direct storage operations
 */
export const uploadsApi = {
  /**
   * Generate signed URL for direct file upload
   */
  async getSignedUploadUrl(request: SignedUploadRequest): Promise<SignedUploadResponse> {
    return apiClient.post<SignedUploadResponse>('/v1/uploads/sign', request);
  },

  /**
   * Complete upload and create document record
   */
  async completeUpload(
    storageKey: string, 
    request: CompleteUploadRequest
  ): Promise<CompleteUploadResponse> {
    return apiClient.post<CompleteUploadResponse>(
      `/v1/uploads/${storageKey}/complete`, 
      request
    );
  },

  /**
   * Upload file directly to signed URL with progress tracking
   */
  async uploadFileToSignedUrl(
    signedUrl: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return apiClient.uploadFile(signedUrl, file, onProgress);
  },
} as const;