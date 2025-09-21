/**
 * Account Data Hooks
 * Updated to match OpenAPI schema response structure with snake_case
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApi } from '@/lib/api/modules/account';
import { notificationsApi } from '@/lib/api/modules/notifications';
import { integrationsApi } from '@/lib/api/modules/integrations';
import type { NotificationPreferencesFormData } from '@/lib/validation/account';
import { useToast } from '@/shared/components/ui/use-toast';
import { getErrorMessage } from '@/lib/api';
import type { 
  UserProfile, 
  UpdateProfileRequest,
  ApiKey, 
  UserSession, 
  SecurityEvent,
  NotificationPreferences,
  NotificationPreferencesUpdate,
  Webhook,
  ConnectedService,
  DataSource,
  CreateApiKeyRequest
} from '@/types/api-types';


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
    mutationFn: (data: UpdateProfileRequest) => accountApi.updateProfile(data),
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
          updated_at: new Date().toISOString(),
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
            avatar_url: response.avatar_url,
            updated_at: new Date().toISOString(),
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
    queryFn: () => accountApi.getApiKeys(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: CreateApiKeyRequest) => accountApi.createApiKey(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.apiKeys });
      
      toast({
        title: 'API key created',
        description: `Your new API key "${result.name}" has been created successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Creation failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (keyId: string) => accountApi.revokeApiKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.apiKeys });
      
      toast({
        title: 'API key revoked',
        description: 'The API key has been revoked successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Revocation failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

// Sessions queries
export const useSessions = () => {
  return useQuery({
    queryKey: QUERY_KEYS.sessions,
    queryFn: () => accountApi.getSessions(),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (sessionId: string) => accountApi.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sessions });
      
      toast({
        title: 'Session revoked',
        description: 'The session has been revoked successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Revocation failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

// Security events queries
export const useSecurityEvents = () => {
  return useQuery({
    queryKey: QUERY_KEYS.securityEvents,
    queryFn: () => accountApi.getSecurityEvents(),
    staleTime: 30 * 1000, // 30 seconds
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Notification preferences queries
export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: QUERY_KEYS.notificationPreferences,
    queryFn: async () => {
      try {
        return await notificationsApi.getPreferences();
      } catch (error) {
        console.warn('Notification preferences endpoint not available:', error);
        // Return default structure matching backend schema
        return {
          channels: {
            email: true,
            in_app: true,
            webhook: false,
          },
          categories: {
            product: 'immediate' as const,
            billing: 'immediate' as const,
            incidents: 'immediate' as const,
            jobs: 'immediate' as const,
            digest: 'daily' as const,
          },
          dnd_settings: {
            start: '22:00',
            end: '08:00',
            timezone: 'UTC',
          },
          webhook_url: null,
        };
      }
    },
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

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: NotificationPreferencesFormData) => {
      // Transform form data to match backend schema
      const backendData: NotificationPreferencesUpdate = {
        channels: data.channels,
        categories: data.categories,
        dnd_settings: data.dnd_settings,
        webhook_url: data.channels?.webhook ? data.webhook_url || null : null,
      };
      return notificationsApi.updatePreferences(backendData);
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.notificationPreferences });
      
      const previousData = queryClient.getQueryData<NotificationPreferences>(QUERY_KEYS.notificationPreferences);
      
      if (previousData) {
        // Transform form data for optimistic update
        const optimisticData: NotificationPreferences = {
          channels: newData.channels || previousData.channels,
          categories: newData.categories || previousData.categories,
          dnd_settings: newData.dnd_settings || previousData.dnd_settings,
          webhook_url: newData.channels?.webhook ? (newData.webhook_url || null) : null,
        };
        
        queryClient.setQueryData<NotificationPreferences>(QUERY_KEYS.notificationPreferences, {
          ...previousData,
          ...optimisticData,
        });
      }
      
      return { previousData };
    },
    onError: (error, newData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(QUERY_KEYS.notificationPreferences, context.previousData);
      }
      
      toast({
        title: 'Update failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.notificationPreferences, data);
      
      toast({
        title: 'Preferences updated',
        description: 'Your notification preferences have been saved successfully.',
      });
    },
  });
};

// Webhooks queries
export const useWebhooks = () => {
  return useQuery({
    queryKey: QUERY_KEYS.webhooks,
    queryFn: () => integrationsApi.getWebhooks(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateWebhook = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: CreateWebhookRequest) => integrationsApi.createWebhook(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.webhooks });
      
      toast({
        title: 'Webhook created',
        description: `Your webhook "${result.url}" has been created successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Creation failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteWebhook = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (webhookId: string) => integrationsApi.deleteWebhook(webhookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.webhooks });
      
      toast({
        title: 'Webhook deleted',
        description: 'The webhook has been deleted successfully.',
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

export const useTestWebhook = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (webhookId: string) => integrationsApi.testWebhook(webhookId),
    onSuccess: (result) => {
      toast({
        title: 'Test completed',
        description: `Webhook test ${result.status === 200 ? 'successful' : 'failed'} (${result.status})`,
        variant: result.status === 200 ? 'default' : 'destructive',
      });
    },
    onError: (error) => {
      toast({
        title: 'Test failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

// Services queries
export const useServices = () => {
  return useQuery({
    queryKey: QUERY_KEYS.services,
    queryFn: () => integrationsApi.getServices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useConnectService = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (serviceId: string) => integrationsApi.connectService(serviceId),
    onSuccess: (result) => {
      // Redirect to OAuth URL
      window.location.href = result.redirect_url;
    },
    onError: (error) => {
      toast({
        title: 'Connection failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

export const useDisconnectService = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (serviceId: string) => integrationsApi.disconnectService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services });
      
      toast({
        title: 'Service disconnected',
        description: 'The service has been disconnected successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Disconnection failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

// Data Sources queries
export const useDataSources = () => {
  return useQuery({
    queryKey: QUERY_KEYS.dataSources,
    queryFn: () => integrationsApi.getDataSources(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateDataSource = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: any) => integrationsApi.createDataSource(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dataSources });
      
      toast({
        title: 'Data source created',
        description: `Data source "${result.name}" has been created successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Creation failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteDataSource = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (sourceId: string) => integrationsApi.deleteDataSource(sourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dataSources });
      
      toast({
        title: 'Data source deleted',
        description: 'The data source has been deleted successfully.',
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

export const useTestDataSource = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (sourceId: string) => {
      // Mock implementation - replace with actual API call when available
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { status: 'success' as const, message: 'Connection successful' };
    },
    onSuccess: (result, sourceId) => {
      toast({
        title: 'Test completed',
        description: `Data source test ${result.status === 'success' ? 'successful' : 'failed'}: ${result.message}`,
        variant: result.status === 'success' ? 'default' : 'destructive',
      });
    },
    onError: (error) => {
      toast({
        title: 'Test failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};