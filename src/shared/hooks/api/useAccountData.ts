/**
 * Account Data Hooks
 * Updated to match OpenAPI schema response structure
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApi } from '@/lib/api';
import type { UserProfile, ApiKey, UserSession, SecurityEvent } from '@/types/api-types';

// Query keys
const QUERY_KEYS = {
  account: ['account'] as const,
  apiKeys: ['account', 'api-keys'] as const,
  sessions: ['account', 'sessions'] as const,
  securityEvents: ['account', 'security-events'] as const,
};

// Account queries
export const useAccount = () => {
  return useQuery({
    queryKey: QUERY_KEYS.account,
    queryFn: () => accountApi.getProfile(),
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { fullName?: string | null; timezone?: string }) => 
      accountApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.account });
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => accountApi.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.account });
    },
  });
};

// API Keys queries
export const useApiKeys = () => {
  return useQuery({
    queryKey: QUERY_KEYS.apiKeys,
    queryFn: () => accountApi.getApiKeys(),
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
    queryFn: () => accountApi.getSessions(),
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
    queryFn: () => accountApi.getSecurityEvents({ limit: 20 }),
  });
};