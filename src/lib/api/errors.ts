/**
 * API Error Classes for Parscade Backend Integration
 * 
 * ENTERPRISE ARCHITECTURE:
 * - Structured error hierarchy for different error types
 * - Correlation ID tracking for observability
 * - User-friendly message mapping
 * - Type-safe error handling with request/response context
 */

import type { paths } from '@/types/api-types';

/**
 * Extract error response type from OpenAPI paths
 */
type ErrorResponse = paths['/v1/account/me']['get']['responses']['401']['content']['application/json'];

/**
 * Base API error class with correlation tracking and structured details
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

  /**
   * Create ApiError from backend error response
   */
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

  /**
   * Get user-friendly error message
   */
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

  /**
   * Check if error is retryable
   */
  isRetryable(): boolean {
    return (
      this.statusCode >= 500 || // Server errors
      this.statusCode === 429 || // Rate limiting
      this.code === 'NETWORK_ERROR' ||
      this.code === 'TIMEOUT'
    );
  }

  /**
   * Get suggested retry delay in milliseconds
   */
  getRetryDelay(): number {
    if (this.statusCode === 429) {
      // Check for Retry-After header value in details
      const retryAfter = this.details?.retryAfter;
      if (typeof retryAfter === 'number') {
        return retryAfter * 1000;
      }
    }
    
    // Exponential backoff: 1s, 2s, 4s, 8s
    return Math.min(1000 * Math.pow(2, (this.details?.attempt as number) || 0), 8000);
  }
}

/**
 * Authentication-specific error
 */
export class AuthError extends ApiError {
  public readonly name = 'AuthError';

  constructor(message: string, statusCode: number, requestId?: string) {
    super(message, 'AUTH_ERROR', statusCode, undefined, requestId);
  }
}

/**
 * Network-specific error for connection issues
 */
export class NetworkError extends ApiError {
  public readonly name = 'NetworkError';

  constructor(message: string, originalError?: Error) {
    super(message, 'NETWORK_ERROR', 0, { originalError: originalError?.message });
  }
}

/**
 * Validation error from backend
 */
export class ValidationError extends ApiError {
  public readonly name = 'ValidationError';
  public readonly fieldErrors: Record<string, string>;

  constructor(
    message: string,
    fieldErrors: Record<string, string> = {},
    details?: Record<string, unknown>,
    requestId?: string
  ) {
    super(message, 'VALIDATION_ERROR', 400, details, requestId);
    this.fieldErrors = fieldErrors;
  }

  /**
   * Create ValidationError from backend response
   */
  static fromBackendError(
    errorData: ErrorResponse,
    requestId?: string
  ): ValidationError {
    const details = errorData.details || {};
    const fieldErrors: Record<string, string> = {};

    // Extract field-specific errors from details
    if (typeof details === 'object' && details !== null) {
      for (const [key, value] of Object.entries(details)) {
        if (typeof value === 'string') {
          fieldErrors[key] = value;
        }
      }
    }

    return new ValidationError(errorData.message, fieldErrors, details, requestId);
  }
}

/**
 * Type guard to check if error is an ApiError
 */
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

/**
 * Type guard to check if error is an AuthError
 */
export const isAuthError = (error: unknown): error is AuthError => {
  return error instanceof AuthError;
};

/**
 * Type guard to check if error is a NetworkError
 */
export const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof NetworkError;
};

/**
 * Type guard to check if error is a ValidationError
 */
export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError;
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