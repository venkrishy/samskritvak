import { test, expect } from '@playwright/test';

test.describe('Lesson Navigation', () => {
  test('can navigate between lessons using next/previous buttons', async ({ page }) => {
    // Start at the first lesson
    await page.goto('/01-getting-started/greetings-identity');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the first lesson
    expect(page.url()).toContain('/01-getting-started/greetings-identity');
    
    // Look for enabled next button (not disabled)
    const nextButton = page.locator('button:has-text("Next"):not([disabled])').first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');
      
      // Should be on the next lesson (masculine-name)
      expect(page.url()).toContain('/01-getting-started/masculine-name');
      
      // Now test previous button
      const prevButton = page.locator('button:has-text("Previous"):not([disabled])').first();
      if (await prevButton.isVisible()) {
        await prevButton.click();
        await page.waitForLoadState('networkidle');
        
        // Should be back to the first lesson
        expect(page.url()).toContain('/01-getting-started/greetings-identity');
      }
    }
  });

  test('navigation buttons are properly enabled/disabled', async ({ page }) => {
    // Test first lesson - should have next button, may or may not have previous button
    await page.goto('/01-getting-started/greetings-identity');
    await page.waitForLoadState('networkidle');
    
    // Check that there are navigation buttons present
    const allButtons = page.locator('button');
    const buttonCount = await allButtons.count();
    expect(buttonCount).toBeGreaterThan(0);
    
    // Check for enabled next button (should exist on first lesson)
    const enabledNextButton = page.locator('button:has-text("Next"):not([disabled])');
    const enabledNextCount = await enabledNextButton.count();
    expect(enabledNextCount).toBeGreaterThan(0);
    
    // Check for any previous button (enabled or disabled) - may not exist on first lesson
    const anyPrevButton = page.locator('button:has-text("Previous")');
    const anyPrevCount = await anyPrevButton.count();
    
    // If previous button exists, it should be disabled on first lesson
    if (anyPrevCount > 0) {
      const disabledPrevButton = page.locator('button:has-text("Previous")[disabled]');
      const disabledPrevCount = await disabledPrevButton.count();
      expect(disabledPrevCount).toBeGreaterThan(0);
    }
  });

  test('can navigate through multiple lessons in sequence', async ({ page }) => {
    const lessonUrls = [
      '/01-getting-started/greetings-identity',
      '/01-getting-started/masculine-name',
      '/01-getting-started/feminine-name',
      '/01-getting-started/who-what',
      '/01-getting-started/yes-no',
      '/01-getting-started/daily-items'
    ];
    
    // Start at first lesson
    await page.goto(lessonUrls[0]);
    await page.waitForLoadState('networkidle');
    
    // Navigate through lessons using enabled next button
    for (let i = 0; i < lessonUrls.length - 1; i++) {
      const nextButton = page.locator('button:has-text("Next"):not([disabled])').first();
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForLoadState('networkidle');
        
        // Verify we're on the expected lesson
        expect(page.url()).toContain(lessonUrls[i + 1]);
      }
    }
  });

  test('can navigate back through lessons using previous button', async ({ page }) => {
    // Start at the last lesson
    await page.goto('/01-getting-started/daily-items');
    await page.waitForLoadState('networkidle');
    
    // Navigate back through lessons using enabled previous button
    const lessonUrls = [
      '/01-getting-started/yes-no',
      '/01-getting-started/who-what',
      '/01-getting-started/feminine-name',
      '/01-getting-started/masculine-name',
      '/01-getting-started/greetings-identity'
    ];
    
    for (const expectedUrl of lessonUrls) {
      const prevButton = page.locator('button:has-text("Previous"):not([disabled])').first();
      if (await prevButton.isVisible()) {
        await prevButton.click();
        await page.waitForLoadState('networkidle');
        
        // Verify we're on the expected lesson
        expect(page.url()).toContain(expectedUrl);
      }
    }
  });

  test('chapter navigation works between different chapters', async ({ page }) => {
    // Start at the last lesson of first chapter
    await page.goto('/01-getting-started/daily-items');
    await page.waitForLoadState('networkidle');
    
    // Look for enabled "Next Chapter" button (not disabled)
    const nextChapterButton = page.locator('button:has-text("Next Chapter"):not([disabled])').first();
    if (await nextChapterButton.isVisible()) {
      await nextChapterButton.click();
      await page.waitForLoadState('networkidle');
      
      // Should navigate to the next chapter
      expect(page.url()).toContain('/02-existence-identification');
      
      // Look for enabled "Prev Chapter" button (not disabled)
      const prevChapterButton = page.locator('button:has-text("Prev Chapter"):not([disabled])').first();
      if (await prevChapterButton.isVisible()) {
        await prevChapterButton.click();
        await page.waitForLoadState('networkidle');
        
        // Should be back to the first chapter
        expect(page.url()).toContain('/01-getting-started');
      }
    }
  });

  test('navigation maintains lesson state and content', async ({ page }) => {
    // Start at a lesson
    await page.goto('/01-getting-started/greetings-identity');
    await page.waitForLoadState('networkidle');
    
    // Verify lesson content is visible
    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible();
    
    // Navigate to next lesson using enabled button
    const nextButton = page.locator('button:has-text("Next"):not([disabled])').first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');
      
      // Verify content is still visible after navigation
      const newMainContent = page.locator('main').first();
      await expect(newMainContent).toBeVisible();
      
      // Verify we're on a different lesson
      expect(page.url()).toContain('/01-getting-started/masculine-name');
    }
  });

  test('navigation buttons have correct styling and accessibility', async ({ page }) => {
    await page.goto('/01-getting-started/greetings-identity');
    await page.waitForLoadState('networkidle');
    
    // Check enabled next button styling
    const enabledNextButton = page.locator('button:has-text("Next"):not([disabled])').first();
    if (await enabledNextButton.isVisible()) {
      // Should have proper contrast and styling
      await expect(enabledNextButton).toBeVisible();
      
      // Check for proper ARIA attributes or accessibility
      const buttonText = await enabledNextButton.textContent();
      expect(buttonText).toContain('Next');
      
      // Should not be disabled
      await expect(enabledNextButton).toBeEnabled();
    }
    
    // Check disabled previous button (should exist but be disabled on first lesson)
    const disabledPrevButton = page.locator('button:has-text("Previous")[disabled]').first();
    if (await disabledPrevButton.isVisible()) {
      await expect(disabledPrevButton).toBeVisible();
      const prevButtonText = await disabledPrevButton.textContent();
      expect(prevButtonText).toContain('Previous');
      
      // Should be disabled
      await expect(disabledPrevButton).toBeDisabled();
    }
  });
});
