/**
 * API Error handling for Parscade Backend Integration
 * Centralized error definitions and utilities
 */

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
 * Type guard to check if error is an ApiError
 */
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

/**
 * Extract user-friendly message from any error
 */
export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.getUserMessage();
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Extract correlation ID from any error for debugging
 */
export const getRequestId = (error: unknown): string | undefined => {
  if (isApiError(error)) {
    return error.requestId;
  }
  
  return undefined;
};