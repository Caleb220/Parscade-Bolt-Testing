/**
 * Integrations Tab Component - Enhanced with Backend Integration
 * Comprehensive integrations management with webhooks, services, and data sources
 * Updated to use snake_case field names matching OpenAPI schema
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { 
  Webhook, 
  Plus, 
  Trash2, 
  TestTube, 
  Database,
  RefreshCw,
  AlertCircle as AlertIcon,
  Shield,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';

import { getErrorMessage } from '@/lib/api';
import { webhookSchema, dataSourceSchema, type WebhookFormData, type DataSourceFormData } from '@/lib/validation/account';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Switch } from '@/shared/components/ui/switch';
import { useToast } from '@/shared/components/ui/use-toast';
import ConfirmationDialog from '@/shared/components/ui/confirmation-dialog';
import StatusBadge from '@/shared/components/ui/status-badge';
import { formatDate } from '@/shared/utils/date';
import { useAccountContext } from '../AccountLayout';
import { 
  useWebhooks, 
  useCreateWebhook, 
  useDeleteWebhook,
  useTestWebhook,
  useServices,
  useConnectService,
  useDisconnectService,
  useDataSources,
  useCreateDataSource,
  useDeleteDataSource,
  useTestDataSource
} from '@/shared/hooks/api/useAccountData';

const IntegrationsTab: React.FC = () => {
  const { user } = useAccountContext();
  const { toast } = useToast();
  
  const { data: webhooks, isLoading: webhooksLoading, error: webhooksError } = useWebhooks();
  const { data: services, isLoading: servicesLoading, error: servicesError } = useServices();
  const { data: dataSources, isLoading: dataSourcesLoading, error: dataSourcesError } = useDataSources();
  
  const createWebhook = useCreateWebhook();
  const deleteWebhook = useDeleteWebhook();
  const testWebhook = useTestWebhook();
  const connectService = useConnectService();
  const disconnectService = useDisconnectService();
  const createDataSource = useCreateDataSource();
  const deleteDataSource = useDeleteDataSource();
  const testDataSource = useTestDataSource();

  const [showNewWebhookDialog, setShowNewWebhookDialog] = useState(false);
  const [showNewDataSourceDialog, setShowNewDataSourceDialog] = useState(false);
  const [newWebhookSecret, setNewWebhookSecret] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [confirmDeleteWebhook, setConfirmDeleteWebhook] = useState<string | null>(null);
  const [confirmDeleteDataSource, setConfirmDeleteDataSource] = useState<string | null>(null);

  const {
    register: registerWebhook,
    handleSubmit: handleWebhookSubmit,
    formState: { errors: webhookErrors },
    reset: resetWebhook,
    watch: watchWebhook,
    setValue: setWebhookValue,
  } = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      url: '',
      events: ['job.completed'],
      active: true,
    },
  });

  const {
    register: registerDataSource,
    handleSubmit: handleDataSourceSubmit,
    formState: { errors: dataSourceErrors },
    reset: resetDataSource,
    watch: watchDataSource,
  } = useForm<DataSourceFormData>({
    resolver: zodResolver(dataSourceSchema),
    defaultValues: {
      name: '',
      type: 's3',
      config: {},
    },
  });

  const watchedDataSourceType = watchDataSource('type');

  const onCreateWebhook = async (data: WebhookFormData) => {
    try {
      const result = await createWebhook.mutateAsync(data);
      setNewWebhookSecret(result.secret);
      resetWebhook();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const onTestWebhook = async (webhookId: string, webhookUrl: string) => {
    try {
      const result = await testWebhook.mutateAsync(webhookId);
      setTestResults({ ...testResults, [webhookId]: result });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const onDeleteWebhook = async (webhookId: string) => {
    try {
      await deleteWebhook.mutateAsync(webhookId);
      setConfirmDeleteWebhook(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const onCreateDataSource = async (data: DataSourceFormData) => {
    try {
      await createDataSource.mutateAsync(data);
      resetDataSource();
      setShowNewDataSourceDialog(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const onDeleteDataSource = async (sourceId: string) => {
    try {
      await deleteDataSource.mutateAsync(sourceId);
      setConfirmDeleteDataSource(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const onTestDataSource = async (sourceId: string, sourceName: string) => {
    try {
      const result = await testDataSource.mutateAsync(sourceId);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Webhooks Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Webhook className="w-5 h-5 mr-2" />
            Webhooks
          </CardTitle>
          <CardDescription>
            Configure webhooks to receive real-time notifications about events
          </CardDescription>
          <div className="mt-4">
            <Dialog open={showNewWebhookDialog} onOpenChange={setShowNewWebhookDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Webhook
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Webhook</DialogTitle>
                  <DialogDescription>
                    Add a new webhook endpoint to receive notifications
                  </DialogDescription>
                </DialogHeader>
                
                {newWebhookSecret ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-medium text-green-900">Webhook Created</span>
                      </div>
                      <p className="text-sm text-green-700 mb-3">
                        Save this webhook secret - it won't be shown again for security.
                      </p>
                      <div className="space-y-2">
                        <Label>Webhook Secret</Label>
                        <div className="flex items-center space-x-2">
                          <Input value={newWebhookSecret} readOnly className="font-mono text-sm" />
                          <Button
                            size="sm"
                            onClick={() => copy(newWebhookSecret, 'Webhook secret')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setNewWebhookSecret(null);
                        setShowNewWebhookDialog(false);
                      }}
                      className="w-full"
                    >
                      Done
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleWebhookSubmit(onCreateWebhook)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhook_url">Webhook URL</Label>
                      <Input
                        id="webhook_url"
                        {...registerWebhook('url')}
                        placeholder="https://your-app.com/webhook"
                      />
                      {webhookErrors.url && (
                        <p className="text-sm text-red-600">{webhookErrors.url.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Events to Subscribe</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'job.completed',
                          'job.failed', 
                          'document.processed',
                          'document.failed'
                        ].map((event) => (
                          <label key={event} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              value={event}
                              {...registerWebhook('events')}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{event}</span>
                          </label>
                        ))}
                      </div>
                      {webhookErrors.events && (
                        <p className="text-sm text-red-600">{webhookErrors.events.message}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={watchWebhook('active')}
                        onCheckedChange={(checked) => setWebhookValue('active', checked)}
                      />
                      <Label>Active</Label>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewWebhookDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createWebhook.isPending}>
                        {createWebhook.isPending ? 'Creating...' : 'Create Webhook'}
                      </Button>
                    </div>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {webhooksLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : webhooksError ? (
            <div className="text-center py-8">
              <AlertIcon className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-600 mb-4">{getErrorMessage(webhooksError)}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : !webhooks?.length ? (
            <div className="text-center py-8">
              <Webhook className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No webhooks configured</h3>
              <p className="text-gray-600 mb-4">
                Webhooks allow you to receive real-time notifications when events occur in your account, 
                such as completed document processing or system alerts.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className="p-4 border border-gray-200 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">{webhook.url}</h4>
                        <StatusBadge status={webhook.active ? 'active' : 'inactive'} />
                        {webhook.secret_set && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Secured
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">
                        Created {formatDate(webhook.created_at)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onTestWebhook(webhook.id, webhook.url)}
                        disabled={testWebhook.isPending}
                      >
                        <TestTube className="w-4 h-4 mr-1" />
                        {testWebhook.isPending ? 'Testing...' : 'Test'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirmDeleteWebhook(webhook.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Test Results */}
                  {testResults[webhook.id] && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg text-sm ${
                        testResults[webhook.id].status === 200
                          ? 'bg-green-50 border border-green-200 text-green-800'
                          : 'bg-red-50 border border-red-200 text-red-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {testResults[webhook.id].status === 200 ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span>
                          Status: {testResults[webhook.id].status} • 
                          Latency: {testResults[webhook.id].latency}ms
                        </span>
                      </div>
                      {testResults[webhook.id].response && (
                        <pre className="mt-2 text-xs bg-black/5 p-2 rounded overflow-auto max-h-20">
                          {testResults[webhook.id].response}
                        </pre>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connected Services */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Services</CardTitle>
          <CardDescription>
            Connect third-party services to enhance your workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : servicesError ? (
            <div className="text-center py-8">
              <AlertIcon className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-600">{getErrorMessage(servicesError)}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services?.map((service) => (
                <div
                  key={service.id}
                  className="p-4 border border-gray-200 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    {service.icon_url ? (
                      <img src={service.icon_url} alt={service.name} className="w-8 h-8 rounded" />
                    ) : (
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <Database className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-500">{service.description}</div>
                      {service.connected && service.last_sync && (
                        <div className="text-xs text-gray-400">
                          Last sync: {formatDate(service.last_sync)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {service.connected ? (
                      <>
                        <StatusBadge status="active" className="text-xs" />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => disconnectService.mutate(service.id)}
                          disabled={disconnectService.isPending}
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => connectService.mutate(service.id)}
                        disabled={connectService.isPending}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              )) || (
                <div className="col-span-2 text-center py-8">
                  <Database className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No services available</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Sources */}
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
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Data Source</DialogTitle>
                  <DialogDescription>
                    Connect a new data source for automated processing
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleDataSourceSubmit(onCreateDataSource)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ds_name">Source Name</Label>
                    <Input
                      id="ds_name"
                      {...registerDataSource('name')}
                      placeholder="My S3 Bucket"
                    />
                    {dataSourceErrors.name && (
                      <p className="text-sm text-red-600">{dataSourceErrors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ds_type">Type</Label>
                    <select
                      id="ds_type"
                      {...registerDataSource('type')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="s3">Amazon S3</option>
                      <option value="gcs">Google Cloud Storage</option>
                      <option value="azure">Azure Blob Storage</option>
                      <option value="supabase">Supabase Storage</option>
                    </select>
                    {dataSourceErrors.type && (
                      <p className="text-sm text-red-600">{dataSourceErrors.type.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewDataSourceDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createDataSource.isPending}>
                      {createDataSource.isPending ? 'Adding...' : 'Add Source'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
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
                Data sources enable automated document processing from cloud storage services like S3, 
                Google Drive, or Dropbox. Documents uploaded to connected sources are processed automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dataSources.map((source) => (
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
                        <StatusBadge status={source.status as any} className="text-xs" />
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
                      onClick={() => onTestDataSource(source.id, source.name)}
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

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={!!confirmDeleteWebhook}
        onClose={() => setConfirmDeleteWebhook(null)}
        onConfirm={() => {
          if (confirmDeleteWebhook) onDeleteWebhook(confirmDeleteWebhook);
        }}
        title="Delete Webhook"
        description="Are you sure you want to delete this webhook? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteWebhook.isPending}
      />

      <ConfirmationDialog
        isOpen={!!confirmDeleteDataSource}
        onClose={() => setConfirmDeleteDataSource(null)}
        onConfirm={() => {
          if (confirmDeleteDataSource) onDeleteDataSource(confirmDeleteDataSource);
        }}
        title="Delete Data Source"
        description="Are you sure you want to delete this data source? This will stop automated processing."
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteDataSource.isPending}
      />
    </motion.div>
  );
};

export default IntegrationsTab;