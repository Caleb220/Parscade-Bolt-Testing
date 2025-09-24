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

// Profile validation with fully optional fields for partial updates
export const profileSchema = z.object({
  full_name: optionalTrimmedStringSchema('Full name', 0, 100),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username must be at most 32 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .or(z.literal(''))  // Allow empty string
    .nullable()
    .optional(),
  bio: optionalTrimmedStringSchema('Bio', 0, 500),
  company: optionalTrimmedStringSchema('Company', 0, 100),
  website: z.string()
    .url('Must be a valid URL')
    .or(z.literal(''))  // Allow empty string
    .nullable()
    .optional(),
  location: optionalTrimmedStringSchema('Location', 0, 100),
}).partial(); // Make entire schema partial for flexible updates

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