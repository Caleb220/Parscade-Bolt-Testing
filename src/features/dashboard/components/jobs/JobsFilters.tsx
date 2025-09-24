/**
 * Jobs Filters Component
 * Search and filter controls for jobs dashboard
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown } from 'lucide-react';
import React from 'react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { JobStatus } from '@/types/api-types';

interface JobsFiltersProps {
  searchTerm: string;
  selectedStatus: JobStatus | 'all';
  selectedType: string;
  selectedProject: string;
  showFilters: boolean;
  projects: Array<{ id: string; name: string }>;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: JobStatus | 'all') => void;
  onTypeChange: (type: string) => void;
  onProjectChange: (projectId: string) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'running', label: 'Running' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'parse', label: 'Parse' },
  { value: 'extract', label: 'Extract' },
  { value: 'analyze', label: 'Analyze' },
  { value: 'convert', label: 'Convert' },
];

const JobsFilters: React.FC<JobsFiltersProps> = ({
  searchTerm,
  selectedStatus,
  selectedType,
  selectedProject,
  showFilters,
  projects,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onProjectChange,
  onToggleFilters,
  onClearFilters,
}) => {
  const hasActiveFilters = selectedStatus !== 'all' ||
                          selectedType !== 'all' ||
                          selectedProject !== 'all' ||
                          searchTerm.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      {/* Search and Filter Toggle */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search jobs by name, document, or project..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            fullWidth
          />
        </div>

        <Button
          variant="outline"
          leftIcon={<Filter className="w-4 h-4" />}
          rightIcon={<ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />}
          onClick={onToggleFilters}
        >
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            size="sm"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => onStatusChange(e.target.value as JobStatus | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => onTypeChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project
                  </label>
                  <select
                    value={selectedProject}
                    onChange={(e) => onProjectChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Projects</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(JobsFilters);