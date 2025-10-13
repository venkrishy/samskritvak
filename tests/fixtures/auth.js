import { test as base } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Authentication fixtures for Playwright tests
 * 
 * Usage:
 * - Use `test.use({ storageState: 'tests/fixtures/auth.json' })` for authenticated tests
 * - Use `test.use({ storageState: { cookies: [], origins: [] } })` for unauthenticated tests
 */

export const test = base.extend({
  // Authenticated user state
  authenticatedUser: async ({ browser }, use) => {
    const authFile = path.join(__dirname, 'auth.json');
    
    // Check if auth file exists, if not create a basic context
    if (fs.existsSync(authFile)) {
      const context = await browser.newContext({
        storageState: authFile
      });
      const page = await context.newPage();
      await use(page);
      await context.close();
    } else {
      // Fallback: create a new context without auth state
      // This will work for tests that don't require authentication
      const context = await browser.newContext();
      const page = await context.newPage();
      await use(page);
      await context.close();
    }
  },

  // Unauthenticated user state
  unauthenticatedUser: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] }
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  }
});

export { expect } from '@playwright/test';

/**
 * Helper function to check if user is authenticated
 */
export async function isAuthenticated(page) {
  try {
    // Check if we're on dashboard (authenticated) or home (unauthenticated)
    const currentUrl = page.url();
    return currentUrl.includes('/dashboard') || currentUrl.includes('/curriculum');
  } catch (error) {
    return false;
  }
}

/**
 * Helper function to wait for authentication state
 */
export async function waitForAuthState(page, expectedState = 'authenticated') {
  if (expectedState === 'authenticated') {
    await page.waitForURL(/\/dashboard|\/curriculum/, { timeout: 10000 });
  } else {
    await page.waitForURL(/\/$/, { timeout: 10000 });
  }
}

/**
 * Helper function to navigate to a lesson page
 */
export async function navigateToLesson(page, chapterNumber, lessonNumber) {
  const lessonPath = `/0${chapterNumber}-${getChapterSlug(chapterNumber)}/${getLessonSlug(lessonNumber)}`;
  await page.goto(lessonPath);
  await page.waitForLoadState('networkidle');
}

/**
 * Helper function to get chapter slug from chapter number
 */
function getChapterSlug(chapterNumber) {
  const chapterSlugs = {
    1: 'getting-started',
    2: 'existence-identification', 
    3: 'location',
    4: 'actions',
    5: 'plurals',
    6: 'directions',
    7: 'tool-role',
    8: 'ownership',
    9: 'tenses',
    10: 'adjectives',
    11: 'time-numbers',
    12: 'complex-sentences',
    13: 'advanced-verbs',
    14: 'complex-dialogue'
  };
  return chapterSlugs[chapterNumber] || 'unknown';
}

/**
 * Helper function to get lesson slug from lesson number
 */
function getLessonSlug(lessonNumber) {
  const lessonSlugs = {
    1: 'greetings-identity',
    2: 'masculine-name',
    3: 'feminine-name',
    4: 'who-what',
    5: 'yes-no',
    6: 'daily-items'
  };
  return lessonSlugs[lessonNumber] || 'unknown';
}
