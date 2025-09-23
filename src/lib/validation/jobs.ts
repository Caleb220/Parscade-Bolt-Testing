/**
 * Job Validation Schemas
 * Fully aligned with backend OpenAPI schema validation
 * Ensures type safety and proper error handling
 */

import { z } from 'zod';
import {
  uuidSchema,
  optionalTrimmedStringSchema,
  httpsUrlSchema,
  paginationParamsSchema,
  isoDateTimeSchema,
  optionalIsoDateTimeSchema,
  positiveIntegerSchema,
} from '@/shared/schemas/common';

// Job type validation matching backend exactly
export const jobTypeSchema = z.enum(['parse_document', 'extract_text', 'analyze_structure'], {
  errorMap: () => ({ message: 'Type must be parse_document, extract_text, or analyze_structure' }),
});

// Job status validation matching backend exactly
export const jobStatusSchema = z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled'], {
  errorMap: () => ({ message: 'Status must be pending, processing, completed, failed, or cancelled' }),
});

// Job source validation matching backend exactly
export const jobSourceSchema = z.enum(['upload', 'url', 's3'], {
  errorMap: () => ({ message: 'Source must be upload, url, or s3' }),
});

// Job creation validation schema
export const jobCreateSchema = z.object({
  document_id: uuidSchema.optional(),
  project_id: uuidSchema.optional(),
  type: jobTypeSchema,
  source: jobSourceSchema,
  source_url: httpsUrlSchema.optional(),
  source_key: z.string().max(500).optional(),
  metadata: z.record(z.unknown()).optional().default({}),
  options: z.record(z.unknown()).optional().default({}),
  max_attempts: z.number()
    .int('Max attempts must be an integer')
    .min(1, 'Max attempts must be at least 1')
    .max(10, 'Max attempts must be at most 10')
    .optional()
    .default(3),
}).strict().refine((data) => {
  // Validate source-specific requirements
  if (data.source === 'upload' && !data.document_id) {
    return false;
  }
  if (data.source === 'url' && !data.source_url) {
    return false;
  }
  if (data.source === 's3' && !data.source_key) {
    return false;
  }
  return true;
}, {
  message: 'Source requirements not met: upload requires document_id, url requires source_url, s3 requires source_key',
  path: ['source'],
});

// Job update validation schema
export const jobUpdateSchema = z.object({
  document_id: uuidSchema.nullable().optional(),
  project_id: uuidSchema.nullable().optional(),
  type: jobTypeSchema.optional(),
  status: jobStatusSchema.optional(),
  source: jobSourceSchema.optional(),
  source_url: httpsUrlSchema.nullable().optional(),
  source_key: z.string().max(500).nullable().optional(),
  metadata: z.record(z.unknown()).optional(),
  options: z.record(z.unknown()).optional(),
  result_ref: z.string().max(1000).nullable().optional(),
  error: z.string().max(2000).nullable().optional(),
  max_attempts: z.number()
    .int('Max attempts must be an integer')
    .min(1, 'Max attempts must be at least 1')
    .max(10, 'Max attempts must be at most 10')
    .optional(),
  progress: z.number()
    .int('Progress must be an integer')
    .min(0, 'Progress must be at least 0')
    .max(100, 'Progress must be at most 100')
    .optional(),
  started_at: optionalIsoDateTimeSchema,
  completed_at: optionalIsoDateTimeSchema,
}).strict();

// Job query parameters validation schema
export const jobQuerySchema = paginationParamsSchema.extend({
  search: optionalTrimmedStringSchema('Search query', 1, 100),
  project_id: uuidSchema.optional(),
  document_id: uuidSchema.optional(),
  type: jobTypeSchema.optional(),
  status: jobStatusSchema.optional(),
  source: jobSourceSchema.optional(),
  created_after: optionalIsoDateTimeSchema,
  created_before: optionalIsoDateTimeSchema,
  updated_after: optionalIsoDateTimeSchema,
  updated_before: optionalIsoDateTimeSchema,
}).strict();

// Job submit convenience schema (for parse jobs)
export const jobSubmitSchema = z.object({
  document_id: uuidSchema,
  project_id: uuidSchema.optional(),
  options: z.record(z.unknown()).optional().default({}),
}).strict();

// Type exports
export type JobType = z.infer<typeof jobTypeSchema>;
export type JobStatus = z.infer<typeof jobStatusSchema>;
export type JobSource = z.infer<typeof jobSourceSchema>;
export type JobCreateData = z.infer<typeof jobCreateSchema>;
export type JobUpdateData = z.infer<typeof jobUpdateSchema>;
export type JobQueryParams = z.infer<typeof jobQuerySchema>;
export type JobSubmitData = z.infer<typeof jobSubmitSchema>;