/**
 * API Type Definitions - Auto-generated from OpenAPI Schema
 * 
 * IMPORTANT: This file should be auto-generated from the OpenAPI schema.
 * For now, manually aligned with the backend schema structure.
 * 
 * All types use snake_case to match backend exactly.
 */

// Core OpenAPI paths interface
export interface paths {
  '/health': {
    get: {
      responses: {
        '200': {
          content: {
            'application/json': HealthResponse;
          };
        };
        '503': {
          content: {
            'application/json': HealthResponse;
          };
        };
      };
    };
  };
  '/ready': {
    get: {
      responses: {
        '200': {
          content: {
            'application/json': {
              status: 'ready';
              timestamp: string;
              version: string;
            };
          };
        };
      };
    };
  };
  '/live': {
    get: {
      responses: {
        '200': {
          content: {
            'application/json': {
              status: 'alive';
              timestamp: string;
            };
          };
        };
      };
    };
  };
  '/v1/auth/signup': {
    post: {
      requestBody: {
        content: {
          'application/json': SignUpRequest;
        };
      };
      responses: {
        '201': {
          content: {
            'application/json': SignUpResponse;
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '409': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '500': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/auth/signin': {
    post: {
      requestBody: {
        content: {
          'application/json': SignInRequest;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': SignInResponse;
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '500': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/auth/signout': {
    post: {
      responses: {
        '200': {
          content: {
            'application/json': MessageResponse;
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '500': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/auth/reset-password': {
    post: {
      requestBody: {
        content: {
          'application/json': ResetPasswordRequest;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': MessageResponse;
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '500': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/auth/password': {
    put: {
      requestBody: {
        content: {
          'application/json': UpdatePasswordRequest;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': MessageResponse;
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '500': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/account/me': {
    get: {
      responses: {
        '200': {
          content: {
            'application/json': UserProfile;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '404': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
    patch: {
      requestBody: {
        content: {
          'application/json': UpdateProfileRequest;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': UserProfile;
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '409': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/account/avatar': {
    post: {
      requestBody: {
        content: {
          'multipart/form-data': {
            avatar: File;
          };
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': {
              avatar_url: string;
            };
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/account/sessions': {
    get: {
      responses: {
        '200': {
          content: {
            'application/json': UserSessionListResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/account/sessions/{sessionId}': {
    delete: {
      parameters: {
        path: {
          sessionId: string;
        };
      };
      responses: {
        '204': {
          content?: never;
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '404': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/account/security-events': {
    get: {
      responses: {
        '200': {
          content: {
            'application/json': SecurityEventListResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/keys': {
    get: {
      responses: {
        '200': {
          content: {
            'application/json': ApiKeyListResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
    post: {
      requestBody: {
        content: {
          'application/json': CreateApiKeyRequest;
        };
      };
      responses: {
        '201': {
          content: {
            'application/json': ApiKeyWithSecret;
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/keys/{keyId}': {
    delete: {
      parameters: {
        path: {
          keyId: string;
        };
      };
      responses: {
        '204': {
          content?: never;
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '404': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/notifications/preferences': {
    get: {
      responses: {
        '200': {
          content: {
            'application/json': NotificationPreferences;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
    put: {
      requestBody: {
        content: {
          'application/json': NotificationPreferencesUpdate;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': NotificationPreferences;
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/integrations/webhooks': {
    get: {
      responses: {
        '200': {
          content: {
            'application/json': WebhookListResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
    post: {
      requestBody: {
        content: {
          'application/json': CreateWebhookRequest;
        };
      };
      responses: {
        '201': {
          content: {
            'application/json': WebhookWithSecret;
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/integrations/webhooks/{webhookId}/test': {
    post: {
      parameters: {
        path: {
          webhookId: string;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': WebhookTestResult;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '404': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/integrations/services': {
    get: {
      responses: {
        '200': {
          content: {
            'application/json': ConnectedService[];
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/integrations/services/{serviceId}/connect': {
    post: {
      parameters: {
        path: {
          serviceId: string;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': ServiceConnectionResponse;
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '404': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/integrations/data-sources': {
    get: {
      responses: {
        '200': {
          content: {
            'application/json': DataSourceListResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
    post: {
      requestBody: {
        content: {
          'application/json': CreateDataSourceRequest;
        };
      };
      responses: {
        '201': {
          content: {
            'application/json': DataSource;
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/jobs': {
    get: {
      parameters: {
        query?: JobQueryParams;
      };
      responses: {
        '200': {
          content: {
            'application/json': PaginatedResponse<Job>;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
    post: {
      requestBody: {
        content: {
          'application/json': JobCreateData;
        };
      };
      responses: {
        '201': {
          content: {
            'application/json': Job;
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/jobs/{jobId}': {
    get: {
      parameters: {
        path: {
          jobId: string;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': Job;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '404': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
    put: {
      parameters: {
        path: {
          jobId: string;
        };
      };
      requestBody: {
        content: {
          'application/json': JobUpdateData;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': Job;
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '404': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          jobId: string;
        };
      };
      responses: {
        '204': {
          content?: never;
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '404': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/jobs/{jobId}/start': {
    post: {
      parameters: {
        path: {
          jobId: string;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': Job;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '404': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/jobs/{jobId}/cancel': {
    post: {
      parameters: {
        path: {
          jobId: string;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': Job;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '404': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/jobs/{jobId}/retry': {
    post: {
      parameters: {
        path: {
          jobId: string;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': Job;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '404': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/users': {
    get: {
      parameters: {
        query?: {
          page?: number;
          limit?: number;
          role?: UserRole;
          search?: string;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': UserListResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '403': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/users/{userId}': {
    get: {
      parameters: {
        path: {
          userId: string;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': UserProfile;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '403': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '404': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
    patch: {
      parameters: {
        path: {
          userId: string;
        };
      };
      requestBody: {
        content: {
          'application/json': UpdateUserRequest;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': UserProfile;
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '403': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '404': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/documents/upload': {
    post: {
      requestBody: {
        content: {
          'multipart/form-data': {
            file: File;
            name?: string;
            project_id?: string;
            metadata?: string;
          };
        };
      };
      responses: {
        '201': {
          content: {
            'application/json': DocumentUploadResponse;
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/documents/ingest': {
    post: {
      requestBody: {
        content: {
          'application/json': {
            url: string;
            name?: string;
            project_id?: string;
            mime_type?: string;
            metadata?: Record<string, unknown>;
          };
        };
      };
      responses: {
        '201': {
          content: {
            'application/json': Document;
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/documents': {
    get: {
      parameters: {
        query?: DocumentQueryParams;
      };
      responses: {
        '200': {
          content: {
            'application/json': PaginatedResponse<Document>;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/documents/{documentId}': {
    get: {
      parameters: {
        path: {
          documentId: string;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': Document;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '404': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
    patch: {
      parameters: {
        path: {
          documentId: string;
        };
      };
      requestBody: {
        content: {
          'application/json': DocumentUpdateData;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': Document;
          };
        };
        '400': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '404': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          documentId: string;
        };
      };
      responses: {
        '204': {
          content?: never;
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '404': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/documents/{documentId}/download': {
    get: {
      parameters: {
        path: {
          documentId: string;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': DocumentDownloadResponse;
          };
        };
        '401': {
          content: {
            'application/json': ErrorResponse;
          };
        };
        '404': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
}

// Core type definitions matching OpenAPI schema exactly
export interface HealthResponse {
  readonly status: 'healthy' | 'unhealthy';
  readonly timestamp: string;
  readonly response_time_ms: number;
  readonly version: string;
  readonly checks?: {
    readonly database: 'pass' | 'fail';
    readonly api: 'pass' | 'fail';
  };
  readonly environment?: string;
  readonly error?: string;
}

// Job-related type definitions
export type JobType = 'analyze_structure' | 'extract_text' | 'parse_document';
export type JobStatus = 'cancelled' | 'completed' | 'failed' | 'pending' | 'processing';
export type JobSource = 's3' | 'upload' | 'url';

export interface Job {
  readonly id: string;
  readonly user_id: string;
  readonly document_id: string | null;
  readonly project_id: string | null;
  readonly type: JobType;
  readonly status: JobStatus;
  readonly source: JobSource;
  readonly source_url: string | null;
  readonly source_key: string | null;
  readonly metadata: Record<string, unknown>;
  readonly options: Record<string, unknown>;
  readonly result_ref: string | null;
  readonly error: string | null;
  readonly attempts: number;
  readonly max_attempts: number;
  readonly progress: number;
  readonly created_at: string;
  readonly updated_at: string;
  readonly started_at: string | null;
  readonly completed_at: string | null;
}

export interface JobCreateData {
  readonly document_id?: string;
  readonly project_id?: string;
  readonly type: JobType;
  readonly source: JobSource;
  readonly source_url?: string;
  readonly source_key?: string;
  readonly metadata?: Record<string, unknown>;
  readonly options?: Record<string, unknown>;
  readonly max_attempts?: number;
}

export interface JobUpdateData {
  readonly document_id?: string | null;
  readonly project_id?: string | null;
  readonly type?: JobType;
  readonly status?: JobStatus;
  readonly source?: JobSource;
  readonly source_url?: string | null;
  readonly source_key?: string | null;
  readonly metadata?: Record<string, unknown>;
  readonly options?: Record<string, unknown>;
  readonly result_ref?: string | null;
  readonly error?: string | null;
  readonly max_attempts?: number;
  readonly progress?: number;
  readonly started_at?: string | null;
  readonly completed_at?: string | null;
}

export interface JobQueryParams {
  readonly page?: number;
  readonly limit?: number;
  readonly search?: string;
  readonly project_id?: string;
  readonly document_id?: string;
  readonly type?: JobType;
  readonly status?: JobStatus;
  readonly source?: JobSource;
  readonly created_after?: string;
  readonly created_before?: string;
  readonly updated_after?: string;
  readonly updated_before?: string;
}

export interface UserProfile {
  readonly id: string;
  readonly email: string;
  readonly full_name?: string | null;
  readonly username?: string | null;
  readonly avatar_url?: string | null;
  readonly company?: string | null;
  readonly role?: string | null; // Job title
  readonly phone?: string | null;
  readonly locale?: string | null;
  readonly timezone: string;
  readonly plan: UserPlan;
  readonly email_verified: boolean;
  readonly user_role: UserRole;
  readonly created_at: string;
  readonly updated_at: string;
}

export type UserRole = 'admin' | 'user';
export type UserPlan = 'free' | 'pro' | 'enterprise';

export interface UpdateProfileRequest {
  readonly full_name?: string | null;
  readonly username?: string | null;
  readonly company?: string | null;
  readonly role?: string | null; // Job title
  readonly phone?: string | null;
  readonly locale?: string | null;
  readonly timezone?: string | null;
}

export interface UpdateUserRequest {
  readonly role?: UserRole;
}

export interface UserSession {
  readonly id: string;
  readonly user_agent: string;
  readonly ip_address: string;
  readonly is_current: boolean;
  readonly last_seen: string;
  readonly created_at: string;
}

export interface SecurityEvent {
  readonly id: string;
  readonly event_type: SecurityEventType;
  readonly description: string;
  readonly ip_address?: string | null;
  readonly user_agent?: string | null;
  readonly metadata?: Record<string, unknown>;
  readonly created_at: string;
}

export type SecurityEventType = 
  | 'login_success' 
  | 'login_failed' 
  | 'logout' 
  | 'password_change' 
  | 'api_key_created' 
  | 'api_key_revoked' 
  | 'session_revoked' 
  | 'user_role_updated';

export interface ApiKey {
  readonly id: string;
  readonly name: string;
  readonly preview: string;
  readonly scopes: readonly ApiKeyScope[];
  readonly last_used_at?: string | null;
  readonly created_at: string;
}

export interface ApiKeyWithSecret extends ApiKey {
  readonly key: string;
}

export type ApiKeyScope = 'read' | 'write' | 'admin';

export interface CreateApiKeyRequest {
  readonly name: string;
  readonly scopes?: readonly ApiKeyScope[];
}

export interface NotificationPreferences {
  readonly channels: {
    readonly email: boolean;
    readonly in_app: boolean;
    readonly webhook: boolean;
  };
  readonly categories: {
    readonly product: NotificationFrequency;
    readonly billing: NotificationFrequency;
    readonly incidents: NotificationFrequency;
    readonly jobs: NotificationFrequency;
    readonly digest: NotificationFrequency;
  };
  readonly dnd_settings?: {
    readonly start: string;
    readonly end: string;
    readonly timezone: string;
  } | null;
  readonly webhook_url?: string | null;
}

export interface NotificationPreferencesUpdate {
  readonly channels?: {
    readonly email?: boolean;
    readonly in_app?: boolean;
    readonly webhook?: boolean;
  };
  readonly categories?: {
    readonly product?: NotificationFrequency;
    readonly billing?: NotificationFrequency;
    readonly incidents?: NotificationFrequency;
    readonly jobs?: NotificationFrequency;
    readonly digest?: NotificationFrequency;
  };
  readonly dnd_settings?: {
    readonly start?: string;
    readonly end?: string;
    readonly timezone?: string;
  } | null;
  readonly webhook_url?: string | null;
}

export type NotificationFrequency = 'off' | 'immediate' | 'daily';

export interface Webhook {
  readonly id: string;
  readonly url: string;
  readonly events: readonly WebhookEventType[];
  readonly active: boolean;
  readonly created_at: string;
  readonly secret_set: boolean;
}

export interface WebhookWithSecret extends Webhook {
  readonly secret: string;
}

export type WebhookEventType = 'job.completed' | 'job.failed' | 'document.processed' | 'document.failed';

export interface CreateWebhookRequest {
  readonly url: string;
  readonly events: readonly WebhookEventType[];
  readonly active?: boolean;
}

export interface WebhookTestResult {
  readonly status: number;
  readonly latency: number;
  readonly response?: string | null;
}

export interface ConnectedService {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly icon_url?: string | null;
  readonly connected: boolean;
  readonly scopes?: readonly string[] | null;
  readonly last_sync?: string | null;
}

export interface ServiceConnectionResponse {
  readonly redirect_url: string;
}

export interface DataSource {
  readonly id: string;
  readonly name: string;
  readonly type: DataSourceType;
  readonly config: Record<string, unknown>;
  readonly status: DataSourceStatus;
  readonly last_sync?: string | null;
  readonly created_at: string;
}

export type DataSourceType = 's3' | 'gcs' | 'azure' | 'supabase';
export type DataSourceStatus = 'active' | 'error' | 'disabled';

export interface CreateDataSourceRequest {
  readonly name: string;
  readonly type: DataSourceType;
  readonly config: Record<string, unknown>;
}

// List response interfaces
export interface UserSessionListResponse {
  readonly data: readonly UserSession[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly total_pages: number;
}

export interface SecurityEventListResponse {
  readonly data: readonly SecurityEvent[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly total_pages: number;
}

export interface ApiKeyListResponse {
  readonly data: readonly ApiKey[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly total_pages: number;
}

export interface WebhookListResponse {
  readonly data: readonly Webhook[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly total_pages: number;
}

export interface DataSourceListResponse {
  readonly data: readonly DataSource[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly total_pages: number;
}

export interface UserListResponse {
  readonly data: readonly UserProfile[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly total_pages: number;
}

// Authentication types
export interface SupabaseUser {
  readonly id: string;
  readonly email: string;
  readonly created_at: string;
  readonly email_confirmed_at?: string | null;
  readonly [key: string]: unknown;
}

export interface SupabaseSession {
  readonly access_token: string;
  readonly token_type: 'bearer';
  readonly expires_in: number;
  readonly refresh_token?: string | null;
  readonly user?: SupabaseUser;
  readonly [key: string]: unknown;
}

export interface SignUpRequest {
  readonly email: string;
  readonly password: string;
  readonly full_name?: string | null;
  readonly username?: string | null;
}

export interface SignUpResponse {
  readonly user: SupabaseUser;
  readonly session?: SupabaseSession | null;
  readonly message: string;
}

export interface SignInRequest {
  readonly email?: string;
  readonly username?: string;
  readonly password: string;
}

export interface SignInResponse {
  readonly user: SupabaseUser;
  readonly session: SupabaseSession;
}

export interface ResetPasswordRequest {
  readonly email: string;
}

export interface UpdatePasswordRequest {
  readonly password: string;
}

// Common response types
export interface ErrorResponse {
  readonly error: string;
  readonly message: string;
  readonly timestamp: string;
  readonly path?: string;
  readonly code?: string;
  readonly validation_errors?: readonly ValidationError[];
}

export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly received?: unknown;
  readonly expected?: string;
}

export interface MessageResponse {
  readonly message: string;
}

// Legacy compatibility types (for gradual migration)
export type User = UserProfile;

// Document-related type definitions
export type DocumentStatus = 'completed' | 'failed' | 'processing' | 'uploading';

export interface Document {
  readonly id: string;
  readonly user_id: string;
  readonly name: string;
  readonly original_name: string;
  readonly mime_type: string;
  readonly size: number;
  readonly storage_key: string;
  readonly status: DocumentStatus;
  readonly metadata: Record<string, unknown>;
  readonly extracted_text: string | null;
  readonly structure_data: Record<string, unknown> | null;
  readonly thumbnail_key: string | null;
  readonly project_id: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface DocumentCreateData {
  readonly name: string;
  readonly original_name: string;
  readonly mime_type: string;
  readonly size: number;
  readonly project_id?: string;
  readonly metadata?: Record<string, unknown>;
}

export interface DocumentUpdateData {
  readonly name?: string;
  readonly project_id?: string | null;
  readonly status?: DocumentStatus;
  readonly metadata?: Record<string, unknown>;
  readonly extracted_text?: string | null;
  readonly structure_data?: Record<string, unknown> | null;
  readonly thumbnail_key?: string | null;
}

export interface DocumentQueryParams {
  readonly page?: number;
  readonly limit?: number;
  readonly search?: string;
  readonly project_id?: string;
  readonly status?: DocumentStatus;
  readonly mime_type?: string;
  readonly created_after?: string;
  readonly created_before?: string;
  readonly updated_after?: string;
  readonly updated_before?: string;
}

export interface DocumentUploadResponse {
  readonly document: Document;
  readonly download_url: string;
}

export interface DocumentDownloadResponse {
  readonly download_url: string;
  readonly expires_in: number;
  readonly expires_at: string;
}

// Pagination metadata (standardized)
export interface PaginationMetadata {
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly total_pages: number;
}

// Generic paginated response (for backward compatibility)
export interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly total_pages: number;
}