/**
 * Document Detail Page - Refactored
 * Simplified and optimized document management interface
 */

import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/shared/components/ui/use-toast';
import Layout from '@/shared/components/layout/templates/Layout';
import LoadingSpinner from '@/shared/components/forms/atoms/LoadingSpinner';
import {
  DocumentDetailHeader,
  DocumentContentCard,
  DocumentStructuredDataCard,
  DocumentJobsCard,
  DocumentInfoSidebar,
} from '../components/document-detail';
import {
  useDocument,
  useUpdateDocument,
  useDeleteDocument,
  useDocumentDownload,
} from '@/shared/hooks/api/useDocuments';
import { useProject } from '@/shared/hooks/api/useProjects';
import { useJobs } from '@/shared/hooks/api/useJobs';
import { getErrorMessage } from '@/lib/api';

/**
 * Streamlined Document Detail page
 */
const DocumentDetailPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Dialog states
  const [showEditDialog, setShowEditDialog] = useState(false);

  // API hooks
  const {
    data: document,
    isLoading: documentLoading,
    error: documentError,
    refetch: refetchDocument,
  } = useDocument(documentId!);

  const { data: project } = useProject(document?.project_id!, {
    enabled: !!document?.project_id,
  });

  const { data: jobsData } = useJobs({
    document_id: documentId,
    limit: 50,
  });

  // Mutations
  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocument();
  const downloadDocument = useDocumentDownload();

  const jobs = jobsData?.results || [];

  // Action handlers
  const handleDownload = useCallback(async () => {
    if (!document) return;

    try {
      await downloadDocument.mutateAsync(document.id);
      toast({
        title: 'Download started',
        description: 'Document download has been initiated.',
      });
    } catch (error) {
      toast({
        title: 'Failed to download document',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [document, downloadDocument, toast]);

  const handleProcess = useCallback(async () => {
    if (!document) return;

    toast({
      title: 'Feature coming soon',
      description: 'Document processing will be available soon.',
    });
  }, [document, toast]);

  const handleEdit = useCallback(() => {
    setShowEditDialog(true);
  }, []);

  const handleEditSubmit = useCallback(async (documentData: any) => {
    if (!document) return;

    try {
      await updateDocument.mutateAsync({ id: document.id, ...documentData });
      setShowEditDialog(false);
      toast({
        title: 'Document updated',
        description: 'Document has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Failed to update document',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [document, updateDocument, toast]);

  const handleDelete = useCallback(async () => {
    if (!document) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${document.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteDocument.mutateAsync(document.id);
      toast({
        title: 'Document deleted',
        description: 'Document has been deleted successfully.',
      });
      navigate('/dashboard/documents');
    } catch (error) {
      toast({
        title: 'Failed to delete document',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [document, deleteDocument, toast, navigate]);

  const handleRefresh = useCallback(() => {
    refetchDocument();
  }, [refetchDocument]);

  const handleBack = useCallback(() => {
    navigate('/dashboard/documents');
  }, [navigate]);

  // Loading and error states
  if (documentLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (documentError || !document) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Document not found
          </h2>
          <p className="text-gray-600 mb-4">
            The document you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Back to Documents
          </button>
        </div>
      </Layout>
    );
  }

  const isLoading = updateDocument.isPending ||
                   deleteDocument.isPending ||
                   downloadDocument.isPending;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DocumentDetailHeader
          document={document}
          onBack={handleBack}
          onDownload={handleDownload}
          onProcess={handleProcess}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <DocumentContentCard document={document} />

            <DocumentStructuredDataCard document={document} />

            <DocumentJobsCard
              jobs={jobs}
              isLoading={documentLoading}
            />
          </div>

          {/* Sidebar */}
          <DocumentInfoSidebar
            document={document}
            project={project}
          />
        </div>

        {/* TODO: Add EditDocumentDialog when needed */}
        {showEditDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Edit Document</h3>
              <p className="text-gray-600 mb-4">
                Document editing functionality will be implemented here.
              </p>
              <button
                onClick={() => setShowEditDialog(false)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default React.memo(DocumentDetailPage);