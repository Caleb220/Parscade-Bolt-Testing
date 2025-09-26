/**
 * Component Type Definitions
 * Shared types for UI components and interactions
 */

export interface PipelineStep {
  readonly id: string;
  readonly title: string;
  readonly shortTitle?: string;
  readonly description: string;
  readonly icon: string;
  readonly status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface UploadProgress {
  readonly phase: 'idle' | 'signing' | 'uploading' | 'completing' | 'completed' | 'error';
  readonly progress: number;
  readonly bytesUploaded?: number;
  readonly totalBytes?: number;
  readonly error?: string;
}

export interface FormFieldProps {
  readonly label?: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly placeholder?: string;
  readonly className?: string;
}
