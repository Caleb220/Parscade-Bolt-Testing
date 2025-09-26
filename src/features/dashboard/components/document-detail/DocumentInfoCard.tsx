/**
 * Document Info Card Component
 * Basic document information display
 */

import { FileText, Calendar, User, HardDrive, Database } from 'lucide-react';
import React from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import { formatDate, formatBytes } from '@/shared/utils/formatters';
import type { Document } from '@/types/api-types';

interface DocumentInfoCardProps {
  document: Document;
}

const DocumentInfoCard: React.FC<DocumentInfoCardProps> = ({ document }) => {
  return (
    <ParscadeCard className="p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Document Information</h3>
          <p className="text-sm text-gray-500">Core document details</p>
        </div>
      </div>

      <dl className="space-y-4">
        <div>
          <dt className="flex items-center text-sm font-medium text-gray-500">
            <FileText className="w-4 h-4 mr-2" />
            MIME Type
          </dt>
          <dd className="mt-1 text-sm text-gray-900">{document.mime_type || 'Unknown'}</dd>
        </div>

        {document.file_size && (
          <div>
            <dt className="flex items-center text-sm font-medium text-gray-500">
              <HardDrive className="w-4 h-4 mr-2" />
              File Size
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{formatBytes(document.file_size)}</dd>
          </div>
        )}

        <div>
          <dt className="flex items-center text-sm font-medium text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            Created
          </dt>
          <dd className="mt-1 text-sm text-gray-900">{formatDate(document.created_at)}</dd>
        </div>

        <div>
          <dt className="flex items-center text-sm font-medium text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            Last Updated
          </dt>
          <dd className="mt-1 text-sm text-gray-900">{formatDate(document.updated_at)}</dd>
        </div>

        {document.storage_key && (
          <div>
            <dt className="flex items-center text-sm font-medium text-gray-500">
              <Database className="w-4 h-4 mr-2" />
              Storage Key
            </dt>
            <dd className="mt-1 text-xs font-mono text-gray-900 break-all">
              {document.storage_key}
            </dd>
          </div>
        )}

        <div>
          <dt className="flex items-center text-sm font-medium text-gray-500">
            <User className="w-4 h-4 mr-2" />
            Document ID
          </dt>
          <dd className="mt-1 text-xs font-mono text-gray-900 break-all">{document.id}</dd>
        </div>
      </dl>
    </ParscadeCard>
  );
};

export default React.memo(DocumentInfoCard);
