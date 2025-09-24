/**
 * Enterprise Error Boundary Component
 * Professional error handling with retry capabilities and user-friendly messaging
 */

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
import React, { Component, ErrorInfo, ReactNode } from 'react';

import { ParscadeCard, ParscadeButton } from '@/shared/components/brand';
import { logger } from '@/shared/services/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'page' | 'section' | 'component';
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  lastErrorTime?: number;
}

const MAX_RETRY_COUNT = 3;
const RETRY_COOLDOWN_MS = 2000;

/**
 * Enterprise-grade error boundary with professional error handling
 */
class EnterpriseErrorBoundary extends Component<Props, State> {
  private retryTimer?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      lastErrorTime: Date.now(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const context = {
      level: this.props.level || 'component',
      retryCount: this.state.retryCount,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Log error details
    logger.error('React Error Boundary Triggered', {
      error,
      errorInfo,
      context,
    });

    this.setState({
      errorInfo,
    });

    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Integration point for Sentry, Bugsnag, etc.
      console.error('Production error:', { error, errorInfo, context });
    }
  }

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  handleRetry = () => {
    const { retryCount, lastErrorTime } = this.state;
    const now = Date.now();

    // Check cooldown period
    if (lastErrorTime && (now - lastErrorTime) < RETRY_COOLDOWN_MS) {
      return;
    }

    if (retryCount < MAX_RETRY_COUNT) {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: retryCount + 1,
        lastErrorTime: now,
      });
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { level = 'component', fallback } = this.props;
      const { error, retryCount } = this.state;

      // Custom fallback
      if (fallback) {
        return fallback;
      }

      // Component-level error (minimal UI)
      if (level === 'component') {
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Something went wrong
                </p>
                <p className="text-xs text-red-600 mt-1">
                  This component encountered an error
                </p>
              </div>
              {retryCount < MAX_RETRY_COUNT && (
                <button
                  onClick={this.handleRetry}
                  className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        );
      }

      // Section-level error (moderate UI)
      if (level === 'section') {
        return (
          <ParscadeCard className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Section Unavailable
              </h3>
              <p className="text-gray-600 mb-4">
                This section encountered an error and couldn't load properly.
              </p>
              <div className="flex justify-center space-x-3">
                {retryCount < MAX_RETRY_COUNT && (
                  <ParscadeButton
                    variant="outline"
                    size="sm"
                    onClick={this.handleRetry}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </ParscadeButton>
                )}
                <ParscadeButton
                  variant="ghost"
                  size="sm"
                  onClick={this.handleReload}
                >
                  Refresh Page
                </ParscadeButton>
              </div>
            </div>
          </ParscadeCard>
        );
      }

      // Page-level error (full UI)
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full"
          >
            <ParscadeCard className="p-8 text-center">
              <motion.div
                className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </motion.div>

              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Something went wrong
              </h1>

              <p className="text-gray-600 mb-6 leading-relaxed">
                We encountered an unexpected error. Our team has been notified and is working on a fix.
              </p>

              {process.env.NODE_ENV === 'development' && error && (
                <details className="text-left bg-gray-50 rounded-lg p-4 mb-6 text-xs">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Technical Details
                  </summary>
                  <pre className="text-red-600 whitespace-pre-wrap break-words">
                    {error.toString()}
                  </pre>
                </details>
              )}

              <div className="space-y-3">
                {retryCount < MAX_RETRY_COUNT && (
                  <ParscadeButton
                    variant="primary"
                    onClick={this.handleRetry}
                    className="w-full"
                    glow
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again {retryCount > 0 && `(${retryCount}/${MAX_RETRY_COUNT})`}
                  </ParscadeButton>
                )}

                <div className="flex space-x-3">
                  <ParscadeButton
                    variant="outline"
                    onClick={this.handleReload}
                    className="flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reload Page
                  </ParscadeButton>

                  <ParscadeButton
                    variant="ghost"
                    onClick={this.handleGoHome}
                    className="flex-1"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </ParscadeButton>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-3">
                    Still having issues?
                  </p>
                  <a
                    href="mailto:support@parscade.com"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </a>
                </div>
              </div>
            </ParscadeCard>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnterpriseErrorBoundary;