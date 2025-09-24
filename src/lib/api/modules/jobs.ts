/**
 * Jobs API Module
 * Comprehensive job management with all workflow operations
 * Fully aligned with backend handoff specification
 */

import type { 
  Job, 
  JobCreateData, 
  JobUpdateData, 
  JobQueryParams, 
  PaginatedResponse 
} from '@/types/api-types';

import { apiClient } from '../client';

/**
 * Job management endpoints
 * All endpoints follow backend specification exactly
 */
export const jobsApi = {
  /**
   * Create a new document processing job
   */
  async createJob(data: JobCreateData): Promise<Job> {
    return apiClient.post<Job>('/v1/jobs', data);
  },

  /**
   * List user jobs with comprehensive filtering and pagination
   */
  async listJobs(params?: JobQueryParams): Promise<PaginatedResponse<Job>> {
    return apiClient.get<PaginatedResponse<Job>>('/v1/jobs', params);
  },

  /**
   * Get detailed job information by ID
   */
  async getJob(jobId: string): Promise<Job> {
    return apiClient.get<Job>(`/v1/jobs/${jobId}`);
  },

  /**
   * Update job properties and metadata
   */
  async updateJob(jobId: string, data: JobUpdateData): Promise<Job> {
    return apiClient.put<Job>(`/v1/jobs/${jobId}`, data);
  },

  /**
   * Delete a job permanently
   */
  async deleteJob(jobId: string): Promise<void> {
    return apiClient.delete<void>(`/v1/jobs/${jobId}`, {
      retryable: false,
    });
  },

  /**
   * Start a pending job (changes status to processing)
   */
  async startJob(jobId: string): Promise<Job> {
    return apiClient.post<Job>(`/v1/jobs/${jobId}/start`, {});
  },

  /**
   * Cancel a running or pending job
   */
  async cancelJob(jobId: string): Promise<Job> {
    return apiClient.post<Job>(`/v1/jobs/${jobId}/cancel`, {}, {
      retryable: false,
    });
  },

  /**
   * Retry a failed job (resets to pending status)
   */
  async retryJob(jobId: string): Promise<Job> {
    return apiClient.post<Job>(`/v1/jobs/${jobId}/retry`, {});
  },

  /**
   * Submit parse job for document (convenience method)
   */
  async submitParseJob(documentId: string, projectId?: string, options?: Record<string, unknown>): Promise<Job> {
    return this.createJob({
      type: 'parse_document',
      source: 'upload',
      document_id: documentId,
      project_id: projectId,
      options: options || {},
    });
  },
} as const;