/**
 * Parscade Branded Card Component
 * Custom card with Parscade design system
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { parscadeAnimations } from '@/shared/design/theme';

interface ParscadeCardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'gradient' | 'glow';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Branded card component with Parscade visual identity
 */
const ParscadeCard: React.FC<ParscadeCardProps> = ({
  children,
  variant = 'default',
  hover = true,
  className = '',
  onClick,
}) => {
  const variantClasses = {
    default: 'bg-white/95 backdrop-blur-xl border border-gray-200/60 shadow-parscade',
    elevated: 'bg-white/95 backdrop-blur-xl border border-gray-200/60 shadow-parscade-lg',
    glass: 'bg-white/80 backdrop-blur-2xl border border-white/20 shadow-parscade',
    gradient: 'bg-gradient-to-br from-white to-purple-50/30 border border-purple-200/60 shadow-parscade',
    glow: 'bg-white/95 backdrop-blur-xl border border-purple-200/60 shadow-parscade-glow',
  };

  const hoverAnimation = hover ? {
    whileHover: { 
      y: -4,
      scale: 1.02,
      transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }
    },
    whileTap: onClick ? { scale: 0.98 } : {}
  } : {};

  return (
    <motion.div
      {...parscadeAnimations.fadeInUp}
      {...hoverAnimation}
      className={`
        ${variantClasses[variant]}
        rounded-2xl
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${hover ? 'hover:shadow-parscade-lg' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default ParscadeCard;