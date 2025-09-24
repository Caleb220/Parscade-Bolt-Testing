import { AlertTriangle, RefreshCw, Home, Bug, Clock } from 'lucide-react';
import React, { Component } from 'react';

import { isApiError, getErrorMessage, getRequestId } from '@/lib/api';
import { Button } from '@/shared/components/ui/button';

import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'app' | 'page' | 'section';
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId: string;
  retryCount: number;
  errorBoundaryStack: string[];
}

class GlobalErrorBoundary extends Component<Props, State> {
  private retryTimeoutId?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: '',
      retryCount: 0,
      errorBoundaryStack: [],
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { level = 'section', onError } = this.props;

    // Enhanced error logging with context
    const errorContext = {
      errorId: this.state.errorId,
      level,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      retryCount: this.state.retryCount,
      componentStack: errorInfo.componentStack,
    };

    // Call custom error handler
    onError?.(error, errorInfo);

    // Handle API errors specifically
    if (isApiError(error)) {
      const requestId = getRequestId(error);
      if (import.meta.env?.MODE === 'development' && requestId) {
        console.group(`🚨 API Error [${requestId}] - ${this.state.errorId}`);
        console.error('Message:', error.getUserMessage());
        console.error('Context:', errorContext);
        console.groupEnd();
      }

      // Auto-retry for recoverable API errors
      if (this.isRecoverableError(error) && this.state.retryCount < 3) {
        this.scheduleRetry();
      }
    } else {
      // Enhanced logging for React errors
      if (import.meta.env?.MODE === 'development') {
        console.group(`⚠️ React Error Boundary - ${this.state.errorId}`);
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        console.error('Context:', errorContext);
        if (errorInfo?.componentStack) {
          console.error('Component Stack:', errorInfo.componentStack);
        }
        console.groupEnd();
      }
    }

    // Report to error tracking service in production
    if (import.meta.env?.MODE === 'production') {
      this.reportError(error, errorContext);
    }
  }

  private isRecoverableError(error: Error): boolean {
    if (!isApiError(error)) return false;

    // Check for temporary/network errors that might be recoverable
    const message = error.message.toLowerCase();
    const recoverablePatterns = [
      'network error',
      'fetch failed',
      'timeout',
      'connection',
      'temporary',
      '503',
      '502',
      '500'
    ];

    return recoverablePatterns.some(pattern => message.includes(pattern));
  }

  private scheduleRetry(): void {
    const delay = Math.pow(2, this.state.retryCount) * 1000; // Exponential backoff

    this.retryTimeoutId = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        retryCount: prevState.retryCount + 1,
      }));
    }, delay);
  }

  private reportError(error: Error, context: any): void {
    // In production, send to error tracking service
    try {
      // Example: Sentry, LogRocket, etc.
      // Sentry.captureException(error, { extra: context });
      console.warn('Error reporting not configured');
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  componentWillUnmount(): void {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleReset = (): void => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    this.setState({
      hasError: false,
      error: undefined,
      retryCount: 0,
      errorBoundaryStack: [],
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { level = 'section' } = this.props;
      const isApiError = isApiError(this.state.error);
      const canRetry = isApiError && this.isRecoverableError(this.state.error) && this.state.retryCount < 3;

      // Different UI based on error boundary level
      if (level === 'app') {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Application Error
              </h1>

              <p className="text-gray-600 mb-6">
                {getErrorMessage(this.state.error)}
              </p>

              {this.state.retryCount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center text-yellow-800">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      Retry attempt {this.state.retryCount} of 3
                    </span>
                  </div>
                </div>
              )}

              {import.meta.env?.MODE === 'development' && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 mb-3 font-medium">
                    🐛 Error Details (Development)
                  </summary>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="text-xs">
                      <strong>Error ID:</strong> {this.state.errorId}
                    </div>
                    <div className="text-xs">
                      <strong>Type:</strong> {isApiError ? 'API Error' : 'Application Error'}
                    </div>
                    <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-auto max-h-40">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {canRetry && (
                  <Button onClick={this.handleReset} className="flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                )}

                <Button onClick={this.handleReload} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>

                <Button onClick={this.handleGoHome} variant="outline">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {import.meta.env?.MODE === 'development' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    🔧 This detailed error information is only shown in development mode
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      }

      // Page-level error boundary
      if (level === 'page') {
        return (
          <div className="min-h-[50vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {isApiError ? 'Service Error' : 'Page Error'}
              </h2>

              <p className="text-gray-600 mb-6">
                {getErrorMessage(this.state.error)}
              </p>

              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button onClick={this.handleReset} size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>

                <Button onClick={this.handleGoHome} variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {import.meta.env?.MODE === 'development' && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-xs text-gray-500">
                    Error ID: {this.state.errorId}
                  </summary>
                  <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-32">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        );
      }

      // Section-level error boundary (minimal UI)
      return (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <div className="flex items-center text-red-800 mb-2">
            <AlertTriangle className="w-4 h-4 mr-2" />
            <span className="font-medium text-sm">
              {isApiError ? 'Service Unavailable' : 'Section Error'}
            </span>
          </div>

          <p className="text-red-700 text-sm mb-3">
            {getErrorMessage(this.state.error)}
          </p>

          <Button onClick={this.handleReset} size="sm" variant="outline">
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>

          {import.meta.env?.MODE === 'development' && (
            <div className="mt-2 pt-2 border-t border-red-200">
              <code className="text-xs text-red-600">
                {this.state.errorId}
              </code>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;