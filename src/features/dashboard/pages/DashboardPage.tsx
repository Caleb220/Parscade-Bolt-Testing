import React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth';
import CustomButton from '@/shared/components/forms/CustomButton';
import Layout from '@/shared/components/layout/templates/Layout';
import JobsList from '../components/JobsList';

import FileUploadZone from '../components/FileUploadZone';

const DashboardPage: React.FC = () => {
  const { isEmailConfirmed, user } = useAuth();
  const navigate = useNavigate();

  const handleJobSubmitted = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  if (!isEmailConfirmed) {
    return (
      <Layout>
        <section className="bg-gray-50 min-h-screen">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}
              </h1>
              <p className="text-gray-600 mt-1">Process documents with intelligent parsing</p>
            </div>
            
            <CustomButton 
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              New Project
            </CustomButton>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Zone */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                  Upload & Process
                </h2>
                <p className="text-gray-600 text-sm">
                  Upload documents to extract structured data using our AI-powered parsing engine
                </p>
              </div>
              <FileUploadZone onJobSubmitted={handleJobSubmitted} />
            </div>

            {/* Jobs List */}
            <div className="lg:col-span-1">
              <JobsList />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default DashboardPage;