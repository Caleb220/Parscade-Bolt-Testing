/**
 * Performance Monitoring with Web Vitals
 * Tracks and reports key performance metrics
 */

import { onCLS, onFCP, onFID, onLCP, onTTFB, onINP } from 'web-vitals';

import type { Metric } from 'web-vitals';

export interface PerformanceMetrics {
  CLS?: number;  // Cumulative Layout Shift
  FCP?: number;  // First Contentful Paint
  FID?: number;  // First Input Delay
  LCP?: number;  // Largest Contentful Paint
  TTFB?: number; // Time to First Byte
  INP?: number;  // Interaction to Next Paint
}

export interface PerformanceReport {
  metrics: PerformanceMetrics;
  timestamp: number;
  url: string;
  userAgent: string;
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private reportCallback?: (report: PerformanceReport) => void;
  private reportThreshold = 5000; // Report every 5 seconds
  private reportTimer?: NodeJS.Timeout;
  private enabled = true;

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined') return;

    // Core Web Vitals
    onCLS(this.handleMetric.bind(this));
    onFCP(this.handleMetric.bind(this));
    onFID(this.handleMetric.bind(this));
    onLCP(this.handleMetric.bind(this));
    onTTFB(this.handleMetric.bind(this));
    onINP(this.handleMetric.bind(this));

    // Custom performance marks
    this.observeCustomMarks();

    // Navigation timing
    this.observeNavigationTiming();

    // Resource timing
    this.observeResourceTiming();
  }

  private handleMetric(metric: Metric) {
    if (!this.enabled) return;

    // Store metric
    this.metrics[metric.name as keyof PerformanceMetrics] = metric.value;

    // Log in development
    if (import.meta.env.DEV) {
      const rating = metric.rating || 'none';
      const color = rating === 'good' ? 'green' : rating === 'needs-improvement' ? 'orange' : 'red';
      console.log(`%c[Performance] ${metric.name}: ${metric.value.toFixed(2)}ms (${rating})`, `color: ${color}`);
    }

    // Schedule report
    this.scheduleReport();
  }

  private observeCustomMarks() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'mark' || entry.entryType === 'measure') {
            this.handleCustomMetric(entry);
          }
        }
      });

      observer.observe({ entryTypes: ['mark', 'measure'] });
    } catch (error) {
      console.warn('Failed to observe performance marks:', error);
    }
  }

  private observeNavigationTiming() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.handleNavigationMetrics(navEntry);
          }
        }
      });

      observer.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      console.warn('Failed to observe navigation timing:', error);
    }
  }

  private observeResourceTiming() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceResourceTiming[];
        const slowResources = entries.filter(entry => entry.duration > 1000);

        if (slowResources.length > 0 && import.meta.env.DEV) {
          console.warn('[Performance] Slow resources detected:', slowResources.map(r => ({
            name: r.name,
            duration: r.duration,
            type: r.initiatorType
          })));
        }
      });

      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.warn('Failed to observe resource timing:', error);
    }
  }

  private handleCustomMetric(entry: PerformanceEntry) {
    if (import.meta.env.DEV) {
      console.log(`[Performance] Custom ${entry.entryType}: ${entry.name} = ${entry.duration}ms`);
    }
  }

  private handleNavigationMetrics(entry: PerformanceNavigationTiming) {
    const metrics = {
      domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      domComplete: entry.domComplete - entry.domInteractive,
      loadComplete: entry.loadEventEnd - entry.loadEventStart,
      domInteractive: entry.domInteractive - entry.fetchStart,
      redirect: entry.redirectEnd - entry.redirectStart,
      dns: entry.domainLookupEnd - entry.domainLookupStart,
      tcp: entry.connectEnd - entry.connectStart,
      request: entry.responseStart - entry.requestStart,
      response: entry.responseEnd - entry.responseStart,
    };

    if (import.meta.env.DEV) {
      console.log('[Performance] Navigation metrics:', metrics);
    }
  }

  private scheduleReport() {
    if (this.reportTimer) {
      clearTimeout(this.reportTimer);
    }

    this.reportTimer = setTimeout(() => {
      this.sendReport();
    }, this.reportThreshold);
  }

  private sendReport() {
    if (!this.reportCallback || Object.keys(this.metrics).length === 0) return;

    const report: PerformanceReport = {
      metrics: { ...this.metrics },
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo(),
    };

    this.reportCallback(report);
  }

  private getConnectionInfo() {
    const nav = navigator as any;
    if (!nav.connection) return undefined;

    return {
      effectiveType: nav.connection.effectiveType,
      downlink: nav.connection.downlink,
      rtt: nav.connection.rtt,
    };
  }

  // Public API

  /**
   * Enable or disable monitoring
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Set callback for performance reports
   */
  onReport(callback: (report: PerformanceReport) => void) {
    this.reportCallback = callback;
  }

  /**
   * Manually trigger a report
   */
  report() {
    this.sendReport();
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Mark a custom timing
   */
  mark(name: string) {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
    }
  }

  /**
   * Measure between two marks
   */
  measure(name: string, startMark: string, endMark?: string) {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        if (endMark) {
          window.performance.measure(name, startMark, endMark);
        } else {
          window.performance.measure(name, startMark);
        }
      } catch (error) {
        console.warn(`Failed to measure ${name}:`, error);
      }
    }
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = {};
  }
}

// Singleton instance
let instance: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!instance) {
    instance = new PerformanceMonitor();
  }
  return instance;
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = getPerformanceMonitor();

  return {
    mark: monitor.mark.bind(monitor),
    measure: monitor.measure.bind(monitor),
    getMetrics: monitor.getMetrics.bind(monitor),
    report: monitor.report.bind(monitor),
  };
}

// Initialize monitoring and send to analytics
export function initializePerformanceMonitoring(analyticsEndpoint?: string) {
  const monitor = getPerformanceMonitor();

  monitor.onReport((report) => {
    // Log in development
    if (import.meta.env.DEV) {
      console.log('[Performance Report]', report);
    }

    // Send to analytics endpoint if provided
    if (analyticsEndpoint) {
      fetch(analyticsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      }).catch((error) => {
        console.error('Failed to send performance report:', error);
      });
    }

    // Check for performance issues
    const { metrics } = report;
    const issues = [];

    if (metrics.LCP && metrics.LCP > 2500) {
      issues.push(`Slow LCP: ${metrics.LCP.toFixed(0)}ms (target: <2500ms)`);
    }

    if (metrics.FID && metrics.FID > 100) {
      issues.push(`High FID: ${metrics.FID.toFixed(0)}ms (target: <100ms)`);
    }

    if (metrics.CLS && metrics.CLS > 0.1) {
      issues.push(`High CLS: ${metrics.CLS.toFixed(3)} (target: <0.1)`);
    }

    if (issues.length > 0 && import.meta.env.DEV) {
      console.warn('[Performance Issues Detected]', issues);
    }
  });

  return monitor;
}

export default PerformanceMonitor;