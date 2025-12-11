# Playwright E2E Tests

This directory contains end-to-end tests for the Sanskrit learning application using Playwright.

## Test Structure

```
tests/
├── e2e/
│   ├── auth/                    # Authentication tests
│   │   ├── login.spec.js       # Google OAuth flow
│   │   ├── logout.spec.js      # Sign-out flow
│   │   └── protected-routes.spec.js  # Route guards
│   ├── navigation/             # Navigation tests
│   │   ├── public-pages.spec.js      # Home, Curriculum
│   │   ├── chapter-navigation.spec.js # Prev/Next Chapter buttons
│   │   ├── lesson-navigation.spec.js  # Previous/Next lesson buttons
│   │   ├── cross-chapter-navigation.spec.js  # Boundary cases
│   │   └── sidebar-navigation.spec.js # TOC navigation
│   ├── lessons/               # Lesson viewing tests
│   │   ├── lesson-viewing.spec.js    # Lesson content display
│   │   └── lesson-components.spec.js # Cards rendering
│   ├── quiz/                   # Quiz interaction tests
│   │   ├── multiple-choice.spec.js   # MCQ interactions
│   │   └── text-input.spec.js        # Text input quizzes
│   └── dashboard/              # Dashboard tests
│       └── continue-learning.spec.js # Dashboard features
├── fixtures/
│   └── auth.js                 # Authentication helpers
└── README.md                   # This file
```

## Setup

### Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Google OAuth Test Account** (for authentication tests)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Environment Setup

1. **Supabase Configuration**: Ensure your Supabase project is configured with Google OAuth
2. **Test Credentials**: Set up a test Google account for authentication tests
3. **Environment Variables**: Make sure your `.env` file has the correct Supabase configuration

## Running Tests

### Basic Commands

```bash
# Run all tests
npm run test:e2e

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests with UI mode
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug

# Show test report
npm run test:e2e:report
```

### Running Specific Test Suites

```bash
# Run only authentication tests
npx playwright test tests/e2e/auth/

# Run only navigation tests
npx playwright test tests/e2e/navigation/

# Run only quiz tests
npx playwright test tests/e2e/quiz/

# Run a specific test file
npx playwright test tests/e2e/auth/login.spec.js
```

### Running Tests in Different Browsers

```bash
# Run tests in Chromium only
npx playwright test --project=chromium

# Run tests in Firefox only
npx playwright test --project=firefox

# Run tests in WebKit only
npx playwright test --project=webkit
```

## Authentication Setup

### Setting Up Test Authentication

1. **Create Test Google Account**: Set up a dedicated Google account for testing
2. **Configure Supabase**: Ensure your Supabase project allows the test account
3. **Capture Authentication State**: Run the auth setup script to capture session

### Authentication State Management

The tests use Playwright's `storageState` feature to manage authentication:

- **Authenticated Tests**: Use `tests/fixtures/auth.json` for authenticated user state
- **Unauthenticated Tests**: Use empty storage state for public access tests

### Setting Up Authentication State

1. **Manual Setup** (Recommended for development):
   ```bash
   # Start the application
   npm run dev
   
   # Open browser and manually log in
   npx playwright test --headed tests/e2e/auth/login.spec.js
   
   # The test will capture the authentication state
   ```

2. **Automated Setup** (For CI/CD):
   - Use environment variables for test credentials
   - Implement automated authentication flow
   - Store authentication state securely

## Test Categories

### 1. Authentication Tests (`tests/e2e/auth/`)

- **Login Flow**: Google OAuth authentication
- **Logout Flow**: Sign-out functionality
- **Protected Routes**: Route guards and redirects

### 2. Navigation Tests (`tests/e2e/navigation/`)

- **Public Pages**: Home and curriculum access
- **Chapter Navigation**: Prev/Next Chapter buttons
- **Lesson Navigation**: Previous/Next lesson buttons
- **Cross-Chapter Navigation**: Boundary cases and transitions
- **Sidebar Navigation**: Table of contents functionality

### 3. Lesson Tests (`tests/e2e/lessons/`)

- **Lesson Viewing**: Content display and structure
- **Component Rendering**: Cards, navigation, and interactive elements

### 4. Quiz Tests (`tests/e2e/quiz/`)

- **Multiple Choice**: Option selection and validation
- **Text Input**: Input field interaction and validation

### 5. Dashboard Tests (`tests/e2e/dashboard/`)

- **Continue Learning**: Progress tracking and lesson resumption
- **Dashboard Features**: User interface and interactions

## Test Configuration

### Playwright Configuration

The tests are configured in `playwright.config.js`:

- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit
- **Parallel Execution**: Enabled for speed
- **Screenshots**: On failure
- **Videos**: On first retry
- **Timeouts**: 30s default, 60s for OAuth flows

### Test Fixtures

Authentication fixtures are available in `tests/fixtures/auth.js`:

- `authenticatedUser`: Pre-authenticated user context
- `unauthenticatedUser`: Public user context
- Helper functions for navigation and authentication checks

## Debugging Tests

### Debug Mode

```bash
# Run tests in debug mode
npm run test:e2e:debug

# Run specific test in debug mode
npx playwright test tests/e2e/auth/login.spec.js --debug
```

### Screenshots and Videos

- **Screenshots**: Automatically captured on test failure
- **Videos**: Recorded on first retry
- **Traces**: Available for debugging complex issues

### Console Logs

```bash
# Run tests with console output
npx playwright test --reporter=list
```

## Continuous Integration

### GitHub Actions

Example workflow for running tests in CI:

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

### Environment Variables for CI

```bash
# Required environment variables
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

## Troubleshooting

### Common Issues

1. **Authentication Failures**:
   - Check Supabase configuration
   - Verify Google OAuth setup
   - Ensure test account has proper permissions

2. **Navigation Failures**:
   - Check that the application is running
   - Verify route configurations
   - Check for JavaScript errors

3. **Quiz Interaction Failures**:
   - Verify component rendering
   - Check for timing issues
   - Ensure proper selectors

### Debug Commands

```bash
# Run tests with verbose output
npx playwright test --reporter=line

# Run tests with specific timeout
npx playwright test --timeout=60000

# Run tests in headed mode for debugging
npx playwright test --headed
```

## Best Practices

### Test Organization

- **Group related tests** in describe blocks
- **Use descriptive test names** that explain the expected behavior
- **Keep tests independent** - each test should be able to run in isolation

### Test Data

- **Use mock data** for consistent test results
- **Avoid hardcoded values** that might change
- **Clean up test data** after each test

### Performance

- **Run tests in parallel** when possible
- **Use appropriate timeouts** for different operations
- **Optimize test execution** by grouping related tests

## Contributing

### Adding New Tests

1. **Create test file** in appropriate directory
2. **Follow naming convention**: `*.spec.js`
3. **Use existing fixtures** for authentication
4. **Add proper descriptions** and assertions

### Test Maintenance

- **Update tests** when UI changes
- **Remove obsolete tests** that are no longer relevant
- **Keep tests up to date** with application changes

## Support

For issues with the test suite:

1. **Check the console output** for error messages
2. **Review test reports** for detailed failure information
3. **Use debug mode** to step through failing tests
4. **Check application logs** for server-side issues

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
