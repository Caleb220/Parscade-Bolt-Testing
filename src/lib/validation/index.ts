/**
 * Validation Schema Exports
 * Centralized validation schemas for the entire application
 * Ensures consistency between frontend and backend validation
 */

// Document validation schemas
export * from './documents';

// Job validation schemas
export * from './jobs';

// Export validation schemas
export * from './exports';

// Analytics validation schemas
export * from './analytics';

// Contact form validation schemas
export * from './contact';

// Re-export account validation from existing location
export * from './account';

// Common validation utilities
export { z } from 'zod';
export type { ZodError, ZodSchema } from 'zod';

/**
 * Generic validation helper for API responses
 */
export const validateApiResponse = <T>(schema: any, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`API response validation failed: ${error.message}`);
    }
    throw new Error('API response validation failed');
  }
};

/**
 * Generic validation helper for API requests
 */
export const validateApiRequest = <T>(schema: any, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`API request validation failed: ${error.message}`);
    }
    throw new Error('API request validation failed');
  }
};