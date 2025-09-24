/**
 * Data Export Hooks
 * Type-safe hooks for export functionality
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getErrorMessage } from '@/lib/api';
import { exportsApi } from '@/lib/api/modules/exports';
import { useToast } from '@/shared/components/ui/use-toast';
import type { 
  ExportCreateData, 
  ExportQueryParams 
} from '@/types/dashboard-types';

// Query keys
const QUERY_KEYS = {
  exports: ['exports'] as const,
  export: (id: string) => ['exports', id] as const,
};

/**
 * Exports list hook
 */
export const useExports = (params?: ExportQueryParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.exports, params],
    queryFn: () => exportsApi.listExports(params),
    staleTime: 30 * 1000, // 30 seconds
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * Single export hook with polling for active exports
 */
export const useExport = (exportId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.export(exportId),
    queryFn: () => exportsApi.getExport(exportId),
    enabled: !!exportId,
    refetchInterval: (data) => {
      // Poll every 5 seconds for active exports
      if (data?.status === 'pending' || data?.status === 'processing') {
        return 5000;
      }
      return false;
    },
  });
};

/**
 * Create export mutation
 */
export const useCreateExport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: ExportCreateData) => exportsApi.createExport(data),
    onSuccess: (exportJob) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exports });
      
      toast({
        title: 'Export started',
        description: `Your ${exportJob.type} export has been queued for processing.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Export failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

/**
 * Cancel export mutation
 */
export const useCancelExport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (exportId: string) => exportsApi.cancelExport(exportId),
    onSuccess: (_, exportId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.export(exportId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exports });
      
      toast({
        title: 'Export cancelled',
        description: 'The export has been cancelled successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Cancellation failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};