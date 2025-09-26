/**
 * Unified Badge Component - Parscade Design System
 * Combines basic badge with status badge features
 * Provides consistent styling across the application
 */

import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, Zap } from 'lucide-react';
import React from 'react';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground border-input',
        // Status variants
        pending:
          'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-200 shadow-sm',
        processing:
          'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200 shadow-sm',
        completed:
          'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-200 shadow-sm',
        failed: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-200 shadow-sm',
        cancelled:
          'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border-slate-200 shadow-sm',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Show icon for status badges */
  showIcon?: boolean;
  /** Enable animations */
  animated?: boolean;
  /** Custom status text (overrides default status labels) */
  children?: React.ReactNode;
}

const statusConfig = {
  pending: { icon: Clock, label: 'Pending' },
  processing: { icon: Zap, label: 'Processing' },
  completed: { icon: CheckCircle, label: 'Completed' },
  failed: { icon: XCircle, label: 'Failed' },
  cancelled: { icon: XCircle, label: 'Cancelled' },
};

function Badge({
  className,
  variant = 'default',
  size = 'md',
  showIcon = false,
  animated = true,
  children,
  ...props
}: BadgeProps) {
  const isStatusVariant =
    variant && ['pending', 'processing', 'completed', 'failed', 'cancelled'].includes(variant);
  const config = isStatusVariant ? statusConfig[variant as keyof typeof statusConfig] : null;
  const Icon = config?.icon;

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Animation for processing status
  const pulseAnimation =
    animated && variant === 'processing'
      ? {
          animate: {
            scale: [1, 1.05, 1],
            opacity: [1, 0.8, 1],
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          },
        }
      : {};

  const content = (
    <>
      {showIcon && Icon && isStatusVariant && (
        <motion.div
          animate={variant === 'processing' && animated ? { rotate: 360 } : {}}
          transition={
            variant === 'processing' ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}
          }
          className="mr-1.5"
        >
          <Icon className={iconSizeClasses[size]} />
        </motion.div>
      )}
      {children || config?.label}
    </>
  );

  if (animated && isStatusVariant) {
    return (
      <motion.div
        className={badgeVariants({ variant, size, className })}
        {...pulseAnimation}
        whileHover={animated ? { scale: 1.05 } : {}}
        {...props}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className={badgeVariants({ variant, size, className })} {...props}>
      {content}
    </div>
  );
}

export { Badge, badgeVariants };
export default Badge;
