/**
 * Dashboard Overview Page
 * Main dashboard page with modular layout and components
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BarChart3, TrendingUp, Zap, Crown, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth';
import { ParscadeButton, ParscadeCard, ParscadeLogo } from '@/shared/components/brand';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';
import DashboardGrid from '../components/ui/DashboardGrid';
import QuickActions from '../components/ui/QuickActions';
import OverviewStats from '../components/overview/OverviewStats';
import RecentActivity from '../components/overview/RecentActivity';
import FileUploadZone from '../components/FileUploadZone';
import JobsList from '../components/JobsList';

/**
 * Main dashboard overview page with modular components
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
            className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl p-8 shadow-parscade border border-purple-200/60 text-center"
          >
            <motion.div 
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-cyan-100 shadow-parscade"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </motion.div>

            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
              Confirm Your Email Address
            </h1>

            <p className="text-purple-600 mb-6 font-bold leading-relaxed">
              We've sent a confirmation email to <strong>{user?.email}</strong>. Please check your inbox and click the confirmation link to access your dashboard.
            </p>

            <div className="mt-8 border-t border-purple-200/30 pt-6">
              <p className="text-sm text-purple-500 font-bold">
                Need help?{' '}
                <a href="mailto:admin@parscade.com" className="text-purple-600 hover:text-purple-700">
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
      title="Dashboard Overview"
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
        className="mb-8 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 rounded-2xl p-6 text-white shadow-parscade-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-cyan-500/90" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-2">
              Welcome to Parscade
            </h2>
            <p className="text-blue-100 font-medium">
              Transform documents into structured data with intelligent processing
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="hidden sm:block"
          >
            <Crown className="w-12 h-12 text-yellow-300" />
          </motion.div>
        </div>
      </motion.div>

      {/* Statistics Overview */}
      <DashboardSection
        title="Intelligence Dashboard"
        description="Your transformation metrics and processing insights"
      >
        <OverviewStats />
      </DashboardSection>

      {/* Main Content Grid */}
      <DashboardSection>
        <DashboardGrid columns={3} gap="lg">
          {/* Upload Zone - Takes 2 columns */}
          <div className="col-span-1 lg:col-span-2">
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Target className="w-6 h-6 text-purple-600 mr-3" />
                </motion.div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Document Transformation</h3>
              </div>
              <p className="text-purple-600 text-sm font-bold leading-relaxed">
                Upload documents to transform them into structured data using intelligent processing
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
          
          {/* Placeholder for future widgets */}
          <ParscadeCard
            variant="glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="border-2 border-dashed border-purple-200/60 p-8 text-center group cursor-pointer"
          >
            <motion.div 
              className="text-purple-400 mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <BarChart3 className="w-12 h-12 mx-auto" />
            </motion.div>
            <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight group-hover:text-purple-700 transition-colors duration-200">
              Intelligence Analytics
            </h3>
            <p className="text-purple-600 text-sm font-bold leading-relaxed">
              Advanced processing insights and transformation analytics coming soon.
            </p>
            <motion.div
              className="mt-4 inline-flex items-center text-purple-600 text-sm font-black"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              Coming Soon
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-1"
              >
                →
              </motion.span>
            </motion.div>
          </ParscadeCard>
        </DashboardGrid>
      </DashboardSection>
    </DashboardLayout>
  );
};

export default DashboardPage;