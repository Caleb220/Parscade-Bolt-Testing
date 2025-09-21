/**
 * Supabase Type Definitions
 * Enhanced types for Supabase integration
 */

import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface TypedSupabaseUser extends SupabaseUser {
  readonly id: string;
  readonly email?: string;
  readonly user_metadata?: {
    readonly full_name?: string;
    readonly avatar_url?: string;
    readonly [key: string]: any;
  };
  readonly email_confirmed_at?: string;
  readonly created_at: string;
  readonly updated_at: string;
}