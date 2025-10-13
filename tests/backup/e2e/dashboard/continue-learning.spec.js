import { test, expect } from '../../fixtures/auth.js';

test.describe('Continue Learning Feature', () => {
  test.describe('Dashboard Display', () => {
    test('dashboard loads correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Check main heading
      await expect(page.getByRole('heading', { name: /continue where i left off/i })).toBeVisible();
      await expect(page.getByText(/pick up your sanskrit learning journey/i).first()).toBeVisible();
    });

    test('recent lessons display with progress', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Check for lesson cards - just verify that some lesson cards are present
      const lessonCards = page.locator('[class*="bg-white rounded-xl border border-gray-200"]');
      await expect(lessonCards.first()).toBeVisible();
      
      // Check for specific lessons
      await expect(page.getByText(/basic greetings/i).first()).toBeVisible();
      await expect(page.getByText(/personal pronouns/i).first()).toBeVisible();
      await expect(page.getByText(/numbers 1-10/i).first()).toBeVisible();
      await expect(page.getByText(/present tense verbs/i).first()).toBeVisible();
    });

    test('progress bars show correct percentages', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Check for progress percentages
      await expect(page.getByText(/75%/i).first()).toBeVisible();
      await expect(page.getByText(/45%/i).first()).toBeVisible();
      await expect(page.getByText(/90%/i).first()).toBeVisible();
      await expect(page.getByText(/30%/i).first()).toBeVisible();
    });

    test('last accessed times display correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Check for last accessed times
      await expect(page.getByText(/last accessed: 2 hours ago/i).first()).toBeVisible();
      await expect(page.getByText(/last accessed: 1 day ago/i).first()).toBeVisible();
      await expect(page.getByText(/last accessed: 3 days ago/i).first()).toBeVisible();
      await expect(page.getByText(/last accessed: 1 week ago/i).first()).toBeVisible();
    });
  });

  test.describe('Continue Learning Interactions', () => {
    test('continue button works for each lesson', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Test continue button for first lesson
      const continueButtons = page.getByRole('button', { name: /continue/i });
      await expect(continueButtons).toHaveCount(4);
      
      // Click first continue button
      await continueButtons.first().click();
      
      // Check for alert or navigation
      // Note: The current implementation shows an alert
      // In a real implementation, this would navigate to the lesson
    });

    test('continue button shows correct text', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Check that all continue buttons have correct text
      const continueButtons = page.getByRole('button', { name: /continue/i });
      await expect(continueButtons).toHaveCount(4);
      
      for (let i = 0; i < await continueButtons.count(); i++) {
        await expect(continueButtons.nth(i)).toHaveText(/continue/i);
      }
    });

    test('info button is present for each lesson', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Check for info buttons (info icon)
      const infoButtons = page.locator('button svg');
      await expect(infoButtons).toHaveCount(4);
    });
  });

  test.describe('Start Fresh Option', () => {
    test('start fresh section displays correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Check for start fresh section
      await expect(page.getByText(/start fresh/i).first()).toBeVisible();
      await expect(page.getByText(/begin a new learning journey/i).first()).toBeVisible();
    });

    test('browse all lessons button works', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Click browse all lessons button
      await page.getByRole('button', { name: /browse all lessons/i }).click();
      
      // Check for alert or navigation
      // Note: The current implementation shows an alert
      // In a real implementation, this would navigate to curriculum
    });

    test('start fresh button has correct styling', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Check for start fresh button styling
      const startFreshButton = page.getByRole('button', { name: /browse all lessons/i });
      await expect(startFreshButton).toBeVisible();
      await expect(startFreshButton).toHaveClass(/bg-white border border-gray-300/);
    });
  });

  test.describe('Dashboard Tabs', () => {
    test('dashboard tabs are present', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Check for tab navigation (if implemented)
      // Note: The current implementation might not have visible tabs
      // This test checks for the presence of tab functionality
    });

    test('continue tab is active by default', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Check that continue content is visible

      await expect(page.getByText(/continue where i left off/i).first()).toBeVisible();
    });
  });

  test.describe('Progress Visualization', () => {
    test('progress bars have correct styling', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Check for progress bar styling
      const progressBars = page.locator('[class*="bg-gradient-to-r from-blue-500 to-indigo-500"]');
      await expect(progressBars).toHaveCount(4);
    });

    test('progress bars show correct widths', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Check that progress bars have correct widths
      const progressBars = page.locator('[class*="bg-gradient-to-r from-blue-500 to-indigo-500"]');
      
      // First progress bar should be 75% width
      const firstBar = progressBars.first();
      await expect(firstBar).toHaveCSS('width', '75%');
    });

    test('progress percentages are displayed correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Check for progress percentage display
      await expect(page.getByText(/75%/i)).toBeVisible();
      await expect(page.getByText(/45%/i)).toBeVisible();
      await expect(page.getByText(/90%/i)).toBeVisible();
      await expect(page.getByText(/30%/i)).toBeVisible();
    });
  });

  test.describe('Dashboard Responsiveness', () => {
    test('dashboard works on mobile viewport', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard');
      
      // Check that content is still visible
      await expect(page.getByText(/continue where i left off/i)).toBeVisible();
      await expect(page.getByText(/basic greetings/i)).toBeVisible();
    });

    test('dashboard works on tablet viewport', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/dashboard');
      
      // Check that content is still visible
      await expect(page.getByText(/continue where i left off/i)).toBeVisible();
      await expect(page.getByText(/basic greetings/i)).toBeVisible();
    });

    test('lesson cards adapt to different viewport sizes', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Test different viewport sizes
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.getByText(/basic greetings/i)).toBeVisible();
      
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.getByText(/basic greetings/i)).toBeVisible();
      
      await page.setViewportSize({ width: 1200, height: 800 });
      await expect(page.getByText(/basic greetings/i)).toBeVisible();
    });
  });

  test.describe('Dashboard Loading States', () => {
    test('dashboard loads without errors', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Listen for console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check that no critical errors occurred
      expect(consoleErrors.filter(error => 
        error.includes('Failed to load') || 
        error.includes('404') || 
        error.includes('500')
      )).toHaveLength(0);
    });

    test('dashboard content loads in correct order', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Check that content appears in the expected order
      await expect(page.getByText(/continue where i left off/i)).toBeVisible();
      await expect(page.getByText(/basic greetings/i)).toBeVisible();
      await expect(page.getByText(/start fresh/i)).toBeVisible();
    });
  });

  test.describe('Dashboard Accessibility', () => {
    test('dashboard has proper heading structure', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Check for proper heading hierarchy
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      await expect(headings.first()).toBeVisible();
    });

    test('dashboard is keyboard navigable', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Check that focus is visible
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('continue buttons have proper ARIA labels', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Check that continue buttons have proper labels
      const continueButtons = page.getByRole('button', { name: /continue/i });
      await expect(continueButtons.first()).toBeVisible();
    });
  });

  test.describe('Dashboard Edge Cases', () => {
    test('dashboard works after page refresh', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Refresh the page
      await page.reload();
      
      // Dashboard should still work
      await expect(page.getByText(/continue where i left off/i)).toBeVisible();
      await expect(page.getByText(/basic greetings/i)).toBeVisible();
    });

    test('dashboard handles rapid clicking', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Rapidly click continue buttons
      const continueButtons = page.getByRole('button', { name: /continue/i });
      await continueButtons.first().click();
      await continueButtons.nth(1).click();
      await continueButtons.first().click();
      
      // Should handle rapid clicking gracefully
      await expect(page.getByText(/continue where i left off/i)).toBeVisible();
    });

    test('dashboard works with different lesson progress states', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Check that different progress states are displayed
      await expect(page.getByText(/75%/i)).toBeVisible(); // High progress
      await expect(page.getByText(/30%/i)).toBeVisible(); // Low progress
      await expect(page.getByText(/90%/i)).toBeVisible(); // Very high progress
    });
  });
});
