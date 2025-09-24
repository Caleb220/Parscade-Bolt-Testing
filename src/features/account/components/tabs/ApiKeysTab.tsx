/**
 * API Keys Tab - Manage API Keys and Developer Access
 * Pro-tier API key management for developers
 */

import { motion } from 'framer-motion';
import { Key, Plus, Copy, Eye, EyeOff, Trash2, AlertCircle, ExternalLink, Crown } from 'lucide-react';
import React, { useState } from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import CustomButton from '@/shared/components/forms/CustomButton';
import FeatureGate from '@/shared/components/layout/FeatureGate';

/**
 * API Keys management tab for Pro users
 */
const ApiKeysTab: React.FC = () => {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);

  const apiKeys = [
    {
      id: '1',
      name: 'Production API Key',
      key: 'pk_live_1234567890abcdef1234567890abcdef',
      created: '2024-01-15',
      lastUsed: '2 hours ago',
      permissions: ['read', 'write'],
      status: 'active' as const,
    },
    {
      id: '2',
      name: 'Development Key',
      key: 'pk_test_abcdef1234567890abcdef1234567890',
      created: '2024-02-20',
      lastUsed: '1 week ago',
      permissions: ['read'],
      status: 'active' as const,
    },
    {
      id: '3',
      name: 'Webhook Integration',
      key: 'pk_live_9876543210fedcba9876543210fedcba',
      created: '2024-03-01',
      lastUsed: 'Never',
      permissions: ['webhook'],
      status: 'inactive' as const,
    },
  ];

  const usageStats = [
    { label: 'Total Requests', value: '12,847', change: '+5.2%' },
    { label: 'This Month', value: '2,341', change: '+12.1%' },
    { label: 'Rate Limit', value: '1000/hour', change: null },
    { label: 'Active Keys', value: apiKeys.filter(k => k.status === 'active').length.toString(), change: null },
  ];

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you'd show a toast notification here
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 12) + '•'.repeat(key.length - 20) + key.substring(key.length - 8);
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'read':
        return 'bg-blue-100 text-blue-800';
      case 'write':
        return 'bg-green-100 text-green-800';
      case 'webhook':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <FeatureGate
      requiredTier="pro"
      fallback={
        <div className="text-center py-12">
          <ParscadeCard className="p-12 max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="flex items-center justify-center mb-6">
              <Crown className="w-8 h-8 text-amber-500 mr-3" />
              <Key className="w-16 h-16 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              API Access - Pro Feature
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Integrate Parscade with your applications using our powerful REST API.
              Generate API keys, manage permissions, and build custom workflows.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">REST API</h3>
                <p className="text-sm text-gray-600">Full programmatic access to all features</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Webhooks</h3>
                <p className="text-sm text-gray-600">Real-time notifications for events</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">SDKs</h3>
                <p className="text-sm text-gray-600">Libraries for popular languages</p>
              </div>
            </div>

            <CustomButton variant="primary" size="lg">
              Upgrade to Pro
            </CustomButton>
          </ParscadeCard>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">API Keys</h2>
            <p className="text-gray-600">
              Manage your API keys and integrate Parscade with your applications
            </p>
          </div>
          <div className="flex space-x-3">
            <CustomButton
              variant="outline"
              leftIcon={<ExternalLink className="w-4 h-4" />}
            >
              View Docs
            </CustomButton>
            <CustomButton
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setShowCreateModal(true)}
            >
              Create API Key
            </CustomButton>
          </div>
        </div>

        {/* Usage Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {usageStats.map((stat, index) => (
            <ParscadeCard key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                {stat.change && (
                  <span className="text-sm font-medium text-green-600">
                    {stat.change}
                  </span>
                )}
              </div>
            </ParscadeCard>
          ))}
        </motion.div>

        {/* API Keys List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your API Keys</h3>

          {apiKeys.map((apiKey, index) => (
            <ParscadeCard key={apiKey.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Key className="w-5 h-5 text-gray-600" />
                    <h4 className="text-lg font-semibold text-gray-900">{apiKey.name}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      apiKey.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {apiKey.status}
                    </span>
                  </div>

                  {/* API Key Display */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono text-gray-900">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          {visibleKeys.has(apiKey.id) ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm font-medium text-gray-600">Permissions:</span>
                    {apiKey.permissions.map((permission) => (
                      <span
                        key={permission}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPermissionColor(permission)}`}
                      >
                        {permission}
                      </span>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>Created: {new Date(apiKey.created).toLocaleDateString()}</span>
                    <span>Last used: {apiKey.lastUsed}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <CustomButton
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                  >
                    Revoke
                  </CustomButton>
                </div>
              </div>
            </ParscadeCard>
          ))}
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ParscadeCard className="p-6 bg-yellow-50 border-yellow-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">Security Best Practices</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Keep your API keys secure and never share them publicly</li>
                  <li>• Use environment variables to store keys in your applications</li>
                  <li>• Regularly rotate your API keys for enhanced security</li>
                  <li>• Monitor usage patterns and revoke unused keys</li>
                </ul>
              </div>
            </div>
          </ParscadeCard>
        </motion.div>

        {/* API Documentation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ParscadeCard className="p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="max-w-md mx-auto">
              <Key className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Ready to Build?
              </h3>
              <p className="text-gray-600 mb-6">
                Check out our comprehensive API documentation and start integrating Parscade into your workflow
              </p>
              <div className="flex space-x-3 justify-center">
                <CustomButton
                  variant="primary"
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                >
                  API Documentation
                </CustomButton>
                <CustomButton variant="outline">
                  View Examples
                </CustomButton>
              </div>
            </div>
          </ParscadeCard>
        </motion.div>
      </div>
    </FeatureGate>
  );
};

export default ApiKeysTab;