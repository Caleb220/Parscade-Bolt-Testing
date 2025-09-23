/**
 * Global Setup for Playwright Tests
 * Handles global test preparation and authentication setup
 */

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');

  // Setup mock data or test database if needed
  await setupTestData();

  // Optionally authenticate users for state reuse
  await setupAuthenticatedUsers();

  console.log('✅ Global test setup completed');
}

/**
 * Setup test data for route testing
 */
async function setupTestData() {
  // In a real application, you might:
  // - Seed a test database
  // - Create test users
  // - Set up mock API responses
  console.log('📊 Setting up test data...');

  // For now, we'll use localStorage mock data
  // This would be replaced with actual API calls or database seeding
}

/**
 * Pre-authenticate users to speed up tests
 */
async function setupAuthenticatedUsers() {
  console.log('🔐 Setting up authenticated user sessions...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Setup authentication states for different user types
    const baseUrl = process.env.BASE_URL || 'http://localhost:5173';

    // Standard user session
    await page.goto(baseUrl);
    await page.addInitScript(() => {
      localStorage.setItem('parscade_auth_standard', JSON.stringify({
        user: {
          id: 'test-standard-user',
          email: 'user@parscade.com',
          role: 'user',
          tier: 'free',
          isEmailConfirmed: true,
        },
        token: 'mock-standard-token',
        isAuthenticated: true,
      }));
    });
    await page.context().storageState({ path: 'tests/auth-states/standard-user.json' });

    // Pro user session
    await page.goto(baseUrl);
    await page.addInitScript(() => {
      localStorage.setItem('parscade_auth_pro', JSON.stringify({
        user: {
          id: 'test-pro-user',
          email: 'pro@parscade.com',
          role: 'user',
          tier: 'pro',
          isEmailConfirmed: true,
        },
        token: 'mock-pro-token',
        isAuthenticated: true,
      }));
    });
    await page.context().storageState({ path: 'tests/auth-states/pro-user.json' });

    // Admin user session
    await page.goto(baseUrl);
    await page.addInitScript(() => {
      localStorage.setItem('parscade_auth_admin', JSON.stringify({
        user: {
          id: 'test-admin-user',
          email: 'admin@parscade.com',
          role: 'admin',
          tier: 'pro',
          isEmailConfirmed: true,
        },
        token: 'mock-admin-token',
        isAuthenticated: true,
      }));
    });
    await page.context().storageState({ path: 'tests/auth-states/admin-user.json' });

  } catch (error) {
    console.warn('⚠️ Could not setup pre-authenticated sessions:', error);
  } finally {
    await browser.close();
  }
}

export default globalSetup;