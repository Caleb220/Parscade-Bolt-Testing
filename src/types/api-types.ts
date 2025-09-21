/**
 * API Type Definitions
 * Auto-generated from OpenAPI specification
 * 
 * This file contains the complete type definitions that match the backend OpenAPI schema.
 * All frontend API calls should use these types for request/response handling.
 */

export interface paths {
  '/health': {
    get: {
      responses: {
        '200': {
          content: {
            'application/json': {
              status: 'healthy' | 'unhealthy';
              timestamp: string;
              uptime: number;
              version: string;
            };
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
              status: 'ready' | 'not_ready';
              services: {
                database: 'healthy' | 'unhealthy' | 'not_configured';
                redis: 'healthy' | 'unhealthy' | 'not_configured';
                storage: 'healthy' | 'unhealthy' | 'not_configured';
              };
            };
          };
        };
        '503': {
          content: {
            'application/json': {
              status: 'ready' | 'not_ready';
              services: {
                database: 'healthy' | 'unhealthy' | 'not_configured';
                redis: 'healthy' | 'unhealthy' | 'not_configured';
                storage: 'healthy' | 'unhealthy' | 'not_configured';
              };
            };
          };
        };
      };
    };
  };
  '/v1/auth/callback': {
    post: {
      requestBody: {
        content: {
          'application/json': {
            access_token: string;
            refresh_token?: string;
          };
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': {
              user: UserProfile;
              session: {
                access_token: string;
                refresh_token?: string;
                expires_at: string;
              };
            };
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
  '/v1/auth/signup': {
    post: {
      requestBody: {
        content: {
          'application/json': {
            email: string;
            password: string;
            full_name?: string | null;
            username?: string | null;
          };
        };
      };
      responses: {
        '201': {
          content: {
            'application/json': {
              user: UserProfile | null;
              session: {
                access_token: string;
                refresh_token: string;
                expires_at: string;
              } | null;
              message: string;
            };
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
      };
    };
  };
  '/v1/auth/signin': {
    post: {
      requestBody: {
        content: {
          'application/json': {
            email?: string;
            username?: string;
            password: string;
          };
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': {
              user: UserProfile;
              session: {
                access_token: string;
                refresh_token: string;
                expires_at: string;
              };
            };
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
  '/v1/auth/signout': {
    post: {
      responses: {
        '200': {
          content: {
            'application/json': {
              message: string;
            };
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
  '/v1/auth/reset-password': {
    post: {
      requestBody: {
        content: {
          'application/json': {
            email: string;
          };
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': {
              message: string;
            };
          };
        };
        '400': {
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
      };
    };
    patch: {
      requestBody: {
        content: {
          'application/json': {
            fullName?: string | null;
            timezone?: string;
            username?: string | null;
            company?: string | null;
            phone?: string | null;
            locale?: string | null;
          };
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
      };
    };
    delete: {
      responses: {
        '200': {
          content: {
            'application/json': {
              message: string;
            };
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
              avatarUrl: string;
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
            'application/json': {
              sessions: UserSession[];
              pagination: PaginationMetadata;
            };
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
      parameters: {
        query?: {
          limit?: number;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': {
              events: SecurityEvent[];
              pagination: PaginationMetadata;
            };
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
            'application/json': {
              keys: ApiKey[];
              pagination: PaginationMetadata;
            };
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
          'application/json': {
            name: string;
            scopes?: string[];
          };
        };
      };
      responses: {
        '201': {
          content: {
            'application/json': {
              key: string;
              apiKey: ApiKey;
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
  '/v1/uploads/sign': {
    post: {
      requestBody: {
        content: {
          'application/json': {
            fileName: string;
            mimeType: string;
            size: number;
          };
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': {
              uploadUrl: string;
              storageKey: string;
              expiresAt: string;
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
  '/v1/uploads/{storageKey}/complete': {
    post: {
      parameters: {
        path: {
          storageKey: string;
        };
      };
      requestBody: {
        content: {
          'application/json': {
            name: string;
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
        query?: {
          page?: number;
          limit?: number;
          status?: DocumentStatus;
          search?: string;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': {
              documents: Document[];
              pagination: PaginationMetadata;
            };
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
            'application/json': {
              downloadUrl: string;
              expiresAt: string;
            };
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
  '/v1/jobs': {
    get: {
      parameters: {
        query?: {
          page?: number;
          limit?: number;
          status?: JobStatus;
          type?: JobType;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': {
              jobs: Job[];
              pagination: PaginationMetadata;
            };
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
          'application/json': {
            type: JobType;
            source: JobSource;
            documentId?: string;
            sourceUrl?: string;
            sourceKey?: string;
            options: Record<string, unknown>;
          };
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
    delete: {
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
        '409': {
          content: {
            'application/json': ErrorResponse;
          };
        };
      };
    };
  };
  '/v1/admin/users': {
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
            'application/json': {
              users: UserProfile[];
              pagination: PaginationMetadata;
            };
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
  '/v1/admin/jobs': {
    get: {
      parameters: {
        query?: {
          page?: number;
          limit?: number;
          status?: JobStatus;
          userId?: string;
        };
      };
      responses: {
        '200': {
          content: {
            'application/json': {
              jobs: Job[];
              pagination: PaginationMetadata;
            };
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
}

// Core type definitions matching OpenAPI schema
export interface UserProfile {
  readonly id: string;
  readonly email: string;
  readonly fullName?: string | null;
  readonly avatarUrl?: string | null;
  readonly timezone: string;
  readonly emailVerified: boolean;
  readonly role: UserRole;
  readonly username?: string | null;
  readonly company?: string | null;
  readonly phone?: string | null;
  readonly locale?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type UserRole = 'admin' | 'user';

export interface UserSession {
  readonly id: string;
  readonly sessionToken: string;
  readonly userAgent?: string | null;
  readonly ipAddress?: string | null;
  readonly isCurrent?: boolean;
  readonly lastSeen: string;
  readonly createdAt: string;
}

export interface SecurityEvent {
  readonly id: string;
  readonly eventType: string;
  readonly description: string;
  readonly ipAddress?: string | null;
  readonly userAgent?: string | null;
  readonly metadata?: Record<string, unknown>;
  readonly createdAt: string;
}

export interface ApiKey {
  readonly id: string;
  readonly name: string;
  readonly keyPreview: string;
  readonly scopes: readonly string[];
  readonly lastUsedAt?: string | null;
  readonly createdAt: string;
}

export interface Document {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly originalName: string;
  readonly mimeType: string;
  readonly size: number;
  readonly storageKey: string;
  readonly status: DocumentStatus;
  readonly metadata: Record<string, unknown>;
  readonly extractedText?: string | null;
  readonly structureData?: Record<string, unknown> | null;
  readonly thumbnailKey?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type DocumentStatus = 'uploading' | 'processing' | 'completed' | 'failed';

export interface Job {
  readonly id: string;
  readonly userId: string;
  readonly documentId?: string | null;
  readonly type: JobType;
  readonly status: JobStatus;
  readonly source: JobSource;
  readonly sourceUrl?: string | null;
  readonly sourceKey?: string | null;
  readonly metadata: Record<string, unknown>;
  readonly options: Record<string, unknown>;
  readonly resultRef?: string | null;
  readonly error?: string | null;
  readonly attempts: number;
  readonly maxAttempts: number;
  readonly progress: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly startedAt?: string | null;
  readonly completedAt?: string | null;
}

export type JobType = 'analyze_structure' | 'extract_text' | 'parse_document';
export type JobStatus = 'cancelled' | 'completed' | 'failed' | 'pending' | 'processing';
export type JobSource = 's3' | 'upload' | 'url';

export interface PaginationMetadata {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
}

export interface ErrorResponse {
  readonly error: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly timestamp: string;
  readonly requestId?: string;
}

// Legacy types for backward compatibility
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

// Type aliases for consistency
export type User = UserProfile;