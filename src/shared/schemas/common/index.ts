/**
 * Common Schema Utilities
 * Shared validation patterns and utilities
 */

import { z } from 'zod';

export const optionalIsoDateTimeSchema = z
  .string()
  .datetime()
  .optional()
  .transform((val) => (val ? new Date(val).toISOString() : undefined));

export const requiredStringSchema = z.string().min(1, 'This field is required');
export const optionalStringSchema = z.string().optional();

export const booleanSchema = z.boolean();
export const optionalBooleanSchema = z.boolean().optional();

export const numberSchema = z.number();
export const optionalNumberSchema = z.number().optional();

export const arraySchema = <T extends z.ZodTypeAny>(itemSchema: T) => z.array(itemSchema);
export const optionalArraySchema = <T extends z.ZodTypeAny>(itemSchema: T) => z.array(itemSchema).optional();