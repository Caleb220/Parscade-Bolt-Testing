/**
 * Analytics Dashboard Page - Data Insights and Metrics
 * Professional analytics dashboard with charts and KPIs
 */

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, FileText, Clock, ArrowUpRight } from 'lucide-react';
import React from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import CustomButton from '@/shared/components/forms/CustomButton';
import FeatureGate from '@/shared/components/layout/FeatureGate';

import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';

/**
 * Analytics page with data insights and metrics
 */
const AnalyticsPage: React.FC = () => {
  const mockStats = [
    {
      title: 'Documents Processed',
      value: '1,247',
      change: '+12.5%',
      icon: FileText,
      trend: 'up' as const,
    },
    {
      title: 'Processing Time Saved',
      value: '42.3h',
      change: '+8.2%',
      icon: Clock,
      trend: 'up' as const,
    },
    {
      title: 'Active Projects',
      value: '18',
      change: '+3',
      icon: Users,
      trend: 'up' as const,
    },
    {
      title: 'Success Rate',
      value: '96.8%',
      change: '+2.1%',
      icon: TrendingUp,
      trend: 'up' as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Track your document processing performance and insights</p>
          </div>

          <FeatureGate requiredTier="pro">
            <CustomButton variant="primary" leftIcon={<ArrowUpRight className="w-4 h-4" />}>
              Export Report
            </CustomButton>
          </FeatureGate>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {mockStats.map((stat, index) => (
            <ParscadeCard key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span
                  className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </ParscadeCard>
          ))}
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <DashboardSection
            title="Processing Volume"
            description="Document processing trends over time"
            className="lg:col-span-2"
          >
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Chart visualization coming soon</p>
                <p className="text-sm text-gray-400">Upgrade to Pro to unlock advanced analytics</p>
              </div>
            </div>
          </DashboardSection>
        </motion.div>

        {/* Feature Promotion */}
        <FeatureGate
          requiredTier="pro"
          fallback={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ParscadeCard className="p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="max-w-md mx-auto">
                  <BarChart3 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Unlock Advanced Analytics
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get detailed insights, custom reports, and real-time metrics with Pro
                  </p>
                  <CustomButton variant="primary" size="lg">
                    Upgrade to Pro
                  </CustomButton>
                </div>
              </ParscadeCard>
            </motion.div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardSection title="Usage Trends">
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Usage trend chart</span>
              </div>
            </DashboardSection>

            <DashboardSection title="Performance Metrics">
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Performance metrics</span>
              </div>
            </DashboardSection>
          </div>
        </FeatureGate>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
