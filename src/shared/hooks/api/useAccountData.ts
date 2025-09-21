/**
 * Account Data Hooks
 * Updated to match OpenAPI schema response structure
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApi } from '@/lib/api/modules/account';
import { useToast } from '@/shared/components/ui/use-toast';
import { getErrorMessage } from '@/lib/api';
import type { UserProfile, ApiKey, UserSession, SecurityEvent } from '@/types/api-types';

// Query keys
const QUERY_KEYS = {
  account: ['account'] as const,
  apiKeys: ['account', 'api-keys'] as const,
  sessions: ['account', 'sessions'] as const,
  securityEvents: ['account', 'security-events'] as const,
  notificationPreferences: ['account', 'notification-preferences'] as const,
  webhooks: ['account', 'webhooks'] as const,
  services: ['account', 'services'] as const,
  dataSources: ['account', 'data-sources'] as const,
};

// Account queries
export const useAccount = () => {
  return useQuery({
    queryKey: QUERY_KEYS.account,
    queryFn: () => accountApi.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: { fullName?: string | null; timezone?: string }) => 
      accountApi.updateProfile(data),
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.account });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<UserProfile>(QUERY_KEYS.account);

      // Optimistically update
      if (previousData) {
        queryClient.setQueryData<UserProfile>(QUERY_KEYS.account, {
          ...previousData,
          ...newData,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousData };
    },
    onError: (error, newData, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(QUERY_KEYS.account, context.previousData);
      }
      
      toast({
        title: 'Update failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(QUERY_KEYS.account, updatedProfile);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (file: File) => accountApi.uploadAvatar(file),
    onSuccess: (response) => {
      // Update the cached profile with new avatar URL
      queryClient.setQueryData<UserProfile>(QUERY_KEYS.account, (old) => {
        if (old) {
          return {
            ...old,
            avatarUrl: response.avatarUrl,
            updatedAt: new Date().toISOString(),
          };
        }
        return old;
      });
      
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated successfully.',
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

// API Keys queries
export const useApiKeys = () => {
  return useQuery({
    queryKey: QUERY_KEYS.apiKeys,
    queryFn: async () => {
      try {
        return await accountApi.getApiKeys();
      } catch (error) {
        // Return empty array for graceful fallback
        console.warn('Failed to fetch API keys:', error);
        return [];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { name: string; scopes?: string[] }) => 
      accountApi.createApiKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.apiKeys });
    },
  });
};

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (keyId: string) => accountApi.revokeApiKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.apiKeys });
    },
  });
};

// Sessions queries
export const useSessions = () => {
  return useQuery({
    queryKey: QUERY_KEYS.sessions,
    queryFn: async () => {
      try {
        return await accountApi.getSessions();
      } catch (error) {
        // Return empty array for graceful fallback
        console.warn('Failed to fetch sessions:', error);
        return [];
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId: string) => accountApi.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sessions });
    },
  });
};

// Security events queries
export const useSecurityEvents = () => {
  return useQuery({
    queryKey: QUERY_KEYS.securityEvents,
    queryFn: async () => {
      try {
        return await accountApi.getSecurityEvents({ limit: 20 });
      } catch (error) {
        // Return empty array for graceful fallback
        console.warn('Failed to fetch security events:', error);
        return [];
      }
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Notification preferences (mock implementation)
export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: QUERY_KEYS.notificationPreferences,
    queryFn: async () => {
      // Mock data matching the schema structure
      return {
        channels: { email: true, in_app: true, webhook: false },
        categories: {
          product: 'immediate' as const,
          billing: 'immediate' as const,
          incidents: 'immediate' as const,
          jobs: 'daily' as const,
          digest: 'weekly' as const,
        },
        dnd: {
          start: '22:00',
          end: '08:00',
          timezone: 'UTC',
        },
        webhook_url: '',
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: any) => {
      // Mock implementation - replace with actual API call when available
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.notificationPreferences, data);
      
      toast({
        title: 'Preferences updated',
        description: 'Your notification preferences have been updated successfully.',
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

// Webhooks (mock implementation)
export const useWebhooks = () => {
  return useQuery({
    queryKey: QUERY_KEYS.webhooks,
    queryFn: async () => {
      // Mock data - replace with actual API call when available
      return [];
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateWebhook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { ...data, secret: 'wh_secret_' + Math.random().toString(36).substr(2, 9) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.webhooks });
    },
  });
};

export const useDeleteWebhook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (webhookId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.webhooks });
    },
  });
};

export const useTestWebhook = () => {
  return useMutation({
    mutationFn: async (webhookId: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { status: 200, latency: 150, response: 'OK' };
    },
  });
};

// Services (mock implementation)
export const useServices = () => {
  return useQuery({
    queryKey: ['account', 'services'],
    queryFn: async () => {
      return [
        {
          id: 'google-drive',
          name: 'Google Drive',
          description: 'Connect your Google Drive for document sync',
          connected: false,
          icon_url: null,
          last_sync: null,
        },
        {
          id: 'dropbox',
          name: 'Dropbox',
          description: 'Connect your Dropbox for document sync',
          connected: false,
          icon_url: null,
          last_sync: null,
        },
        {
          id: 'slack',
          name: 'Slack',
          description: 'Get notifications in your Slack workspace',
          connected: false,
          icon_url: null,
          last_sync: null,
        },
      ];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useConnectService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (serviceId: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'services'] });
    },
  });
};

export const useDisconnectService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (serviceId: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'services'] });
    },
  });
};

// Data Sources (mock implementation)
export const useDataSources = () => {
  return useQuery({
    queryKey: QUERY_KEYS.dataSources,
    queryFn: async () => {
      return [];
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateDataSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dataSources });
    },
  });
};

export const useDeleteDataSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sourceId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dataSources });
    },
  });
};

export const useTestDataSource = () => {
  return useMutation({
    mutationFn: async (sourceId: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { status: 'success' as const, message: 'Connection successful' };
    },
  });
};