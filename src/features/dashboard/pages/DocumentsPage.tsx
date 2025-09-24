/**
 * Documents Dashboard Page - Refactored
 * Simplified and optimized document management interface
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getErrorMessage } from '@/lib/api';
import { QueryErrorBoundary } from '@/shared/components/error';
import { TableSkeleton, ProgressiveLoading } from '@/shared/components/loading';
import { useToast } from '@/shared/components/ui/use-toast';
import {
  useDocuments,
  useUploadDocument,
  useIngestDocument,
  useUpdateDocument,
  useDeleteDocument,
  useDocumentDownload
} from '@/shared/hooks/api/useDocuments';
import { useSubmitParseJob } from '@/shared/hooks/api/useJobs';
import { useProjects } from '@/shared/hooks/api/useProjects';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type {
  Document,
  DocumentQueryParams,
  DocumentStatus,
  DocumentUpdateData
} from '@/types/api-types';

import {
  DocumentsHeader,
  DocumentsFilters,
  DocumentsTable,
} from '../components/documents';
import DashboardLayout from '../components/layout/DashboardLayout';

/**
 * Streamlined Documents dashboard page
 */
const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | 'all'>(
    (searchParams.get('status') as DocumentStatus) || 'all'
  );
  const [selectedMimeType, setSelectedMimeType] = useState(searchParams.get('mime_type') || 'all');
  const [selectedProject, setSelectedProject] = useState(searchParams.get('project_id') || 'all');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());

  // Debounced search
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Build query parameters
  const queryParams = useMemo((): DocumentQueryParams => {
    const params: DocumentQueryParams = {
      page: currentPage,
      limit: 20,
    };

    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedStatus !== 'all') params.status = selectedStatus;
    if (selectedMimeType !== 'all') params.mime_type = selectedMimeType;
    if (selectedProject !== 'all') params.project_id = selectedProject;

    return params;
  }, [currentPage, debouncedSearch, selectedStatus, selectedMimeType, selectedProject]);

  // API hooks
  const {
    data: documentsData,
    isLoading: documentsLoading,
    error: documentsError,
    refetch: refetchDocuments,
  } = useDocuments(queryParams);

  const { data: projectsData } = useProjects({ limit: 100 });
  const uploadDocument = useUploadDocument();
  const ingestDocument = useIngestDocument();
  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocument();
  const downloadDocument = useDocumentDownload();
  const submitParseJob = useSubmitParseJob();

  const documents = documentsData?.results || [];
  const totalDocuments = documentsData?.total || 0;
  const projects = projectsData?.results || [];

  // Update URL when filters change
  const updateSearchParams = useCallback((updates: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        newParams.set(key, value.toString());
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Filter handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateSearchParams({ search: value, page: 1 });
  }, [updateSearchParams]);

  const handleStatusChange = useCallback((status: DocumentStatus | 'all') => {
    setSelectedStatus(status);
    setCurrentPage(1);
    updateSearchParams({ status, page: 1 });
  }, [updateSearchParams]);

  const handleMimeTypeChange = useCallback((mimeType: string) => {
    setSelectedMimeType(mimeType);
    setCurrentPage(1);
    updateSearchParams({ mime_type: mimeType, page: 1 });
  }, [updateSearchParams]);

  const handleProjectChange = useCallback((projectId: string) => {
    setSelectedProject(projectId);
    setCurrentPage(1);
    updateSearchParams({ project_id: projectId, page: 1 });
  }, [updateSearchParams]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedMimeType('all');
    setSelectedProject('all');
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  // Document selection
  const handleSelectDocument = useCallback((documentId: string) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(documentId)) {
        newSet.delete(documentId);
      } else {
        newSet.add(documentId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedDocuments.size === documents.length && documents.length > 0) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(documents.map(doc => doc.id)));
    }
  }, [documents, selectedDocuments.size]);

  // Document actions
  const handleView = useCallback((document: Document) => {
    navigate(`/dashboard/documents/${document.id}`);
  }, [navigate]);

  const handleEdit = useCallback((document: Document) => {
    // Implementation for edit modal/page
    toast({
      title: 'Edit Document',
      description: 'Edit functionality will be implemented here',
    });
  }, [toast]);

  const handleDelete = useCallback(async (document: Document) => {
    if (!confirm(`Are you sure you want to delete "${document.name}"?`)) return;

    try {
      await deleteDocument.mutateAsync(document.id);
      toast({
        title: 'Document deleted',
        description: `"${document.name}" has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Failed to delete document',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [deleteDocument, toast]);

  const handleDownload = useCallback(async (document: Document) => {
    try {
      await downloadDocument.mutateAsync(document.id);
    } catch (error) {
      toast({
        title: 'Download failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [downloadDocument, toast]);

  const handleUpload = useCallback(() => {
    // Implementation for upload modal
    toast({
      title: 'Upload Document',
      description: 'Upload functionality will be implemented here',
    });
  }, [toast]);

  const handleIngest = useCallback(() => {
    // Implementation for ingest modal
    toast({
      title: 'Ingest URL',
      description: 'URL ingest functionality will be implemented here',
    });
  }, [toast]);

  const handleRefresh = useCallback(() => {
    refetchDocuments();
  }, [refetchDocuments]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <QueryErrorBoundary>
          <DocumentsHeader
            totalDocuments={totalDocuments}
            isLoading={documentsLoading}
            onUpload={handleUpload}
            onIngest={handleIngest}
            onRefresh={handleRefresh}
          />
        </QueryErrorBoundary>

        <QueryErrorBoundary>
          <DocumentsFilters
            searchTerm={searchTerm}
            selectedStatus={selectedStatus}
            selectedMimeType={selectedMimeType}
            selectedProject={selectedProject}
            showFilters={showFilters}
            projects={projects}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onMimeTypeChange={handleMimeTypeChange}
            onProjectChange={handleProjectChange}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onClearFilters={handleClearFilters}
          />
        </QueryErrorBoundary>

        <QueryErrorBoundary>
          <ProgressiveLoading
            isLoading={documentsLoading}
            error={documentsError}
            isEmpty={!documents?.length}
            loadingComponent={<TableSkeleton rows={10} cols={6} />}
            emptyComponent={
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600 mb-4">
                  {Object.keys(queryParams).length > 1
                    ? 'Try adjusting your filters or search terms.'
                    : 'Get started by uploading your first document.'}
                </p>
              </div>
            }
          >
            <DocumentsTable
              documents={documents}
              selectedDocuments={selectedDocuments}
              isLoading={documentsLoading}
              onSelectDocument={handleSelectDocument}
              onSelectAll={handleSelectAll}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          </ProgressiveLoading>
        </QueryErrorBoundary>
      </div>
    </DashboardLayout>
  );
};

export default React.memo(DocumentsPage);