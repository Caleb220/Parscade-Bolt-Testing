/**
 * Parscade Status Badge Component - Professional Blue Theme
 * Clean status indicators with refined styling
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertTriangle, XCircle, Zap } from 'lucide-react';

interface ParscadeStatusBadgeProps {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showIcon?: boolean;
  className?: string;
}

/**
 * Professional status badge with refined blue theme
 */
const ParscadeStatusBadge: React.FC<ParscadeStatusBadgeProps> = ({
  status,
  size = 'md',
  animated = true,
  showIcon = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const statusConfig = {
    pending: {
      gradient: 'from-amber-100 to-amber-200',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: Clock,
      label: 'Pending',
    },
    processing: {
      gradient: 'from-blue-100 to-blue-200',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: Zap,
      label: 'Processing',
    },
    completed: {
      gradient: 'from-emerald-100 to-emerald-200',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: CheckCircle,
      label: 'Completed',
    },
    failed: {
      gradient: 'from-red-100 to-red-200',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: XCircle,
      label: 'Failed',
    },
    cancelled: {
      gradient: 'from-slate-100 to-slate-200',
      text: 'text-slate-800',
      border: 'border-slate-200',
      icon: XCircle,
      label: 'Cancelled',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const pulseAnimation = animated && status === 'processing' ? {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  } : {};

  return (
    <motion.div
      className={`
        inline-flex items-center
        ${sizeClasses[size]}
        bg-gradient-to-r ${config.gradient}
        ${config.text}
        border ${config.border}
        rounded-full
        font-medium
        shadow-sm
        ${className}
      `}
      {...pulseAnimation}
      whileHover={animated ? { scale: 1.05 } : {}}
    >
      {showIcon && (
        <motion.div
          animate={status === 'processing' && animated ? { rotate: 360 } : {}}
          transition={status === 'processing' ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
          className="mr-1.5"
        >
          <Icon className={iconSizeClasses[size]} />
        </motion.div>
      )}
      {config.label}
    </motion.div>
  );
};

export default ParscadeStatusBadge;