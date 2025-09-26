/**
 * Analytics Utilities
 * Provides privacy-focused analytics tracking
 */

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

/**
 * Analytics service for tracking user events
 */
class Analytics {
  private isInitialized = false;
  private apiKey: string | null = null;

  init(apiKey: string): void {
    this.apiKey = apiKey;
    this.isInitialized = true;
  }

  track(event: AnalyticsEvent): void {
    if (!this.isInitialized || !this.apiKey) return;

    if (import.meta.env?.MODE === 'development') {
      return;
    }
  }

  page(path: string, properties?: Record<string, any>): void {
    this.track({
      name: 'page_view',
      properties: {
        path,
        ...properties,
      },
    });
  }
}

export const analytics = new Analytics();

/**
 * Track page view
 */
export const trackPageView = (path: string): void => {
  analytics.page(path, {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    referrer: document.referrer,
  });
};

/**
 * Track user action
 */
export const trackEvent = (name: string, properties?: Record<string, any>): void => {
  analytics.track({
    name,
    properties: {
      timestamp: new Date().toISOString(),
      ...properties,
    },
  });
};
