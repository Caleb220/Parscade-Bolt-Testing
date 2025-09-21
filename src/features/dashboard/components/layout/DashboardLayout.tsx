/**
 * Dashboard Layout Component
 * Modular layout foundation for the dashboard with responsive design
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

import Layout from '@/shared/components/layout/templates/Layout';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import ErrorBoundary from '@/shared/components/layout/molecules/ErrorBoundary';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

/**
 * Main dashboard layout with sidebar, header, and content area
 * Provides consistent structure for all dashboard pages
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
}) => {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="flex h-screen">
          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <DashboardSidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <DashboardHeader 
              title={title}
              subtitle={subtitle}
              actions={actions}
            />

            {/* Content */}
            <main className="flex-1 overflow-y-auto">
              <ErrorBoundary>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 sm:p-6 lg:p-8 ${className}`}
                >
                  {children}
                </motion.div>
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardLayout;