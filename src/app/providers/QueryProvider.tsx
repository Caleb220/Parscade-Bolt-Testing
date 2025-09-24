/**
 * React Query Provider Configuration
 * Enterprise-grade data fetching and caching layer
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

import { env } from '@/app/config/env';
import { isApiError, getRequestId } from '@/lib/api';
import { logger } from '@/shared/services/logger';

import type { ReactNode } from 'react';

/**
 * Create configured QueryClient with enterprise settings
 */
const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: (failureCount, error) => {
          if (isApiError(error) && !error.isRetryable()) {
            return false;
          }
          return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: env.mode === 'development',
      },
      mutations: {
        retry: false,
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