/**
 * Comprehensive Route Integration Tests
 * Tests all routes for proper navigation, content, and error handling
 */

import { test, expect, Page } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

// Mock user credentials for testing
const TEST_USER = {
  email: 'test@parscade.com',
  password: 'TestPassword123!',
};

const ADMIN_USER = {
  email: 'admin@parscade.com',
  password: 'AdminPassword123!',
};

/**
 * Helper function to authenticate a user
 */
async function authenticateUser(page: Page, user: typeof TEST_USER) {
  await page.goto(`${BASE_URL}/`);

  // Click sign in button (assuming modal-based auth)
  await page.click('[data-testid="sign-in-button"]');

  // Fill in credentials
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for navigation to dashboard
  await page.waitForURL('**/dashboard');
}

/**
 * Helper function to check page title and meta tags
 */
async function checkPageMeta(page: Page, expectedTitle: string) {
  const title = await page.title();
  expect(title).toContain(expectedTitle);

  // Check for basic meta tags
  const description = await page.getAttribute('meta[name="description"]', 'content');
  expect(description).toBeTruthy();
}

test.describe('Public Routes', () => {
  test('Home page loads correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    await checkPageMeta(page, 'Parscade');

    // Check for main navigation
    await expect(page.locator('nav')).toBeVisible();

    // Check for hero section
    await expect(page.locator('h1')).toBeVisible();

    // Check for call-to-action buttons
    await expect(page.locator('[data-testid*="cta"]')).toBeVisible();

    // Ensure no console errors
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleLogs.push(msg.text());
    });
    await page.waitForTimeout(1000);
    expect(consoleLogs).toHaveLength(0);
  });

  test('About page loads and has proper content', async ({ page }) => {
    await page.goto(`${BASE_URL}/about`);

    await checkPageMeta(page, 'About');
    await expect(page.locator('h1')).toContainText('About');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('Product page loads and has proper content', async ({ page }) => {
    await page.goto(`${BASE_URL}/product`);

    await checkPageMeta(page, 'Product');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('Billing page loads and has proper content', async ({ page }) => {
    await page.goto(`${BASE_URL}/billing`);

    await checkPageMeta(page, 'Billing');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('Contact page loads and has contact form', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);

    await checkPageMeta(page, 'Contact');
    await expect(page.locator('h1')).toContainText('Contact');
    await expect(page.locator('form')).toBeVisible();
  });

  test('Privacy page loads with policy content', async ({ page }) => {
    await page.goto(`${BASE_URL}/privacy`);

    await checkPageMeta(page, 'Privacy');
    await expect(page.locator('h1')).toContainText('Privacy');
  });

  test('Terms page loads with terms content', async ({ page }) => {
    await page.goto(`${BASE_URL}/terms`);

    await checkPageMeta(page, 'Terms');
    await expect(page.locator('h1')).toContainText('Terms');
  });

  test('Login support page loads correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/support/login`);

    await checkPageMeta(page, 'Login Support');
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Authentication Flow', () => {
  test('Auth modal opens and closes properly', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Open sign in modal
    await page.click('[data-testid="sign-in-button"]');
    await expect(page.locator('[data-testid="auth-modal"]')).toBeVisible();

    // Close modal
    await page.click('[data-testid="close-modal"]');
    await expect(page.locator('[data-testid="auth-modal"]')).not.toBeVisible();
  });

  test('Can switch between sign in and sign up modes', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    await page.click('[data-testid="sign-in-button"]');
    await expect(page.locator('text=Sign In')).toBeVisible();

    // Switch to sign up
    await page.click('text=Sign up');
    await expect(page.locator('text=Create Account')).toBeVisible();

    // Switch back to sign in
    await page.click('text=Sign in');
    await expect(page.locator('text=Sign In')).toBeVisible();
  });
});

test.describe('Protected Routes - User Access', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateUser(page, TEST_USER);
  });

  test('Dashboard overview loads for authenticated user', async ({ page }) => {
    await expect(page).toHaveURL('**/dashboard');
    await checkPageMeta(page, 'Dashboard');

    // Check for dashboard components
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
  });

  test('Documents page loads correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/documents`);

    await checkPageMeta(page, 'Documents');
    await expect(page.locator('h1')).toContainText('Documents');
  });

  test('Jobs page loads correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/jobs`);

    await checkPageMeta(page, 'Jobs');
    await expect(page.locator('h1')).toContainText('Jobs');
  });

  test('Analytics page loads with proper feature gate', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/analytics`);

    await checkPageMeta(page, 'Analytics');
    await expect(page.locator('h1')).toContainText('Analytics');

    // Should show either content or upgrade prompt based on user tier
    const hasContent = await page.locator('[data-testid="analytics-content"]').isVisible();
    const hasUpgrade = await page.locator('text=Upgrade to Pro').isVisible();
    expect(hasContent || hasUpgrade).toBeTruthy();
  });

  test('Workflows page loads with enterprise gate', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/workflows`);

    await checkPageMeta(page, 'Workflows');
    await expect(page.locator('h1')).toContainText('Workflows');

    // Should show enterprise upgrade for non-enterprise users
    await expect(page.locator('text=Upgrade to Enterprise')).toBeVisible();
  });

  test('Integrations page loads correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/integrations`);

    await checkPageMeta(page, 'Integrations');
    await expect(page.locator('h1')).toContainText('Integrations');
  });

  test('Account pages load correctly', async ({ page }) => {
    // Profile tab
    await page.goto(`${BASE_URL}/account`);
    await expect(page.locator('h1')).toContainText('Account');

    // Security tab
    await page.goto(`${BASE_URL}/account/security`);
    await expect(page.locator('[data-testid="security-settings"]')).toBeVisible();

    // Notifications tab
    await page.goto(`${BASE_URL}/account/notifications`);
    await expect(page.locator('[data-testid="notification-settings"]')).toBeVisible();

    // Integrations tab
    await page.goto(`${BASE_URL}/account/integrations`);
    await expect(page.locator('[data-testid="integration-settings"]')).toBeVisible();

    // API keys tab (should show upgrade prompt for non-pro users)
    await page.goto(`${BASE_URL}/account/api`);
    const hasApiContent = await page.locator('[data-testid="api-keys"]').isVisible();
    const hasUpgrade = await page.locator('text=Upgrade to Pro').isVisible();
    expect(hasApiContent || hasUpgrade).toBeTruthy();
  });
});

test.describe('Protected Routes - Admin Access', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateUser(page, ADMIN_USER);
  });

  test('Team management page loads for admin', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/team`);

    await checkPageMeta(page, 'Team');
    await expect(page.locator('h1')).toContainText('Team');
    await expect(page.locator('[data-testid="team-members"]')).toBeVisible();
  });

  test('Dashboard billing page loads for admin', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/billing`);

    await checkPageMeta(page, 'Billing');
    await expect(page.locator('h1')).toContainText('Billing');
    await expect(page.locator('[data-testid="billing-info"]')).toBeVisible();
  });
});

test.describe('Dynamic Routes', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateUser(page, TEST_USER);
  });

  test('Document detail page handles valid document ID', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/documents/test-doc-123`);

    // Should either load document or show not found
    const hasDocument = await page.locator('[data-testid="document-content"]').isVisible();
    const hasNotFound = await page.locator('text=Document not found').isVisible();
    expect(hasDocument || hasNotFound).toBeTruthy();
  });

  test('Project detail page handles valid project ID', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/projects/test-project-456`);

    const hasProject = await page.locator('[data-testid="project-content"]').isVisible();
    const hasNotFound = await page.locator('text=Project not found').isVisible();
    expect(hasProject || hasNotFound).toBeTruthy();
  });

  test('Job detail page handles valid job ID', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/jobs/test-job-789`);

    const hasJob = await page.locator('[data-testid="job-content"]').isVisible();
    const hasNotFound = await page.locator('text=Job not found').isVisible();
    expect(hasJob || hasNotFound).toBeTruthy();
  });
});

test.describe('Error Handling', () => {
  test('404 page loads for invalid routes', async ({ page }) => {
    await page.goto(`${BASE_URL}/non-existent-route`);

    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.locator('text=Page Not Found')).toBeVisible();

    // Check navigation options
    await expect(page.locator('text=Go Home')).toBeVisible();
    await expect(page.locator('text=Go Back')).toBeVisible();
    await expect(page.locator('text=Contact Support')).toBeVisible();
  });

  test('Error page loads correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/error`);

    await expect(page.locator('[data-testid="error-page"]')).toBeVisible();
  });

  test('404 page navigation works', async ({ page }) => {
    await page.goto(`${BASE_URL}/non-existent-route`);

    // Test "Go Home" button
    await page.click('text=Go Home');
    await expect(page).toHaveURL(BASE_URL + '/');
  });
});

test.describe('Navigation Flow', () => {
  test('Navigation links work correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Test navigation to different pages
    await page.click('text=Product');
    await expect(page).toHaveURL('**/product');

    await page.click('text=About');
    await expect(page).toHaveURL('**/about');

    await page.click('text=Contact');
    await expect(page).toHaveURL('**/contact');

    // Return to home
    await page.click('[data-testid="logo"]');
    await expect(page).toHaveURL(BASE_URL + '/');
  });

  test('Dashboard sidebar navigation works', async ({ page }) => {
    await authenticateUser(page, TEST_USER);

    // Test sidebar navigation
    await page.click('[data-testid="nav-documents"]');
    await expect(page).toHaveURL('**/dashboard/documents');

    await page.click('[data-testid="nav-jobs"]');
    await expect(page).toHaveURL('**/dashboard/jobs');

    await page.click('[data-testid="nav-overview"]');
    await expect(page).toHaveURL('**/dashboard');
  });
});

test.describe('Unauthenticated Access', () => {
  test('Protected routes redirect to home when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);

    // Should redirect to home page
    await expect(page).toHaveURL(BASE_URL + '/');
  });

  test('Account routes redirect when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/account`);

    // Should redirect to home page
    await expect(page).toHaveURL(BASE_URL + '/');
  });
});

test.describe('Performance and Accessibility', () => {
  test('Pages load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(`${BASE_URL}/`);
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000); // 3 seconds max
  });

  test('Basic accessibility checks', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Check for proper heading hierarchy
    const h1 = await page.locator('h1').count();
    expect(h1).toBeGreaterThan(0);

    // Check for alt text on images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }

    // Check for proper focus management
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus').count();
    expect(focusedElement).toBeGreaterThan(0);
  });
});