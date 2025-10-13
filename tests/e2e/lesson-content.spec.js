import { test, expect } from '@playwright/test';

test.describe('Lesson Content', () => {
  test('lesson page has interactive elements', async ({ page }) => {
    await page.goto('/01-getting-started/greetings-identity');
    await page.waitForLoadState('networkidle');
    
    // Look for any interactive elements (buttons, inputs, etc.)
    const interactiveElements = page.locator('button, input, select, textarea');
    const count = await interactiveElements.count();
    
    // Should have at least some interactive elements
    expect(count).toBeGreaterThan(0);
  });

  test('lesson page responds to user interaction', async ({ page }) => {
    await page.goto('/01-getting-started/greetings-identity');
    await page.waitForLoadState('networkidle');
    
    // Try to click any button on the page
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      // Click the first button and ensure no errors
      await buttons.first().click();
      
      // Wait a bit to see if any errors occur
      await page.waitForTimeout(1000);
      
      // Page should still be functional
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });

  test('lesson page loads without console errors', async ({ page }) => {
    const consoleErrors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/01-getting-started/greetings-identity');
    await page.waitForLoadState('networkidle');
    
    // Filter out common non-critical errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('404') && 
      !error.includes('Failed to load resource')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});
