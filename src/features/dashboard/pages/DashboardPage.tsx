/**
 * Dashboard Overview Page - Professional Foundation
 * Scalable dashboard with modular architecture and refined blue theme
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Target, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth';
import { ParscadeButton, ParscadeCard } from '@/shared/components/brand';
import FeatureGate from '@/shared/components/layout/FeatureGate';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';
import DashboardGrid from '../components/ui/DashboardGrid';
import QuickActions from '../components/ui/QuickActions';
import OverviewStats from '../components/overview/OverviewStats';
import RecentActivity from '../components/overview/RecentActivity';
import FileUploadZone from '../components/FileUploadZone';
import JobsList from '../components/JobsList';

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

  const handleNewProject = () => {
    navigate('/dashboard/projects/new');
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export functionality coming soon');
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
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Confirm Your Email Address
            </h1>

            <p className="text-slate-600 mb-6 leading-relaxed">
              We've sent a confirmation email to <strong>{user?.email}</strong>. Please check your inbox and click the confirmation link to access your dashboard.
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
      title="Dashboard"
      subtitle="Monitor your document processing and analytics"
      actions={
        <QuickActions
          onUpload={handleUploadClick}
          onNewProject={handleNewProject}
          onExport={handleExport}
        />
      }
    >
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 text-white shadow-parscade-lg relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">
              Welcome to Parscade
            </h2>
            <p className="text-blue-100">
              Transform documents into structured data with intelligent processing
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="hidden sm:block"
          >
            <Crown className="w-10 h-10 text-blue-200" />
          </motion.div>
        </div>
      </motion.div>

      {/* Statistics Overview */}
      <DashboardSection
        title="Overview"
        description="Your processing metrics and insights"
      >
        <OverviewStats />
      </DashboardSection>

      {/* Main Content Grid */}
      <DashboardSection>
        <DashboardGrid columns={2} gap="lg">
          {/* Upload Zone - Takes 2 columns */}
          <div className="col-span-1">
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <Target className="w-5 h-5 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Document Processing</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Upload documents to transform them into structured data
              </p>
            </motion.div>
            <FileUploadZone onJobSubmitted={handleJobSubmitted} />
          </div>

          {/* Jobs List - Takes 1 column */}
          <div className="col-span-1">
            <JobsList />
          </div>
        </DashboardGrid>
      </DashboardSection>

      {/* Recent Activity */}
      <DashboardSection>
        <DashboardGrid columns={2} gap="lg">
          <RecentActivity />
          
          {/* Analytics Preview - Feature Gated */}
          <FeatureGate featureId="analytics">
            <ParscadeCard
              variant="gradient"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="p-6 text-center group cursor-pointer"
            >
              <motion.div 
                className="text-blue-500 mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <TrendingUp className="w-10 h-10 mx-auto" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-200">
                Advanced Analytics
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Detailed processing insights and performance analytics.
              </p>
              <motion.div
                className="mt-4 inline-flex items-center text-blue-600 text-sm font-medium"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                View Analytics
                <motion.span
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-1"
                >
                  →
                </motion.span>
              </motion.div>
            </ParscadeCard>
          </FeatureGate>
        </DashboardGrid>
      </DashboardSection>
    </DashboardLayout>
  );
};

export default DashboardPage;