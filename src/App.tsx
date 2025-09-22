import React, { useEffect, useMemo, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { QueryProvider } from '@/app/providers/QueryProvider';
import { AuthProvider, useAuth, LoginSupportPage } from '@/features/auth';
import ErrorBoundary from '@/shared/components/layout/molecules/ErrorBoundary';
import ProtectedRoute from '@/shared/components/layout/templates/ProtectedRoute';
import LoadingSpinner from '@/shared/components/forms/atoms/LoadingSpinner';
import { Toaster } from '@/shared/components/ui/toaster';
import { env } from '@/app/config/env';
import { analytics, trackPageView } from '@/shared/utils/analytics';
import { defaultSEO, updateSEO } from '@/shared/utils/seo';

import type { SeoConfig } from '@/shared/schemas';

/**
 * Public Route component that redirects authenticated users
 */
const PublicRoute: React.FC<{ children: React.ReactNode; redirectTo?: string }> = ({ 
  children, 
  redirectTo = '/dashboard' 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

/**
 * Loading fallback component for route-level code splitting
 */
const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="lg" className="mx-auto mb-4" />
      <p className="text-gray-600 text-sm">Loading page...</p>
    </div>
  </div>
);

// Lazy-loaded page components for code splitting
const HomePage = React.lazy(() => import('@/features/marketing/pages/HomePage'));
const ProductPage = React.lazy(() => import('@/features/marketing/pages/ProductPage'));
const DashboardPage = React.lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const JobDetailPage = React.lazy(() => import('@/features/jobs/pages/JobDetailPage'));
const AccountLayout = React.lazy(() => import('@/features/account/components/AccountLayout'));
const ProjectDetailPage = React.lazy(() => import('@/features/dashboard/pages/ProjectDetailPage'));
const BillingPage = React.lazy(() => import('@/features/marketing/pages/BillingPage'));
const ContactPage = React.lazy(() => import('@/features/marketing/pages/ContactPage'));
const AboutPage = React.lazy(() => import('@/features/marketing/pages/AboutPage'));
const PrivacyPage = React.lazy(() => import('@/features/marketing/pages/PrivacyPage'));
const TermsPage = React.lazy(() => import('@/features/marketing/pages/TermsPage'));
const NotFoundPage = React.lazy(() => import('@/features/marketing/pages/NotFoundPage'));
const ErrorPage = React.lazy(() => import('@/features/marketing/pages/ErrorPage'));

// Lazy-loaded account tabs
const ProfileTab = React.lazy(() => import('@/features/account/components/tabs/ProfileTab'));
const SecurityTab = React.lazy(() => import('@/features/account/components/tabs/SecurityTab'));
const NotificationsTab = React.lazy(() => import('@/features/account/components/tabs/NotificationsTab'));
const IntegrationsTab = React.lazy(() => import('@/features/account/components/tabs/IntegrationsTab'));

/**
 * Component to handle route changes and analytics.
 * Manages SEO updates and page view tracking for different routes.
 */
const RouteHandler: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    const routeSEO: Record<string, Partial<SeoConfig>> = {
      '/': {
        title: 'Parscade',
        description: 'Intelligent document parsing platform that automatically extracts, structures, and delivers data from any document format with enterprise-grade accuracy.',
      },
      '/product': {
        title: 'Parscade',
        description: 'Discover how Parscade\'s intelligent parsing pipeline transforms documents through four seamless stages, delivering structured data ready for your applications.',
      },
      '/dashboard': {
        title: 'Parscade',
        description: 'Manage your document processing workflows with Parscade\'s intuitive dashboard.',
      },
      '/account': {
        title: 'Parscade',
        description: 'Manage your account preferences, security settings, and team configuration.',
      },
      '/billing': {
        title: 'Parscade',
        description: 'Choose the perfect plan for your document processing needs. Simple, transparent pricing with no hidden fees.',
      },
      '/contact': {
        title: 'Parscade',
        description: 'Get in touch with our team. We\'re here to help with any questions about Parscade.',
      },
      '/about': {
        title: 'Parscade',
        description: 'Learn about our mission to revolutionize document processing and join our beta program.',
      },
      '/privacy': {
        title: 'Parscade',
        description: 'How we protect your data and respect your privacy during our beta program.',
      },
      '/terms': {
        title: 'Parscade',
        description: 'Terms and conditions for using Parscade during our beta program.',
      },
      '/404': {
        title: 'Parscade - Page Not Found',
        description: 'The page you\'re looking for doesn\'t exist.',
      },
      '/error': {
        title: 'Parscade',
        description: 'An unexpected error occurred.',
      },
    } as const;

    const currentRoute = routeSEO[location.pathname];
    updateSEO({
      ...defaultSEO,
      ...currentRoute,
      url: `${window.location.origin}${location.pathname}`,
    });

    trackPageView(location.pathname);
  }, [location]);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <Suspense fallback={<RouteLoadingFallback />}>
            <HomePage />
          </Suspense>
        } />
        <Route path="/product" element={
          <Suspense fallback={<RouteLoadingFallback />}>
            <ProductPage />
          </Suspense>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute redirectTo="/">
            <Suspense fallback={<RouteLoadingFallback />}>
              <DashboardPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/jobs/:jobId" element={
          <ProtectedRoute redirectTo="/">
            <Suspense fallback={<RouteLoadingFallback />}>
              <JobDetailPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/projects/:projectId" element={
          <ProtectedRoute redirectTo="/">
            <Suspense fallback={<RouteLoadingFallback />}>
              <ProjectDetailPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/account" element={
          <ProtectedRoute redirectTo="/">
            <Suspense fallback={<RouteLoadingFallback />}>
              <AccountLayout />
            </Suspense>
          </ProtectedRoute>
        }>
          <Route index element={
            <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto" />}>
              <ProfileTab />
            </Suspense>
          } />
          <Route path="security" element={
            <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto" />}>
              <SecurityTab />
            </Suspense>
          } />
          <Route path="notifications" element={
            <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto" />}>
              <NotificationsTab />
            </Suspense>
          } />
          <Route path="integrations" element={
            <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto" />}>
              <IntegrationsTab />
            </Suspense>
          } />
        </Route>
        <Route path="/billing" element={
          <Suspense fallback={<RouteLoadingFallback />}>
            <BillingPage />
          </Suspense>
        } />
        <Route path="/contact" element={
          <Suspense fallback={<RouteLoadingFallback />}>
            <ContactPage />
          </Suspense>
        } />
        <Route path="/about" element={
          <Suspense fallback={<RouteLoadingFallback />}>
            <AboutPage />
          </Suspense>
        } />
        <Route path="/privacy" element={
          <Suspense fallback={<RouteLoadingFallback />}>
            <PrivacyPage />
          </Suspense>
        } />
        <Route path="/terms" element={
          <Suspense fallback={<RouteLoadingFallback />}>
            <TermsPage />
          </Suspense>
        } />
        
        {/* Deprecated routes - Redirect to support */}
        <Route path="/reset-password" element={<Navigate to="/login-support" replace />} />
        <Route path="/auth/recovery" element={<Navigate to="/login-support" replace />} />
        <Route path="/forgot-password" element={<Navigate to="/login-support" replace />} />
        <Route path="/login-support" element={
          <PublicRoute>
            <Suspense fallback={<RouteLoadingFallback />}>
              <LoginSupportPage />
            </Suspense>
          </PublicRoute>
        } />
        <Route path="/404" element={
          <Suspense fallback={<RouteLoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        } />
        <Route path="/error" element={
          <Suspense fallback={<RouteLoadingFallback />}>
            <ErrorPage />
          </Suspense>
        } />
        <Route path="*" element={
          <Suspense fallback={<RouteLoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        } />
      </Routes>
    </AnimatePresence>
  );
};

/**
 * Main application component.
 * Sets up providers, routing, and analytics initialization.
 */
const App: React.FC = () => {
  useEffect(() => {
    if (env.analytics.key) {
      analytics.init(env.analytics.key);
    }
  }, []);

  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <QueryProvider>
        <AuthProvider>
          <Router>
            <RouteHandler />
            <Toaster />
          </Router>
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default App;
