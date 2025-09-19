import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anonymous key is required'),
  VITE_API_BASE_URL: z.string().url('Invalid API base URL').default('https://api.parscade.com'),
  VITE_WORKER_BASE_URL: z.string().url('Invalid worker base URL').default('https://worker.parscade.com'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('production'),
  VITE_SENTRY_DSN: z.string().url('Invalid Sentry DSN').optional(),
  VITE_BILLING_ENABLED: z.string().transform((val) => val === 'true').default('false'),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw new Error('Invalid environment configuration');
  }
}

export const env = validateEnv();

export type { Env };