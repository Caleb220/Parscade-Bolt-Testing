/**
 * Documents API Hooks
 * React Query hooks for document management operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/lib/api';
import { logger } from '@/services/logger';

import type { paths } from '@/types/api-types';

type DocumentListParams = paths['/v1/documents']['get']['parameters']['query'];
type DocumentList = paths['/v1/documents']['get']['responses']['200']['content']['application/json'];
type Document = paths['/v1/documents/{documentId}']['get']['responses']['200']['content']['application/json'];

/**
 * Query keys for document-related queries
 */
export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (params?: DocumentListParams) => [...documentKeys.lists(), params] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
} as const;

/**
 * Hook to fetch paginated list of user documents
 */
export const useDocuments = (params?: DocumentListParams) => {
  return useQuery({
    queryKey: documentKeys.list(params),
    queryFn: () => documentsApi.listDocuments(params),
    staleTime: 2 * 60 * 1000, // Documents can be stale for 2 minutes
  });
};

/**
 * Hook to fetch specific document details
 */
export const useDocument = (documentId: string) => {
  return useQuery({
    queryKey: documentKeys.detail(documentId),
    queryFn: () => documentsApi.getDocument(documentId),
    enabled: !!documentId, // Only run if documentId is provided
    staleTime: 5 * 60 * 1000, // Document details can be stale for 5 minutes
  });
};

/**
 * Hook to delete a document
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => documentsApi.deleteDocument(documentId),
    onSuccess: (_result, documentId) => {
      // Remove document from cache
      queryClient.removeQueries({ queryKey: documentKeys.detail(documentId) });
      
      // Invalidate document lists to reflect deletion
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });

      logger.info('Document deleted successfully', {
        context: { feature: 'documents', action: 'deleteDocument' },
        metadata: { documentId },
      });
    },
    onError: (error, documentId) => {
      logger.error('Failed to delete document', {
        context: { feature: 'documents', action: 'deleteDocument' },
        metadata: { documentId },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
  });
};

/**
 * Hook to get document download URL
 */
export const useDocumentDownload = () => {
  return useMutation({
    mutationFn: (documentId: string) => documentsApi.getDownloadUrl(documentId),
    onSuccess: (downloadData, documentId) => {
      logger.debug('Download URL generated', {
        context: { feature: 'documents', action: 'getDownloadUrl' },
        metadata: { documentId, expiresAt: downloadData.expiresAt },
      });
    },
    onError: (error, documentId) => {
      logger.error('Failed to generate download URL', {
        context: { feature: 'documents', action: 'getDownloadUrl' },
        metadata: { documentId },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
  });
};