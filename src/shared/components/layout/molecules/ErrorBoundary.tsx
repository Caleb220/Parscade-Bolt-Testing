import { AlertTriangle, RefreshCw } from 'lucide-react';
import React, { Component } from 'react';

import { isApiError, getErrorMessage, getRequestId } from '@/lib/api';

import CustomButton from '../../forms/CustomButton';

import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Handle API errors specifically
    if (isApiError(error)) {
      const requestId = getRequestId(error);
      // Only log request ID in development
      if (import.meta.env?.MODE === 'development' && requestId) {
        console.error(`API Error [${requestId}]:`, error.getUserMessage());
      }
    } else {
      // Log other errors securely in development only
      if (import.meta.env?.MODE === 'development') {
        console.error('React Error Boundary caught an error:', error.message);
        if (errorInfo?.componentStack) {
          console.error('Component stack:', errorInfo.componentStack);
        }
      }
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              {isApiError(this.state.error) ? 'Service Error' : 'Something went wrong'}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {this.state.error ? getErrorMessage(this.state.error) : 'We\'re sorry, but something unexpected happened. Please try again.'}
            </p>
            
            {import.meta.env?.MODE === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-32">
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <CustomButton
                onClick={this.handleReset}
                leftIcon={<RefreshCw className="w-4 h-4" />}
                variant="primary"
              >
                Try Again
              </CustomButton>
              
              <CustomButton
                onClick={() => window.location.href = '/'}
                variant="outline"
              >
                Go Home
              </CustomButton>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;