/**
 * Zod Error Formatting Utilities
 * Provides user-friendly error messages from Zod validation errors
 */

import { ZodError } from 'zod';

/**
 * Format Zod validation errors for user display
 */
export const formatZodError = (error: ZodError): string => {
  const firstError = error.errors[0];
  if (!firstError) return 'Validation failed';

  const path = firstError.path.join('.');
  const message = firstError.message;

  // Customize common error messages
  switch (firstError.code) {
    case 'invalid_type':
      return `${path}: Expected ${firstError.expected}, got ${firstError.received}`;
    case 'too_small':
      if (firstError.type === 'string') {
        return `${path}: Must be at least ${firstError.minimum} characters`;
      }
      return `${path}: Must be at least ${firstError.minimum}`;
    case 'too_big':
      if (firstError.type === 'string') {
        return `${path}: Must be no more than ${firstError.maximum} characters`;
      }
      return `${path}: Must be no more than ${firstError.maximum}`;
    case 'invalid_string':
      if (firstError.validation === 'email') {
        return `${path}: Please enter a valid email address`;
      }
      if (firstError.validation === 'url') {
        return `${path}: Please enter a valid URL`;
      }
      return `${path}: ${message}`;
    default:
      return message;
  }
};

/**
 * Format any error for user display
 */
export const formatErrorForUser = (error: unknown, fallback = 'An unexpected error occurred'): string => {
  if (error instanceof ZodError) {
    return formatZodError(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
};