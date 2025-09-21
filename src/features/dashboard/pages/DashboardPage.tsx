/**
 * Dashboard Overview Page
 * Main dashboard page with modular layout and components
 */

import React from 'react';
import { Sparkles, BarChart3, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth';
import { Button } from '@/shared/components/ui/button';
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
            className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-8 shadow-premium border border-gray-200/60 text-center"
          >
            <motion.div 
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-lg"
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

            <p className="text-gray-600 mb-6 font-medium leading-relaxed">
              We've sent a confirmation email to <strong>{user?.email}</strong>. Please check your inbox and click the confirmation link to access your dashboard.
            </p>

            <div className="mt-8 border-t border-gray-200/60 pt-6">
              <p className="text-sm text-gray-500 font-medium">
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
        className="mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-premium-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-2">
              Welcome to Parscade Beta
            </h2>
            <p className="text-blue-100 font-medium">
              Transform your documents into structured data with AI-powered parsing
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="hidden sm:block"
          >
            <Sparkles className="w-12 h-12 text-yellow-300" />
          </motion.div>
        </div>
      </motion.div>

      {/* Statistics Overview */}
      <DashboardSection
        title="Overview"
        description="Your account statistics and beta program status"
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
                  <Zap className="w-6 h-6 text-blue-600 mr-3" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Upload & Process</h3>
              </motion.div>
              <p className="text-gray-600 text-sm font-medium leading-relaxed">
                Upload documents to extract structured data using our AI-powered parsing engine
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl border-2 border-dashed border-indigo-200/60 p-8 text-center shadow-premium hover:shadow-premium-lg transition-all duration-300 group cursor-pointer"
          >
            <motion.div 
              className="text-indigo-400 mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <TrendingUp className="w-12 h-12 mx-auto" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-indigo-700 transition-colors duration-200">
              Analytics Dashboard
            </h3>
            <p className="text-gray-600 text-sm font-medium leading-relaxed">
              Advanced analytics and insights coming soon in the next beta release.
            </p>
            <motion.div
              className="mt-4 inline-flex items-center text-indigo-600 text-sm font-bold"
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
            </div>
          </motion.div>
        </DashboardGrid>
      </DashboardSection>
    </DashboardLayout>
  );
};

export default DashboardPage;