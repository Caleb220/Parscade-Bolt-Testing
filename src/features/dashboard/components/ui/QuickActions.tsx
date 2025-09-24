/**
 * Quick Actions Component
 * Common action buttons for dashboard
 */

import { motion } from 'framer-motion';
import { Plus, Upload, Download, Settings, FolderPlus, Zap } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ParscadeButton } from '@/shared/components/brand';
import FeatureGate from '@/shared/components/layout/FeatureGate';
import { useCreateExport } from '@/shared/hooks/api/useExports';
import { useCreateProject } from '@/shared/hooks/api/useProjects';

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
  const navigate = useNavigate();
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
    <div className={`flex items-center space-x-1 sm:space-x-2 lg:space-x-3 ${className}`}>
      {onUpload && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ParscadeButton 
            variant="outline" 
            size="sm" 
            onClick={onUpload}
            className="hidden sm:flex"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </ParscadeButton>
          <ParscadeButton 
            variant="ghost" 
            size="sm" 
            onClick={onUpload}
            className="sm:hidden"
            aria-label="Upload"
          >
            <Upload className="w-4 h-4" />
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
          className="hidden sm:flex"
        >
          <FolderPlus className="w-4 h-4 mr-2" />
          {createProject.isPending ? 'Creating...' : 'New Project'}
        </ParscadeButton>
        <ParscadeButton 
          variant="primary"
          size="sm"
          onClick={handleNewProject}
          disabled={createProject.isPending}
          glow
          className="sm:hidden"
          aria-label="New Project"
        >
          <FolderPlus className="w-4 h-4" />
        </ParscadeButton>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <ParscadeButton 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/dashboard/jobs')}
          className="hidden lg:flex"
        >
          <Zap className="w-4 h-4 mr-2" />
          View All Jobs
        </ParscadeButton>
        <ParscadeButton 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard/jobs')}
          className="lg:hidden"
          aria-label="View Jobs"
        >
          <Zap className="w-4 h-4" />
        </ParscadeButton>
      </motion.div>
      
      <FeatureGate requiredTier="standard" hideWhenLocked>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ParscadeButton
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={createExport.isPending}
            className="hidden lg:flex"
          >
            <Download className="w-4 h-4 mr-2" />
            {createExport.isPending ? 'Exporting...' : 'Export Data'}
          </ParscadeButton>
          <ParscadeButton
            variant="ghost"
            size="sm"
            onClick={handleExport}
            disabled={createExport.isPending}
            className="lg:hidden"
            aria-label="Export Data"
          >
            <Download className="w-4 h-4" />
          </ParscadeButton>
        </motion.div>
      </FeatureGate>
      
      {onSettings && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ParscadeButton 
            variant="ghost" 
            size="sm" 
            onClick={onSettings}
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </ParscadeButton>
        </motion.div>
      )}
    </div>
  );
};

export default QuickActions;