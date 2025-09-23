import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/components/ui/use-toast';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { getErrorMessage, isApiError } from '@/lib/api';

interface ErrorContextType {
  reportError: (error: Error, context?: Record<string, any>) => void;
  handleApiError: (error: Error) => void;
  clearErrors: () => void;
  isOnline: boolean;
  networkStatus: ReturnType<typeof useNetworkStatus>;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

interface AppErrorProviderProps {
  children: ReactNode;
  queryClient: QueryClient;
}

export const AppErrorProvider: React.FC<AppErrorProviderProps> = ({
  children,
  queryClient
}) => {
  const { toast } = useToast();
  const networkStatus = useNetworkStatus();

  const reportError = useCallback((error: Error, context?: Record<string, any>) => {
    // Enhanced error logging with context
    const errorContext = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      networkStatus: {
        isOnline: networkStatus.isOnline,
        effectiveType: networkStatus.effectiveType,
        downlink: networkStatus.downlink,
        rtt: networkStatus.rtt,
      },
      ...context,
    };

    if (import.meta.env?.MODE === 'development') {
      console.group('🚨 Application Error Report');
      console.error('Error:', error);
      console.error('Context:', errorContext);
      console.groupEnd();
    }

    // In production, send to error tracking service
    if (import.meta.env?.MODE === 'production') {
      try {
        // Example: Send to Sentry, LogRocket, etc.
        // Sentry.captureException(error, { extra: errorContext });
        console.warn('Error reporting service not configured');
      } catch (reportingError) {
        console.error('Failed to report error:', reportingError);
      }
    }
  }, [networkStatus]);

  const handleApiError = useCallback((error: Error) => {
    if (!isApiError(error)) {
      return;
    }

    // Handle specific API error scenarios
    const message = error.message.toLowerCase();

    // Network-related errors
    if (message.includes('network') || message.includes('fetch failed')) {
      if (!networkStatus.isOnline) {
        toast({
          title: 'No Internet Connection',
          description: 'Please check your connection and try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Connection Problem',
          description: 'Unable to reach our servers. Please try again.',
          variant: 'destructive',
        });
      }
      return;
    }

    // Rate limiting
    if (message.includes('rate limit') || message.includes('429')) {
      toast({
        title: 'Rate Limit Exceeded',
        description: 'Too many requests. Please wait a moment and try again.',
        variant: 'destructive',
      });
      return;
    }

    // Authentication errors
    if (message.includes('unauthorized') || message.includes('401')) {
      toast({
        title: 'Session Expired',
        description: 'Please log in again to continue.',
        variant: 'destructive',
      });
      // Redirect to login or refresh auth
      // window.location.href = '/login';
      return;
    }

    // Server errors
    if (message.includes('500') || message.includes('internal server error')) {
      toast({
        title: 'Server Error',
        description: 'Our servers are experiencing issues. Please try again later.',
        variant: 'destructive',
      });
      return;
    }

    // Default API error handling
    toast({
      title: 'Request Failed',
      description: getErrorMessage(error),
      variant: 'destructive',
    });
  }, [networkStatus.isOnline, toast]);

  const clearErrors = useCallback(() => {
    // Clear any cached errors in React Query
    queryClient.clear();

    // Clear any error states
    toast({
      title: 'Errors Cleared',
      description: 'Application errors have been cleared.',
    });
  }, [queryClient, toast]);

  const contextValue: ErrorContextType = {
    reportError,
    handleApiError,
    clearErrors,
    isOnline: networkStatus.isOnline,
    networkStatus,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useAppError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useAppError must be used within an AppErrorProvider');
  }
  return context;
};

// Global error handler setup
export const setupGlobalErrorHandlers = (reportError: (error: Error, context?: Record<string, any>) => void) => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    reportError(new Error(event.reason), {
      type: 'unhandledrejection',
      promise: event.promise,
    });
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    reportError(event.error || new Error(event.message), {
      type: 'uncaughtError',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Handle React errors (will be caught by error boundaries)
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Look for React errors
    const message = args[0]?.toString() || '';
    if (message.includes('React') || message.includes('Warning:')) {
      reportError(new Error(message), {
        type: 'reactError',
        args: args.slice(1),
      });
    }
    originalConsoleError.apply(console, args);
  };
};