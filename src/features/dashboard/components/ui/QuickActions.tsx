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
    <div className={`flex items-center space-x-2 ${className}`}>
      {onUpload && (
        <Button variant="outline" size="sm" onClick={onUpload}>
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