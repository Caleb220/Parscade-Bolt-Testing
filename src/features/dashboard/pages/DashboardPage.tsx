/**
 * Dashboard Overview Page
 * Main dashboard page with modular layout and components
 */

import React from 'react';
import { Sparkles, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth';
import { Button } from '@/shared/components/ui/button';
import CustomButton from '@/shared/components/forms/CustomButton';
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Confirm Your Email Address
            </h1>

            <p className="text-gray-600 mb-6">
              We've sent a confirmation email to <strong>{user?.email}</strong>. Please check your inbox and click the confirmation link to access your dashboard.
            </p>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500">
                Need help?{' '}
                <a href="mailto:admin@parscade.com" className="text-blue-600 hover:text-blue-700">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
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
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Upload & Process</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Upload documents to extract structured data using our AI-powered parsing engine
              </p>
            </div>
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
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
            <div className="text-gray-400 mb-2">
              <BarChart3 className="w-8 h-8 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Widget</h3>
            <p className="text-gray-600 text-sm">
              Advanced analytics and insights coming soon in the next beta release.
            </p>
          </div>
        </DashboardGrid>
      </DashboardSection>
    </DashboardLayout>
  );
};

export default DashboardPage;