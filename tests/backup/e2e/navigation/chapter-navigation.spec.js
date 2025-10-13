import { test, expect } from '../../fixtures/auth.js';

test.describe('Chapter Navigation', () => {
  test.describe('Prev Chapter Button', () => {
    test('prev chapter button is not visible on first chapter', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that prev chapter button is not visible or disabled
      const prevChapterButton = page.getByRole('button', { name: /prev chapter/i });
      
      // Either button is not visible or it's disabled
      const isVisible = await prevChapterButton.isVisible();
      if (isVisible) {
        await expect(prevChapterButton).toBeDisabled();
      } else {
        await expect(prevChapterButton).not.toBeVisible();
      }
    });

    test('prev chapter button works on second chapter', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/02-existence-identification/existence');
      
      // Check that prev chapter button is visible and enabled
      const prevChapterButton = page.getByRole('button', { name: /prev chapter/i });
      await expect(prevChapterButton).toBeVisible();
      await expect(prevChapterButton).toBeEnabled();
      
      // Click prev chapter button
      await prevChapterButton.click();
      
      // Should navigate to previous chapter
      await page.waitForURL(/\/01-getting-started/, { timeout: 10000 });
      expect(page.url()).toContain('/01-getting-started');
    });

    test('prev chapter button has correct icon', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/02-existence-identification/existence');
      
      // Check for chevron left icon
      const prevChapterButton = page.getByRole('button', { name: /prev chapter/i });
      await expect(prevChapterButton).toBeVisible();
      
      // Check for chevron left icon (ChevronLeft from lucide-react)
      const chevronIcon = prevChapterButton.locator('svg');
      await expect(chevronIcon).toBeVisible();
    });
  });

  test.describe('Next Chapter Button', () => {
    test('next chapter button works on first chapter', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that next chapter button is visible and enabled
      const nextChapterButton = page.getByRole('button', { name: /next chapter/i });
      await expect(nextChapterButton).toBeVisible();
      await expect(nextChapterButton).toBeEnabled();
      
      // Click next chapter button
      await nextChapterButton.click();
      
      // Should navigate to next chapter
      await page.waitForURL(/\/02-existence-identification/, { timeout: 10000 });
      expect(page.url()).toContain('/02-existence-identification');
    });

    test('next chapter button is not visible on last chapter', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/14-complex-dialogue/putting-together');
      
      // Check that next chapter button is not visible or disabled
      const nextChapterButton = page.getByRole('button', { name: /next chapter/i });
      
      // Either button is not visible or it's disabled
      const isVisible = await nextChapterButton.isVisible();
      if (isVisible) {
        await expect(nextChapterButton).toBeDisabled();
      } else {
        await expect(nextChapterButton).not.toBeVisible();
      }
    });

    test('next chapter button has correct icon', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for chevron right icon
      const nextChapterButton = page.getByRole('button', { name: /next chapter/i });
      await expect(nextChapterButton).toBeVisible();
      
      // Check for chevron right icon (ChevronRight from lucide-react)
      const chevronIcon = nextChapterButton.locator('svg');
      await expect(chevronIcon).toBeVisible();
    });
  });

  test.describe('Chapter Navigation Flow', () => {
    test('can navigate through multiple chapters', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at chapter 1
      await page.goto('/01-getting-started/greetings-identity');
      expect(page.url()).toContain('/01-getting-started');
      
      // Navigate to chapter 2
      await page.getByRole('button', { name: /next chapter/i }).click();
      await page.waitForURL(/\/02-existence-identification/, { timeout: 10000 });
      expect(page.url()).toContain('/02-existence-identification');
      
      // Navigate to chapter 3
      await page.getByRole('button', { name: /next chapter/i }).click();
      await page.waitForURL(/\/03-location/, { timeout: 10000 });
      expect(page.url()).toContain('/03-location');
      
      // Navigate back to chapter 2
      await page.getByRole('button', { name: /prev chapter/i }).click();
      await page.waitForURL(/\/02-existence-identification/, { timeout: 10000 });
      expect(page.url()).toContain('/02-existence-identification');
    });

    test('chapter navigation preserves lesson context', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at a specific lesson in chapter 1
      await page.goto('/01-getting-started/masculine-name');
      expect(page.url()).toContain('/masculine-name');
      
      // Navigate to next chapter
      await page.getByRole('button', { name: /next chapter/i }).click();
      await page.waitForURL(/\/02-existence-identification/, { timeout: 10000 });
      
      // Should be on first lesson of chapter 2
      expect(page.url()).toContain('/02-existence-identification');
    });

    test('chapter navigation updates page content', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at chapter 1
      await page.goto('/01-getting-started/greetings-identity');
      await expect(page.getByText(/chapter 1/i)).toBeVisible();
      
      // Navigate to chapter 2
      await page.getByRole('button', { name: /next chapter/i }).click();
      await page.waitForURL(/\/02-existence-identification/, { timeout: 10000 });
      
      // Check that chapter information has updated
      await expect(page.getByText(/chapter 2/i)).toBeVisible();
    });
  });

  test.describe('Chapter Navigation States', () => {
    test('navigation buttons show correct states at boundaries', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Test first chapter (Chapter 1)
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
    });

    test('navigation buttons show correct states in middle chapters', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Test middle chapter (Chapter 5)
      await page.goto('/05-plurals/plural-concepts');
      
      // Both buttons should be visible and enabled
      const prevChapterButton = page.getByRole('button', { name: /prev chapter/i });
      const nextChapterButton = page.getByRole('button', { name: /next chapter/i });
      
      await expect(prevChapterButton).toBeVisible();
      await expect(prevChapterButton).toBeEnabled();
      await expect(nextChapterButton).toBeVisible();
      await expect(nextChapterButton).toBeEnabled();
    });

    test('navigation buttons show correct states at last chapter', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Test last chapter (Chapter 14)
      await page.goto('/14-complex-dialogue/putting-together');
      
      // Prev chapter should be visible and enabled
      const prevChapterButton = page.getByRole('button', { name: /prev chapter/i });
      await expect(prevChapterButton).toBeVisible();
      await expect(prevChapterButton).toBeEnabled();
      
      // Next chapter should not be visible or disabled
      const nextChapterButton = page.getByRole('button', { name: /next chapter/i });
      const isNextVisible = await nextChapterButton.isVisible();
      if (isNextVisible) {
        await expect(nextChapterButton).toBeDisabled();
      }
    });
  });
});
