/**
 * Quick Actions Component
 * Common action buttons for dashboard
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Download, Settings } from 'lucide-react';

import { ParscadeButton } from '@/shared/components/brand';

interface QuickActionsProps {
  onUpload?: () => void;
  onNewProject?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  className?: string;
}

/**
 * Reusable quick actions component for dashboard pages
 */
const QuickActions: React.FC<QuickActionsProps> = ({
  onUpload,
  onNewProject,
  onExport,
  onSettings,
  className = '',
}) => {
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
      
      {onNewProject && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ParscadeButton 
            variant="primary"
            size="sm"
            onClick={onNewProject}
            glow
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </ParscadeButton>
        </motion.div>
      )}
      
      {onExport && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ParscadeButton 
            variant="outline" 
            size="sm" 
            onClick={onExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </ParscadeButton>
        </motion.div>
      )}
      
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