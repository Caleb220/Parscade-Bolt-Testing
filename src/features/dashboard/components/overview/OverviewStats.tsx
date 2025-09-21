/**
 * Overview Statistics Component
 * Dashboard statistics cards with real-time data
 */

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, FileText, Users, Sparkles, Zap, Target, Crown } from 'lucide-react';

import { ParscadeCard } from '@/shared/components/brand';
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
    icon: <Sparkles className="h-5 w-5" />, 
    title: 'Transformations', 
    value: '0', 
    accentLabel: 'Ready', 
    subtitle: 'Documents transformed into structured data' 
  },
  { 
    icon: <Crown className="h-5 w-5" />, 
    title: 'Beta Access', 
    value: 'Active', 
    accentLabel: 'Premium', 
    subtitle: 'Exclusive early access to Parscade platform' 
  },
  { 
    icon: <Target className="h-5 w-5" />, 
    title: 'Accuracy Score', 
    value: '0', 
    accentLabel: 'Learning', 
    subtitle: 'AI model accuracy improves with each document' 
  },
  { 
    icon: <Zap className="h-5 w-5" />, 
    title: 'Processing Speed', 
    value: '250+', 
    accentLabel: 'Optimizing', 
    subtitle: 'Average processing time per document' 
  },
];

/**
 * Statistics overview for dashboard home page
 */
const OverviewStats: React.FC = () => {
  return (
    <DashboardGrid columns={4} gap="lg">
      {DEFAULT_STATS.map((stat, index) => (
        <ParscadeCard
          key={stat.title}
          variant="elevated"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="p-6 group cursor-pointer"
        >
          {/* Content */}
          <div className="relative z-10">
          <div className="flex items-center justify-between">
              <motion.div 
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-cyan-100 text-purple-600 shadow-parscade group-hover:shadow-parscade-lg transition-all duration-300"
                whileHover={{ 
                  rotate: 5, 
                  scale: 1.1,
                  boxShadow: '0 0 24px rgba(124, 109, 242, 0.4)'
                }}
              >
              {stat.icon}
              </motion.div>
              <motion.span 
                className="text-sm font-black text-purple-700 bg-gradient-to-r from-purple-50 to-cyan-50 px-3 py-1 rounded-full border border-purple-200/60"
                whileHover={{ scale: 1.05 }}
              >
                {stat.accentLabel}
              </motion.span>
          </div>
          
            <div className="mt-6 space-y-2">
              <div className="text-sm font-black text-purple-500 uppercase tracking-wide">{stat.title}</div>
              <div className="text-3xl font-black text-gray-900 tracking-tight">
              {stat.value}
            </div>
              <div className="text-sm text-purple-600/70 font-bold leading-relaxed">{stat.subtitle}</div>
          </div>
          </div>
          
          {/* Hover Accent */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            layoutId={`accent-${stat.title}`}
          />
        </ParscadeCard>
      ))}
    </DashboardGrid>
  );
};

export default OverviewStats;