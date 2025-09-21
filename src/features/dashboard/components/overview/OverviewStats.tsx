/**
 * Overview Statistics Component
 * Dashboard statistics cards with real-time data
 */

import React from 'react';
import { BarChart3, Clock, FileText, Users } from 'lucide-react';

import DashboardCard from '../ui/DashboardCard';
import DashboardGrid from '../ui/DashboardGrid';

interface StatItem {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  accentLabel: string;
}

const DEFAULT_STATS: StatItem[] = [
  { 
    icon: <FileText className="h-5 w-5" />, 
    title: 'Beta Documents', 
    value: '0', 
    accentLabel: 'Start testing', 
    subtitle: 'Upload documents to see analytics here.' 
  },
  { 
    icon: <BarChart3 className="h-5 w-5" />, 
    title: 'Beta Status', 
    value: 'Active', 
    accentLabel: 'Enrolled', 
    subtitle: 'You are currently part of the beta program.' 
  },
  { 
    icon: <Clock className="h-5 w-5" />, 
    title: 'Feedback Sent', 
    value: '0', 
    accentLabel: 'Share ideas', 
    subtitle: 'Tell us what would make this more useful.' 
  },
  { 
    icon: <Users className="h-5 w-5" />, 
    title: 'Beta Community', 
    value: '250+', 
    accentLabel: 'Growing', 
    subtitle: 'Join the conversation with other early adopters.' 
  },
];

/**
 * Statistics overview for dashboard home page
 */
const OverviewStats: React.FC = () => {
  return (
    <DashboardGrid columns={4} gap="md">
      {DEFAULT_STATS.map((stat, index) => (
        <div
          key={stat.title}
          className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              {stat.icon}
            </div>
            <span className="text-sm font-semibold text-blue-600">{stat.accentLabel}</span>
          </div>
          
          <div className="mt-6">
            <div className="text-sm font-medium text-gray-500">{stat.title}</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900 tracking-tight">
              {stat.value}
            </div>
            <div className="mt-2 text-sm text-gray-500">{stat.subtitle}</div>
          </div>
        </div>
      ))}
    </DashboardGrid>
  );
};

export default OverviewStats;