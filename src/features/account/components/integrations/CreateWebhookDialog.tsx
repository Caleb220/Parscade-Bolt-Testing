import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, CheckCircle } from 'lucide-react';
import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { webhookSchema, type WebhookFormData } from '@/lib/validation/account';
import { Button } from '@/shared/components/ui/button';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { useCreateWebhook } from '@/shared/hooks/api/useAccountData';
import { useClipboard } from '@/shared/hooks/useClipboard';

interface CreateWebhookDialogProps {
  onSuccess: () => void;
}

const CreateWebhookDialog: React.FC<CreateWebhookDialogProps> = ({ onSuccess }) => {
  const { copy } = useClipboard();
  const createWebhook = useCreateWebhook();
  const [newWebhookSecret, setNewWebhookSecret] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      url: '',
      events: ['job.completed'],
      active: true,
    },
  });

  const handleCreateWebhook = useCallback(async (data: WebhookFormData) => {
    try {
      const result = await createWebhook.mutateAsync(data);
      setNewWebhookSecret(result.secret);
      reset();
    } catch (error) {
      // Error handled by mutation
    }
  }, [createWebhook, reset]);

  const handleDone = useCallback(() => {
    setNewWebhookSecret(null);
    onSuccess();
  }, [onSuccess]);

  return (
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
          <Button onClick={handleDone} className="w-full">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleCreateWebhook)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook_url">Webhook URL</Label>
            <Input
              id="webhook_url"
              {...register('url')}
              placeholder="https://your-app.com/webhook"
            />
            {errors.url && (
              <p className="text-sm text-red-600">{errors.url.message}</p>
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
                    {...register('events')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{event}</span>
                </label>
              ))}
            </div>
            {errors.events && (
              <p className="text-sm text-red-600">{errors.events.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={watch('active')}
              onCheckedChange={(checked) => setValue('active', checked)}
            />
            <Label>Active</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onSuccess}
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
  );
};

export default React.memo(CreateWebhookDialog);