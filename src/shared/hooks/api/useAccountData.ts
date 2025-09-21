/**
 * Account Data Hooks
 * React Query hooks for account-related API operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountAPI } from '@/lib/api/account';
import type { User, ApiKey, Session, SecurityEvent, Service, DataSource, Webhook, NotificationPrefs } from '@/lib/types';
import type { ProfileFormData, ApiKeyFormData, WebhookFormData, NotificationPrefsFormData, DataSourceFormData } from '@/lib/validation/account';

// Query keys
const QUERY_KEYS = {
  account: ['account'] as const,
  apiKeys: ['account', 'api-keys'] as const,
  sessions: ['account', 'sessions'] as const,
  securityEvents: ['account', 'security-events'] as const,
  services: ['account', 'services'] as const,
  dataSources: ['account', 'data-sources'] as const,
  webhooks: ['account', 'webhooks'] as const,
  notificationPrefs: ['account', 'notification-prefs'] as const,
};

// Account queries
export const useAccount = () => {
  return useQuery({
    queryKey: QUERY_KEYS.account,
    queryFn: () => accountAPI.getMe(),
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ProfileFormData) => accountAPI.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.account });
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => accountAPI.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.account });
    },
  });
};

// API Keys queries
export const useApiKeys = () => {
  return useQuery({
    queryKey: QUERY_KEYS.apiKeys,
    queryFn: () => accountAPI.getApiKeys(),
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ApiKeyFormData) => accountAPI.createApiKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.apiKeys });
    },
  });
};

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (keyId: string) => accountAPI.revokeApiKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.apiKeys });
    },
  });
};

// Sessions queries
export const useSessions = () => {
  return useQuery({
    queryKey: QUERY_KEYS.sessions,
    queryFn: () => accountAPI.getSessions(),
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId: string) => accountAPI.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sessions });
    },
  });
};

// Security events queries
export const useSecurityEvents = () => {
  return useQuery({
    queryKey: QUERY_KEYS.securityEvents,
    queryFn: () => accountAPI.getSecurityEvents(),
  });
};

// Notification preferences queries
export const useNotificationPrefs = () => {
  return useQuery({
    queryKey: QUERY_KEYS.notificationPrefs,
    queryFn: () => accountAPI.getNotificationPrefs(),
  });
};

export const useUpdateNotificationPrefs = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: NotificationPrefsFormData) => accountAPI.updateNotificationPrefs(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationPrefs });
    },
  });
};

// Webhooks queries
export const useWebhooks = () => {
  return useQuery({
    queryKey: QUERY_KEYS.webhooks,
    queryFn: () => accountAPI.getWebhooks(),
  });
};

export const useCreateWebhook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: WebhookFormData) => accountAPI.createWebhook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.webhooks });
    },
  });
};

export const useDeleteWebhook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (webhookId: string) => accountAPI.deleteWebhook(webhookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.webhooks });
    },
  });
};

export const useTestWebhook = () => {
  return useMutation({
    mutationFn: (webhookId: string) => accountAPI.testWebhook(webhookId),
  });
};

// Services queries
export const useServices = () => {
  return useQuery({
    queryKey: QUERY_KEYS.services,
    queryFn: () => accountAPI.getServices(),
  });
};

export const useConnectService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (serviceId: string) => accountAPI.connectService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services });
    },
  });
};

export const useDisconnectService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (serviceId: string) => accountAPI.disconnectService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services });
    },
  });
};

// Data sources queries
export const useDataSources = () => {
  return useQuery({
    queryKey: QUERY_KEYS.dataSources,
    queryFn: () => accountAPI.getDataSources(),
  });
};

export const useCreateDataSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: DataSourceFormData) => accountAPI.createDataSource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dataSources });
    },
  });
};

export const useDeleteDataSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sourceId: string) => accountAPI.deleteDataSource(sourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dataSources });
    },
  });
};

export const useTestDataSource = () => {
  return useMutation({
    mutationFn: (sourceId: string) => accountAPI.testDataSource(sourceId),
  });
};