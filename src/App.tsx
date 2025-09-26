import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoadingSpinner from '@/components/ui/loading-spinner';

// Auth (keep these as regular imports since they're critical)
import { AuthProvider } from '@/features/auth/context/AuthContext';
import ErrorPage from '@/features/marketing/pages/ErrorPage';
import HomePage from '@/features/marketing/pages/HomePage';
import NotFoundPage from '@/features/marketing/pages/NotFoundPage';
import { ProProtectedRoute } from '@/shared/components/layout/templates';
import ProtectedRoute from '@/shared/components/layout/templates/ProtectedRoute';
import PublicAuthLayout from '@/shared/components/layout/templates/PublicAuthLayout';
// Critical pages (keep as regular imports for performance)
import { Toaster } from '@/shared/components/ui/toaster';

// Lazy-loaded Marketing Pages
const AboutPage = React.lazy(() => import('@/features/marketing/pages/AboutPage'));
const ProductPage = React.lazy(() => import('@/features/marketing/pages/ProductPage'));
const BillingPage = React.lazy(() => import('@/features/marketing/pages/BillingPage'));
const ContactPage = React.lazy(() => import('@/features/marketing/pages/ContactPage'));
const PrivacyPage = React.lazy(() => import('@/features/marketing/pages/PrivacyPage'));
const TermsPage = React.lazy(() => import('@/features/marketing/pages/TermsPage'));
const LoginSupportPage = React.lazy(() => import('@/features/auth/pages/LoginSupportPage'));

// Lazy-loaded Dashboard Pages
const CommandCentrePage = React.lazy(() => import('@/features/dashboard/pages/CommandCentrePage'));
const DashboardPage = React.lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const DocumentsPage = React.lazy(() => import('@/features/dashboard/pages/DocumentsPage'));
const DocumentDetailPage = React.lazy(
  () => import('@/features/dashboard/pages/DocumentDetailPage')
);
const ProjectDetailPage = React.lazy(() => import('@/features/dashboard/pages/ProjectDetailPage'));
const JobDetailPage = React.lazy(() => import('@/features/jobs/pages/JobDetailPage'));
const JobsPage = React.lazy(() => import('@/features/dashboard/pages/JobsPage'));
const AnalyticsPage = React.lazy(() => import('@/features/dashboard/pages/AnalyticsPage'));
const WorkflowsPage = React.lazy(() => import('@/features/dashboard/pages/WorkflowsPage'));
const IntegrationsPage = React.lazy(() => import('@/features/dashboard/pages/IntegrationsPage'));
const TeamPage = React.lazy(() => import('@/features/dashboard/pages/TeamPage'));
const DashboardBillingPage = React.lazy(
  () => import('@/features/dashboard/pages/DashboardBillingPage')
);

// Lazy-loaded Account Components
const AccountLayout = React.lazy(() => import('@/features/account/components/AccountLayout'));
const ProfileTab = React.lazy(() => import('@/features/account/components/tabs/ProfileTab'));
const SecurityTab = React.lazy(() => import('@/features/account/components/tabs/SecurityTab'));
const NotificationsTab = React.lazy(
  () => import('@/features/account/components/tabs/NotificationsTab')
);
const IntegrationsTab = React.lazy(
  () => import('@/features/account/components/tabs/IntegrationsTab')
);
const ApiKeysTab = React.lazy(() => import('@/features/account/components/tabs/ApiKeysTab'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Marketing Routes */}
              <Route path="/" element={<HomePage />} />
              <Route
                path="/about"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <AboutPage />
                  </Suspense>
                }
              />
              <Route
                path="/product"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProductPage />
                  </Suspense>
                }
              />
              <Route
                path="/billing"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <BillingPage />
                  </Suspense>
                }
              />
              <Route
                path="/contact"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ContactPage />
                  </Suspense>
                }
              />
              <Route
                path="/privacy"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <PrivacyPage />
                  </Suspense>
                }
              />
              <Route
                path="/terms"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <TermsPage />
                  </Suspense>
                }
              />
              <Route
                path="/support/login"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <LoginSupportPage />
                  </Suspense>
                }
              />

              {/* Auth Routes */}
              <Route path="/auth/*" element={<PublicAuthLayout />} />

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <DashboardPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/command-centre"
                element={
                  <ProProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <CommandCentrePage />
                    </Suspense>
                  </ProProtectedRoute>
                }
              />
              <Route
                path="/dashboard/documents"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <DocumentsPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/documents/:documentId"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <DocumentDetailPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/projects/:projectId"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <ProjectDetailPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/jobs"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <JobsPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/jobs/:jobId"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <JobDetailPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/analytics"
                element={
                  <ProtectedRoute>
                    <ProProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <AnalyticsPage />
                      </Suspense>
                    </ProProtectedRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/workflows"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <WorkflowsPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/integrations"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <IntegrationsPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/team"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <TeamPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/billing"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <DashboardBillingPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              {/* Protected Account Routes */}
              <Route
                path="/account/*"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <AccountLayout />
                    </Suspense>
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <ProfileTab />
                    </Suspense>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <ProfileTab />
                    </Suspense>
                  }
                />
                <Route
                  path="security"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <SecurityTab />
                    </Suspense>
                  }
                />
                <Route
                  path="notifications"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <NotificationsTab />
                    </Suspense>
                  }
                />
                <Route
                  path="integrations"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <IntegrationsTab />
                    </Suspense>
                  }
                />
                <Route
                  path="api"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <ApiKeysTab />
                    </Suspense>
                  }
                />
              </Route>

              {/* Error Routes */}
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </div>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
