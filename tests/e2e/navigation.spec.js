import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('can navigate between pages', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to curriculum
    await page.goto('/curriculum');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/curriculum');
    
    // Navigate to dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/dashboard');
  });

  test('page refresh works', async ({ page }) => {
    await page.goto('/curriculum');
    await page.reload();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/curriculum');
  });

  test('back button works', async ({ page }) => {
    await page.goto('/');
    await page.goto('/curriculum');
    await page.goBack();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/');
  });
});
