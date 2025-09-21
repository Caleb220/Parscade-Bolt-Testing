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
import { notificationSettingsSchema, type NotificationSettings } from '@/shared/schemas/account/accountSettings';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useToast } from '@/shared/components/ui/use-toast';
import { useNotificationPreferences, useUpdateNotificationPreferences } from '@/shared/hooks/api/useAccountData';

import { useAccountContext } from '../AccountLayout';

const NotificationsTab = () => {
  const { user } = useAccountContext();
  const { toast } = useToast();
  const { data: prefs, isLoading, error, refetch } = useNotificationPreferences();
  const updatePrefs = useUpdateNotificationPreferences();

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
      accountUpdates: true,
      productUpdates: false,
      marketingEmails: false,
      teamMemberActivity: true,
      projectChanges: true,
      processingAlerts: true,
      errorNotifications: true,
      maintenanceAlerts: true,
      frequency: 'real-time',
      quietHours: {
        start: '22:00',
        end: '08:00',
        enabled: false,
      },
    },
  });

  // Reset form when prefs data changes
  React.useEffect(() => {
    if (prefs) {
      reset({
        accountUpdates: prefs.accountUpdates,
        productUpdates: prefs.productUpdates,
        marketingEmails: prefs.marketingEmails,
        teamMemberActivity: prefs.teamMemberActivity,
        projectChanges: prefs.projectChanges,
        processingAlerts: prefs.processingAlerts,
        errorNotifications: prefs.errorNotifications,
        maintenanceAlerts: prefs.maintenanceAlerts,
        frequency: prefs.frequency,
        quietHours: prefs.quietHours || {
          start: '22:00',
          end: '08:00',
          enabled: false,
        },
      });
    }
  }, [prefs, reset]);

  const watchedQuietHours = watch('quietHours');

  const onSubmit = async (data: NotificationSettings) => {
    try {
      await updatePrefs.mutateAsync(data);
      
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
        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Control which email notifications you receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'accountUpdates' as const, label: 'Account Updates', description: 'Security changes, profile updates' },
              { key: 'productUpdates' as const, label: 'Product Updates', description: 'New features, improvements' },
              { key: 'marketingEmails' as const, label: 'Marketing Emails', description: 'Newsletter, promotions' },
              { key: 'teamMemberActivity' as const, label: 'Team Activity', description: 'Team member actions' },
              { key: 'projectChanges' as const, label: 'Project Changes', description: 'Project updates, status changes' },
              { key: 'processingAlerts' as const, label: 'Processing Alerts', description: 'Document processing status' },
              { key: 'errorNotifications' as const, label: 'Error Notifications', description: 'System errors, failures' },
              { key: 'maintenanceAlerts' as const, label: 'Maintenance Alerts', description: 'Scheduled maintenance' },
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{label}</div>
                  <div className="text-sm text-gray-500">{description}</div>
                </div>
                <Switch
                  checked={watch(key) || false}
                  onCheckedChange={(checked) => setValue(key, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notification Frequency */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Frequency</CardTitle>
            <CardDescription>
              Choose how often you want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['real-time', 'daily', 'weekly', 'monthly'].map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setValue('frequency', freq as any)}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    watch('frequency') === freq
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium capitalize">{freq.replace('-', ' ')}</div>
                </button>
            ))}
            </div>
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Quiet Hours
            </CardTitle>
            <CardDescription>
              Set times when you don't want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="quiet_start">Start Time</Label>
                <Input
                  id="quiet_start"
                  type="time"
                  {...register('quietHours.start')}
                  className="px-3"
                />
                {errors.quietHours?.start && (
                  <p className="text-sm text-red-600">{errors.quietHours.start.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quiet_end">End Time</Label>
                <Input
                  id="quiet_end"
                  type="time"
                  {...register('quietHours.end')}
                  className="px-3"
                />
                {errors.quietHours?.end && (
                  <p className="text-sm text-red-600">{errors.quietHours.end.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <Switch
                  checked={watchedQuietHours?.enabled || false}
                  onCheckedChange={(checked) => setValue('quietHours.enabled', checked)}
                />
                <span className="ml-3 text-sm text-gray-700">Enable quiet hours</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Quiet Hours:</strong> When enabled, you won't receive notifications during the specified hours.
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