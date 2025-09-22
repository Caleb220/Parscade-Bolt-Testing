/**
 * Documents Dashboard Page - Comprehensive Document Management
 * Professional document management interface with upload, ingest, and full CRUD operations
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Upload,
  Link as LinkIcon,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  Folder,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  ChevronDown,
  Activity,
  BarChart3,
  Globe,
  Image,
  FileSpreadsheet,
  Archive
} from 'lucide-react';

import { ParscadeCard, ParscadeButton } from '@/shared/components/brand';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import ConfirmationDialog from '@/shared/components/ui/confirmation-dialog';
import StatusBadge from '@/shared/components/ui/status-badge';
import StatusIcon from '@/shared/components/ui/status-icon';
import { useToast } from '@/shared/components/ui/use-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import EmptyState from '../components/ui/EmptyState';
import { 
  useDocuments, 
  useUploadDocument, 
  useIngestDocument,
  useUpdateDocument,
  useDeleteDocument,
  useDocumentDownload
} from '@/shared/hooks/api/useDocuments';
import { useProjects } from '@/shared/hooks/api/useProjects';
import { useSubmitParseJob } from '@/shared/hooks/api/useJobs';
import { formatDate, formatBytes } from '@/shared/utils/formatters';
import { getErrorMessage } from '@/lib/api';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { 
  Document, 
  DocumentQueryParams, 
  DocumentStatus,
  DocumentUpdateData
} from '@/types/api-types';

/**
 * Comprehensive Documents dashboard page with full document management
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
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showIngestDialog, setShowIngestDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<'delete' | 'process' | null>(null);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

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
  const { data: documentsData, isLoading, error, refetch } = useDocuments(queryParams);
  const { data: projectsData } = useProjects({ page: 1, limit: 100 });
  
  // Mutations
  const uploadDocument = useUploadDocument();
  const ingestDocument = useIngestDocument();
  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocument();
  const downloadDocument = useDocumentDownload();
  const submitParseJob = useSubmitParseJob();

  // Form state
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    name: '',
    projectId: '',
    metadata: '{}',
  });

  const [ingestForm, setIngestForm] = useState({
    url: '',
    name: '',
    projectId: '',
    mime_type: '',
    metadata: '{}',
  });

  const [editForm, setEditForm] = useState({
    name: '',
    projectId: '',
    metadata: '{}',
  });

  const documents = documentsData?.data || [];
  const projects = projectsData?.data || [];

  // Update URL params when filters change
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedStatus !== 'all') params.set('status', selectedStatus);
    if (selectedMimeType !== 'all') params.set('mime_type', selectedMimeType);
    if (selectedProject !== 'all') params.set('project_id', selectedProject);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [searchTerm, selectedStatus, selectedMimeType, selectedProject, currentPage, setSearchParams]);

  // Initialize edit form when document is selected
  React.useEffect(() => {
    if (editingDocument) {
      setEditForm({
        name: editingDocument.name,
        projectId: editingDocument.project_id || '',
        metadata: JSON.stringify(editingDocument.metadata, null, 2),
      });
    }
  }, [editingDocument]);

  // Document actions
  const handleUpload = async () => {
    if (!uploadForm.file) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    try {
      let metadata: Record<string, unknown> = {};
      try {
        metadata = JSON.parse(uploadForm.metadata);
      } catch {
        metadata = {};
      }

      const response = await uploadDocument.mutateAsync({
        file: uploadForm.file,
        name: uploadForm.name || undefined,
        projectId: uploadForm.projectId || undefined,
        metadata,
      });

      setShowUploadDialog(false);
      setUploadForm({ file: null, name: '', projectId: '', metadata: '{}' });
      
      // Optionally start processing job
      if (response.document.id) {
        try {
          await submitParseJob.mutateAsync({ 
            documentId: response.document.id,
            projectId: uploadForm.projectId || undefined,
          });
        } catch (error) {
          // Job creation failed, but upload succeeded
          console.warn('Failed to create processing job:', error);
        }
      }
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleIngest = async () => {
    if (!ingestForm.url) {
      toast({
        title: 'URL required',
        description: 'Please enter a URL to ingest.',
        variant: 'destructive',
      });
      return;
    }

    try {
      let metadata: Record<string, unknown> = {};
      try {
        metadata = JSON.parse(ingestForm.metadata);
      } catch {
        metadata = {};
      }

      const document = await ingestDocument.mutateAsync({
        url: ingestForm.url,
        name: ingestForm.name || undefined,
        projectId: ingestForm.projectId || undefined,
        mime_type: ingestForm.mime_type || undefined,
        metadata,
      });

      setShowIngestDialog(false);
      setIngestForm({ url: '', name: '', projectId: '', mime_type: '', metadata: '{}' });
      
      // Optionally start processing job
      if (document.id) {
        try {
          await submitParseJob.mutateAsync({ 
            documentId: document.id,
            projectId: ingestForm.projectId || undefined,
          });
        } catch (error) {
          // Job creation failed, but ingest succeeded
          console.warn('Failed to create processing job:', error);
        }
      }
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleEdit = async () => {
    if (!editingDocument) return;

    try {
      let metadata: Record<string, unknown> = {};
      try {
        metadata = JSON.parse(editForm.metadata);
      } catch {
        metadata = editingDocument.metadata;
      }

      const updateData: DocumentUpdateData = {
        name: editForm.name || undefined,
        project_id: editForm.projectId || null,
        metadata,
      };

      await updateDocument.mutateAsync({ documentId: editingDocument.id, data: updateData });
      setShowEditDialog(false);
      setEditingDocument(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument.mutateAsync(documentId);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDownload = async (documentId: string) => {
    try {
      await downloadDocument.mutateAsync(documentId);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleProcess = async (documentId: string, projectId?: string) => {
    try {
      await submitParseJob.mutateAsync({ documentId, projectId });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedDocuments.size === 0) return;

    const promises = Array.from(selectedDocuments).map(documentId => {
      switch (bulkAction) {
        case 'delete':
          return deleteDocument.mutateAsync(documentId);
        case 'process':
          return submitParseJob.mutateAsync({ documentId });
        default:
          return Promise.resolve();
      }
    });

    try {
      await Promise.all(promises);
      setSelectedDocuments(new Set());
      setBulkAction(null);
      toast({
        title: 'Bulk action completed',
        description: `Successfully ${bulkAction}ed ${selectedDocuments.size} documents.`,
      });
    } catch (error) {
      toast({
        title: 'Bulk action failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const toggleDocumentSelection = (documentId: string) => {
    const newSelection = new Set(selectedDocuments);
    if (newSelection.has(documentId)) {
      newSelection.delete(documentId);
    } else {
      newSelection.add(documentId);
    }
    setSelectedDocuments(newSelection);
  };

  const selectAllDocuments = () => {
    if (selectedDocuments.size === documents.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(documents.map(doc => doc.id)));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedMimeType('all');
    setSelectedProject('all');
    setCurrentPage(1);
  };

  const getDocumentStats = () => {
    const total = documents.length;
    const uploading = documents.filter(d => d.status === 'uploading').length;
    const processing = documents.filter(d => d.status === 'processing').length;
    const completed = documents.filter(d => d.status === 'completed').length;
    const failed = documents.filter(d => d.status === 'failed').length;

    return { total, uploading, processing, completed, failed };
  };

  const getMimeTypeIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <FileSpreadsheet className="w-4 h-4" />;
    if (mimeType.includes('zip') || mimeType.includes('archive')) return <Archive className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const stats = getDocumentStats();

  return (
    <DashboardLayout
      title="Documents"
      subtitle="Manage your document library and processing workflows"
      actions={
        <div className="flex items-center space-x-3">
          <ParscadeButton
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={() => refetch()}
            disabled={isLoading}
            className="hidden sm:flex"
          >
            Refresh
          </ParscadeButton>
          <ParscadeButton
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="sm:hidden"
            aria-label="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </ParscadeButton>
          <ParscadeButton
            variant="outline"
            size="sm"
            leftIcon={<LinkIcon className="w-4 h-4" />}
            onClick={() => setShowIngestDialog(true)}
            className="hidden sm:flex"
          >
            Ingest URL
          </ParscadeButton>
          <ParscadeButton
            variant="ghost"
            size="sm"
            onClick={() => setShowIngestDialog(true)}
            className="sm:hidden"
            aria-label="Ingest URL"
          >
            <LinkIcon className="w-4 h-4" />
          </ParscadeButton>
          <ParscadeButton
            variant="primary"
            size="sm"
            leftIcon={<Upload className="w-4 h-4" />}
            onClick={() => setShowUploadDialog(true)}
            glow
            className="hidden sm:flex"
          >
            Upload
          </ParscadeButton>
          <ParscadeButton
            variant="primary"
            size="sm"
            onClick={() => setShowUploadDialog(true)}
            glow
            className="sm:hidden"
            aria-label="Upload"
          >
            <Upload className="w-4 h-4" />
          </ParscadeButton>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Activity className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-xl sm:text-2xl font-bold text-blue-900">{stats.total}</div>
                <div className="text-xs sm:text-sm text-blue-700">Total</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-amber-200"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Clock className="w-5 h-5 text-amber-600" />
              <div>
                <div className="text-xl sm:text-2xl font-bold text-amber-900">{stats.uploading}</div>
                <div className="text-xs sm:text-sm text-amber-700">Uploading</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-xl sm:text-2xl font-bold text-purple-900">{stats.processing}</div>
                <div className="text-xs sm:text-sm text-purple-700">Processing</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-emerald-200"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-900">{stats.completed}</div>
                <div className="text-xs sm:text-sm text-emerald-700">Completed</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-red-200 col-span-2 sm:col-span-1"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <div className="text-xl sm:text-2xl font-bold text-red-900">{stats.failed}</div>
                <div className="text-xs sm:text-sm text-red-700">Failed</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <ParscadeCard variant="default" className="p-6">
          <div className="space-y-4">
            {/* Search and Quick Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1 max-w-full lg:max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search documents by name, content, or metadata..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center flex-1 sm:flex-none justify-center"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Filters</span>
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>

                {(selectedStatus !== 'all' || selectedMimeType !== 'all' || selectedProject !== 'all' || searchTerm) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="flex-1 sm:flex-none justify-center"
                  >
                    <span className="hidden sm:inline">Clear Filters</span>
                    <span className="sm:hidden">Clear</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200"
              >
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as DocumentStatus | 'all')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="uploading">Uploading</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>File Type</Label>
                  <select
                    value={selectedMimeType}
                    onChange={(e) => setSelectedMimeType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="application/pdf">PDF</option>
                    <option value="application/msword">Word Document</option>
                    <option value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">Word (DOCX)</option>
                    <option value="text/plain">Text File</option>
                    <option value="image/jpeg">JPEG Image</option>
                    <option value="image/png">PNG Image</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Project</Label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Projects</option>
                    <option value="">No Project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </motion.div>
            )}
          </div>
        </ParscadeCard>

        {/* Bulk Actions */}
        {selectedDocuments.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-blue-900">
                  {selectedDocuments.size} document{selectedDocuments.size !== 1 ? 's' : ''} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDocuments(new Set())}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Clear Selection
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkAction('process')}
                  disabled={!Array.from(selectedDocuments).some(id => 
                    documents.find(d => d.id === id)?.status === 'completed'
                  )}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Process
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkAction('delete')}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Documents List */}
        <ParscadeCard variant="default" className="overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load documents</h3>
                <p className="text-gray-600 mb-4">{getErrorMessage(error)}</p>
                <Button onClick={() => refetch()} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={<FileText className="w-8 h-8 text-gray-400" />}
                title={searchTerm || selectedStatus !== 'all' || selectedMimeType !== 'all' || selectedProject !== 'all' 
                  ? 'No matching documents found' 
                  : 'No documents yet'
                }
                description={searchTerm || selectedStatus !== 'all' || selectedMimeType !== 'all' || selectedProject !== 'all'
                  ? 'Try adjusting your search criteria or filters to find documents.'
                  : 'Upload your first document to start transforming it into structured data.'
                }
                action={
                  !(searchTerm || selectedStatus !== 'all' || selectedMimeType !== 'all' || selectedProject !== 'all') ? {
                    label: 'Upload First Document',
                    onClick: () => setShowUploadDialog(true),
                  } : undefined
                }
              />
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.size === documents.length && documents.length > 0}
                    onChange={selectAllDocuments}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1 grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                    <div className="col-span-4">Document</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Project</div>
                    <div className="col-span-1">Size</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                </div>
              </div>

              {/* Documents List */}
              <div className="divide-y divide-gray-200">
                {documents.map((document, index) => {
                  const project = projects.find(p => p.id === document.project_id);
                  
                  return (
                    <motion.div
                      key={document.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-6 py-4 hover:bg-blue-50/30 transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.has(document.id)}
                          onChange={() => toggleDocumentSelection(document.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        
                        <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                          {/* Document Info */}
                          <div className="col-span-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-sm">
                                {getMimeTypeIcon(document.mime_type)}
                              </div>
                              <div className="min-w-0">
                                <button
                                  onClick={() => navigate(`/dashboard/documents/${document.id}`)}
                                  className="font-medium text-gray-900 hover:text-blue-700 transition-colors text-left truncate block w-full"
                                >
                                  {document.name}
                                </button>
                                <p className="text-sm text-gray-500 truncate">{document.original_name}</p>
                                <p className="text-xs text-gray-400">{formatDate(document.created_at)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="col-span-2">
                            <StatusBadge status={document.status} />
                          </div>

                          {/* Type */}
                          <div className="col-span-2">
                            <div className="flex items-center space-x-2">
                              {getMimeTypeIcon(document.mime_type)}
                              <span className="text-sm text-gray-700 truncate">
                                {document.mime_type.split('/')[1]?.toUpperCase() || 'Unknown'}
                              </span>
                            </div>
                          </div>

                          {/* Project */}
                          <div className="col-span-2">
                            {project ? (
                              <button
                                onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                              >
                                <Folder className="w-4 h-4" />
                                <span className="truncate">{project.name}</span>
                              </button>
                            ) : (
                              <span className="text-sm text-gray-400">No project</span>
                            )}
                          </div>

                          {/* Size */}
                          <div className="col-span-1">
                            <span className="text-sm text-gray-700">{formatBytes(document.size)}</span>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1">
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload(document.id)}
                                disabled={downloadDocument.isPending}
                                title="Download Document"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              
                              {document.status === 'completed' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleProcess(document.id, document.project_id || undefined)}
                                  disabled={submitParseJob.isPending}
                                  title="Process Document"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <FileText className="w-4 h-4" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingDocument(document);
                                  setShowEditDialog(true);
                                }}
                                title="Edit Document"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/dashboard/documents/${document.id}`)}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              {documentsData && documentsData.total_pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, documentsData.total)} of {documentsData.total} documents
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, documentsData.total_pages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={page === currentPage ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(documentsData.total_pages, currentPage + 1))}
                        disabled={currentPage === documentsData.total_pages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ParscadeCard>
      </div>

      {/* Upload Document Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new document for processing and analysis.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="upload_file">Select File</Label>
              <input
                id="upload_file"
                type="file"
                onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.jpg,.jpeg,.png,.gif,.zip"
              />
              <p className="text-xs text-gray-500">
                Supported: PDF, Word, Excel, CSV, Images, Archives (max 50MB)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="upload_name">Document Name (Optional)</Label>
                <Input
                  id="upload_name"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  placeholder="Custom document name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="upload_project">Project (Optional)</Label>
                <select
                  id="upload_project"
                  value={uploadForm.projectId}
                  onChange={(e) => setUploadForm({ ...uploadForm, projectId: e.target.value })}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="upload_metadata">Metadata (JSON, Optional)</Label>
              <textarea
                id="upload_metadata"
                value={uploadForm.metadata}
                onChange={(e) => setUploadForm({ ...uploadForm, metadata: e.target.value })}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none font-mono"
                placeholder='{"key": "value"}'
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUploadDialog(false);
                  setUploadForm({ file: null, name: '', projectId: '', metadata: '{}' });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploadDocument.isPending || !uploadForm.file}
              >
                {uploadDocument.isPending ? 'Uploading...' : 'Upload Document'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ingest Document Dialog */}
      <Dialog open={showIngestDialog} onOpenChange={setShowIngestDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ingest Document from URL</DialogTitle>
            <DialogDescription>
              Ingest a document from a public URL for processing.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ingest_url">Document URL</Label>
              <Input
                id="ingest_url"
                value={ingestForm.url}
                onChange={(e) => setIngestForm({ ...ingestForm, url: e.target.value })}
                placeholder="https://example.com/document.pdf"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ingest_name">Document Name (Optional)</Label>
                <Input
                  id="ingest_name"
                  value={ingestForm.name}
                  onChange={(e) => setIngestForm({ ...ingestForm, name: e.target.value })}
                  placeholder="Custom document name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingest_project">Project (Optional)</Label>
                <select
                  id="ingest_project"
                  value={ingestForm.projectId}
                  onChange={(e) => setIngestForm({ ...ingestForm, projectId: e.target.value })}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ingest_mime_type">MIME Type Hint (Optional)</Label>
                <Input
                  id="ingest_mime_type"
                  value={ingestForm.mime_type}
                  onChange={(e) => setIngestForm({ ...ingestForm, mime_type: e.target.value })}
                  placeholder="application/pdf"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingest_metadata">Metadata (JSON, Optional)</Label>
                <textarea
                  id="ingest_metadata"
                  value={ingestForm.metadata}
                  onChange={(e) => setIngestForm({ ...ingestForm, metadata: e.target.value })}
                  rows={2}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none font-mono"
                  placeholder='{"source": "url"}'
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowIngestDialog(false);
                  setIngestForm({ url: '', name: '', projectId: '', mime_type: '', metadata: '{}' });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleIngest}
                disabled={ingestDocument.isPending || !ingestForm.url}
              >
                {ingestDocument.isPending ? 'Ingesting...' : 'Ingest Document'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update document metadata and project association.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
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
              <Label htmlFor="edit_project">Project</Label>
              <select
                id="edit_project"
                value={editForm.projectId}
                onChange={(e) => setEditForm({ ...editForm, projectId: e.target.value })}
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
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingDocument(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                disabled={updateDocument.isPending || !editForm.name.trim()}
              >
                {updateDocument.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Confirmation */}
      <ConfirmationDialog
        isOpen={!!bulkAction}
        onClose={() => setBulkAction(null)}
        onConfirm={handleBulkAction}
        title={`${bulkAction ? bulkAction.charAt(0).toUpperCase() + bulkAction.slice(1) : ''} Documents`}
        description={`Are you sure you want to ${bulkAction} ${selectedDocuments.size} selected document${selectedDocuments.size !== 1 ? 's' : ''}?`}
        confirmText={`${bulkAction ? bulkAction.charAt(0).toUpperCase() + bulkAction.slice(1) : ''} Documents`}
        variant={bulkAction === 'delete' ? 'destructive' : 'default'}
        isLoading={deleteDocument.isPending || submitParseJob.isPending}
      />
    </DashboardLayout>
  );
};

export default DocumentsPage;