/**
 * Predictive Analytics Page - Machine Learning Forecasting
 * Advanced predictive modeling with scenario planning and risk assessment
 */

import { motion } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Zap,
  DollarSign,
  Users,
  Clock,
  Shield,
  Lightbulb,
  Settings,
  Download,
  RefreshCw,
  PlayCircle,
  PauseCircle,
  Eye,
  GitBranch,
  Layers,
  Cpu,
  Database,
} from 'lucide-react';
import React, { useState } from 'react';

import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';

interface PredictionModel {
  id: string;
  name: string;
  type: 'demand' | 'capacity' | 'cost' | 'quality' | 'risk';
  accuracy: number;
  status: 'active' | 'training' | 'inactive' | 'error';
  lastTrained: string;
  nextTraining: string;
  dataPoints: number;
  predictions: {
    current: number;
    nextWeek: number;
    nextMonth: number;
    nextQuarter: number;
    confidence: number;
  };
  icon: React.ComponentType<{ className?: string }>;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  type: 'optimistic' | 'baseline' | 'pessimistic' | 'custom';
  probability: number;
  impact: {
    revenue: number;
    cost: number;
    efficiency: number;
  };
  keyFactors: string[];
  timeline: string;
}

interface RiskFactor {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  impact: number;
  riskScore: number;
  mitigation: string;
  category: 'operational' | 'financial' | 'technical' | 'market';
}

const PredictiveAnalyticsPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1m' | '3m' | '6m' | '1y'>('3m');
  const [selectedModel, setSelectedModel] = useState<string>('all');

  // Mock data
  const predictionModels: PredictionModel[] = [
    {
      id: 'pm-001',
      name: 'Document Volume Predictor',
      type: 'demand',
      accuracy: 94.2,
      status: 'active',
      lastTrained: '2024-02-19T10:30:00Z',
      nextTraining: '2024-02-26T10:30:00Z',
      dataPoints: 15420,
      predictions: {
        current: 24750,
        nextWeek: 26200,
        nextMonth: 28900,
        nextQuarter: 35400,
        confidence: 92,
      },
      icon: BarChart3,
    },
    {
      id: 'pm-002',
      name: 'Processing Capacity Model',
      type: 'capacity',
      accuracy: 89.7,
      status: 'active',
      lastTrained: '2024-02-18T14:15:00Z',
      nextTraining: '2024-02-25T14:15:00Z',
      dataPoints: 12340,
      predictions: {
        current: 45000,
        nextWeek: 47500,
        nextMonth: 52000,
        nextQuarter: 68000,
        confidence: 87,
      },
      icon: Cpu,
    },
    {
      id: 'pm-003',
      name: 'Cost Optimization Engine',
      type: 'cost',
      accuracy: 91.8,
      status: 'training',
      lastTrained: '2024-02-17T09:00:00Z',
      nextTraining: '2024-02-24T09:00:00Z',
      dataPoints: 8920,
      predictions: {
        current: 0.024,
        nextWeek: 0.023,
        nextMonth: 0.021,
        nextQuarter: 0.019,
        confidence: 89,
      },
      icon: DollarSign,
    },
    {
      id: 'pm-004',
      name: 'Quality Forecast Model',
      type: 'quality',
      accuracy: 96.3,
      status: 'active',
      lastTrained: '2024-02-20T08:45:00Z',
      nextTraining: '2024-02-27T08:45:00Z',
      dataPoints: 18750,
      predictions: {
        current: 97.8,
        nextWeek: 98.1,
        nextMonth: 98.4,
        nextQuarter: 98.9,
        confidence: 94,
      },
      icon: Target,
    },
    {
      id: 'pm-005',
      name: 'Risk Assessment AI',
      type: 'risk',
      accuracy: 87.4,
      status: 'active',
      lastTrained: '2024-02-16T16:20:00Z',
      nextTraining: '2024-02-23T16:20:00Z',
      dataPoints: 6430,
      predictions: {
        current: 12,
        nextWeek: 14,
        nextMonth: 18,
        nextQuarter: 25,
        confidence: 85,
      },
      icon: Shield,
    },
  ];

  const scenarios: Scenario[] = [
    {
      id: 'sc-001',
      name: 'Market Growth Acceleration',
      description: '25% increase in document processing demand due to market expansion',
      type: 'optimistic',
      probability: 35,
      impact: {
        revenue: 180000,
        cost: 45000,
        efficiency: 15,
      },
      keyFactors: ['Market expansion', 'New partnerships', 'Product adoption'],
      timeline: '6 months',
    },
    {
      id: 'sc-002',
      name: 'Steady Growth Trajectory',
      description: 'Continued stable growth following current trends',
      type: 'baseline',
      probability: 55,
      impact: {
        revenue: 120000,
        cost: 28000,
        efficiency: 8,
      },
      keyFactors: ['Current trends', 'Existing customer base', 'Normal operations'],
      timeline: '12 months',
    },
    {
      id: 'sc-003',
      name: 'Economic Downturn Impact',
      description: 'Reduced demand due to economic uncertainty and budget cuts',
      type: 'pessimistic',
      probability: 20,
      impact: {
        revenue: -85000,
        cost: -15000,
        efficiency: -12,
      },
      keyFactors: ['Economic recession', 'Budget constraints', 'Market contraction'],
      timeline: '18 months',
    },
    {
      id: 'sc-004',
      name: 'AI Breakthrough Scenario',
      description: 'Significant efficiency gains from next-generation AI models',
      type: 'custom',
      probability: 25,
      impact: {
        revenue: 95000,
        cost: -35000,
        efficiency: 45,
      },
      keyFactors: ['AI advancement', 'Cost reduction', 'Competitive advantage'],
      timeline: '9 months',
    },
  ];

  const riskFactors: RiskFactor[] = [
    {
      id: 'rf-001',
      name: 'API Rate Limit Breach',
      description: 'Potential service disruption due to approaching API rate limits',
      severity: 'high',
      probability: 75,
      impact: 8,
      riskScore: 60,
      mitigation: 'Implement rate limiting and upgrade API tier',
      category: 'technical',
    },
    {
      id: 'rf-002',
      name: 'Data Quality Degradation',
      description: 'Declining accuracy in source data affecting model performance',
      severity: 'medium',
      probability: 45,
      impact: 6,
      riskScore: 27,
      mitigation: 'Implement data validation pipelines and quality monitoring',
      category: 'operational',
    },
    {
      id: 'rf-003',
      name: 'Competitive Pricing Pressure',
      description: 'New market entrants offering significantly lower pricing',
      severity: 'medium',
      probability: 60,
      impact: 7,
      riskScore: 42,
      mitigation: 'Develop value-based pricing strategy and feature differentiation',
      category: 'market',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'training':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'inactive':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'demand':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'capacity':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cost':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'quality':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'risk':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getScenarioColor = (type: string) => {
    switch (type) {
      case 'optimistic':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'baseline':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'pessimistic':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'custom':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
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

  return (
    <DashboardLayout
      title="Predictive Analytics"
      subtitle="Machine learning-powered forecasting and scenario planning for strategic decision making"
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
              <option value="1m">1 Month</option>
              <option value="3m">3 Months</option>
              <option value="6m">6 Months</option>
              <option value="1y">1 Year</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 bg-white border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Brain className="w-4 h-4" />
            <span>Run Predictions</span>
          </button>
        </div>
      }
    >
      {/* Predictive Overview Stats */}
      <div className="col-span-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardSection
            title="Predictive Models Overview"
            subtitle="AI-powered forecasting models and prediction accuracy metrics"
            className="bg-gradient-to-br from-white to-slate-50/30 border-slate-200/60"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              {[
                { icon: Brain, label: 'Active Models', value: '5', change: '+2', color: 'purple' },
                { icon: Target, label: 'Avg Accuracy', value: '91.8%', change: '+3.2%', color: 'green' },
                { icon: Database, label: 'Data Points', value: '62K', change: '+8.4K', color: 'blue' },
                { icon: Lightbulb, label: 'Insights Generated', value: '47', change: '+12', color: 'amber' },
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

      {/* Prediction Models */}
      <div className="col-span-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DashboardSection
            title="Machine Learning Models"
            subtitle="Advanced prediction models with real-time forecasting capabilities"
            className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/60"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {predictionModels.map((model, index) => (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-card-hover transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                          <model.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">{model.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(model.type)}`}>
                              {model.type}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(model.status)}`}>
                              {model.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-slate-100 rounded">
                          {model.status === 'active' ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Accuracy</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${model.accuracy}%` }}
                            />
                          </div>
                          <span className="font-semibold text-green-600">{model.accuracy}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Data Points</span>
                        <span className="font-medium text-slate-900">{model.dataPoints.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Last Trained</span>
                        <span className="font-medium text-slate-700">
                          {new Date(model.lastTrained).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="text-sm font-semibold text-slate-800 mb-2">Predictions</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <div className="text-slate-600">Next Week</div>
                          <div className="font-semibold text-blue-600">
                            {model.predictions.nextWeek.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-600">Next Month</div>
                          <div className="font-semibold text-blue-600">
                            {model.predictions.nextMonth.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-600">Next Quarter</div>
                          <div className="font-semibold text-blue-600">
                            {model.predictions.nextQuarter.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-600">Confidence</div>
                          <div className="font-semibold text-purple-600">{model.predictions.confidence}%</div>
                        </div>
                      </div>

                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        View Detailed Forecast
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </DashboardSection>
        </motion.div>
      </div>

      {/* Scenario Planning */}
      <div className="col-span-12 lg:col-span-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <DashboardSection
            title="Scenario Planning"
            subtitle="Strategic scenario analysis with impact assessment"
            className="bg-gradient-to-br from-white to-green-50/30 border-green-200/60"
          >
            <div className="p-6">
              <div className="space-y-4">
                {scenarios.map((scenario, index) => (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-card transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{scenario.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getScenarioColor(scenario.type)}`}>
                            {scenario.type}
                          </span>
                          <span className="text-sm text-slate-600">{scenario.probability}% probability</span>
                        </div>
                        <p className="text-slate-700 mb-3">{scenario.description}</p>
                      </div>
                      <button className="p-2 hover:bg-slate-100 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-slate-600">Revenue Impact</div>
                        <div className={`font-semibold ${
                          scenario.impact.revenue > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${Math.abs(scenario.impact.revenue).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-slate-600">Cost Impact</div>
                        <div className={`font-semibold ${
                          scenario.impact.cost > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          ${Math.abs(scenario.impact.cost).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-sm text-slate-600">Efficiency Change</div>
                        <div className={`font-semibold ${
                          scenario.impact.efficiency > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {scenario.impact.efficiency > 0 ? '+' : ''}{scenario.impact.efficiency}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex flex-wrap gap-1">
                        {scenario.keyFactors.map((factor) => (
                          <span
                            key={factor}
                            className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs"
                          >
                            {factor}
                          </span>
                        ))}
                      </div>
                      <span className="text-slate-500">Timeline: {scenario.timeline}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </DashboardSection>
        </motion.div>
      </div>

      {/* Risk Assessment */}
      <div className="col-span-12 lg:col-span-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <DashboardSection
            title="Risk Assessment"
            subtitle="AI-powered risk identification and mitigation"
            className="bg-gradient-to-br from-white to-red-50/30 border-red-200/60"
          >
            <div className="p-6">
              <div className="space-y-4">
                {riskFactors.map((risk, index) => (
                  <motion.div
                    key={risk.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white border border-slate-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 text-sm">{risk.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(risk.severity)}`}>
                        {risk.severity}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mb-3">{risk.description}</p>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Probability</span>
                        <span className="font-medium">{risk.probability}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Impact</span>
                        <span className="font-medium">{risk.impact}/10</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Risk Score</span>
                        <span className={`font-semibold ${
                          risk.riskScore > 50 ? 'text-red-600' :
                          risk.riskScore > 25 ? 'text-amber-600' : 'text-green-600'
                        }`}>
                          {risk.riskScore}
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-2 rounded text-xs">
                      <strong className="text-blue-800">Mitigation:</strong>
                      <p className="text-blue-700 mt-1">{risk.mitigation}</p>
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

export default PredictiveAnalyticsPage;