/**
 * Analytics Configuration Schema
 * Validates analytics tracking configuration
 */

import { z } from 'zod';

export const analyticsConfigSchema = z.object({
  key: z.string().optional(),
  enabled: z.boolean().default(true),
  debug: z.boolean().default(false),
});

export type AnalyticsConfig = z.infer<typeof analyticsConfigSchema>;