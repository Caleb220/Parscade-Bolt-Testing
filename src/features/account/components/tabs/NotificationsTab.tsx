/**
 * Notifications Tab Component - Enhanced with Backend Integration
 * Comprehensive notification preferences management with real-time validation
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Bell, Mail, Smartphone, Webhook, Clock, Save, AlertCircle, CheckCircle } from 'lucide-react';

import { getErrorMessage } from '@/lib/api';
import { notificationSettingsSchema, type NotificationSettings } from '@/shared/schemas/schemas/account/accountSettings';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useToast } from '@/shared/components/ui/use-toast';
import { useNotificationPrefs, useUpdateNotificationPrefs } from '@/shared/hooks/api/useAccountData';

import { formatDate } from '@/shared/utils/formatters';
import { useAccountContext } from '../AccountLayout';

const NotificationsTab = () => {
  const { user } = useAccountContext();
  const { toast } = useToast();
  const { data: prefs, isLoading, error, refetch } = useNotificationPrefs();
  const updatePrefs = useUpdateNotificationPrefs();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<NotificationSettings>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      channels: { email: true, in_app: true, webhook: false },
      categories: {
        product: 'immediate',
        billing: 'immediate',
        incidents: 'immediate',
        jobs: 'immediate',
        digest: 'daily',
      },
      dnd: {
        start: '22:00',
        end: '08:00',
        timezone: 'UTC',
      },
      webhook_url: '',
    },
  });

  // Reset form when prefs data changes
  React.useEffect(() => {
    if (prefs) {
      reset({
        channels: prefs.channels,
        categories: prefs.categories,
        dnd: prefs.dnd || {
          start: '22:00',
          end: '08:00',
          timezone: 'UTC',
        },
        webhook_url: prefs.webhook_url || '',
      });
    }
  }, [prefs, reset]);

  const watchedChannels = watch('channels');
  const watchedCategories = watch('categories');
  const watchedDnd = watch('dnd');

  const onSubmit = async (data: NotificationSettings) => {
    try {
      // Clean up webhook_url if webhook channel is disabled
      const cleanedData = {
        ...data,
        webhook_url: data.channels.webhook ? data.webhook_url : '',
        dnd: data.dnd?.start && data.dnd?.end ? data.dnd : undefined,
      };

      await updatePrefs.mutateAsync(cleanedData);
      
      toast({
        title: 'Notifications updated',
        description: 'Your notification preferences have been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: getErrorMessage(error),
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

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load preferences</h3>
            <p className="text-gray-600 mb-4">{getErrorMessage(error)}</p>
            <Button onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
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
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-2"
              >
                <Label htmlFor="webhook_url">Webhook URL</Label>
                <Input
                  id="webhook_url"
                  {...register('webhook_url')}
                  placeholder="https://your-app.com/webhooks/notifications"
                  className="px-3"
                />
                {errors.webhook_url && (
                  <p className="text-sm text-red-600">{errors.webhook_url.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  We'll send POST requests to this URL with notification data
                </p>
              </motion.div>
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
              <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{label}</div>
                  <div className="text-sm text-gray-500">{description}</div>
                </div>
                <div className="flex space-x-1">
                  {(['off', 'immediate', 'daily'] as const).map((frequency) => (
                    <label key={frequency} className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="radio"
                        value={frequency}
                        {...register(`categories.${key}`)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm capitalize whitespace-nowrap">{frequency}</span>
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
                  className="px-3"
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
                  className="px-3"
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
                  <option value="Europe/London">London</option>
                  <option value="Europe/Berlin">Berlin</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
                {errors.dnd?.timezone && (
                  <p className="text-sm text-red-600">{errors.dnd.timezone.message}</p>
                )}
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Do Not Disturb:</strong> When enabled, you won't receive notifications during the specified hours.
                Email notifications will be delayed until the quiet period ends.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Errors */}
        {updatePrefs.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
            <span className="text-sm text-red-700">
              {getErrorMessage(updatePrefs.error)}
            </span>
          </motion.div>
        )}

        {/* Success Message */}
        {updatePrefs.isSuccess && !isDirty && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
            <span className="text-sm text-green-700">
              Notification preferences updated successfully
            </span>
          </motion.div>
        )}

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