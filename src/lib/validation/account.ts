/**
 * Account Validation Schemas
 * Aligned with OpenAPI schema definitions
 */

import { z } from 'zod';

// Profile validation matching OpenAPI UpdateProfileRequest
export const profileSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(100, 'Name too long').nullable(),
  timezone: z.string().min(1, 'Timezone is required').max(50, 'Timezone too long'),
});

// API Key validation matching OpenAPI CreateApiKeyRequest
export const apiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  scopes: z.array(z.enum(['read', 'write', 'admin'])).min(1, 'At least one scope is required').optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type ApiKeyFormData = z.infer<typeof apiKeySchema>;