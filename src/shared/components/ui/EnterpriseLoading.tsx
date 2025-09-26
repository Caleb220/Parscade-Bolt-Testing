/**
 * Enterprise Loading Components System
 * Sophisticated loading states with skeleton screens and real-time feedback
 */

import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

import { parscadeAnimations } from '@/shared/design/theme';

interface LoadingSkeletonProps {
  variant?: 'card' | 'stat' | 'table' | 'chart' | 'text' | 'avatar' | 'button' | 'custom';
  className?: string;
  animate?: boolean;
  count?: number;
  width?: string;
  height?: string;
}

interface LoadingSpinnerProps {
  variant?: 'primary' | 'secondary' | 'minimal' | 'dots' | 'pulse' | 'enterprise';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'secondary' | 'white';
}

interface LoadingOverlayProps {
  isVisible: boolean;
  variant?: 'modal' | 'inline' | 'fullscreen' | 'card';
  message?: string;
  progress?: number;
  onCancel?: () => void;
  children?: React.ReactNode;
  backdrop?: boolean;
  className?: string;
}

/**
 * Enterprise Skeleton Component - Advanced shimmer loading states
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'custom',
  className = '',
  animate = true,
  count = 1,
  width = '100%',
  height = '1rem',
}) => {
  const baseClasses = `
    bg-gradient-to-r from-neutral-200/60 via-neutral-300/80 to-neutral-200/60
    rounded-lg relative overflow-hidden
    ${animate ? 'animate-pulse' : ''}
    ${className}
  `;

  // Shimmer effect overlay
  const shimmerOverlay = animate ? (
    <motion.div
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
      animate={{
        x: ['-100%', '100%'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  ) : null;

  // Predefined skeleton variants
  const variants = {
    card: (
      <div className={`${baseClasses} p-6 space-y-4`} style={{ height: '200px' }}>
        <div className="h-4 bg-neutral-300/60 rounded-md w-3/4" />
        <div className="h-12 bg-neutral-300/60 rounded-xl w-1/2" />
        <div className="space-y-2">
          <div className="h-3 bg-neutral-300/60 rounded w-full" />
          <div className="h-3 bg-neutral-300/60 rounded w-2/3" />
        </div>
        {shimmerOverlay}
      </div>
    ),
    stat: (
      <div className={`${baseClasses} p-4 space-y-3`} style={{ height: '120px' }}>
        <div className="flex justify-between items-center">
          <div className="w-10 h-10 bg-neutral-300/60 rounded-xl" />
          <div className="w-16 h-6 bg-neutral-300/60 rounded-full" />
        </div>
        <div className="w-20 h-3 bg-neutral-300/60 rounded" />
        <div className="w-16 h-8 bg-neutral-300/60 rounded" />
        <div className="w-full h-3 bg-neutral-300/60 rounded" />
        {shimmerOverlay}
      </div>
    ),
    table: (
      <div className={`${baseClasses} p-4 space-y-3`}>
        <div className="flex space-x-4">
          <div className="w-8 h-8 bg-neutral-300/60 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-neutral-300/60 rounded w-3/4" />
            <div className="h-3 bg-neutral-300/60 rounded w-1/2" />
          </div>
          <div className="w-20 h-6 bg-neutral-300/60 rounded-full" />
        </div>
        {shimmerOverlay}
      </div>
    ),
    chart: (
      <div className={`${baseClasses} p-6 space-y-4`} style={{ height: '300px' }}>
        <div className="h-4 bg-neutral-300/60 rounded w-1/3" />
        <div className="flex-1 relative">
          <div className="absolute bottom-0 left-0 w-full h-3/4">
            <div className="flex items-end justify-between h-full space-x-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-neutral-300/60 rounded-t"
                  style={{
                    height: `${20 + Math.random() * 60}%`,
                    width: '12%',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        {shimmerOverlay}
      </div>
    ),
    text: (
      <div className={baseClasses} style={{ width, height }}>
        {shimmerOverlay}
      </div>
    ),
    avatar: (
      <div className={`${baseClasses} rounded-full`} style={{ width: height, height }}>
        {shimmerOverlay}
      </div>
    ),
    button: (
      <div
        className={`${baseClasses} px-4 py-2`}
        style={{ width: width || '120px', height: height || '40px' }}
      >
        {shimmerOverlay}
      </div>
    ),
    custom: (
      <div className={baseClasses} style={{ width, height }}>
        {shimmerOverlay}
      </div>
    ),
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          {...parscadeAnimations.staggerItem}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {variants[variant]}
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Enterprise Loading Spinner - Multiple sophisticated variants
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  color = 'primary',
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colors = {
    primary: 'text-primary-600',
    secondary: 'text-neutral-600',
    white: 'text-white',
  };

  const spinners = {
    primary: (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizes[size]} ${colors[color]} ${className}`}
      >
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset="31.416"
            className="opacity-25"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset="23.562"
            className="opacity-75"
          />
        </svg>
      </motion.div>
    ),
    secondary: (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        className={`${sizes[size]} ${className}`}
      >
        <div className="w-full h-full border-2 border-neutral-200 border-t-primary-600 rounded-full" />
      </motion.div>
    ),
    minimal: (
      <motion.div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
            className={`w-1.5 h-1.5 bg-current rounded-full ${colors[color]}`}
          />
        ))}
      </motion.div>
    ),
    dots: (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className={`w-2 h-2 rounded-full ${
              color === 'primary'
                ? 'bg-primary-600'
                : color === 'white'
                  ? 'bg-white'
                  : 'bg-neutral-600'
            }`}
          />
        ))}
      </div>
    ),
    pulse: (
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`${sizes[size]} rounded-full ${
          color === 'primary' ? 'bg-primary-600' : color === 'white' ? 'bg-white' : 'bg-neutral-600'
        } ${className}`}
      />
    ),
    enterprise: (
      <div className={`relative ${sizes[size]} ${className}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          <div className="w-full h-full border-2 border-transparent border-t-primary-600 border-r-primary-400 rounded-full" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-1"
        >
          <div className="w-full h-full border border-transparent border-b-primary-500 border-l-primary-300 rounded-full" />
        </motion.div>
      </div>
    ),
  };

  return spinners[variant];
};

/**
 * Enterprise Loading Overlay - Full-featured overlay with progress
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  variant = 'modal',
  message = 'Loading...',
  progress,
  onCancel,
  children,
  backdrop = true,
  className = '',
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {backdrop && variant !== 'inline' && (
            <motion.div
              {...parscadeAnimations.modalBackdrop}
              className={`
                ${variant === 'fullscreen' ? 'fixed' : 'absolute'} inset-0 z-50
                bg-black/20 backdrop-blur-sm
              `}
              onClick={onCancel}
            />
          )}

          <motion.div
            {...parscadeAnimations.modalContent}
            className={`
              ${variant === 'fullscreen' ? 'fixed' : variant === 'inline' ? 'relative' : 'absolute'}
              ${variant === 'fullscreen' || variant === 'modal' ? 'inset-0 z-50' : ''}
              ${variant === 'card' ? 'inset-0 z-10' : ''}
              flex items-center justify-center ${className}
            `}
          >
            <div
              className={`
              bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-parscade-xl border border-white/60
              max-w-sm mx-4 text-center
              ${variant === 'inline' ? 'w-full' : ''}
            `}
            >
              {/* Main Content */}
              <div className="space-y-6">
                {/* Spinner */}
                <div className="flex justify-center">
                  <LoadingSpinner variant="enterprise" size="xl" />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-neutral-900">{message}</h3>

                  {progress !== undefined && (
                    <div className="space-y-2">
                      <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary-600 to-primary-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-sm text-neutral-600">{Math.round(progress)}% complete</p>
                    </div>
                  )}
                </div>

                {/* Custom Content */}
                {children}

                {/* Cancel Button */}
                {onCancel && (
                  <motion.button
                    {...parscadeAnimations.buttonPress}
                    onClick={onCancel}
                    className="text-sm text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
                  >
                    Cancel
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default {
  Skeleton: LoadingSkeleton,
  Spinner: LoadingSpinner,
  Overlay: LoadingOverlay,
};
