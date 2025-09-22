/**
 * Parscade Branded Card Component - Refined Blue Theme
 * Professional card with subtle effects and clean styling
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { parscadeAnimations } from '@/shared/design/theme';

interface ParscadeCardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'gradient';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Branded card component with refined Parscade visual identity
 */
const ParscadeCard: React.FC<ParscadeCardProps> = ({
  children,
  variant = 'default',
  hover = true,
  className = '',
  onClick,
}) => {
  const variantClasses = {
    default: 'bg-white border border-slate-200 shadow-sm',
    elevated: 'bg-white border border-slate-200 shadow-parscade',
    glass: 'bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-parscade',
    gradient: 'bg-gradient-to-br from-white to-blue-50/50 border border-blue-200/40 shadow-parscade',
  };

    const hoverAnimation = hover ? {
        whileHover: {
            y: -2,
            scale: 1.01,
            transition: {duration: 0.2, ease: "easeInOut" as any}
        },
        whileTap: onClick ? {scale: 0.99} : {}
    } : {};

  return (
    <div>
      <motion.div
        {...parscadeAnimations.fadeInUp}
        {...hoverAnimation}
        className={`
          ${variantClasses[variant]}
          rounded-xl
          transition-all duration-200
          ${onClick ? 'cursor-pointer' : ''}
          ${hover ? 'hover:shadow-parscade-lg' : ''}
          ${className}
        `}
        onClick={onClick}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ParscadeCard;