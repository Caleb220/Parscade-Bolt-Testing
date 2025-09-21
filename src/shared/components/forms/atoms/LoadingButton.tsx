/**
 * Enhanced Loading Button Component
 * 
 * DESIGN PRINCIPLES:
 * - Prevents double-submission during loading states
 * - Smooth loading animations with proper accessibility
 * - Maintains button dimensions during loading
 * - Clear visual feedback for user actions
 * - Supports all standard button variants
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly isLoading?: boolean;
  readonly loadingText?: string;
  readonly variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly fullWidth?: boolean;
  readonly leftIcon?: React.ReactNode;
  readonly rightIcon?: React.ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  isLoading = false,
  loadingText = 'Loading...',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

  const variantClasses: Record<NonNullable<LoadingButtonProps['variant']>, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
  };

  const sizeClasses: Record<NonNullable<LoadingButtonProps['size']>, string> = {
    sm: 'px-3 py-1.5 text-sm rounded-md min-h-[32px]',
    md: 'px-4 py-2 text-sm rounded-md min-h-[40px]',
    lg: 'px-6 py-3 text-base rounded-lg min-h-[48px]',
    xl: 'px-8 py-4 text-lg rounded-lg min-h-[56px]',
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={classes}
      disabled={isDisabled}
      {...props}
    >
      {/* Loading Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center bg-inherit"
        aria-hidden={!isLoading}
      >
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        <span>{loadingText}</span>
      </motion.div>

      {/* Normal Content */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
        aria-hidden={isLoading}
      >
        {leftIcon && !isLoading && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {rightIcon && !isLoading && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </motion.div>

      {/* Screen Reader Loading State */}
      {isLoading && (
        <span className="sr-only" aria-live="polite">
          {loadingText}
        </span>
      )}
    </button>
  );
};

export default LoadingButton;