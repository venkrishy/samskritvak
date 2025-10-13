import { test, expect } from '@playwright/test';

test.describe('Lesson Pages', () => {
  test('lesson page loads', async ({ page }) => {
    await page.goto('/01-getting-started/greetings-identity');
    await expect(page).toHaveTitle(/Sanskrit Learning/);
  });

  test('lesson has content', async ({ page }) => {
    await page.goto('/01-getting-started/greetings-identity');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check for basic content (use first() to handle multiple main elements)
    const content = page.locator('main').first();
    await expect(content).toBeVisible();
  });

  test('lesson has navigation', async ({ page }) => {
    await page.goto('/01-getting-started/greetings-identity');
    
    // Look for any navigation buttons (less specific)
    const buttons = page.locator('button');
    await expect(buttons.first()).toBeVisible();
  });
});
