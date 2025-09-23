/**
 * Authentication Helper Functions for Testing
 * Utilities for handling authentication in Playwright tests
 */

import { Page, expect } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
  role?: 'user' | 'admin';
  tier?: 'free' | 'pro' | 'enterprise';
}

export const TEST_USERS = {
  STANDARD_USER: {
    email: 'user@parscade.com',
    password: 'UserPassword123!',
    role: 'user' as const,
    tier: 'free' as const,
  },
  PRO_USER: {
    email: 'pro@parscade.com',
    password: 'ProPassword123!',
    role: 'user' as const,
    tier: 'pro' as const,
  },
  ENTERPRISE_USER: {
    email: 'enterprise@parscade.com',
    password: 'EnterprisePassword123!',
    role: 'user' as const,
    tier: 'enterprise' as const,
  },
  ADMIN_USER: {
    email: 'admin@parscade.com',
    password: 'AdminPassword123!',
    role: 'admin' as const,
    tier: 'pro' as const,
  },
} as const;

/**
 * Authenticate a user via the modal-based auth system
 */
export async function authenticateUser(page: Page, user: TestUser) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5173';

  await page.goto(baseUrl);

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Open authentication modal
  try {
    // Try to find sign in button in navigation
    const signInButton = page.locator('[data-testid="sign-in-button"], button:has-text("Sign In")').first();
    await signInButton.click({ timeout: 5000 });
  } catch {
    // Fallback if button not found - look for any sign in trigger
    await page.click('text=Sign In');
  }

  // Wait for modal to appear
  await page.waitForSelector('[data-testid="auth-modal"], [role="dialog"]', { timeout: 5000 });

  // Fill in credentials
  await page.fill('input[type="email"], input[name="email"]', user.email);
  await page.fill('input[type="password"], input[name="password"]', user.password);

  // Submit the form
  await page.click('button[type="submit"], button:has-text("Sign In")');

  // Wait for successful authentication
  await page.waitForURL('**/dashboard', { timeout: 10000 });

  // Verify we're authenticated
  await expect(page.locator('[data-testid="user-menu"], [data-testid="sidebar"]')).toBeVisible();
}

/**
 * Log out the current user
 */
export async function logoutUser(page: Page) {
  try {
    // Click user menu
    await page.click('[data-testid="user-menu"]');

    // Click logout
    await page.click('text=Logout, text=Sign Out');

    // Wait for redirect to home
    await page.waitForURL('**/');
  } catch {
    // Fallback - navigate to home and clear storage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    const userMenu = await page.locator('[data-testid="user-menu"]').isVisible();
    const sidebar = await page.locator('[data-testid="sidebar"]').isVisible();
    return userMenu || sidebar;
  } catch {
    return false;
  }
}

/**
 * Mock authentication for testing without real credentials
 */
export async function mockAuthentication(page: Page, user: TestUser) {
  // Set mock authentication in localStorage
  await page.addInitScript((userData) => {
    localStorage.setItem('parscade_auth', JSON.stringify({
      user: {
        id: 'test-user-id',
        email: userData.email,
        role: userData.role || 'user',
        tier: userData.tier || 'free',
        isEmailConfirmed: true,
      },
      token: 'mock-jwt-token',
      isAuthenticated: true,
    }));
  }, user);

  // Navigate to dashboard
  const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
  await page.goto(`${baseUrl}/dashboard`);
}

/**
 * Wait for authentication to complete
 */
export async function waitForAuth(page: Page, timeout = 10000) {
  await page.waitForFunction(() => {
    const auth = localStorage.getItem('parscade_auth');
    return auth && JSON.parse(auth).isAuthenticated === true;
  }, { timeout });
}

/**
 * Clear authentication state
 */
export async function clearAuth(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem('parscade_auth');
    sessionStorage.clear();
  });
}

/**
 * Set user role/tier for testing feature gates
 */
export async function setUserTier(page: Page, tier: 'free' | 'pro' | 'enterprise') {
  await page.evaluate((userTier) => {
    const auth = localStorage.getItem('parscade_auth');
    if (auth) {
      const authData = JSON.parse(auth);
      authData.user.tier = userTier;
      localStorage.setItem('parscade_auth', JSON.stringify(authData));
    }
  }, tier);
}

/**
 * Assert user has required access level
 */
export async function assertUserAccess(page: Page, requiredTier?: string, requiredRole?: string) {
  if (requiredTier) {
    const tier = await page.evaluate(() => {
      const auth = localStorage.getItem('parscade_auth');
      return auth ? JSON.parse(auth).user.tier : null;
    });

    if (requiredTier === 'pro' && tier === 'free') {
      await expect(page.locator('text=Upgrade to Pro')).toBeVisible();
    } else if (requiredTier === 'enterprise' && tier !== 'enterprise') {
      await expect(page.locator('text=Upgrade to Enterprise')).toBeVisible();
    }
  }

  if (requiredRole === 'admin') {
    const role = await page.evaluate(() => {
      const auth = localStorage.getItem('parscade_auth');
      return auth ? JSON.parse(auth).user.role : null;
    });

    if (role !== 'admin') {
      await expect(page.locator('text=Admin Access Required')).toBeVisible();
    }
  }
}