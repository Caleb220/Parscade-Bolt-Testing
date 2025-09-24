/**
 * Exports Manager Component
 * Data export interface with real backend integration
 */

import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Database,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import React, { useState } from 'react';

import { ParscadeCard, ParscadeButton } from '@/shared/components/brand';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import ConfirmationDialog from '@/shared/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Skeleton } from '@/shared/components/ui/skeleton';
import StatusBadge from '@/shared/components/ui/status-badge';
import { 
  useExports, 
  useCreateExport, 
  useCancelExport 
} from '@/shared/hooks/api/useExports';
import { formatDate, formatBytes } from '@/shared/utils/formatters';
import type { ExportCreateData } from '@/types/dashboard-types';

interface ExportsManagerProps {
  className?: string;
}

/**
 * Data export management interface
 */
const ExportsManager: React.FC<ExportsManagerProps> = ({ className = '' }) => {
  const { data: exportsData, isLoading, error, refetch } = useExports({ page: 1, limit: 10 });
  const createExport = useCreateExport();
  const cancelExport = useCancelExport();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [exportForm, setExportForm] = useState<ExportCreateData>({
    type: 'documents',
    format: 'csv',
    filters: {},
  });

  const exports = exportsData?.data || [];

  const handleCreateExport = async () => {
    try {
      await createExport.mutateAsync(exportForm);
      setShowCreateDialog(false);
      setExportForm({ type: 'documents', format: 'csv', filters: {} });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCancelExport = async (exportId: string) => {
    try {
      await cancelExport.mutateAsync(exportId);
      setConfirmCancel(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  if (isLoading) {
    return (
      <ParscadeCard variant="default" className={`p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </ParscadeCard>
    );
  }

  if (error) {
    return (
      <ParscadeCard variant="default" className={`p-6 ${className}`}>
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load exports</h3>
          <p className="text-gray-600 mb-4">Unable to fetch export data</p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </ParscadeCard>
    );
  }

  return (
    <ParscadeCard variant="default" className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Download className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Data Exports</h2>
            <p className="text-sm text-blue-600 hidden sm:block">Export your documents and processing data</p>
          </div>
        </div>

          <ParscadeButton
            variant="primary"
            size="sm"
            className="hidden sm:flex"
            onClick={() => setShowCreateDialog(true)}
          >
            <Download className="w-4 h-4 mr-2" /> New Export
          </ParscadeButton>

          <ParscadeButton
            variant="primary"
            size="sm"
            className="sm:hidden"
            aria-label="New Export"
            onClick={() => setShowCreateDialog(true)}
          >
            <Download className="w-4 h-4" />
          </ParscadeButton>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Data Export</DialogTitle>
              <DialogDescription>
                Export your documents or job data in CSV or JSON format.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Type</Label>
                  <select
                    value={exportForm.type}
                    onChange={(e) => setExportForm({ ...exportForm, type: e.target.value as any })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="documents">Documents</option>
                    <option value="jobs">Processing Jobs</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label>Format</Label>
                  <select
                    value={exportForm.format}
                    onChange={(e) => setExportForm({ ...exportForm, format: e.target.value as any })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date (Optional)</Label>
                  <Input
                    type="date"
                    value={exportForm.filters?.start_date || ''}
                    onChange={(e) => setExportForm({ 
                      ...exportForm, 
                      filters: { ...exportForm.filters, start_date: e.target.value || undefined }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>End Date (Optional)</Label>
                  <Input
                    type="date"
                    value={exportForm.filters?.end_date || ''}
                    onChange={(e) => setExportForm({ 
                      ...exportForm, 
                      filters: { ...exportForm.filters, end_date: e.target.value || undefined }
                    })}
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    setExportForm({ type: 'documents', format: 'csv', filters: {} });
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateExport}
                  disabled={createExport.isPending}
                  className="w-full sm:w-auto"
                >
                  {createExport.isPending ? 'Creating...' : 'Create Export'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Exports List */}
      {exports.length === 0 ? (
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-parscade"
          >
            <Download className="w-6 h-6 text-blue-500" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exports yet</h3>
          <p className="text-slate-600 mb-4">
            Create your first data export to download your documents or processing data.
          </p>
          <ParscadeButton 
            variant="primary" 
            size="sm"
            onClick={() => setShowCreateDialog(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            Create First Export
          </ParscadeButton>
        </div>
      ) : (
        <div className="space-y-3">
          {exports.map((exportItem, index) => (
            <motion.div
              key={exportItem.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 sm:p-4 border border-slate-200 rounded-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                    {exportItem.type === 'documents' ? (
                      <FileText className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Database className="w-5 h-5 text-purple-600" />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                        {exportItem.type === 'documents' ? 'Documents' : 'Processing Jobs'} Export
                      </h4>
                      <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {exportItem.format.toUpperCase()}
                        </Badge>
                        <StatusBadge status={exportItem.status as any} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-0.5 sm:space-y-1">
                    <div>Created {formatDate(exportItem.created_at)}</div>
                    {exportItem.completed_at && (
                      <div className="hidden sm:block">Completed {formatDate(exportItem.completed_at)}</div>
                    )}
                    {exportItem.file_size && (
                      <div>Size: {formatBytes(exportItem.file_size)}</div>
                    )}
                    {exportItem.error_message && (
                      <div className="text-red-600 truncate">Error: {exportItem.error_message}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 sm:space-x-2 self-end sm:self-center">
                  {exportItem.status === 'completed' && exportItem.download_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(exportItem.download_url!, '_blank')}
                      className="text-xs sm:text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  )}
                  
                  {exportItem.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmCancel(exportItem.id)}
                      className="text-xs sm:text-sm"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation */}
      <ConfirmationDialog
        isOpen={!!confirmCancel}
        onClose={() => setConfirmCancel(null)}
        onConfirm={() => confirmCancel && handleCancelExport(confirmCancel)}
        title="Cancel Export"
        description="Are you sure you want to cancel this export? This action cannot be undone."
        confirmText="Cancel Export"
        variant="destructive"
        isLoading={cancelExport.isPending}
      />
    </ParscadeCard>
  );
};

export default ExportsManager;