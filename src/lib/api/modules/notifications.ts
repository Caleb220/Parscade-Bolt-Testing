/**
 * Notifications API Module
 * Fully aligned with OpenAPI schema definitions using snake_case
 */

import { apiClient } from '../client';
import type { 
  paths,
  NotificationPreferences,
  NotificationPreferencesUpdate
} from '@/types/api-types';

// Extract exact types from OpenAPI paths
type GetNotificationPreferencesResponse = paths['/v1/notifications/preferences']['get']['responses']['200']['content']['application/json'];
type UpdateNotificationPreferencesRequest = paths['/v1/notifications/preferences']['put']['requestBody']['content']['application/json'];
type UpdateNotificationPreferencesResponse = paths['/v1/notifications/preferences']['put']['responses']['200']['content']['application/json'];

/**
 * Notification preferences endpoints
 * All endpoints follow OpenAPI schema exactly with snake_case
 */
export const notificationsApi = {
  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<NotificationPreferences> {
    try {
      return await apiClient.get<GetNotificationPreferencesResponse>('/v1/notifications/preferences');
    } catch (error) {
      // If endpoint doesn't exist yet, return sensible defaults
      console.warn('Notification preferences endpoint not available, using defaults');
      return {
        channels: {
          email: true,
          in_app: true,
          webhook: false,
        },
        categories: {
          product: 'immediate',
          billing: 'immediate',
          incidents: 'immediate',
          jobs: 'immediate',
          digest: 'daily',
        },
        dnd_settings: {
          start: '22:00',
          end: '08:00',
          timezone: 'UTC',
        },
        webhook_url: null,
      };
    }
  },

  /**
   * Update notification preferences
   */
  async updatePreferences(updates: NotificationPreferencesUpdate): Promise<NotificationPreferences> {
    return await apiClient.put<UpdateNotificationPreferencesResponse>('/v1/notifications/preferences', updates);
  },
} as const;