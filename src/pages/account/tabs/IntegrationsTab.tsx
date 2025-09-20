/**
 * Integrations Tab Component
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
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  ExternalLink
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

import { useAccountContext } from '../AccountLayout';
import { 
  useWebhooks, 
  useCreateWebhook, 
  useTestWebhook,
  useServices,
  useDataSources,
  useCreateDataSource
} from '@/hooks/api/useAccountData';
import { webhookSchema, dataSourceSchema, type WebhookFormData, type DataSourceFormData } from '@/lib/validation/account';

const IntegrationsTab: React.FC = () => {
  const { user } = useAccountContext();
  const { toast } = useToast();
  
  const { data: webhooks, isLoading: webhooksLoading } = useWebhooks();
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: dataSources, isLoading: dataSourcesLoading } = useDataSources();
  
  const createWebhook = useCreateWebhook();
  const testWebhook = useTestWebhook();
  const createDataSource = useCreateDataSource();

  const [showNewWebhookDialog, setShowNewWebhookDialog] = useState(false);
  const [showNewDataSourceDialog, setShowNewDataSourceDialog] = useState(false);
  const [newWebhookSecret, setNewWebhookSecret] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  const {
    register: registerWebhook,
    handleSubmit: handleWebhookSubmit,
    formState: { errors: webhookErrors },
    reset: resetWebhook,
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
  } = useForm<DataSourceFormData>({
    resolver: zodResolver(dataSourceSchema),
    defaultValues: {
      name: '',
      type: 's3',
      config: {},
    },
  });

  const onCreateWebhook = async (data: WebhookFormData) => {
    try {
      const result = await createWebhook.mutateAsync(data);
      setNewWebhookSecret(result.secret);
      resetWebhook();
      toast({
        title: 'Webhook created',
        description: 'Your webhook has been created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Creation failed',
        description: 'Failed to create webhook. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const onTestWebhook = async (webhookId: string) => {
    try {
      const result = await testWebhook.mutateAsync(webhookId);
      setTestResults({ ...testResults, [webhookId]: result });
      toast({
        title: 'Test completed',
        description: `Webhook test ${result.status === 200 ? 'successful' : 'failed'}`,
        variant: result.status === 200 ? 'default' : 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Test failed',
        description: 'Failed to test webhook.',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Webhook secret copied to clipboard.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Webhooks Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center">
              <Webhook className="w-5 h-5 mr-2" />
              Webhooks
            </CardTitle>
            <CardDescription>
              Configure webhooks to receive real-time notifications
            </CardDescription>
          </div>
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
                      Save this secret - it won't be shown again.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Input value={newWebhookSecret} readOnly className="font-mono text-sm" />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(newWebhookSecret)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
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
                    <Label>Events</Label>
                    <div className="space-y-2">
                      {['job.completed', 'job.failed', 'document.processed', 'account.updated'].map((event) => (
                        <label key={event} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={event}
                            {...registerWebhook('events')}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{event}</span>
                        </label>
                      ))}
                    </div>
                    {webhookErrors.events && (
                      <p className="text-sm text-red-600">{webhookErrors.events.message}</p>
                    )}
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
        </CardHeader>
        <CardContent>
          {webhooksLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : !webhooks?.length ? (
            <div className="text-center py-8">
              <Webhook className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No webhooks configured</p>
              <p className="text-gray-500 text-sm">Add a webhook to receive real-time notifications</p>
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
                        <h4 className="font-medium text-gray-900">{webhook.url}</h4>
                        <Badge variant={webhook.active ? 'default' : 'secondary'}>
                          {webhook.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">
                        Created {new Date(webhook.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onTestWebhook(webhook.id)}
                        disabled={testWebhook.isPending}
                      >
                        <TestTube className="w-4 h-4 mr-1" />
                        Test
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Test Results */}
                  {testResults[webhook.id] && (
                    <div className={`p-3 rounded-lg text-sm ${
                      testResults[webhook.id].status === 200
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
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
                    </div>
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services?.map((service) => (
                <div
                  key={service.id}
                  className="p-4 border border-gray-200 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    {service.icon_url ? (
                      <img src={service.icon_url} alt={service.name} className="w-8 h-8" />
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
                          Last sync: {new Date(service.last_sync).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {service.connected ? (
                      <>
                        <Badge variant="default" className="text-xs">Connected</Badge>
                        <Button size="sm" variant="outline">
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button size="sm">Connect</Button>
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Data Sources
            </CardTitle>
            <CardDescription>
              Configure data sources for automated document processing
            </CardDescription>
          </div>
          <Dialog open={showNewDataSourceDialog} onOpenChange={setShowNewDataSourceDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Source
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Data Source</DialogTitle>
                <DialogDescription>
                  Connect a new data source for automated processing
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleDataSourceSubmit(async (data) => {
                try {
                  await createDataSource.mutateAsync(data);
                  resetDataSource();
                  setShowNewDataSourceDialog(false);
                  toast({
                    title: 'Data source added',
                    description: 'Your data source has been configured successfully.',
                  });
                } catch (error) {
                  toast({
                    title: 'Creation failed',
                    description: 'Failed to create data source.',
                    variant: 'destructive',
                  });
                }
              })} className="space-y-4">
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
        </CardHeader>
        <CardContent>
          {dataSourcesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !dataSources?.length ? (
            <div className="text-center py-8">
              <Database className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No data sources configured</p>
              <p className="text-gray-500 text-sm">Add a data source to automate document processing</p>
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
                        <Badge 
                          variant={source.status === 'active' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {source.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 capitalize">{source.type}</div>
                      {source.last_sync && (
                        <div className="text-xs text-gray-400">
                          Last sync: {new Date(source.last_sync).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <TestTube className="w-4 h-4 mr-1" />
                      Test
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IntegrationsTab;