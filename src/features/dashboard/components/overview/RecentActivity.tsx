/**
 * Recent Activity Component - Professional Blue Theme
 * Clean activity feed with refined styling
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, AlertTriangle, Zap, Activity } from 'lucide-react';

import { ParscadeCard } from '@/shared/components/brand';

interface ActivityItem {
  id: string;
  type: 'upload' | 'processing' | 'completed' | 'error';
  title: string;
  description: string;
  timestamp: string;
}

// Mock data - replace with real data from API
const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'completed',
    title: 'Document processed successfully',
    description: 'invoice_2024_001.pdf',
    timestamp: '2 minutes ago',
  },
  {
    id: '2',
    type: 'processing',
    title: 'Processing document',
    description: 'contract_draft.docx',
    timestamp: '5 minutes ago',
  },
  {
    id: '3',
    type: 'upload',
    title: 'Document uploaded',
    description: 'financial_report.xlsx',
    timestamp: '10 minutes ago',
  },
];

/**
 * Professional activity feed with refined blue theme
 */
const RecentActivity: React.FC = () => {
  const activities = MOCK_ACTIVITIES; // Replace with real data

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'processing':
        return <Zap className="w-4 h-4 text-blue-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'completed':
        return 'from-emerald-100 to-emerald-200';
      case 'processing':
        return 'from-blue-100 to-blue-200';
      case 'error':
        return 'from-red-100 to-red-200';
      default:
        return 'from-blue-100 to-blue-200';
    }
  };

  return (
    <ParscadeCard
      variant="default"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
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
      
      <div className="p-6">
        {activities.length === 0 ? (
          <div className="text-center py-8">
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
                    {activity.timestamp}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </ParscadeCard>
  );
};

export default RecentActivity;