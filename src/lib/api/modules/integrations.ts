/**
 * Integrations API Module
 * Fully aligned with OpenAPI schema definitions using snake_case
 */

import type {
  paths,
  Webhook,
  WebhookListResponse,
  WebhookWithSecret,
  CreateWebhookRequest,
  WebhookTestResult,
  ConnectedService,
  ServiceConnectionResponse,
  DataSource,
  DataSourceListResponse,
  CreateDataSourceRequest,
} from '@/types/api-types';

import { apiClient } from '../client';

// Extract exact types from OpenAPI paths
type GetWebhooksResponse =
  paths['/v1/integrations/webhooks']['get']['responses']['200']['content']['application/json'];
type CreateWebhookResponse =
  paths['/v1/integrations/webhooks']['post']['responses']['201']['content']['application/json'];
type TestWebhookResponse =
  paths['/v1/integrations/webhooks/{webhookId}/test']['post']['responses']['200']['content']['application/json'];
type GetServicesResponse =
  paths['/v1/integrations/services']['get']['responses']['200']['content']['application/json'];
type ConnectServiceResponse =
  paths['/v1/integrations/services/{serviceId}/connect']['post']['responses']['200']['content']['application/json'];
type GetDataSourcesResponse =
  paths['/v1/integrations/data-sources']['get']['responses']['200']['content']['application/json'];
type CreateDataSourceResponse =
  paths['/v1/integrations/data-sources']['post']['responses']['201']['content']['application/json'];

/**
 * Integrations endpoints
 * All endpoints follow OpenAPI schema exactly with snake_case
 */
export const integrationsApi = {
  /**
   * Get webhooks with proper data extraction
   */
  async getWebhooks(): Promise<Webhook[]> {
    try {
      const response = await apiClient.get<GetWebhooksResponse>('/v1/integrations/webhooks');
      return response.data || [];
    } catch (error) {
      return [];
    }
  },

  /**
   * Create new webhook
   */
  async createWebhook(data: CreateWebhookRequest): Promise<WebhookWithSecret> {
    return apiClient.post<CreateWebhookResponse>('/v1/integrations/webhooks', data);
  },

  /**
   * Delete webhook
   */
  async deleteWebhook(webhookId: string): Promise<void> {
    return apiClient.delete<void>(`/v1/integrations/webhooks/${webhookId}`, {
      retryable: false,
    });
  },

  /**
   * Test webhook
   */
  async testWebhook(webhookId: string): Promise<WebhookTestResult> {
    return apiClient.post<TestWebhookResponse>(`/v1/integrations/webhooks/${webhookId}/test`);
  },

  /**
   * Get connected services
   */
  async getServices(): Promise<ConnectedService[]> {
    try {
      return apiClient.get<GetServicesResponse>('/v1/integrations/services');
    } catch (error) {
      return [];
    }
  },

  /**
   * Connect service
   */
  async connectService(serviceId: string): Promise<ServiceConnectionResponse> {
    return apiClient.post<ConnectServiceResponse>(`/v1/integrations/services/${serviceId}/connect`);
  },

  /**
   * Disconnect service
   */
  async disconnectService(serviceId: string): Promise<void> {
    return apiClient.delete<void>(`/v1/integrations/services/${serviceId}`, {
      retryable: false,
    });
  },

  /**
   * Get data sources with proper data extraction
   */
  async getDataSources(): Promise<DataSource[]> {
    try {
      const response = await apiClient.get<GetDataSourcesResponse>('/v1/integrations/data-sources');
      return response.data || [];
    } catch (error) {
      return [];
    }
  },

  /**
   * Create new data source
   */
  async createDataSource(data: CreateDataSourceRequest): Promise<DataSource> {
    return apiClient.post<CreateDataSourceResponse>('/v1/integrations/data-sources', data);
  },

  /**
   * Delete data source
   */
  async deleteDataSource(sourceId: string): Promise<void> {
    return apiClient.delete<void>(`/v1/integrations/data-sources/${sourceId}`, {
      retryable: false,
    });
  },
} as const;
