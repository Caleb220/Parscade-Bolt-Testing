/**
 * Document Metadata Card Component
 * Document metadata display
 */

import { Database, Copy, CheckCircle } from 'lucide-react';
import React from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import { Button } from '@/shared/components/ui/button';
import { useClipboard } from '@/shared/hooks/useClipboard';
import type { Document } from '@/types/api-types';

interface DocumentMetadataCardProps {
  document: Document;
}

const DocumentMetadataCard: React.FC<DocumentMetadataCardProps> = ({ document }) => {
  const { copyToClipboard, isCopied } = useClipboard();

  const hasMetadata = document.metadata && Object.keys(document.metadata).length > 0;

  const handleCopyMetadata = () => {
    if (document.metadata) {
      copyToClipboard(JSON.stringify(document.metadata, null, 2));
    }
  };

  return (
    <ParscadeCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Metadata</h3>
            <p className="text-sm text-gray-500">Additional information</p>
          </div>
        </div>

        {hasMetadata && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={isCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            onClick={handleCopyMetadata}
            className={isCopied ? 'text-green-600 border-green-200' : ''}
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </Button>
        )}
      </div>

      {hasMetadata ? (
        <div className="max-h-48 overflow-y-auto">
          <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
            {JSON.stringify(document.metadata, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="text-center py-6">
          <Database className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            No metadata available
          </p>
        </div>
      )}
    </ParscadeCard>
  );
};

export default React.memo(DocumentMetadataCard);