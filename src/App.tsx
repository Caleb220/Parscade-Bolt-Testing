import React, { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorBoundary from '@/components/molecules/ErrorBoundary';
import ProtectedRoute from '@/components/templates/ProtectedRoute';
import { env } from '@/config/env';
import AccountPage from '@/features/account/pages/AccountPage';
import { AuthProvider, LoginPage, useAuth } from '@/features/auth';
import { DashboardPage } from '@/features/dashboard';
import AboutPage from '@/features/marketing/pages/AboutPage';
import BillingPage from '@/features/marketing/pages/BillingPage';
import ContactPage from '@/features/marketing/pages/ContactPage';
import ErrorPage from '@/features/marketing/pages/ErrorPage';
import HomePage from '@/features/marketing/pages/HomePage';
import NotFoundPage from '@/features/marketing/pages/NotFoundPage';
import PrivacyPage from '@/features/marketing/pages/PrivacyPage';
import ProductPage from '@/features/marketing/pages/ProductPage';
import TermsPage from '@/features/marketing/pages/TermsPage';
import { logger } from '@/services/logger';
import { analytics, trackPageView } from '@/utils/analytics';
import { AUTH_PATHS, PATHS } from '@/routes/paths';
import { defaultSEO, updateSEO } from '@/utils/seo';

import type { FC } from 'react';
import type { SeoConfig } from '@/schemas';

/**
 * Public Route component that redirects authenticated users
 * ENHANCED: Checks for recovery mode to prevent dashboard redirects during password reset
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
 * Component to handle route changes and analytics.
 * Manages SEO updates and page view tracking for different routes.
 * 
 * ANTI-FLICKER: Detects recovery mode early to prevent home page flash
 */
const RouteHandler: FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Define SEO configuration for each route
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
      '/login': {
        title: 'Parscade - Sign In',
        description: 'Sign in to your Parscade account to access your document processing dashboard.',
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

    // Track page view
    trackPageView(location.pathname);
  }, [location]);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute redirectTo="/login">
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/account" element={
          <ProtectedRoute redirectTo="/login">
            <AccountPage />
          </ProtectedRoute>
        } />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        {/* DEPRECATED ROUTES - Redirect to login with support message */}
        <Route path="/reset-password" element={<Navigate to="/login-support" replace />} />
        <Route path="/auth/recovery" element={<Navigate to="/login-support" replace />} />
        <Route path="/forgot-password" element={<Navigate to="/login-support" replace />} />
        <Route path="/login-support" element={
          <PublicRoute>
            <LoginSupportPage />
          </PublicRoute>
        } />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

/**
 * Support page for users who previously used password reset
 */
const LoginSupportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Need Help Signing In?
        </h1>
        <p className="text-gray-600 mb-6">
          Password reset is currently unavailable. For assistance with your account, please contact our support team.
        </p>
        <div className="space-y-3">
          <a
            href="mailto:admin@parscade.com?subject=Account Access Help"
            className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Contact Support
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Back to Login
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Response time: Within 24 hours
        </p>
      </div>
    </div>
  );
};

/**
 * Main application component.
 * Sets up providers, routing, and analytics initialization.
 */
const App: FC = () => {
  useEffect(() => {
    // Initialize analytics if API key is available
    if (env.analytics.key) {
      analytics.init(env.analytics.key);
    }
    
    // Set up global request context for Sentry
    logger.setContext('app', {
      version: import.meta.env?.VITE_APP_VERSION || '1.0.0',
      environment: import.meta.env?.MODE || 'development',
      url: window.location.href,
      userAgent: navigator.userAgent,
    });
  }, []);

  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <AuthProvider>
        <Router>
          <RouteHandler />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
