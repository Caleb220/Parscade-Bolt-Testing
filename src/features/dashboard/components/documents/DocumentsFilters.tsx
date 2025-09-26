/**
 * Documents Filters Component
 * Search and filter controls for documents
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown } from 'lucide-react';
import React from 'react';

import Button from '@/shared/components/forms/atoms/Button';
import { Input } from '@/shared/components/ui/input';
import type { DocumentStatus } from '@/types/api-types';

interface DocumentsFiltersProps {
  searchTerm: string;
  selectedStatus: DocumentStatus | 'all';
  selectedMimeType: string;
  selectedProject: string;
  showFilters: boolean;
  projects: Array<{ id: string; name: string }>;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: DocumentStatus | 'all') => void;
  onMimeTypeChange: (mimeType: string) => void;
  onProjectChange: (projectId: string) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

const mimeTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'application/pdf', label: 'PDF' },
  { value: 'text/plain', label: 'Text' },
  { value: 'application/msword', label: 'Word' },
  { value: 'image/', label: 'Images' },
];

const DocumentsFilters: React.FC<DocumentsFiltersProps> = ({
  searchTerm,
  selectedStatus,
  selectedMimeType,
  selectedProject,
  showFilters,
  projects,
  onSearchChange,
  onStatusChange,
  onMimeTypeChange,
  onProjectChange,
  onToggleFilters,
  onClearFilters,
}) => {
  const hasActiveFilters =
    selectedStatus !== 'all' ||
    selectedMimeType !== 'all' ||
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
            placeholder="Search documents by name, content, or metadata..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            fullWidth
          />
        </div>

        <Button
          variant="outline"
          leftIcon={<Filter className="w-4 h-4" />}
          rightIcon={
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          }
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
          <Button variant="ghost" onClick={onClearFilters} size="sm">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={e => onStatusChange(e.target.value as DocumentStatus | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* MIME Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                  <select
                    value={selectedMimeType}
                    onChange={e => onMimeTypeChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {mimeTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <select
                    value={selectedProject}
                    onChange={e => onProjectChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Projects</option>
                    {projects.map(project => (
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

export default React.memo(DocumentsFilters);
