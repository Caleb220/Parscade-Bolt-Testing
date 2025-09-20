/**
 * Zod validation schemas for Account forms
 */

import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .optional(),
  company: z.string().max(100, 'Company name too long').optional(),
  role: z.string().max(50, 'Role too long').optional(),
  phone: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format (use E.164 format)')
    .optional()
    .or(z.literal('')),
  locale: z.string().max(10, 'Locale too long').optional(),
  timezone: z.string().max(50, 'Timezone too long').optional(),
});

export const apiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  scopes: z.array(z.string()).min(1, 'At least one scope is required'),
});

export const webhookSchema = z.object({
  url: z.string().url('Invalid URL').max(500, 'URL too long'),
  events: z.array(z.string()).min(1, 'At least one event is required'),
  active: z.boolean().default(true),
});

export const notificationPrefsSchema = z.object({
  channels: z.object({
    email: z.boolean(),
    in_app: z.boolean(),
    webhook: z.boolean(),
  }),
  categories: z.object({
    product: z.enum(['off', 'immediate', 'daily']),
    billing: z.enum(['off', 'immediate', 'daily']),
    incidents: z.enum(['off', 'immediate', 'daily']),
    jobs: z.enum(['off', 'immediate', 'daily']),
    digest: z.enum(['off', 'immediate', 'daily']),
  }),
  dnd: z
    .object({
      start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format'),
      end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format'),
      timezone: z.string(),
    })
    .optional(),
  webhook_url: z.string().url('Invalid webhook URL').optional().or(z.literal('')),
});

export const dataSourceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  type: z.enum(['s3', 'gcs', 'azure', 'supabase']),
  config: z.object({
    bucket: z.string().optional(),
    region: z.string().optional(),
    access_key: z.string().optional(),
    secret_key: z.string().optional(),
    path_prefix: z.string().optional(),
  }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type ApiKeyFormData = z.infer<typeof apiKeySchema>;
export type WebhookFormData = z.infer<typeof webhookSchema>;
export type NotificationPrefsFormData = z.infer<typeof notificationPrefsSchema>;
export type DataSourceFormData = z.infer<typeof dataSourceSchema>;