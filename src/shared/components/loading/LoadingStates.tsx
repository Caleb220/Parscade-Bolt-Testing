import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import React from 'react';

import { Skeleton } from '@/shared/components/ui/skeleton';

// Enhanced loading spinner with variants
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  message
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
        {message && (
          <p className="text-sm text-gray-600 animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );
};

// Page-level loading state
export const PageLoading: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <LoadingSpinner size="lg" message={message} />
  </div>
);

// Section-level loading state
export const SectionLoading: React.FC<{ message?: string; className?: string }> = ({
  message = 'Loading...',
  className = ''
}) => (
  <div className={`flex items-center justify-center p-8 ${className}`}>
    <LoadingSpinner size="md" message={message} />
  </div>
);

// Inline loading state
export const InlineLoading: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex items-center space-x-2">
    <LoadingSpinner size="sm" />
    {message && <span className="text-sm text-gray-600">{message}</span>}
  </div>
);

// Card skeleton loader
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
      </div>
    ))}
  </div>
);

// Table skeleton loader
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4
}) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden">
    <div className="bg-gray-50 p-4 border-b border-gray-200">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4" />
        ))}
      </div>
    </div>
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className="h-4" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// List skeleton loader
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    ))}
  </div>
);

// Dashboard stats skeleton
export const StatsSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    ))}
  </div>
);

// Chart skeleton
export const ChartSkeleton: React.FC = () => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-24" />
    </div>
    <div className="h-64 flex items-end justify-between space-x-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton
          key={i}
          className="w-full"
          style={{ height: `${Math.random() * 80 + 20}%` }}
        />
      ))}
    </div>
  </div>
);

// Progressive loading container
interface ProgressiveLoadingProps {
  isLoading: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
}

export const ProgressiveLoading: React.FC<ProgressiveLoadingProps> = ({
  isLoading,
  error,
  isEmpty = false,
  children,
  loadingComponent,
  errorComponent,
  emptyComponent
}) => {
  if (isLoading) {
    return <>{loadingComponent || <SectionLoading />}</>;
  }

  if (error) {
    return <>{errorComponent || <div className="text-red-600 p-4">Error loading data</div>}</>;
  }

  if (isEmpty) {
    return <>{emptyComponent || <div className="text-gray-500 p-4 text-center">No data available</div>}</>;
  }

  return <>{children}</>;
};

// Animated loading dots
export const LoadingDots: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex space-x-1 ${className}`}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-blue-600 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2,
        }}
      />
    ))}
  </div>
);

// Button loading state
export const ButtonLoading: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}> = ({ isLoading, children, loadingText = 'Loading...' }) => (
  <>
    {isLoading ? (
      <div className="flex items-center space-x-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{loadingText}</span>
      </div>
    ) : (
      children
    )}
  </>
);