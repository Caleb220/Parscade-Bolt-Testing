/**
 * Jobs API Module
 * Fully aligned with OpenAPI schema definitions
 */

import { apiClient } from '../client';
import type { paths, Job } from '@/types/api-types';

// Extract exact types from OpenAPI paths
type GetJobsParams = paths['/v1/jobs']['get']['parameters']['query'];
type GetJobsResponse = paths['/v1/jobs']['get']['responses']['200']['content']['application/json'];

type CreateJobRequest = paths['/v1/jobs']['post']['requestBody']['content']['application/json'];
type CreateJobResponse = paths['/v1/jobs']['post']['responses']['201']['content']['application/json'];

type GetJobResponse = paths['/v1/jobs/{jobId}']['get']['responses']['200']['content']['application/json'];
type CancelJobResponse = paths['/v1/jobs/{jobId}']['delete']['responses']['200']['content']['application/json'];

/**
 * Job management endpoints
 * All endpoints follow OpenAPI schema exactly
 */
export const jobsApi = {
  /**
   * List user jobs with pagination and filtering
   */
  async listJobs(params?: GetJobsParams): Promise<GetJobsResponse> {
    return apiClient.get<GetJobsResponse>('/v1/jobs', params);
  },

  /**
   * Create new document processing job
   */
  async createJob(request: CreateJobRequest): Promise<Job> {
    return apiClient.post<CreateJobResponse>('/v1/jobs', request);
  },

  /**
   * Get job details and status
   */
  async getJob(jobId: string): Promise<Job> {
    return apiClient.get<GetJobResponse>(`/v1/jobs/${jobId}`);
  },

  /**
   * Cancel pending or running job
   */
  async cancelJob(jobId: string): Promise<Job> {
    return apiClient.delete<CancelJobResponse>(`/v1/jobs/${jobId}`, {
      retryable: false,
    });
  },

  /**
   * Submit parse job for document (convenience method)
   */
  async submitParseJob(documentId: string, options?: Record<string, unknown>): Promise<Job> {
    return this.createJob({
      type: 'parse_document',
      source: 'upload',
      documentId,
      options: options || {},
    });
  },
} as const;