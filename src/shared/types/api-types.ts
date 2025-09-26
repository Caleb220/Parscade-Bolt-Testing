/**
 * API Type Definitions
 * Generated from OpenAPI specification
 */

// This file would typically be auto-generated from the OpenAPI spec
// For now, we'll define the basic types manually

export interface User {
  readonly id: string;
  readonly email: string;
  readonly full_name?: string | null;
  readonly username?: string | null;
  readonly avatar_url?: string | null;
  readonly bio?: string | null;
  readonly company?: string | null;
  readonly website?: string | null;
  readonly location?: string | null;
  readonly email_verified: boolean;
  readonly phone_verified: boolean;
  readonly onboarding_completed: boolean;
  readonly subscription_tier: 'free' | 'pro' | 'enterprise';
  readonly subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  readonly last_active_at?: string | null;
  readonly metadata: Record<string, unknown>;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly hasNext: boolean;
    readonly hasPrevious: boolean;
  };
}

// Placeholder for OpenAPI generated types
export interface paths {
  '/health': {
    get: {
      responses: {
        '200': {
          content: {
            'application/json': {
              status: string;
              timestamp: string;
              uptime: number;
              version: string;
            };
          };
        };
        '503': {
          content: {
            'application/json': {
              error: string;
              message: string;
              details?: Record<string, any>;
              timestamp: string;
              requestId?: string;
            };
          };
        };
      };
    };
  };
  // Add other paths as needed
  [key: string]: any;
}
