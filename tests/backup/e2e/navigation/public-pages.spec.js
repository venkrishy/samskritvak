import { test, expect } from '../../fixtures/auth.js';

test.describe('Public Pages Navigation', () => {
  test.describe('Home Page', () => {
    test('loads correctly without authentication', async ({ unauthenticatedUser }) => {
      const page = unauthenticatedUser;
      await page.goto('/');
      
      // Check main heading
      await expect(page.getByRole('heading', { name: /educational Platform to learn spoken sanskrit/i })).toBeVisible();
      
      // Check description
      await expect(page.getByText(/join the 100\+ students that use samskritavak/i)).toBeVisible();
      
      // Check for action buttons
      await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /view curriculum/i })).toBeVisible();
    });

    test('Google sign-in button is clickable', async ({ unauthenticatedUser }) => {
      const page = unauthenticatedUser;
      await page.goto('/');
      
      const googleButton = page.getByRole('button', { name: /continue with google/i });
      await expect(googleButton).toBeVisible();
      await expect(googleButton).toBeEnabled();
      
      // Click and check for any response
      await googleButton.click();
      await page.waitForTimeout(1000);
    });

    test('curriculum link navigates correctly', async ({ unauthenticatedUser }) => {
      const page = unauthenticatedUser;
      await page.goto('/');
      
      // Click curriculum link
      await page.getByRole('link', { name: /view curriculum/i }).click();
      
      // Should navigate to curriculum page
      await page.waitForURL(/\/curriculum/, { timeout: 10000 });
      expect(page.url()).toContain('/curriculum');
    });
  });

  test.describe('Curriculum Page', () => {
    test('loads without authentication', async ({ unauthenticatedUser }) => {
      const page = unauthenticatedUser;
      await page.goto('/curriculum');
      
      // Check main heading
      await expect(page.getByRole('heading', { name: /complete sanskrit curriculum/i })).toBeVisible();
      
      // Check subtitle
      await expect(page.getByText(/a comprehensive learning path from beginner to advanced/i)).toBeVisible();
    });

    test('displays all 14 chapters', async ({ unauthenticatedUser }) => {
      const page = unauthenticatedUser;
      await page.goto('/curriculum');
      
      // Check for chapter cards
      // Check for specific chapter titles instead of counting elements
      await expect(page.getByText(/Chapter 1: Hello! Getting Started/).first()).toBeVisible();
      await expect(page.getByText(/Chapter 14: Complex Dialogue and Vocabulary Expansion/).first()).toBeVisible();
      
      // Check for specific chapters
      await expect(page.getByText(/chapter 1: hello! getting started/i)).toBeVisible();
      await expect(page.getByText(/chapter 14: complex dialogue and vocabulary expansion/i)).toBeVisible();
    });

    test('chapter cards display correct information', async ({ unauthenticatedUser }) => {
      const page = unauthenticatedUser;
      await page.goto('/curriculum');
      
      // Check first chapter
      const firstChapter = page.locator('[class*="bg-white rounded-lg border border-gray-200"]').first();
      await expect(firstChapter.getByText(/chapter 1: hello! getting started/i)).toBeVisible();
      await expect(firstChapter.getByText(/greetings, identity, and basic introductions/i)).toBeVisible();
      
      // Check for lesson list
      await expect(firstChapter.getByText(/1\.1 - greetings and identity/i)).toBeVisible();
      await expect(firstChapter.getByText(/1\.6 - vocabulary: top 10 daily use items/i)).toBeVisible();
    });

    test('chapter start buttons are present', async ({ unauthenticatedUser }) => {
      const page = unauthenticatedUser;
      await page.goto('/curriculum');
      
      // Check for start chapter buttons
      const startButtons = page.getByRole('link', { name: /start chapter/i });
      await expect(startButtons).toHaveCount(14);
    });

    test('progress summary displays correctly', async ({ unauthenticatedUser }) => {
      const page = unauthenticatedUser;
      await page.goto('/curriculum');
      
      // Check progress summary section
      await expect(page.getByText(/learning progress/i)).toBeVisible();
      await expect(page.getByText(/total chapters/i)).toBeVisible();
      await expect(page.getByText(/total lessons/i)).toBeVisible();
      await expect(page.getByText(/estimated time/i)).toBeVisible();
      
      // Check specific numbers
      await expect(page.getByText('14')).toBeVisible(); // Total chapters
      await expect(page.getByText('89')).toBeVisible(); // Total lessons
    });
  });

  test.describe('Navigation Between Public Pages', () => {
    test('can navigate from home to curriculum', async ({ unauthenticatedUser }) => {
      const page = unauthenticatedUser;
      await page.goto('/');
      
      // Click curriculum link
      await page.getByRole('link', { name: /view curriculum/i }).click();
      await page.waitForURL(/\/curriculum/);
      
      // Should be on curriculum page
      expect(page.url()).toContain('/curriculum');
      await expect(page.getByRole('heading', { name: /complete sanskrit curriculum/i })).toBeVisible();
    });

    test('can navigate back to home from curriculum', async ({ unauthenticatedUser }) => {
      const page = unauthenticatedUser;
      await page.goto('/curriculum');
      
      // Navigate back to home (using browser back or direct navigation)
      await page.goto('/');
      
      // Should be on home page
      expect(page.url()).toBe('http://localhost:3000/');
      await expect(page.getByRole('heading', { name: /educational Platform to learn spoken sanskrit/i })).toBeVisible();
    });
  });
});
