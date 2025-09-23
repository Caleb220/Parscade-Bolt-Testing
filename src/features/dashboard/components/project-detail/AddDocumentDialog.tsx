/**
 * Add Document Dialog Component
 * Modal for associating documents with a project
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, FileText } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Label } from '@/shared/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { formatDate, formatBytes } from '@/shared/utils/formatters';
import type { Document } from '@/types/api-types';

interface AddDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (documentIds: string[]) => void;
  availableDocuments: Document[];
  currentDocumentIds: string[];
  isLoading?: boolean;
}

const AddDocumentDialog: React.FC<AddDocumentDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  availableDocuments,
  currentDocumentIds,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<Set<string>>(new Set());

  // Filter out documents already in the project
  const selectableDocuments = useMemo(() => {
    return availableDocuments.filter(doc => !currentDocumentIds.includes(doc.id));
  }, [availableDocuments, currentDocumentIds]);

  // Filter documents based on search
  const filteredDocuments = useMemo(() => {
    if (!searchTerm) return selectableDocuments;
    return selectableDocuments.filter(doc =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.mime_type && doc.mime_type.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [selectableDocuments, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Array.from(selectedDocumentIds));
    setSelectedDocumentIds(new Set());
    setSearchTerm('');
  };

  const handleClose = () => {
    onClose();
    setSelectedDocumentIds(new Set());
    setSearchTerm('');
  };

  const toggleDocument = (documentId: string) => {
    setSelectedDocumentIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(documentId)) {
        newSet.delete(documentId);
      } else {
        newSet.add(documentId);
      }
      return newSet;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add Documents to Project</DialogTitle>
          <DialogDescription>
            Select documents to associate with this project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Search */}
          <div>
            <Label htmlFor="document-search">Search Documents</Label>
            <Input
              id="document-search"
              placeholder="Search by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              fullWidth
            />
          </div>

          {/* Document List */}
          <div className="max-h-96 overflow-y-auto border rounded-lg">
            {filteredDocuments.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'No documents found matching your search' : 'No available documents to add'}
                </p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredDocuments.map((document) => (
                  <motion.div
                    key={document.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedDocumentIds.has(document.id)
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => toggleDocument(document.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedDocumentIds.has(document.id)}
                        onChange={() => toggleDocument(document.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />

                      <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 truncate">
                            {document.name}
                          </h4>
                          <Badge
                            variant={document.status === 'completed' ? 'success' : 'secondary'}
                            showIcon
                          >
                            {document.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span>{document.mime_type || 'Unknown type'}</span>
                          <span>•</span>
                          <span>{document.file_size ? formatBytes(document.file_size) : 'N/A'}</span>
                          <span>•</span>
                          <span>{formatDate(document.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Selection Summary */}
          {selectedDocumentIds.size > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                {selectedDocumentIds.size} document{selectedDocumentIds.size > 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              leftIcon={<Plus className="w-4 h-4" />}
              isLoading={isLoading}
              disabled={selectedDocumentIds.size === 0}
              glow
            >
              Add {selectedDocumentIds.size > 0 ? `${selectedDocumentIds.size} ` : ''}Document{selectedDocumentIds.size > 1 ? 's' : ''}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(AddDocumentDialog);