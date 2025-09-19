/**
 * Jobs API Module
 * Auto-generated from OpenAPI spec
 */

import { apiClient } from '../client';
import type { paths } from '@/types/api-types';

type JobListParams = paths['/v1/jobs']['get']['parameters']['query'];
type JobList = paths['/v1/jobs']['get']['responses']['200']['content']['application/json'];
type CreateJobRequest = paths['/v1/jobs']['post']['requestBody']['content']['application/json'];
type Job = paths['/v1/jobs']['post']['responses']['201']['content']['application/json'];

/**
 * Job management endpoints for document processing
 */
export const jobsApi = {
  /**
   * List user jobs with pagination
   */
  async listJobs(params?: JobListParams): Promise<JobList> {
    return apiClient.get<JobList>('/v1/jobs', params);
  },

  /**
   * Create new document processing job
   */
  async createJob(request: CreateJobRequest): Promise<Job> {
    return apiClient.post<Job>('/v1/jobs', request);
  },

  /**
   * Get job details and status
   */
  async getJob(jobId: string): Promise<Job> {
    return apiClient.get<Job>(`/v1/jobs/${jobId}`);
  },

  /**
   * Cancel pending or running job
   */
  async cancelJob(jobId: string): Promise<Job> {
    return apiClient.delete<Job>(`/v1/jobs/${jobId}`, {
      retryable: false,
    });
  },

  /**
   * Submit parse job for document
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