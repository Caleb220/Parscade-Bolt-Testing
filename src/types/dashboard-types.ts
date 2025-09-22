/**
 * Dashboard API Type Definitions
 * Type-safe interfaces for all dashboard endpoints
 */

// Dashboard Statistics
export interface DashboardStats {
  readonly total_documents_processed: number;
  readonly documents_processed_this_month: number;
  readonly jobs_processing_current: number;
  readonly average_accuracy: number;
  readonly average_processing_time_ms: number;
}

// Dashboard Activity
export interface ActivityItem {
  readonly id: string;
  readonly type: 'document.uploaded' | 'document.processed' | 'job.created' | 'job.processing' | 'job.completed' | 'job.failed' | 'project.created' | 'project.updated';
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
}

export interface ActivityQueryParams {
  readonly page?: number;
  readonly limit?: number;
  readonly type?: ActivityItem['type'];
  readonly since?: string;
}

export interface ActivityResponse {
  readonly data: readonly ActivityItem[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly total_pages: number;
}

// Projects
export interface Project {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface ProjectWithStats extends Project {
  readonly document_count: number;
  readonly job_count: number;
  readonly last_activity: string | null;
}

export interface ProjectCreateData {
  readonly name: string;
  readonly description?: string;
}

export interface ProjectUpdateData {
  readonly name?: string;
  readonly description?: string;
}

export interface ProjectQueryParams {
  readonly page?: number;
  readonly limit?: number;
  readonly search?: string;
}

export interface ProjectResponse {
  readonly data: readonly ProjectWithStats[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly total_pages: number;
}

export interface DocumentAssociationData {
  readonly document_id: string;
}

// Exports
export interface ExportCreateData {
  readonly type: 'documents' | 'jobs';
  readonly format: 'csv' | 'json';
  readonly filters?: {
    readonly start_date?: string;
    readonly end_date?: string;
    readonly status?: string;
    readonly document_type?: string;
    readonly project_id?: string;
  };
}

export interface Export {
  readonly id: string;
  readonly type: 'documents' | 'jobs';
  readonly format: 'csv' | 'json';
  readonly filters: Record<string, unknown>;
  readonly status: 'pending' | 'processing' | 'completed' | 'failed';
  readonly download_url: string | null;
  readonly file_size: number | null;
  readonly expires_at: string | null;
  readonly error_message: string | null;
  readonly created_at: string;
  readonly updated_at: string;
  readonly completed_at: string | null;
}

export interface ExportQueryParams {
  readonly page?: number;
  readonly limit?: number;
  readonly status?: Export['status'];
}

export interface ExportResponse {
  readonly data: readonly Export[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly total_pages: number;
}

// Analytics
export interface TrendDataPoint {
  readonly date: string;
  readonly documents_processed: number;
  readonly jobs_completed: number;
  readonly average_processing_time: number;
}

export interface AnalyticsQueryParams {
  readonly timeframe?: 'day' | 'week' | 'month' | 'year';
  readonly start_date?: string;
  readonly end_date?: string;
  readonly document_type?: string;
}

export interface AnalyticsTrendsResponse {
  readonly data: readonly TrendDataPoint[];
  readonly timeframe: 'day' | 'week' | 'month' | 'year';
  readonly date_range: {
    readonly start_date?: string;
    readonly end_date?: string;
  };
}

export interface AccuracyBreakdown {
  readonly document_type: string;
  readonly total_processed: number;
  readonly average_accuracy: number;
  readonly success_rate: number;
}

export interface AnalyticsAccuracyResponse {
  readonly data: readonly AccuracyBreakdown[];
  readonly timeframe: 'day' | 'week' | 'month' | 'year';
  readonly date_range: {
    readonly start_date?: string;
    readonly end_date?: string;
  };
  readonly filters: {
    readonly document_type?: string;
  };
}

export interface ErrorRateStats {
  readonly error_type: string;
  readonly count: number;
  readonly percentage: number;
  readonly recent_trend: 'increasing' | 'decreasing' | 'stable';
}

export interface AnalyticsErrorRatesResponse {
  readonly data: readonly ErrorRateStats[];
  readonly timeframe: 'day' | 'week' | 'month' | 'year';
  readonly date_range: {
    readonly start_date?: string;
    readonly end_date?: string;
  };
}

export interface AnalyticsOverviewResponse {
  readonly trends: {
    readonly data: readonly TrendDataPoint[];
    readonly summary: {
      readonly total_data_points: number;
      readonly latest_processing_time: number;
      readonly trend_direction: 'increasing' | 'decreasing' | 'stable';
    };
  };
  readonly accuracy: {
    readonly data: readonly AccuracyBreakdown[];
    readonly summary: {
      readonly total_document_types: number;
      readonly overall_average_accuracy: number;
      readonly best_performing_type: string | null;
    };
  };
  readonly errors: {
    readonly data: readonly ErrorRateStats[];
    readonly summary: {
      readonly total_error_types: number;
      readonly total_errors: number;
      readonly most_common_error: string | null;
    };
  };
  readonly metadata: {
    readonly timeframe: 'day' | 'week' | 'month' | 'year';
    readonly date_range: {
      readonly start_date?: string;
      readonly end_date?: string;
    };
    readonly generated_at: string;
  };
}