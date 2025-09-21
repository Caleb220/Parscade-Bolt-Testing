import { createClient } from '@supabase/supabase-js';

import { env } from '@/app/config/env';

/**
 * Supabase client configuration with domain-agnostic settings
 * 
 * HARD LOGOUT SECURITY:
 * - autoRefreshToken: Handles token refresh (disabled on logout)
 * - persistSession: Maintains sessions (cleared on logout)
 * - detectSessionInUrl: Required for auth flows (disabled after logout)
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
    // HARD LOGOUT: These settings are overridden during logout process
    // - autoRefreshToken disabled to prevent silent re-login
    // - persistSession cleared completely
    // - detectSessionInUrl disabled to prevent token restoration
    
    // SECURITY: No domain restrictions in client config
    // Domain validation is handled by Supabase server-side configuration
  },
});
