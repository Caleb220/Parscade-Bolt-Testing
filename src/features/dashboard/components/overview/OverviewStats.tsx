/**
 * Enterprise Overview Statistics - Real-time KPI Dashboard
 * Mission-critical metrics with sophisticated enterprise design
 */

import { motion } from 'framer-motion';
import {
  FileText,
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Activity,
  Clock,
  CheckCircle,
  Gauge,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';
import React from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import Button from '@/shared/components/forms/atoms/Button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { parscadeAnimations, parscadeGradients } from '@/shared/design/theme';
import { useDashboardStats } from '@/shared/hooks/api/useDashboard';

/**
 * Real-time statistics overview with backend integration
 */
const OverviewStats: React.FC = () => {
  const { data: stats, isLoading, error, refetch, isFetching, dataUpdatedAt } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            {...parscadeAnimations.staggerItem}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="relative bg-white/90 backdrop-blur-sm border border-neutral-200/60 rounded-2xl p-4 lg:p-6 shadow-card overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />

              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full">
        <motion.div
          {...parscadeAnimations.scaleIn}
          className="bg-gradient-to-br from-error-25 to-error-50 border border-error-200/60 rounded-2xl p-8 shadow-parscade-md"
        >
          <div className="text-center max-w-md mx-auto">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center justify-center w-16 h-16 bg-error-100 rounded-2xl mb-6 shadow-parscade-xs"
            >
              <AlertTriangle className="w-8 h-8 text-error-600" />
            </motion.div>

            <h3 className="text-xl font-bold text-error-900 mb-3">Statistics Unavailable</h3>
            <p className="text-error-700 mb-6 leading-relaxed">
              We're experiencing difficulty connecting to our monitoring systems. Please try
              refreshing the data.
            </p>

            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              className="bg-white/90 hover:bg-white border-error-300 text-error-700 hover:text-error-800"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Data validation and formatting
  const validateAndFormatValue = (
    value: number | undefined | null,
    type: 'count' | 'percentage' | 'time'
  ) => {
    // Handle invalid/missing data gracefully
    if (value === undefined || value === null || isNaN(value)) {
      return type === 'percentage' ? '0.0%' : type === 'time' ? '0ms' : '0';
    }

    // Clamp values to reasonable ranges
    const clampedValue =
      type === 'percentage' ? Math.max(0, Math.min(100, value)) : Math.max(0, value);

    switch (type) {
      case 'percentage':
        return `${clampedValue.toFixed(1)}%`;
      case 'time':
        return clampedValue < 1000
          ? `${Math.round(clampedValue)}ms`
          : `${(clampedValue / 1000).toFixed(1)}s`;
      default:
        return Math.round(clampedValue).toLocaleString();
    }
  };

  // Calculate trend direction and percentage change
  const calculateTrend = (
    current: number | undefined | null,
    previous: number | undefined | null
  ) => {
    if (!current || !previous || current === previous) return 'stable';
    const percentChange = ((current - previous) / previous) * 100;
    if (Math.abs(percentChange) < 5) return 'stable';
    return current > previous ? 'up' : 'down';
  };

  // Enhanced stat items with trend data and enterprise styling
  const statItems = [
    {
      id: 'documents',
      icon: <FileText className="h-6 w-6" />,
      title: 'Documents Processed',
      value: validateAndFormatValue(stats?.documents_processed_this_month, 'count'),
      previousValue: validateAndFormatValue(stats?.documents_processed_last_month, 'count'),
      accentLabel: 'This Month',
      subtitle: 'Total documents processed this period',
      color: 'primary',
      trend: calculateTrend(
        stats?.documents_processed_this_month,
        stats?.documents_processed_last_month
      ),
      critical: false,
      bgGradient: parscadeGradients.glassBlue,
    },
    {
      id: 'processing',
      icon: <Activity className="h-6 w-6" />,
      title: 'Active Processing',
      value: validateAndFormatValue(stats?.jobs_processing_current, 'count'),
      accentLabel: 'Live',
      subtitle: 'Jobs currently being processed',
      color: 'purple',
      critical: stats?.jobs_processing_current > 100,
      realTime: true,
      bgGradient: parscadeGradients.glassPurple,
    },
    {
      id: 'accuracy',
      icon: <Target className="h-6 w-6" />,
      title: 'Processing Accuracy',
      value: validateAndFormatValue(stats?.average_accuracy, 'percentage'),
      accentLabel: 'Average',
      subtitle: 'Data extraction accuracy rate',
      color: 'success',
      trend: 'stable', // Would be calculated from historical data
      critical: stats?.average_accuracy < 85,
      bgGradient: parscadeGradients.glass,
    },
    {
      id: 'performance',
      icon: <Gauge className="h-6 w-6" />,
      title: 'Processing Speed',
      value: validateAndFormatValue(stats?.average_processing_time_ms, 'time'),
      accentLabel: 'Average',
      subtitle: 'Mean document processing time',
      color: 'teal',
      trend: calculateTrend(stats?.current_processing_time, stats?.previous_processing_time),
      critical: stats?.average_processing_time_ms > 30000,
      bgGradient: parscadeGradients.glassTeal,
    },
  ];

  // Calculate time since last update
  const timeSinceUpdate = dataUpdatedAt ? Date.now() - dataUpdatedAt : 0;
  const lastUpdateText =
    timeSinceUpdate < 60000 ? 'Just now' : `${Math.floor(timeSinceUpdate / 60000)}m ago`;

  // Trend icon helper
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-success-600" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-error-600" />;
      default:
        return <Minus className="w-4 h-4 text-neutral-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Enterprise Control Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ scale: isFetching ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1, repeat: isFetching ? Infinity : 0 }}
              className={`w-3 h-3 rounded-full ${
                isFetching ? 'bg-primary-500' : error ? 'bg-error-500' : 'bg-success-500'
              } shadow-glow-sm`}
            />
            <span className="text-sm font-medium text-neutral-700">
              System Status:{' '}
              <span
                className={`${
                  isFetching ? 'text-primary-600' : error ? 'text-error-600' : 'text-success-600'
                }`}
              >
                {isFetching ? 'Refreshing' : error ? 'Disconnected' : 'Live'}
              </span>
            </span>
          </div>

          <div className="hidden sm:flex items-center text-xs text-neutral-500">
            <Clock className="w-3 h-3 mr-1" />
            <span>Updated {lastUpdateText}</span>
          </div>
        </div>

        <motion.button
          onClick={() => refetch()}
          disabled={isFetching}
          {...parscadeAnimations.buttonPress}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg disabled:opacity-50 transition-all duration-200"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh Data</span>
          <span className="sm:hidden">Refresh</span>
        </motion.button>
      </div>

      {/* Enterprise KPI Grid */}
      <motion.div
        {...parscadeAnimations.staggerContainer}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
      >
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.id}
            {...parscadeAnimations.staggerItem}
            style={{ animationDelay: `${index * 100}ms` }}
            className="group"
          >
            <div
              className={`
                relative h-full bg-white/95 backdrop-blur-sm border border-neutral-200/60 rounded-2xl p-4 lg:p-6
                shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden
                ${stat.critical ? 'border-error-300/60 bg-gradient-to-br from-error-25/50 to-white' : ''}
              `}
            >
              {/* Background Pattern */}
              <div
                className="absolute inset-0 opacity-[0.02]"
                style={{ backgroundImage: stat.bgGradient }}
              />

              {/* Critical Alert Indicator */}
              {stat.critical && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-error-500 rounded-full animate-pulse shadow-glow-sm" />
              )}

              {/* Real-time Indicator */}
              {stat.realTime && (
                <div className="absolute top-2 right-2 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-medium text-success-700 hidden lg:block">
                    LIVE
                  </span>
                </div>
              )}

              <div className="relative z-10">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    {...parscadeAnimations.iconBounce}
                    className={`
                      flex items-center justify-center w-12 h-12 rounded-xl shadow-parscade-xs
                      ${
                        stat.color === 'primary'
                          ? 'bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600'
                          : stat.color === 'purple'
                            ? 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600'
                            : stat.color === 'success'
                              ? 'bg-gradient-to-br from-success-100 to-success-200 text-success-600'
                              : stat.color === 'teal'
                                ? 'bg-gradient-to-br from-teal-100 to-teal-200 text-teal-600'
                                : 'bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-600'
                      }
                    `}
                  >
                    {stat.icon}
                  </motion.div>

                  <div className="flex items-center space-x-2">
                    {stat.trend && getTrendIcon(stat.trend)}
                    <span
                      className={`
                      text-xs font-semibold px-2 py-1 rounded-full border
                      ${
                        stat.color === 'primary'
                          ? 'bg-primary-100 text-primary-800 border-primary-200'
                          : stat.color === 'purple'
                            ? 'bg-purple-100 text-purple-800 border-purple-200'
                            : stat.color === 'success'
                              ? 'bg-success-100 text-success-800 border-success-200'
                              : stat.color === 'teal'
                                ? 'bg-teal-100 text-teal-800 border-teal-200'
                                : 'bg-neutral-100 text-neutral-800 border-neutral-200'
                      }
                    `}
                    >
                      {stat.accentLabel}
                    </span>
                  </div>
                </div>

                {/* Metrics Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    {stat.title}
                  </h4>

                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1 + 0.3,
                      type: 'spring',
                      stiffness: 100,
                    }}
                    className={`text-2xl lg:text-3xl font-black ${
                      stat.critical ? 'text-error-800' : 'text-neutral-900'
                    }`}
                  >
                    {stat.value}
                  </motion.div>

                  <p className="text-xs lg:text-sm text-neutral-600 leading-relaxed">
                    {stat.subtitle}
                  </p>
                </div>

                {/* Interactive Accent Bar */}
                <motion.div
                  className={`
                    absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    ${
                      stat.color === 'primary'
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500'
                        : stat.color === 'purple'
                          ? 'bg-gradient-to-r from-purple-600 to-purple-500'
                          : stat.color === 'success'
                            ? 'bg-gradient-to-r from-success-600 to-success-500'
                            : stat.color === 'teal'
                              ? 'bg-gradient-to-r from-teal-600 to-teal-500'
                              : 'bg-gradient-to-r from-neutral-600 to-neutral-500'
                    }
                  `}
                  layoutId={`accent-${stat.id}`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default OverviewStats;
