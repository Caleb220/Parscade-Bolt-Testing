/**
 * Overview Statistics Component - Professional Blue Theme
 * Clean statistics cards with refined styling
 */

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, FileText, Users, Zap, Target, TrendingUp, Shield } from 'lucide-react';

import { ParscadeCard } from '@/shared/components/brand';
import DashboardGrid from '../ui/DashboardGrid';

interface StatItem {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  accentLabel: string;
  trend?: 'up' | 'down' | 'neutral';
}

const DEFAULT_STATS: StatItem[] = [
  { 
    icon: <FileText className="h-5 w-5" />, 
    title: 'Documents', 
    value: '0', 
    accentLabel: 'Ready', 
    subtitle: 'Documents processed this month',
    trend: 'neutral'
  },
  { 
    icon: <Zap className="h-5 w-5" />, 
    title: 'Processing', 
    value: '0', 
    accentLabel: 'Active', 
    subtitle: 'Jobs currently being processed',
    trend: 'neutral'
  },
  { 
    icon: <Target className="h-5 w-5" />, 
    title: 'Accuracy', 
    value: '99.2%', 
    accentLabel: 'High', 
    subtitle: 'Average processing accuracy',
    trend: 'up'
  },
  { 
    icon: <TrendingUp className="h-5 w-5" />, 
    title: 'Performance', 
    value: '2.3s', 
    accentLabel: 'Fast', 
    subtitle: 'Average processing time',
    trend: 'up'
  },
];

/**
 * Professional statistics overview with refined blue theme
 */
const OverviewStats: React.FC = () => {
  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up': return 'text-emerald-600';
      case 'down': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3" />;
      case 'down': return <TrendingUp className="w-3 h-3 rotate-180" />;
      default: return <Shield className="w-3 h-3" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {DEFAULT_STATS.map((stat, index) => (
        <ParscadeCard
          key={stat.title}
          variant="default"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="p-6 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 shadow-sm group-hover:shadow-md transition-all duration-300"
              whileHover={{ 
                scale: 1.1,
                boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)'
              }}
            >
              {stat.icon}
            </motion.div>
            <motion.span 
              className={`text-xs font-medium px-2 py-1 rounded-full border flex items-center space-x-1 ${getTrendColor(stat.trend)} bg-white`}
              whileHover={{ scale: 1.05 }}
            >
              {getTrendIcon(stat.trend)}
              <span>{stat.accentLabel}</span>
            </motion.span>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.title}</div>
            <div className="text-2xl font-bold text-gray-900">
              {stat.value}
            </div>
            <div className="text-sm text-slate-600">{stat.subtitle}</div>
          </div>
          
          {/* Hover Accent */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            layoutId={`accent-${stat.title}`}
          />
        </ParscadeCard>
      ))}
    </div>
  );
};

export default OverviewStats;