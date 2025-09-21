/**
 * Enterprise HTTP Client
 * Provides robust error handling, retry logic, and authentication
 */

import { supabase } from '@/lib/supabase';
import { env } from '@/config/env';
import { ApiError } from './errors';

const TIMEOUT_MS = 15000;
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000;

/**
 * Get authentication token for API requests
 */
async function getAuthToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch {
    return null;
  }
}

/**
 * Generate unique request ID for tracking
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate retry delay with exponential backoff
 */
function getRetryDelay(attempt: number): number {
  return Math.min(RETRY_DELAY_BASE * Math.pow(2, attempt - 1), 8000);
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Enhanced HTTP client with retry logic and error handling
 */
export async function http<T>(
  path: string, 
  init?: RequestInit & { retry?: boolean }
): Promise<T> {
  const { retry = true, ...fetchInit } = init || {};
  let lastError: ApiError | null = null;
  const requestId = generateRequestId();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      // Get fresh auth token for each attempt
      const authToken = await getAuthToken();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        'X-Client-Version': '1.0.0',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...(fetchInit.headers as Record<string, string> || {}),
      };

      const response = await fetch(`${env.api.baseUrl}${path}`, {
        ...fetchInit,
        headers,
        credentials: 'omit',
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        let responseData;
        try {
          responseData = await response.json();
        } catch {
          responseData = null;
        }
        
        const apiErrorInstance = ApiError.fromResponse(response, responseData);
        
        // Handle auth errors immediately
        if (apiErrorInstance.code === 'UNAUTHORIZED') {
          // Try to refresh session once
          if (attempt === 1) {
            try {
              await supabase.auth.refreshSession();
              continue; // Retry with new token
            } catch {
              // Refresh failed, redirect to login
              window.location.href = '/';
              throw apiErrorInstance;
            }
          }
        }

        // Don't retry client errors (except auth and rate limit)
        if (response.status >= 400 && response.status < 500) {
          if (!['UNAUTHORIZED', 'RATE_LIMIT'].includes(apiErrorInstance.code)) {
            throw apiErrorInstance;
          }
        }

        // Retry for server errors and retryable client errors
        if (attempt < MAX_RETRIES && retry && apiErrorInstance.isRetryable()) {
          lastError = apiErrorInstance;
          await sleep(getRetryDelay(attempt));
          continue;
        }

        throw apiErrorInstance;
      }

      // Handle successful responses
      const contentType = response.headers.get('content-type');
      
      // Handle 204 No Content
      if (response.status === 204) {
        return null as T;
      }

      // Parse JSON response
      if (contentType?.includes('application/json')) {
        return (await response.json()) as T;
      }

      // Unexpected content type
      throw new ApiError(
        'UNKNOWN',
        `Expected JSON response, got ${contentType}`,
        response.status,
        undefined,
        requestId,
        path
      );

    } catch (error) {
      clearTimeout(timeout);

      if (error instanceof ApiError) {
        // Don't retry ApiErrors that aren't retryable
        if (attempt >= MAX_RETRIES || !retry || !error.isRetryable()) {
          throw error;
        }
        lastError = error;
        await sleep(getRetryDelay(attempt));
        continue;
      }

      // Handle network/timeout errors
      if (error instanceof Error) {
        const networkError = new ApiError(
          error.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK',
          error.name === 'AbortError' ? 'Request timed out' : error.message,
          undefined,
          undefined,
          requestId,
          path
        );

        if (attempt >= MAX_RETRIES || !retry) {
          throw networkError;
        }

        lastError = networkError;
        await sleep(getRetryDelay(attempt));
        continue;
      }

      // Unknown error type
      const unknownError = new ApiError(
        'UNKNOWN',
        'An unexpected error occurred',
        undefined,
        error,
        requestId,
        path
      );

      if (attempt >= MAX_RETRIES || !retry) {
        throw unknownError;
      }

      lastError = unknownError;
      await sleep(getRetryDelay(attempt));
    }
  }

  // If we get here, all retries failed
  throw lastError || new ApiError('UNKNOWN', 'Max retries exceeded', undefined, undefined, requestId, path);
}

/**
 * HTTP method helpers
 */
export const httpGet = <T>(path: string, params?: Record<string, any>): Promise<T> => {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return http<T>(query ? `${path}?${query}` : path, { method: 'GET' });
};

export const httpPost = <T>(path: string, body?: unknown): Promise<T> => {
  return http<T>(path, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
};

export const httpPatch = <T>(path: string, body?: unknown): Promise<T> => {
  return http<T>(path, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
};

export const httpPut = <T>(path: string, body?: unknown): Promise<T> => {
  return http<T>(path, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
};

export const httpDelete = <T>(path: string): Promise<T> => {
  return http<T>(path, { 
    method: 'DELETE',
    retry: false, // Don't retry delete operations
  });
};

/**
 * Upload file with progress tracking
 */
export async function httpUpload(
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const requestId = generateRequestId();

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
        resolve();
      } else {
        reject(new ApiError(
          'SERVER',
          `Upload failed with status ${xhr.status}`,
          xhr.status,
          undefined,
          requestId
        ));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new ApiError('NETWORK', 'Upload network error'));
    });

    xhr.addEventListener('timeout', () => {
      reject(new ApiError('TIMEOUT', 'Upload timed out'));
    });

    xhr.timeout = TIMEOUT_MS;
    xhr.open('POST', url);
    xhr.setRequestHeader('X-Request-ID', requestId);
    xhr.send(file);
  });
}