/**
 * Recent Activity Component - Professional Blue Theme
 * Clean activity feed with refined styling
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, AlertTriangle, Zap, Activity, RefreshCw } from 'lucide-react';

import { ParscadeCard } from '@/shared/components/brand';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useDashboardActivity } from '@/shared/hooks/api/useDashboard';
import { formatRelativeTime } from '@/shared/utils/date';
import type { ActivityItem } from '@/types/dashboard-types';

/**
 * Real-time activity feed with backend integration
 */
const RecentActivity: React.FC = () => {
  const { data: activityData, isLoading, error, refetch } = useDashboardActivity({ 
    page: 1, 
    limit: 10 
  });

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'job.completed':
      case 'document.processed':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'job.processing':
        return <Zap className="w-4 h-4 text-blue-600" />;
      case 'job.failed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'job.created':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'document.uploaded':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'project.created':
      case 'project.updated':
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'job.completed':
      case 'document.processed':
        return 'from-emerald-100 to-emerald-200';
      case 'job.processing':
        return 'from-blue-100 to-blue-200';
      case 'job.failed':
        return 'from-red-100 to-red-200';
      case 'job.created':
        return 'from-yellow-100 to-yellow-200';
      case 'document.uploaded':
        return 'from-blue-100 to-blue-200';
      case 'project.created':
      case 'project.updated':
        return 'from-purple-100 to-purple-200';
      default:
        return 'from-blue-100 to-blue-200';
    }
  };

  const activities = activityData?.data || [];

  return (
    <ParscadeCard
      variant="default"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="h-full flex flex-col"
    >
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center">
          <Activity className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-blue-600 text-sm mt-1">Latest processing updates</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-parscade"
            >
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </motion.div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load activity</h3>
            <p className="text-slate-600 mb-4">Unable to fetch recent activity</p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-parscade"
            >
              <Clock className="w-6 h-6 text-blue-500" />
            </motion.div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
            <p className="text-slate-600">Your document processing activity will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ 
                  x: 2,
                  backgroundColor: "rgba(14, 165, 233, 0.02)",
                  transition: { duration: 0.2 }
                }}
                className="flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 hover:shadow-sm group cursor-pointer"
              >
                <motion.div 
                  className={`flex-shrink-0 mt-1 w-8 h-8 bg-gradient-to-br ${getActivityColor(activity.type)} rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200`}
                  whileHover={{ scale: 1.1 }}
                >
                  {getActivityIcon(activity.type)}
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                    {activity.title}
                  </p>
                  <p className="text-sm text-slate-600 truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {activityData?.total_pages && activityData.total_pages > 1 && (
        <div className="p-4 border-t border-slate-200">
          <div className="text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All Activity ({activityData.total} total)
            </button>
          </div>
        </div>
      )}
    </ParscadeCard>
  );
};

export default RecentActivity;