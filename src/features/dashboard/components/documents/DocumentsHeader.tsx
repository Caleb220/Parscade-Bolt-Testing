/**
 * Documents Header Component
 * Header section with title, stats, and primary actions
 */

import { motion } from 'framer-motion';
import { FileText, Plus, Upload, Link as LinkIcon, RefreshCw } from 'lucide-react';
import React from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import Button from '@/shared/components/forms/atoms/Button';

interface DocumentsHeaderProps {
  totalDocuments: number;
  isLoading: boolean;
  onUpload: () => void;
  onIngest: () => void;
  onRefresh: () => void;
}

const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({
  totalDocuments,
  isLoading,
  onUpload,
  onIngest,
  onRefresh,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
          <p className="text-gray-600">Manage and process your documents with advanced AI tools</p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            leftIcon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
            onClick={onRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>

          <Button variant="outline" leftIcon={<LinkIcon className="w-4 h-4" />} onClick={onIngest}>
            Ingest URL
          </Button>

          <Button variant="primary" leftIcon={<Upload className="w-4 h-4" />} onClick={onUpload}>
            Upload Document
          </Button>
        </div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <ParscadeCard className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg mr-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : totalDocuments.toLocaleString()}
              </p>
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg mr-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Processed</p>
              <p className="text-2xl font-bold text-gray-900">...</p>
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg mr-4">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900">...</p>
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg mr-4">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">...</p>
            </div>
          </div>
        </ParscadeCard>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(DocumentsHeader);
