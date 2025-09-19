import React, { useEffect, useMemo } from 'react';
import type { FC } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider, ForgotPasswordPage, ResetPasswordPage, useAuth } from './features/auth';
import { DashboardPage } from './features/dashboard';
import AccountPage from './features/account/pages/AccountPage';
import {
  AboutPage,
  BillingPage,
  ContactPage,
  HomePage,
  NotFoundPage,
  PrivacyPage,
  ProductPage,
  TermsPage,
} from './features/marketing';

// Protected Route Component
const ProtectedRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/" replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return !user ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

// Route Handler Component
const RouteHandler: FC = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        
        {/* Auth Routes - Only accessible when not logged in */}
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        } />
        <Route path="/reset-password" element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/account" element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        } />
        
        {/* Error Routes */}
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

// Main App Component
const App: FC = () => {
  return (
    <AuthProvider>
      <Router>
        <RouteHandler />
      </Router>
    </AuthProvider>
  );
};

export default App;