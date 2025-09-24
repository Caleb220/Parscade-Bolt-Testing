import { motion } from 'framer-motion';
import {
  Webhook,
  Plus,
  TestTube,
  Trash2,
  AlertCircle as AlertIcon,
  Shield,
  CheckCircle,
  XCircle,
  Copy
} from 'lucide-react';
import React, { useState, useCallback } from 'react';

import { getErrorMessage } from '@/lib/api';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import ConfirmationDialog from '@/shared/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Skeleton } from '@/shared/components/ui/skeleton';
import StatusBadge from '@/shared/components/ui/status-badge';
import {
  useWebhooks,
  useCreateWebhook,
  useDeleteWebhook,
  useTestWebhook
} from '@/shared/hooks/api/useAccountData';
import { useClipboard } from '@/shared/hooks/useClipboard';
import { formatDate } from '@/shared/utils/date';

import CreateWebhookDialog from './CreateWebhookDialog';

const WebhooksSection: React.FC = () => {
  const { copy } = useClipboard();

  const { data: webhooks, isLoading: webhooksLoading, error: webhooksError } = useWebhooks();
  const deleteWebhook = useDeleteWebhook();
  const testWebhook = useTestWebhook();

  const [showNewWebhookDialog, setShowNewWebhookDialog] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [confirmDeleteWebhook, setConfirmDeleteWebhook] = useState<string | null>(null);

  const handleTestWebhook = useCallback(async (webhookId: string, webhookUrl: string) => {
    try {
      const result = await testWebhook.mutateAsync(webhookId);
      setTestResults({ ...testResults, [webhookId]: result });
    } catch (error) {
      // Error handled by mutation
    }
  }, [testWebhook, testResults]);

  const handleDeleteWebhook = useCallback(async (webhookId: string) => {
    try {
      await deleteWebhook.mutateAsync(webhookId);
      setConfirmDeleteWebhook(null);
    } catch (error) {
      // Error handled by mutation
    }
  }, [deleteWebhook]);

  const handleWebhookCreated = useCallback(() => {
    setShowNewWebhookDialog(false);
  }, []);

  return (
    <>
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
              <CreateWebhookDialog onSuccess={handleWebhookCreated} />
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
                        onClick={() => handleTestWebhook(webhook.id, webhook.url)}
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

      <ConfirmationDialog
        isOpen={!!confirmDeleteWebhook}
        onClose={() => setConfirmDeleteWebhook(null)}
        onConfirm={() => {
          if (confirmDeleteWebhook) handleDeleteWebhook(confirmDeleteWebhook);
        }}
        title="Delete Webhook"
        description="Are you sure you want to delete this webhook? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteWebhook.isPending}
      />
    </>
  );
};

export default React.memo(WebhooksSection);