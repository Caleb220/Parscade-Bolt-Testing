/**
 * Business Intelligence Page - Advanced Analytics Dashboard
 * Enterprise-grade insights and data visualization
 */

import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  DollarSign,
  Users,
  FileText,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Brain,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Eye,
} from 'lucide-react';
import React, { useState } from 'react';

import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';

interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'teal' | 'amber';
  description: string;
}

interface ChartData {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  data: any[];
  color: string;
}

const BusinessIntelligencePage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const keyMetrics: MetricCard[] = [
    {
      id: 'processing-volume',
      title: 'Processing Volume',
      value: '847,293',
      change: '+23.5%',
      trend: 'up',
      icon: FileText,
      color: 'blue',
      description: 'Documents processed this month',
    },
    {
      id: 'processing-speed',
      title: 'Avg Processing Time',
      value: '2.4s',
      change: '-18.3%',
      trend: 'up',
      icon: Zap,
      color: 'green',
      description: 'Average time per document',
    },
    {
      id: 'accuracy-rate',
      title: 'Accuracy Rate',
      value: '99.7%',
      change: '+0.3%',
      trend: 'up',
      icon: Target,
      color: 'purple',
      description: 'AI extraction accuracy',
    },
    {
      id: 'cost-per-page',
      title: 'Cost per Page',
      value: '$0.012',
      change: '-8.7%',
      trend: 'up',
      icon: DollarSign,
      color: 'teal',
      description: 'Processing cost optimization',
    },
    {
      id: 'active-users',
      title: 'Active Users',
      value: '2,847',
      change: '+15.2%',
      trend: 'up',
      icon: Users,
      color: 'amber',
      description: 'Monthly active users',
    },
    {
      id: 'ai-confidence',
      title: 'AI Confidence',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: Brain,
      color: 'blue',
      description: 'Average AI confidence score',
    },
  ];

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/60 text-blue-700',
      green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200/60 text-green-700',
      purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/60 text-purple-700',
      teal: 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200/60 text-teal-700',
      amber: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200/60 text-amber-700',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'down':
        return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <DashboardLayout
      title="Business Intelligence"
      subtitle="Advanced analytics and data insights for enterprise decision making"
      variant="analytics"
      backgroundPattern="subtle"
      headerVariant="extended"
      showBreadcrumbs={true}
      actions={
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-200/60">
            <Calendar className="w-4 h-4 text-slate-600" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-transparent border-none outline-none text-sm font-medium text-slate-700"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>

          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="font-medium">Refresh</span>
          </button>
        </div>
      }
    >
      {/* Key Metrics Overview */}
      <div className="col-span-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardSection
            title="Key Performance Indicators"
            subtitle="Real-time metrics and performance tracking"
            className="bg-gradient-to-br from-white to-slate-50/30 border-slate-200/60"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {keyMetrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative p-6 rounded-2xl border ${getColorClasses(metric.color)} shadow-card hover:shadow-card-hover transition-all duration-300`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-parscade-xs ${
                      metric.color === 'blue' ? 'bg-blue-600' :
                      metric.color === 'green' ? 'bg-green-600' :
                      metric.color === 'purple' ? 'bg-purple-600' :
                      metric.color === 'teal' ? 'bg-teal-600' :
                      'bg-amber-600'
                    }`}>
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                    {getTrendIcon(metric.trend)}
                  </div>

                  <h3 className="text-sm font-semibold text-slate-600 mb-1">{metric.title}</h3>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</p>
                      <p className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-600' :
                        metric.trend === 'down' ? 'text-red-600' : 'text-slate-600'
                      }`}>
                        {metric.change}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{metric.description}</p>
                </motion.div>
              ))}
            </div>
          </DashboardSection>
        </motion.div>
      </div>

      {/* Processing Trends Chart */}
      <div className="col-span-12 lg:col-span-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <DashboardSection
            title="Processing Volume Trends"
            subtitle="Document processing patterns and forecasts"
            className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/60"
          >
            <div className="p-6">
              {/* Chart placeholder - would integrate with real charting library */}
              <div className="h-80 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200/40 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Interactive Charts</h3>
                  <p className="text-slate-500">Advanced visualization with Chart.js/D3.js integration</p>
                </div>
              </div>
            </div>
          </DashboardSection>
        </motion.div>
      </div>

      {/* Accuracy Analysis */}
      <div className="col-span-12 lg:col-span-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <DashboardSection
            title="Accuracy Distribution"
            subtitle="AI confidence and error analysis"
            className="bg-gradient-to-br from-white to-purple-50/30 border-purple-200/60"
          >
            <div className="p-6">
              <div className="h-80 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200/40 flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Accuracy Breakdown</h3>
                  <p className="text-slate-500">Detailed accuracy metrics by document type</p>
                </div>
              </div>
            </div>
          </DashboardSection>
        </motion.div>
      </div>

      {/* Cost Analytics */}
      <div className="col-span-12 lg:col-span-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <DashboardSection
            title="Cost Analysis & Optimization"
            subtitle="Processing costs and efficiency metrics"
            className="bg-gradient-to-br from-white to-teal-50/30 border-teal-200/60"
          >
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-teal-50/50 rounded-lg border border-teal-200/40">
                  <div>
                    <h4 className="font-semibold text-slate-800">Monthly Processing Costs</h4>
                    <p className="text-teal-600 text-2xl font-bold">$12,847</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-teal-600" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Cost per Document</span>
                    <span className="font-semibold">$0.15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Efficiency Gain</span>
                    <span className="font-semibold text-green-600">+23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">ROI Improvement</span>
                    <span className="font-semibold text-green-600">+47%</span>
                  </div>
                </div>
              </div>
            </div>
          </DashboardSection>
        </motion.div>
      </div>

      {/* User Activity Insights */}
      <div className="col-span-12 lg:col-span-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <DashboardSection
            title="User Activity Insights"
            subtitle="Team productivity and usage patterns"
            className="bg-gradient-to-br from-white to-amber-50/30 border-amber-200/60"
          >
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { name: 'Sarah Chen', role: 'Data Analyst', processed: 847, efficiency: 98 },
                  { name: 'Michael Rodriguez', role: 'Operations Manager', processed: 623, efficiency: 94 },
                  { name: 'Emily Watson', role: 'Document Specialist', processed: 592, efficiency: 96 },
                  { name: 'David Park', role: 'Quality Analyst', processed: 445, efficiency: 99 },
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-amber-50/30 rounded-lg border border-amber-200/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{user.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{user.name}</p>
                        <p className="text-sm text-slate-600">{user.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">{user.processed} docs</p>
                      <p className="text-sm text-green-600">{user.efficiency}% efficiency</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DashboardSection>
        </motion.div>
      </div>

      {/* Export and Actions */}
      <div className="col-span-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex justify-between items-center p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-slate-200/60"
        >
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Export Analytics Data</h3>
            <p className="text-slate-600">Download detailed reports and insights</p>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 bg-white border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              <Eye className="w-4 h-4" />
              <span>Preview Report</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default BusinessIntelligencePage;