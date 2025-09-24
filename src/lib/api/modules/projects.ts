/**
 * Projects API Module
 * Project management endpoints with type safety
 */

import type { 
  Project,
  ProjectWithStats,
  ProjectCreateData,
  ProjectUpdateData,
  ProjectQueryParams,
  ProjectResponse,
  DocumentAssociationData
} from '@/types/dashboard-types';

import { apiClient } from '../client';

/**
 * Project management endpoints
 * All endpoints follow OpenAPI schema with comprehensive error handling
 */
export const projectsApi = {
  /**
   * Create new project
   */
  async createProject(data: ProjectCreateData): Promise<Project> {
    return apiClient.post<Project>('/v1/projects', data);
  },

  /**
   * List user projects
   */
  async listProjects(params?: ProjectQueryParams): Promise<ProjectResponse> {
    try {
      return await apiClient.get<ProjectResponse>('/v1/projects', params);
    } catch (error) {
      console.warn('Projects endpoint not available:', error);
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        total_pages: 0,
      };
    }
  },

  /**
   * Get project by ID
   */
  async getProject(projectId: string): Promise<ProjectWithStats> {
    return apiClient.get<ProjectWithStats>(`/v1/projects/${projectId}`);
  },

  /**
   * Update project
   */
  async updateProject(projectId: string, data: ProjectUpdateData): Promise<Project> {
    return apiClient.patch<Project>(`/v1/projects/${projectId}`, data);
  },

  /**
   * Delete project
   */
  async deleteProject(projectId: string): Promise<void> {
    return apiClient.delete<void>(`/v1/projects/${projectId}`, {
      retryable: false,
    });
  },

  /**
   * Associate document with project
   */
  async associateDocument(projectId: string, data: DocumentAssociationData): Promise<void> {
    return apiClient.post<void>(`/v1/projects/${projectId}/documents`, data);
  },

  /**
   * Remove document from project
   */
  async removeDocument(documentId: string): Promise<void> {
    return apiClient.delete<void>(`/v1/projects/documents/${documentId}`, {
      retryable: false,
    });
  },
} as const;