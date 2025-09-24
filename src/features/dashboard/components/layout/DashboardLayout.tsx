/**
 * Dashboard Layout Component
 * Modular layout foundation for the dashboard with responsive design
 */

import { motion } from 'framer-motion';
import React from 'react';

import { GlobalErrorBoundary, QueryErrorBoundary } from '@/shared/components/error';
import Layout from '@/shared/components/layout/templates/Layout';

import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

import type { ReactNode } from 'react';

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
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <Layout>
      <div className="bg-gradient-to-br from-purple-50/30 via-cyan-50/20 to-white min-h-svh relative">
        {/* Background Pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-200 to-transparent rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex min-h-svh">
          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <GlobalErrorBoundary level="section">
            <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </GlobalErrorBoundary>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <GlobalErrorBoundary level="section">
              <DashboardHeader
                title={title}
                subtitle={subtitle}
                actions={actions}
                onMenuToggle={() => setSidebarOpen(true)}
              />
            </GlobalErrorBoundary>

            {/* Content */}
            <main className="flex-1">
              <QueryErrorBoundary>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 sm:p-6 lg:p-8 ${className}`}
                >
                  {children}
                </motion.div>
              </QueryErrorBoundary>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardLayout;