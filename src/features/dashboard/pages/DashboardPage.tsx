/**
 * Dashboard Overview Page - Professional Foundation
 * Scalable dashboard with modular architecture and refined blue theme
 */

import { motion } from 'framer-motion';
import { Crown, Target, Brain, Shield, Globe, Code } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth';
import { StandardProtectedRoute, ProProtectedRoute } from '@/shared/components/layout/templates';
import FeatureDiscovery from '@/shared/components/ui/FeatureDiscovery';

import AnalyticsHeader from '../components/AdvancedAnalytics';
import ExportsManager from '../components/ExportsManager';
import FileUploadZone from '../components/FileUploadZone';
import JobsList from '../components/JobsList';
import DashboardLayout from '../components/layout/DashboardLayout';
import OverviewStats from '../components/overview/OverviewStats';
import RecentActivity from '../components/overview/RecentActivity';
import ProjectsOverview from '../components/ProjectsOverview';
import DashboardSection from '../components/ui/DashboardSection';
import EnterpriseGrid from '../components/ui/EnterpriseGrid';
import QuickActions from '../components/ui/QuickActions';
import ProcessingPipelineVisualization from '../components/visualization/ProcessingPipelineVisualization';

/**
 * Main dashboard overview page with scalable modular architecture
 */
const DashboardPage: React.FC = () => {
  const { isEmailConfirmed, user } = useAuth();
  const navigate = useNavigate();

  const handleJobSubmitted = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleUploadClick = () => {
    document.getElementById('file-upload')?.click();
  };

  // Email confirmation required state
  if (!isEmailConfirmed) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-8 shadow-parscade border border-blue-200/40 text-center"
          >
            <motion.div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-parscade"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z"
                />
              </svg>
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">Confirm Your Email Address</h1>

            <p className="text-slate-600 mb-6 leading-relaxed">
              We've sent a confirmation email to <strong>{user?.email}</strong>. Please check your
              inbox and click the confirmation link to access your dashboard.
            </p>

            <div className="mt-8 border-t border-blue-200/30 pt-6">
              <p className="text-sm text-slate-500">
                Need help?{' '}
                <a href="mailto:admin@parscade.com" className="text-blue-600 hover:text-blue-700">
                  Contact Support
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Command Center"
      subtitle="Enterprise data pipeline monitoring and control"
      variant="command-center"
      backgroundPattern="hero"
      headerVariant="extended"
      showBreadcrumbs={true}
      actions={<QuickActions onUpload={handleUploadClick} />}
    >
      {/* Enterprise Command Center Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="xl:col-span-12 lg:col-span-8 col-span-1 mb-6"
      >
        <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600 rounded-2xl p-6 lg:p-8 text-white shadow-parscade-xl overflow-hidden border border-primary-400/30">
          {/* Sophisticated Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 blur-xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 blur-xl" />

          {/* Floating Geometric Elements */}
          <div className="absolute top-4 right-4 w-24 h-24 border border-white/20 rounded-lg rotate-12 animate-pulse" />
          <div
            className="absolute bottom-6 right-16 w-16 h-16 border border-white/15 rounded-full animate-bounce"
            style={{ animationDelay: '1s' }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <motion.h1
                className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 lg:mb-4"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Enterprise Data Pipeline
              </motion.h1>
              <motion.p
                className="text-primary-100 text-base lg:text-lg mb-4 lg:mb-0 max-w-2xl"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Transform unstructured documents into actionable data with AI-powered processing at
                enterprise scale
              </motion.p>

              {/* Status Indicators */}
              <div className="flex items-center space-x-4 mt-4 lg:mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-primary-100">All Systems Operational</span>
                </div>
                <div className="hidden sm:flex items-center space-x-2">
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                    style={{ animationDelay: '0.5s' }}
                  />
                  <span className="text-sm text-primary-100">Real-time Processing</span>
                </div>
              </div>
            </div>

            {/* Interactive Crown Icon */}
            <motion.div
              className="flex-shrink-0 hidden lg:block"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1],
                y: [0, -4, 4, 0],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="relative">
                <Crown className="w-16 h-16 text-primary-200 drop-shadow-2xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-md" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Primary Statistics - Enterprise KPI Cards */}
      <div className="xl:col-span-12 lg:col-span-8 col-span-1 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <OverviewStats />
        </motion.div>
      </div>

      {/* Document Processing Control Center */}
      <div className="xl:col-span-8 lg:col-span-5 col-span-1">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="h-full"
        >
          <div className="bg-white/95 backdrop-blur-sm border border-neutral-200/60 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 h-full">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl mr-4 shadow-parscade-xs">
                <Target className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900">Processing Center</h3>
                <p className="text-neutral-600 text-sm">
                  Upload and process documents with AI intelligence
                </p>
              </div>
            </div>

            <FileUploadZone onJobSubmitted={handleJobSubmitted} />
          </div>
        </motion.div>
      </div>

      {/* Active Jobs Monitor */}
      <div className="xl:col-span-4 lg:col-span-3 col-span-1">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="h-full"
        >
          <JobsList />
        </motion.div>
      </div>

      {/* Recent Activity & Analytics Dashboard */}
      <div className="xl:col-span-6 lg:col-span-4 col-span-1">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="h-full"
        >
          <RecentActivity />
        </motion.div>
      </div>

      <div className="xl:col-span-6 lg:col-span-4 col-span-1">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="h-full"
        >
          <ProProtectedRoute>
            <AnalyticsHeader />
          </ProProtectedRoute>
        </motion.div>
      </div>

      {/* Project Management Hub */}
      <div className="xl:col-span-8 lg:col-span-5 col-span-1">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <ProjectsOverview />
        </motion.div>
      </div>

      {/* Enterprise Data Exports */}
      <div className="xl:col-span-4 lg:col-span-3 col-span-1">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="h-full"
        >
          <StandardProtectedRoute>
            <ExportsManager />
          </StandardProtectedRoute>
        </motion.div>
      </div>

      {/* Real-time Processing Pipeline Visualization */}
      <div className="xl:col-span-12 lg:col-span-8 col-span-1">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mb-6"
        >
          <DashboardSection
            title="Real-time Processing Pipeline"
            subtitle="Monitor document processing stages and job flow in real-time"
            className="bg-gradient-to-br from-white to-primary-25 border-primary-200/40"
          >
            <ProcessingPipelineVisualization
              variant="detailed"
              showMetrics={true}
              showJobs={true}
            />
          </DashboardSection>
        </motion.div>
      </div>

      {/* Enterprise Feature Discovery Center */}
      <div className="xl:col-span-12 lg:col-span-8 col-span-1">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mb-6"
        >
          <DashboardSection
            title="Enterprise Feature Center"
            subtitle="Discover and upgrade to unlock advanced capabilities"
            className="bg-gradient-to-br from-purple-25 to-primary-25 border-purple-200/40"
          >
            <FeatureDiscovery
              variant="showcase"
              showUpgradePrompt={true}
              onUpgrade={(tier) => navigate(`/dashboard/billing?upgrade=${tier}`)}
              onDemoRequest={(featureId) => navigate(`/demo/${featureId}`)}
              className="p-0"
            />
          </DashboardSection>
        </motion.div>
      </div>

      {/* Advanced Enterprise Grid Layout */}
      <div className="xl:col-span-12 lg:col-span-8 col-span-1">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mb-6"
        >
          <DashboardSection
            title="Enterprise Operations Center"
            subtitle="Comprehensive view of all enterprise capabilities and metrics"
            className="bg-gradient-to-br from-neutral-25 to-primary-25 border-neutral-200/40"
          >
            <EnterpriseGrid
              variant="enterprise"
              columns={4}
              gap="lg"
              stagger={true}
              className="p-6"
            >
              {/* AI Processing Status */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-primary-200/40">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mr-4">
                    <Brain className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">AI Engine</h3>
                    <p className="text-neutral-600 text-sm">Neural processing active</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Processing Speed</span>
                    <span className="font-semibold text-success-600">2.3x faster</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Accuracy Rate</span>
                    <span className="font-semibold text-primary-600">99.7%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full" style={{width: '97%'}}></div>
                  </div>
                </div>
              </div>

              {/* Security Status */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-success-200/40">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-xl flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-success-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">Security</h3>
                    <p className="text-neutral-600 text-sm">SOC2 compliant</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-success-700">All systems secure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <span className="text-sm text-success-700">Zero vulnerabilities</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span className="text-sm text-success-700">Encrypted at rest</span>
                  </div>
                </div>
              </div>

              {/* Global Scale */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-blue-200/40">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mr-4">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">Global Scale</h3>
                    <p className="text-neutral-600 text-sm">Edge deployment ready</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Regions</span>
                    <span className="font-semibold text-blue-600">12 active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Latency</span>
                    <span className="font-semibold text-blue-600">&lt;50ms avg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Uptime</span>
                    <span className="font-semibold text-success-600">99.99%</span>
                  </div>
                </div>
              </div>

              {/* API Platform */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-purple-200/40">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mr-4">
                    <Code className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">API Platform</h3>
                    <p className="text-neutral-600 text-sm">RESTful & GraphQL</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Endpoints</span>
                    <span className="font-semibold text-purple-600">47 active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Rate Limit</span>
                    <span className="font-semibold text-purple-600">10k/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Success Rate</span>
                    <span className="font-semibold text-success-600">99.8%</span>
                  </div>
                </div>
              </div>
            </EnterpriseGrid>
          </DashboardSection>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
