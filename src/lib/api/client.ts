/**
 * Enterprise API Client for Parscade Backend Integration
 * 
 * FEATURES:
 * - Auto-generated TypeScript types from OpenAPI spec
 * - Automatic Supabase JWT injection
 * - Request/response logging (dev only)
 * - Retry logic with exponential backoff
 * - Correlation ID tracking for observability
 * - Comprehensive error handling
 */

import { supabase } from '@/lib/supabase';
import { env } from '@/config/env';
import { logger } from '@/services/logger';
import { ApiError, NetworkError, ValidationError, AuthError } from './errors';

import type { paths } from '@/types/api-types';

/**
 * Type-safe API client configuration
 */
interface ApiClientConfig {
  readonly baseUrl: string;
  readonly timeout?: number;
  readonly retryAttempts?: number;
  readonly retryDelay?: number;
}

/**
 * Request options for API calls
 */
interface RequestOptions {
  readonly timeout?: number;
  readonly retryable?: boolean;
  readonly retryAttempts?: number;
  readonly headers?: Record<string, string>;
}

/**
 * Internal request context for correlation tracking
 */
interface RequestContext {
  readonly method: string;
  readonly url: string;
  readonly requestId: string;
  readonly startTime: number;
  readonly attempt: number;
}

/**
 * Enterprise API Client Class
 */
class ApiClient {
  private readonly config: ApiClientConfig;
  private readonly isDevelopment: boolean;

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config,
    };
    this.isDevelopment = env.mode === 'development';
  }

  /**
   * Generate unique request ID for correlation tracking
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current Supabase JWT token
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        logger.warn('Failed to get auth session', {
          context: { feature: 'api-client', action: 'getAuthToken' },
          error,
        });
        return null;
      }

      return session?.access_token || null;
    } catch (error) {
      logger.error('Critical error getting auth token', {
        context: { feature: 'api-client', action: 'getAuthToken' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
      return null;
    }
  }

  /**
   * Log request/response in development only
   */
  private logRequest(context: RequestContext, response?: Response, error?: Error): void {
    if (!this.isDevelopment) return;

    const duration = Date.now() - context.startTime;
    const logData = {
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      attempt: context.attempt,
      duration: `${duration}ms`,
      ...(response && {
        status: response.status,
        statusText: response.statusText,
      }),
      ...(error && {
        error: error.message,
      }),
    };

    if (error) {
      logger.debug(`API Request Failed: ${context.method} ${context.url}`, {
        metadata: logData,
      });
    } else {
      logger.debug(`API Request: ${context.method} ${context.url}`, {
        metadata: logData,
      });
    }
  }

  /**
   * Execute HTTP request with retries and error handling
   */
  private async executeRequest(
    url: string,
    init: RequestInit,
    options: RequestOptions = {}
  ): Promise<Response> {
    const fullUrl = url.startsWith('http') ? url : `${this.config.baseUrl}${url}`;
    const requestId = this.generateRequestId();
    const maxAttempts = options.retryAttempts ?? this.config.retryAttempts ?? 3;

    // Build headers
    const authToken = await this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      'X-Client-Version': '1.0.0',
      ...options.headers,
    };

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const context: RequestContext = {
        method: init.method || 'GET',
        url: fullUrl,
        requestId,
        startTime: Date.now(),
        attempt,
      };

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, options.timeout ?? this.config.timeout);

        const response = await fetch(fullUrl, {
          ...init,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        this.logRequest(context, response);

        // Handle non-2xx responses
        if (!response.ok) {
          const errorData = await this.parseErrorResponse(response);
          const apiError = ApiError.fromResponse(response, errorData, fullUrl);
          
          // Don't retry client errors (4xx) except 401/408/429
          if (response.status >= 400 && response.status < 500) {
            if (response.status === 401) {
              throw new AuthError(apiError.message, response.status, requestId);
            }
            if (response.status === 400 && errorData?.details) {
              throw ValidationError.fromBackendError(errorData, requestId);
            }
            // Only retry 408 (timeout) and 429 (rate limit) from 4xx range
            if (response.status !== 408 && response.status !== 429) {
              throw apiError;
            }
          }

          // Retry for 5xx errors and specific 4xx errors
          if (attempt < maxAttempts && (options.retryable !== false)) {
            await this.sleep(this.getRetryDelay(attempt, apiError));
            lastError = apiError;
            continue;
          }

          throw apiError;
        }

        return response;

      } catch (error) {
        this.logRequest(context, undefined, error instanceof Error ? error : new Error(String(error)));

        if (error instanceof ApiError || error instanceof AuthError || error instanceof ValidationError) {
          throw error;
        }

        // Handle network/fetch errors
        const networkError = new NetworkError(
          `Network request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error instanceof Error ? error : undefined
        );

        if (attempt < maxAttempts && options.retryable !== false) {
          await this.sleep(this.getRetryDelay(attempt));
          lastError = networkError;
          continue;
        }

        throw networkError;
      }
    }

    throw lastError || new NetworkError('Max retry attempts exceeded');
  }

  /**
   * Parse error response from backend
   */
  private async parseErrorResponse(response: Response): Promise<ErrorResponse | null> {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }
    } catch (error) {
      logger.warn('Failed to parse error response', {
        context: { feature: 'api-client', action: 'parseErrorResponse' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
    return null;
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private getRetryDelay(attempt: number, error?: ApiError): number {
    if (error?.getRetryDelay) {
      return error.getRetryDelay();
    }
    
    const baseDelay = this.config.retryDelay ?? 1000;
    return Math.min(baseDelay * Math.pow(2, attempt - 1), 8000);
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generic GET request
   */
  async get<T>(
    url: string,
    params?: Record<string, string | number | boolean>,
    options?: RequestOptions
  ): Promise<T> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    const response = await this.executeRequest(fullUrl, {
      method: 'GET',
    }, {
      retryable: true,
      ...options,
    });

    return this.parseResponse<T>(response);
  }

  /**
   * Generic POST request
   */
  async post<T>(
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const response = await this.executeRequest(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }, options);

    return this.parseResponse<T>(response);
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const response = await this.executeRequest(url, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }, options);

    return this.parseResponse<T>(response);
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(
    url: string,
    options?: RequestOptions
  ): Promise<T> {
    const response = await this.executeRequest(url, {
      method: 'DELETE',
    }, options);

    // Handle 204 No Content responses
    if (response.status === 204) {
      return null as T;
    }

    return this.parseResponse<T>(response);
  }

  /**
   * Upload file directly to signed URL
   */
  async uploadFile(
    signedUrl: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const requestId = this.generateRequestId();

      // Progress tracking
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });
      }

      // Success handler
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          if (this.isDevelopment) {
            logger.debug(`File upload completed: ${file.name}`, {
              metadata: { requestId, status: xhr.status, fileSize: file.size },
            });
          }
          resolve();
        } else {
          const error = new ApiError(
            `File upload failed: ${xhr.statusText}`,
            'UPLOAD_ERROR',
            xhr.status,
            { fileName: file.name, fileSize: file.size },
            requestId
          );
          reject(error);
        }
      });

      // Error handler
      xhr.addEventListener('error', () => {
        const error = new NetworkError(
          `File upload network error: ${file.name}`
        );
        reject(error);
      });

      // Timeout handler
      xhr.addEventListener('timeout', () => {
        const error = new ApiError(
          `File upload timeout: ${file.name}`,
          'TIMEOUT',
          408,
          { fileName: file.name },
          requestId
        );
        reject(error);
      });

      // Configure and send request
      xhr.timeout = this.config.timeout ?? 30000;
      xhr.open('PUT', signedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.setRequestHeader('X-Request-ID', requestId);
      
      if (this.isDevelopment) {
        logger.debug(`Starting file upload: ${file.name}`, {
          metadata: { requestId, fileSize: file.size, mimeType: file.type },
        });
      }

      xhr.send(file);
    });
  }

  /**
   * Parse JSON response with error handling
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      throw new ApiError(
        'Invalid response format',
        'INVALID_RESPONSE',
        response.status
      );
    }

    try {
      return await response.json();
    } catch (error) {
      throw new ApiError(
        'Failed to parse response',
        'PARSE_ERROR',
        response.status,
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }
}

/**
 * Singleton API client instance
 */
export const apiClient = new ApiClient({
  baseUrl: env.api.baseUrl,
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
});