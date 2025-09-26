/**
 * API Request/Response Validation Layer
 * Ensures data integrity and type safety for all API interactions
 * Provides runtime validation against backend schema
 */

import { ZodError } from 'zod';

import { logger } from '@/shared/services/logger';

import { ApiError } from './errors';

import type { ZodSchema } from 'zod';

/**
 * Validation configuration for API endpoints
 */
interface EndpointValidation {
  readonly request?: ZodSchema;
  readonly response?: ZodSchema;
  readonly params?: ZodSchema;
  readonly query?: ZodSchema;
}

/**
 * API validation middleware for runtime type checking
 */
export class ApiValidator {
  private readonly validations = new Map<string, EndpointValidation>();
  private readonly isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Register validation schemas for an endpoint
   */
  registerEndpoint(endpoint: string, validation: EndpointValidation): void {
    this.validations.set(endpoint, validation);
  }

  /**
   * Validate request data before sending to API
   */
  validateRequest(endpoint: string, data: unknown): unknown {
    const validation = this.validations.get(endpoint);
    if (!validation?.request) {
      return data;
    }

    try {
      return validation.request.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          received: err.received,
        }));

        if (this.isDevelopment) {
          logger.error('API request validation failed', {
            context: { feature: 'api-validation', endpoint },
            error: { validation_errors: formattedErrors },
          });
        }

        throw new ApiError('Request validation failed', 'VALIDATION_ERROR', 400, {
          validation_errors: formattedErrors,
        });
      }
      throw error;
    }
  }

  /**
   * Validate query parameters before sending to API
   */
  validateQuery(endpoint: string, params: unknown): unknown {
    const validation = this.validations.get(endpoint);
    if (!validation?.query) {
      return params;
    }

    try {
      return validation.query.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          received: err.received,
        }));

        if (this.isDevelopment) {
          logger.error('API query validation failed', {
            context: { feature: 'api-validation', endpoint },
            error: { validation_errors: formattedErrors },
          });
        }

        throw new ApiError('Query validation failed', 'VALIDATION_ERROR', 400, {
          validation_errors: formattedErrors,
        });
      }
      throw error;
    }
  }

  /**
   * Validate path parameters before sending to API
   */
  validateParams(endpoint: string, params: unknown): unknown {
    const validation = this.validations.get(endpoint);
    if (!validation?.params) {
      return params;
    }

    try {
      return validation.params.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          received: err.received,
        }));

        if (this.isDevelopment) {
          logger.error('API params validation failed', {
            context: { feature: 'api-validation', endpoint },
            error: { validation_errors: formattedErrors },
          });
        }

        throw new ApiError('Path parameters validation failed', 'VALIDATION_ERROR', 400, {
          validation_errors: formattedErrors,
        });
      }
      throw error;
    }
  }

  /**
   * Validate response data received from API
   */
  validateResponse(endpoint: string, data: unknown): unknown {
    const validation = this.validations.get(endpoint);
    if (!validation?.response) {
      return data;
    }

    try {
      return validation.response.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        if (this.isDevelopment) {
          logger.error('API response validation failed', {
            context: { feature: 'api-validation', endpoint },
            error: {
              message: 'Response does not match expected schema',
              validation_errors: error.errors,
              received_data: data,
            },
          });
        }

        throw new ApiError(
          'Response validation failed - data may be corrupted or schema outdated',
          'RESPONSE_VALIDATION_ERROR',
          500,
          { validation_errors: error.errors }
        );
      }
      throw error;
    }
  }

  /**
   * Get validation summary for debugging
   */
  getValidationSummary(): Record<string, string[]> {
    const summary: Record<string, string[]> = {};

    this.validations.forEach((validation, endpoint) => {
      const types: string[] = [];
      if (validation.request) types.push('request');
      if (validation.response) types.push('response');
      if (validation.params) types.push('params');
      if (validation.query) types.push('query');
      summary[endpoint] = types;
    });

    return summary;
  }
}

// Export singleton instance
export const apiValidator = new ApiValidator();
