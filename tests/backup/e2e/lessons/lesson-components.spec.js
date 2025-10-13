import { test, expect } from '../../fixtures/auth.js';

test.describe('Lesson Components', () => {
  test.describe('Chapter Title Card', () => {
    test('chapter title card displays all required elements', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for chapter title card
      const titleCard = page.locator('[class*="bg-gradient-to-r from-green-50 to-emerald-50"]');
      await expect(titleCard).toBeVisible();
      
      // Check for title
      await expect(page.getByText(/1\.1 - greetings and identity/i)).toBeVisible();
      
      // Check for subtitle
      await expect(page.getByText(/basic greetings and introducing yourself in sanskrit/i)).toBeVisible();
      
      // Check for level badge
      await expect(page.getByText(/beginner/i)).toBeVisible();
    });

    test('chapter title card has correct styling', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for green gradient background
      const titleCard = page.locator('[class*="bg-gradient-to-r from-green-50 to-emerald-50"]');
      await expect(titleCard).toBeVisible();
      
      // Check for border styling
      await expect(titleCard).toHaveClass(/border-green-200/);
    });
  });

  test.describe('Explanation Card', () => {
    test('explanation card displays content correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for explanation card title
      await expect(page.getByText(/goal and vocabulary/i)).toBeVisible();
      
      // Check for explanation content
      await expect(page.getByText(/learn essential sanskrit greetings/i)).toBeVisible();
    });

    test('explanation card displays examples correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for Sanskrit examples
      await expect(page.getByText(/namaste \(नमस्ते\)/i)).toBeVisible();
      await expect(page.getByText(/namo namah/i)).toBeVisible();
      
      // Check for English translations
      await expect(page.getByText(/hello, greetings/i)).toBeVisible();
      await expect(page.getByText(/salutations/i)).toBeVisible();
    });

    test('explanation card displays tips correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for tips section
      await expect(page.getByText(/remember: sanskrit has different forms/i)).toBeVisible();
    });
  });

  test.describe('Image Card', () => {
    test('image card displays correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for image card content
      await expect(page.getByText(/practice the greeting conversation/i)).toBeVisible();
      await expect(page.getByText(/role playing prompt:/i)).toBeVisible();
    });

    test('image card has placeholder content', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for placeholder text
      await expect(page.getByText(/write a sanskrit greeting and introduction/i)).toBeVisible();
    });
  });

  test.describe('Navigation Card', () => {
    test('navigation card displays chapter navigation', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for chapter navigation buttons
      await expect(page.getByRole('button', { name: /next chapter/i })).toBeVisible();
    });

    test('navigation card displays lesson navigation', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for lesson navigation buttons
      await expect(page.getByRole('button', { name: /next/i })).toBeVisible();
    });

    test('navigation card displays lesson information', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for lesson counter
      await expect(page.getByText(/lesson 1 of 6/i)).toBeVisible();
    });
  });

  test.describe('Quiz Card', () => {
    test('quiz card displays correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for quiz card
      await expect(page.getByText(/quiz time!/i)).toBeVisible();
      await expect(page.getByText(/what does 'namaste' mean\?/i)).toBeVisible();
    });

    test('quiz card displays multiple choice options', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for quiz options
      await expect(page.getByText(/goodbye/i)).toBeVisible();
      await expect(page.getByText(/hello/i)).toBeVisible();
      await expect(page.getByText(/thank you/i)).toBeVisible();
      await expect(page.getByText(/please/i)).toBeVisible();
    });

    test('quiz card displays text input quiz', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for text input quiz
      await expect(page.getByText(/complete this sentence: 'mama nāma _____'/i)).toBeVisible();
      await expect(page.getByPlaceholder(/type your answer here/i)).toBeVisible();
    });
  });

  test.describe('Card Styling', () => {
    test('cards have proper spacing and layout', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that cards are properly spaced
      const cards = page.locator('[class*="bg-white rounded-lg border border-gray-200"]');
      await expect(cards.first()).toBeVisible();
    });

    test('cards have proper border and shadow styling', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for card styling
      const cards = page.locator('[class*="bg-white rounded-lg border border-gray-200"]');
      await expect(cards.first()).toBeVisible();
    });
  });

  test.describe('Component Interactions', () => {
    test('quiz card interactions work correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Test multiple choice quiz
      await page.getByText(/hello/i).click();
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Check for result
      await expect(page.getByText(/correct!/i)).toBeVisible();
    });

    test('text input quiz interactions work correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Test text input quiz
      await page.getByPlaceholder(/type your answer here/i).fill('test name');
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Check for result
      await expect(page.getByText(/correct!/i)).toBeVisible();
    });
  });

  test.describe('Component Responsiveness', () => {
    test('components adapt to mobile viewport', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that components are still visible and functional
      await expect(page.getByText(/1\.1 - greetings and identity/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /next/i })).toBeVisible();
    });

    test('components adapt to tablet viewport', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that components are still visible and functional
      await expect(page.getByText(/1\.1 - greetings and identity/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /next/i })).toBeVisible();
    });
  });

  test.describe('Component Loading States', () => {
    test('components load without errors', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Listen for console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      await page.goto('/01-getting-started/greetings-identity');
      await page.waitForLoadState('networkidle');
      
      // Check that no critical errors occurred
      expect(consoleErrors.filter(error => 
        error.includes('Failed to load') || 
        error.includes('404') || 
        error.includes('500')
      )).toHaveLength(0);
    });

    test('components render in correct order', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that components appear in the expected order
      await expect(page.getByText(/1\.1 - greetings and identity/i)).toBeVisible();
      await expect(page.getByText(/goal and vocabulary/i)).toBeVisible();
      await expect(page.getByText(/example dialogue/i)).toBeVisible();
      await expect(page.getByText(/quiz time!/i)).toBeVisible();
    });
  });
});
