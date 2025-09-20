/**
 * React Query hooks for Account data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountAPI } from '@/lib/api/account';
import { logger } from '@/services/logger';
import type { User, ApiKey, NotificationPrefs, Webhook, Session, SecurityEvent, Service, DataSource } from '@/lib/types';
import type { ProfileFormData, ApiKeyFormData, WebhookFormData, NotificationPrefsFormData, DataSourceFormData } from '@/lib/validation/account';

// Query keys
export const accountKeys = {
  all: ['account'] as const,
  me: () => [...accountKeys.all, 'me'] as const,
  apiKeys: () => [...accountKeys.all, 'api-keys'] as const,
  sessions: () => [...accountKeys.all, 'sessions'] as const,
  securityEvents: () => [...accountKeys.all, 'security-events'] as const,
  notifications: () => [...accountKeys.all, 'notifications'] as const,
  webhooks: () => [...accountKeys.all, 'webhooks'] as const,
  services: () => [...accountKeys.all, 'services'] as const,
  dataSources: () => [...accountKeys.all, 'data-sources'] as const,
} as const;

// Profile hooks
export const useAccount = () => {
  return useQuery({
    queryKey: accountKeys.me(),
    queryFn: () => accountAPI.getMe(),
    staleTime: 60 * 1000, // 1 minute
    retry: (failureCount, error: any) => {
      if (error?.statusCode === 401) return false;
      return failureCount < 2;
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ProfileFormData) => accountAPI.updateProfile(data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: accountKeys.me() });
      
      const previousUser = queryClient.getQueryData<User>(accountKeys.me());
      
      if (previousUser) {
        queryClient.setQueryData<User>(accountKeys.me(), {
          ...previousUser,
          ...newData,
          updated_at: new Date().toISOString(),
        });
      }
      
      return { previousUser };
    },
    onError: (error, _variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(accountKeys.me(), context.previousUser);
      }
      logger.error('Failed to update account', {
        context: { feature: 'account', action: 'updateProfile' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(accountKeys.me(), updatedUser);
      logger.info('Account updated successfully', {
        context: { feature: 'account', action: 'updateProfile' },
      });
    },
  });
};

// API Keys hooks
export const useApiKeys = () => {
  return useQuery({
    queryKey: accountKeys.apiKeys(),
    queryFn: () => accountAPI.getApiKeys(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ApiKeyFormData) => accountAPI.createApiKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.apiKeys() });
      logger.info('API key created successfully', {
        context: { feature: 'account', action: 'createApiKey' },
      });
    },
    onError: (error) => {
      logger.error('Failed to create API key', {
        context: { feature: 'account', action: 'createApiKey' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
  });
};

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => accountAPI.revokeApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.apiKeys() });
      logger.info('API key revoked successfully', {
        context: { feature: 'account', action: 'revokeApiKey' },
      });
    },
    onError: (error) => {
      logger.error('Failed to revoke API key', {
        context: { feature: 'account', action: 'revokeApiKey' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
  });
};

// Sessions hooks
export const useSessions = () => {
  return useQuery({
    queryKey: accountKeys.sessions(),
    queryFn: () => accountAPI.getSessions(),
    staleTime: 30 * 1000,
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => accountAPI.revokeSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.sessions() });
    },
  });
};

// Security events hooks
export const useSecurityEvents = () => {
  return useQuery({
    queryKey: accountKeys.securityEvents(),
    queryFn: () => accountAPI.getSecurityEvents(),
    staleTime: 60 * 1000,
  });
};

// Notifications hooks
export const useNotificationPrefs = () => {
  return useQuery({
    queryKey: accountKeys.notifications(),
    queryFn: () => accountAPI.getNotificationPrefs(),
    staleTime: 30 * 1000,
  });
};

export const useUpdateNotificationPrefs = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: NotificationPrefsFormData) => accountAPI.updateNotificationPrefs(data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: accountKeys.notifications() });
      
      const previousPrefs = queryClient.getQueryData<NotificationPrefs>(accountKeys.notifications());
      
      if (previousPrefs) {
        queryClient.setQueryData<NotificationPrefs>(accountKeys.notifications(), {
          ...previousPrefs,
          ...newData,
        });
      }
      
      return { previousPrefs };
    },
    onError: (error, _variables, context) => {
      if (context?.previousPrefs) {
        queryClient.setQueryData(accountKeys.notifications(), context.previousPrefs);
      }
    },
    onSuccess: (updatedPrefs) => {
      queryClient.setQueryData(accountKeys.notifications(), updatedPrefs);
    },
  });
};

// Webhooks hooks
export const useWebhooks = () => {
  return useQuery({
    queryKey: accountKeys.webhooks(),
    queryFn: () => accountAPI.getWebhooks(),
    staleTime: 30 * 1000,
  });
};

export const useCreateWebhook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: WebhookFormData) => accountAPI.createWebhook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.webhooks() });
    },
  });
};

export const useTestWebhook = () => {
  return useMutation({
    mutationFn: (id: string) => accountAPI.testWebhook(id),
  });
};

// Services hooks
export const useServices = () => {
  return useQuery({
    queryKey: accountKeys.services(),
    queryFn: () => accountAPI.getServices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Data sources hooks
export const useDataSources = () => {
  return useQuery({
    queryKey: accountKeys.dataSources(),
    queryFn: () => accountAPI.getDataSources(),
    staleTime: 30 * 1000,
  });
};

export const useCreateDataSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: DataSourceFormData) => accountAPI.createDataSource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.dataSources() });
    },
  });
};