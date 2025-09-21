/**
 * Account API Hooks
 * React Query hooks for account management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApi, getErrorMessage, isApiError } from '@/lib/api';
import { logger } from '@/services/logger';

import type { paths } from '@/types/api-types';

type UserProfile = paths['/v1/account/me']['get']['responses']['200']['content']['application/json'];
type UpdateProfileRequest = paths['/v1/account/me']['patch']['requestBody']['content']['application/json'];

/**
 * Query keys for account queries
 */
export const accountKeys = {
  all: ['account'] as const,
  profile: () => [...accountKeys.all, 'profile'] as const,
} as const;

/**
 * Hook to fetch current user profile from API Gateway
 */
export const useAccount = () => {
  return useQuery({
    queryKey: accountKeys.profile(),
    queryFn: () => accountApi.getProfile(),
    retry: (failureCount, error) => {
      if (isApiError(error) && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to update user profile with optimistic updates
 */
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: UpdateProfileRequest) => accountApi.updateProfile(updates),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: accountKeys.profile() });

      const previousProfile = queryClient.getQueryData<UserProfile>(accountKeys.profile());

      if (previousProfile) {
        queryClient.setQueryData<UserProfile>(accountKeys.profile(), {
          ...previousProfile,
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousProfile };
    },
    onError: (error, _updates, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(accountKeys.profile(), context.previousProfile);
      }

      logger.warn('Failed to update account profile', {
        context: { feature: 'account', action: 'updateProfile' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(accountKeys.profile(), updatedProfile);
      
      logger.debug('Account profile updated successfully', {
        context: { feature: 'account', action: 'updateProfile' },
      });
    },
  });
};

/**
 * Hook to delete user account
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => accountApi.deleteAccount(),
    onSuccess: () => {
      queryClient.clear();
      
      logger.info('Account deletion initiated', {
        context: { feature: 'account', action: 'deleteAccount' },
      });
    },
    onError: (error) => {
      logger.error('Failed to delete account', {
        context: { feature: 'account', action: 'deleteAccount' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
  });
};