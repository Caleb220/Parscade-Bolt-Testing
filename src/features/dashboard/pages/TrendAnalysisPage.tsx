/**
 * Trend Analysis Page - Advanced Pattern Recognition & Forecasting
 * Machine learning-powered trend analysis with predictive insights
 */

import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  Activity,
  Brain,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Zap,
  Clock,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  FileText,
  Settings,
  Download,
  RefreshCw,
  Filter,
  Eye,
  Layers,
  PieChart,
  GitBranch,
} from 'lucide-react';
import React, { useState } from 'react';

import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';

interface TrendMetric {
  id: string;
  name: string;
  category: 'processing' | 'cost' | 'quality' | 'usage' | 'performance';
  currentValue: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  confidence: number;
  forecast: {
    nextWeek: number;
    nextMonth: number;
    nextQuarter: number;
  };
  icon: React.ComponentType<{ className?: string }>;
}

interface TrendPattern {
  id: string;
  name: string;
  description: string;
  type: 'seasonal' | 'cyclic' | 'linear' | 'exponential' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  affectedMetrics: string[];
  recommendation: string;
  confidence: number;
}

const TrendAnalysisPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data
  const trendMetrics: TrendMetric[] = [
    {
      id: 'tm-001',
      name: 'Processing Volume',
      category: 'processing',
      currentValue: 24750,
      previousValue: 21340,
      unit: 'documents',
      trend: 'up',
      changePercent: 15.9,
      confidence: 92,
      forecast: {
        nextWeek: 26200,
        nextMonth: 28900,
        nextQuarter: 35400,
      },
      icon: FileText,
    },
    {
      id: 'tm-002',
      name: 'Processing Cost',
      category: 'cost',
      currentValue: 0.024,
      previousValue: 0.028,
      unit: '$/page',
      trend: 'down',
      changePercent: -14.3,
      confidence: 88,
      forecast: {
        nextWeek: 0.023,
        nextMonth: 0.021,
        nextQuarter: 0.019,
      },
      icon: DollarSign,
    },
    {
      id: 'tm-003',
      name: 'Accuracy Rate',
      category: 'quality',
      currentValue: 97.8,
      previousValue: 97.2,
      unit: '%',
      trend: 'up',
      changePercent: 0.6,
      confidence: 95,
      forecast: {
        nextWeek: 98.1,
        nextMonth: 98.4,
        nextQuarter: 98.9,
      },
      icon: Target,
    },
    {
      id: 'tm-004',
      name: 'Active Users',
      category: 'usage',
      currentValue: 847,
      previousValue: 923,
      unit: 'users',
      trend: 'down',
      changePercent: -8.2,
      confidence: 76,
      forecast: {
        nextWeek: 820,
        nextMonth: 780,
        nextQuarter: 720,
      },
      icon: Users,
    },
    {
      id: 'tm-005',
      name: 'Response Time',
      category: 'performance',
      currentValue: 1.8,
      previousValue: 2.1,
      unit: 'seconds',
      trend: 'down',
      changePercent: -14.3,
      confidence: 91,
      forecast: {
        nextWeek: 1.7,
        nextMonth: 1.6,
        nextQuarter: 1.4,
      },
      icon: Zap,
    },
    {
      id: 'tm-006',
      name: 'Queue Length',
      category: 'performance',
      currentValue: 234,
      previousValue: 189,
      unit: 'jobs',
      trend: 'up',
      changePercent: 23.8,
      confidence: 83,
      forecast: {
        nextWeek: 267,
        nextMonth: 312,
        nextQuarter: 445,
      },
      icon: Clock,
    },
  ];

  const trendPatterns: TrendPattern[] = [
    {
      id: 'tp-001',
      name: 'Weekly Processing Peak',
      description: 'Consistent 40% increase in processing volume every Tuesday-Thursday',
      type: 'cyclic',
      severity: 'medium',
      detectedAt: '2024-02-18T10:30:00Z',
      affectedMetrics: ['Processing Volume', 'Queue Length', 'Response Time'],
      recommendation: 'Consider auto-scaling resources during peak days',
      confidence: 94,
    },
    {
      id: 'tp-002',
      name: 'Cost Optimization Trend',
      description: 'Steady 2% monthly decrease in processing costs due to AI improvements',
      type: 'linear',
      severity: 'low',
      detectedAt: '2024-02-15T14:20:00Z',
      affectedMetrics: ['Processing Cost'],
      recommendation: 'Continue current optimization strategy',
      confidence: 89,
    },
    {
      id: 'tp-003',
      name: 'User Engagement Decline',
      description: 'Gradual decrease in active users over past 6 weeks',
      type: 'linear',
      severity: 'high',
      detectedAt: '2024-02-10T09:15:00Z',
      affectedMetrics: ['Active Users', 'Processing Volume'],
      recommendation: 'Review user experience and implement retention strategies',
      confidence: 87,
    },
    {
      id: 'tp-004',
      name: 'Quality Improvement Acceleration',
      description: 'Exponential improvement in accuracy rates since AI model update',
      type: 'exponential',
      severity: 'low',
      detectedAt: '2024-02-05T16:45:00Z',
      affectedMetrics: ['Accuracy Rate'],
      recommendation: 'Document and replicate successful model improvements',
      confidence: 92,
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cost':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'quality':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'usage':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'performance':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-green-700 bg-green-50 border-green-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'seasonal':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'cyclic':
        return <RefreshCw className="w-5 h-5 text-purple-600" />;
      case 'linear':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'exponential':
        return <Activity className="w-5 h-5 text-orange-600" />;
      case 'anomaly':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <BarChart3 className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredMetrics = selectedCategory === 'all'
    ? trendMetrics
    : trendMetrics.filter(metric => metric.category === selectedCategory);

  return (
    <DashboardLayout
      title="Trend Analysis"
      subtitle="Advanced pattern recognition and predictive analytics powered by machine learning"
      variant="analytics"
      backgroundPattern="subtle"
      headerVariant="extended"
      showBreadcrumbs={true}
      actions={
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-200/60">
            <Calendar className="w-4 h-4 text-slate-600" />
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="bg-transparent border-none outline-none text-sm font-medium text-slate-700"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 bg-white border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Brain className="w-4 h-4" />
            <span>AI Insights</span>
          </button>
        </div>
      }
    >
      {/* Trend Overview Stats */}
      <div className="col-span-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardSection
            title="Trend Analysis Overview"
            subtitle="Machine learning insights and predictive analytics summary"
            className="bg-gradient-to-br from-white to-slate-50/30 border-slate-200/60"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              {[
                { icon: Brain, label: 'Patterns Detected', value: '23', change: '+5', color: 'purple' },
                { icon: TrendingUp, label: 'Positive Trends', value: '67%', change: '+12%', color: 'green' },
                { icon: Target, label: 'Forecast Accuracy', value: '89.4%', change: '+2.1%', color: 'blue' },
                { icon: AlertTriangle, label: 'Anomalies Found', value: '3', change: '-2', color: 'amber' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                      stat.color === 'green' ? 'bg-green-100 text-green-600' :
                      stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      stat.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' :
                      stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-slate-600 mb-1">{stat.label}</h3>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </DashboardSection>
        </motion.div>
      </div>

      {/* Category Filter */}
      <div className="col-span-12 mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-slate-700">Filter by category:</span>
          <div className="flex space-x-2">
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'processing', label: 'Processing' },
              { id: 'cost', label: 'Cost' },
              { id: 'quality', label: 'Quality' },
              { id: 'usage', label: 'Usage' },
              { id: 'performance', label: 'Performance' },
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Metrics */}
      <div className="col-span-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DashboardSection
            title="Key Trend Metrics"
            subtitle="Current values, trends, and AI-powered forecasts"
            className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/60"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-card-hover transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                          <metric.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">{metric.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(metric.category)}`}>
                            {metric.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(metric.trend)}
                        <span className={`text-sm font-medium ${
                          metric.trend === 'up' ? 'text-green-600' :
                          metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {metric.changePercent > 0 ? '+' : ''}{metric.changePercent}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Current Value</span>
                        <span className="font-semibold text-slate-900">
                          {metric.currentValue.toLocaleString()} {metric.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Previous Period</span>
                        <span className="font-medium text-slate-700">
                          {metric.previousValue.toLocaleString()} {metric.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">AI Confidence</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${metric.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-700">{metric.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="text-sm font-semibold text-slate-800 mb-2">AI Forecast</h4>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center">
                          <div className="text-slate-600">Next Week</div>
                          <div className="font-semibold text-blue-600">
                            {metric.forecast.nextWeek.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-slate-600">Next Month</div>
                          <div className="font-semibold text-blue-600">
                            {metric.forecast.nextMonth.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-slate-600">Next Quarter</div>
                          <div className="font-semibold text-blue-600">
                            {metric.forecast.nextQuarter.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </DashboardSection>
        </motion.div>
      </div>

      {/* Detected Patterns */}
      <div className="col-span-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <DashboardSection
            title="Detected Patterns"
            subtitle="AI-identified trends and behavioral patterns with actionable insights"
            className="bg-gradient-to-br from-white to-purple-50/30 border-purple-200/60"
          >
            <div className="p-6">
              <div className="space-y-4">
                {trendPatterns.map((pattern, index) => (
                  <motion.div
                    key={pattern.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-card transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                          {getPatternIcon(pattern.type)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-slate-900">{pattern.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(pattern.severity)}`}>
                              {pattern.severity}
                            </span>
                            <span className="text-xs text-slate-500 capitalize">{pattern.type}</span>
                          </div>

                          <p className="text-slate-700 mb-3">{pattern.description}</p>

                          <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                            <span>Detected: {new Date(pattern.detectedAt).toLocaleDateString()}</span>
                            <span>Confidence: {pattern.confidence}%</span>
                            <span>Affects: {pattern.affectedMetrics.length} metrics</span>
                          </div>

                          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                            <p className="text-sm text-blue-800">
                              <strong>Recommendation:</strong> {pattern.recommendation}
                            </p>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-1">
                            {pattern.affectedMetrics.map((metric) => (
                              <span
                                key={metric}
                                className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs"
                              >
                                {metric}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-2 hover:bg-slate-100 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </DashboardSection>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default TrendAnalysisPage;