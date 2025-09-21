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
  readonly username?: string;
  readonly avatarUrl?: string;
  readonly company?: string;
  readonly role?: string;
  readonly phone?: string;
  readonly locale?: string;
  readonly timezone?: string;
  readonly plan: 'free' | 'pro' | 'enterprise';
  readonly createdAt: string;
  readonly username?: string;
  readonly company?: string;
  readonly role?: string;
  readonly phone?: string;
  readonly updatedAt: string;
}

export interface Document {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly originalName: string;
  readonly mimeType: string;
  readonly size: number;
  readonly storageKey: string;
  readonly status: 'uploading' | 'processing' | 'completed' | 'failed';
  readonly metadata: Record<string, any>;
  readonly extractedText?: string;
  readonly structureData?: Record<string, any>;
  readonly thumbnailKey?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Job {
  readonly id: string;
  readonly userId: string;
  readonly documentId?: string;
  readonly type: 'parse_document' | 'extract_text' | 'analyze_structure';
  readonly status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  readonly source: 'upload' | 'url' | 's3';
  readonly sourceUrl?: string;
  readonly sourceKey?: string;
  readonly metadata: Record<string, any>;
  readonly options: Record<string, any>;
  readonly resultRef?: string;
  readonly error?: string;
  readonly attempts: number;
  readonly maxAttempts: number;
  readonly progress: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly startedAt?: string;
  readonly completedAt?: string;
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