/**
 * Edit Project Dialog Component
 * Modal form for editing project details
 */

import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import Button from '@/shared/components/forms/atoms/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import type { Project } from '@/types/api-types';

interface EditProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: ProjectFormData) => void;
  project: Project;
  isLoading?: boolean;
}

interface ProjectFormData {
  name: string;
  description: string;
  url?: string;
}

const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    url: '',
  });

  // Update form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        url: project.url || '',
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    onClose();
    // Reset form to original values
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        url: project.url || '',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update the project details and settings.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="Enter project name"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              fullWidth
            />
          </div>

          <div>
            <Label htmlFor="project-description">Description</Label>
            <textarea
              id="project-description"
              placeholder="Enter project description"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="project-url">Project URL (Optional)</Label>
            <Input
              id="project-url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
              type="url"
              fullWidth
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              leftIcon={<Save className="w-4 h-4" />}
              isLoading={isLoading}
              glow
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(EditProjectDialog);
