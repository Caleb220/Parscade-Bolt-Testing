/**
 * Dashboard Billing Page - Admin Billing Management
 * Admin-only billing controls and subscription management
 */

import { motion } from 'framer-motion';
import { CreditCard, Download, Calendar, DollarSign, TrendingUp, AlertCircle, Crown } from 'lucide-react';
import React, { useState } from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import CustomButton from '@/shared/components/forms/CustomButton';
import FeatureGate from '@/shared/components/layout/FeatureGate';

import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';

/**
 * Dashboard billing page for admin users
 */
const DashboardBillingPage: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const currentPlan = {
    name: 'Pro',
    price: '$49',
    period: 'month',
    users: 5,
    storage: '100GB',
    nextBilling: '2025-10-23',
    status: 'active' as const,
  };

  const billingHistory = [
    {
      id: '1',
      date: '2025-09-23',
      description: 'Pro Plan - Monthly',
      amount: '$49.00',
      status: 'paid' as const,
      invoice: 'INV-2025-09-001',
    },
    {
      id: '2',
      date: '2025-08-23',
      description: 'Pro Plan - Monthly',
      amount: '$49.00',
      status: 'paid' as const,
      invoice: 'INV-2025-08-001',
    },
    {
      id: '3',
      date: '2025-07-23',
      description: 'Pro Plan - Monthly',
      amount: '$49.00',
      status: 'paid' as const,
      invoice: 'INV-2025-07-001',
    },
  ];

  const usageStats = [
    {
      label: 'Documents Processed',
      current: 245,
      limit: 1000,
      unit: 'docs',
    },
    {
      label: 'Storage Used',
      current: 23.5,
      limit: 100,
      unit: 'GB',
    },
    {
      label: 'API Calls',
      current: 5420,
      limit: 10000,
      unit: 'calls',
    },
    {
      label: 'Team Members',
      current: 3,
      limit: 5,
      unit: 'users',
    },
  ];

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <DashboardLayout>
      <FeatureGate
        requiredRole="admin"
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <ParscadeCard className="p-12 text-center max-w-md">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Admin Access Required
              </h2>
              <p className="text-gray-600">
                You need administrator privileges to access billing management.
              </p>
            </ParscadeCard>
          </div>
        }
      >
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing Management</h1>
              <p className="text-gray-600">
                Manage your subscription, usage, and billing information
              </p>
            </div>

            <CustomButton
              variant="primary"
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download Invoice
            </CustomButton>
          </motion.div>

          {/* Current Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ParscadeCard className="p-8 bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <Crown className="w-8 h-8 text-blue-600" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{currentPlan.name} Plan</h2>
                      <div className="flex items-center text-gray-600">
                        <span className="text-3xl font-bold text-blue-600 mr-2">{currentPlan.price}</span>
                        <span>per {currentPlan.period}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Team Members</p>
                      <p className="font-semibold">{currentPlan.users} users</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Storage</p>
                      <p className="font-semibold">{currentPlan.storage}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Next Billing</p>
                      <p className="font-semibold">{new Date(currentPlan.nextBilling).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <CustomButton variant="outline">
                    Change Plan
                  </CustomButton>
                  <CustomButton variant="ghost" className="text-red-600">
                    Cancel Subscription
                  </CustomButton>
                </div>
              </div>
            </ParscadeCard>
          </motion.div>

          {/* Usage Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <DashboardSection
              title="Usage This Month"
              description="Monitor your current usage against plan limits"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {usageStats.map((stat, index) => {
                  const percentage = getUsagePercentage(stat.current, stat.limit);
                  return (
                    <ParscadeCard key={stat.label} className="p-6">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
                          {percentage >= 90 && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-bold text-gray-900">{stat.current}</span>
                          <span className="text-sm text-gray-500">/ {stat.limit} {stat.unit}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(percentage)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </ParscadeCard>
                  );
                })}
              </div>
            </DashboardSection>
          </motion.div>

          {/* Billing History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <DashboardSection
              title="Billing History"
              description="View and download your previous invoices"
            >
              <div className="space-y-4">
                {billingHistory.map((item, index) => (
                  <ParscadeCard key={item.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.description}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                            <span>Invoice: {item.invoice}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{item.amount}</p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Paid
                          </span>
                        </div>
                        <CustomButton
                          variant="ghost"
                          size="sm"
                          leftIcon={<Download className="w-4 h-4" />}
                        >
                          Download
                        </CustomButton>
                      </div>
                    </div>
                  </ParscadeCard>
                ))}
              </div>
            </DashboardSection>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <DashboardSection
              title="Payment Method"
              description="Manage your billing information"
            >
              <ParscadeCard className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <CreditCard className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">•••• •••• •••• 4242</h3>
                      <p className="text-gray-600 text-sm">Expires 12/26</p>
                    </div>
                  </div>
                  <CustomButton variant="outline">
                    Update Payment Method
                  </CustomButton>
                </div>
              </ParscadeCard>
            </DashboardSection>
          </motion.div>
        </div>
      </FeatureGate>
    </DashboardLayout>
  );
};

export default DashboardBillingPage;