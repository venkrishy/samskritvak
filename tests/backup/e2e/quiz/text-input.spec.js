import { test, expect } from '../../fixtures/auth.js';

test.describe('Text Input Quiz', () => {
  test.describe('Quiz Display', () => {
    test('text input quiz displays correctly', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for text input quiz
      await expect(page.getByText(/complete this sentence: 'mama nāma _____'/i)).toBeVisible();
      await expect(page.getByText(/your answer:/i)).toBeVisible();
    });

    test('text input field is visible and enabled', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for input field
      const inputField = page.getByPlaceholder(/type your answer here/i);
      await expect(inputField).toBeVisible();
      await expect(inputField).toBeEnabled();
    });

    test('input field has correct placeholder', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for placeholder text
      await expect(page.getByPlaceholder(/type your answer here/i)).toBeVisible();
    });
  });

  test.describe('Text Input Interaction', () => {
    test('user can type in input field', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Type in input field
      const inputField = page.getByPlaceholder(/type your answer here/i);
      await inputField.fill('test name');
      
      // Check that text was entered
      await expect(inputField).toHaveValue('test name');
    });

    test('submit button enables when text is entered', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that submit button is initially disabled
      const submitButton = page.getByRole('button', { name: /submit answer/i });
      await expect(submitButton).toBeDisabled();
      
      // Type in input field
      await page.getByPlaceholder(/type your answer here/i).fill('test name');
      
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

  test.describe('Text Input Validation', () => {
    test('correct answer shows success message', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Type correct answer (case insensitive)
      await page.getByPlaceholder(/type your answer here/i).fill('your name');
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Check for success message
      await expect(page.getByText(/correct!/i)).toBeVisible();
      await expect(page.getByText(/✅/i)).toBeVisible();
    });

    test('correct answer with different case shows success', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Type correct answer with different case
      await page.getByPlaceholder(/type your answer here/i).fill('YOUR NAME');
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Check for success message
      await expect(page.getByText(/correct!/i)).toBeVisible();
    });

    test('correct answer with extra whitespace shows success', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Type correct answer with extra whitespace
      await page.getByPlaceholder(/type your answer here/i).fill('  your name  ');
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Check for success message
      await expect(page.getByText(/correct!/i)).toBeVisible();
    });

    test('incorrect answer shows failure message', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Type incorrect answer
      await page.getByPlaceholder(/type your answer here/i).fill('wrong answer');
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Check for failure message
      await expect(page.getByText(/not quite right/i)).toBeVisible();
      await expect(page.getByText(/❌/i)).toBeVisible();
    });

    test('incorrect answer shows correct answer', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Type incorrect answer
      await page.getByPlaceholder(/type your answer here/i).fill('wrong answer');
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Check that correct answer is shown
      await expect(page.getByText(/correct answer: \[your name\]/i)).toBeVisible();
    });

    test('explanation displays after submission', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Type any answer and submit
      await page.getByPlaceholder(/type your answer here/i).fill('test name');
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Check for explanation
      await expect(page.getByText(/mama nāma' means 'my name' in sanskrit/i)).toBeVisible();
    });
  });

  test.describe('Text Input Reset', () => {
    test('try again button resets quiz', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Type an answer and submit
      await page.getByPlaceholder(/type your answer here/i).fill('test name');
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Click try again button
      await page.getByRole('button', { name: /try again/i }).click();
      
      // Check that quiz is reset
      await expect(page.getByText(/submit answer/i)).toBeVisible();
      await expect(page.getByText(/correct!/i)).not.toBeVisible();
      
      // Check that input field is cleared
      const inputField = page.getByPlaceholder(/type your answer here/i);
      await expect(inputField).toHaveValue('');
    });

    test('check again button allows resubmission', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Type an answer and submit
      await page.getByPlaceholder(/type your answer here/i).fill('test name');
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Check that check again button is visible
      await expect(page.getByText(/check again/i)).toBeVisible();
    });
  });

  test.describe('Text Input Styling', () => {
    test('input field has correct styling', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check for input field styling
      const inputField = page.getByPlaceholder(/type your answer here/i);
      await expect(inputField).toBeVisible();
      await expect(inputField).toHaveClass(/w-full/);
    });

    test('result messages have correct styling', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Type correct answer and submit
      await page.getByPlaceholder(/type your answer here/i).fill('your name');
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Check for success styling
      await expect(page.getByText(/correct!/i)).toBeVisible();
      const resultCard = page.locator('[class*="bg-green-50 border-green-200"]');
      await expect(resultCard).toBeVisible();
    });
  });

  test.describe('Text Input Accessibility', () => {
    test('input field has proper labels', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Check that input field has proper label
      await expect(page.getByText(/your answer:/i)).toBeVisible();
      const inputField = page.getByPlaceholder(/type your answer here/i);
      await expect(inputField).toBeVisible();
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

    test('input field accepts keyboard input', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Focus on input field
      const inputField = page.getByPlaceholder(/type your answer here/i);
      await inputField.focus();
      
      // Type using keyboard
      await page.keyboard.type('test name');
      
      // Check that text was entered
      await expect(inputField).toHaveValue('test name');
    });
  });

  test.describe('Text Input Edge Cases', () => {
    test('quiz works with different viewport sizes', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/01-getting-started/greetings-identity');
      
      await expect(page.getByText(/complete this sentence/i)).toBeVisible();
      await page.getByPlaceholder(/type your answer here/i).fill('your name');
      await page.getByRole('button', { name: /submit answer/i }).click();
      await expect(page.getByText(/correct!/i)).toBeVisible();
    });

    test('quiz handles special characters', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Type answer with special characters
      await page.getByPlaceholder(/type your answer here/i).fill('your name!@#$%');
      await page.getByRole('button', { name: /submit answer/i }).click();
      
      // Should show failure message
      await expect(page.getByText(/not quite right/i)).toBeVisible();
    });

    test('quiz handles empty input', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Try to submit without entering anything
      const submitButton = page.getByRole('button', { name: /submit answer/i });
      await expect(submitButton).toBeDisabled();
    });

    test('quiz works after page refresh', async ({ authenticatedUser }) => {
      const page = authenticatedUser;
      await page.goto('/01-getting-started/greetings-identity');
      
      // Refresh the page
      await page.reload();
      
      // Quiz should still work
      await expect(page.getByText(/complete this sentence/i)).toBeVisible();
      await page.getByPlaceholder(/type your answer here/i).fill('your name');
      await page.getByRole('button', { name: /submit answer/i }).click();
      await expect(page.getByText(/correct!/i)).toBeVisible();
    });
  });
});
