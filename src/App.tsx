import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/shared/components/ui/toaster';

// Auth
import { AuthProvider } from '@/features/auth/context/AuthContext';
import ProtectedRoute from '@/shared/components/layout/templates/ProtectedRoute';
import PublicAuthLayout from '@/shared/components/layout/templates/PublicAuthLayout';

// Pages
import HomePage from '@/features/marketing/pages/HomePage';
import AboutPage from '@/features/marketing/pages/AboutPage';
import ProductPage from '@/features/marketing/pages/ProductPage';
import BillingPage from '@/features/marketing/pages/BillingPage';
import ContactPage from '@/features/marketing/pages/ContactPage';
import PrivacyPage from '@/features/marketing/pages/PrivacyPage';
import TermsPage from '@/features/marketing/pages/TermsPage';
import NotFoundPage from '@/features/marketing/pages/NotFoundPage';
import ErrorPage from '@/features/marketing/pages/ErrorPage';
import LoginSupportPage from '@/features/auth/pages/LoginSupportPage';

// Dashboard
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import ProjectDetailPage from '@/features/dashboard/pages/ProjectDetailPage';
import JobDetailPage from '@/features/jobs/pages/JobDetailPage';
import JobsPage from '@/features/dashboard/pages/JobsPage';

// Account
import AccountLayout from '@/features/account/components/AccountLayout';
import ProfileTab from '@/features/account/components/tabs/ProfileTab';
import SecurityTab from '@/features/account/components/tabs/SecurityTab';
import NotificationsTab from '@/features/account/components/tabs/NotificationsTab';
import IntegrationsTab from '@/features/account/components/tabs/IntegrationsTab';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Marketing Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/support/login" element={<LoginSupportPage />} />

            {/* Auth Routes */}
            <Route path="/auth/*" element={<PublicAuthLayout />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/projects/:projectId"
              element={
                <ProtectedRoute>
                  <ProjectDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/jobs"
              element={
                <ProtectedRoute>
                  <JobsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/jobs/:jobId"
              element={
                <ProtectedRoute>
                  <JobDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Account Routes */}
            <Route
              path="/account/*"
              element={
                <ProtectedRoute>
                  <AccountLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProfileTab />} />
              <Route path="profile" element={<ProfileTab />} />
              <Route path="security" element={<SecurityTab />} />
              <Route path="notifications" element={<NotificationsTab />} />
              <Route path="integrations" element={<IntegrationsTab />} />
            </Route>

            {/* Error Routes */}
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;