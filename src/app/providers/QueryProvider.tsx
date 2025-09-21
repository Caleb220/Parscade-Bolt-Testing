/**
 * React Query Provider Configuration
 * Enterprise-grade data fetching and caching layer
 */

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { env } from '@/app/config/env';
import { isApiError, getRequestId } from '@/lib/api';

/**
 * Create configured QueryClient with enterprise settings
 */
const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data for 5 minutes by default
        staleTime: 5 * 60 * 1000,
        // Keep unused data for 10 minutes
        gcTime: 10 * 60 * 1000,
        // Retry failed queries 2 times
        retry: (failureCount, error) => {
          // Don't retry auth errors or validation errors
          if (isApiError(error) && !error.isRetryable()) {
            return false;
          }
          return failureCount < 2;
        },
        // Retry with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on window focus in development only
        refetchOnWindowFocus: env.mode === 'development',
      },
      mutations: {
        // Don't retry mutations by default
        retry: false,
        // Log errors for mutations
        onError: (error) => {
          const requestId = getRequestId(error);
          logger.warn('Mutation failed', {
            context: { feature: 'react-query', action: 'mutation' },
            metadata: { requestId },
            error: error instanceof Error ? error : new Error(String(error)),
          });
        },
      },
    },
  });
};

interface QueryProviderProps {
  readonly children: ReactNode;
}

/**
 * React Query Provider with development tools
 */
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [queryClient] = React.useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {env.mode === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};