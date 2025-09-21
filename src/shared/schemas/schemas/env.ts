import { z } from 'zod';

import { httpsUrlSchema } from '@/schemas/common';

const insecureValuePatterns = [/placeholder/i, /changeme/i, /example/i, /^\s*$/];

const secureString = (name: string, minLength = 1) =>
  z
    .string({ required_error: `${name} is required.` })
    .trim()
    .min(minLength, `${name} must be at least ${minLength} characters.`)
    .refine(
      (value) => !insecureValuePatterns.some((pattern) => pattern.test(value)),
      `${name} must be set to a secure value.`,
    );

const optionalSecureString = (name: string, minLength = 1) =>
  secureString(name, minLength)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined));

/**
 * Raw import.meta.env validation used at startup time.
 */
export const rawEnvSchema = z
  .object({
    MODE: secureString('MODE', 2).default('development'),
    VITE_SUPABASE_URL: httpsUrlSchema,
    VITE_SUPABASE_ANON_KEY: secureString('VITE_SUPABASE_ANON_KEY', 20),
    VITE_ANALYTICS_KEY: optionalSecureString('VITE_ANALYTICS_KEY', 12),
    VITE_API_BASE_URL: httpsUrlSchema.default('https://api.parscade.com'),
    VITE_WORKER_BASE_URL: httpsUrlSchema.default('https://worker.parscade.com'),
    VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('production'),
    VITE_SENTRY_DSN: optionalSecureString('VITE_SENTRY_DSN', 10),
    VITE_BILLING_ENABLED: z.coerce.boolean().default(false),
  })
  .catchall(z.unknown());

/**
 * Normalised environment configuration consumed throughout the app.
 */
export const envSchema = z
  .object({
    mode: secureString('MODE', 2),
    supabase: z
      .object({
        url: httpsUrlSchema,
        anonKey: secureString('VITE_SUPABASE_ANON_KEY', 20),
      })
      .strict(),
    analytics: z
      .object({
        key: optionalSecureString('VITE_ANALYTICS_KEY', 12),
      })
      .strict(),
    api: z
      .object({
        baseUrl: httpsUrlSchema,
        workerUrl: httpsUrlSchema,
      })
      .strict(),
    app: z
      .object({
        env: z.enum(['development', 'staging', 'production']),
        sentryDsn: optionalSecureString('VITE_SENTRY_DSN', 10),
      })
      .strict(),
    features: z
      .object({
        billingEnabled: z.boolean(),
      })
      .strict(),
  })
  .strict();

export type AppEnv = z.infer<typeof envSchema>;

/**
 * Builds the runtime environment by validating the raw env map twice:
 * - ensures raw values exist and are secure
 * - normalises the structure used by application code
 */
export const buildEnv = (raw: unknown): AppEnv => {
  const parsedRaw = rawEnvSchema.parse(raw);
  return envSchema.parse({
    mode: parsedRaw.MODE,
    supabase: {
      url: parsedRaw.VITE_SUPABASE_URL,
      anonKey: parsedRaw.VITE_SUPABASE_ANON_KEY,
    },
    analytics: {
      key: parsedRaw.VITE_ANALYTICS_KEY,
    },
    api: {
      baseUrl: parsedRaw.VITE_API_BASE_URL,
      workerUrl: parsedRaw.VITE_WORKER_BASE_URL,
    },
    app: {
      env: parsedRaw.VITE_APP_ENV,
      sentryDsn: parsedRaw.VITE_SENTRY_DSN,
    },
    features: {
      billingEnabled: parsedRaw.VITE_BILLING_ENABLED,
    },
  });
};
