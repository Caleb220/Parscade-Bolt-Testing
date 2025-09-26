/**
 * Project Detail Header Component
 * Navigation and primary actions for project detail page
 */

import { motion } from 'framer-motion';
import { ArrowLeft, Download, Edit3, Trash2 } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@/shared/components/forms/atoms/Button';
import type { Project } from '@/types/api-types';

interface ProjectDetailHeaderProps {
  project: Project;
  isLoading?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onExport: () => void;
}

const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({
  project,
  isLoading = false,
  onEdit,
  onDelete,
  onExport,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left side - Navigation and title */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>

          <div className="h-6 w-px bg-gray-300" />

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project?.name || 'Loading...'}</h1>
            <p className="text-gray-600 mt-1">Project Details & Management</p>
          </div>
        </div>

        {/* Right side - Actions */}
        {project && (
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={onExport}
              disabled={isLoading}
            >
              Export
            </Button>

            <Button
              variant="outline"
              leftIcon={<Edit3 className="w-4 h-4" />}
              onClick={onEdit}
              disabled={isLoading}
            >
              Edit
            </Button>

            <Button
              variant="outline"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={onDelete}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(ProjectDetailHeader);
