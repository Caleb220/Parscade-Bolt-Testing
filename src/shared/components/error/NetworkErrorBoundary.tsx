import React, { Component, ReactNode } from 'react';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasNetworkError: boolean;
  isOnline: boolean;
  retryCount: number;
}

class NetworkErrorBoundary extends Component<Props, State> {
  private retryTimeoutId?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasNetworkError: false,
      isOnline: navigator.onLine,
      retryCount: 0,
    };
  }

  componentDidMount(): void {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);

    // Listen for fetch errors
    window.addEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  componentWillUnmount(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    window.removeEventListener('unhandledrejection', this.handlePromiseRejection);

    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleOnline = (): void => {
    this.setState({ isOnline: true });

    // Auto-retry when connection is restored
    if (this.state.hasNetworkError) {
      this.handleRetry();
    }
  };

  handleOffline = (): void => {
    this.setState({ isOnline: false, hasNetworkError: true });
  };

  handlePromiseRejection = (event: PromiseRejectionEvent): void => {
    const error = event.reason;

    // Check if it's a network-related error
    if (this.isNetworkError(error)) {
      this.setState({ hasNetworkError: true });

      // Prevent the default browser error handling
      event.preventDefault();
    }
  };

  private isNetworkError(error: any): boolean {
    if (!error) return false;

    const message = error.message?.toLowerCase() || '';
    const networkPatterns = [
      'network error',
      'fetch failed',
      'failed to fetch',
      'network request failed',
      'connection error',
      'timeout',
      'net::err_',
    ];

    return networkPatterns.some(pattern => message.includes(pattern)) ||
           error.name === 'NetworkError' ||
           error.code === 'NETWORK_ERROR';
  }

  handleRetry = (): void => {
    if (!navigator.onLine) {
      return;
    }

    this.setState(prevState => ({
      hasNetworkError: false,
      retryCount: prevState.retryCount + 1,
    }));

    // Reload the page after a brief delay to ensure network is stable
    this.retryTimeoutId = setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  handleForceRetry = (): void => {
    this.setState({ hasNetworkError: false, retryCount: 0 });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasNetworkError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {this.state.isOnline ? (
                <AlertCircle className="w-8 h-8 text-orange-600" />
              ) : (
                <WifiOff className="w-8 h-8 text-orange-600" />
              )}
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {this.state.isOnline ? 'Connection Problem' : 'No Internet Connection'}
            </h2>

            <p className="text-gray-600 mb-6">
              {this.state.isOnline
                ? 'We\'re having trouble connecting to our servers. Please check your connection and try again.'
                : 'Please check your internet connection and try again. We\'ll automatically retry when your connection is restored.'}
            </p>

            {!this.state.isOnline && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-center text-orange-800 text-sm">
                  <WifiOff className="w-4 h-4 mr-2" />
                  <span>Offline - Waiting for connection...</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleRetry}
                disabled={!this.state.isOnline}
                className="flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {this.state.isOnline ? 'Try Again' : 'Waiting for Connection...'}
              </Button>

              <Button
                onClick={this.handleForceRetry}
                variant="outline"
                className="flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Force Retry
              </Button>
            </div>

            {this.state.retryCount > 0 && (
              <p className="text-xs text-gray-500 mt-4">
                Retry attempts: {this.state.retryCount}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default NetworkErrorBoundary;