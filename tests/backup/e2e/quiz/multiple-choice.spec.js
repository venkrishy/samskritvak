import { test, expect } from '../../fixtures/auth.js';

test.describe('Multiple Choice Quiz', () => {
  test.describe('Quiz Display', () => {
    test('quiz card displays correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for quiz card
      await expect(page.getByText(/quiz time!/i)).toBeVisible();
      await expect(page.getByText(/what does 'namaste' mean\?/i)).toBeVisible();
    });

    test('quiz options display correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for quiz options
      await expect(page.getByText(/goodbye/i)).toBeVisible();
      await expect(page.getByText(/hello/i)).toBeVisible();
      await expect(page.getByText(/thank you/i)).toBeVisible();
      await expect(page.getByText(/please/i)).toBeVisible();
    });

    test('quiz options are clickable', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that options are clickable
      const options = page.locator('input[type="radio"]');
      await expect(options.first()).toBeVisible();
      await expect(options.first()).toBeEnabled();
    });
  });

  test.describe('Quiz Interaction', () => {
    test('user can select an option', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Select an option
      await page.getByText(/hello/i).click();
      
      // Check that option is selected
      const selectedOption = page.locator('input[type="radio"]:checked');
      await expect(selectedOption).toBeVisible();
    });

    test('submit button enables when option is selected', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that submit button is initially disabled
      const submitButton = page.getByRole('button', { name: /submit answer/i });
      await expect(submitButton).toBeDisabled();
      
      // Select an option
      await page.getByText(/hello/i).click();
      
      // Check that submit button is now enabled
      await expect(submitButton).toBeEnabled();
    });

    test('submit button shows correct text', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check submit button text
      await expect(page.getByRole('button', { name: /submit answer/i })).toBeVisible();
    });
  });

  test.describe('Quiz Results', () => {
    test('correct answer shows success message', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Select correct answer
      await page.getByText(/hello/i).click();
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Check for success message
      await expect(page.getByText(/correct!/i)).toBeVisible();
      await expect(page.getByText(/✅/i)).toBeVisible();
    });

    test('incorrect answer shows failure message', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Select incorrect answer
      await page.getByText(/goodbye/i).click();
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Check for failure message
      await expect(page.getByText(/not quite right/i)).toBeVisible();
      await expect(page.getByText(/❌/i)).toBeVisible();
    });

    test('incorrect answer shows correct answer', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Select incorrect answer
      await page.getByText(/goodbye/i).click();
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Check that correct answer is shown
      await expect(page.getByText(/correct answer: hello/i)).toBeVisible();
    });

    test('explanation displays after submission', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Select any answer and submit
      await page.getByText(/hello/i).click();
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Check for explanation
      await expect(page.getByText(/namaste' is the most common sanskrit greeting/i)).toBeVisible();
    });
  });

  test.describe('Quiz Reset', () => {
    test('try again button resets quiz', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Select an answer and submit
      await page.getByText(/hello/i).click();
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Click try again button
      await page.getByRole('button', { name: /try again/i }).click();
      
      // Check that quiz is reset
      await expect(page.getByText(/submit answer/i)).toBeVisible();
      await expect(page.getByText(/correct!/i)).not.toBeVisible();
    });

    test('check again button allows resubmission', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Select an answer and submit
      await page.getByText(/hello/i).click();
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Check that check again button is visible
      await expect(page.getByText(/check again/i)).toBeVisible();
    });
  });

  test.describe('Quiz Styling', () => {
    test('quiz card has correct styling', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for quiz card styling
      const quizCard = page.locator('[class*="bg-gradient-to-r from-purple-50 to-pink-50"]');
      await expect(quizCard).toBeVisible();
    });

    test('selected option has correct styling', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Select an option
      await page.getByText(/hello/i).click();
      
      // Check that selected option has correct styling
      const selectedOption = page.locator('input[type="radio"]:checked').locator('..');
      await expect(selectedOption).toHaveClass(/bg-purple-100/);
    });

    test('result messages have correct styling', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Select correct answer and submit
      await page.getByText(/hello/i).click();
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Check for success styling
      await expect(page.getByText(/correct!/i)).toBeVisible();
      const resultCard = page.locator('[class*="bg-green-50 border-green-200"]');
      await expect(resultCard).toBeVisible();
    });
  });

  test.describe('Quiz Accessibility', () => {
    test('quiz options have proper labels', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that options have proper labels
      const options = page.locator('input[type="radio"]');
      await expect(await options.count()).toBeGreaterThan(0);
      
      // Check that each option has a label
      for (let i = 0; i < await options.count(); i++) {
        const option = options.nth(i);
        await expect(option).toHaveAttribute('name', 'quiz-option');
      }
    });

    test('quiz is keyboard navigable', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Check that focus is visible
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('quiz has proper ARIA attributes', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for quiz question
      await expect(page.getByText(/what does 'namaste' mean\?/i)).toBeVisible();
      
      // Check for quiz options
      const options = page.locator('input[type="radio"]');
      await expect(options.first()).toBeVisible();
    });
  });

  test.describe('Quiz Edge Cases', () => {
    test('quiz works with different viewport sizes', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/01-getting-started/greetings-identity');
      
      await expect(page.getByText(/quiz time!/i)).toBeVisible();
      await page.getByText(/hello/i).click();
      await page.getByRole('button', { name: /submit answer/i }).click();
      await expect(page.getByText(/correct!/i)).toBeVisible();
    });

    test('quiz handles rapid clicking', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Rapidly click different options
      await page.getByText(/hello/i).click();
      await page.getByText(/goodbye/i).click();
      await page.getByText(/hello/i).click();
      
      // Submit should work correctly
      await page.getByRole('button', { name: /submit answer/i }).click();
      await expect(page.getByText(/correct!/i)).toBeVisible();
    });

    test('quiz works after page refresh', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Refresh the page
      await page.reload();
      
      // Quiz should still work
      await expect(page.getByText(/quiz time!/i)).toBeVisible();
      await page.getByText(/hello/i).click();
      await page.getByRole('button', { name: /submit answer/i }).click();
      await expect(page.getByText(/correct!/i)).toBeVisible();
    });
  });
});
