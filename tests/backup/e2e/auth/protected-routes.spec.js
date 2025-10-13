import { test, expect } from '../../fixtures/auth.js';

test.describe('Protected Routes', () => {
  test.describe('Unauthenticated Access', () => {
    test('dashboard redirects to home', async ({ unauthenticatedUser }) => {
      const page = unauthenticatedUser;
      await page.goto('/dashboard');
      
      // Should redirect to home page
      await page.waitForURL(/\/$/, { timeout: 10000 });
      expect(page.url()).toBe('http://localhost:3000/');
    });

    test('lesson pages redirect to home', async ({ unauthenticatedUser }) => {
      const page = unauthenticatedUser;
      
      // Test multiple lesson pages
      const lessonPages = [
        '/01-getting-started/greetings-identity',
        '/01-getting-started/masculine-name',
        '/02-existence-identification/existence',
        '/03-location/spatial-concepts'
      ];
      
      for (const lessonPage of lessonPages) {
        await page.goto(lessonPage);
        await page.waitForURL(/\/$/, { timeout: 10000 });
        expect(page.url()).toBe('http://localhost:3000/');
      }
    });

    test('chapter pages redirect to home', async ({ unauthenticatedUser }) => {
      const page = unauthenticatedUser;
      
      // Test chapter pages
      const chapterPages = [
        '/01-getting-started',
        '/02-existence-identification',
        '/03-location',
        '/04-actions'
      ];
      
      for (const chapterPage of chapterPages) {
        await page.goto(chapterPage);
        await page.waitForURL(/\/$/, { timeout: 10000 });
        expect(page.url()).toBe('http://localhost:3000/');
      }
    });
  });

  test.describe('Authenticated Access', () => {
    test('dashboard is accessible when authenticated', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/dashboard');
      
      // Should stay on dashboard
      expect(page.url()).toContain('/dashboard');
      await expect(page.getByRole('heading', { name: /continue where i left off/i })).toBeVisible();
    });

    test('lesson pages are accessible when authenticated', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Test lesson pages
      const lessonPages = [
        '/01-getting-started/greetings-identity',
        '/01-getting-started/masculine-name',
        '/02-existence-identification/existence'
      ];
      
      for (const lessonPage of lessonPages) {
        await page.goto(lessonPage);
        expect(page.url()).toContain(lessonPage);
        
        // Check that lesson content is visible - just verify the page loaded
        await expect(page.locator('body')).toBeVisible();
      }
    });

    test('chapter pages are accessible when authenticated', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Test chapter pages
      const chapterPages = [
        '/01-getting-started',
        '/02-existence-identification',
        '/03-location'
      ];
      
      for (const chapterPage of chapterPages) {
        await page.goto(chapterPage);
        expect(page.url()).toContain(chapterPage);
        
        // Check that chapter content is visible - just verify the page loaded
        await expect(page.locator('body')).toBeVisible();
      }
    });
  });

  test.describe('Route Guards', () => {
    test('authentication state persists across navigation', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Start at dashboard
      await page.goto('/dashboard');
      expect(page.url()).toContain('/dashboard');
      
      // Navigate to lesson
      await page.goto('/01-getting-started/greetings-identity');
      expect(page.url()).toContain('/greetings-identity');
      
      // Navigate back to dashboard
      await page.goto('/dashboard');
      expect(page.url()).toContain('/dashboard');
    });

    test('direct URL access works when authenticated', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Direct access to lesson page
      await page.goto('/01-getting-started/greetings-identity');
      expect(page.url()).toContain('/greetings-identity');
      
      // Direct access to chapter page
      await page.goto('/02-existence-identification');
      expect(page.url()).toContain('/02-existence-identification');
    });
  });
});
