/**
 * Account Validation Schemas
 * Aligned with OpenAPI schema definitions
 */

import { z } from 'zod';
import {
  phoneSchema,
  timezoneSchema,
  nonEmptyTextSchema,
  optionalTrimmedStringSchema,
  emailSchema,
} from '@/shared/schemas/common';

// Profile validation matching OpenAPI UpdateProfileRequest
export const profileSchema = z.object({
  full_name: nonEmptyTextSchema('Full name', 100).nullable(),
  username: optionalTrimmedStringSchema('Username', 2, 60),
  company: optionalTrimmedStringSchema('Company', 0, 100),
  role: optionalTrimmedStringSchema('Role', 0, 50),
  phone: phoneSchema.optional(),
  locale: optionalTrimmedStringSchema('Locale', 2, 10),
  timezone: timezoneSchema,
});

// API Key validation matching OpenAPI CreateApiKeyRequest
export const apiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  scopes: z.array(z.enum(['read', 'write', 'admin'])).min(1, 'At least one scope is required').optional(),
});

// Notification preferences validation
export const notificationPrefsSchema = z.object({
  accountUpdates: z.boolean(),
  productUpdates: z.boolean(),
  marketingEmails: z.boolean(),
  teamMemberActivity: z.boolean(),
  projectChanges: z.boolean(),
  processingAlerts: z.boolean(),
  errorNotifications: z.boolean(),
  maintenanceAlerts: z.boolean(),
  frequency: z.enum(['real-time', 'daily', 'weekly', 'monthly']),
  quietHours: z.object({
    start: z.string(),
    end: z.string(),
    enabled: z.boolean(),
  }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type ApiKeyFormData = z.infer<typeof apiKeySchema>;
export type NotificationPrefsFormData = z.infer<typeof notificationPrefsSchema>;