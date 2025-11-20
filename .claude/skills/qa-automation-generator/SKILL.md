---
name: QA Automation Generator
description: Generate Playwright automation test scripts from manual test cases or scenarios. Use when the user asks to automate tests, create Playwright scripts, mentions "automation", "자동화", "Playwright", "E2E testing", or wants to convert manual test cases to automated scripts.
---

# QA Automation Generator

## Purpose

This skill generates production-ready Playwright automation scripts using TypeScript, following best practices like Page Object Model (POM), proper error handling, and clear structure. It helps QA teams achieve the 80% automation coverage goal.

## When to Use

Use this skill when:
- User asks to automate test cases
- User mentions "Playwright", "automation", "자동화"
- User wants to convert manual tests to automated scripts
- User asks for E2E test scripts
- User mentions Tier 1 automation (회귀 테스트 자동화)
- User provides test scenarios to automate

## Instructions

### 1. Understand the Test Scenario

First, gather information:
- What test case needs automation?
- Test steps and expected results
- URL and environment
- Test data needed
- Priority (P0/P1/P2 - affects automation urgency)

If information is missing, ask:
- What are the test steps?
- What should be verified?
- What test data is needed?

### 2. Analyze Test Complexity

Determine automation approach:
- **Simple**: Single page, few interactions → Direct test script
- **Medium**: Multiple pages, form interactions → Page Object Model
- **Complex**: Multi-step flows, dynamic data → POM + Helper functions

### 3. Generate Automation Structure

Create appropriate structure:

**Page Object Model (POM)** - For most tests:
```
tests/
├── pages/
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   └── BasePage.ts
├── helpers/
│   └── testData.ts
└── specs/
    └── login.spec.ts
```

**Simple Tests** - For basic scenarios:
```
tests/
└── simple/
    └── smoke.spec.ts
```

### 4. Write Clean, Maintainable Code

Follow these principles:
- Use Page Object Model for reusability
- Add clear comments in Korean and English
- Include proper error handling
- Use meaningful variable names
- Add wait strategies (avoid hardcoded timeouts)
- Include assertions with clear messages

### 5. Structure Each Script

**Test File Structure**:
```typescript
// 1. Imports
// 2. Test suite description
// 3. Setup/teardown hooks if needed
// 4. Test cases with Given/When/Then pattern
// 5. Helper functions if needed
```

**Page Object Structure**:
```typescript
// 1. Imports
// 2. Locator definitions
// 3. Constructor
// 4. Action methods
// 5. Assertion methods
```

## Process

### Step 1: Create Page Objects

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }
}
```

### Step 2: Create Test Spec

```typescript
// tests/auth/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('로그인 기능 테스트', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
  });

  test('TC-AUTH-001: 유효한 계정으로 로그인 성공', async ({ page }) => {
    // Given: 로그인 페이지에 접속한 상태
    await expect(page).toHaveURL(/.*login/);

    // When: 유효한 계정 정보로 로그인
    await loginPage.login('test@example.com', 'Test1234!');

    // Then: 대시보드로 리다이렉트
    await expect(page).toHaveURL(/.*dashboard/);

    // And: 사용자 이름이 표시됨
    await expect(dashboardPage.userName).toBeVisible();

    // And: JWT 토큰이 저장됨
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  test('TC-AUTH-002: 잘못된 비밀번호로 로그인 실패', async ({ page }) => {
    // Given: 로그인 페이지에 접속한 상태

    // When: 잘못된 비밀번호로 로그인 시도
    await loginPage.login('test@example.com', 'WrongPassword');

    // Then: 에러 메시지 표시
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(/이메일 또는 비밀번호가 일치하지 않습니다/);

    // And: 로그인 페이지에 유지
    await expect(page).toHaveURL(/.*login/);
  });
});
```

### Step 3: Add Configuration

Create or update `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL || 'https://staging.example.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

## Guidelines

**DO**:
- Use Page Object Model for maintainability
- Write clear test descriptions in Korean
- Add comments for complex logic
- Use explicit waits (waitForSelector, waitForLoadState)
- Include meaningful assertions
- Handle errors gracefully
- Follow Given/When/Then pattern
- Use test data from separate files
- Add retry logic for flaky elements
- Include screenshots on failure

**DON'T**:
- Use hardcoded waits (page.waitForTimeout)
- Put logic in test files (use page objects)
- Ignore error handling
- Write unclear test descriptions
- Use XPath unless necessary (prefer CSS selectors)
- Duplicate code across tests
- Skip assertions
- Hardcode test data in scripts
- Ignore CI/CD configuration

## Examples

### Example 1: Complete Login Automation

**Input**:
```
Automate the login test case:
TC-AUTH-001: 유효한 계정으로 로그인 성공

Steps:
1. Navigate to /login
2. Enter email: test@example.com
3. Enter password: Test1234!
4. Click login button

Expected:
- Redirect to /dashboard
- User name displayed
- JWT token saved
```

**Output**:
```typescript
// pages/BasePage.ts
import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}

// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
  }

  async goto() {
    await this.page.goto('/login');
    await this.waitForPageLoad();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async getErrorText(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }
}

// pages/DashboardPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly userName: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.userName = page.locator('.user-name');
    this.logoutButton = page.locator('button:has-text("로그아웃")');
  }

  async getUserName(): Promise<string> {
    return await this.userName.textContent() || '';
  }

  async isUserNameVisible(): Promise<boolean> {
    return await this.userName.isVisible();
  }
}

// helpers/testData.ts
export const TEST_USERS = {
  valid: {
    email: 'test@example.com',
    password: 'Test1234!',
    name: 'Test User'
  },
  invalid: {
    email: 'test@example.com',
    password: 'WrongPassword123'
  }
};

// tests/auth/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TEST_USERS } from '../helpers/testData';

test.describe('로그인 기능 자동화 테스트', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // Given: 로그인 페이지 접속
    await loginPage.goto();
  });

  test('TC-AUTH-001: 유효한 계정으로 로그인 성공', async ({ page }) => {
    // When: 유효한 계정 정보로 로그인
    await loginPage.login(TEST_USERS.valid.email, TEST_USERS.valid.password);

    // Then: 대시보드로 리다이렉트
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 5000 });

    // And: 사용자 이름 표시 확인
    await expect(dashboardPage.userName).toBeVisible();
    const userName = await dashboardPage.getUserName();
    expect(userName).toBe(TEST_USERS.valid.name);

    // And: JWT 토큰 저장 확인
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
    expect(token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/); // JWT 형식 검증
  });

  test('TC-AUTH-002: 잘못된 비밀번호로 로그인 실패', async ({ page }) => {
    // When: 잘못된 비밀번호로 로그인 시도
    await loginPage.login(TEST_USERS.invalid.email, TEST_USERS.invalid.password);

    // Then: 에러 메시지 표시
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 3000 });
    const errorText = await loginPage.getErrorText();
    expect(errorText).toContain('이메일 또는 비밀번호가 일치하지 않습니다');

    // And: 로그인 페이지 유지
    await expect(page).toHaveURL(/.*login/);

    // And: 토큰 저장 안됨
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  });

  test('TC-AUTH-003: 빈 이메일로 로그인 시도', async ({ page }) => {
    // When: 이메일 없이 로그인 시도
    await loginPage.passwordInput.fill(TEST_USERS.valid.password);
    await loginPage.loginButton.click();

    // Then: 유효성 검사 에러
    const emailValidity = await loginPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(emailValidity).toBe(false);
  });
});

// package.json scripts
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug",
    "test:auth": "playwright test tests/auth",
    "test:report": "playwright show-report"
  }
}
```

### Example 2: API Testing with Playwright

**Input**:
```
Automate API test:
Test POST /api/login endpoint
Verify status code, response time, JWT token
```

**Output**:
```typescript
// tests/api/login.api.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login API 테스트', () => {
  const BASE_URL = process.env.API_URL || 'https://api.staging.example.com';

  test('TC-API-001: POST /api/login 성공', async ({ request }) => {
    // Given: 유효한 로그인 데이터
    const loginData = {
      email: 'test@example.com',
      password: 'Test1234!'
    };

    const startTime = Date.now();

    // When: 로그인 API 호출
    const response = await request.post(`${BASE_URL}/api/login`, {
      data: loginData
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Then: 응답 검증
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // And: 응답 시간 검증 (< 3초)
    expect(responseTime).toBeLessThan(3000);

    // And: 응답 본문 검증
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('token');
    expect(responseBody).toHaveProperty('user');
    expect(responseBody.user.email).toBe(loginData.email);

    // And: JWT 토큰 형식 검증
    expect(responseBody.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
  });

  test('TC-API-002: POST /api/login 실패 (잘못된 비밀번호)', async ({ request }) => {
    // Given: 잘못된 비밀번호
    const loginData = {
      email: 'test@example.com',
      password: 'WrongPassword'
    };

    // When: 로그인 API 호출
    const response = await request.post(`${BASE_URL}/api/login`, {
      data: loginData
    });

    // Then: 401 Unauthorized
    expect(response.status()).toBe(401);

    // And: 에러 메시지 검증
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('error');
    expect(responseBody.error).toContain('Invalid credentials');
  });
});
```

## Best Practices

### 1. Page Object Model
- One page object per page/component
- Keep page objects focused and cohesive
- Methods should return page objects for chaining

### 2. Locator Strategy
Priority order:
1. Role/label: `page.getByRole('button', { name: 'Submit' })`
2. Test ID: `page.getByTestId('submit-button')`
3. Text: `page.getByText('Submit')`
4. CSS: `page.locator('.submit-button')`
5. XPath: Last resort only

### 3. Waiting Strategy
```typescript
// ✅ Good - explicit waits
await page.waitForSelector('.element');
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible();

// ❌ Bad - hardcoded timeouts
await page.waitForTimeout(3000);
```

### 4. Error Handling
```typescript
// ✅ Good
try {
  await page.click('.button', { timeout: 5000 });
} catch (error) {
  console.error('Failed to click button:', error);
  throw error;
}

// Include screenshots on failure
test('example', async ({ page }, testInfo) => {
  try {
    // test code
  } catch (error) {
    await testInfo.attach('screenshot', {
      body: await page.screenshot(),
      contentType: 'image/png'
    });
    throw error;
  }
});
```

### 5. Test Data Management
```typescript
// ✅ Good - separate test data
// testData.ts
export const USERS = { ... };

// test.spec.ts
import { USERS } from './testData';

// ❌ Bad - hardcoded in tests
await login('test@example.com', 'password123');
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run tests
        run: npm run test
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Output Format

Provide complete, ready-to-use code:

1. **Directory Structure**
2. **Page Objects** (if needed)
3. **Test Specs** with clear comments
4. **Helper Files** (test data, utilities)
5. **Configuration** (playwright.config.ts)
6. **Package.json scripts**
7. **CI/CD configuration** (if requested)
8. **README** with instructions

## Notes

- Always use TypeScript for type safety
- Follow the project's existing structure if it exists
- Include Korean comments for test scenarios
- Use English for technical comments
- Priority P0 and P1 tests should be automated first
- Plan for Tier 1 (regression test) integration
- Reference CLAUDE.md for automation priorities
