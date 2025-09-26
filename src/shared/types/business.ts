/**
 * Business Logic Type Definitions
 * Domain-specific types for business operations
 */

export interface JobStatus {
  readonly id: string;
  readonly status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  readonly progress: number;
  readonly error?: string;
  readonly result?: any;
}

export interface DocumentMetadata {
  readonly id: string;
  readonly name: string;
  readonly size: number;
  readonly mimeType: string;
  readonly uploadedAt: string;
}

export interface ProcessingOptions {
  readonly extractText?: boolean;
  readonly analyzeStructure?: boolean;
  readonly customRules?: Record<string, any>;
}
