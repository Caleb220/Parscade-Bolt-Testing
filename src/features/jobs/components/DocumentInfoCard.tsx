/**
 * Document Info Card Component
 * Document information display (reusable)
 */

import { FileText, Eye, Download } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ParscadeCard } from '@/shared/components/brand';
import Button from '@/shared/components/forms/atoms/Button';
import { Badge } from '@/shared/components/ui/badge';
import { formatDate, formatBytes } from '@/shared/utils/formatters';
import type { Document } from '@/types/api-types';

interface DocumentInfoCardProps {
  document: Document;
  onDownload?: () => void;
}

const DocumentInfoCard: React.FC<DocumentInfoCardProps> = ({ document, onDownload }) => {
  const navigate = useNavigate();

  return (
    <ParscadeCard className="p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Document</h3>
          <p className="text-sm text-gray-500">Source document</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-1">{document.name}</h4>
          <div className="flex items-center space-x-2">
            <Badge variant={document.status === 'completed' ? 'success' : 'secondary'} showIcon>
              {document.status}
            </Badge>
            <span className="text-sm text-gray-500">{document.mime_type || 'Unknown type'}</span>
          </div>
        </div>

        <dl className="space-y-3">
          {document.file_size && (
            <div>
              <dt className="text-sm font-medium text-gray-500">File Size</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatBytes(document.file_size)}</dd>
            </div>
          )}

          <div>
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(document.created_at)}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Document ID</dt>
            <dd className="mt-1 text-xs font-mono text-gray-900 break-all">{document.id}</dd>
          </div>
        </dl>

        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Eye className="w-4 h-4" />}
            onClick={() => navigate(`/dashboard/documents/${document.id}`)}
            fullWidth
          >
            View Document
          </Button>

          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={onDownload}
              fullWidth
            >
              Download Original
            </Button>
          )}
        </div>
      </div>
    </ParscadeCard>
  );
};

export default React.memo(DocumentInfoCard);
