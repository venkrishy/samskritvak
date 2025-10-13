import { test, expect } from '../../fixtures/auth.js';

test.describe('Lesson Viewing', () => {
  test.describe('Lesson Page Components', () => {
    test('chapter title card displays correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for chapter title card
      await expect(page.getByText(/1\.1 - greetings and identity/i)).toBeVisible();
      await expect(page.getByText(/basic greetings and introducing yourself in sanskrit/i)).toBeVisible();
      await expect(page.getByText(/beginner/i)).toBeVisible();
    });

    test('explanation cards render with Sanskrit and English', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for explanation cards
      await expect(page.getByText(/goal and vocabulary/i)).toBeVisible();
      await expect(page.getByText(/learn essential sanskrit greetings/i)).toBeVisible();
      
      // Check for Sanskrit examples
      await expect(page.getByText(/namaste \(नमस्ते\)/i)).toBeVisible();
      await expect(page.getByText(/namo namah/i)).toBeVisible();
    });

    test('example dialogue displays correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for example dialogue section
      await expect(page.getByText(/example dialogue/i)).toBeVisible();
      await expect(page.getByText(/person a: namaste!/i)).toBeVisible();
      await expect(page.getByText(/person b: namaste! mama nāma rāmaḥ/i)).toBeVisible();
    });

    test('image cards display correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for image card
      await expect(page.getByText(/practice the greeting conversation/i)).toBeVisible();
      await expect(page.getByText(/role playing prompt:/i)).toBeVisible();
    });

    test('progress indicators are visible', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for progress indicator
      await expect(page.getByText(/lesson 1 of 6/i)).toBeVisible();
    });
  });

  test.describe('Lesson Content Structure', () => {
    test('lesson content is properly structured', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for main lesson heading
      await expect(page.getByRole('heading', { name: /1\.1 - greetings and identity/i })).toBeVisible();
      
      // Check for section headings
      await expect(page.getByText(/goal and vocabulary/i)).toBeVisible();
      await expect(page.getByText(/example dialogue/i)).toBeVisible();
    });

    test('lesson content displays Sanskrit text correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for Sanskrit text
      await expect(page.getByText(/namaste/i)).toBeVisible();
      await expect(page.getByText(/mama nāma/i)).toBeVisible();
      await expect(page.getByText(/tava nāma kim/i)).toBeVisible();
    });

    test('lesson content displays English translations', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for English translations
      await expect(page.getByText(/hello, greetings/i)).toBeVisible();
      await expect(page.getByText(/my name is rama/i)).toBeVisible();
      await expect(page.getByText(/what is your name/i)).toBeVisible();
    });
  });

  test.describe('Lesson Navigation Components', () => {
    test('navigation cards render correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for green chapter navigation card
      const chapterCard = page.locator('[class*="bg-gradient-to-r from-green-50 to-emerald-50"]');
      await expect(chapterCard).toBeVisible();
      
      // Check for blue lesson navigation card
      const lessonCard = page.locator('[class*="bg-gradient-to-r from-blue-50 to-indigo-50"]');
      await expect(lessonCard).toBeVisible();
    });

    test('navigation buttons are properly styled', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for navigation buttons
      const nextButton = page.getByRole('button', { name: /next/i });
      const nextChapterButton = page.getByRole('button', { name: /next chapter/i });
      
      await expect(nextButton).toBeVisible();
      await expect(nextChapterButton).toBeVisible();
    });

    test('lesson counter displays correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check lesson counter
      await expect(page.getByText(/lesson 1 of 6/i)).toBeVisible();
    });
  });

  test.describe('Lesson Content Loading', () => {
    test('lesson content loads without errors', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Listen for console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      await page.goto('/01-getting-started/greetings-identity');
      
      // Wait for content to load
      await page.waitForLoadState('networkidle');
      
      // Check that no critical errors occurred
      expect(consoleErrors.filter(error => 
        error.includes('Failed to load') || 
        error.includes('404') || 
        error.includes('500')
      )).toHaveLength(0);
    });

    test('lesson content is responsive', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.getByText(/1\.1 - greetings and identity/i)).toBeVisible();
      
      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.getByText(/1\.1 - greetings and identity/i)).toBeVisible();
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1200, height: 800 });
      await expect(page.getByText(/1\.1 - greetings and identity/i)).toBeVisible();
    });
  });

  test.describe('Lesson Content Variations', () => {
    test('different lesson types display correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Test vocabulary lesson
      await page.goto('/01-getting-started/daily-items');
      await expect(page.getByText(/vocabulary: top 10 daily use items/i)).toBeVisible();
      
      // Test grammar lesson
      await page.goto('/01-getting-started/who-what');
      await expect(page.getByText(/asking: who\? and what\?/i)).toBeVisible();
    });

    test('lesson content adapts to different chapters', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Test Chapter 1 lesson
      await page.goto('/01-getting-started/greetings-identity');
      await expect(page.getByText(/basic greetings/i)).toBeVisible();
      
      // Test Chapter 2 lesson
      await page.goto('/02-existence-identification/existence');
      await expect(page.getByText(/existence and identification/i)).toBeVisible();
    });
  });

  test.describe('Lesson Accessibility', () => {
    test('lesson content has proper heading structure', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for proper heading hierarchy
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      await expect(headings.first()).toBeVisible();
    });

    test('lesson content has proper ARIA labels', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that interactive elements have proper labels
      const buttons = page.locator('button');
      const firstButton = buttons.first();
      if (await firstButton.isVisible()) {
        await expect(firstButton).toHaveAttribute('aria-label').or.toHaveText();
      }
    });

    test('lesson content is keyboard navigable', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Check that focus is visible
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });
});
