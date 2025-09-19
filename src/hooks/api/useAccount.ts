/**
 * Account API Hooks
 * React Query hooks for account management operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApi } from '@/lib/api';
import { logger } from '@/services/logger';
import { getErrorMessage, isApiError } from '@/lib/api/errors';

import type { paths } from '@/types/api-types';

type UserProfile = paths['/v1/account/me']['get']['responses']['200']['content']['application/json'];
type UpdateProfileRequest = paths['/v1/account/me']['patch']['requestBody']['content']['application/json'];

/**
 * Query keys for account-related queries
 */
export const accountKeys = {
  all: ['account'] as const,
  profile: () => [...accountKeys.all, 'profile'] as const,
} as const;

/**
 * Hook to fetch current user profile
 */
export const useAccount = () => {
  return useQuery({
    queryKey: accountKeys.profile(),
    queryFn: () => accountApi.getProfile(),
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (isApiError(error) && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
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
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: accountKeys.profile() });

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData<UserProfile>(accountKeys.profile());

      // Optimistically update to new value
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
      // Rollback on error
      if (context?.previousProfile) {
        queryClient.setQueryData(accountKeys.profile(), context.previousProfile);
      }

      logger.warn('Failed to update account profile', {
        context: { feature: 'account', action: 'updateProfile' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    },
    onSuccess: (updatedProfile) => {
      // Update cache with server response
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
      // Clear all cached data on account deletion
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