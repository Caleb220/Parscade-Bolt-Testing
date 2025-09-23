/**
 * Jobs Dashboard Page - Refactored
 * Simplified and optimized job management interface
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/shared/components/ui/use-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
  JobsHeader,
  JobsFilters,
  JobsTable,
  CreateJobDialog,
} from '../components/jobs';
import {
  useJobs,
  useCreateJob,
  useStartJob,
  useCancelJob,
  useRetryJob,
  useDeleteJob
} from '@/shared/hooks/api/useJobs';
import { useProjects } from '@/shared/hooks/api/useProjects';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { getErrorMessage } from '@/lib/api';
import type {
  Job,
  JobCreateData,
  JobQueryParams,
  JobType,
  JobStatus
} from '@/types/api-types';

/**
 * Streamlined Jobs dashboard page
 */
const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | 'all'>(
    (searchParams.get('status') as JobStatus) || 'all'
  );
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedProject, setSelectedProject] = useState(searchParams.get('project_id') || 'all');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());

  // Debounced search
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Build query parameters
  const queryParams = useMemo((): JobQueryParams => {
    const params: JobQueryParams = {
      page: currentPage,
      limit: 20,
    };

    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedStatus !== 'all') params.status = selectedStatus;
    if (selectedType !== 'all') params.type = selectedType;
    if (selectedProject !== 'all') params.project_id = selectedProject;

    return params;
  }, [currentPage, debouncedSearch, selectedStatus, selectedType, selectedProject]);

  // API hooks
  const { data: jobsData, isLoading, error, refetch } = useJobs(queryParams);
  const { data: projectsData } = useProjects({ page: 1, limit: 100 });
  const { data: documentsData } = useDocuments({ page: 1, limit: 100 });
  
  // Mutations
  const createJob = useCreateJob();
  const startJob = useStartJob();
  const cancelJob = useCancelJob();
  const retryJob = useRetryJob();
  const deleteJob = useDeleteJob();

  // Form state for job creation
  const [createForm, setCreateForm] = useState<JobCreateData>({
    type: 'parse_document',
    source: 'upload',
    metadata: {},
    options: {},
    max_attempts: 3,
  });

  const jobs = jobsData?.data || [];
  const projects = projectsData?.data || [];
  const documents = documentsData?.data || [];

  // Update URL params when filters change
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedStatus !== 'all') params.set('status', selectedStatus);
    if (selectedType !== 'all') params.set('type', selectedType);
    if (selectedProject !== 'all') params.set('project_id', selectedProject);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [searchTerm, selectedStatus, selectedType, selectedProject, currentPage, setSearchParams]);

  // Job actions
  const handleCreateJob = async () => {
    try {
      const newJob = await createJob.mutateAsync(createForm);
      setShowCreateDialog(false);
      setCreateForm({
        type: 'parse_document',
        source: 'upload',
        metadata: {},
        options: {},
        max_attempts: 3,
      });
      navigate(`/dashboard/jobs/${newJob.id}`);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleJobAction = async (jobId: string, action: 'start' | 'cancel' | 'retry' | 'delete') => {
    try {
      switch (action) {
        case 'start':
          await startJob.mutateAsync(jobId);
          break;
        case 'cancel':
          await cancelJob.mutateAsync(jobId);
          break;
        case 'retry':
          await retryJob.mutateAsync(jobId);
          break;
        case 'delete':
          await deleteJob.mutateAsync(jobId);
          break;
      }
    } catch (error) {
      // Error handled by mutations
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedJobs.size === 0) return;

    const promises = Array.from(selectedJobs).map(jobId => {
      switch (bulkAction) {
        case 'start':
          return startJob.mutateAsync(jobId);
        case 'cancel':
          return cancelJob.mutateAsync(jobId);
        case 'delete':
          return deleteJob.mutateAsync(jobId);
        default:
          return Promise.resolve();
      }
    });

    try {
      await Promise.all(promises);
      setSelectedJobs(new Set());
      setBulkAction(null);
      toast({
        title: 'Bulk action completed',
        description: `Successfully ${bulkAction}ed ${selectedJobs.size} jobs.`,
      });
    } catch (error) {
      toast({
        title: 'Bulk action failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const toggleJobSelection = (jobId: string) => {
    const newSelection = new Set(selectedJobs);
    if (newSelection.has(jobId)) {
      newSelection.delete(jobId);
    } else {
      newSelection.add(jobId);
    }
    setSelectedJobs(newSelection);
  };

  const selectAllJobs = () => {
    if (selectedJobs.size === jobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(jobs.map(job => job.id)));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedType('all');
    setSelectedProject('all');
    setCurrentPage(1);
  };

  const getJobStats = () => {
    const total = jobs.length;
    const pending = jobs.filter(j => j.status === 'pending').length;
    const processing = jobs.filter(j => j.status === 'processing').length;
    const completed = jobs.filter(j => j.status === 'completed').length;
    const failed = jobs.filter(j => j.status === 'failed').length;

    return { total, pending, processing, completed, failed };
  };

  const stats = getJobStats();

  return (
    <DashboardLayout
      title="Processing Jobs"
      subtitle="Monitor and manage your document processing workflows"
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
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreateDialog(true)}
            glow
            className="hidden sm:flex"
          >
            New Job
          </ParscadeButton>
          <ParscadeButton
            variant="primary"
            size="sm"
            onClick={() => setShowCreateDialog(true)}
            glow
            className="sm:hidden"
            aria-label="New Job"
          >
            <Plus className="w-4 h-4" />
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
                <div className="text-xs sm:text-sm text-blue-700">Total Jobs</div>
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
                <div className="text-xl sm:text-2xl font-bold text-amber-900">{stats.pending}</div>
                <div className="text-xs sm:text-sm text-amber-700">Pending</div>
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
              <Zap className="w-5 h-5 text-purple-600" />
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
                    placeholder="Search jobs by error, metadata, or content..."
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

                {(selectedStatus !== 'all' || selectedType !== 'all' || selectedProject !== 'all' || searchTerm) && (
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200"
              >
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as JobStatus | 'all')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as JobType | 'all')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="parse_document">Parse Document</option>
                    <option value="extract_text">Extract Text</option>
                    <option value="analyze_structure">Analyze Structure</option>
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
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </div>
        </ParscadeCard>

        {/* Bulk Actions */}
        {selectedJobs.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-blue-900">
                  {selectedJobs.size} job{selectedJobs.size !== 1 ? 's' : ''} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedJobs(new Set())}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Clear Selection
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkAction('start')}
                  disabled={!Array.from(selectedJobs).some(id => 
                    jobs.find(j => j.id === id)?.status === 'pending'
                  )}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkAction('cancel')}
                  disabled={!Array.from(selectedJobs).some(id => 
                    ['pending', 'processing'].includes(jobs.find(j => j.id === id)?.status || '')
                  )}
                >
                  <Square className="w-4 h-4 mr-1" />
                  Cancel
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

        {/* Jobs List */}
        <ParscadeCard variant="default" className="overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load jobs</h3>
                <p className="text-gray-600 mb-4">{getErrorMessage(error)}</p>
                <Button onClick={() => refetch()} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={<Zap className="w-8 h-8 text-gray-400" />}
                title={searchTerm || selectedStatus !== 'all' || selectedType !== 'all' || selectedProject !== 'all' 
                  ? 'No matching jobs found' 
                  : 'No processing jobs yet'
                }
                description={searchTerm || selectedStatus !== 'all' || selectedType !== 'all' || selectedProject !== 'all'
                  ? 'Try adjusting your search criteria or filters to find jobs.'
                  : 'Create your first processing job to transform documents into structured data.'
                }
                action={
                  !(searchTerm || selectedStatus !== 'all' || selectedType !== 'all' || selectedProject !== 'all') ? {
                    label: 'Create First Job',
                    onClick: () => setShowCreateDialog(true),
                  } : undefined
                }
              />
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedJobs.size === jobs.length && jobs.length > 0}
                    onChange={selectAllJobs}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1 grid grid-cols-6 sm:grid-cols-12 gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-gray-700">
                    <div className="col-span-2 sm:col-span-3">Job Details</div>
                    <div className="col-span-1 sm:col-span-2">Status</div>
                    <div className="col-span-1 sm:col-span-2 hidden sm:block">Type</div>
                    <div className="col-span-1 sm:col-span-2 hidden sm:block">Project</div>
                    <div className="col-span-1 sm:col-span-2 hidden lg:block">Created</div>
                    <div className="col-span-1 sm:col-span-1">Actions</div>
                  </div>
                </div>
              </div>

              {/* Jobs List */}
              <div className="divide-y divide-gray-200">
                {jobs.map((job, index) => {
                  const project = projects.find(p => p.id === job.project_id);
                  const document = documents.find(d => d.id === job.document_id);
                  
                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-6 py-4 hover:bg-blue-50/30 transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedJobs.has(job.id)}
                          onChange={() => toggleJobSelection(job.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        
                        <div className="flex-1 grid grid-cols-6 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
                          {/* Job Details */}
                          <div className="col-span-2 sm:col-span-3">
                            <div className="flex items-center space-x-3">
                              <StatusIcon status={job.status} size="sm" />
                              <div className="min-w-0">
                                <button
                                  onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
                                  className="font-medium text-gray-900 hover:text-blue-700 transition-colors text-left truncate block w-full text-sm"
                                >
                                  {formatJobType(job.type)}
                                </button>
                                {document && (
                                  <p className="text-xs sm:text-sm text-gray-500 truncate hidden sm:block">{document.name}</p>
                                )}
                                {job.error && (
                                  <p className="text-xs text-red-600 truncate mt-1 hidden lg:block">
                                    Error: {job.error}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="col-span-1 sm:col-span-2">
                            <div className="space-y-1">
                              <StatusBadge status={job.status} />
                              {job.status === 'processing' && (
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                  <div className="w-12 sm:w-16 bg-blue-100 rounded-full h-1.5">
                                    <div 
                                      className="bg-gradient-to-r from-blue-600 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                                      style={{ width: `${job.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-blue-600 font-medium hidden sm:inline">{job.progress}%</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Type */}
                          <div className="col-span-1 sm:col-span-2 hidden sm:block">
                            <Badge variant="outline" className="text-xs">
                              {formatJobType(job.type)}
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1 capitalize hidden lg:block">
                              {job.source}
                            </div>
                          </div>

                          {/* Project */}
                          <div className="col-span-1 sm:col-span-2 hidden sm:block">
                            {project ? (
                              <button
                                onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                                className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 transition-colors"
                              >
                                <Folder className="w-4 h-4" />
                                <span className="truncate">{project.name}</span>
                              </button>
                            ) : (
                              <span className="text-xs sm:text-sm text-gray-400">No project</span>
                            )}
                          </div>

                          {/* Created */}
                          <div className="col-span-1 sm:col-span-2 hidden lg:block">
                            <div className="text-xs sm:text-sm text-gray-900">{formatDate(job.created_at)}</div>
                            {job.completed_at && (
                              <div className="text-xs text-gray-500">
                                Completed {formatDate(job.completed_at)}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="col-span-1 sm:col-span-1">
                            <div className="flex items-center justify-end space-x-1">
                              {job.status === 'pending' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleJobAction(job.id, 'start')}
                                  disabled={startJob.isPending}
                                  title="Start Job"
                                  className="hidden sm:flex"
                                >
                                  <Play className="w-4 h-4" />
                                </Button>
                              )}
                              
                              {['pending', 'processing'].includes(job.status) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleJobAction(job.id, 'cancel')}
                                  disabled={cancelJob.isPending}
                                  title="Cancel Job"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 hidden sm:flex"
                                >
                                  <Square className="w-4 h-4" />
                                </Button>
                              )}
                              
                              {job.status === 'failed' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleJobAction(job.id, 'retry')}
                                  disabled={retryJob.isPending}
                                  title="Retry Job"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 hidden sm:flex"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              
                              {/* Mobile Actions Menu */}
                              <div className="sm:hidden">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="More actions"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              {jobsData && jobsData.total_pages > 1 && (
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-xs sm:text-sm text-gray-700">
                      Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, jobsData.total)} of {jobsData.total} jobs
                    </div>
                    
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-2 sm:px-3"
                      >
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                      </Button>
                      
                      <div className="hidden sm:flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, jobsData.total_pages) }, (_, i) => {
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
                      
                      {/* Mobile page indicator */}
                      <div className="sm:hidden text-xs text-gray-600 px-2">
                        {currentPage} / {jobsData.total_pages}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(jobsData.total_pages, currentPage + 1))}
                        disabled={currentPage === jobsData.total_pages}
                        className="px-2 sm:px-3"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">Next</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ParscadeCard>
      </div>

      {/* Create Job Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Processing Job</DialogTitle>
            <DialogDescription>
              Create a new document processing workflow to transform data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job_type">Job Type</Label>
                <select
                  id="job_type"
                  value={createForm.type}
                  onChange={(e) => setCreateForm({ ...createForm, type: e.target.value as JobType })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="parse_document">Parse Document</option>
                  <option value="extract_text">Extract Text</option>
                  <option value="analyze_structure">Analyze Structure</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_source">Data Source</Label>
                <select
                  id="job_source"
                  value={createForm.source}
                  onChange={(e) => setCreateForm({ ...createForm, source: e.target.value as JobSource })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="upload">Uploaded Document</option>
                  <option value="url">URL</option>
                  <option value="s3">S3 Storage</option>
                </select>
              </div>
            </div>

            {createForm.source === 'upload' && (
              <div className="space-y-2">
                <Label htmlFor="document_id">Document</Label>
                <select
                  id="document_id"
                  value={createForm.document_id || ''}
                  onChange={(e) => setCreateForm({ ...createForm, document_id: e.target.value || undefined })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a document...</option>
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({formatBytes(doc.size)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {createForm.source === 'url' && (
              <div className="space-y-2">
                <Label htmlFor="source_url">Source URL</Label>
                <Input
                  id="source_url"
                  value={createForm.source_url || ''}
                  onChange={(e) => setCreateForm({ ...createForm, source_url: e.target.value || undefined })}
                  placeholder="https://example.com/document.pdf"
                />
              </div>
            )}

            {createForm.source === 's3' && (
              <div className="space-y-2">
                <Label htmlFor="source_key">S3 Key</Label>
                <Input
                  id="source_key"
                  value={createForm.source_key || ''}
                  onChange={(e) => setCreateForm({ ...createForm, source_key: e.target.value || undefined })}
                  placeholder="bucket/path/to/document.pdf"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="project_id">Project (Optional)</Label>
              <select
                id="project_id"
                value={createForm.project_id || ''}
                onChange={(e) => setCreateForm({ ...createForm, project_id: e.target.value || undefined })}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_attempts">Max Attempts</Label>
                <Input
                  id="max_attempts"
                  type="number"
                  min="1"
                  max="10"
                  value={createForm.max_attempts}
                  onChange={(e) => setCreateForm({ ...createForm, max_attempts: parseInt(e.target.value) || 3 })}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setCreateForm({
                    type: 'parse_document',
                    source: 'upload',
                    metadata: {},
                    options: {},
                    max_attempts: 3,
                  });
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateJob}
                disabled={createJob.isPending || (
                  createForm.source === 'upload' && !createForm.document_id ||
                  createForm.source === 'url' && !createForm.source_url ||
                  createForm.source === 's3' && !createForm.source_key
                )}
                className="w-full sm:w-auto"
              >
                {createJob.isPending ? 'Creating...' : 'Create Job'}
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
        title={`${bulkAction ? bulkAction.charAt(0).toUpperCase() + bulkAction.slice(1) : ''} Jobs`}
        description={`Are you sure you want to ${bulkAction} ${selectedJobs.size} selected job${selectedJobs.size !== 1 ? 's' : ''}?`}
        confirmText={`${bulkAction ? bulkAction.charAt(0).toUpperCase() + bulkAction.slice(1) : ''} Jobs`}
        variant={bulkAction === 'delete' ? 'destructive' : 'default'}
        isLoading={startJob.isPending || cancelJob.isPending || deleteJob.isPending}
      />
    </DashboardLayout>
  );
};

export default JobsPage;