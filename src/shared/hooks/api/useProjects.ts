/**
 * Projects API Hooks
 * Type-safe hooks for project management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getErrorMessage } from '@/lib/api';
import { projectsApi } from '@/lib/api/modules/projects';
import { useToast } from '@/shared/components/ui/use-toast';
import type { 
  ProjectCreateData, 
  ProjectUpdateData, 
  ProjectQueryParams,
  DocumentAssociationData 
} from '@/types/dashboard-types';

// Query keys
const QUERY_KEYS = {
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
};

/**
 * Projects list hook
 */
export const useProjects = (params?: ProjectQueryParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.projects, params],
    queryFn: () => projectsApi.listProjects(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * Single project hook
 */
export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.project(projectId),
    queryFn: () => projectsApi.getProject(projectId),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Create project mutation
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: ProjectCreateData) => projectsApi.createProject(data),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
      
      toast({
        title: 'Project created',
        description: `Project "${project.name}" has been created successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Creation failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

/**
 * Update project mutation
 */
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: ProjectUpdateData }) => 
      projectsApi.updateProject(projectId, data),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project(project.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
      
      toast({
        title: 'Project updated',
        description: `Project "${project.name}" has been updated successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Update failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

/**
 * Delete project mutation
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (projectId: string) => projectsApi.deleteProject(projectId),
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project(projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
      
      toast({
        title: 'Project deleted',
        description: 'The project has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Deletion failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

/**
 * Associate document with project mutation
 */
export const useAssociateDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: DocumentAssociationData }) => 
      projectsApi.associateDocument(projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project(projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
      
      toast({
        title: 'Document associated',
        description: 'The document has been added to the project.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Association failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

/**
 * Remove document from project mutation
 */
export const useRemoveDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (documentId: string) => projectsApi.removeDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
      
      toast({
        title: 'Document removed',
        description: 'The document has been removed from the project.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Removal failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};