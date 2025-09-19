/**
 * File Upload Hooks
 * React Query hooks for complete file upload flow
 */

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadsApi, isApiError } from '@/lib/api';
import { documentKeys } from './useDocuments';
import { logger } from '@/services/logger';

import type { paths } from '@/types/api-types';

type SignedUploadRequest = paths['/v1/uploads/sign']['post']['requestBody']['content']['application/json'];
type CompleteUploadRequest = paths['/v1/uploads/{storageKey}/complete']['post']['requestBody']['content']['application/json'];

interface UploadProgress {
  readonly phase: 'signing' | 'uploading' | 'completing' | 'completed' | 'error';
  readonly progress: number;
  readonly bytesUploaded?: number;
  readonly totalBytes?: number;
  readonly error?: string;
}

/**
 * Comprehensive file upload hook with progress tracking
 */
export const useFileUpload = () => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    phase: 'completed',
    progress: 0,
  });

  const getSignedUrlMutation = useMutation({
    mutationFn: (request: SignedUploadRequest) => uploadsApi.getSignedUploadUrl(request),
  });

  const completeUploadMutation = useMutation({
    mutationFn: ({ storageKey, request }: { storageKey: string; request: CompleteUploadRequest }) =>
      uploadsApi.completeUpload(storageKey, request),
    onSuccess: (document) => {
      queryClient.setQueryData(documentKeys.detail(document.id), document);
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });

  /**
   * Complete file upload flow: sign → upload → complete
   */
  const uploadFile = async (file: File, displayName?: string): Promise<string> => {
    try {
      setUploadProgress({ phase: 'signing', progress: 0 });

      // Step 1: Get signed upload URL
      const signedUpload = await getSignedUrlMutation.mutateAsync({
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
      });

      setUploadProgress({ phase: 'uploading', progress: 0, totalBytes: file.size });

      // Step 2: Upload directly to storage
      await uploadsApi.uploadFileToSignedUrl(
        signedUpload.uploadUrl,
        file,
        (progress) => {
          setUploadProgress({
            phase: 'uploading',
            progress,
            bytesUploaded: Math.round((progress / 100) * file.size),
            totalBytes: file.size,
          });
        }
      );

      setUploadProgress({ phase: 'completing', progress: 95 });

      // Step 3: Complete upload and create document record
      const document = await completeUploadMutation.mutateAsync({
        storageKey: signedUpload.storageKey,
        request: {
          name: displayName || file.name,
          metadata: {
            originalFileName: file.name,
            mimeType: file.type,
            fileSize: file.size,
            uploadedAt: new Date().toISOString(),
          },
        },
      });

      setUploadProgress({ phase: 'completed', progress: 100 });

      logger.info('File upload completed successfully', {
        context: { feature: 'uploads', action: 'uploadFile' },
        metadata: {
          documentId: document.id,
          fileName: file.name,
          fileSize: file.size,
          storageKey: signedUpload.storageKey,
        },
      });

      return document.id;

    } catch (error) {
      const errorMessage = isApiError(error) ? error.getUserMessage() : 'Upload failed';
      setUploadProgress({ phase: 'error', progress: 0, error: errorMessage });

      logger.error('File upload failed', {
        context: { feature: 'uploads', action: 'uploadFile' },
        metadata: { fileName: file.name, fileSize: file.size },
        error: error instanceof Error ? error : new Error(String(error)),
      });

      throw error;
    }
  };

  return {
    uploadFile,
    uploadProgress,
    isUploading: ['signing', 'uploading', 'completing'].includes(uploadProgress.phase),
    reset: () => setUploadProgress({ phase: 'completed', progress: 0 }),
  };
};

/**
 * Hook for direct upload to signed URL only
 */
export const useDirectUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: ({ signedUrl, file }: { signedUrl: string; file: File }) =>
      uploadsApi.uploadFileToSignedUrl(signedUrl, file, setUploadProgress),
    onError: (error) => {
      logger.error('Direct file upload failed', {
        context: { feature: 'uploads', action: 'directUpload' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
  });

  return {
    ...mutation,
    uploadProgress,
  };
};