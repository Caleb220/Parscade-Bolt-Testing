/**
 * Account API endpoints with typed responses
 */

import { apiClient } from './client';
import type { User, ApiKey, NotificationPrefs, Webhook, Session, SecurityEvent, Service, DataSource } from '@/lib/types';
import type { ProfileFormData, ApiKeyFormData, WebhookFormData, NotificationPrefsFormData, DataSourceFormData } from '@/lib/validation/account';

interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly hasNext: boolean;
  };
}

export const accountAPI = {
  // Profile endpoints
  async getMe(): Promise<User> {
    return apiClient.get<User>('/v1/account/me');
  },

  async updateProfile(data: ProfileFormData): Promise<User> {
    return apiClient.patch<User>('/v1/account/me', data);
  },

  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.uploadFile('/v1/account/avatar', formData);
  },

  // API Keys endpoints
  async getApiKeys(): Promise<readonly ApiKey[]> {
    const response = await apiClient.get<PaginatedResponse<ApiKey>>('/v1/keys');
    return response.data;
  },

  async createApiKey(data: ApiKeyFormData): Promise<ApiKey & { key: string }> {
    return apiClient.post<ApiKey & { key: string }>('/v1/keys', data);
  },

  async revokeApiKey(id: string): Promise<void> {
    return apiClient.delete<void>(`/v1/keys/${id}`, { retryable: false });
  },

  async regenerateApiKey(id: string): Promise<ApiKey & { key: string }> {
    return apiClient.post<ApiKey & { key: string }>(`/v1/keys/${id}/regenerate`, undefined, { retryable: false });
  },

  // Sessions endpoints
  async getSessions(): Promise<readonly Session[]> {
    const response = await apiClient.get<PaginatedResponse<Session>>('/v1/account/sessions');
    return response.data;
  },

  async revokeSession(id: string): Promise<void> {
    return apiClient.delete<void>(`/v1/account/sessions/${id}`, { retryable: false });
  },

  async revokeAllSessions(): Promise<void> {
    return apiClient.delete<void>('/v1/account/sessions', { retryable: false });
  },

  // Security events endpoints
  async getSecurityEvents(): Promise<readonly SecurityEvent[]> {
    const response = await apiClient.get<PaginatedResponse<SecurityEvent>>('/v1/account/security-events', {
      limit: 20,
    });
    return response.data;
  },

  // Notifications endpoints
  async getNotificationPrefs(): Promise<NotificationPrefs> {
    return apiClient.get<NotificationPrefs>('/v1/notifications/preferences');
  },

  async updateNotificationPrefs(data: NotificationPrefsFormData): Promise<NotificationPrefs> {
    return apiClient.put<NotificationPrefs>('/v1/notifications/preferences', data);
  },

  // Webhooks endpoints
  async getWebhooks(): Promise<readonly Webhook[]> {
    const response = await apiClient.get<PaginatedResponse<Webhook>>('/v1/integrations/webhooks');
    return response.data;
  },

  async createWebhook(data: WebhookFormData): Promise<Webhook & { secret: string }> {
    return apiClient.post<Webhook & { secret: string }>('/v1/integrations/webhooks', data);
  },

  async updateWebhook(id: string, data: Partial<WebhookFormData>): Promise<Webhook> {
    return apiClient.patch<Webhook>(`/v1/integrations/webhooks/${id}`, data);
  },

  async deleteWebhook(id: string): Promise<void> {
    return apiClient.delete<void>(`/v1/integrations/webhooks/${id}`, { retryable: false });
  },

  async testWebhook(id: string): Promise<{ status: number; latency: number; response?: string }> {
    return apiClient.post<{ status: number; latency: number; response?: string }>(
      `/v1/integrations/webhooks/${id}/test`
    );
  },

  // Services endpoints
  async getServices(): Promise<readonly Service[]> {
    return apiClient.get<readonly Service[]>('/v1/integrations/services');
  },

  async connectService(serviceId: string): Promise<{ redirect_url: string }> {
    return apiClient.post<{ redirect_url: string }>(`/v1/integrations/services/${serviceId}/connect`);
  },

  async disconnectService(serviceId: string): Promise<void> {
    return apiClient.delete<void>(`/v1/integrations/services/${serviceId}`, { retryable: false });
  },

  // Data sources endpoints
  async getDataSources(): Promise<readonly DataSource[]> {
    const response = await apiClient.get<PaginatedResponse<DataSource>>('/v1/integrations/data-sources');
    return response.data;
  },

  async createDataSource(data: DataSourceFormData): Promise<DataSource> {
    return apiClient.post<DataSource>('/v1/integrations/data-sources', data);
  },

  async updateDataSource(id: string, data: Partial<DataSourceFormData>): Promise<DataSource> {
    return apiClient.patch<DataSource>(`/v1/integrations/data-sources/${id}`, data);
  },

  async deleteDataSource(id: string): Promise<void> {
    return apiClient.delete<void>(`/v1/integrations/data-sources/${id}`, { retryable: false });
  },

  async testDataSource(id: string): Promise<{ status: 'success' | 'error'; message: string }> {
    return apiClient.post<{ status: 'success' | 'error'; message: string }>(
      `/v1/integrations/data-sources/${id}/test`
    );
  },
} as const;