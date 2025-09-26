/**
 * Integrations Dashboard Page - Third-party Connections and APIs
 * Manage external integrations and API connections
 */

import { motion } from 'framer-motion';
import { Puzzle, Plus, Settings, Check, ExternalLink, Zap, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import CustomButton from '@/shared/components/forms/CustomButton';
import FeatureGate from '@/shared/components/layout/FeatureGate';

import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';

/**
 * Integrations page for managing third-party connections
 */
const IntegrationsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'connected' | 'available'>('all');

  const integrations = [
    {
      id: 'slack',
      name: 'Slack',
      description: 'Send notifications and updates to Slack channels',
      category: 'Communication',
      status: 'connected' as const,
      icon: '💬',
      tier: 'pro' as const,
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Sync processed data with Salesforce CRM',
      category: 'CRM',
      status: 'available' as const,
      icon: '☁️',
      tier: 'pro' as const,
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Import and export documents from Dropbox',
      category: 'Storage',
      status: 'connected' as const,
      icon: '📁',
      tier: 'free' as const,
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect with 5000+ apps through Zapier',
      category: 'Automation',
      status: 'available' as const,
      icon: '⚡',
      tier: 'pro' as const,
    },
    {
      id: 'webhook',
      name: 'Custom Webhooks',
      description: 'Send data to custom endpoints',
      category: 'Developer',
      status: 'connected' as const,
      icon: '🔗',
      tier: 'pro' as const,
    },
    {
      id: 'microsoft',
      name: 'Microsoft 365',
      description: 'Connect with Office 365 and SharePoint',
      category: 'Productivity',
      status: 'available' as const,
      icon: '🏢',
      tier: 'enterprise' as const,
    },
  ];

  const filteredIntegrations = integrations.filter(integration => {
    if (filter === 'connected') return integration.status === 'connected';
    if (filter === 'available') return integration.status === 'available';
    return true;
  });

  const categories = Array.from(new Set(integrations.map(i => i.category)));

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Integrations</h1>
            <p className="text-gray-600">Connect Parscade with your favorite tools and services</p>
          </div>

          <FeatureGate requiredTier="pro">
            <CustomButton variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Add Custom Integration
            </CustomButton>
          </FeatureGate>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <ParscadeCard className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-4">
                <Puzzle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integrations.filter(i => i.status === 'available').length}
                </p>
              </div>
            </div>
          </ParscadeCard>

          <ParscadeCard className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg mr-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Connected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integrations.filter(i => i.status === 'connected').length}
                </p>
              </div>
            </div>
          </ParscadeCard>

          <ParscadeCard className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg mr-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </ParscadeCard>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border-b border-gray-200"
        >
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'all', label: 'All Integrations' },
              { key: 'connected', label: 'Connected' },
              { key: 'available', label: 'Available' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Integrations Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredIntegrations.map((integration, index) => (
            <FeatureGate
              key={integration.id}
              requiredTier={integration.tier}
              fallback={
                <ParscadeCard className="p-6 opacity-75">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{integration.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {integration.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-amber-500">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">
                        {integration.tier === 'pro' ? 'Pro' : 'Enterprise'}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{integration.description}</p>
                  <CustomButton variant="outline" size="sm" fullWidth disabled>
                    Upgrade Required
                  </CustomButton>
                </ParscadeCard>
              }
            >
              <ParscadeCard className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{integration.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {integration.category}
                      </span>
                    </div>
                  </div>
                  {integration.status === 'connected' && (
                    <div className="flex items-center text-green-600">
                      <Check className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">Connected</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4">{integration.description}</p>

                <div className="flex space-x-2">
                  {integration.status === 'connected' ? (
                    <>
                      <CustomButton
                        variant="outline"
                        size="sm"
                        leftIcon={<Settings className="w-4 h-4" />}
                        className="flex-1"
                      >
                        Configure
                      </CustomButton>
                      <CustomButton
                        variant="ghost"
                        size="sm"
                        leftIcon={<ExternalLink className="w-4 h-4" />}
                      >
                        Open
                      </CustomButton>
                    </>
                  ) : (
                    <CustomButton variant="primary" size="sm" fullWidth>
                      Connect
                    </CustomButton>
                  )}
                </div>
              </ParscadeCard>
            </FeatureGate>
          ))}
        </motion.div>

        {/* API Documentation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <DashboardSection
            title="Custom Integrations"
            description="Build your own integrations using our API"
          >
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Parscade API</h4>
                  <p className="text-gray-600 text-sm">
                    Use our REST API to build custom integrations and automate your workflows
                  </p>
                </div>
                <CustomButton variant="outline" leftIcon={<ExternalLink className="w-4 h-4" />}>
                  View Documentation
                </CustomButton>
              </div>
            </div>
          </DashboardSection>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default IntegrationsPage;
