/**
 * Notifications Tab Component
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Bell, Mail, Smartphone, Webhook, Clock, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

import { useAccountContext } from '../AccountLayout';
import { useNotificationPrefs, useUpdateNotificationPrefs } from '@/hooks/api/useAccountData';
import { notificationPrefsSchema, type NotificationPrefsFormData } from '@/lib/validation/account';

const NotificationsTab: React.FC = () => {
  const { user } = useAccountContext();
  const { toast } = useToast();
  const { data: prefs, isLoading } = useNotificationPrefs();
  const updatePrefs = useUpdateNotificationPrefs();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<NotificationPrefsFormData>({
    resolver: zodResolver(notificationPrefsSchema),
    defaultValues: prefs || {
      channels: { email: true, in_app: true, webhook: false },
      categories: {
        product: 'immediate',
        billing: 'immediate',
        incidents: 'immediate',
        jobs: 'immediate',
        digest: 'daily',
      },
    },
  });

  // Reset form when prefs data changes
  React.useEffect(() => {
    if (prefs) {
      reset(prefs);
    }
  }, [prefs, reset]);

  const watchedChannels = watch('channels');
  const watchedCategories = watch('categories');

  const onSubmit = async (data: NotificationPrefsFormData) => {
    try {
      await updatePrefs.mutateAsync(data);
      toast({
        title: 'Notifications updated',
        description: 'Your notification preferences have been saved.',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Failed to update notification preferences.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-11" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Notification Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notification Channels
            </CardTitle>
            <CardDescription>
              Choose how you want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Email Notifications</div>
                  <div className="text-sm text-gray-500">Receive notifications via email</div>
                </div>
              </div>
              <Switch
                checked={watchedChannels?.email || false}
                onCheckedChange={(checked) => setValue('channels.email', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">In-App Notifications</div>
                  <div className="text-sm text-gray-500">Show notifications in the app</div>
                </div>
              </div>
              <Switch
                checked={watchedChannels?.in_app || false}
                onCheckedChange={(checked) => setValue('channels.in_app', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Webhook className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Webhook Notifications</div>
                  <div className="text-sm text-gray-500">Send notifications to a webhook URL</div>
                </div>
              </div>
              <Switch
                checked={watchedChannels?.webhook || false}
                onCheckedChange={(checked) => setValue('channels.webhook', checked)}
              />
            </div>

            {watchedChannels?.webhook && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="webhook_url">Webhook URL</Label>
                <Input
                  id="webhook_url"
                  {...register('webhook_url')}
                  placeholder="https://your-app.com/webhooks/notifications"
                />
                {errors.webhook_url && (
                  <p className="text-sm text-red-600">{errors.webhook_url.message}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Categories</CardTitle>
            <CardDescription>
              Control when you receive different types of notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'product' as const, label: 'Product Updates', description: 'New features and improvements' },
              { key: 'billing' as const, label: 'Billing', description: 'Payment confirmations and invoices' },
              { key: 'incidents' as const, label: 'Incidents', description: 'Service outages and issues' },
              { key: 'jobs' as const, label: 'Job Status', description: 'Document processing updates' },
              { key: 'digest' as const, label: 'Weekly Digest', description: 'Summary of your activity' },
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{label}</div>
                  <div className="text-sm text-gray-500">{description}</div>
                </div>
                <div className="flex space-x-2">
                  {['off', 'immediate', 'daily'].map((frequency) => (
                    <label key={frequency} className="flex items-center space-x-1">
                      <input
                        type="radio"
                        value={frequency}
                        {...register(`categories.${key}`)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm capitalize">{frequency}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Do Not Disturb */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Do Not Disturb
            </CardTitle>
            <CardDescription>
              Set quiet hours when you don't want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dnd_start">Start Time</Label>
                <Input
                  id="dnd_start"
                  type="time"
                  {...register('dnd.start')}
                />
                {errors.dnd?.start && (
                  <p className="text-sm text-red-600">{errors.dnd.start.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dnd_end">End Time</Label>
                <Input
                  id="dnd_end"
                  type="time"
                  {...register('dnd.end')}
                />
                {errors.dnd?.end && (
                  <p className="text-sm text-red-600">{errors.dnd.end.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dnd_timezone">Timezone</Label>
                <select
                  id="dnd_timezone"
                  {...register('dnd.timezone')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
                {errors.dnd?.timezone && (
                  <p className="text-sm text-red-600">{errors.dnd.timezone.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button - Sticky on Mobile */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6 sm:static sm:bg-transparent sm:border-t-0 sm:p-0 sm:mx-0">
          <Button
            type="submit"
            disabled={!isDirty || updatePrefs.isPending}
            className="w-full sm:w-auto"
          >
            {updatePrefs.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default NotificationsTab;