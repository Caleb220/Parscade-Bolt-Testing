import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PreloadOptions {
  /** Preload after specified delay (ms) */
  delay?: number;
  /** Only preload on hover */
  onHover?: boolean;
  /** Only preload when component is visible */
  onVisible?: boolean;
  /** Preload immediately */
  immediate?: boolean;
  /** Priority for preloading (higher = sooner) */
  priority?: 'low' | 'normal' | 'high';
}

interface UsePreloadReturn {
  preload: () => Promise<void>;
  isPreloading: boolean;
  isPreloaded: boolean;
  error: Error | null;
}

// Global preload cache to avoid duplicate requests
const preloadCache = new Map<string, Promise<any>>();
const preloadQueue: Array<{ loader: () => Promise<any>; priority: number }> = [];
let isProcessingQueue = false;

// Process preload queue with priorities
const processPreloadQueue = async () => {
  if (isProcessingQueue || preloadQueue.length === 0) return;

  isProcessingQueue = true;

  // Sort by priority (high = 3, normal = 2, low = 1)
  preloadQueue.sort((a, b) => b.priority - a.priority);

  // Process up to 2 items concurrently to avoid overwhelming
  const batch = preloadQueue.splice(0, 2);

  await Promise.allSettled(batch.map(item => item.loader()));

  isProcessingQueue = false;

  // Continue processing if more items in queue
  if (preloadQueue.length > 0) {
    requestIdleCallback(() => processPreloadQueue());
  }
};

/**
 * Hook for preloading React.lazy components
 */
export const usePreload = (
  moduleLoader: () => Promise<any>,
  routePath?: string,
  options: PreloadOptions = {}
): UsePreloadReturn => {
  const {
    delay = 0,
    onHover = false,
    onVisible = false,
    immediate = false,
    priority = 'normal',
  } = options;

  const [isPreloading, setIsPreloading] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const cacheKey = routePath || moduleLoader.toString();

  const priorityValue = { low: 1, normal: 2, high: 3 }[priority];

  const preload = async (): Promise<void> => {
    if (isPreloaded || isPreloading) return;

    // Check cache first
    if (preloadCache.has(cacheKey)) {
      try {
        await preloadCache.get(cacheKey);
        setIsPreloaded(true);
      } catch (err) {
        setError(err as Error);
      }
      return;
    }

    setIsPreloading(true);
    setError(null);

    const loaderPromise = moduleLoader().catch(err => {
      setError(err);
      throw err;
    });

    preloadCache.set(cacheKey, loaderPromise);

    try {
      await loaderPromise;
      setIsPreloaded(true);
    } catch (err) {
      preloadCache.delete(cacheKey);
      setError(err as Error);
    } finally {
      setIsPreloading(false);
    }
  };

  const schedulePreload = () => {
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        preloadQueue.push({ loader: preload, priority: priorityValue });
        processPreloadQueue();
      }, delay);
    } else {
      preloadQueue.push({ loader: preload, priority: priorityValue });
      processPreloadQueue();
    }
  };

  useEffect(() => {
    if (immediate) {
      schedulePreload();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [immediate]);

  return {
    preload: onHover || onVisible ? schedulePreload : preload,
    isPreloading,
    isPreloaded,
    error,
  };
};

/**
 * Hook for intersection-based preloading
 */
export const useIntersectionPreload = (
  moduleLoader: () => Promise<any>,
  routePath?: string,
  options: PreloadOptions & { threshold?: number } = {}
) => {
  const { threshold = 0.1, ...preloadOptions } = options;
  const [elementRef, setElementRef] = useState<Element | null>(null);
  const preloadHook = usePreload(moduleLoader, routePath, {
    ...preloadOptions,
    onVisible: true,
  });

  useEffect(() => {
    if (!elementRef || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            preloadHook.preload();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(elementRef);

    return () => observer.disconnect();
  }, [elementRef, threshold]);

  return {
    ...preloadHook,
    ref: setElementRef,
  };
};

/**
 * Hook for route-based preloading
 */
export const useRoutePreload = (routes: Record<string, () => Promise<any>>) => {
  const navigate = useNavigate();

  const preloadRoute = (routePath: string, options: PreloadOptions = {}) => {
    const loader = routes[routePath];
    if (!loader) {
      console.warn(`No loader found for route: ${routePath}`);
      return {
        preload: () => Promise.resolve(),
        isPreloading: false,
        isPreloaded: false,
        error: null,
      };
    }

    return usePreload(loader, routePath, options);
  };

  const navigateWithPreload = async (routePath: string, preloadOptions?: PreloadOptions) => {
    const { preload } = preloadRoute(routePath, {
      immediate: true,
      priority: 'high',
      ...preloadOptions,
    });

    // Start preloading and navigation concurrently
    const preloadPromise = preload();
    navigate(routePath);

    // Wait for preload to complete
    await preloadPromise;
  };

  return {
    preloadRoute,
    navigateWithPreload,
  };
};

/**
 * Hook for bandwidth-aware preloading
 */
export const useBandwidthAwarePreload = (
  moduleLoader: () => Promise<any>,
  routePath?: string,
  options: PreloadOptions = {}
) => {
  const [shouldPreload, setShouldPreload] = useState(true);

  useEffect(() => {
    // Check network conditions
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (connection) {
      const { effectiveType, saveData } = connection;

      // Don't preload on slow connections or when data saver is enabled
      if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
        setShouldPreload(false);
      }
    }

    // Also check device memory if available
    const deviceMemory = (navigator as any).deviceMemory;
    if (deviceMemory && deviceMemory < 4) {
      setShouldPreload(false);
    }
  }, []);

  const preloadHook = usePreload(moduleLoader, routePath, {
    ...options,
    immediate: shouldPreload && options.immediate,
  });

  return {
    ...preloadHook,
    shouldPreload,
    preload: shouldPreload ? preloadHook.preload : () => Promise.resolve(),
  };
};

/**
 * Clear preload cache (useful for memory management)
 */
export const clearPreloadCache = () => {
  preloadCache.clear();
  preloadQueue.length = 0;
};

/**
 * Get preload cache stats
 */
export const getPreloadStats = () => ({
  cacheSize: preloadCache.size,
  queueLength: preloadQueue.length,
  isProcessing: isProcessingQueue,
});
