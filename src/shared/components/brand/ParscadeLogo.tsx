/**
 * Parscade Logo Component - Refined Blue Theme
 * Professional logo with subtle animations and responsive sizing
 */

import { motion } from 'framer-motion';
import React from 'react';

interface ParscadeLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark' | 'gradient';
  animated?: boolean;
  className?: string;
}

/**
 * Official Parscade logo component with refined blue branding
 */
const ParscadeLogo: React.FC<ParscadeLogoProps> = ({
  size = 'md',
  variant = 'default',
  animated = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const variantClasses = {
    default: 'text-gray-900',
    white: 'text-white',
    dark: 'text-gray-900',
    gradient: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500',
  };

  const logoAnimation = animated
    ? {
        whileHover: {
          scale: 1.05,
          transition: { duration: 0.2 },
        },
        whileTap: { scale: 0.95 },
      }
    : {};

  return (
    <motion.div className={`flex items-center ${className}`} {...logoAnimation}>
      {/* Logo Icon */}
      <motion.div
        className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg mr-3`}
        animate={
          animated
            ? {
                boxShadow: [
                  '0 4px 20px rgba(14, 165, 233, 0.2)',
                  '0 6px 25px rgba(14, 165, 233, 0.3)',
                  '0 4px 20px rgba(14, 165, 233, 0.2)',
                ],
              }
            : {}
        }
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-1/2 h-1/2 text-white">
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.3"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {/* Logo Text */}
      <motion.span
        className={`${textSizeClasses[size]} font-bold tracking-tight ${variantClasses[variant]}`}
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        Parscade
      </motion.span>
    </motion.div>
  );
};

export default ParscadeLogo;
