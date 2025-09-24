/**
 * Document Content Card Component
 * Text extraction and preview functionality
 */

import { motion } from 'framer-motion';
import { FileText, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import React from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import { Button } from '@/shared/components/ui/button';
import { useClipboard } from '@/shared/hooks/useClipboard';
import type { Document } from '@/types/api-types';

interface DocumentContentCardProps {
  document: Document;
}

const DocumentContentCard: React.FC<DocumentContentCardProps> = ({ document }) => {
  const { copyToClipboard, isCopied } = useClipboard();

  const hasExtractedText = document.extracted_text && document.extracted_text.trim().length > 0;

  const handleCopyText = () => {
    if (document.extracted_text) {
      copyToClipboard(document.extracted_text);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <ParscadeCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Document Content
              </h2>
              <p className="text-sm text-gray-500">
                Extracted text content from the document
              </p>
            </div>
          </div>

          {hasExtractedText && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={isCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              onClick={handleCopyText}
              className={isCopied ? 'text-green-600 border-green-200' : ''}
            >
              {isCopied ? 'Copied!' : 'Copy Text'}
            </Button>
          )}
        </div>

        {hasExtractedText ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              {document.extracted_text.length.toLocaleString()} characters extracted
            </div>

            <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg border">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                {document.extracted_text}
              </pre>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            {document.status === 'processing' ? (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    Processing Document
                  </h3>
                  <p className="text-gray-500">
                    Text extraction is in progress. Check back soon.
                  </p>
                </div>
              </div>
            ) : document.status === 'failed' ? (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    Processing Failed
                  </h3>
                  <p className="text-gray-500">
                    There was an error extracting text from this document.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No Text Content
                  </h3>
                  <p className="text-gray-500">
                    This document hasn't been processed for text extraction yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </ParscadeCard>
    </motion.div>
  );
};

export default React.memo(DocumentContentCard);