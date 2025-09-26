/**
 * Enterprise Dashboard Layout Component
 * Next-generation command center layout with adaptive architecture
 */

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';

import { GlobalErrorBoundary, QueryErrorBoundary } from '@/shared/components/error';
import Layout from '@/shared/components/layout/templates/Layout';
import { parscadeAnimations, parscadeGradients } from '@/shared/design/theme';

import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  // Enterprise layout enhancements
  variant?: 'default' | 'command-center' | 'analytics' | 'minimal';
  showBreadcrumbs?: boolean;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: (collapsed: boolean) => void;
  backgroundPattern?: 'default' | 'mesh' | 'hero' | 'minimal';
  headerVariant?: 'default' | 'compact' | 'extended';
}

/**
 * Enterprise Dashboard Layout - Next-generation command center
 * Adaptive layout with sophisticated theming and enterprise-grade UX
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  variant = 'default',
  showBreadcrumbs = false,
  sidebarCollapsed: controlledCollapsed,
  onSidebarToggle,
  backgroundPattern = 'default',
  headerVariant = 'default',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle controlled vs uncontrolled sidebar state
  const sidebarCollapsed = controlledCollapsed ?? internalCollapsed;
  const handleSidebarToggle = (collapsed: boolean) => {
    if (onSidebarToggle) {
      onSidebarToggle(collapsed);
    } else {
      setInternalCollapsed(collapsed);
    }
  };

  // Initial loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Background pattern configurations
  const backgroundPatterns = {
    default: 'bg-gradient-to-br from-primary-25/40 via-neutral-25 to-white',
    mesh: 'bg-gradient-to-br from-primary-25/30 via-neutral-25 to-white',
    hero: 'bg-gradient-to-br from-primary-25/50 via-purple-25/20 to-teal-25/20',
    minimal: 'bg-neutral-25',
  };

  // Layout variant configurations
  const layoutVariants = {
    default: 'min-x-screen',
    'command-center': 'min-h-screen',
    analytics: 'min-h-screen bg-gradient-to-br from-teal-25/30 to-primary-25/20',
    minimal: 'min-h-screen bg-white',
  };

  return (
    <Layout>
      <div
        className={`${backgroundPatterns[backgroundPattern]} ${layoutVariants[variant]} relative overflow-x-hidden`}
      >
        {/* Enterprise Background Effects */}
        <div className="pointer-events-none absolute inset-0">
          {backgroundPattern === 'default' && (
            <>
              <div
                className="absolute top-0 left-0 w-96 h-96 opacity-20"
                style={{
                  background: parscadeGradients.glowLarge,
                  filter: 'blur(60px)',
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-96 h-96 opacity-15"
                style={{
                  background: parscadeGradients.glassTeal,
                  filter: 'blur(80px)',
                }}
              />
            </>
          )}
          {backgroundPattern === 'mesh' && (
            <div
              className="absolute inset-0 opacity-30"
              style={{ backgroundImage: parscadeGradients.mesh }}
            />
          )}
          {backgroundPattern === 'hero' && (
            <>
              <div
                className="absolute inset-0 opacity-20"
                style={{ backgroundImage: parscadeGradients.heroBackground }}
              />
              <div
                className="absolute top-1/4 left-1/3 w-64 h-64 opacity-10"
                style={{
                  background: parscadeGradients.aura,
                  filter: 'blur(40px)',
                }}
              />
            </>
          )}
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              {...parscadeAnimations.modalBackdrop}
              className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="flex flex-col items-center space-y-4">
                <motion.div
                  {...parscadeAnimations.loadingBounce}
                  className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                />
                <motion.p
                  {...parscadeAnimations.loadingPulse}
                  className="text-sm text-neutral-600 font-medium"
                >
                  Loading enterprise dashboard...
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 flex min-h-screen">
          {/* Enterprise Sidebar */}
          <GlobalErrorBoundary level="section">
            <DashboardSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => handleSidebarToggle(!sidebarCollapsed)}
              variant={variant}
            />
          </GlobalErrorBoundary>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:pl-64">
            {/**
            * <GlobalErrorBoundary level="section">
            *  <DashboardHeader
            *    title={title}
            *    subtitle={subtitle}
            *    actions={actions}
            *    onMenuToggle={() => setSidebarOpen(true)}
            *    variant={headerVariant}
            *    showBreadcrumbs={showBreadcrumbs}
            *    layoutVariant={variant}
            *   />
            *  </GlobalErrorBoundary>
            */}


            {/* Adaptive Content Container */}
            <main className="relative">
              <QueryErrorBoundary>
                <motion.div
                  {...parscadeAnimations.fadeInUp}
                  className={`
                    ${variant === 'command-center' ? 'p-3 sm:p-4 lg:p-6' : 'p-4 sm:p-6 lg:p-8'}
                    ${variant === 'analytics' ? 'space-y-6' : 'space-y-8'}
                    ${className}
                  `}
                >
                  {/* Content Grid System */}
                  <div>
                    {children}
                  </div>
                </motion.div>
              </QueryErrorBoundary>

              {/* Floating Action Elements for Command Center */}
              {variant === 'command-center' && (
                <div className="fixed bottom-6 right-6 z-40">
                  <motion.div {...parscadeAnimations.float} className="flex flex-col space-y-2">
                    {/* Quick action buttons could be added here */}
                  </motion.div>
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Ambient Lighting Effects */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div
            className="absolute top-0 left-1/4 w-32 h-32 opacity-5 animate-pulse"
            style={{
              background: parscadeGradients.primary,
              borderRadius: '50%',
              filter: 'blur(20px)',
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/3 w-24 h-24 opacity-5"
            style={{
              background: parscadeGradients.accentTeal,
              borderRadius: '50%',
              filter: 'blur(15px)',
              animation: 'float 8s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default DashboardLayout;
