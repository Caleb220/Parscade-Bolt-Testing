/**
 * File Upload Hooks
 * Updated to match OpenAPI schema response structure
 */

import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadsApi } from '@/lib/api/modules/uploads';

interface UploadProgress {
  readonly phase: 'idle' | 'signing' | 'uploading' | 'completing' | 'completed' | 'error';
  readonly progress: number;
  readonly bytesUploaded?: number;
  readonly totalBytes?: number;
  readonly error?: string;
}

export const useFileUpload = () => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    phase: 'idle',
    progress: 0,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File): Promise<string> => {
      try {
        // Phase 1: Get signed URL
        setUploadProgress({ phase: 'signing', progress: 10 });
        
        const signedUrlResponse = await uploadsApi.getSignedUploadUrl({
          fileName: file.name,
          mimeType: file.type,
          size: file.size,
        });

        // Phase 2: Upload file
        setUploadProgress({ phase: 'uploading', progress: 20 });
        
        await uploadsApi.uploadFileToSignedUrl(
          signedUrlResponse.uploadUrl,
          file,
          (progress) => {
            setUploadProgress({
              phase: 'uploading',
              progress: 20 + (progress * 0.6), // 20% to 80%
              bytesUploaded: (file.size * progress) / 100,
              totalBytes: file.size,
            });
          }
        );

        // Phase 3: Complete upload
        setUploadProgress({ phase: 'completing', progress: 90 });
        
        const document = await uploadsApi.completeUpload(signedUrlResponse.storageKey, {
          name: file.name,
          metadata: {
            originalSize: file.size,
            uploadedAt: new Date().toISOString(),
          },
        });

        // Phase 4: Success
        setUploadProgress({ phase: 'completed', progress: 100 });
        
        return document.id;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setUploadProgress({
          phase: 'error',
          progress: 0,
          error: errorMessage,
        });
        throw error;
      }
    },
  });

  const reset = useCallback(() => {
    setUploadProgress({ phase: 'idle', progress: 0 });
  }, []);

  return {
    uploadFile: uploadMutation.mutateAsync,
    uploadProgress,
    isUploading: uploadMutation.isPending,
    error: uploadMutation.error,
    reset,
  };
};