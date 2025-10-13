import { test, expect } from '../../fixtures/auth.js';

test.describe('Lesson Navigation', () => {
  test.describe('Previous Lesson Button', () => {
    test('previous button is not visible on first lesson of chapter', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that previous button is not visible or disabled
      const previousButton = page.getByRole('button', { name: /previous/i });
      
      // Either button is not visible or it's disabled
      const isVisible = await previousButton.isVisible();
      if (isVisible) {
        await expect(previousButton).toBeDisabled();
      } else {
        await expect(previousButton).not.toBeVisible();
      }
    });

    test('previous button works on second lesson', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/masculine-name');
      
      // Check that previous button is visible and enabled
      const previousButton = page.getByRole('button', { name: /previous/i });
      await expect(previousButton).toBeVisible();
      await expect(previousButton).toBeEnabled();
      
      // Click previous button
      await previousButton.click();
      
      // Should navigate to previous lesson
      await page.waitForURL(/\/greetings-identity/, { timeout: 10000 });
      expect(page.url()).toContain('/greetings-identity');
    });

    test('previous button has correct icon', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/masculine-name');
      
      // Check for arrow left icon
      const previousButton = page.getByRole('button', { name: /previous/i });
      await expect(previousButton).toBeVisible();
      
      // Check for arrow left icon (ArrowLeft from lucide-react)
      const arrowIcon = previousButton.locator('svg');
      await expect(arrowIcon).toBeVisible();
    });
  });

  test.describe('Next Lesson Button', () => {
    test('next button works on first lesson', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that next button is visible and enabled
      const nextButton = page.getByRole('button', { name: /next/i });
      await expect(nextButton).toBeVisible();
      await expect(nextButton).toBeEnabled();
      
      // Click next button
      await nextButton.click();
      
      // Should navigate to next lesson
      await page.waitForURL(/\/masculine-name/, { timeout: 10000 });
      expect(page.url()).toContain('/masculine-name');
    });

    test('next button is not visible on last lesson of chapter', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/daily-items');
      
      // Check that next button is not visible or disabled
      const nextButton = page.getByRole('button', { name: /next/i });
      
      // Either button is not visible or it's disabled
      const isVisible = await nextButton.isVisible();
      if (isVisible) {
        await expect(nextButton).toBeDisabled();
      } else {
        await expect(nextButton).not.toBeVisible();
      }
    });

    test('next button has correct icon', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for arrow right icon
      const nextButton = page.getByRole('button', { name: /next/i });
      await expect(nextButton).toBeVisible();
      
      // Check for arrow right icon (ArrowRight from lucide-react)
      const arrowIcon = nextButton.locator('svg');
      await expect(arrowIcon).toBeVisible();
    });
  });

  test.describe('Lesson Navigation Flow', () => {
    test('can navigate through multiple lessons in same chapter', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at first lesson
      await page.goto('/01-getting-started/greetings-identity');
      expect(page.url()).toContain('/greetings-identity');
      
      // Navigate to second lesson
      await page.getByRole('button', { name: /next/i }).click();
      await page.waitForURL(/\/masculine-name/, { timeout: 10000 });
      expect(page.url()).toContain('/masculine-name');
      
      // Navigate to third lesson
      await page.getByRole('button', { name: /next/i }).click();
      await page.waitForURL(/\/feminine-name/, { timeout: 10000 });
      expect(page.url()).toContain('/feminine-name');
      
      // Navigate back to second lesson
      await page.getByRole('button', { name: /previous/i }).click();
      await page.waitForURL(/\/masculine-name/, { timeout: 10000 });
      expect(page.url()).toContain('/masculine-name');
    });

    test('lesson navigation updates lesson counter', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at first lesson
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check lesson counter (should show "Lesson 1 of 6")
      await expect(page.getByText(/lesson 1 of 6/i)).toBeVisible();
      
      // Navigate to second lesson
      await page.getByRole('button', { name: /next/i }).click();
      await page.waitForURL(/\/masculine-name/, { timeout: 10000 });
      
      // Check lesson counter (should show "Lesson 2 of 6")
      await expect(page.getByText(/lesson 2 of 6/i)).toBeVisible();
    });

    test('lesson navigation updates lesson title', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at first lesson
      await page.goto('/01-getting-started/greetings-identity');
      await expect(page.getByText(/1\.1 - greetings and identity/i)).toBeVisible();
      
      // Navigate to second lesson
      await page.getByRole('button', { name: /next/i }).click();
      await page.waitForURL(/\/masculine-name/, { timeout: 10000 });
      
      // Check that lesson title has updated
      await expect(page.getByText(/1\.2 - my name is\.\.\. \(the masculine name\)/i)).toBeVisible();
    });
  });

  test.describe('Lesson Navigation States', () => {
    test('navigation buttons show correct states at first lesson', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Previous button should not be visible or disabled
      const previousButton = page.getByRole('button', { name: /previous/i });
      const isPrevVisible = await previousButton.isVisible();
      if (isPrevVisible) {
        await expect(previousButton).toBeDisabled();
      }
      
      // Next button should be visible and enabled
      const nextButton = page.getByRole('button', { name: /next/i });
      await expect(nextButton).toBeVisible();
      await expect(nextButton).toBeEnabled();
    });

    test('navigation buttons show correct states in middle lessons', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/masculine-name');
      
      // Both buttons should be visible and enabled
      const previousButton = page.getByRole('button', { name: /previous/i });
      const nextButton = page.getByRole('button', { name: /next/i });
      
      await expect(previousButton).toBeVisible();
      await expect(previousButton).toBeEnabled();
      await expect(nextButton).toBeVisible();
      await expect(nextButton).toBeEnabled();
    });

    test('navigation buttons show correct states at last lesson', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/daily-items');
      
      // Previous button should be visible and enabled
      const previousButton = page.getByRole('button', { name: /previous/i });
      await expect(previousButton).toBeVisible();
      await expect(previousButton).toBeEnabled();
      
      // Next button should not be visible or disabled
      const nextButton = page.getByRole('button', { name: /next/i });
      const isNextVisible = await nextButton.isVisible();
      if (isNextVisible) {
        await expect(nextButton).toBeDisabled();
      }
    });
  });

  test.describe('Lesson Navigation Cards', () => {
    test('lesson navigation cards render correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for green chapter navigation card
      const chapterCard = page.locator('[class*="bg-gradient-to-r from-green-50 to-emerald-50"]');
      await expect(chapterCard).toBeVisible();
      
      // Check for blue lesson navigation card
      const lessonCard = page.locator('[class*="bg-gradient-to-r from-blue-50 to-indigo-50"]');
      await expect(lessonCard).toBeVisible();
    });

    test('lesson navigation cards show correct information', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check lesson information in navigation card
      await expect(page.getByText(/1\.1 - greetings and identity/i)).toBeVisible();
      await expect(page.getByText(/lesson 1 of 6/i)).toBeVisible();
    });
  });
});
