/**
 * Project Overview Card Component
 * Main project information and metadata display
 */

import { motion } from 'framer-motion';
import { FolderOpen, Calendar, Clock, ExternalLink } from 'lucide-react';
import React from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import { Badge } from '@/shared/components/ui/badge';
import { formatDate } from '@/shared/utils/formatters';
import type { Project, Document, Job } from '@/types/api-types';

import ProjectStatsCards from './ProjectStatsCards';

interface ProjectOverviewCardProps {
  project: Project;
  documents: Document[];
  jobs: Job[];
  isLoading?: boolean;
}

const ProjectOverviewCard: React.FC<ProjectOverviewCardProps> = ({
  project,
  documents,
  jobs,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <ParscadeCard key={i} className="p-6 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </ParscadeCard>
          ))}
        </div>

        <ParscadeCard className="p-8 animate-pulse">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded mb-2 w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </ParscadeCard>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <ProjectStatsCards project={project} documents={documents} jobs={jobs} />

      {/* Project Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ParscadeCard className="p-8">
          <div className="flex items-start space-x-6">
            {/* Project Icon */}
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <FolderOpen className="w-8 h-8 text-white" />
            </div>

            {/* Project Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h2>
                  {project.description && (
                    <p className="text-gray-600 leading-relaxed">{project.description}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Active Project</Badge>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Project Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Created</div>
                    <div className="font-medium text-gray-900">
                      {formatDate(project.created_at)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Last Updated</div>
                    <div className="font-medium text-gray-900">
                      {formatDate(project.updated_at)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                    <FolderOpen className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Project ID</div>
                    <div className="font-medium text-gray-900 font-mono text-sm">
                      {project.id.slice(0, 8)}...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ParscadeCard>
      </motion.div>
    </div>
  );
};

export default React.memo(ProjectOverviewCard);
