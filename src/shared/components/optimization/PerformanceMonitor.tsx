import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Wifi, Zap, Package, Clock } from 'lucide-react';

import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { getPreloadStats } from '@/shared/hooks/usePreload';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  bundleSize: number;
  preloadedChunks: number;
}

interface PerformanceMonitorProps {
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  compact?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  show = import.meta.env?.MODE === 'development',
  position = 'bottom-right',
  compact = false
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
    bundleSize: 0,
    preloadedChunks: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const networkStatus = useNetworkStatus();

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  useEffect(() => {
    if (!show) return;

    const updateMetrics = () => {
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        const preloadStats = getPreloadStats();

        const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
        const lcp = performance.getEntriesByType('largest-contentful-paint')[0];

        setMetrics({
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          firstContentfulPaint: fcp?.startTime || 0,
          largestContentfulPaint: lcp?.startTime || 0,
          firstInputDelay: 0, // Would need to measure with event listener
          cumulativeLayoutShift: 0, // Would need layout shift observer
          bundleSize: 0, // Would need to calculate from chunks
          preloadedChunks: preloadStats.cacheSize,
        });
      } catch (error) {
        console.warn('Performance monitoring error:', error);
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  const getPerformanceGrade = (metric: number, thresholds: [number, number]) => {
    if (metric <= thresholds[0]) return 'good';
    if (metric <= thresholds[1]) return 'needs-improvement';
    return 'poor';
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const networkQuality = networkStatus.isSlowConnection ? 'slow' : 'fast';
  const networkColor = networkStatus.isOnline
    ? (networkStatus.isSlowConnection ? 'text-yellow-600' : 'text-green-600')
    : 'text-red-600';

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50 bg-black bg-opacity-90 text-white rounded-lg shadow-xl border border-gray-700`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-3">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Performance</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wifi className={`w-3 h-3 ${networkColor}`} />
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs"
            >
              ▼
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 space-y-2 overflow-hidden"
            >
              {/* Core Web Vitals */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>FCP</span>
                    <span className={`px-1 rounded text-xs ${getGradeColor(getPerformanceGrade(metrics.firstContentfulPaint, [1800, 3000]))}`}>
                      {formatTime(metrics.firstContentfulPaint)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>LCP</span>
                    <span className={`px-1 rounded text-xs ${getGradeColor(getPerformanceGrade(metrics.largestContentfulPaint, [2500, 4000]))}`}>
                      {formatTime(metrics.largestContentfulPaint)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Package className="w-3 h-3 mr-1" />
                      Chunks
                    </span>
                    <span className="text-green-400">{metrics.preloadedChunks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      Network
                    </span>
                    <span className={networkColor}>
                      {networkStatus.effectiveType || 'unknown'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Network Details */}
              <div className="border-t border-gray-600 pt-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-400">Downlink:</span>
                    <span className="ml-1">{networkStatus.downlink.toFixed(1)} Mbps</span>
                  </div>
                  <div>
                    <span className="text-gray-400">RTT:</span>
                    <span className="ml-1">{networkStatus.rtt}ms</span>
                  </div>
                </div>
              </div>

              {/* Optimization Status */}
              <div className="border-t border-gray-600 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Optimizations:</span>
                  <div className="flex space-x-1">
                    <span className="px-1 bg-green-600 text-white rounded text-xs">Chunks</span>
                    <span className="px-1 bg-green-600 text-white rounded text-xs">Lazy</span>
                    <span className="px-1 bg-green-600 text-white rounded text-xs">Preload</span>
                  </div>
                </div>
              </div>

              {/* Bundle Info */}
              <div className="border-t border-gray-600 pt-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Build:</span>
                  <span className="text-green-400">Optimized</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-400">Reconnects:</span>
                  <span className="text-blue-400">{networkStatus.reconnectAttempts}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PerformanceMonitor;

// Hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
    bundleSize: 0,
    preloadedChunks: 0,
  });

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({ ...prev, largestContentfulPaint: entry.startTime }));
        }
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          setMetrics(prev => ({
            ...prev,
            cumulativeLayoutShift: prev.cumulativeLayoutShift + (entry as any).value
          }));
        }
      });
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });

    return () => observer.disconnect();
  }, []);

  return metrics;
};