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
    <DashboardCard
      title="Recent Activity"
      description="Latest updates from your document processing"
    >
      {activities.length === 0 ? (
        <EmptyState
          icon={<Clock className="w-8 h-8 text-gray-400" />}
          title="No recent activity"
          description="Your recent document processing activity will appear here."
        />
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
};

export default RecentActivity;