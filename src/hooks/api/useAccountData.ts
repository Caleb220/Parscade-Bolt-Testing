/**
 * React Query hooks for Account data with comprehensive error handling
 * Updated for backend integration with robust retry logic and user feedback
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountAPI } from '@/lib/api/account';
import { logger } from '@/services/logger';
import { isApiError, getErrorMessage } from '@/lib/api';
import type { User, ApiKey, NotificationPrefs, Webhook, Session, SecurityEvent, Service, DataSource } from '@/lib/types';
import type { ProfileFormData, ApiKeyFormData, WebhookFormData, NotificationPrefsFormData, DataSourceFormData } from '@/lib/validation/account';

// Query keys for React Query cache management
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

// ============================================================================
// PROFILE HOOKS
// ============================================================================

export const useAccount = () => {
  return useQuery({
    queryKey: accountKeys.me(),
    queryFn: () => accountAPI.getMe(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error: any) => {
      // Don't retry auth errors
      if (isApiError(error) && (error.statusCode === 401 || error.statusCode === 403)) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ProfileFormData) => accountAPI.updateProfile(data),
    onMutate: async (newData) => {
      // Cancel outgoing refetches to prevent optimistic update conflicts
      await queryClient.cancelQueries({ queryKey: accountKeys.me() });
      
      const previousUser = queryClient.getQueryData<User>(accountKeys.me());
      
      // Optimistically update the cache
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
      // Rollback optimistic update on error
      if (context?.previousUser) {
        queryClient.setQueryData(accountKeys.me(), context.previousUser);
      }
      
      logger.error('Failed to update account profile', {
        context: { feature: 'account', action: 'updateProfile' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
    onSuccess: (updatedUser) => {
      // Ensure cache reflects server response
      queryClient.setQueryData(accountKeys.me(), updatedUser);
      
      logger.info('Account profile updated successfully', {
        context: { feature: 'account', action: 'updateProfile' },
      });
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => accountAPI.uploadAvatar(file),
    onSuccess: (response, _file) => {
      // Update the user's avatar_url in cache
      const currentUser = queryClient.getQueryData<User>(accountKeys.me());
      if (currentUser) {
        queryClient.setQueryData<User>(accountKeys.me(), {
          ...currentUser,
          avatar_url: response.avatar_url,
          updated_at: new Date().toISOString(),
        });
      }
      
      logger.info('Avatar uploaded successfully', {
        context: { feature: 'account', action: 'uploadAvatar' },
        metadata: { avatarUrl: response.avatar_url },
      });
    },
    onError: (error) => {
      logger.error('Failed to upload avatar', {
        context: { feature: 'account', action: 'uploadAvatar' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
  });
};

// ============================================================================
// SECURITY HOOKS
// ============================================================================

export const useApiKeys = () => {
  return useQuery({
    queryKey: accountKeys.apiKeys(),
    queryFn: () => accountAPI.getApiKeys(),
    staleTime: 30 * 1000, // 30 seconds
    retry: (failureCount, error: any) => {
      if (isApiError(error) && error.statusCode === 401) return false;
      return failureCount < 2;
    },
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
    onMutate: async (keyId) => {
      // Optimistically remove the API key from cache
      await queryClient.cancelQueries({ queryKey: accountKeys.apiKeys() });
      
      const previousKeys = queryClient.getQueryData<readonly ApiKey[]>(accountKeys.apiKeys());
      if (previousKeys) {
        queryClient.setQueryData<readonly ApiKey[]>(
          accountKeys.apiKeys(),
          previousKeys.filter(key => key.id !== keyId)
        );
      }
      
      return { previousKeys };
    },
    onError: (error, _keyId, context) => {
      // Rollback optimistic update
      if (context?.previousKeys) {
        queryClient.setQueryData(accountKeys.apiKeys(), context.previousKeys);
      }
      
      logger.error('Failed to revoke API key', {
        context: { feature: 'account', action: 'revokeApiKey' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.apiKeys() });
      logger.info('API key revoked successfully', {
        context: { feature: 'account', action: 'revokeApiKey' },
      });
    },
  });
};

export const useSessions = () => {
  return useQuery({
    queryKey: accountKeys.sessions(),
    queryFn: () => accountAPI.getSessions(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute for active sessions
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => accountAPI.revokeSession(id),
    onMutate: async (sessionId) => {
      await queryClient.cancelQueries({ queryKey: accountKeys.sessions() });
      
      const previousSessions = queryClient.getQueryData<readonly Session[]>(accountKeys.sessions());
      if (previousSessions) {
        queryClient.setQueryData<readonly Session[]>(
          accountKeys.sessions(),
          previousSessions.filter(session => session.id !== sessionId)
        );
      }
      
      return { previousSessions };
    },
    onError: (error, _sessionId, context) => {
      if (context?.previousSessions) {
        queryClient.setQueryData(accountKeys.sessions(), context.previousSessions);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.sessions() });
    },
  });
};

export const useSecurityEvents = () => {
  return useQuery({
    queryKey: accountKeys.securityEvents(),
    queryFn: () => accountAPI.getSecurityEvents(),
    staleTime: 60 * 1000, // 1 minute
  });
};

// ============================================================================
// NOTIFICATIONS HOOKS
// ============================================================================

export const useNotificationPrefs = () => {
  return useQuery({
    queryKey: accountKeys.notifications(),
    queryFn: () => accountAPI.getNotificationPrefs(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (isApiError(error) && error.statusCode === 404) {
        // If preferences don't exist, that's expected for new users
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useUpdateNotificationPrefs = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: NotificationPrefsFormData) => accountAPI.updateNotificationPrefs(data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: accountKeys.notifications() });
      
      const previousPrefs = queryClient.getQueryData<NotificationPrefs>(accountKeys.notifications());
      
      // Optimistically update cache
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
      
      logger.error('Failed to update notification preferences', {
        context: { feature: 'account', action: 'updateNotificationPrefs' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
    onSuccess: (updatedPrefs) => {
      queryClient.setQueryData(accountKeys.notifications(), updatedPrefs);
      
      logger.info('Notification preferences updated successfully', {
        context: { feature: 'account', action: 'updateNotificationPrefs' },
      });
    },
  });
};

// ============================================================================
// INTEGRATIONS HOOKS
// ============================================================================

export const useWebhooks = () => {
  return useQuery({
    queryKey: accountKeys.webhooks(),
    queryFn: () => accountAPI.getWebhooks(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useCreateWebhook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: WebhookFormData) => accountAPI.createWebhook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.webhooks() });
      
      logger.info('Webhook created successfully', {
        context: { feature: 'account', action: 'createWebhook' },
      });
    },
    onError: (error) => {
      logger.error('Failed to create webhook', {
        context: { feature: 'account', action: 'createWebhook' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
  });
};

export const useUpdateWebhook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WebhookFormData> }) => 
      accountAPI.updateWebhook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.webhooks() });
    },
  });
};

export const useDeleteWebhook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => accountAPI.deleteWebhook(id),
    onMutate: async (webhookId) => {
      await queryClient.cancelQueries({ queryKey: accountKeys.webhooks() });
      
      const previousWebhooks = queryClient.getQueryData<readonly Webhook[]>(accountKeys.webhooks());
      if (previousWebhooks) {
        queryClient.setQueryData<readonly Webhook[]>(
          accountKeys.webhooks(),
          previousWebhooks.filter(webhook => webhook.id !== webhookId)
        );
      }
      
      return { previousWebhooks };
    },
    onError: (error, _webhookId, context) => {
      if (context?.previousWebhooks) {
        queryClient.setQueryData(accountKeys.webhooks(), context.previousWebhooks);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.webhooks() });
    },
  });
};

export const useTestWebhook = () => {
  return useMutation({
    mutationFn: (id: string) => accountAPI.testWebhook(id),
    onError: (error) => {
      logger.error('Failed to test webhook', {
        context: { feature: 'account', action: 'testWebhook' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
  });
};

export const useServices = () => {
  return useQuery({
    queryKey: accountKeys.services(),
    queryFn: () => accountAPI.getServices(),
    staleTime: 5 * 60 * 1000, // 5 minutes - services don't change often
  });
};

export const useConnectService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (serviceId: string) => accountAPI.connectService(serviceId),
    onSuccess: (response) => {
      // Open OAuth redirect in new window
      window.open(response.redirect_url, '_blank', 'width=600,height=700');
      
      // Refetch services after a delay to check connection status
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: accountKeys.services() });
      }, 2000);
    },
  });
};

export const useDisconnectService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (serviceId: string) => accountAPI.disconnectService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.services() });
    },
  });
};

export const useDataSources = () => {
  return useQuery({
    queryKey: accountKeys.dataSources(),
    queryFn: () => accountAPI.getDataSources(),
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useCreateDataSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: DataSourceFormData) => accountAPI.createDataSource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.dataSources() });
      
      logger.info('Data source created successfully', {
        context: { feature: 'account', action: 'createDataSource' },
      });
    },
    onError: (error) => {
      logger.error('Failed to create data source', {
        context: { feature: 'account', action: 'createDataSource' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
  });
};

export const useUpdateDataSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DataSourceFormData> }) => 
      accountAPI.updateDataSource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.dataSources() });
    },
  });
};

export const useDeleteDataSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => accountAPI.deleteDataSource(id),
    onMutate: async (sourceId) => {
      await queryClient.cancelQueries({ queryKey: accountKeys.dataSources() });
      
      const previousSources = queryClient.getQueryData<readonly DataSource[]>(accountKeys.dataSources());
      if (previousSources) {
        queryClient.setQueryData<readonly DataSource[]>(
          accountKeys.dataSources(),
          previousSources.filter(source => source.id !== sourceId)
        );
      }
      
      return { previousSources };
    },
    onError: (error, _sourceId, context) => {
      if (context?.previousSources) {
        queryClient.setQueryData(accountKeys.dataSources(), context.previousSources);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.dataSources() });
    },
  });
};

export const useTestDataSource = () => {
  return useMutation({
    mutationFn: (id: string) => accountAPI.testDataSource(id),
    onError: (error) => {
      logger.error('Failed to test data source', {
        context: { feature: 'account', action: 'testDataSource' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
  });
};