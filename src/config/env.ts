import React from 'react';
import { Plus } from 'lucide-react';
import Layout from '../../../components/templates/Layout';
import Button from '../../../components/atoms/Button';
import LoadingSpinner from '../../../components/atoms/LoadingSpinner';
import { useAuth } from '../../auth';

const DashboardPage: React.FC = () => {
  const { isEmailConfirmed, user } = useAuth();

  if (!isEmailConfirmed) {
    return (
      <Layout>
        <section className="bg-gray-50 min-h-screen" aria-labelledby="confirm-email-heading">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <h1 id="confirm-email-heading" className="text-2xl font-bold text-gray-900 mb-4">
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
        <header className="bg-white border-b border-gray-200" aria-labelledby="dashboard-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 id="dashboard-heading" className="text-2xl font-bold text-gray-900">
                Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}
              </h1>
              <p className="text-gray-600 mt-1">Manage your document processing workflows</p>
            </div>
            <Button leftIcon={<Plus className="w-4 h-4" />} aria-label="Create a new project">
              New Project
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" aria-label="Dashboard content">
          <div className="text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Ready to get started?
              </h2>
              
              <p className="text-gray-600 mb-8">
                Create your first project to begin working with Parscade.
              </p>
              
              <Button size="lg" leftIcon={<Plus className="w-5 h-5" />}>
                Create New Project
              </Button>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default DashboardPage;