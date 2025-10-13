import { test, expect } from '../../fixtures/auth.js';

test.describe('Cross-Chapter Navigation', () => {
  test.describe('Boundary Navigation', () => {
    test('navigating from last lesson of chapter to first lesson of next chapter', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at last lesson of Chapter 1
      await page.goto('/01-getting-started/daily-items');
      expect(page.url()).toContain('/daily-items');
      
      // Navigate to next chapter (should go to first lesson of Chapter 2)
      await page.getByRole('button', { name: /next chapter/i }).click();
      await page.waitForURL(/\/02-existence-identification/, { timeout: 10000 });
      expect(page.url()).toContain('/02-existence-identification');
      
      // Should be on first lesson of Chapter 2
      await expect(page.getByText(/lesson 1 of 6/i)).toBeVisible();
    });

    test('navigating from first lesson of chapter to last lesson of previous chapter', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at first lesson of Chapter 2
      await page.goto('/02-existence-identification/existence');
      expect(page.url()).toContain('/existence');
      
      // Navigate to previous chapter (should go to last lesson of Chapter 1)
      await page.getByRole('button', { name: /prev chapter/i }).click();
      await page.waitForURL(/\/01-getting-started/, { timeout: 10000 });
      expect(page.url()).toContain('/01-getting-started');
      
      // Should be on last lesson of Chapter 1
      await expect(page.getByText(/lesson 6 of 6/i)).toBeVisible();
    });
  });

  test.describe('Cross-Chapter Lesson Navigation', () => {
    test('lesson navigation works across chapter boundaries', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at last lesson of Chapter 1
      await page.goto('/01-getting-started/daily-items');
      
      // Use lesson navigation to go to next lesson (should cross chapter boundary)
      await page.getByRole('button', { name: /next/i }).click();
      await page.waitForURL(/\/02-existence-identification/, { timeout: 10000 });
      expect(page.url()).toContain('/02-existence-identification');
      
      // Should be on first lesson of Chapter 2
      await expect(page.getByText(/lesson 1 of 6/i)).toBeVisible();
    });

    test('lesson navigation preserves chapter context when crossing boundaries', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at first lesson of Chapter 2
      await page.goto('/02-existence-identification/existence');
      
      // Navigate to previous lesson (should go to last lesson of Chapter 1)
      await page.getByRole('button', { name: /previous/i }).click();
      await page.waitForURL(/\/01-getting-started/, { timeout: 10000 });
      expect(page.url()).toContain('/01-getting-started');
      
      // Should be on last lesson of Chapter 1
      await expect(page.getByText(/lesson 6 of 6/i)).toBeVisible();
    });
  });

  test.describe('Chapter Navigation Updates', () => {
    test('chapter navigation updates when crossing chapter boundaries', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at Chapter 1
      await page.goto('/01-getting-started/greetings-identity');
      await expect(page.getByText(/chapter 1/i)).toBeVisible();
      
      // Navigate to Chapter 2
      await page.getByRole('button', { name: /next chapter/i }).click();
      await page.waitForURL(/\/02-existence-identification/, { timeout: 10000 });
      
      // Check that chapter information has updated
      await expect(page.getByText(/chapter 2/i)).toBeVisible();
    });

    test('chapter navigation buttons update correctly at boundaries', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Test at Chapter 1 (first chapter)
      await page.goto('/01-getting-started/greetings-identity');
      
      // Prev chapter should not be visible or disabled
      const prevChapterButton = page.getByRole('button', { name: /prev chapter/i });
      const isPrevVisible = await prevChapterButton.isVisible();
      if (isPrevVisible) {
        await expect(prevChapterButton).toBeDisabled();
      }
      
      // Next chapter should be visible and enabled
      const nextChapterButton = page.getByRole('button', { name: /next chapter/i });
      await expect(nextChapterButton).toBeVisible();
      await expect(nextChapterButton).toBeEnabled();
      
      // Navigate to Chapter 2
      await nextChapterButton.click();
      await page.waitForURL(/\/02-existence-identification/, { timeout: 10000 });
      
      // Now both buttons should be visible and enabled
      const prevChapterButton2 = page.getByRole('button', { name: /prev chapter/i });
      const nextChapterButton2 = page.getByRole('button', { name: /next chapter/i });
      
      await expect(prevChapterButton2).toBeVisible();
      await expect(prevChapterButton2).toBeEnabled();
      await expect(nextChapterButton2).toBeVisible();
      await expect(nextChapterButton2).toBeEnabled();
    });
  });

  test.describe('URL Updates', () => {
    test('URL updates correctly when crossing chapter boundaries', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at Chapter 1
      await page.goto('/01-getting-started/greetings-identity');
      expect(page.url()).toContain('/01-getting-started');
      
      // Navigate to Chapter 2
      await page.getByRole('button', { name: /next chapter/i }).click();
      await page.waitForURL(/\/02-existence-identification/, { timeout: 10000 });
      expect(page.url()).toContain('/02-existence-identification');
      
      // Navigate back to Chapter 1
      await page.getByRole('button', { name: /prev chapter/i }).click();
      await page.waitForURL(/\/01-getting-started/, { timeout: 10000 });
      expect(page.url()).toContain('/01-getting-started');
    });

    test('URL updates correctly when crossing lesson boundaries', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at last lesson of Chapter 1
      await page.goto('/01-getting-started/daily-items');
      expect(page.url()).toContain('/daily-items');
      
      // Navigate to next lesson (should cross to Chapter 2)
      await page.getByRole('button', { name: /next/i }).click();
      await page.waitForURL(/\/02-existence-identification/, { timeout: 10000 });
      expect(page.url()).toContain('/02-existence-identification');
    });
  });

  test.describe('Browser Navigation', () => {
    test('browser back button works after cross-chapter navigation', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at Chapter 1
      await page.goto('/01-getting-started/greetings-identity');
      
      // Navigate to Chapter 2
      await page.getByRole('button', { name: /next chapter/i }).click();
      await page.waitForURL(/\/02-existence-identification/, { timeout: 10000 });
      
      // Use browser back button
      await page.goBack();
      await page.waitForURL(/\/01-getting-started/, { timeout: 10000 });
      expect(page.url()).toContain('/01-getting-started');
    });

    test('browser forward button works after cross-chapter navigation', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at Chapter 1
      await page.goto('/01-getting-started/greetings-identity');
      
      // Navigate to Chapter 2
      await page.getByRole('button', { name: /next chapter/i }).click();
      await page.waitForURL(/\/02-existence-identification/, { timeout: 10000 });
      
      // Use browser back button
      await page.goBack();
      await page.waitForURL(/\/01-getting-started/, { timeout: 10000 });
      
      // Use browser forward button
      await page.goForward();
      await page.waitForURL(/\/02-existence-identification/, { timeout: 10000 });
      expect(page.url()).toContain('/02-existence-identification');
    });
  });

  test.describe('Complex Navigation Scenarios', () => {
    test('can navigate through multiple chapters and lessons', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at Chapter 1, Lesson 1
      await page.goto('/01-getting-started/greetings-identity');
      expect(page.url()).toContain('/greetings-identity');
      
      // Navigate through lessons in Chapter 1
      await page.getByRole('button', { name: /next/i }).click();
      await page.waitForURL(/\/masculine-name/, { timeout: 10000 });
      expect(page.url()).toContain('/masculine-name');
      
      // Navigate to Chapter 2
      await page.getByRole('button', { name: /next chapter/i }).click();
      await page.waitForURL(/\/02-existence-identification/, { timeout: 10000 });
      expect(page.url()).toContain('/02-existence-identification');
      
      // Navigate through lessons in Chapter 2
      await page.getByRole('button', { name: /next/i }).click();
      await page.waitForURL(/\/exists-not/, { timeout: 10000 });
      expect(page.url()).toContain('/exists-not');
      
      // Navigate back to Chapter 1
      await page.getByRole('button', { name: /prev chapter/i }).click();
      await page.waitForURL(/\/01-getting-started/, { timeout: 10000 });
      expect(page.url()).toContain('/01-getting-started');
    });

    test('navigation state is consistent across chapter boundaries', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at Chapter 1, Lesson 1
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check initial state
      await expect(page.getByText(/lesson 1 of 6/i)).toBeVisible();
      
      // Navigate to Chapter 2
      await page.getByRole('button', { name: /next chapter/i }).click();
      await page.waitForURL(/\/02-existence-identification/, { timeout: 10000 });
      
      // Check that lesson counter is correct for Chapter 2
      await expect(page.getByText(/lesson 1 of 6/i)).toBeVisible();
      
      // Navigate to next lesson in Chapter 2
      await page.getByRole('button', { name: /next/i }).click();
      await page.waitForURL(/\/exists-not/, { timeout: 10000 });
      
      // Check that lesson counter is updated
      await expect(page.getByText(/lesson 2 of 6/i)).toBeVisible();
    });
  });
});
