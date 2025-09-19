/**
 * Enterprise API Client for Parscade Backend Integration
 * Auto-generated types from OpenAPI spec with professional error handling
 */

import { supabase } from '@/lib/supabase';
import { env } from '@/config/env';
import { logger } from '@/services/logger';

import type { paths } from '@/types/api-types';

/**
 * Extract error response type from OpenAPI paths
 */
type ErrorResponse = paths['/health']['get']['responses']['503']['content']['application/json'];

/**
 * Enterprise API Error with correlation tracking
 */
export class ApiError extends Error {
  public readonly name = 'ApiError';
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;
  public readonly timestamp: string;
  public readonly requestId?: string;
  public readonly endpoint?: string;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    details?: Record<string, unknown>,
    requestId?: string,
    endpoint?: string
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId;
    this.endpoint = endpoint;
  }

  static fromResponse(
    response: Response,
    errorData: ErrorResponse | null,
    endpoint?: string
  ): ApiError {
    const code = errorData?.error || `HTTP_${response.status}`;
    const message = errorData?.message || response.statusText || 'An error occurred';
    const details = errorData?.details;
    const requestId = errorData?.requestId || response.headers.get('x-request-id') || undefined;

    return new ApiError(message, code, response.status, details, requestId, endpoint);
  }

  getUserMessage(): string {
    switch (this.code) {
      case 'UNAUTHORIZED':
      case 'TOKEN_EXPIRED':
        return 'Your session has expired. Please sign in again.';
      case 'FORBIDDEN':
        return 'You do not have permission to perform this action.';
      case 'NOT_FOUND':
        return 'The requested resource was not found.';
      case 'VALIDATION_ERROR':
        return 'Please check your input and try again.';
      case 'RATE_LIMIT_EXCEEDED':
        return 'Too many requests. Please wait a moment and try again.';
      case 'SERVER_ERROR':
        return 'A server error occurred. Please try again later.';
      case 'NETWORK_ERROR':
        return 'Network connection failed. Please check your internet connection.';
      default:
        return this.message;
    }
  }

  isRetryable(): boolean {
    return (
      this.statusCode >= 500 ||
      this.statusCode === 429 ||
      this.code === 'NETWORK_ERROR' ||
      this.code === 'TIMEOUT'
    );
  }

  getRetryDelay(): number {
    if (this.statusCode === 429) {
      const retryAfter = this.details?.retryAfter;
      if (typeof retryAfter === 'number') {
        return retryAfter * 1000;
      }
    }
    
    return Math.min(1000 * Math.pow(2, (this.details?.attempt as number) || 0), 8000);
  }
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
 * Request context for correlation tracking
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
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly retryAttempts: number;
  private readonly isDevelopment: boolean;

  constructor() {
    this.baseUrl = env.VITE_API_BASE_URL;
    this.timeout = 30000;
    this.retryAttempts = 3;
    this.isDevelopment = env.mode === 'development';
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      if (this.isDevelopment) {
        logger.error('Failed to get auth token', {
          context: { feature: 'api-client', action: 'getAuthToken' },
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
      return null;
    }
  }

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

    logger.debug(`API ${error ? 'Error' : 'Request'}: ${context.method} ${context.url}`, {
      metadata: logData,
    });
  }

  private async executeRequest(
    url: string,
    init: RequestInit,
    options: RequestOptions = {}
  ): Promise<Response> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    const requestId = this.generateRequestId();
    const maxAttempts = options.retryAttempts ?? this.retryAttempts;

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
        }, options.timeout ?? this.timeout);

        const response = await fetch(fullUrl, {
          ...init,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        this.logRequest(context, response);

        if (!response.ok) {
          const errorData = await this.parseErrorResponse(response);
          const apiError = ApiError.fromResponse(response, errorData, fullUrl);
          
          // Handle auth errors immediately
          if (response.status === 401 || response.status === 403) {
            // Attempt to refresh session
            try {
              await supabase.auth.refreshSession();
              const newToken = await this.getAuthToken();
              if (newToken && attempt === 1) {
                // Retry once with new token
                headers.Authorization = `Bearer ${newToken}`;
                continue;
              }
            } catch (refreshError) {
              // Refresh failed, redirect to home
              window.location.href = '/';
              throw apiError;
            }
          }

          // Don't retry client errors except auth and rate limiting
          if (response.status >= 400 && response.status < 500) {
            if (response.status !== 408 && response.status !== 429) {
              throw apiError;
            }
          }

          // Retry for server errors and specific client errors
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

        if (error instanceof ApiError) {
          throw error;
        }

        const networkError = new ApiError(
          `Network request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          'NETWORK_ERROR',
          0,
          { originalError: error instanceof Error ? error.message : String(error) }
        );

        if (attempt < maxAttempts && options.retryable !== false) {
          await this.sleep(this.getRetryDelay(attempt));
          lastError = networkError;
          continue;
        }

        throw networkError;
      }
    }

    throw lastError || new ApiError('Max retry attempts exceeded', 'MAX_RETRIES', 0);
  }

  private async parseErrorResponse(response: Response): Promise<ErrorResponse | null> {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }
    } catch (error) {
      // Silently fail for error response parsing
    }
    return null;
  }

  private getRetryDelay(attempt: number, error?: ApiError): number {
    if (error?.getRetryDelay) {
      return error.getRetryDelay();
    }
    
    const baseDelay = 1000;
    return Math.min(baseDelay * Math.pow(2, attempt - 1), 8000);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

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

  async delete<T>(
    url: string,
    options?: RequestOptions
  ): Promise<T> {
    const response = await this.executeRequest(url, {
      method: 'DELETE',
    }, options);

    if (response.status === 204) {
      return null as T;
    }

    return this.parseResponse<T>(response);
  }

  async uploadFile(
    signedUrl: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const requestId = this.generateRequestId();

      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });
      }

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

      xhr.addEventListener('error', () => {
        const error = new ApiError(
          `File upload network error: ${file.name}`,
          'NETWORK_ERROR',
          0
        );
        reject(error);
      });

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

      xhr.timeout = this.timeout;
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

export const apiClient = new ApiClient();