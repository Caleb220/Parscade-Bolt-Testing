/**
 * Engine Configuration Page - Advanced Processing Engine Settings
 * Comprehensive configuration management for AI models, OCR engines, and processing parameters
 */

import { motion } from 'framer-motion';
import {
  Settings,
  Cpu,
  Brain,
  Target,
  Zap,
  Database,
  Cloud,
  Shield,
  Monitor,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Download,
  Upload,
  Copy,
  History,
  Lock,
  Unlock,
  TestTube,
  BarChart3,
  Activity,
  Gauge,
  HardDrive,
} from 'lucide-react';
import React, { useState } from 'react';

import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';

interface ConfigSection {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  settings: ConfigSetting[];
  status: 'active' | 'inactive' | 'warning';
}

interface ConfigSetting {
  id: string;
  name: string;
  description: string;
  type: 'toggle' | 'slider' | 'select' | 'input' | 'multiselect';
  value: any;
  defaultValue: any;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  validation?: {
    required?: boolean;
    pattern?: string;
    message?: string;
  };
  impact: 'low' | 'medium' | 'high' | 'critical';
  requiresRestart: boolean;
  category: string;
}

interface PerformanceMetric {
  name: string;
  current: number;
  optimal: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

const EngineConfigurationPage: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>('processing');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);

  // Mock configuration data
  const configSections: ConfigSection[] = [
    {
      id: 'processing',
      name: 'Processing Engine',
      description: 'Core document processing and OCR configuration',
      icon: Cpu,
      status: 'active',
      settings: [
        {
          id: 'ocr_engine',
          name: 'OCR Engine',
          description: 'Primary OCR engine for text extraction',
          type: 'select',
          value: 'advanced',
          defaultValue: 'standard',
          options: [
            { label: 'Standard OCR', value: 'standard' },
            { label: 'Advanced OCR', value: 'advanced' },
            { label: 'Premium OCR', value: 'premium' },
            { label: 'Custom Neural', value: 'neural' },
          ],
          impact: 'high',
          requiresRestart: true,
          category: 'engine',
        },
        {
          id: 'confidence_threshold',
          name: 'Confidence Threshold',
          description: 'Minimum confidence score for accepting OCR results',
          type: 'slider',
          value: 85,
          defaultValue: 80,
          min: 50,
          max: 99,
          step: 1,
          unit: '%',
          impact: 'medium',
          requiresRestart: false,
          category: 'quality',
        },
        {
          id: 'parallel_processing',
          name: 'Parallel Processing',
          description: 'Enable multi-threaded document processing',
          type: 'toggle',
          value: true,
          defaultValue: false,
          impact: 'high',
          requiresRestart: true,
          category: 'performance',
        },
        {
          id: 'max_concurrent_jobs',
          name: 'Max Concurrent Jobs',
          description: 'Maximum number of documents processed simultaneously',
          type: 'slider',
          value: 8,
          defaultValue: 4,
          min: 1,
          max: 16,
          step: 1,
          unit: 'jobs',
          impact: 'critical',
          requiresRestart: true,
          category: 'performance',
        },
      ],
    },
    {
      id: 'ai_models',
      name: 'AI Models',
      description: 'Machine learning model configuration and optimization',
      icon: Brain,
      status: 'active',
      settings: [
        {
          id: 'primary_model',
          name: 'Primary AI Model',
          description: 'Main machine learning model for document analysis',
          type: 'select',
          value: 'parscade-v3',
          defaultValue: 'parscade-v2',
          options: [
            { label: 'Parscade v2.0', value: 'parscade-v2' },
            { label: 'Parscade v3.0', value: 'parscade-v3' },
            { label: 'Parscade v3.1 Beta', value: 'parscade-v3-beta' },
          ],
          impact: 'critical',
          requiresRestart: true,
          category: 'model',
        },
        {
          id: 'model_temperature',
          name: 'Model Temperature',
          description: 'Controls randomness in AI model predictions',
          type: 'slider',
          value: 0.3,
          defaultValue: 0.5,
          min: 0,
          max: 1,
          step: 0.1,
          impact: 'medium',
          requiresRestart: false,
          category: 'inference',
        },
        {
          id: 'auto_model_updates',
          name: 'Auto Model Updates',
          description: 'Automatically update to latest model versions',
          type: 'toggle',
          value: false,
          defaultValue: true,
          impact: 'medium',
          requiresRestart: false,
          category: 'management',
        },
      ],
    },
    {
      id: 'performance',
      name: 'Performance',
      description: 'System performance and resource optimization',
      icon: Gauge,
      status: 'warning',
      settings: [
        {
          id: 'memory_limit',
          name: 'Memory Limit',
          description: 'Maximum memory allocation per processing job',
          type: 'slider',
          value: 2048,
          defaultValue: 1024,
          min: 512,
          max: 8192,
          step: 256,
          unit: 'MB',
          impact: 'high',
          requiresRestart: true,
          category: 'resources',
        },
        {
          id: 'cache_enabled',
          name: 'Result Caching',
          description: 'Cache processing results for faster repeated operations',
          type: 'toggle',
          value: true,
          defaultValue: true,
          impact: 'medium',
          requiresRestart: false,
          category: 'optimization',
        },
        {
          id: 'cache_duration',
          name: 'Cache Duration',
          description: 'How long to keep cached results',
          type: 'slider',
          value: 24,
          defaultValue: 12,
          min: 1,
          max: 168,
          step: 1,
          unit: 'hours',
          impact: 'low',
          requiresRestart: false,
          category: 'optimization',
        },
      ],
    },
    {
      id: 'security',
      name: 'Security',
      description: 'Data security and encryption settings',
      icon: Shield,
      status: 'active',
      settings: [
        {
          id: 'encryption_at_rest',
          name: 'Encryption at Rest',
          description: 'Encrypt stored documents and data',
          type: 'toggle',
          value: true,
          defaultValue: true,
          impact: 'critical',
          requiresRestart: true,
          category: 'encryption',
        },
        {
          id: 'encryption_algorithm',
          name: 'Encryption Algorithm',
          description: 'Encryption method for data protection',
          type: 'select',
          value: 'AES-256',
          defaultValue: 'AES-256',
          options: [
            { label: 'AES-128', value: 'AES-128' },
            { label: 'AES-256', value: 'AES-256' },
            { label: 'ChaCha20', value: 'ChaCha20' },
          ],
          impact: 'critical',
          requiresRestart: true,
          category: 'encryption',
        },
        {
          id: 'data_retention',
          name: 'Data Retention Period',
          description: 'How long to keep processed documents',
          type: 'slider',
          value: 90,
          defaultValue: 30,
          min: 7,
          max: 365,
          step: 1,
          unit: 'days',
          impact: 'medium',
          requiresRestart: false,
          category: 'compliance',
        },
      ],
    },
  ];

  const performanceMetrics: PerformanceMetric[] = [
    { name: 'CPU Usage', current: 67, optimal: 70, unit: '%', status: 'good', trend: 'stable' },
    { name: 'Memory Usage', current: 78, optimal: 80, unit: '%', status: 'good', trend: 'up' },
    { name: 'Disk I/O', current: 45, optimal: 60, unit: 'MB/s', status: 'good', trend: 'down' },
    { name: 'Queue Length', current: 234, optimal: 200, unit: 'jobs', status: 'warning', trend: 'up' },
    { name: 'Response Time', current: 2.3, optimal: 2.0, unit: 'sec', status: 'warning', trend: 'up' },
    { name: 'Error Rate', current: 2.1, optimal: 1.0, unit: '%', status: 'warning', trend: 'stable' },
  ];

  const currentSection = configSections.find(section => section.id === selectedSection) || configSections[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'warning':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'inactive':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
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

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-amber-600 bg-amber-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderSettingInput = (setting: ConfigSetting) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <button
            onClick={() => setHasUnsavedChanges(true)}
            className={`flex items-center space-x-2 ${setting.value ? 'text-green-600' : 'text-gray-400'}`}
          >
            {setting.value ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
            <span className="text-sm font-medium">{setting.value ? 'Enabled' : 'Disabled'}</span>
          </button>
        );

      case 'slider':
        return (
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">{setting.min}{setting.unit}</span>
              <span className="text-sm font-semibold text-slate-900">
                {setting.value}{setting.unit}
              </span>
              <span className="text-sm text-slate-600">{setting.max}{setting.unit}</span>
            </div>
            <input
              type="range"
              min={setting.min}
              max={setting.max}
              step={setting.step}
              value={setting.value}
              onChange={() => setHasUnsavedChanges(true)}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        );

      case 'select':
        return (
          <select
            value={setting.value}
            onChange={() => setHasUnsavedChanges(true)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'input':
        return (
          <input
            type="text"
            value={setting.value}
            onChange={() => setHasUnsavedChanges(true)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter ${setting.name.toLowerCase()}`}
          />
        );

      default:
        return <span className="text-slate-500">Unsupported setting type</span>;
    }
  };

  return (
    <DashboardLayout
      title="Engine Configuration"
      subtitle="Advanced processing engine configuration and optimization settings"
      variant="processing"
      backgroundPattern="subtle"
      headerVariant="extended"
      showBreadcrumbs={true}
      actions={
        <div className="flex items-center space-x-3">
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">Unsaved changes</span>
            </div>
          )}

          <button
            onClick={() => setIsTestMode(!isTestMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              isTestMode
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <TestTube className="w-4 h-4" />
            <span>{isTestMode ? 'Exit Test Mode' : 'Test Mode'}</span>
          </button>

          <button className="flex items-center space-x-2 bg-white border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Config</span>
          </button>

          <button
            disabled={!hasUnsavedChanges}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              hasUnsavedChanges
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      }
    >
      {/* Performance Overview */}
      <div className="col-span-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardSection
            title="System Performance Overview"
            subtitle="Current engine performance metrics and optimization status"
            className="bg-gradient-to-br from-white to-slate-50/30 border-slate-200/60"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {performanceMetrics.map((metric, index) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-4 border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-slate-700">{metric.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMetricStatusColor(metric.status)}`}>
                      {metric.status}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xl font-bold text-slate-900">
                        {metric.current}{metric.unit}
                      </span>
                      <p className="text-xs text-slate-500">
                        Optimal: {metric.optimal}{metric.unit}
                      </p>
                    </div>
                    <div className={`text-sm ${
                      metric.trend === 'up' ? 'text-red-600' :
                      metric.trend === 'down' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {metric.trend === 'up' && '↗'}
                      {metric.trend === 'down' && '↘'}
                      {metric.trend === 'stable' && '→'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </DashboardSection>
        </motion.div>
      </div>

      <div className="col-span-12 grid grid-cols-12 gap-8">
        {/* Configuration Categories */}
        <div className="col-span-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <DashboardSection
              title="Configuration Categories"
              subtitle="Select a category to configure"
              className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/60"
            >
              <div className="p-4">
                <div className="space-y-2">
                  {configSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(section.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        selectedSection === section.id
                          ? 'bg-blue-600 text-white shadow-card'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300'
                      }`}
                    >
                      <section.icon className="w-5 h-5 flex-shrink-0" />
                      <div className="text-left flex-1">
                        <div className="font-medium">{section.name}</div>
                        <div className={`text-xs ${
                          selectedSection === section.id ? 'text-blue-100' : 'text-slate-500'
                        }`}>
                          {section.settings.length} settings
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        selectedSection === section.id
                          ? 'text-blue-100 bg-blue-500 border-blue-400'
                          : getStatusColor(section.status)
                      }`}>
                        {section.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </DashboardSection>
          </motion.div>
        </div>

        {/* Configuration Settings */}
        <div className="col-span-9">
          <motion.div
            key={selectedSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardSection
              title={currentSection.name}
              subtitle={currentSection.description}
              className="bg-gradient-to-br from-white to-purple-50/30 border-purple-200/60"
            >
              <div className="p-6">
                <div className="space-y-6">
                  {currentSection.settings.map((setting, index) => (
                    <motion.div
                      key={setting.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white border border-slate-200 rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">{setting.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(setting.impact)}`}>
                              {setting.impact} impact
                            </span>
                            {setting.requiresRestart && (
                              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium border border-red-200">
                                Requires restart
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 mb-4">{setting.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Current Value
                          </label>
                          {renderSettingInput(setting)}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Default Value
                          </label>
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-900 font-medium">{setting.defaultValue}</span>
                            <button className="text-blue-600 hover:text-blue-700 text-sm">
                              Reset to default
                            </button>
                          </div>
                        </div>
                      </div>

                      {setting.validation && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-800">
                              {setting.validation.message || 'Validation rules apply to this setting'}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </DashboardSection>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EngineConfigurationPage;