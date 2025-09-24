/**
 * Workflows Dashboard Page - Automation and Process Management
 * Enterprise workflow builder and automation management
 */

import { motion } from 'framer-motion';
import { GitBranch, Plus, Play, Pause, Settings, Zap, ArrowRight, Crown } from 'lucide-react';
import React, { useState } from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import CustomButton from '@/shared/components/forms/CustomButton';
import FeatureGate from '@/shared/components/layout/FeatureGate';

import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';

/**
 * Workflows page for enterprise automation
 */
const WorkflowsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'templates'>('all');

  const mockWorkflows = [
    {
      id: '1',
      name: 'Document Processing Pipeline',
      description: 'Automated PDF extraction and data processing',
      status: 'active' as const,
      trigger: 'File Upload',
      lastRun: '2 hours ago',
      successRate: '98.5%',
    },
    {
      id: '2',
      name: 'Data Validation Workflow',
      description: 'Validate extracted data against business rules',
      status: 'paused' as const,
      trigger: 'Schedule',
      lastRun: '1 day ago',
      successRate: '94.2%',
    },
    {
      id: '3',
      name: 'Export and Notification',
      description: 'Export processed data and send notifications',
      status: 'active' as const,
      trigger: 'Completion',
      lastRun: '30 minutes ago',
      successRate: '99.1%',
    },
  ];

  const templates = [
    {
      name: 'Invoice Processing',
      description: 'Extract data from invoices and validate',
      icon: '📄',
    },
    {
      name: 'Contract Analysis',
      description: 'Analyze contracts for key terms and dates',
      icon: '📋',
    },
    {
      name: 'Report Generation',
      description: 'Generate automated reports from data',
      icon: '📊',
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflows</h1>
            <p className="text-gray-600">
              Automate your document processing with custom workflows
            </p>
          </div>

          <FeatureGate requiredTier="enterprise">
            <CustomButton
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Workflow
            </CustomButton>
          </FeatureGate>
        </motion.div>

        {/* Enterprise Gate */}
        <FeatureGate
          requiredTier="enterprise"
          fallback={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ParscadeCard className="p-12 text-center bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center justify-center mb-6">
                    <Crown className="w-8 h-8 text-amber-500 mr-3" />
                    <GitBranch className="w-16 h-16 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Enterprise Workflows
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg">
                    Build powerful automation workflows to streamline your document processing.
                    Create custom pipelines, set triggers, and automate complex business processes.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {templates.map((template, index) => (
                      <div key={template.name} className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="text-3xl mb-3">{template.icon}</div>
                        <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    ))}
                  </div>

                  <CustomButton variant="primary" size="lg">
                    Upgrade to Enterprise
                  </CustomButton>
                </div>
              </ParscadeCard>
            </motion.div>
          }
        >
          {/* Workflow Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border-b border-gray-200"
          >
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Workflows' },
                { key: 'active', label: 'Active' },
                { key: 'templates', label: 'Templates' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Workflows List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {mockWorkflows.map((workflow, index) => (
              <ParscadeCard key={workflow.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {workflow.name}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        workflow.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {workflow.status === 'active' ? (
                          <>
                            <Play className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <Pause className="w-3 h-3 mr-1" />
                            Paused
                          </>
                        )}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{workflow.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>Trigger: {workflow.trigger}</span>
                      <span>Last run: {workflow.lastRun}</span>
                      <span>Success rate: {workflow.successRate}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CustomButton
                      variant="ghost"
                      size="sm"
                      leftIcon={<Settings className="w-4 h-4" />}
                    >
                      Configure
                    </CustomButton>
                    <CustomButton
                      variant="outline"
                      size="sm"
                      leftIcon={<Zap className="w-4 h-4" />}
                    >
                      Run Now
                    </CustomButton>
                  </div>
                </div>
              </ParscadeCard>
            ))}
          </motion.div>

          {/* Workflow Builder Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <DashboardSection
              title="Workflow Builder"
              description="Visual workflow creation tool"
            >
              <div className="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Drag-and-drop workflow builder</p>
                  <p className="text-sm text-gray-400">
                    Create complex workflows with conditional logic
                  </p>
                </div>
              </div>
            </DashboardSection>
          </motion.div>
        </FeatureGate>
      </div>
    </DashboardLayout>
  );
};

export default WorkflowsPage;