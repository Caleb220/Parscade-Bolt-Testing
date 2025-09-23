/**
 * API Setup and Configuration
 * Registers validation schemas and configures security settings
 * Must be imported once at application startup
 */

import { apiValidator } from './validation';
import { z } from 'zod';

// Import validation schemas
import {
  documentCreateSchema,
  documentUpdateSchema,
  documentIngestSchema,
  documentQuerySchema,
  fileUploadSchema,
} from '@/lib/validation/documents';

import {
  jobCreateSchema,
  jobUpdateSchema,
  jobQuerySchema,
  jobSubmitSchema,
} from '@/lib/validation/jobs';

import {
  exportCreateSchema,
  exportQuerySchema,
} from '@/lib/validation/exports';

import {
  analyticsQuerySchema,
  analyticsOverviewSchema,
  trendDataPointSchema,
  accuracyBreakdownItemSchema,
  errorRateItemSchema,
} from '@/lib/validation/analytics';

import {
  contactFormSchema,
  contactResponseSchema,
} from '@/lib/validation/contact';

import { uuidSchema } from '@/shared/schemas/common';

/**
 * Register all API endpoint validations
 */
export function setupApiValidation(): void {
  // Document endpoints
  apiValidator.registerEndpoint('/v1/documents/upload', {
    request: fileUploadSchema.omit({ file: true }), // File validation handled separately
    response: z.object({
      document: z.any(), // Full document schema would be complex
      download_url: z.string().url(),
    }),
  });

  apiValidator.registerEndpoint('/v1/documents/ingest', {
    request: documentIngestSchema,
    response: z.any(), // Document response schema
  });

  apiValidator.registerEndpoint('/v1/documents', {
    query: documentQuerySchema,
    response: z.object({
      data: z.array(z.any()),
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      total_pages: z.number(),
    }),
  });

  apiValidator.registerEndpoint('/v1/documents/:id', {
    params: z.object({ id: uuidSchema }),
    request: documentUpdateSchema,
    response: z.any(), // Document response schema
  });

  apiValidator.registerEndpoint('/v1/documents/:id/download', {
    params: z.object({ id: uuidSchema }),
    response: z.object({
      download_url: z.string().url(),
      expires_in: z.number(),
      expires_at: z.string().datetime(),
    }),
  });

  // Job endpoints
  apiValidator.registerEndpoint('/v1/jobs', {
    query: jobQuerySchema,
    request: jobCreateSchema,
    response: z.union([
      z.any(), // Job response schema
      z.object({
        data: z.array(z.any()),
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
      }),
    ]),
  });

  apiValidator.registerEndpoint('/v1/jobs/:id', {
    params: z.object({ id: uuidSchema }),
    request: jobUpdateSchema,
    response: z.any(), // Job response schema
  });

  apiValidator.registerEndpoint('/v1/jobs/:id/start', {
    params: z.object({ id: uuidSchema }),
    response: z.any(), // Job response schema
  });

  apiValidator.registerEndpoint('/v1/jobs/:id/cancel', {
    params: z.object({ id: uuidSchema }),
    response: z.any(), // Job response schema
  });

  apiValidator.registerEndpoint('/v1/jobs/:id/retry', {
    params: z.object({ id: uuidSchema }),
    response: z.any(), // Job response schema
  });

  // Export endpoints
  apiValidator.registerEndpoint('/v1/exports', {
    query: exportQuerySchema,
    request: exportCreateSchema,
    response: z.union([
      z.any(), // Export response schema
      z.object({
        data: z.array(z.any()),
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
      }),
    ]),
  });

  apiValidator.registerEndpoint('/v1/exports/:id', {
    params: z.object({ id: uuidSchema }),
    response: z.any(), // Export response schema
  });

  // Analytics endpoints
  apiValidator.registerEndpoint('/v1/analytics/trends', {
    query: analyticsQuerySchema,
    response: z.object({
      data: z.array(trendDataPointSchema),
      timeframe: z.enum(['day', 'week', 'month', 'year']),
      date_range: z.object({
        start_date: z.string().nullable(),
        end_date: z.string().nullable(),
      }),
    }),
  });

  apiValidator.registerEndpoint('/v1/analytics/accuracy-breakdown', {
    query: analyticsQuerySchema,
    response: z.object({
      data: z.array(accuracyBreakdownItemSchema),
      timeframe: z.enum(['day', 'week', 'month', 'year']),
      date_range: z.object({
        start_date: z.string().nullable(),
        end_date: z.string().nullable(),
      }),
      filters: z.object({
        document_type: z.string().nullable(),
      }),
    }),
  });

  apiValidator.registerEndpoint('/v1/analytics/error-rates', {
    query: analyticsQuerySchema,
    response: z.object({
      data: z.array(errorRateItemSchema),
      timeframe: z.enum(['day', 'week', 'month', 'year']),
      date_range: z.object({
        start_date: z.string().nullable(),
        end_date: z.string().nullable(),
      }),
    }),
  });

  apiValidator.registerEndpoint('/v1/analytics/overview', {
    query: analyticsQuerySchema,
    response: analyticsOverviewSchema,
  });

  // Contact endpoint
  apiValidator.registerEndpoint('/contact', {
    request: contactFormSchema,
    response: contactResponseSchema,
  });

  console.log('✅ API validation schemas registered');
}

/**
 * Get validation summary for debugging
 */
export function getValidationSummary(): Record<string, string[]> {
  return apiValidator.getValidationSummary();
}