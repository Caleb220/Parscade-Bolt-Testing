import { motion, AnimatePresence } from 'framer-motion';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { GlobalErrorBoundary } from '@/shared/components/error';
import { PageLoading, SectionLoading } from '@/shared/components/loading';
import { usePreload, useBandwidthAwarePreload } from '@/shared/hooks/usePreload';

import type { ComponentType, ReactNode } from 'react';

interface LazyComponentProps {
  /** The lazy-loaded component */
  component: React.LazyExoticComponent<ComponentType<any>>;
  /** Props to pass to the component */
  componentProps?: Record<string, any>;
  /** Loading component */
  fallback?: ReactNode;
  /** Error fallback component */
  errorFallback?: ReactNode;
  /** Preload options */
  preloadOptions?: {
    onHover?: boolean;
    onVisible?: boolean;
    delay?: number;
    priority?: 'low' | 'normal' | 'high';
  };
  /** Loading level for different UI treatments */
  level?: 'page' | 'section' | 'component';
  /** Enable bandwidth-aware loading */
  bandwidthAware?: boolean;
  /** Animation options */
  animation?: {
    initial?: object;
    animate?: object;
    exit?: object;
    transition?: object;
  };
}

const defaultAnimations = {
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },
  section: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 },
  },
  component: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15 },
  },
};

/**
 * Enhanced lazy component wrapper with preloading, error boundaries, and animations
 */
const LazyComponent: React.FC<LazyComponentProps> = ({
  component: Component,
  componentProps = {},
  fallback,
  errorFallback,
  preloadOptions = {},
  level = 'component',
  bandwidthAware = false,
  animation,
}) => {
  // Get the component loader from the lazy component
  const componentLoader =
    (Component as any)._payload?._result || (() => Promise.resolve(Component));

  // Use appropriate preload hook
  const preloadHook = bandwidthAware
    ? useBandwidthAwarePreload(componentLoader, undefined, preloadOptions)
    : usePreload(componentLoader, undefined, preloadOptions);

  // Choose appropriate fallback based on level
  const getFallback = () => {
    if (fallback) return fallback;

    switch (level) {
      case 'page':
        return <PageLoading message="Loading page..." />;
      case 'section':
        return <SectionLoading message="Loading section..." />;
      default:
        return <div className="flex items-center justify-center p-4">Loading...</div>;
    }
  };

  // Choose appropriate error boundary level
  const getErrorBoundaryLevel = (): 'app' | 'page' | 'section' => {
    switch (level) {
      case 'page':
        return 'page';
      case 'section':
        return 'section';
      default:
        return 'section';
    }
  };

  // Get animation config
  const animationConfig = animation || defaultAnimations[level];

  // Preload handlers for hover and visibility
  const handleMouseEnter = preloadOptions.onHover ? preloadHook.preload : undefined;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      className={preloadOptions.onVisible ? 'lazy-component' : undefined}
    >
      <GlobalErrorBoundary level={getErrorBoundaryLevel()} fallback={errorFallback}>
        <Suspense fallback={getFallback()}>
          <AnimatePresence mode="wait">
            <motion.div
              key="lazy-component"
              initial={animationConfig.initial}
              animate={animationConfig.animate}
              exit={animationConfig.exit}
              transition={animationConfig.transition}
            >
              <Component {...componentProps} />
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </GlobalErrorBoundary>

      {/* Debug info in development */}
      {import.meta.env?.MODE === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded z-50">
          <div>Preloaded: {preloadHook.isPreloaded ? '✅' : '❌'}</div>
          <div>Loading: {preloadHook.isPreloading ? '⏳' : '❌'}</div>
          {bandwidthAware && <div>Bandwidth Aware: ✅</div>}
        </div>
      )}
    </div>
  );
};

export default LazyComponent;

/**
 * HOC for creating lazy components with preloading
 */
export const withLazyPreload = <P extends object>(
  component: React.LazyExoticComponent<ComponentType<P>>,
  options: Omit<LazyComponentProps, 'component' | 'componentProps'> = {}
) => {
  return (props: P) => <LazyComponent component={component} componentProps={props} {...options} />;
};

/**
 * Preloadable link component
 */
interface PreloadableLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  preloadDelay?: number;
  priority?: 'low' | 'normal' | 'high';
  moduleLoader?: () => Promise<any>;
}

export const PreloadableLink: React.FC<PreloadableLinkProps> = ({
  to,
  children,
  className = '',
  preloadDelay = 100,
  priority = 'normal',
  moduleLoader,
}) => {
  const { preload } = usePreload(moduleLoader || (() => Promise.resolve()), to, {
    onHover: true,
    delay: preloadDelay,
    priority,
  });

  return (
    <a href={to} className={className} onMouseEnter={preload} onFocus={preload}>
      {children}
    </a>
  );
};
