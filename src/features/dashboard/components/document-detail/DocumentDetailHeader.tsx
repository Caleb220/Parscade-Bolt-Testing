/**
 * Document Detail Header Component
 * Navigation and primary actions for document detail page
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Zap,
  FileText,
  Image,
  FileSpreadsheet,
  Archive,
  Globe
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { Document } from '@/types/api-types';

interface DocumentDetailHeaderProps {
  document: Document;
  onBack: () => void;
  onDownload: () => void;
  onProcess: () => void;
  isLoading?: boolean;
}

const getMimeTypeIcon = (mimeType: string | null) => {
  if (!mimeType) return FileText;

  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return FileSpreadsheet;
  if (mimeType.includes('zip') || mimeType.includes('archive')) return Archive;
  if (mimeType.includes('html')) return Globe;
  return FileText;
};

const getMimeTypeColor = (mimeType: string | null) => {
  if (!mimeType) return 'from-gray-500 to-gray-600';

  if (mimeType.startsWith('image/')) return 'from-purple-500 to-purple-600';
  if (mimeType.includes('pdf')) return 'from-red-500 to-red-600';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'from-green-500 to-green-600';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return 'from-orange-500 to-orange-600';
  if (mimeType.includes('html')) return 'from-blue-500 to-blue-600';
  return 'from-gray-500 to-gray-600';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'success';
    case 'failed': return 'destructive';
    case 'processing': return 'default';
    case 'pending': return 'secondary';
    default: return 'secondary';
  }
};

const DocumentDetailHeader: React.FC<DocumentDetailHeaderProps> = ({
  document,
  onBack,
  onDownload,
  onProcess,
  isLoading = false,
}) => {
  const IconComponent = getMimeTypeIcon(document.mime_type);
  const colorClass = getMimeTypeColor(document.mime_type);

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
            onClick={onBack}
          >
            Back to Documents
          </Button>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center space-x-4">
            {/* Document Icon */}
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>

            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {document.name}
                </h1>
                <Badge
                  variant={getStatusColor(document.status)}
                  showIcon
                  animated={document.status === 'processing'}
                >
                  {document.status}
                </Badge>
              </div>
              <div className="text-gray-600 mt-1 space-y-1">
                <p>Document Details & Processing</p>
                {document.original_name && document.original_name !== document.name && (
                  <p className="text-sm">Original: {document.original_name}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={onDownload}
            disabled={isLoading}
          >
            Download
          </Button>

          <Button
            leftIcon={<Zap className="w-4 h-4" />}
            onClick={onProcess}
            disabled={isLoading || document.status === 'processing'}
            glow
          >
            Process
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(DocumentDetailHeader);