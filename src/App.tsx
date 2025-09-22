/**
 * Quick Actions Component
 * Common action buttons for dashboard
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Download, Settings, FolderPlus } from 'lucide-react';

import { ParscadeButton } from '@/shared/components/brand';
import { useCreateProject } from '@/shared/hooks/api/useProjects';
import { useCreateExport } from '@/shared/hooks/api/useExports';

interface QuickActionsProps {
  onUpload?: () => void;
  onSettings?: () => void;
  className?: string;
}

/**
 * Reusable quick actions component for dashboard pages
 */
const QuickActions: React.FC<QuickActionsProps> = ({
  onUpload,
  onSettings,
  className = '',
}) => {
  const createProject = useCreateProject();
  const createExport = useCreateExport();

  const handleNewProject = async () => {
    try {
      await createProject.mutateAsync({
        name: `Project ${new Date().toLocaleDateString()}`,
        description: 'New project created from dashboard',
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleExport = async () => {
    try {
      await createExport.mutateAsync({
        type: 'documents',
        format: 'csv',
        filters: {
          start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
        },
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {onUpload && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ParscadeButton 
            variant="outline" 
            size="sm" 
            onClick={onUpload}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </ParscadeButton>
        </motion.div>
      )}
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <ParscadeButton 
          variant="primary"
          size="sm"
          onClick={handleNewProject}
          disabled={createProject.isPending}
          glow
        >
          <FolderPlus className="w-4 h-4 mr-2" />
          {createProject.isPending ? 'Creating...' : 'New Project'}
        </ParscadeButton>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <ParscadeButton 
          variant="outline" 
          size="sm" 
          onClick={handleExport}
          disabled={createExport.isPending}
        >
          <Download className="w-4 h-4 mr-2" />
          {createExport.isPending ? 'Exporting...' : 'Export Data'}
        </ParscadeButton>
      </motion.div>
      
      {onSettings && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ParscadeButton 
            variant="ghost" 
            size="sm" 
            onClick={onSettings}
          >
            <Settings className="w-4 h-4" />
          </ParscadeButton>
        </motion.div>
      )}
    </div>
  );
};

export default QuickActions;