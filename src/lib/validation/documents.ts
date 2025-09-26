/**
 * Document Validation Schemas
 * Fully aligned with backend OpenAPI schema validation
 * Ensures type safety and proper error handling
 */

import { z } from 'zod';

import {
  uuidSchema,
  optionalTrimmedStringSchema,
  nonEmptyTextSchema,
  httpsUrlSchema,
  paginationParamsSchema,
  isoDateTimeSchema,
  optionalIsoDateTimeSchema,
} from '@/shared/schemas/common';

// Document status validation matching backend exactly
export const documentStatusSchema = z.enum(['uploading', 'processing', 'completed', 'failed'], {
  errorMap: () => ({ message: 'Status must be uploading, processing, completed, or failed' }),
});

// Document creation validation schema
export const documentCreateSchema = z
  .object({
    name: nonEmptyTextSchema('Document name', 255),
    project_id: uuidSchema.optional(),
    mime_type: z
      .string()
      .min(1, 'MIME type is required')
      .max(100, 'MIME type must be 100 characters or less'),
    metadata: z.record(z.unknown()).optional().default({}),
  })
  .strict();

// Document update validation schema
export const documentUpdateSchema = z
  .object({
    name: optionalTrimmedStringSchema('Document name', 1, 255),
    project_id: uuidSchema.nullable().optional(),
    status: documentStatusSchema.optional(),
    metadata: z.record(z.unknown()).optional(),
    extracted_text: z.string().nullable().optional(),
    structure_data: z.record(z.unknown()).nullable().optional(),
    thumbnail_key: z.string().nullable().optional(),
  })
  .strict();

// Document ingest validation schema
export const documentIngestSchema = z
  .object({
    url: httpsUrlSchema,
    name: optionalTrimmedStringSchema('Document name', 1, 255),
    project_id: uuidSchema.optional(),
    mime_type: z.string().max(100).optional(),
    metadata: z.record(z.unknown()).optional().default({}),
  })
  .strict();

// Document query parameters validation schema
export const documentQuerySchema = paginationParamsSchema
  .extend({
    search: optionalTrimmedStringSchema('Search query', 1, 100),
    project_id: uuidSchema.optional(),
    status: documentStatusSchema.optional(),
    mime_type: z.string().max(100).optional(),
    created_after: optionalIsoDateTimeSchema,
    created_before: optionalIsoDateTimeSchema,
    updated_after: optionalIsoDateTimeSchema,
    updated_before: optionalIsoDateTimeSchema,
  })
  .strict();

// File upload validation
export const fileUploadSchema = z
  .object({
    file: z
      .instanceof(File, { message: 'A valid file is required' })
      .refine(file => file.size > 0, 'File cannot be empty')
      .refine(file => file.size <= 100 * 1024 * 1024, 'File size must be less than 100MB')
      .refine(file => {
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        return allowedTypes.includes(file.type);
      }, 'File type not supported. Allowed: PDF, Word, Text, Images'),
    name: optionalTrimmedStringSchema('Document name', 1, 255),
    project_id: uuidSchema.optional(),
    metadata: z
      .string()
      .optional()
      .transform(val => {
        if (!val) return {};
        try {
          return JSON.parse(val);
        } catch {
          throw new Error('Metadata must be valid JSON');
        }
      }),
  })
  .strict();

// Type exports
export type DocumentStatus = z.infer<typeof documentStatusSchema>;
export type DocumentCreateData = z.infer<typeof documentCreateSchema>;
export type DocumentUpdateData = z.infer<typeof documentUpdateSchema>;
export type DocumentIngestData = z.infer<typeof documentIngestSchema>;
export type DocumentQueryParams = z.infer<typeof documentQuerySchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;
