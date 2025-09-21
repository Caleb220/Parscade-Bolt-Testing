/**
 * Quick Actions Component
 * Common action buttons for dashboard
 */

import React from 'react';
import { Plus, Upload, Download, Settings } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onUpload}
            className="hover:shadow-sm transition-all duration-200 font-medium border-gray-300 hover:border-blue-300"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </motion.div>
      )}
      
      {onNewProject && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            size="sm" 
            onClick={onNewProject}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </motion.div>
      )}
      
      {onExport && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onExport}
            className="hover:shadow-sm transition-all duration-200 font-medium border-gray-300 hover:border-green-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </motion.div>
      )}
      
      {onSettings && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSettings}
            className="hover:bg-gray-100/80 transition-all duration-200"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      )}
      
      {onNewProject && (
        <Button size="sm" onClick={onNewProject}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      )}
      
      {onExport && (
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      )}
      
      {onSettings && (
        <Button variant="ghost" size="sm" onClick={onSettings}>
          <Settings className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default QuickActions;