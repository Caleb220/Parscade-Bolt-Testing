/**
 * Shared TypeScript types for the Account system
 */

export interface User {
  readonly id: string;
  readonly email: string;
  readonly full_name?: string;
  readonly username?: string;
  readonly avatar_url?: string;
  readonly company?: string;
  readonly role?: string;
  readonly phone?: string;
  readonly locale?: string;
  readonly timezone?: string;
  readonly plan: 'free' | 'pro' | 'enterprise';
  readonly created_at: string;
  readonly updated_at: string;
}

export interface ApiKey {
  readonly id: string;
  readonly name: string;
  readonly created_at: string;
  readonly last_used_at?: string;
  readonly scopes: readonly string[];
  readonly preview?: string;
}

export interface NotificationPrefs {
  readonly channels: {
    readonly email: boolean;
    readonly in_app: boolean;
    readonly webhook: boolean;
  };
  readonly categories: Record<
    'product' | 'billing' | 'incidents' | 'jobs' | 'digest',
    'off' | 'immediate' | 'daily'
  >;
  readonly dnd?: {
    readonly start: string;
    readonly end: string;
    readonly timezone: string;
  };
  readonly webhook_url?: string;
}

export interface Webhook {
  readonly id: string;
  readonly url: string;
  readonly events: readonly string[];
  readonly active: boolean;
  readonly created_at: string;
  readonly secret_set: boolean;
}

export interface Session {
  readonly id: string;
  readonly user_agent: string;
  readonly ip_address: string;
  readonly last_seen: string;
  readonly created_at: string;
  readonly is_current: boolean;
}

export interface SecurityEvent {
  readonly id: string;
  readonly event_type: string;
  readonly description: string;
  readonly ip_address?: string;
  readonly user_agent?: string;
  readonly created_at: string;
}

export interface Service {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly icon_url?: string;
  readonly connected: boolean;
  readonly scopes?: readonly string[];
  readonly last_sync?: string;
}

export interface DataSource {
  readonly id: string;
  readonly name: string;
  readonly type: 's3' | 'gcs' | 'azure' | 'supabase';
  readonly config: Record<string, unknown>;
  readonly status: 'active' | 'error' | 'disabled';
  readonly last_sync?: string;
  readonly created_at: string;
}