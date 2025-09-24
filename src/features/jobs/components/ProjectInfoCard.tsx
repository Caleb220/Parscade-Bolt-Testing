/**
 * Project Info Card Component
 * Project information display (reusable)
 */

import { Folder, ExternalLink, Eye } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ParscadeCard } from '@/shared/components/brand';
import { Button } from '@/shared/components/ui/button';
import { formatDate } from '@/shared/utils/formatters';
import type { Project } from '@/types/api-types';

interface ProjectInfoCardProps {
  project: Project;
}

const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({ project }) => {
  const navigate = useNavigate();

  return (
    <ParscadeCard className="p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
          <Folder className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Project</h3>
          <p className="text-sm text-gray-500">Associated project</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-1">
            {project.name}
          </h4>
          {project.description && (
            <p className="text-sm text-gray-600">
              {project.description}
            </p>
          )}
        </div>

        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDate(project.created_at)}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Project ID</dt>
            <dd className="mt-1 text-xs font-mono text-gray-900 break-all">
              {project.id}
            </dd>
          </div>
        </dl>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Eye className="w-4 h-4" />}
            onClick={() => navigate(`/dashboard/projects/${project.id}`)}
            fullWidth
          >
            View Project
          </Button>

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </a>
          )}
        </div>
      </div>
    </ParscadeCard>
  );
};

export default React.memo(ProjectInfoCard);