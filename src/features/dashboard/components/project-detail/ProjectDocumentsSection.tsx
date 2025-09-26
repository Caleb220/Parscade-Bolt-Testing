/**
 * Project Documents Section Component
 * Document management and display for a project
 */

import { motion } from 'framer-motion';
import { Plus, Search, FileText, Eye, Trash2 } from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import Button from '@/shared/components/forms/atoms/Button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { formatDate, formatBytes } from '@/shared/utils/formatters';
import type { Document } from '@/types/api-types';

interface ProjectDocumentsSectionProps {
  documents: Document[];
  isLoading?: boolean;
  onAddDocument: () => void;
  onViewDocument: (document: Document) => void;
  onRemoveDocument: (document: Document) => void;
}

interface DocumentCardProps {
  document: Document;
  onView: () => void;
  onRemove: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = React.memo(({ document, onView, onRemove }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    whileHover={{ y: -2 }}
  >
    <ParscadeCard className="p-6 h-full hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{document.name}</h3>
            <p className="text-sm text-gray-500">{document.mime_type || 'Unknown type'}</p>
          </div>
        </div>

        <Badge variant={document.status === 'completed' ? 'success' : 'secondary'} showIcon>
          {document.status}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Size</span>
          <span className="text-gray-900">
            {document.file_size ? formatBytes(document.file_size) : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Added</span>
          <span className="text-gray-900">{formatDate(document.created_at)}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Eye className="w-4 h-4" />}
          onClick={onView}
          fullWidth
        >
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Trash2 className="w-4 h-4" />}
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
        >
          Remove
        </Button>
      </div>
    </ParscadeCard>
  </motion.div>
));

DocumentCard.displayName = 'DocumentCard';

const ProjectDocumentsSection: React.FC<ProjectDocumentsSectionProps> = ({
  documents,
  isLoading = false,
  onAddDocument,
  onViewDocument,
  onRemoveDocument,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = useMemo(() => {
    if (!searchTerm) return documents;
    return documents.filter(
      doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.mime_type && doc.mime_type.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [documents, searchTerm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="space-y-6"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Project Documents</h2>
          <p className="text-gray-600 mt-1">Manage documents associated with this project</p>
        </div>

        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onAddDocument}
          disabled={isLoading}
        >
          Add Document
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          fullWidth
        />
      </div>

      {/* Documents Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ParscadeCard key={i} className="p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </ParscadeCard>
          ))}
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <DocumentCard
                document={document}
                onView={() => onViewDocument(document)}
                onRemove={() => onRemoveDocument(document)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <ParscadeCard className="p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No documents found' : 'No documents yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first document to this project'}
          </p>
          {!searchTerm && (
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={onAddDocument}>
              Add First Document
            </Button>
          )}
        </ParscadeCard>
      )}
    </motion.div>
  );
};

export default React.memo(ProjectDocumentsSection);
