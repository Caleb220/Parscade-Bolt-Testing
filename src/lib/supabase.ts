import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

/**
 * Supabase client configuration with domain-agnostic settings
 * 
 * SECURITY CONSIDERATIONS:
 * - autoRefreshToken: Automatically refreshes tokens regardless of domain
 * - persistSession: Maintains sessions across page reloads on any domain
 * - detectSessionInUrl: Detects auth tokens in URL parameters (needed for password reset)
 * 
 * DOMAIN FLEXIBILITY:
 * - These settings work on any domain where the app is hosted
 * - No domain-specific restrictions in client configuration
 * - Supabase handles CORS and domain validation on the server side
 */
export const supabase = createClient(env.supabase.url, env.supabase.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // SECURITY: No domain restrictions in client config
    // Domain validation is handled by Supabase server-side configuration
  },
});
