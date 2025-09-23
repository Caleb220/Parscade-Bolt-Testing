/**
 * Contact Form Validation Schema
 * Fully aligned with backend OpenAPI schema validation
 * Ensures type safety and proper error handling
 */

import { z } from 'zod';
import {
  emailSchema,
  nonEmptyTextSchema,
  optionalTrimmedStringSchema,
} from '@/shared/schemas/common';

// Contact form validation schema matching backend exactly
export const contactFormSchema = z.object({
  name: nonEmptyTextSchema('Name', 100),
  email: emailSchema,
  company: optionalTrimmedStringSchema('Company', 1, 100),
  subject: nonEmptyTextSchema('Subject', 200),
  message: z.string()
    .trim()
    .min(1, 'Message is required')
    .max(2000, 'Message must be 2000 characters or less'),
}).strict();

// Contact form response validation schema
export const contactResponseSchema = z.object({
  success: z.boolean(),
}).strict();

// Type exports
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ContactResponse = z.infer<typeof contactResponseSchema>;