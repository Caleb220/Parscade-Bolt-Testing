import { Database, Plus, TestTube, Trash2, AlertCircle as AlertIcon } from 'lucide-react';
import React, { useState, useCallback } from 'react';

import { getErrorMessage } from '@/lib/api';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import ConfirmationDialog from '@/shared/components/ui/confirmation-dialog';
import { Dialog, DialogTrigger } from '@/shared/components/ui/dialog';
import { Skeleton } from '@/shared/components/ui/skeleton';
import StatusBadge from '@/shared/components/ui/status-badge';
import {
  useDataSources,
  useDeleteDataSource,
  useTestDataSource,
} from '@/shared/hooks/api/useAccountData';
import { formatDate } from '@/shared/utils/date';

import CreateDataSourceDialog from './CreateDataSourceDialog';

const DataSourcesSection: React.FC = () => {
  const {
    data: dataSources,
    isLoading: dataSourcesLoading,
    error: dataSourcesError,
  } = useDataSources();
  const deleteDataSource = useDeleteDataSource();
  const testDataSource = useTestDataSource();

  const [showNewDataSourceDialog, setShowNewDataSourceDialog] = useState(false);
  const [confirmDeleteDataSource, setConfirmDeleteDataSource] = useState<string | null>(null);

  const handleTestDataSource = useCallback(
    async (sourceId: string, _sourceName: string) => {
      try {
        await testDataSource.mutateAsync(sourceId);
      } catch {
        // Error handled by mutation
      }
    },
    [testDataSource]
  );

  const handleDeleteDataSource = useCallback(
    async (sourceId: string) => {
      try {
        await deleteDataSource.mutateAsync(sourceId);
        setConfirmDeleteDataSource(null);
      } catch {
        // Error handled by mutation
      }
    },
    [deleteDataSource]
  );

  const handleDataSourceCreated = useCallback(() => {
    setShowNewDataSourceDialog(false);
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Data Sources
          </CardTitle>
          <CardDescription>
            Configure data sources for automated document processing
          </CardDescription>
          <div className="mt-4">
            <Dialog open={showNewDataSourceDialog} onOpenChange={setShowNewDataSourceDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Source
                </Button>
              </DialogTrigger>
              <CreateDataSourceDialog onSuccess={handleDataSourceCreated} />
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {dataSourcesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : dataSourcesError ? (
            <div className="text-center py-8">
              <AlertIcon className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-600">{getErrorMessage(dataSourcesError)}</p>
            </div>
          ) : !dataSources?.length ? (
            <div className="text-center py-8">
              <Database className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No data sources configured</h3>
              <p className="text-gray-600 mb-4">
                Data sources enable automated document processing from cloud storage services like
                S3, Google Drive, or Dropbox. Documents uploaded to connected sources are processed
                automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dataSources.map(source => (
                <div
                  key={source.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{source.name}</span>
                        <StatusBadge status={source.status as 'active' | 'inactive' | 'error'} className="text-xs" />
                      </div>
                      <div className="text-sm text-gray-500 capitalize">{source.type}</div>
                      {source.last_sync && (
                        <div className="text-xs text-gray-400">
                          Last sync: {formatDate(source.last_sync)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestDataSource(source.id, source.name)}
                      disabled={testDataSource.isPending}
                    >
                      <TestTube className="w-4 h-4 mr-1" />
                      Test
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmDeleteDataSource(source.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={!!confirmDeleteDataSource}
        onClose={() => setConfirmDeleteDataSource(null)}
        onConfirm={() => {
          if (confirmDeleteDataSource) handleDeleteDataSource(confirmDeleteDataSource);
        }}
        title="Delete Data Source"
        description="Are you sure you want to delete this data source? This will stop automated processing."
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteDataSource.isPending}
      />
    </>
  );
};

export default React.memo(DataSourcesSection);
