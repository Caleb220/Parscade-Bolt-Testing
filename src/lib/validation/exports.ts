/**
 * Export Validation Schemas
 * Fully aligned with backend OpenAPI schema validation
 * Ensures type safety and proper error handling
 */

import { z } from 'zod';
import {
  uuidSchema,
  paginationParamsSchema,
} from '@/shared/schemas/common';

// Export type validation matching backend exactly
export const exportTypeSchema = z.enum(['documents', 'jobs'], {
  errorMap: () => ({ message: 'Type must be documents or jobs' }),
});

// Export format validation matching backend exactly
export const exportFormatSchema = z.enum(['csv', 'json'], {
  errorMap: () => ({ message: 'Format must be csv or json' }),
});

// Export status validation matching backend exactly
export const exportStatusSchema = z.enum(['pending', 'processing', 'completed', 'failed'], {
  errorMap: () => ({ message: 'Status must be pending, processing, completed, or failed' }),
});

// Export filters validation schema
export const exportFiltersSchema = z.object({
  start_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
    .optional(),
  end_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
    .optional(),
  status: z.string().max(50).optional(),
  document_type: z.string().max(100).optional(),
  project_id: uuidSchema.optional(),
}).strict().refine((data) => {
  // If start_date is provided, end_date must also be provided and vice versa
  if (data.start_date && !data.end_date) return false;
  if (data.end_date && !data.start_date) return false;

  // If both dates are provided, start_date must be before or equal to end_date
  if (data.start_date && data.end_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    return startDate <= endDate;
  }

  return true;
}, {
  message: 'Both start_date and end_date must be provided together, and start_date must be before or equal to end_date',
  path: ['start_date'],
});

// Export creation validation schema
export const exportCreateSchema = z.object({
  type: exportTypeSchema,
  format: exportFormatSchema,
  filters: exportFiltersSchema.optional(),
}).strict();

// Export query parameters validation schema
export const exportQuerySchema = paginationParamsSchema.extend({
  status: exportStatusSchema.optional(),
}).strict();

// Type exports
export type ExportType = z.infer<typeof exportTypeSchema>;
export type ExportFormat = z.infer<typeof exportFormatSchema>;
export type ExportStatus = z.infer<typeof exportStatusSchema>;
export type ExportFilters = z.infer<typeof exportFiltersSchema>;
export type ExportCreateData = z.infer<typeof exportCreateSchema>;
export type ExportQueryParams = z.infer<typeof exportQuerySchema>;