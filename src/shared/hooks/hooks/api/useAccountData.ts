import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/shared/components/ui/use-toast';
import { getErrorMessage } from '@/lib/api';
import * as accountApi from '@/lib/api/modules/account';

// Account Settings
export const useAccountSettings = () => {
  return useQuery({
    queryKey: ['account', 'settings'],
    queryFn: accountApi.getAccountSettings,
  });
};

export const useUpdateAccountSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: accountApi.updateAccountSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'settings'] });
      toast({
        title: 'Settings updated',
        description: 'Your account settings have been updated successfully.',
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

// User Profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: accountApi.getUserProfile,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: accountApi.updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
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

// API Keys
export const useApiKeys = () => {
  return useQuery({
    queryKey: ['account', 'api-keys'],
    queryFn: accountApi.getApiKeys,
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: accountApi.createApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'api-keys'] });
      toast({
        title: 'API key created',
        description: 'Your new API key has been created successfully.',
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

export const useDeleteApiKey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: accountApi.deleteApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'api-keys'] });
      toast({
        title: 'API key deleted',
        description: 'The API key has been deleted successfully.',
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

// User Sessions
export const useUserSessions = () => {
  return useQuery({
    queryKey: ['account', 'sessions'],
    queryFn: accountApi.getUserSessions,
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: accountApi.revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'sessions'] });
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

// Security Events
export const useSecurityEvents = () => {
  return useQuery({
    queryKey: ['account', 'security-events'],
    queryFn: accountApi.getSecurityEvents,
  });
};

// Notification Preferences
export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: ['account', 'notification-preferences'],
    queryFn: accountApi.getNotificationPreferences,
  });
};

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: accountApi.updateNotificationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'notification-preferences'] });
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

// Webhooks
export const useWebhooks = () => {
  return useQuery({
    queryKey: ['account', 'webhooks'],
    queryFn: accountApi.getWebhooks,
  });
};

export const useCreateWebhook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: accountApi.createWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'webhooks'] });
      toast({
        title: 'Webhook created',
        description: 'Your webhook has been created successfully.',
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
  
  return useMutation({
    mutationFn: accountApi.deleteWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'webhooks'] });
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
  return useMutation({
    mutationFn: accountApi.testWebhook,
    onError: (error) => {
      toast({
        title: 'Test failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

// Services (placeholder implementations)
export const useServices = () => {
  return useQuery({
    queryKey: ['account', 'services'],
    queryFn: async () => {
      // Mock data for services - replace with actual API call when available
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
          id: 'onedrive',
          name: 'OneDrive',
          description: 'Connect your OneDrive for document sync',
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
  });
};

export const useConnectService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (serviceId: string) => {
      // Mock implementation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'services'] });
      toast({
        title: 'Service connected',
        description: 'The service has been connected successfully.',
      });
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
  
  return useMutation({
    mutationFn: async (serviceId: string) => {
      // Mock implementation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'services'] });
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

// Data Sources
export const useDataSources = () => {
  return useQuery({
    queryKey: ['account', 'data-sources'],
    queryFn: accountApi.getDataSources,
  });
};

export const useCreateDataSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: accountApi.createDataSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'data-sources'] });
      toast({
        title: 'Data source created',
        description: 'Your data source has been created successfully.',
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
  
  return useMutation({
    mutationFn: accountApi.deleteDataSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'data-sources'] });
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
  return useMutation({
    mutationFn: accountApi.testDataSource,
    onError: (error) => {
      toast({
        title: 'Test failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};