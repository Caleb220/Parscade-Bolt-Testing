/**
 * Overview Statistics Component - Professional Blue Theme
 * Clean statistics cards with refined styling
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Zap, Target, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';

import { ParscadeCard } from '@/shared/components/brand';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useDashboardStats } from '@/shared/hooks/api/useDashboard';

/**
 * Real-time statistics overview with backend integration
 */
const OverviewStats: React.FC = () => {
  const { data: stats, isLoading, error, refetch } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <ParscadeCard key={i} variant="default" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
          </ParscadeCard>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ParscadeCard variant="default" className="p-6 col-span-full">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load statistics</h3>
          <p className="text-gray-600 mb-4">Unable to fetch dashboard statistics</p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </ParscadeCard>
    );
  }

  const formatValue = (value: number, type: 'count' | 'percentage' | 'time') => {
    switch (type) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'time':
        return value < 1000 ? `${value}ms` : `${(value / 1000).toFixed(1)}s`;
      default:
        return value.toLocaleString();
    }
  };

  const statItems = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: 'Documents',
      value: formatValue(stats?.documents_processed_this_month || 0, 'count'),
      accentLabel: 'This Month',
      subtitle: 'Documents processed this month',
      color: 'blue',
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'Processing',
      value: formatValue(stats?.jobs_processing_current || 0, 'count'),
      accentLabel: 'Active',
      subtitle: 'Jobs currently being processed',
      color: 'purple',
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: 'Accuracy',
      value: formatValue(stats?.average_accuracy || 0, 'percentage'),
      accentLabel: 'Average',
      subtitle: 'Average processing accuracy',
      color: 'emerald',
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: 'Performance',
      value: formatValue(stats?.average_processing_time_ms || 0, 'time'),
      accentLabel: 'Average',
      subtitle: 'Average processing time',
      color: 'cyan',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, index) => (
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
              className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 text-${stat.color}-600 shadow-sm group-hover:shadow-md transition-all duration-300`}
              whileHover={{ 
                scale: 1.1,
                boxShadow: `0 0 20px rgba(59, 130, 246, 0.3)`
              }}
            >
              {stat.icon}
            </motion.div>
            <motion.span 
              className={`text-xs font-medium px-2 py-1 rounded-full border flex items-center space-x-1 text-${stat.color}-600 bg-white border-${stat.color}-200`}
              whileHover={{ scale: 1.05 }}
            >
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
            className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            layoutId={`accent-${stat.title}`}
          />
        </ParscadeCard>
      ))}
    </div>
  );
};

export default OverviewStats;