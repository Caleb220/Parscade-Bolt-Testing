import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import React from 'react';

import { getErrorMessage, isApiError } from '@/lib/api';
import { Button } from '@/shared/components/ui/button';

import GlobalErrorBoundary from './GlobalErrorBoundary';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

const QueryErrorBoundary: React.FC<Props> = ({ children, fallback }) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <GlobalErrorBoundary
          level="section"
          fallback={
            fallback ? (
              <QueryErrorFallback reset={reset} customFallback={fallback} />
            ) : (
              <DefaultQueryErrorFallback reset={reset} />
            )
          }
        >
          {children}
        </GlobalErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

interface ErrorFallbackProps {
  reset: () => void;
  error?: Error;
  customFallback?: (error: Error, retry: () => void) => ReactNode;
}

const QueryErrorFallback: React.FC<ErrorFallbackProps> = ({ reset, error, customFallback }) => {
  if (error && customFallback) {
    return <>{customFallback(error, reset)}</>;
  }

  return <DefaultQueryErrorFallback reset={reset} error={error} />;
};

const DefaultQueryErrorFallback: React.FC<ErrorFallbackProps> = ({ reset, error }) => {
  const errorMessage = error ? getErrorMessage(error) : 'Failed to load data';
  const isApi = error ? isApiError(error) : false;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-red-600" />
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {isApi ? 'Service Error' : 'Loading Error'}
      </h3>

      <p className="text-gray-600 mb-4 max-w-md">{errorMessage}</p>

      <Button onClick={reset} size="sm" className="flex items-center">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>

      {import.meta.env?.MODE === 'development' && error && (
        <details className="mt-4 text-left max-w-md w-full">
          <summary className="cursor-pointer text-xs text-gray-500 mb-2">Debug Information</summary>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
};

export default QueryErrorBoundary;
