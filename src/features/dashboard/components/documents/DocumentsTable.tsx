/**
 * Documents Table Component
 * Main table displaying documents with actions and selection
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Eye, Edit3, Trash2, Download, MoreVertical,
  FileText, Image, FileSpreadsheet, Archive
} from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { ParscadeCard } from '@/shared/components/brand';
import { formatDate, formatBytes } from '@/shared/utils/formatters';
import type { Document } from '@/types/api-types';

interface DocumentsTableProps {
  documents: Document[];
  selectedDocuments: Set<string>;
  isLoading: boolean;
  onSelectDocument: (documentId: string) => void;
  onSelectAll: () => void;
  onView: (document: Document) => void;
  onEdit: (document: Document) => void;
  onDelete: (document: Document) => void;
  onDownload: (document: Document) => void;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return <Image className="w-4 h-4" />;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <FileSpreadsheet className="w-4 h-4" />;
  if (mimeType.includes('zip') || mimeType.includes('archive')) return <Archive className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
};

const DocumentsTable: React.FC<DocumentsTableProps> = ({
  documents,
  selectedDocuments,
  isLoading,
  onSelectDocument,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
  onDownload,
}) => {
  if (isLoading) {
    return (
      <ParscadeCard className="overflow-hidden">
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="w-20 h-6 bg-gray-200 rounded"></div>
              <div className="w-24 h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </ParscadeCard>
    );
  }

  if (documents.length === 0) {
    return (
      <ParscadeCard className="p-12 text-center">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </ParscadeCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <ParscadeCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-8 px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.size === documents.length && documents.length > 0}
                    onChange={onSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((document, index) => (
                <motion.tr
                  key={document.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.has(document.id)}
                      onChange={() => onSelectDocument(document.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3 text-gray-400">
                        {getFileIcon(document.mime_type || '')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 truncate max-w-xs">
                          {document.name}
                        </div>
                        {document.project && (
                          <div className="text-sm text-gray-500">
                            Project: {document.project.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={document.status}
                      showIcon
                      animated
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {document.file_size ? formatBytes(document.file_size) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(document.updated_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Eye className="w-4 h-4" />}
                        onClick={() => onView(document)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Edit3 className="w-4 h-4" />}
                        onClick={() => onEdit(document)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Download className="w-4 h-4" />}
                        onClick={() => onDownload(document)}
                      >
                        Download
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Trash2 className="w-4 h-4" />}
                        onClick={() => onDelete(document)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </ParscadeCard>
    </motion.div>
  );
};

export default React.memo(DocumentsTable);