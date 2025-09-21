/**
 * Core Schema Definitions
 * Base schemas used throughout the application
 */

import { z } from 'zod';

export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email();
export const urlSchema = z.string().url();
export const phoneSchema = z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format');

export const timestampSchema = z.string().datetime();
export const optionalTimestampSchema = timestampSchema.optional();

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  total: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export type Pagination = z.infer<typeof paginationSchema>;