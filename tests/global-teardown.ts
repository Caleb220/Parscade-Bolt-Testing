/**
 * Global Teardown for Playwright Tests
 * Handles cleanup after all tests complete
 */

import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...');

  // Clean up auth state files
  await cleanupAuthStates();

  // Clean up any test data
  await cleanupTestData();

  console.log('✅ Global test teardown completed');
}

/**
 * Clean up authentication state files
 */
async function cleanupAuthStates() {
  const authStatesDir = 'tests/auth-states';

  try {
    if (fs.existsSync(authStatesDir)) {
      const files = fs.readdirSync(authStatesDir);
      for (const file of files) {
        fs.unlinkSync(path.join(authStatesDir, file));
      }
      fs.rmdirSync(authStatesDir);
      console.log('🗑️ Cleaned up auth state files');
    }
  } catch (error) {
    console.warn('⚠️ Could not clean up auth states:', error);
  }
}

/**
 * Clean up test data
 */
async function cleanupTestData() {
  // In a real application, you might:
  // - Clean up test database records
  // - Reset mock API states
  // - Clear temporary files
  console.log('🗃️ Cleaning up test data...');
}

export default globalTeardown;