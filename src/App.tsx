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