import { test, expect } from '@playwright/test';

test.describe('Basic Navigation', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Sanskrit/);
  });

  test('curriculum page loads', async ({ page }) => {
    await page.goto('/curriculum');
    await expect(page).toHaveTitle(/Curriculum/);
  });

  test('dashboard page loads', async ({ page }) => {
    await page.goto('/dashboard');
    // Should load even without auth (based on current implementation)
    await expect(page).toHaveTitle(/Dashboard/);
  });
});
