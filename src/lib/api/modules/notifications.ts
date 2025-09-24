import type { NotificationPreferencesFormData } from '@/lib/validation/account';

/**
 * Notifications API Module
 * Fully aligned with OpenAPI schema definitions using snake_case
 */

import type { 
  paths,
  NotificationPreferences,
  NotificationPreferencesUpdate
} from '@/types/api-types';

import { apiClient } from '../client';

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
    return await apiClient.get<GetNotificationPreferencesResponse>('/v1/notifications/preferences');
  },

  /**
   * Update notification preferences
   */
  async updatePreferences(updates: NotificationPreferencesUpdate): Promise<NotificationPreferences> {
    return await apiClient.put<UpdateNotificationPreferencesResponse>('/v1/notifications/preferences', updates);
  },
} as const;