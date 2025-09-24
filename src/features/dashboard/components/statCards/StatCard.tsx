/**
 * Stat Card Component
 * Individual statistic card with premium styling and animations
 */

import { motion } from 'framer-motion';
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  accentLabel: string;
  delay?: number;
  className?: string;
}

/**
 * Premium stat card with hover effects and animations
 */
const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  accentLabel,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={`relative overflow-hidden rounded-2xl border border-gray-200/60 bg-gradient-to-br from-white to-gray-50/30 p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300 group cursor-pointer ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 shadow-sm group-hover:shadow-md transition-all duration-300"
            whileHover={{ rotate: 5, scale: 1.1 }}
          >
            {icon}
          </motion.div>
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{accentLabel}</span>
        </div>
        
        <div className="mt-6 space-y-2">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">{title}</div>
          <div className="text-3xl font-black text-gray-900 tracking-tight">
            {value}
          </div>
          <div className="text-sm text-gray-600 font-medium leading-relaxed">{subtitle}</div>
        </div>
      </div>
      
      {/* Hover Accent */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        layoutId={`accent-${title}`}
      />
    </motion.div>
  );
};

export default StatCard;