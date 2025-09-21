/**
 * Documents API Hooks
 * Updated to match OpenAPI schema response structure
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/lib/api';
import type { Document } from '@/types/api-types';

// Query keys
const QUERY_KEYS = {
  documents: ['documents'] as const,
  document: (id: string) => ['documents', id] as const,
};

// Documents queries
export const useDocuments = (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.documents, params],
    queryFn: () => documentsApi.listDocuments(params),
    select: (data) => ({
      documents: data.documents,
      pagination: data.pagination,
    }),
  });
};

export const useDocument = (documentId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.document(documentId),
    queryFn: () => documentsApi.getDocument(documentId),
    enabled: !!documentId,
  });
};

// Document mutations
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (documentId: string) => documentsApi.deleteDocument(documentId),
    onSuccess: (_, documentId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.document(documentId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents });
    },
  });
};

export const useDocumentDownload = () => {
  return useMutation({
    mutationFn: (documentId: string) => documentsApi.getDownloadUrl(documentId),
  });
};