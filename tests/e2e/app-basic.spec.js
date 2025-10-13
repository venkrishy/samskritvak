import { test, expect } from '@playwright/test';

test.describe('App Basic Functionality', () => {
  test('home page loads and has content', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for basic content without being too specific
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check that page has some content
    const textContent = await body.textContent();
    expect(textContent.length).toBeGreaterThan(0);
  });

  test('curriculum page loads', async ({ page }) => {
    await page.goto('/curriculum');
    await page.waitForLoadState('networkidle');
    
    // Check that page loads
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('dashboard page loads', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check that page loads
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('lesson page loads', async ({ page }) => {
    await page.goto('/01-getting-started/greetings-identity');
    await page.waitForLoadState('networkidle');
    
    // Check that page loads
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
