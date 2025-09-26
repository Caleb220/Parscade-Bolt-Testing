/**
 * Parscade Enterprise Design System
 * Next-generation visual identity with enterprise-grade sophistication
 */

export const parscadeTheme = {
  // Enterprise Brand Colors - Professional & Sophisticated
  colors: {
    // Primary Brand Palette - Deep Enterprise Blues
    primary: {
      25: '#fcfeff',
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Parscade Primary Blue
      600: '#0284c7', // Enhanced primary
      700: '#0369a1', // Deeper enterprise blue
      800: '#075985', // Professional depth
      900: '#0c4a6e', // Maximum contrast
      950: '#082f49', // Ultra-deep enterprise
    },

    // Secondary Accent - Sophisticated Slate
    accent: {
      25: '#fcfcfd',
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b', // Parscade Secondary
      600: '#475569', // Professional contrast
      700: '#334155', // Enterprise depth
      800: '#1e293b', // Maximum readability
      900: '#0f172a', // Ultra-deep
      950: '#020617', // Absolute depth
    },

    // Success/Processing - Professional Green
    success: {
      25: '#f6fff7',
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Enterprise success
      600: '#16a34a', // Confident success
      700: '#15803d', // Deep success
      800: '#166534', // Professional depth
      900: '#14532d', // Maximum contrast
      950: '#0f2c19', // Ultra-deep
    },

    // Warning/Pending - Professional Amber
    warning: {
      25: '#fffcf5',
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Enterprise warning
      600: '#d97706', // Professional attention
      700: '#b45309', // Deep warning
      800: '#92400e', // Maximum contrast
      900: '#78350f', // Ultra-deep
      950: '#451a03', // Absolute depth
    },

    // Error/Failed - Professional Red
    error: {
      25: '#fffbfb',
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Enterprise error
      600: '#dc2626', // Critical error
      700: '#b91c1c', // Deep error
      800: '#991b1b', // Professional depth
      900: '#7f1d1d', // Maximum contrast
      950: '#450a0a', // Ultra-deep
    },

    // Enterprise Purple - Premium Features
    purple: {
      25: '#fefbff',
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7', // Premium purple
      600: '#9333ea', // Enterprise premium
      700: '#7c3aed', // Deep premium
      800: '#6b21a8', // Professional depth
      900: '#581c87', // Maximum contrast
      950: '#3b0764', // Ultra-deep premium
    },

    // Enterprise Teal - Analytics & Data
    teal: {
      25: '#f6fefc',
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6', // Analytics teal
      600: '#0d9488', // Data visualization
      700: '#0f766e', // Deep analytics
      800: '#115e59', // Professional depth
      900: '#134e4a', // Maximum contrast
      950: '#042f2e', // Ultra-deep
    },

    // Neutral Grays - Enterprise Tone
    neutral: {
      25: '#fcfcfd',
      50: '#f9fafb',
      100: '#f2f4f7',
      200: '#eaecf0',
      300: '#d0d5dd',
      400: '#98a2b3',
      500: '#667085', // Professional neutral
      600: '#475467', // Enterprise contrast
      700: '#344054', // Deep neutral
      800: '#1d2939', // Maximum readability
      900: '#101828', // Ultra-deep
      950: '#0c111d', // Absolute depth
    },
  },

  // Enterprise Typography System
  typography: {
    fontFamily: {
      display: [
        '"Inter Display"',
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        'system-ui',
        'sans-serif',
      ],
      body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      mono: ['"JetBrains Mono"', '"SF Mono"', 'Monaco', 'Cascadia Code', 'monospace'],
      enterprise: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'], // For critical enterprise interfaces
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
      sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
      base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0em' }],
      lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
      xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.05em' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.05em' }],
      '5xl': ['3rem', { lineHeight: '3rem', letterSpacing: '-0.05em' }],
      '6xl': ['3.75rem', { lineHeight: '3.75rem', letterSpacing: '-0.075em' }],
      '7xl': ['4.5rem', { lineHeight: '4.5rem', letterSpacing: '-0.075em' }],
      '8xl': ['6rem', { lineHeight: '6rem', letterSpacing: '-0.075em' }],
      '9xl': ['8rem', { lineHeight: '8rem', letterSpacing: '-0.075em' }],
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  },

  // Enterprise Spacing System (4px base grid for precision)
  spacing: {
    px: '1px',
    0: '0rem',
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem', // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem', // 12px
    3.5: '0.875rem', // 14px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    7: '1.75rem', // 28px
    8: '2rem', // 32px
    9: '2.25rem', // 36px
    10: '2.5rem', // 40px
    11: '2.75rem', // 44px
    12: '3rem', // 48px
    14: '3.5rem', // 56px
    16: '4rem', // 64px
    18: '4.5rem', // 72px
    20: '5rem', // 80px
    24: '6rem', // 96px
    28: '7rem', // 112px
    32: '8rem', // 128px
    36: '9rem', // 144px
    40: '10rem', // 160px
    44: '11rem', // 176px
    48: '12rem', // 192px
    52: '13rem', // 208px
    56: '14rem', // 224px
    60: '15rem', // 240px
    64: '16rem', // 256px
    72: '18rem', // 288px
    80: '20rem', // 320px
    96: '24rem', // 384px
  },

  // Enterprise Border Radius System
  borderRadius: {
    none: '0',
    xs: '0.0625rem', // 1px - Minimal radius
    sm: '0.125rem', // 2px - Small elements
    DEFAULT: '0.25rem', // 4px - Standard radius
    md: '0.375rem', // 6px - Medium elements
    lg: '0.5rem', // 8px - Large elements
    xl: '0.75rem', // 12px - Extra large
    '2xl': '1rem', // 16px - Cards
    '3xl': '1.5rem', // 24px - Large cards
    '4xl': '2rem', // 32px - Hero elements
    full: '9999px', // Complete circle
  },

  // Enterprise Shadow System - Multi-layered depth
  boxShadow: {
    // Subtle shadows for minimal depth
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5)',
    '2xl': '0 50px 100px -20px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5)',

    // Inner shadows for depth
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    'inner-lg': 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.1)',

    // Enterprise Parscade Shadows with sophisticated layering
    'parscade-xs': '0 2px 4px rgba(14, 165, 233, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
    parscade:
      '0 4px 12px rgba(14, 165, 233, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(14, 165, 233, 0.04)',
    'parscade-md':
      '0 8px 24px rgba(14, 165, 233, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(14, 165, 233, 0.06)',
    'parscade-lg':
      '0 16px 48px rgba(14, 165, 233, 0.12), 0 8px 16px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(14, 165, 233, 0.08)',
    'parscade-xl':
      '0 32px 64px rgba(14, 165, 233, 0.15), 0 16px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(14, 165, 233, 0.1)',

    // Glow effects for premium features
    'glow-sm': '0 0 10px rgba(14, 165, 233, 0.3)',
    glow: '0 0 20px rgba(14, 165, 233, 0.4)',
    'glow-lg': '0 0 40px rgba(14, 165, 233, 0.5)',
    'glow-purple': '0 0 20px rgba(168, 85, 247, 0.4)',
    'glow-teal': '0 0 20px rgba(20, 184, 166, 0.4)',

    // Interactive shadows
    hover: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    focus: '0 0 0 2px rgba(14, 165, 233, 0.2), 0 0 0 4px rgba(14, 165, 233, 0.1)',

    // Specialized shadows
    card: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.08)',
    'card-hover': '0 12px 32px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
    modal: '0 20px 64px rgba(0, 0, 0, 0.2), 0 8px 32px rgba(0, 0, 0, 0.1)',
  },

  // Enterprise Animation System - Physics-based timing
  animation: {
    duration: {
      instant: '50ms', // Immediate feedback
      fast: '150ms', // Quick transitions
      normal: '200ms', // Standard interactions
      medium: '300ms', // Complex transitions
      slow: '500ms', // Layout changes
      slower: '700ms', // Hero animations
      slowest: '1000ms', // Loading states
    },
    easing: {
      // Standard cubic-bezier curves
      linear: 'cubic-bezier(0, 0, 1, 1)',
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

      // Enterprise custom easing - Sophisticated physics
      enterprise: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      subtle: 'cubic-bezier(0.33, 1, 0.68, 1)',
      smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      crisp: 'cubic-bezier(0.4, 0, 0.6, 1)',

      // Interactive element easing
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      back: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',

      // Specialized easing for different contexts
      modal: 'cubic-bezier(0.16, 1, 0.3, 1)',
      drawer: 'cubic-bezier(0.32, 0.72, 0, 1)',
      tooltip: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
  },
} as const;

// Enterprise Gradient System - Sophisticated multi-layer gradients
export const parscadeGradients = {
  // Primary brand gradients
  primary: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
  primaryVertical: 'linear-gradient(180deg, #0ea5e9 0%, #0284c7 100%)',
  primaryRadial: 'radial-gradient(ellipse at center, #0ea5e9 0%, #0284c7 100%)',

  // Secondary gradients
  secondary: 'linear-gradient(135deg, #64748b 0%, #475569 50%, #334155 100%)',
  secondaryVertical: 'linear-gradient(180deg, #64748b 0%, #475569 100%)',

  // Multi-color accent gradients
  accent: 'linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)',
  accentPurple: 'linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%)',
  accentTeal: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',

  // Status gradients
  success: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
  warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',

  // Neutral and surface gradients
  neutral: 'linear-gradient(135deg, #f9fafb 0%, #f2f4f7 50%, #eaecf0 100%)',
  surface: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',

  // Glass morphism effects
  glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
  glassBlue: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(14, 165, 233, 0.05) 100%)',
  glassPurple:
    'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)',
  glassTeal: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(20, 184, 166, 0.05) 100%)',

  // Glow and aura effects
  glow: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
  glowLarge:
    'radial-gradient(ellipse 120% 80% at center, rgba(14, 165, 233, 0.1) 0%, transparent 70%)',
  aura: 'conic-gradient(from 0deg at 50% 50%, rgba(14, 165, 233, 0.1) 0deg, transparent 60deg, rgba(14, 165, 233, 0.1) 120deg, transparent 180deg, rgba(14, 165, 233, 0.1) 240deg, transparent 300deg, rgba(14, 165, 233, 0.1) 360deg)',

  // Background patterns
  mesh: 'linear-gradient(135deg, rgba(14, 165, 233, 0.03) 0%, transparent 25%, rgba(14, 165, 233, 0.03) 50%, transparent 75%, rgba(14, 165, 233, 0.03) 100%)',
  heroBackground:
    'linear-gradient(135deg, rgba(14, 165, 233, 0.02) 0%, rgba(168, 85, 247, 0.02) 25%, rgba(20, 184, 166, 0.02) 50%, rgba(14, 165, 233, 0.02) 75%, transparent 100%)',

  // Interactive states
  hover: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)',
  focus: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(14, 165, 233, 0.1) 100%)',

  // Premium tier gradients
  premium: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #6b21a8 100%)',
  enterprise: 'linear-gradient(135deg, #0ea5e9 0%, #a855f7 25%, #14b8a6 50%, #0ea5e9 100%)',
} as const;

// Enterprise Component Variants - Sophisticated design patterns
export const parscadeVariants = {
  // Card variants with layered depth
  card: {
    default:
      'bg-white/96 backdrop-blur-sm border border-neutral-200/60 shadow-card hover:shadow-card-hover transition-all duration-200',
    elevated:
      'bg-white/98 backdrop-blur-md border border-neutral-200/40 shadow-parscade-md hover:shadow-parscade-lg transition-all duration-300',
    glass:
      'bg-white/70 backdrop-blur-xl border border-white/30 shadow-parscade-xs hover:shadow-parscade transition-all duration-200',
    gradient:
      'bg-gradient-to-br from-white via-primary-25/50 to-primary-50/30 border border-primary-200/40 shadow-parscade-xs hover:shadow-parscade-md transition-all duration-300',
    premium:
      'bg-gradient-to-br from-white via-purple-25/30 to-purple-50/20 border border-purple-200/40 shadow-glow-purple/20 hover:shadow-glow-purple/30 transition-all duration-300',
    enterprise:
      'bg-gradient-to-br from-white via-neutral-25 to-accent-25/40 border border-accent-200/30 shadow-parscade-md hover:shadow-parscade-lg transition-all duration-300',
  },

  // Button variants with sophisticated interactions
  button: {
    primary:
      'bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 hover:from-primary-700 hover:via-primary-600 hover:to-primary-700 active:from-primary-800 active:via-primary-700 active:to-primary-800 text-white shadow-parscade hover:shadow-parscade-md transition-all duration-200',
    secondary:
      'bg-gradient-to-r from-neutral-50 via-neutral-100 to-neutral-50 hover:from-neutral-100 hover:via-neutral-200 hover:to-neutral-100 active:from-neutral-200 active:via-neutral-300 active:to-neutral-200 text-neutral-800 border border-neutral-200 shadow-xs hover:shadow-sm transition-all duration-200',
    accent:
      'bg-gradient-to-r from-primary-500 via-teal-500 to-primary-500 hover:from-primary-600 hover:via-teal-600 hover:to-primary-600 active:from-primary-700 active:via-teal-700 active:to-primary-700 text-white shadow-parscade hover:shadow-parscade-md transition-all duration-200',
    premium:
      'bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 hover:from-purple-700 hover:via-purple-600 hover:to-purple-700 active:from-purple-800 active:via-purple-700 active:to-purple-800 text-white shadow-glow-purple hover:shadow-glow-purple/80 transition-all duration-200',
    ghost:
      'bg-transparent hover:bg-neutral-100/80 active:bg-neutral-200/80 text-neutral-700 hover:text-neutral-900 transition-all duration-150',
    outline:
      'bg-transparent hover:bg-primary-50/80 active:bg-primary-100/80 border border-primary-300 hover:border-primary-400 active:border-primary-500 text-primary-700 hover:text-primary-800 transition-all duration-200',
  },

  // Status indicators with enhanced visual hierarchy
  status: {
    processing:
      'bg-gradient-to-r from-primary-100/90 via-primary-50 to-primary-100/90 text-primary-800 border border-primary-200/60 shadow-xs backdrop-blur-sm',
    completed:
      'bg-gradient-to-r from-success-100/90 via-success-50 to-success-100/90 text-success-800 border border-success-200/60 shadow-xs backdrop-blur-sm',
    failed:
      'bg-gradient-to-r from-error-100/90 via-error-50 to-error-100/90 text-error-800 border border-error-200/60 shadow-xs backdrop-blur-sm',
    pending:
      'bg-gradient-to-r from-warning-100/90 via-warning-50 to-warning-100/90 text-warning-800 border border-warning-200/60 shadow-xs backdrop-blur-sm',
    draft:
      'bg-gradient-to-r from-neutral-100/90 via-neutral-50 to-neutral-100/90 text-neutral-700 border border-neutral-200/60 shadow-xs backdrop-blur-sm',
    archived:
      'bg-gradient-to-r from-accent-100/90 via-accent-50 to-accent-100/90 text-accent-700 border border-accent-200/60 shadow-xs backdrop-blur-sm',
  },

  // Input field variants
  input: {
    default:
      'bg-white/95 border border-neutral-300 hover:border-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200',
    error:
      'bg-white/95 border border-error-300 hover:border-error-400 focus:border-error-500 focus:ring-2 focus:ring-error-500/20 transition-all duration-200',
    success:
      'bg-white/95 border border-success-300 hover:border-success-400 focus:border-success-500 focus:ring-2 focus:ring-success-500/20 transition-all duration-200',
    premium:
      'bg-white/95 border border-purple-300 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200',
  },

  // Badge variants for feature tiers and notifications
  badge: {
    default: 'bg-neutral-100 text-neutral-800 border border-neutral-200',
    primary: 'bg-primary-100 text-primary-800 border border-primary-200',
    success: 'bg-success-100 text-success-800 border border-success-200',
    warning: 'bg-warning-100 text-warning-800 border border-warning-200',
    error: 'bg-error-100 text-error-800 border border-error-200',
    premium:
      'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300 shadow-glow-purple/10',
    enterprise:
      'bg-gradient-to-r from-primary-100 via-teal-100 to-primary-100 text-primary-800 border border-primary-200 shadow-parscade-xs',
  },
} as const;

// Enterprise Animation Presets - Physics-based sophisticated interactions
export const parscadeAnimations = {
  // Entry animations
  fadeInUp: {
    initial: { opacity: 0, y: 24, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -12, scale: 0.98 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -24, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 12, scale: 0.98 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  slideInRight: {
    initial: { opacity: 0, x: 32, scale: 0.96 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -16, scale: 0.98 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -32, scale: 0.96 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 16, scale: 0.98 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  // Interactive animations
  buttonPress: {
    whileHover: { scale: 1.02, y: -1 },
    whileTap: { scale: 0.98, y: 0 },
    transition: { duration: 0.15, ease: [0.4, 0, 0.6, 1] },
  },
  cardHover: {
    whileHover: {
      scale: 1.02,
      y: -4,
      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
    },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  iconBounce: {
    whileHover: { scale: 1.1, rotate: 5 },
    whileTap: { scale: 0.9, rotate: -5 },
    transition: { duration: 0.2, ease: [0.68, -0.55, 0.265, 1.55] },
  },

  // Continuous animations
  float: {
    animate: { y: [-6, 6, -6] },
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
  gentlePulse: {
    animate: { scale: [1, 1.02, 1], opacity: [1, 0.9, 1] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  spin: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: 'linear' },
  },
  bounce: {
    animate: { y: [0, -8, 0] },
    transition: { duration: 0.6, repeat: Infinity, ease: [0.68, -0.55, 0.265, 1.55] },
  },

  // Glow and highlight effects
  glow: {
    animate: {
      boxShadow: [
        '0 0 10px rgba(14, 165, 233, 0.3)',
        '0 0 20px rgba(14, 165, 233, 0.4)',
        '0 0 30px rgba(14, 165, 233, 0.5)',
        '0 0 20px rgba(14, 165, 233, 0.4)',
        '0 0 10px rgba(14, 165, 233, 0.3)',
      ],
    },
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  premiumGlow: {
    animate: {
      boxShadow: [
        '0 0 15px rgba(168, 85, 247, 0.3)',
        '0 0 25px rgba(168, 85, 247, 0.4)',
        '0 0 35px rgba(168, 85, 247, 0.5)',
        '0 0 25px rgba(168, 85, 247, 0.4)',
        '0 0 15px rgba(168, 85, 247, 0.3)',
      ],
    },
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  shimmer: {
    animate: {
      background: [
        'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      ],
      backgroundPosition: ['-200px 0', '200px 0'],
    },
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
  },

  // Loading states
  loadingPulse: {
    animate: { opacity: [0.5, 1, 0.5] },
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
  loadingBounce: {
    animate: { y: [0, -12, 0] },
    transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
  },

  // Modal and overlay animations
  modalBackdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  modalContent: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  drawerSlide: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
  },

  // Stagger animations for lists
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  },
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
} as const;

// Feature Module System Configuration
export const featureModules = {
  // Core modules always available
  core: ['dashboard', 'account', 'auth'],

  // Feature modules with role/tier requirements
  features: {
    documents: { roles: ['user', 'admin'], plans: ['free', 'standard', 'pro', 'enterprise'] },
    jobs: { roles: ['user', 'admin'], plans: ['free', 'standard', 'pro', 'enterprise'] },
    analytics: { roles: ['user', 'admin'], plans: ['pro', 'enterprise'] },
    workflows: { roles: ['user', 'admin'], plans: ['enterprise'] },
    integrations: { roles: ['user', 'admin'], plans: ['pro', 'enterprise'] },
    team: { roles: ['user', 'admin'], plans: ['pro', 'enterprise'] },
    billing: { roles: ['admin'], plans: ['free', 'standard', 'pro', 'enterprise'] },
    api: { roles: ['user', 'admin'], plans: ['pro', 'enterprise'] },
  },
} as const;

// Navigation Structure for Scalability
export const navigationStructure = {
  primary: [
    { id: 'command-centre-new', label: 'Command Centre', path: '/dashboard/command-centre', icon: 'Command', description: 'Enterprise control center with real-time insights' },
    { id: 'command-center', label: 'Dashboard', path: '/dashboard', icon: 'Home', description: 'Real-time processing overview' },
    { id: 'document-hub', label: 'Document Hub', path: '/dashboard/documents', icon: 'FileText', description: 'Manage all documents' },
    { id: 'processing-jobs', label: 'Processing Queue', path: '/dashboard/jobs', icon: 'Zap', description: 'Monitor active jobs' },
  ],

  analytics: [
    {
      id: 'processing-analytics',
      label: 'Processing Analytics',
      path: '/dashboard/analytics/processing',
      icon: 'BarChart3',
      tier: 'pro',
      description: 'Real-time throughput and performance metrics',
    },
    {
      id: 'business-intelligence',
      label: 'Business Intelligence',
      path: '/dashboard/analytics/business',
      icon: 'Brain',
      tier: 'pro',
      description: 'ROI tracking and cost analysis',
    },
    {
      id: 'performance-insights',
      label: 'Performance Insights',
      path: '/dashboard/analytics/performance',
      icon: 'TrendingUp',
      tier: 'enterprise',
      description: 'Advanced performance optimization',
    },
    {
      id: 'custom-reports',
      label: 'Custom Reports',
      path: '/dashboard/analytics/reports',
      icon: 'FileSpreadsheet',
      tier: 'enterprise',
      description: 'Automated reporting and insights',
    },
  ],

  processing: [
    {
      id: 'processing-rules',
      label: 'Processing Rules Engine',
      path: '/dashboard/processing/rules',
      icon: 'Settings2',
      tier: 'pro',
      description: 'Custom extraction rules and validation',
    },
    {
      id: 'document-templates',
      label: 'Document Templates',
      path: '/dashboard/processing/templates',
      icon: 'Layout',
      tier: 'pro',
      description: 'Template management for document types',
    },
    {
      id: 'parsing-config',
      label: 'Parsing Configuration',
      path: '/dashboard/processing/config',
      icon: 'Cpu',
      tier: 'enterprise',
      description: 'OCR settings and AI model configuration',
    },
    {
      id: 'quality-control',
      label: 'Quality Control',
      path: '/dashboard/processing/quality',
      icon: 'CheckCircle2',
      tier: 'pro',
      description: 'Manual review and validation queue',
    },
  ],

  integrations: [
    {
      id: 'api-management',
      label: 'API Management',
      path: '/dashboard/integrations/api',
      icon: 'Code2',
      tier: 'pro',
      description: 'Monitor endpoints and usage analytics',
    },
    {
      id: 'webhook-center',
      label: 'Webhook Center',
      path: '/dashboard/integrations/webhooks',
      icon: 'Webhook',
      tier: 'pro',
      description: 'Real-time event notifications',
    },
    {
      id: 'database-connectors',
      label: 'Database Connectors',
      path: '/dashboard/integrations/databases',
      icon: 'Database',
      tier: 'enterprise',
      description: 'Direct database integration and sync',
    },
    {
      id: 'cloud-storage',
      label: 'Cloud Storage',
      path: '/dashboard/integrations/storage',
      icon: 'Cloud',
      tier: 'pro',
      description: 'S3, Azure, GCP automated monitoring',
    },
  ],

  workflow: [
    {
      id: 'user-management',
      label: 'User Management',
      path: '/dashboard/workflow/users',
      icon: 'UserCog',
      tier: 'pro',
      description: 'Role-based permissions and access',
    },
    {
      id: 'approval-workflows',
      label: 'Approval Workflows',
      path: '/dashboard/workflow/approvals',
      icon: 'GitBranch',
      tier: 'enterprise',
      description: 'Document review and escalation',
    },
    {
      id: 'team-analytics',
      label: 'Team Analytics',
      path: '/dashboard/workflow/analytics',
      icon: 'Users',
      tier: 'pro',
      description: 'User activity and productivity metrics',
    },
    {
      id: 'training-center',
      label: 'Training Center',
      path: '/dashboard/workflow/training',
      icon: 'GraduationCap',
      tier: 'standard',
      description: 'User onboarding and best practices',
    },
  ],

  security: [
    {
      id: 'security-dashboard',
      label: 'Security Dashboard',
      path: '/dashboard/security/overview',
      icon: 'Shield',
      tier: 'enterprise',
      description: 'Encryption status and threat monitoring',
    },
    {
      id: 'compliance-center',
      label: 'Compliance Center',
      path: '/dashboard/security/compliance',
      icon: 'ScrollText',
      tier: 'enterprise',
      description: 'GDPR, HIPAA, SOX compliance tracking',
    },
    {
      id: 'audit-logs',
      label: 'Audit Logs',
      path: '/dashboard/security/audit',
      icon: 'FileSearch',
      tier: 'pro',
      description: 'Complete activity tracking and history',
    },
    {
      id: 'data-retention',
      label: 'Data Retention',
      path: '/dashboard/security/retention',
      icon: 'Archive',
      tier: 'enterprise',
      description: 'Automated policies and secure deletion',
    },
  ],

  admin: [
    {
      id: 'enterprise-console',
      label: 'Enterprise Console',
      path: '/dashboard/admin/console',
      icon: 'Crown',
      role: 'admin',
      description: 'Multi-tenant and resource management',
    },
    {
      id: 'billing-center',
      label: 'Billing Center',
      path: '/dashboard/admin/billing',
      icon: 'CreditCard',
      role: 'admin',
      description: 'Usage tracking and invoicing',
    },
    {
      id: 'system-health',
      label: 'System Health',
      path: '/dashboard/admin/health',
      icon: 'Activity',
      role: 'admin',
      description: 'Infrastructure monitoring',
    },
  ],

  account: [
    { id: 'profile', label: 'Profile Settings', path: '/account/profile', icon: 'User', description: 'Personal information and preferences' },
    { id: 'security', label: 'Security Settings', path: '/account/security', icon: 'Lock', description: 'Password and authentication' },
    { id: 'notifications', label: 'Notification Settings', path: '/account/notifications', icon: 'Bell', description: 'Email and alert preferences' },
    { id: 'api-keys', label: 'API Keys', path: '/account/api-keys', icon: 'Key', tier: 'pro', description: 'Manage API authentication' },
    { id: 'usage-billing', label: 'Usage & Billing', path: '/account/billing', icon: 'Receipt', description: 'View usage and manage subscription' },
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
