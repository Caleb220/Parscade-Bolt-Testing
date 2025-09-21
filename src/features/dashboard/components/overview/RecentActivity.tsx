/**
 * Recent Activity Component
 * Shows recent user activity and system events
 */

import React from 'react';
import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';


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
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl border border-gray-200/60 shadow-premium hover:shadow-premium-lg transition-all duration-300"
    >
      <div className="p-6 border-b border-gray-200/60 bg-gradient-to-r from-purple-50/30 to-pink-50/30">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Recent Activity</h2>
        <p className="text-gray-600 text-sm mt-1 font-medium">Latest updates from your document processing</p>
      </div>
      
      <div className="p-6">
      {activities.length === 0 ? (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
            >
              <Clock className="w-8 h-8 text-gray-400" />
            </motion.div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">No recent activity</h3>
            <p className="text-gray-600 font-medium">Your recent document processing activity will appear here.</p>
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
                  backgroundColor: "rgba(59, 130, 246, 0.02)",
                  transition: { duration: 0.2 }
                }}
                className="flex items-start space-x-4 p-4 rounded-xl transition-all duration-200 hover:shadow-sm group cursor-pointer"
            >
                <motion.div 
                  className="flex-shrink-0 mt-1 w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200/50 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                {getActivityIcon(activity.type)}
                </motion.div>
              
              <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                  {activity.title}
                </p>
                  <p className="text-sm text-gray-600 truncate font-medium">
                  {activity.description}
                </p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                  {activity.timestamp}
                </p>
              </div>
              </motion.div>
          ))}
        </div>
      )}
      </div>
    </motion.div>
  );
};

export default RecentActivity;