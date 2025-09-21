/**
 * Account Validation Schemas
 * Aligned with OpenAPI schema definitions using snake_case
 */

import { z } from 'zod';
import {
  phoneSchema,
  timezoneSchema,
  nonEmptyTextSchema,
  optionalTrimmedStringSchema,
  emailSchema,
} from '@/shared/schemas/common';

// Profile validation matching OpenAPI UpdateProfileRequest exactly
export const profileSchema = z.object({
  full_name: optionalTrimmedStringSchema('Full name', 1, 100),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username must be at most 32 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .nullable()
    .optional(),
  company: optionalTrimmedStringSchema('Company', 1, 100),
  role: optionalTrimmedStringSchema('Job title', 1, 100), // Job title field
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Phone must be in international format')
    .nullable()
    .optional(),
  locale: z.string()
    .max(10, 'Locale must be at most 10 characters')
    .nullable()
    .optional(),
  timezone: z.string()
    .max(50, 'Timezone must be at most 50 characters')
    .nullable()
    .optional(),
});

// API Key validation matching OpenAPI CreateApiKeyRequest exactly
export const apiKeySchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  scopes: z.array(z.enum(['read', 'write', 'admin']))
    .min(1, 'At least one scope is required')
    .max(3, 'Maximum 3 scopes allowed')
    .optional()
    .default(['read']),
});

// Notification preferences validation matching OpenAPI exactly
export const notificationPreferencesSchema = z.object({
  channels: z.object({
    email: z.boolean(),
    in_app: z.boolean(),
    webhook: z.boolean(),
  }).optional(),
  categories: z.object({
    product: z.enum(['off', 'immediate', 'daily']).optional(),
    billing: z.enum(['off', 'immediate', 'daily']).optional(),
    incidents: z.enum(['off', 'immediate', 'daily']).optional(),
    jobs: z.enum(['off', 'immediate', 'daily']).optional(),
    digest: z.enum(['off', 'immediate', 'daily']).optional(),
  }).optional(),
  dnd_settings: z.object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format'),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format'),
    timezone: z.string(),
  }).nullable().optional(),
  webhook_url: z.string().url('Must be a valid URL').nullable().optional(),
});

// Webhook validation matching OpenAPI exactly
export const webhookSchema = z.object({
  url: z.string().url('Must be a valid URL'),
  events: z.array(z.enum(['job.completed', 'job.failed', 'document.processed', 'document.failed']))
    .min(1, 'At least one event is required'),
  active: z.boolean().optional().default(true),
});

// Data source validation matching OpenAPI exactly
export const dataSourceSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  type: z.enum(['s3', 'gcs', 'azure', 'supabase']),
  config: z.record(z.unknown()),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type ApiKeyFormData = z.infer<typeof apiKeySchema>;
export type NotificationPreferencesFormData = z.infer<typeof notificationPreferencesSchema>;
export type WebhookFormData = z.infer<typeof webhookSchema>;
export type DataSourceFormData = z.infer<typeof dataSourceSchema>;