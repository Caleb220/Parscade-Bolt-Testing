import React from 'react';

// Route configuration with preloading strategies
export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  preload?: {
    priority: 'low' | 'normal' | 'high';
    trigger: 'immediate' | 'hover' | 'visible' | 'idle';
    delay?: number;
    bandwidth?: boolean; // Respect bandwidth limitations
  };
  meta?: {
    title?: string;
    description?: string;
    public?: boolean;
    protected?: boolean;
  };
}

// Lazy-loaded components with optimized imports
export const lazyComponents = {
  // Marketing pages
  AboutPage: React.lazy(() => import('@/features/marketing/pages/AboutPage')),
  ProductPage: React.lazy(() => import('@/features/marketing/pages/ProductPage')),
  BillingPage: React.lazy(() => import('@/features/marketing/pages/BillingPage')),
  ContactPage: React.lazy(() => import('@/features/marketing/pages/ContactPage')),
  PrivacyPage: React.lazy(() => import('@/features/marketing/pages/PrivacyPage')),
  TermsPage: React.lazy(() => import('@/features/marketing/pages/TermsPage')),

  // Auth pages
  LoginSupportPage: React.lazy(() => import('@/features/auth/pages/LoginSupportPage')),

  // Dashboard pages (high priority)
  DashboardPage: React.lazy(() => import('@/features/dashboard/pages/DashboardPage')),
  CommandCentrePage: React.lazy(() => import('@/features/dashboard/pages/CommandCentrePage')),
  DocumentsPage: React.lazy(() =>
    import('@/features/dashboard/pages/DocumentsPage').then(module => ({
      default: module.default,
    }))
  ),
  DocumentDetailPage: React.lazy(() => import('@/features/dashboard/pages/DocumentDetailPage')),
  ProjectDetailPage: React.lazy(() => import('@/features/dashboard/pages/ProjectDetailPage')),
  JobDetailPage: React.lazy(() => import('@/features/jobs/pages/JobDetailPage')),
  JobsPage: React.lazy(() => import('@/features/dashboard/pages/JobsPage')),
  AnalyticsPage: React.lazy(() => import('@/features/dashboard/pages/AnalyticsPage')),
  WorkflowsPage: React.lazy(() => import('@/features/dashboard/pages/WorkflowsPage')),
  IntegrationsPage: React.lazy(() => import('@/features/dashboard/pages/IntegrationsPage')),
  TeamPage: React.lazy(() => import('@/features/dashboard/pages/TeamPage')),
  DashboardBillingPage: React.lazy(() => import('@/features/dashboard/pages/DashboardBillingPage')),

  // Analytics & Intelligence Hub
  BusinessIntelligencePage: React.lazy(() => import('@/features/dashboard/pages/BusinessIntelligencePage')),
  CustomReportsPage: React.lazy(() => import('@/features/dashboard/pages/CustomReportsPage')),
  TrendAnalysisPage: React.lazy(() => import('@/features/dashboard/pages/TrendAnalysisPage')),
  PredictiveAnalyticsPage: React.lazy(() => import('@/features/dashboard/pages/PredictiveAnalyticsPage')),

  // Processing Engine
  BatchProcessingPage: React.lazy(() => import('@/features/dashboard/pages/BatchProcessingPage')),
  PipelineManagerPage: React.lazy(() => import('@/features/dashboard/pages/PipelineManagerPage')),
  EngineConfigurationPage: React.lazy(() => import('@/features/dashboard/pages/EngineConfigurationPage')),
  QualityControlPage: React.lazy(() => import('@/features/dashboard/pages/QualityControlPage')),

  // Enterprise Integrations
  ApiManagementPage: React.lazy(() => import('@/features/dashboard/pages/ApiManagementPage')),
  WebhooksPage: React.lazy(() => import('@/features/dashboard/pages/WebhooksPage')),
  DataConnectorsPage: React.lazy(() => import('@/features/dashboard/pages/DataConnectorsPage')),
  IntegrationMarketplacePage: React.lazy(() => import('@/features/dashboard/pages/IntegrationMarketplacePage')),

  // Team & Workflow Management
  AutomationRulesPage: React.lazy(() => import('@/features/dashboard/pages/AutomationRulesPage')),
  ApprovalWorkflowPage: React.lazy(() => import('@/features/dashboard/pages/ApprovalWorkflowPage')),
  WorkflowTemplatesPage: React.lazy(() => import('@/features/dashboard/pages/WorkflowTemplatesPage')),
  ProcessMonitoringPage: React.lazy(() => import('@/features/dashboard/pages/ProcessMonitoringPage')),

  // Security & Compliance
  AuditLogsPage: React.lazy(() => import('@/features/dashboard/pages/AuditLogsPage')),
  ComplianceDashboardPage: React.lazy(() => import('@/features/dashboard/pages/ComplianceDashboardPage')),
  AccessControlPage: React.lazy(() => import('@/features/dashboard/pages/AccessControlPage')),
  DataEncryptionPage: React.lazy(() => import('@/features/dashboard/pages/DataEncryptionPage')),

  // Admin Console
  SystemConsolePage: React.lazy(() => import('@/features/dashboard/pages/SystemConsolePage')),
  UserManagementPage: React.lazy(() => import('@/features/dashboard/pages/UserManagementPage')),
  SystemMonitoringPage: React.lazy(() => import('@/features/dashboard/pages/SystemMonitoringPage')),

  // Account components
  AccountLayout: React.lazy(() => import('@/features/account/components/AccountLayout')),
  ProfileTab: React.lazy(() => import('@/features/account/components/tabs/ProfileTab')),
  SecurityTab: React.lazy(() => import('@/features/account/components/tabs/SecurityTab')),
  NotificationsTab: React.lazy(() => import('@/features/account/components/tabs/NotificationsTab')),
  IntegrationsTab: React.lazy(() => import('@/features/account/components/tabs/IntegrationsTab')),
  ApiKeysTab: React.lazy(() => import('@/features/account/components/tabs/ApiKeysTab')),
};

// Route configurations with smart preloading
export const routeConfigs: RouteConfig[] = [
  // Marketing routes (low priority, load on demand)
  {
    path: '/about',
    component: lazyComponents.AboutPage,
    preload: { priority: 'low', trigger: 'hover', bandwidth: true },
    meta: { title: 'About Us', public: true },
  },
  {
    path: '/product',
    component: lazyComponents.ProductPage,
    preload: { priority: 'normal', trigger: 'hover', bandwidth: true },
    meta: { title: 'Product Features', public: true },
  },
  {
    path: '/billing',
    component: lazyComponents.BillingPage,
    preload: { priority: 'low', trigger: 'hover', bandwidth: true },
    meta: { title: 'Pricing', public: true },
  },
  {
    path: '/contact',
    component: lazyComponents.ContactPage,
    preload: { priority: 'low', trigger: 'hover', bandwidth: true },
    meta: { title: 'Contact Us', public: true },
  },
  {
    path: '/privacy',
    component: lazyComponents.PrivacyPage,
    preload: { priority: 'low', trigger: 'visible', bandwidth: true },
    meta: { title: 'Privacy Policy', public: true },
  },
  {
    path: '/terms',
    component: lazyComponents.TermsPage,
    preload: { priority: 'low', trigger: 'visible', bandwidth: true },
    meta: { title: 'Terms of Service', public: true },
  },

  // Auth routes
  {
    path: '/login-support',
    component: lazyComponents.LoginSupportPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Login Support', public: true },
  },

  // Dashboard routes (high priority for authenticated users)
  {
    path: '/dashboard',
    component: lazyComponents.DashboardPage,
    preload: { priority: 'high', trigger: 'immediate' },
    meta: { title: 'Dashboard', protected: true },
  },
  {
    path: '/dashboard/command-centre',
    component: lazyComponents.CommandCentrePage,
    preload: { priority: 'high', trigger: 'immediate' },
    meta: { title: 'Command Centre', protected: true },
  },
  {
    path: '/dashboard/documents',
    component: lazyComponents.DocumentsPage,
    preload: { priority: 'high', trigger: 'idle', delay: 1000 },
    meta: { title: 'Documents', protected: true },
  },
  {
    path: '/dashboard/documents/:documentId',
    component: lazyComponents.DocumentDetailPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Document Details', protected: true },
  },
  {
    path: '/dashboard/projects/:projectId',
    component: lazyComponents.ProjectDetailPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Project Details', protected: true },
  },
  {
    path: '/dashboard/jobs/:jobId',
    component: lazyComponents.JobDetailPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Job Details', protected: true },
  },
  {
    path: '/dashboard/jobs',
    component: lazyComponents.JobsPage,
    preload: { priority: 'high', trigger: 'idle', delay: 2000 },
    meta: { title: 'Jobs', protected: true },
  },
  {
    path: '/dashboard/analytics',
    component: lazyComponents.AnalyticsPage,
    preload: { priority: 'normal', trigger: 'idle', delay: 3000 },
    meta: { title: 'Analytics', protected: true },
  },
  {
    path: '/dashboard/workflows',
    component: lazyComponents.WorkflowsPage,
    preload: { priority: 'low', trigger: 'hover', bandwidth: true },
    meta: { title: 'Workflows', protected: true },
  },
  {
    path: '/dashboard/integrations',
    component: lazyComponents.IntegrationsPage,
    preload: { priority: 'low', trigger: 'hover', bandwidth: true },
    meta: { title: 'Integrations', protected: true },
  },
  {
    path: '/dashboard/team',
    component: lazyComponents.TeamPage,
    preload: { priority: 'low', trigger: 'hover', bandwidth: true },
    meta: { title: 'Team', protected: true },
  },
  {
    path: '/dashboard/billing',
    component: lazyComponents.DashboardBillingPage,
    preload: { priority: 'low', trigger: 'hover', bandwidth: true },
    meta: { title: 'Billing', protected: true },
  },

  // Analytics & Intelligence Hub routes
  {
    path: '/dashboard/analytics/insights',
    component: lazyComponents.BusinessIntelligencePage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Business Intelligence', protected: true },
  },
  {
    path: '/dashboard/analytics/reports',
    component: lazyComponents.CustomReportsPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Custom Reports', protected: true },
  },
  {
    path: '/dashboard/analytics/trends',
    component: lazyComponents.TrendAnalysisPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Trend Analysis', protected: true },
  },
  {
    path: '/dashboard/analytics/predictions',
    component: lazyComponents.PredictiveAnalyticsPage,
    preload: { priority: 'low', trigger: 'hover' },
    meta: { title: 'Predictive Analytics', protected: true },
  },

  // Processing Engine routes
  {
    path: '/dashboard/processing/batch',
    component: lazyComponents.BatchProcessingPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Batch Processing', protected: true },
  },
  {
    path: '/dashboard/processing/pipeline',
    component: lazyComponents.PipelineManagerPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Pipeline Manager', protected: true },
  },
  {
    path: '/dashboard/processing/config',
    component: lazyComponents.EngineConfigurationPage,
    preload: { priority: 'low', trigger: 'hover' },
    meta: { title: 'Engine Configuration', protected: true },
  },
  {
    path: '/dashboard/processing/quality',
    component: lazyComponents.QualityControlPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Quality Control', protected: true },
  },

  // Enterprise Integrations routes
  {
    path: '/dashboard/integrations/api',
    component: lazyComponents.ApiManagementPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'API Management', protected: true },
  },
  {
    path: '/dashboard/integrations/webhooks',
    component: lazyComponents.WebhooksPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Webhooks', protected: true },
  },
  {
    path: '/dashboard/integrations/connectors',
    component: lazyComponents.DataConnectorsPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Data Connectors', protected: true },
  },
  {
    path: '/dashboard/integrations/marketplace',
    component: lazyComponents.IntegrationMarketplacePage,
    preload: { priority: 'low', trigger: 'hover' },
    meta: { title: 'Integration Marketplace', protected: true },
  },

  // Team & Workflow Management routes
  {
    path: '/dashboard/workflow/automation',
    component: lazyComponents.AutomationRulesPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Automation Rules', protected: true },
  },
  {
    path: '/dashboard/workflow/approvals',
    component: lazyComponents.ApprovalWorkflowPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Approval Workflow', protected: true },
  },
  {
    path: '/dashboard/workflow/templates',
    component: lazyComponents.WorkflowTemplatesPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Workflow Templates', protected: true },
  },
  {
    path: '/dashboard/workflow/monitoring',
    component: lazyComponents.ProcessMonitoringPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Process Monitoring', protected: true },
  },

  // Security & Compliance routes
  {
    path: '/dashboard/security/audit',
    component: lazyComponents.AuditLogsPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Audit Logs', protected: true },
  },
  {
    path: '/dashboard/security/compliance',
    component: lazyComponents.ComplianceDashboardPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Compliance Dashboard', protected: true },
  },
  {
    path: '/dashboard/security/permissions',
    component: lazyComponents.AccessControlPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'Access Control', protected: true },
  },
  {
    path: '/dashboard/security/encryption',
    component: lazyComponents.DataEncryptionPage,
    preload: { priority: 'low', trigger: 'hover' },
    meta: { title: 'Data Encryption', protected: true },
  },

  // Admin Console routes
  {
    path: '/dashboard/admin/console',
    component: lazyComponents.SystemConsolePage,
    preload: { priority: 'low', trigger: 'hover' },
    meta: { title: 'System Console', protected: true },
  },
  {
    path: '/dashboard/admin/users',
    component: lazyComponents.UserManagementPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'User Management', protected: true },
  },
  {
    path: '/dashboard/admin/monitoring',
    component: lazyComponents.SystemMonitoringPage,
    preload: { priority: 'normal', trigger: 'hover' },
    meta: { title: 'System Monitoring', protected: true },
  },
];

// Preloading priorities for different user contexts
export const preloadStrategies = {
  // For authenticated users, preload dashboard essentials
  authenticated: [
    { path: '/dashboard', priority: 'high' as const },
    { path: '/dashboard/command-centre', priority: 'high' as const },
    { path: '/dashboard/documents', priority: 'high' as const },
    { path: '/dashboard/jobs', priority: 'normal' as const },
    { path: '/account/profile', priority: 'normal' as const },
  ],

  // For public users, preload likely next pages
  public: [
    { path: '/about', priority: 'normal' as const },
    { path: '/product', priority: 'normal' as const },
    { path: '/billing', priority: 'low' as const },
  ],

  // For users on specific pages
  contextual: {
    '/dashboard': [
      { path: '/dashboard/command-centre', priority: 'high' as const },
      { path: '/dashboard/documents', priority: 'high' as const },
      { path: '/dashboard/jobs', priority: 'normal' as const },
    ],
    '/dashboard/documents': [
      { path: '/dashboard/jobs', priority: 'normal' as const },
      { path: '/dashboard/analytics', priority: 'low' as const },
    ],
    '/': [
      { path: '/about', priority: 'normal' as const },
      { path: '/product', priority: 'high' as const },
    ],
  },
};

// Static paths for navigation and route protection
export const PATHS = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  PRODUCT: '/product',
  PRICING: '/billing',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  LOGIN_SUPPORT: '/login-support',

  // Auth routes
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    RESET_PASSWORD: '/auth/reset-password',
    CONFIRM_EMAIL: '/auth/confirm-email',
  },

  // Dashboard routes
  DASHBOARD: {
    ROOT: '/dashboard',
    COMMAND_CENTRE: '/dashboard/command-centre',
    DOCUMENTS: '/dashboard/documents',
    DOCUMENT_DETAIL: (id: string) => `/dashboard/documents/${id}`,
    PROJECTS: '/dashboard/projects',
    PROJECT_DETAIL: (id: string) => `/dashboard/projects/${id}`,
    JOBS: '/dashboard/jobs',
    JOB_DETAIL: (id: string) => `/dashboard/jobs/${id}`,
    ANALYTICS: '/dashboard/analytics',
    WORKFLOWS: '/dashboard/workflows',
    INTEGRATIONS: '/dashboard/integrations',
    TEAM: '/dashboard/team',
    BILLING: '/dashboard/billing',
  },

  // Account routes
  ACCOUNT: {
    ROOT: '/account',
    PROFILE: '/account/profile',
    SECURITY: '/account/security',
    NOTIFICATIONS: '/account/notifications',
    INTEGRATIONS: '/account/integrations',
    API_KEYS: '/account/api-keys',
  },

  // Error routes
  NOT_FOUND: '/404',
  ERROR: '/error',
} as const;
