/**
 * Parscade Design System
 * Unique visual identity and branding foundation
 */

export const parscadeTheme = {
  // Parscade Brand Colors
  colors: {
    // Primary Brand Palette
    primary: {
      50: '#f0f4ff',
      100: '#e0e9ff',
      200: '#c7d6fe',
      300: '#a5b8fc',
      400: '#8b93f8',
      500: '#7c6df2',  // Parscade Purple
      600: '#6d4de8',
      700: '#5d3dd4',
      800: '#4d32b0',
      900: '#412a8f',
    },
    
    // Secondary Accent
    accent: {
      50: '#f0fdff',
      100: '#ccf7fe',
      200: '#99effd',
      300: '#66e2fa',
      400: '#33cef5',
      500: '#00b8f0',  // Parscade Cyan
      600: '#0093c4',
      700: '#006e98',
      800: '#004a6c',
      900: '#002540',
    },
    
    // Success/Processing
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',  // Parscade Green
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    // Warning/Pending
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',  // Parscade Amber
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    
    // Error/Failed
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',  // Parscade Red
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    
    // Neutral Grays
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
  
  // Typography Scale
  typography: {
    fontFamily: {
      display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
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
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    // Parscade Custom Shadows
    parscade: '0 8px 32px rgba(124, 109, 242, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1)',
    'parscade-lg': '0 20px 64px rgba(124, 109, 242, 0.2), 0 8px 32px rgba(0, 0, 0, 0.1)',
    'parscade-glow': '0 0 32px rgba(124, 109, 242, 0.3)',
  },
  
  // Animation Timing
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
      // Parscade Custom Easing
      parscade: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
} as const;

// Parscade Brand Gradients
export const parscadeGradients = {
  primary: 'linear-gradient(135deg, #7c6df2 0%, #00b8f0 100%)',
  secondary: 'linear-gradient(135deg, #00b8f0 0%, #22c55e 100%)',
  accent: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  neutral: 'linear-gradient(135deg, #f4f6f8 0%, #e8ecf0 100%)',
  glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
  glow: 'radial-gradient(circle at center, rgba(124, 109, 242, 0.15) 0%, transparent 70%)',
} as const;

// Parscade Component Variants
export const parscadeVariants = {
  card: {
    default: 'bg-white/95 backdrop-blur-xl border border-neutral-200/60 shadow-parscade',
    elevated: 'bg-white/95 backdrop-blur-xl border border-neutral-200/60 shadow-parscade-lg',
    glass: 'bg-white/80 backdrop-blur-2xl border border-white/20 shadow-parscade',
    gradient: 'bg-gradient-to-br from-white to-primary-50/30 border border-primary-200/60 shadow-parscade',
  },
  button: {
    primary: 'bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 text-white shadow-parscade',
    secondary: 'bg-gradient-to-r from-neutral-100 to-neutral-200 hover:from-neutral-200 hover:to-neutral-300 text-neutral-800',
    accent: 'bg-gradient-to-r from-accent-500 to-success-500 hover:from-accent-600 hover:to-success-600 text-white shadow-parscade',
  },
  status: {
    processing: 'bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800 border border-accent-300',
    completed: 'bg-gradient-to-r from-success-100 to-success-200 text-success-800 border border-success-300',
    failed: 'bg-gradient-to-r from-error-100 to-error-200 text-error-800 border border-error-300',
    pending: 'bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800 border border-warning-300',
  },
} as const;

// Parscade Animation Presets
export const parscadeAnimations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
  },
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
  },
  float: {
    animate: { y: [-8, 8, -8] },
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  pulse: {
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  glow: {
    animate: { 
      boxShadow: [
        '0 0 20px rgba(124, 109, 242, 0.3)',
        '0 0 40px rgba(124, 109, 242, 0.5)',
        '0 0 20px rgba(124, 109, 242, 0.3)'
      ]
    },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
} as const;

// Parscade Icon System
export const parscadeIcons = {
  // Document Processing Metaphors
  transform: '🔄',
  extract: '📤',
  structure: '🏗️',
  deliver: '🚀',
  
  // Status Indicators
  processing: '⚡',
  completed: '✨',
  failed: '🔥',
  pending: '⏳',
  
  // Brand Elements
  logo: '🎯',
  beta: '🚀',
  premium: '💎',
  enterprise: '🏢',
} as const;

// Parscade Spacing System
export const parscadeSpacing = {
  // Component Spacing
  component: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  
  // Layout Spacing
  layout: {
    section: '5rem',
    container: '2rem',
    grid: '1.5rem',
  },
  
  // Interactive Spacing
  interactive: {
    button: '0.75rem 1.5rem',
    input: '0.75rem 1rem',
    card: '1.5rem',
  },
} as const;

export type ParscadeTheme = typeof parscadeTheme;
export type ParscadeGradients = typeof parscadeGradients;
export type ParscadeVariants = typeof parscadeVariants;
export type ParscadeAnimations = typeof parscadeAnimations;