/**
 * Document Structured Data Card Component
 * Structured data display with copy functionality
 */

import { motion } from 'framer-motion';
import { Database, Copy, CheckCircle } from 'lucide-react';
import React from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import { Button } from '@/shared/components/ui/button';
import { useClipboard } from '@/shared/hooks/useClipboard';
import type { Document } from '@/types/api-types';

interface DocumentStructuredDataCardProps {
  document: Document;
}

const DocumentStructuredDataCard: React.FC<DocumentStructuredDataCardProps> = ({ document }) => {
  const { copyToClipboard, isCopied } = useClipboard();

  const hasStructuredData = document.structured_data &&
                           Object.keys(document.structured_data).length > 0;

  const handleCopyData = () => {
    if (document.structured_data) {
      copyToClipboard(JSON.stringify(document.structured_data, null, 2));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <ParscadeCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Structured Data
              </h2>
              <p className="text-sm text-gray-500">
                Extracted structured information and metadata
              </p>
            </div>
          </div>

          {hasStructuredData && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={isCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              onClick={handleCopyData}
              className={isCopied ? 'text-green-600 border-green-200' : ''}
            >
              {isCopied ? 'Copied!' : 'Copy JSON'}
            </Button>
          )}
        </div>

        {hasStructuredData ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              {Object.keys(document.structured_data).length} data fields extracted
            </div>

            <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg border">
              <pre className="text-sm text-gray-800 leading-relaxed">
                {JSON.stringify(document.structured_data, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No Structured Data
                </h3>
                <p className="text-gray-500">
                  No structured data has been extracted from this document yet.
                </p>
              </div>
            </div>
          </div>
        )}
      </ParscadeCard>
    </motion.div>
  );
};

export default React.memo(DocumentStructuredDataCard);