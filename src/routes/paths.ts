/**
 * Centralized routing paths for the application.
 * Single source of truth for all route definitions.
 */

export const PATHS = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ACCOUNT: '/account',
  BILLING: '/billing',
  CONTACT: '/contact',
  ABOUT: '/about',
  PRODUCT: '/product',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  LOGIN_SUPPORT: '/login-support',
  NOT_FOUND: '/404',
  ERROR: '/error',
} as const;

export const AUTH_PATHS = {
  LOGOUT_REDIRECT: `${PATHS.HOME}`,
  RESET_PASSWORD: '/reset-password',
  AUTH_RECOVERY: '/auth/recovery',
  FORGOT_PASSWORD: '/forgot-password',
} as const;

export type AppPath = typeof PATHS[keyof typeof PATHS];
export type AuthPath = typeof AUTH_PATHS[keyof typeof AUTH_PATHS];