/**
 * Overview Statistics Component
 * Dashboard statistics cards with real-time data
 */

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, FileText, Users } from 'lucide-react';

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
    <DashboardGrid columns={4} gap="lg">
      {DEFAULT_STATS.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ 
            y: -8, 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          className="relative overflow-hidden rounded-2xl border border-gray-200/60 bg-gradient-to-br from-white to-gray-50/30 p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300 group cursor-pointer"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Content */}
          <div className="relative z-10">
          <div className="flex items-center justify-between">
              <motion.div 
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 shadow-sm group-hover:shadow-md transition-all duration-300"
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
              {stat.icon}
              </motion.div>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{stat.accentLabel}</span>
          </div>
          
            <div className="mt-6 space-y-2">
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">{stat.title}</div>
              <div className="text-3xl font-black text-gray-900 tracking-tight">
              {stat.value}
            </div>
              <div className="text-sm text-gray-600 font-medium leading-relaxed">{stat.subtitle}</div>
          </div>
          </div>
          
          {/* Hover Accent */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            layoutId={`accent-${stat.title}`}
          />
        </motion.div>
      ))}
    </DashboardGrid>
  );
};

export default OverviewStats;