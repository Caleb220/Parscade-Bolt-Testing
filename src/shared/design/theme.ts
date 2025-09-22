/**
 * Parscade Design System - Refined Blue Theme
 * Professional, scalable visual identity with modular architecture support
 */

export const parscadeTheme = {
  // Refined Blue Brand Colors - More Professional
  colors: {
    // Primary Brand Palette - Sophisticated Blues
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',  // Parscade Primary Blue
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    
    // Secondary Accent - Deeper Blue
    accent: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',  // Parscade Secondary
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    
    // Success/Processing - Refined Green
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    // Warning/Pending - Subtle Amber
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    
    // Error/Failed - Muted Red
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    
    // Neutral Grays - Warmer Tone
    neutral: {
      50: '#fafbfc',
      100: '#f4f6f8',
      200: '#e8ecf0',
      300: '#d1d9e0',
      400: '#9aa4b2',
      500: '#6b7684',
      600: '#4a5568',
      700: '#2d3748',
      800: '#1a202c',
      900: '#171923',
    },
  },
  
  // Typography Scale - Professional
  typography: {
    fontFamily: {
      display: ['Inter', 'system-ui', 'sans-serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  },
  
  // Spacing System (8px grid)
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem',
  },
  
  // Border Radius - Refined
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  // Shadows - Subtle and Professional
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    // Parscade Custom Shadows - Refined
    parscade: '0 4px 20px rgba(14, 165, 233, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
    'parscade-lg': '0 10px 40px rgba(14, 165, 233, 0.12), 0 4px 6px rgba(0, 0, 0, 0.05)',
    'parscade-glow': '0 0 20px rgba(14, 165, 233, 0.2)',
  },
  
  // Animation Timing - Refined
  animation: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      slower: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      // Parscade Custom Easing - Subtle
      parscade: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
} as const;

// Parscade Brand Gradients - Refined Blue Theme
export const parscadeGradients = {
  primary: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
  secondary: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  accent: 'linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)',
  neutral: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
  glow: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.1) 0%, transparent 70%)',
} as const;

// Parscade Component Variants - Professional Blue Theme
export const parscadeVariants = {
  card: {
    default: 'bg-white/95 backdrop-blur-sm border border-slate-200/60 shadow-parscade',
    elevated: 'bg-white/95 backdrop-blur-sm border border-slate-200/60 shadow-parscade-lg',
    glass: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-parscade',
    gradient: 'bg-gradient-to-br from-white to-blue-50/30 border border-blue-200/40 shadow-parscade',
  },
  button: {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-parscade',
    secondary: 'bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-800',
    accent: 'bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white shadow-parscade',
  },
  status: {
    processing: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300',
    completed: 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300',
    failed: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300',
    pending: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300',
  },
} as const;

// Parscade Animation Presets - Subtle and Professional
export const parscadeAnimations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  float: {
    animate: { y: [-4, 4, -4] },
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  pulse: {
    animate: { scale: [1, 1.02, 1] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  glow: {
    animate: { 
      boxShadow: [
        '0 0 10px rgba(14, 165, 233, 0.2)',
        '0 0 20px rgba(14, 165, 233, 0.3)',
        '0 0 10px rgba(14, 165, 233, 0.2)'
      ]
    },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
} as const;

// Feature Module System Configuration
export const featureModules = {
  // Core modules always available
  core: ['dashboard', 'account', 'auth'],
  
  // Feature modules with role/tier requirements
  features: {
    documents: { roles: ['user', 'admin'], tiers: ['free', 'pro', 'enterprise'] },
    jobs: { roles: ['user', 'admin'], tiers: ['free', 'pro', 'enterprise'] },
    analytics: { roles: ['user', 'admin'], tiers: ['pro', 'enterprise'] },
    team: { roles: ['admin'], tiers: ['pro', 'enterprise'] },
    integrations: { roles: ['user', 'admin'], tiers: ['pro', 'enterprise'] },
    billing: { roles: ['admin'], tiers: ['free', 'pro', 'enterprise'] },
    workflows: { roles: ['user', 'admin'], tiers: ['enterprise'] },
    api: { roles: ['user', 'admin'], tiers: ['pro', 'enterprise'] },
  },
} as const;

// Navigation Structure for Scalability
export const navigationStructure = {
  primary: [
    { id: 'overview', label: 'Overview', path: '/dashboard', icon: 'Home' },
    { id: 'documents', label: 'Documents', path: '/dashboard/documents', icon: 'FileText' },
    { id: 'jobs', label: 'Jobs', path: '/dashboard/jobs', icon: 'Zap' },
  ],
  secondary: [
    { id: 'analytics', label: 'Analytics', path: '/dashboard/analytics', icon: 'BarChart3', tier: 'pro' },
    { id: 'workflows', label: 'Workflows', path: '/dashboard/workflows', icon: 'GitBranch', tier: 'enterprise' },
    { id: 'integrations', label: 'Integrations', path: '/dashboard/integrations', icon: 'Puzzle', tier: 'pro' },
  ],
  admin: [
    { id: 'team', label: 'Team', path: '/dashboard/team', icon: 'Users', role: 'admin' },
    { id: 'billing', label: 'Billing', path: '/dashboard/billing', icon: 'CreditCard', role: 'admin' },
  ],
  settings: [
    { id: 'account', label: 'Account', path: '/account', icon: 'Settings', tier: 'starter' },
    { id: 'api', label: 'API Keys', path: '/account/api', icon: 'Key', tier: 'pro' },
  ],
} as const;

// Parscade Icon System - Refined
export const parscadeIcons = {
  // Document Processing
  transform: '⚡',
  extract: '📊',
  structure: '🔧',
  deliver: '📤',
  
  // Status Indicators
  processing: '🔄',
  completed: '✅',
  failed: '❌',
  pending: '⏳',
  
  // Brand Elements
  logo: '🎯',
  beta: '🚀',
  premium: '⭐',
  enterprise: '🏢',
} as const;

export type ParscadeTheme = typeof parscadeTheme;
export type ParscadeGradients = typeof parscadeGradients;
export type ParscadeVariants = typeof parscadeVariants;
export type ParscadeAnimations = typeof parscadeAnimations;
export type FeatureModules = typeof featureModules;
export type NavigationStructure = typeof navigationStructure;