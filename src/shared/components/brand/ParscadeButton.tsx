/**
 * Parscade Branded Button Component - Refined Blue Theme
 * Professional button with subtle effects and clean styling
 */

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import React, { forwardRef } from 'react';

interface ParscadeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  glow?: boolean;
}

/**
 * Branded button component with refined Parscade visual identity
 */
const ParscadeButton = forwardRef<HTMLButtonElement, ParscadeButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  glow = false,
  disabled,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-parscade hover:shadow-parscade-lg',
    secondary: 'bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-800 shadow-sm hover:shadow-md',
    accent: 'bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white shadow-parscade hover:shadow-parscade-lg',
    outline: 'border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-sm hover:shadow-parscade',
    ghost: 'text-slate-700 hover:bg-blue-50 hover:text-blue-700',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-lg min-h-[36px]',
    md: 'px-4 py-2.5 text-sm rounded-lg min-h-[40px]',
    lg: 'px-6 py-3 text-base rounded-xl min-h-[44px]',
    xl: 'px-8 py-4 text-lg rounded-xl min-h-[52px]',
  };

  const glowClasses = glow && variant === 'primary' ? 'shadow-parscade-glow' : '';

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    glowClasses,
    className,
  ].join(' ');

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      ref={ref}
      className={classes}
      disabled={isDisabled}
      whileHover={!isDisabled ? { 
        scale: 1.02,
        y: -1,
        transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
      } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </div>
    </motion.button>
  );
});

ParscadeButton.displayName = 'ParscadeButton';

export default ParscadeButton;