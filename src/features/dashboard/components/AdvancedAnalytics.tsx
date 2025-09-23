/**
 * Advanced Analytics Component
 * Feature-gated analytics dashboard with real backend integration
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  Calendar,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';

import { ParscadeCard } from '@/shared/components/brand';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Badge } from '@/shared/components/ui/badge';
import { 
  useAnalyticsOverview, 
  useAnalyticsTrends, 
  useAnalyticsAccuracy, 
  useAnalyticsErrors 
} from '@/shared/hooks/api/useAnalytics';
import FeatureGate from '@/shared/components/layout/FeatureGate';
import { formatDate } from '@/shared/utils/date';

interface AdvancedAnalyticsProps {
  className?: string;
}


const AnalyticsHeader: React.FC = () => {
  return (
    <ParscadeCard
      variant="default"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="flex flex-col"
    >
      <div className="auto-rows-fr h-full">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center">
          <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Advanced Analytics</h2>
            <p className="text-sm text-blue-600">Detailed insights into your processing performance</p>
          </div>
        </div>
      </div>
        <FeatureGate featureId="analytis">
          <AdvancedAnalytics />
        </FeatureGate>
    </div>
    </ParscadeCard>
  )
}

/**
 * Advanced analytics dashboard with real-time data
 */
const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ className = '' }) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  
  const { data: overview, isLoading, error, refetch } = useAnalyticsOverview({ timeframe });
  const { data: trends } = useAnalyticsTrends({ timeframe });
  const { data: accuracy } = useAnalyticsAccuracy({ timeframe });
  const { data: errorRates } = useAnalyticsErrors({ timeframe });

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <ParscadeCard key={i} variant="default" className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-40" />
            </ParscadeCard>
          ))}
        </div>
        <ParscadeCard variant="default" className="p-6">
          <Skeleton className="h-64 w-full" />
        </ParscadeCard>
      </div>
    );
  }

  if (error) {
    return (
      <ParscadeCard variant="default" className={`p-6 ${className}`}>
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Unavailable</h3>
          <p className="text-gray-600 mb-4">Unable to load analytics data</p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </ParscadeCard>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <AnalyticsHeader />
        
        {/* Timeframe Selector */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 4 Weeks</option>
            <option value="year">Last 12 Months</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ParscadeCard variant="default" className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Processing Trends</h3>
              <p className="text-sm text-blue-600">
                {overview?.trends.summary.trend_direction === 'increasing' ? '↗ Increasing' : 
                 overview?.trends.summary.trend_direction === 'decreasing' ? '↘ Decreasing' : '→ Stable'}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">
              {overview?.trends.summary.total_data_points || 0}
            </div>
            <div className="text-sm text-slate-600">
              Data points in {timeframe} analysis
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard variant="default" className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Accuracy</h3>
              <p className="text-sm text-emerald-600">Overall Performance</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">
              {overview?.accuracy.summary.overall_average_accuracy?.toFixed(1) || '0.0'}%
            </div>
            <div className="text-sm text-slate-600">
              Across {overview?.accuracy.summary.total_document_types || 0} document types
            </div>
          </div>
        </ParscadeCard>

        <ParscadeCard variant="default" className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Error Analysis</h3>
              <p className="text-sm text-red-600">Issues Tracked</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">
              {overview?.errors.summary.total_errors || 0}
            </div>
            <div className="text-sm text-slate-600">
              {overview?.errors.summary.total_error_types || 0} error types identified
            </div>
          </div>
        </ParscadeCard>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Breakdown */}
        <ParscadeCard variant="default" className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <PieChart className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Accuracy by Document Type</h3>
              <p className="text-sm text-blue-600">Performance breakdown</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {accuracy?.data.map((item) => (
              <div key={item.document_type} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{item.document_type}</span>
                    <span className="text-sm font-bold text-blue-600">{item.average_accuracy.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.average_accuracy}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.total_processed} documents • {item.success_rate.toFixed(1)}% success rate
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                No accuracy data available for this timeframe
              </div>
            )}
          </div>
        </ParscadeCard>

        {/* Error Rates */}
        <ParscadeCard variant="default" className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Activity className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Error Analysis</h3>
              <p className="text-sm text-red-600">Common issues and trends</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {errorRates?.data.map((error) => (
              <div key={error.error_type} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{error.error_type}</span>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={error.recent_trend === 'increasing' ? 'destructive' : 
                              error.recent_trend === 'decreasing' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {error.recent_trend}
                    </Badge>
                    <span className="text-sm font-bold text-red-600">{error.count}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {error.percentage.toFixed(1)}% of total processing jobs
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                No error data available for this timeframe
              </div>
            )}
          </div>
        </ParscadeCard>
      </div>

      {/* Metadata */}
      {overview?.metadata && (
        <div className="text-center text-xs text-gray-500">
          Analytics generated {formatDate(overview.metadata.generated_at)} • 
          Timeframe: {overview.metadata.timeframe}
          {overview.metadata.date_range.start_date && overview.metadata.date_range.end_date && (
            <> • Range: {overview.metadata.date_range.start_date} to {overview.metadata.date_range.end_date}</>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsHeader;