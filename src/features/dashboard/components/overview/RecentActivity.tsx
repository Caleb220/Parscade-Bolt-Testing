/**
 * Recent Activity Component
 * Shows recent user activity and system events
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, AlertTriangle, Sparkles, Zap } from 'lucide-react';

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
 * Recent activity feed for dashboard overview
 */
const RecentActivity: React.FC = () => {
  const activities = MOCK_ACTIVITIES; // Replace with real data

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'completed':
        return <Sparkles className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <Zap className="w-4 h-4 text-purple-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <ParscadeCard
      variant="gradient"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="p-6 border-b border-purple-200/30 bg-gradient-to-r from-purple-50/30 to-cyan-50/30">
        <div className="flex items-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-purple-600 mr-3" />
          </motion.div>
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Activity Stream</h2>
            <p className="text-purple-600 text-sm mt-1 font-bold">Latest transformation updates</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
      {activities.length === 0 ? (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-parscade"
            >
              <Clock className="w-8 h-8 text-purple-500" />
            </motion.div>
            <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">No recent activity</h3>
            <p className="text-purple-600 font-bold">Your document transformation activity will appear here.</p>
          </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
              <motion.div
              key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ 
                  x: 4,
                  backgroundColor: "rgba(124, 109, 242, 0.02)",
                  transition: { duration: 0.2 }
                }}
                className="flex items-start space-x-4 p-4 rounded-xl transition-all duration-200 hover:shadow-sm group cursor-pointer"
            >
                <motion.div 
                  className="flex-shrink-0 mt-1 w-8 h-8 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-lg flex items-center justify-center shadow-parscade group-hover:shadow-parscade-lg transition-all duration-200"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                {getActivityIcon(activity.type)}
                </motion.div>
              
              <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 group-hover:text-purple-700 transition-colors duration-200">
                  {activity.title}
                </p>
                  <p className="text-sm text-purple-600/70 truncate font-bold">
                  {activity.description}
                </p>
                  <p className="text-xs text-purple-500 mt-1 font-bold">
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