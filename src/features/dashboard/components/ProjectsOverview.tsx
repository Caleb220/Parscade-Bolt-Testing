/**
 * Projects Overview Component
 * Project management interface with real backend integration
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FolderPlus, 
  Folder, 
  FileText, 
  Calendar,
  MoreVertical,
  Edit3,
  Trash2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Eye
} from 'lucide-react';

import { ParscadeCard, ParscadeButton } from '@/shared/components/brand';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import ConfirmationDialog from '@/shared/components/ui/confirmation-dialog';
import { useToast } from '@/shared/components/ui/use-toast';
import { 
  useProjects, 
  useCreateProject, 
  useUpdateProject, 
  useDeleteProject 
} from '@/shared/hooks/api/useProjects';
import { formatDate } from '@/shared/utils/date';
import type { ProjectCreateData, ProjectUpdateData } from '@/types/dashboard-types';

interface ProjectsOverviewProps {
  className?: string;
}

/**
 * Projects management interface with CRUD operations
 */
const ProjectsOverview: React.FC<ProjectsOverviewProps> = ({ className = '' }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: projectsData, isLoading, error, refetch } = useProjects({ page: 1, limit: 10 });
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectCreateData>({ name: '', description: '' });

  const projects = projectsData?.data || [];

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Project name is required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createProject.mutateAsync(formData);
      setFormData({ name: '', description: '' });
      setShowCreateDialog(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleUpdate = async (projectId: string) => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Project name is required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateProject.mutateAsync({ 
        projectId, 
        data: { 
          name: formData.name, 
          description: formData.description || undefined 
        } 
      });
      setFormData({ name: '', description: '' });
      setEditingProject(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      await deleteProject.mutateAsync(projectId);
      setConfirmDelete(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const startEdit = (project: any) => {
    setFormData({ name: project.name, description: project.description || '' });
    setEditingProject(project.id);
  };

  if (isLoading) {
    return (
      <ParscadeCard variant="default" className={`p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </ParscadeCard>
    );
  }

  if (error) {
    return (
      <ParscadeCard variant="default" className={`p-6 ${className}`}>
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load projects</h3>
          <p className="text-gray-600 mb-4">Unable to fetch project data</p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </ParscadeCard>
    );
  }

  return (
    <ParscadeCard variant="default" className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Folder className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
            <p className="text-sm text-blue-600">Organize your document processing workflows</p>
          </div>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <ParscadeButton variant="primary" size="sm">
              <FolderPlus className="w-4 h-4 mr-2" />
              New Project
            </ParscadeButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Create a new project to organize your documents and processing workflows.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project_name">Project Name</Label>
                <Input
                  id="project_name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project_description">Description (Optional)</Label>
                <textarea
                  id="project_description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project..."
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    setFormData({ name: '', description: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={createProject.isPending || !formData.name.trim()}
                >
                  {createProject.isPending ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-parscade"
          >
            <Folder className="w-6 h-6 text-blue-500" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-slate-600 mb-4">
            Create your first project to organize your document processing workflows.
          </p>
          <ParscadeButton 
            variant="primary" 
            size="sm"
            onClick={() => setShowCreateDialog(true)}
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Create First Project
          </ParscadeButton>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 border border-slate-200 rounded-lg hover:bg-blue-50/30 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Folder className="w-5 h-5 text-blue-600" />
                    <h4 
                      className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors cursor-pointer"
                      onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                    >
                      {project.name}
                    </h4>
                  </div>
                  {project.description && (
                    <p className="text-sm text-slate-600 mb-2">{project.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{project.document_count} documents</span>
                    <span>{project.job_count} jobs</span>
                    <span>Created {formatDate(project.created_at)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(project)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDelete(project.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update your project details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_project_name">Project Name</Label>
              <Input
                id="edit_project_name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_project_description">Description (Optional)</Label>
              <textarea
                id="edit_project_description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your project..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingProject(null);
                  setFormData({ name: '', description: '' });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => editingProject && handleUpdate(editingProject)}
                disabled={updateProject.isPending || !formData.name.trim()}
              >
                {updateProject.isPending ? 'Updating...' : 'Update Project'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        title="Delete Project"
        description="Are you sure you want to delete this project? Documents will not be deleted, but they will be removed from this project."
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteProject.isPending}
      />
    </ParscadeCard>
  );
};

export default ProjectsOverview;