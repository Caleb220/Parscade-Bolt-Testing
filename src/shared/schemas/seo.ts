/**
 * SEO Configuration Schema
 * Validates SEO metadata for dynamic page updates
 */

import { z } from 'zod';

export const seoConfigSchema = z.object({
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(160),
  keywords: z.string(),
  author: z.string(),
  url: z.string().url(),
  image: z.string().url(),
  type: z.enum(['website', 'article', 'product']).default('website'),
  siteName: z.string(),
});

export type SeoConfig = z.infer<typeof seoConfigSchema>;
