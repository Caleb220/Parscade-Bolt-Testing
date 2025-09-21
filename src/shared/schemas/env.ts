/**
 * Environment Configuration Schema
 * Validates and types environment variables with proper defaults
 */

import { z } from 'zod';

const envSchema = z.object({
  MODE: z.enum(['development', 'production', 'test']).default('development'),
  VITE_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  VITE_ANALYTICS_KEY: z.string().optional(),
  VITE_API_BASE_URL: z.string().url().optional(),
  VITE_WORKER_BASE_URL: z.string().url().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export const buildEnv = (env: Record<string, any>) => {
  const parsed = envSchema.parse(env);
  
  return {
    mode: parsed.MODE,
    supabase: {
      url: parsed.VITE_SUPABASE_URL,
      anonKey: parsed.VITE_SUPABASE_ANON_KEY,
    },
    analytics: {
      key: parsed.VITE_ANALYTICS_KEY,
    },
    api: {
      baseUrl: parsed.VITE_API_BASE_URL || 'https://api.parscade.com',
    },
    worker: {
      baseUrl: parsed.VITE_WORKER_BASE_URL || 'https://worker.parscade.com',
    },
  };
};

export type AppEnv = ReturnType<typeof buildEnv>;