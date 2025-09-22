/**
 * Document Detail Page - Comprehensive Document Management
 * Professional document detail interface with full metadata and processing capabilities
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  FileText, 
  Database,
  Edit3,
  Trash2,
  Calendar,
  User,
  Folder,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Image,
  FileSpreadsheet,
  Archive,
  Globe,
  HardDrive,
  Zap,
  Eye,
  Copy
} from 'lucide-react';

import { getErrorMessage } from '@/lib/api';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Skeleton } from '@/shared/components/ui/skeleton';
import ConfirmationDialog from '@/shared/components/ui/confirmation-dialog';
import { ParscadeCard, ParscadeButton } from '@/shared/components/brand';
import Layout from '@/shared/components/layout/templates/Layout';
import StatusIcon from '@/shared/components/ui/status-icon';
import StatusBadge from '@/shared/components/ui/status-badge';
import { useClipboard } from '@/shared/hooks/useClipboard';
import { formatBytes } from '@/shared/utils/formatters';
import { formatDate } from '@/shared/utils/date';
import { 
  useDocument, 
  useUpdateDocument,
  useDeleteDocument,
  useDocumentDownload
} from '@/shared/hooks/api/useDocuments';
import { useProject } from '@/shared/hooks/api/useProjects';
import { useJobs, useSubmitParseJob } from '@/shared/hooks/api/useJobs';
import type { DocumentUpdateData } from '@/types/api-types';

/**
 * Comprehensive document detail page with full management capabilities
 */
const DocumentDetailPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { copy } = useClipboard();
  
  const { data: document, isLoading, error, refetch } = useDocument(documentId!);
  const { data: project } = useProject(document?.project_id || '');
  const { data: jobsData } = useJobs({ document_id: documentId, page: 1, limit: 10 });
  
  const updateDocumentMutation = useUpdateDocument();
  const deleteDocumentMutation = useDeleteDocument();
  const downloadMutation = useDocumentDownload();
  const submitParseJobMutation = useSubmitParseJob();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    project_id: '',
    metadata: '{}',
  });

  const jobs = jobsData?.data || [];

  // Initialize edit form when document loads
  React.useEffect(() => {
    if (document) {
      setEditForm({
        name: document.name,
        project_id: document.project_id || '',
        metadata: JSON.stringify(document.metadata, null, 2),
      });
    }
  }, [document]);

  const handleEdit = async () => {
    if (!document || !editForm.name.trim()) return;
    
    try {
      let metadata: Record<string, unknown> = {};
      try {
        metadata = JSON.parse(editForm.metadata);
      } catch {
        metadata = document.metadata;
      }

      const updateData: DocumentUpdateData = {
        name: editForm.name.trim(),
        project_id: editForm.project_id || null,
        metadata,
      };

      await updateDocumentMutation.mutateAsync({ documentId: document.id, data: updateData });
      setShowEditDialog(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDelete = async () => {
    if (!document) return;
    
    try {
      await deleteDocumentMutation.mutateAsync(document.id);
      navigate('/dashboard/documents');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDownload = async () => {
    if (!document) return;
    
    try {
      await downloadMutation.mutateAsync(document.id);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleProcess = async () => {
    if (!document) return;
    
    try {
      const job = await submitParseJobMutation.mutateAsync({ 
        documentId: document.id,
        projectId: document.project_id || undefined,
      });
      if (job?.id) {
        navigate(`/dashboard/jobs/${job.id}`);
      }
    } catch (error) {
      // Error handled by mutation
    }
  };

  const getMimeTypeIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <FileSpreadsheet className="w-6 h-6" />;
    if (mimeType.includes('zip') || mimeType.includes('archive')) return <Archive className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  const getMimeTypeColor = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'from-green-100 to-green-200';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'from-emerald-100 to-emerald-200';
    if (mimeType.includes('zip') || mimeType.includes('archive')) return 'from-purple-100 to-purple-200';
    return 'from-blue-100 to-blue-200';
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-48" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Skeleton className="h-96 lg:col-span-2" />
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !document) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ParscadeCard className="p-8">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Document Not Found</h2>
              <p className="text-gray-600 mb-6">
                {error ? getErrorMessage(error) : 'The requested document could not be found.'}
              </p>
              <div className="flex justify-center space-x-3">
                <ParscadeButton
                  variant="outline"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  onClick={() => navigate('/dashboard/documents')}
                >
                  Back to Documents
                </ParscadeButton>
                <ParscadeButton onClick={() => refetch()}>
                  Try Again
                </ParscadeButton>
              </div>
            </div>
          </ParscadeCard>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <ParscadeButton
            variant="ghost"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/dashboard/documents')}
            className="mb-4"
          >
            Back to Documents
          </ParscadeButton>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${getMimeTypeColor(document.mime_type)} rounded-xl flex items-center justify-center shadow-parscade`}>
                {getMimeTypeIcon(document.mime_type)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{document.name}</h1>
                <p className="text-gray-600 mt-1">{document.original_name}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <StatusIcon status={document.status} />
                  <StatusBadge status={document.status} />
                  <span className="text-sm text-gray-500">{formatBytes(document.size)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <ParscadeButton
                variant="outline"
                size="sm"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleDownload}
                disabled={downloadMutation.isPending}
              >
                {downloadMutation.isPending ? 'Preparing...' : 'Download'}
              </ParscadeButton>
              
              {document.status === 'completed' && (
                <ParscadeButton
                  variant="primary"
                  size="sm"
                  leftIcon={<Zap className="w-4 h-4" />}
                  onClick={handleProcess}
                  disabled={submitParseJobMutation.isPending}
                >
                  {submitParseJobMutation.isPending ? 'Processing...' : 'Process'}
                </ParscadeButton>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Preview/Content */}
            <ParscadeCard variant="default" className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-600" />
                Document Content
              </h2>
              
              {document.extracted_text ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-900">Text Extracted</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Text content has been successfully extracted from this document.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-gray-700">Extracted Text</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copy(document.extracted_text!, 'Extracted text')}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="max-h-64 overflow-y-auto bg-white p-3 rounded border text-sm">
                      <pre className="whitespace-pre-wrap font-mono text-xs">
                        {document.extracted_text.slice(0, 2000)}
                        {document.extracted_text.length > 2000 && '...'}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : document.status === 'completed' ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No extracted text</h3>
                  <p className="text-gray-600 mb-4">
                    This document has been processed but no text content was extracted.
                  </p>
                  <ParscadeButton
                    variant="outline"
                    size="sm"
                    onClick={handleProcess}
                    disabled={submitParseJobMutation.isPending}
                  >
                    Reprocess Document
                  </ParscadeButton>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Required</h3>
                  <p className="text-gray-600 mb-4">
                    Process this document to extract text and structured data.
                  </p>
                  <ParscadeButton
                    variant="primary"
                    size="sm"
                    onClick={handleProcess}
                    disabled={submitParseJobMutation.isPending}
                  >
                    {submitParseJobMutation.isPending ? 'Starting...' : 'Start Processing'}
                  </ParscadeButton>
                </div>
              )}
            </ParscadeCard>

            {/* Structured Data */}
            {document.structure_data && Object.keys(document.structure_data).length > 0 && (
              <ParscadeCard variant="default" className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-green-600" />
                  Structured Data
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-900">Data Structured</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Structured data has been extracted and is ready for use.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-gray-700">Structured Data (JSON)</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copy(JSON.stringify(document.structure_data, null, 2), 'Structured data')}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy JSON
                      </Button>
                    </div>
                    <pre className="bg-white p-3 rounded border text-xs font-mono overflow-auto max-h-64">
                      {JSON.stringify(document.structure_data, null, 2)}
                    </pre>
                  </div>
                </div>
              </ParscadeCard>
            )}

            {/* Processing Jobs */}
            {jobs.length > 0 && (
              <ParscadeCard variant="default" className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-600" />
                  Processing Jobs
                </h2>
                
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50/30 transition-all duration-200 cursor-pointer"
                      onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <StatusIcon status={job.status} />
                          <div>
                            <h4 className="font-medium text-gray-900">{job.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                            <p className="text-sm text-gray-500">Created {formatDate(job.created_at)}</p>
                            {job.error && (
                              <p className="text-sm text-red-600 mt-1">Error: {job.error}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {job.status === 'processing' && (
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-blue-100 rounded-full h-1.5">
                                <div 
                                  className="bg-gradient-to-r from-blue-600 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                                  style={{ width: `${job.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-blue-600 font-medium">{job.progress}%</span>
                            </div>
                          )}
                          <StatusBadge status={job.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ParscadeCard>
            )}

            {/* Document Actions */}
            <ParscadeCard variant="default" className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Actions</h2>
              
              <div className="flex flex-wrap gap-3">
                <ParscadeButton
                  variant="primary"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={handleDownload}
                  disabled={downloadMutation.isPending}
                >
                  {downloadMutation.isPending ? 'Preparing...' : 'Download'}
                </ParscadeButton>

                {document.status === 'completed' && (
                  <ParscadeButton
                    variant="primary"
                    leftIcon={<Zap className="w-4 h-4" />}
                    onClick={handleProcess}
                    disabled={submitParseJobMutation.isPending}
                  >
                    {submitParseJobMutation.isPending ? 'Processing...' : 'Process Document'}
                  </ParscadeButton>
                )}

                <ParscadeButton
                  variant="outline"
                  leftIcon={<Edit3 className="w-4 h-4" />}
                  onClick={() => setShowEditDialog(true)}
                >
                  Edit Document
                </ParscadeButton>

                <ParscadeButton
                  variant="outline"
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  onClick={() => setShowDeleteDialog(true)}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  Delete Document
                </ParscadeButton>

                <ParscadeButton
                  variant="ghost"
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                  onClick={() => refetch()}
                >
                  Refresh
                </ParscadeButton>
              </div>
            </ParscadeCard>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Document Information */}
            <ParscadeCard variant="default" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Document Information
              </h3>
              
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-gray-600 font-medium">Document ID</dt>
                  <dd className="font-mono text-gray-900 mt-1 break-all text-xs">{document.id}</dd>
                </div>
                
                <div>
                  <dt className="text-gray-600 font-medium">File Name</dt>
                  <dd className="text-gray-900 mt-1">{document.name}</dd>
                </div>
                
                <div>
                  <dt className="text-gray-600 font-medium">Original Name</dt>
                  <dd className="text-gray-900 mt-1">{document.original_name}</dd>
                </div>
                
                <div>
                  <dt className="text-gray-600 font-medium">MIME Type</dt>
                  <dd className="text-gray-900 mt-1">{document.mime_type}</dd>
                </div>
                
                <div>
                  <dt className="text-gray-600 font-medium">File Size</dt>
                  <dd className="text-gray-900 mt-1">{formatBytes(document.size)}</dd>
                </div>
                
                <div>
                  <dt className="text-gray-600 font-medium">Status</dt>
                  <dd className="text-gray-900 mt-1 capitalize">{document.status}</dd>
                </div>
                
                <div>
                  <dt className="text-gray-600 font-medium">Created</dt>
                  <dd className="text-gray-900 mt-1">{formatDate(document.created_at)}</dd>
                </div>
                
                <div>
                  <dt className="text-gray-600 font-medium">Last Updated</dt>
                  <dd className="text-gray-900 mt-1">{formatDate(document.updated_at)}</dd>
                </div>
                
                <div>
                  <dt className="text-gray-600 font-medium">Storage Key</dt>
                  <dd className="font-mono text-gray-900 mt-1 break-all text-xs">{document.storage_key}</dd>
                </div>
              </dl>
            </ParscadeCard>

            {/* Project Information */}
            {project && (
              <ParscadeCard variant="default" className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Folder className="w-5 h-5 mr-2 text-purple-600" />
                  Project
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">{project.name}</p>
                    {project.description && (
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    )}
                  </div>
                  
                  <ParscadeButton
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                    className="w-full"
                  >
                    View Project
                  </ParscadeButton>
                </div>
              </ParscadeCard>
            )}

            {/* Metadata */}
            {Object.keys(document.metadata).length > 0 && (
              <ParscadeCard variant="default" className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <pre className="text-xs font-mono overflow-auto max-h-32">
                    {JSON.stringify(document.metadata, null, 2)}
                  </pre>
                </div>
              </ParscadeCard>
            )}
          </div>
        </div>

        {/* Edit Document Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Document</DialogTitle>
              <DialogDescription>
                Update document metadata and project association.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_name">Document Name</Label>
                <Input
                  id="edit_name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Document name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_project_id">Project</Label>
                <select
                  id="edit_project_id"
                  value={editForm.project_id}
                  onChange={(e) => setEditForm({ ...editForm, project_id: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">No project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_metadata">Metadata (JSON)</Label>
                <textarea
                  id="edit_metadata"
                  value={editForm.metadata}
                  onChange={(e) => setEditForm({ ...editForm, metadata: e.target.value })}
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none font-mono"
                  placeholder='{"key": "value"}'
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEdit}
                  disabled={updateDocumentMutation.isPending || !editForm.name.trim()}
                >
                  {updateDocumentMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          title="Delete Document"
          description={`Are you sure you want to delete "${document.name}"? This will also remove the file from storage. This action cannot be undone.`}
          confirmText="Delete Document"
          variant="destructive"
          isLoading={deleteDocumentMutation.isPending}
        />
      </div>
    </Layout>
  );
};

export default DocumentDetailPage;