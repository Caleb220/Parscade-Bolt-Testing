/**
 * Parscade Branded Button Component
 * Custom button with Parscade design system
 */

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

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
 * Branded button component with Parscade visual identity
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
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white shadow-parscade hover:shadow-parscade-lg',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 shadow-sm hover:shadow-md',
    accent: 'bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white shadow-parscade hover:shadow-parscade-lg',
    outline: 'border-2 border-purple-200 bg-white/80 backdrop-blur-sm text-purple-700 hover:bg-purple-50 hover:border-purple-300 shadow-sm hover:shadow-parscade',
    ghost: 'text-gray-700 hover:bg-purple-50/80 hover:text-purple-700 backdrop-blur-sm',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-xl min-h-[36px]',
    md: 'px-6 py-3 text-sm rounded-xl min-h-[44px]',
    lg: 'px-8 py-4 text-base rounded-2xl min-h-[52px]',
    xl: 'px-10 py-5 text-lg rounded-2xl min-h-[60px]',
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
        y: -2,
        transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }
      } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {/* Background Glow Effect */}
      {glow && variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-inherit"
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span>Processing...</span>
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