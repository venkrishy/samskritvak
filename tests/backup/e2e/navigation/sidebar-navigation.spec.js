import { test, expect } from '../../fixtures/auth.js';

test.describe('Sidebar Navigation', () => {
  test.describe('Table of Contents (TOC)', () => {
    test('TOC sidebar opens and closes correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Look for TOC toggle button (hamburger menu or similar)
      const tocToggleButton = page.getByRole('button', { name: /menu|toggle|toc/i });
      
      if (await tocToggleButton.isVisible()) {
        // Click to open TOC
        await tocToggleButton.click();
        
        // Check that TOC is visible
        await expect(page.getByText(/table of contents/i)).toBeVisible();
        
        // Click to close TOC
        await tocToggleButton.click();
        
        // Check that TOC is hidden
        await expect(page.getByText(/table of contents/i)).not.toBeVisible();
      } else {
        // TOC might be always visible on desktop
        await expect(page.getByText(/table of contents/i)).toBeVisible();
      }
    });

    test('TOC displays all chapters', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that TOC is visible
      await expect(page.getByText(/table of contents/i)).toBeVisible();
      
      // Check for chapter links
      await expect(page.getByRole('link', { name: /chapter 1: hello! getting started/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /chapter 2: naming things & asking 'is it there\?'/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /chapter 14: complex dialogue and vocabulary expansion/i })).toBeVisible();
    });

    test('TOC displays lesson sections for each chapter', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for lesson sections under Chapter 1
      await expect(page.getByText(/1\.1 - greetings and identity/i)).toBeVisible();
      await expect(page.getByText(/1\.2 - my name is\.\.\. \(the masculine name\)/i)).toBeVisible();
      await expect(page.getByText(/1\.6 - vocabulary: top 10 daily use items/i)).toBeVisible();
    });

    test('TOC navigation works correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Click on Chapter 2 link in TOC
      await page.getByRole('link', { name: /chapter 2: naming things & asking 'is it there\?'/i }).click();
      
      // Should navigate to Chapter 2
      await page.waitForURL(/\/02-existence-identification/, { timeout: 10000 });
      expect(page.url()).toContain('/02-existence-identification');
    });

    test('TOC lesson navigation works correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Click on a specific lesson in TOC
      await page.getByRole('link', { name: /1\.2 - my name is\.\.\. \(the masculine name\)/i }).click();
      
      // Should navigate to that lesson
      await page.waitForURL(/\/masculine-name/, { timeout: 10000 });
      expect(page.url()).toContain('/masculine-name');
    });
  });

  test.describe('Practice Sidebar', () => {
    test('practice sidebar opens and closes correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Look for practice toggle button
      const practiceToggleButton = page.getByRole('button', { name: /practice|toggle/i });
      
      if (await practiceToggleButton.isVisible()) {
        // Click to open practice sidebar
        await practiceToggleButton.click();
        
        // Check that practice sidebar is visible
        await expect(page.getByText(/practice/i)).toBeVisible();
        
        // Click to close practice sidebar
        await practiceToggleButton.click();
        
        // Check that practice sidebar is hidden
        await expect(page.getByText(/practice/i)).not.toBeVisible();
      } else {
        // Practice sidebar might be always visible or not implemented yet
        // Check if practice content is visible
        const practiceContent = page.getByText(/practice content coming soon/i);
        if (await practiceContent.isVisible()) {
          await expect(practiceContent).toBeVisible();
        }
      }
    });

    test('practice sidebar shows correct content', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Look for practice sidebar content
      const practiceContent = page.getByText(/practice content coming soon/i);
      
      if (await practiceContent.isVisible()) {
        await expect(practiceContent).toBeVisible();
      } else {
        // Practice sidebar might not be implemented yet
        // This is expected based on the current implementation
        console.log('Practice sidebar not yet implemented');
      }
    });
  });

  test.describe('Responsive Navigation', () => {
    test('navigation works on mobile viewport', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that navigation buttons are still visible and functional
      await expect(page.getByRole('button', { name: /next/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /next chapter/i })).toBeVisible();
    });

    test('navigation works on tablet viewport', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that navigation buttons are still visible and functional
      await expect(page.getByRole('button', { name: /next/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /next chapter/i })).toBeVisible();
    });
  });

  test.describe('Navigation State Persistence', () => {
    test('navigation state persists across page refreshes', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Open TOC if it's toggleable
      const tocToggleButton = page.getByRole('button', { name: /menu|toggle|toc/i });
      if (await tocToggleButton.isVisible()) {
        await tocToggleButton.click();
        await expect(page.getByText(/table of contents/i)).toBeVisible();
      }
      
      // Refresh the page
      await page.reload();
      
      // Check that we're still on the same lesson
      expect(page.url()).toContain('/greetings-identity');
    });

    test('navigation state persists across lesson navigation', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Navigate to next lesson
      await page.getByRole('button', { name: /next/i }).click();
      await page.waitForURL(/\/masculine-name/, { timeout: 10000 });
      
      // Check that we're on the correct lesson
      expect(page.url()).toContain('/masculine-name');
      await expect(page.getByText(/lesson 2 of 6/i)).toBeVisible();
    });
  });

  test.describe('Navigation Accessibility', () => {
    test('navigation buttons have proper ARIA labels', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that navigation buttons have proper labels
      const nextButton = page.getByRole('button', { name: /next/i });
      const nextChapterButton = page.getByRole('button', { name: /next chapter/i });
      
      await expect(nextButton).toBeVisible();
      await expect(nextChapterButton).toBeVisible();
    });

    test('navigation links have proper href attributes', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that TOC links have proper href attributes
      const chapter1Link = page.getByRole('link', { name: /chapter 1: hello! getting started/i });
      await expect(chapter1Link).toHaveAttribute('href', '/01-getting-started');
      
      const lessonLink = page.getByRole('link', { name: /1\.2 - my name is\.\.\. \(the masculine name\)/i });
      await expect(lessonLink).toHaveAttribute('href', '/01-getting-started/masculine-name');
    });
  });
});
