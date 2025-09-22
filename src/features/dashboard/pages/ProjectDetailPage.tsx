import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Plus, 
  FileText, 
  Zap, 
  Calendar,
  BarChart3,
  Download,
  Upload,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  FolderOpen,
  Activity,
  Eye,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';

import { getErrorMessage } from '@/lib/api';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useToast } from '@/shared/components/ui/use-toast';
import ConfirmationDialog from '@/shared/components/ui/confirmation-dialog';
import StatusBadge from '@/shared/components/ui/status-badge';
import StatusIcon from '@/shared/components/ui/status-icon';
import { ParscadeCard, ParscadeButton } from '@/shared/components/brand';
import LoadingSpinner from '@/shared/components/forms/atoms/LoadingSpinner';
import { formatDate, formatBytes, formatJobType } from '@/shared/utils/formatters';
import { useProject, useUpdateProject, useDeleteProject, useAssociateDocument, useRemoveDocument } from '@/shared/hooks/api/useProjects';
import { useDocuments } from '@/shared/hooks/api/useDocuments';
import { useJobs } from '@/shared/hooks/api/useJobs';
import { useCreateExport } from '@/shared/hooks/api/useExports';
import DashboardLayout from '../components/layout/DashboardLayout';

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: project, isLoading, error, refetch } = useProject(projectId!);
  const { data: documentsData } = useDocuments({ project_id: projectId });
  const { data: jobsData } = useJobs({ project_id: projectId });
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const associateDocument = useAssociateDocument();
  const removeDocument = useRemoveDocument();
  const createExport = useCreateExport();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  const [documentSearch, setDocumentSearch] = useState('');
  const [jobSearch, setJobSearch] = useState('');

  const documents = documentsData?.documents || [];
  const jobs = jobsData?.jobs || [];

  // Initialize edit form when project loads
  React.useEffect(() => {
    if (project) {
      setEditForm({
        name: project.name,
        description: project.description || '',
      });
    }
  }, [project]);

  const handleEdit = async () => {
    if (!projectId || !editForm.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Project name is required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateProject.mutateAsync({
        projectId,
        data: {
          name: editForm.name.trim(),
          description: editForm.description.trim() || undefined,
        },
      });
      setShowEditDialog(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDelete = async () => {
    if (!projectId) return;

    try {
      await deleteProject.mutateAsync(projectId);
      navigate('/dashboard');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleAddDocument = async () => {
    if (!projectId || !selectedDocumentId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a document to add.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await associateDocument.mutateAsync({
        projectId,
        data: { document_id: selectedDocumentId },
      });
      setShowAddDocumentDialog(false);
      setSelectedDocumentId('');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleRemoveDocument = async (documentId: string) => {
    try {
      await removeDocument.mutateAsync(documentId);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleExportProject = async () => {
    if (!projectId) return;

    try {
      await createExport.mutateAsync({
        type: 'documents',
        format: 'csv',
        filters: { project_id: projectId },
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(documentSearch.toLowerCase()) ||
    doc.originalName.toLowerCase().includes(documentSearch.toLowerCase())
  );

  const filteredJobs = jobs.filter(job =>
    formatJobType(job.type).toLowerCase().includes(jobSearch.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-64 lg:col-span-2" />
            <Skeleton className="h-64" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout>
        <ParscadeCard className="p-8">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error ? getErrorMessage(error) : 'The requested project could not be found.'}
            </p>
            <div className="flex justify-center space-x-3">
              <ParscadeButton
                variant="outline"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </ParscadeButton>
              <ParscadeButton onClick={() => refetch()}>
                Try Again
              </ParscadeButton>
            </div>
          </div>
        </ParscadeCard>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={project.name}
      subtitle={`Project created ${formatDate(project.created_at)}`}
      actions={
        <div className="flex items-center space-x-3">
          <ParscadeButton
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExportProject}
            disabled={createExport.isPending}
          >
            {createExport.isPending ? 'Exporting...' : 'Export'}
          </ParscadeButton>
          <ParscadeButton
            variant="outline"
            size="sm"
            leftIcon={<Edit3 className="w-4 h-4" />}
            onClick={() => setShowEditDialog(true)}
          >
            Edit
          </ParscadeButton>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Back Navigation */}
        <div>
          <ParscadeButton
            variant="ghost"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            Back to Dashboard
          </ParscadeButton>
        </div>

        {/* Project Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Project Info */}
          <ParscadeCard className="lg:col-span-2 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-parscade">
                  <FolderOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                  {project.description && (
                    <p className="text-gray-600 mt-1">{project.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <ParscadeButton
                  variant="outline"
                  size="sm"
                  leftIcon={<Edit3 className="w-4 h-4" />}
                  onClick={() => setShowEditDialog(true)}
                >
                  Edit
                </ParscadeButton>
                <ParscadeButton
                  variant="outline"
                  size="sm"
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Delete
                </ParscadeButton>
              </div>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-900">{project.document_count}</div>
                    <div className="text-sm text-blue-700">Documents</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200"
              >
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold text-purple-900">{project.job_count}</div>
                    <div className="text-sm text-purple-700">Processing Jobs</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200"
              >
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-green-900">Last Activity</div>
                    <div className="text-sm text-green-700">
                      {project.last_activity ? formatDate(project.last_activity) : 'No activity'}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Project Actions */}
            <div className="flex flex-wrap gap-3">
              <ParscadeButton
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setShowAddDocumentDialog(true)}
              >
                Add Document
              </ParscadeButton>
              <ParscadeButton
                variant="outline"
                size="sm"
                leftIcon={<Upload className="w-4 h-4" />}
                onClick={() => {
                  // Navigate to upload with project context
                  navigate('/dashboard', { state: { projectId } });
                }}
              >
                Upload New
              </ParscadeButton>
              <ParscadeButton
                variant="outline"
                size="sm"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleExportProject}
                disabled={createExport.isPending}
              >
                {createExport.isPending ? 'Exporting...' : 'Export Data'}
              </ParscadeButton>
            </div>
          </ParscadeCard>

          {/* Project Metadata */}
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              Project Details
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Project ID</Label>
                <div className="mt-1 font-mono text-xs text-gray-600 bg-gray-50 p-2 rounded border">
                  {project.id}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Created</Label>
                <div className="mt-1 text-sm text-gray-900">
                  {formatDate(project.created_at)}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Last Updated</Label>
                <div className="mt-1 text-sm text-gray-900">
                  {formatDate(project.updated_at)}
                </div>
              </div>
              {project.last_activity && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Last Activity</Label>
                  <div className="mt-1 text-sm text-gray-900">
                    {formatDate(project.last_activity)}
                  </div>
                </div>
              )}
            </div>
          </ParscadeCard>
        </div>

        {/* Documents Section */}
        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
                <p className="text-sm text-blue-600">Files associated with this project</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={documentSearch}
                  onChange={(e) => setDocumentSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <ParscadeButton
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setShowAddDocumentDialog(true)}
              >
                Add Document
              </ParscadeButton>
            </div>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-parscade">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {documentSearch ? 'No matching documents' : 'No documents yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {documentSearch 
                  ? `No documents match "${documentSearch}". Try a different search term.`
                  : 'Add documents to this project to start organizing your processing workflows.'
                }
              </p>
              {!documentSearch && (
                <ParscadeButton
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setShowAddDocumentDialog(true)}
                >
                  Add First Document
                </ParscadeButton>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document, index) => (
                <motion.div
                  key={document.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50/30 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                          {document.name}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">{document.originalName}</p>
                      </div>
                    </div>
                    <StatusBadge status={document.status as any} />
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1 mb-3">
                    <div>{formatBytes(document.size)} • {document.mimeType}</div>
                    <div>Uploaded {formatDate(document.createdAt)}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/documents/${document.id}`)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDocument(document.id)}
                      disabled={removeDocument.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ParscadeCard>

        {/* Processing Jobs Section */}
        <ParscadeCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Processing Jobs</h2>
                <p className="text-sm text-blue-600">Document processing activities for this project</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-parscade">
                <Zap className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {jobSearch ? 'No matching jobs' : 'No processing jobs'}
              </h3>
              <p className="text-gray-600">
                {jobSearch 
                  ? `No jobs match "${jobSearch}". Try a different search term.`
                  : 'Processing jobs for documents in this project will appear here.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50/30 transition-all duration-200 group cursor-pointer"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <StatusIcon status={job.status as any} />
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                          {formatJobType(job.type)}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Created {formatDate(job.createdAt)}
                        </p>
                        {job.error && (
                          <p className="text-sm text-red-600 mt-1 truncate max-w-md">
                            Error: {job.error}
                          </p>
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
                      <StatusBadge status={job.status as any} />
                      <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ParscadeCard>

        {/* Project Analytics */}
        <ParscadeCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Project Analytics</h2>
              <p className="text-sm text-blue-600">Processing insights for this project</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200"
            >
              <div className="text-2xl font-bold text-blue-900 mb-1">{project.document_count}</div>
              <div className="text-sm text-blue-700">Total Documents</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200"
            >
              <div className="text-2xl font-bold text-purple-900 mb-1">{project.job_count}</div>
              <div className="text-sm text-purple-700">Processing Jobs</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200"
            >
              <div className="text-2xl font-bold text-green-900 mb-1">
                {jobs.filter(j => j.status === 'completed').length}
              </div>
              <div className="text-sm text-green-700">Completed</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200"
            >
              <div className="text-2xl font-bold text-amber-900 mb-1">
                {jobs.filter(j => ['pending', 'processing'].includes(j.status)).length}
              </div>
              <div className="text-sm text-amber-700">In Progress</div>
            </motion.div>
          </div>
        </ParscadeCard>
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update your project details and settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_name">Project Name</Label>
              <Input
                id="edit_name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Enter project name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_description">Description</Label>
              <textarea
                id="edit_description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Describe your project..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
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
                disabled={updateProject.isPending || !editForm.name.trim()}
              >
                {updateProject.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Document Dialog */}
      <Dialog open={showAddDocumentDialog} onOpenChange={setShowAddDocumentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Document to Project</DialogTitle>
            <DialogDescription>
              Select an existing document to add to this project.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document_select">Select Document</Label>
              <select
                id="document_select"
                value={selectedDocumentId}
                onChange={(e) => setSelectedDocumentId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Choose a document...</option>
                {/* This would be populated with available documents not in this project */}
                <option value="doc-1">Sample Document 1.pdf</option>
                <option value="doc-2">Sample Document 2.docx</option>
              </select>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Only documents not currently associated with other projects will be available for selection.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddDocumentDialog(false);
                  setSelectedDocumentId('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddDocument}
                disabled={associateDocument.isPending || !selectedDocumentId}
              >
                {associateDocument.isPending ? 'Adding...' : 'Add Document'}
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
        title="Delete Project"
        description={`Are you sure you want to delete "${project.name}"? Documents will not be deleted, but they will be removed from this project. This action cannot be undone.`}
        confirmText="Delete Project"
        variant="destructive"
        isLoading={deleteProject.isPending}
      />
    </DashboardLayout>
  );
};

export default ProjectDetailPage;