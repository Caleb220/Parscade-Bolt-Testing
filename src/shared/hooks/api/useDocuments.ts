/**
 * Documents API Hooks
 * Comprehensive document management with upload, ingest, and full CRUD operations
 * Updated to match backend handoff specification
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/lib/api/modules/documents';
import { useToast } from '@/shared/components/ui/use-toast';
import { getErrorMessage } from '@/lib/api';
import type { 
  Document,
  DocumentUpdateData,
  DocumentQueryParams,
  PaginatedResponse
} from '@/types/api-types';

// Query keys
const QUERY_KEYS = {
  documents: ['documents'] as const,
  document: (id: string) => ['documents', id] as const,
};

/**
 * Documents list query with comprehensive filtering
 */
export const useDocuments = (params?: DocumentQueryParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.documents, params],
    queryFn: () => documentsApi.listDocuments(params),
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'statusCode' in error) {
        if (error.statusCode === 401 || error.statusCode === 404) {
          return false;
        }
      }
      return failureCount < 2;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Single document query
 */
export const useDocument = (documentId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.document(documentId),
    queryFn: () => documentsApi.getDocument(documentId),
    enabled: !!documentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Upload document mutation with progress tracking
 */
export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ 
      file, 
      name, 
      projectId, 
      metadata 
    }: { 
      file: File; 
      name?: string; 
      projectId?: string; 
      metadata?: Record<string, unknown> 
    }) => documentsApi.uploadDocument(file, name, projectId, metadata),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents });
      
      toast({
        title: 'Document uploaded',
        description: `"${response.document.name}" has been uploaded successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Upload failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

/**
 * Ingest document from URL mutation
 */
export const useIngestDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: {
      url: string;
      name?: string;
      projectId?: string;
      mime_type?: string;
      metadata?: Record<string, unknown>;
    }) => documentsApi.ingestDocument(data),
    onSuccess: (document) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents });
      
      toast({
        title: 'Document ingested',
        description: `"${document.name}" has been ingested from URL successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Ingestion failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

/**
 * Update document mutation
 */
export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ documentId, data }: { documentId: string; data: DocumentUpdateData }) => 
      documentsApi.updateDocument(documentId, data),
    onSuccess: (document) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.document(document.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents });
      
      toast({
        title: 'Document updated',
        description: `"${document.name}" has been updated successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Update failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

/**
 * Delete document mutation
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (documentId: string) => documentsApi.deleteDocument(documentId),
    onSuccess: (_, documentId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.document(documentId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents });
      
      toast({
        title: 'Document deleted',
        description: 'The document has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Deletion failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

/**
 * Document download mutation
 */
export const useDocumentDownload = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (documentId: string) => documentsApi.getDownloadUrl(documentId),
    onSuccess: (response) => {
      // Open download URL in new tab
      window.open(response.download_url, '_blank');
      
      toast({
        title: 'Download started',
        description: 'Your document download has been initiated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Download failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};