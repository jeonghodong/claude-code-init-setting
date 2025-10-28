# Functional Testing Guide

Playwright 기반 기능 테스트를 수행할 때 따라야 할 베스트 프랙티스와 가이드라인.

## Core Testing Principles

### 1. User-Centric Testing
사용자 관점에서 실제 사용 시나리오를 테스트한다.

```typescript
// ✅ GOOD: 사용자 행동 시뮬레이션
await page.goto('https://example.com/login');
await page.fill('input[name="email"]', 'test@example.com');
await page.fill('input[name="password"]', 'password123');
await page.click('button[type="submit"]');
await expect(page).toHaveURL(/dashboard/);

// ❌ BAD: 내부 구현에 의존
await page.evaluate(() => {
  window.auth.login('test@example.com', 'password123');
});
```

### 2. Isolation and Idempotency
각 테스트는 독립적이고 반복 가능해야 한다.

```typescript
// ✅ GOOD: 테스트 전 상태 초기화
test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
  await page.goto('https://example.com');
});

// ✅ GOOD: 테스트 후 데이터 정리
test.afterEach(async ({ page }) => {
  // 생성한 테스트 데이터 삭제 기능 호출
  await cleanupTestData(page);
});
```

## Critical Test Scenarios

### 1. Page Load & Rendering
```typescript
// 페이지가 올바르게 로드되는지 확인
await page.goto('https://example.com');
await page.waitForLoadState('domcontentloaded');
await page.waitForLoadState('networkidle');

// 주요 요소가 렌더링되었는지 확인
await expect(page.locator('header')).toBeVisible();
await expect(page.locator('main')).toBeVisible();
await expect(page.locator('footer')).toBeVisible();
```

### 2. Form Validation
```typescript
// 필수 필드 검증
await page.click('button[type="submit"]');
await expect(page.locator('text=Email is required')).toBeVisible();

// 유효하지 않은 입력 검증
await page.fill('input[name="email"]', 'invalid-email');
await page.click('button[type="submit"]');
await expect(page.locator('text=Invalid email format')).toBeVisible();

// 정상 제출
await page.fill('input[name="email"]', 'valid@example.com');
await page.fill('input[name="password"]', 'SecurePass123!');
await page.click('button[type="submit"]');
await expect(page).toHaveURL(/success/);
```

### 3. Navigation & Routing
```typescript
// 링크 클릭 테스트
await page.click('a[href="/about"]');
await expect(page).toHaveURL(/about/);

// 뒤로 가기/앞으로 가기
await page.goBack();
await expect(page).toHaveURL(/home/);
await page.goForward();
await expect(page).toHaveURL(/about/);

// 404 페이지 처리
await page.goto('https://example.com/non-existent-page');
await expect(page.locator('h1')).toContainText('404');
```

### 4. API Interactions
```typescript
// API 요청 모니터링
page.on('response', response => {
  if (response.url().includes('/api/')) {
    console.log(`API: ${response.url()} - ${response.status()}`);
  }
});

// API 응답 검증
const response = await page.waitForResponse(
  response => response.url().includes('/api/user') && response.status() === 200
);
const data = await response.json();
expect(data.email).toBe('test@example.com');
```

### 5. Authentication & Authorization
```typescript
// 로그인 플로우
await page.goto('https://example.com/login');
await page.fill('input[name="email"]', 'user@example.com');
await page.fill('input[name="password"]', 'password');
await page.click('button[type="submit"]');

// 인증 상태 확인
await expect(page.locator('text=Welcome')).toBeVisible();

// 보호된 페이지 접근
await page.goto('https://example.com/admin');
// 권한 없으면 리다이렉트 확인
await expect(page).toHaveURL(/unauthorized|login/);
```

### 6. Interactive Elements
```typescript
// 드롭다운 메뉴
await page.click('button#dropdown-toggle');
await expect(page.locator('.dropdown-menu')).toBeVisible();
await page.click('.dropdown-menu a:has-text("Profile")');

// 모달 다이얼로그
await page.click('button#open-modal');
await expect(page.locator('.modal')).toBeVisible();
await page.click('.modal button.close');
await expect(page.locator('.modal')).not.toBeVisible();

// 탭/토글
await page.click('button[role="tab"]:has-text("Settings")');
await expect(page.locator('#settings-panel')).toBeVisible();
```

## Accessibility Testing

### 1. Keyboard Navigation
```typescript
// Tab 키로 포커스 이동
await page.keyboard.press('Tab');
await expect(page.locator('input[name="email"]')).toBeFocused();

// Enter로 폼 제출
await page.keyboard.press('Enter');
```

### 2. ARIA Attributes
```typescript
// ARIA 레이블 확인
await expect(page.locator('button[aria-label="Close"]')).toBeVisible();

// 스크린 리더 텍스트
await expect(page.locator('.sr-only')).toContainText('Loading');
```

## Performance Testing

### 1. Load Time
```typescript
const start = Date.now();
await page.goto('https://example.com');
await page.waitForLoadState('load');
const loadTime = Date.now() - start;

// 3초 이내 로드 확인
expect(loadTime).toBeLessThan(3000);
```

### 2. Large Datasets
```typescript
// 대량 데이터 렌더링 테스트
await page.goto('https://example.com/products');
await page.waitForSelector('.product-list');
const productCount = await page.locator('.product-item').count();
expect(productCount).toBeGreaterThan(0);
```

## Error Handling

### 1. Network Errors
```typescript
// 오프라인 시뮬레이션
await page.context().setOffline(true);
await page.reload();
await expect(page.locator('text=No internet connection')).toBeVisible();

await page.context().setOffline(false);
await page.reload();
await expect(page.locator('main')).toBeVisible();
```

### 2. Error Messages
```typescript
// 서버 에러 메시지 표시 확인
await page.route('**/api/submit', route =>
  route.fulfill({ status: 500, body: 'Server Error' })
);
await page.click('button[type="submit"]');
await expect(page.locator('text=Something went wrong')).toBeVisible();
```

## Mobile & Responsive Testing

### 1. Viewport Testing
```typescript
// 모바일 뷰포트
await page.setViewportSize({ width: 375, height: 667 });
await page.goto('https://example.com');
await expect(page.locator('.mobile-menu')).toBeVisible();

// 데스크톱 뷰포트
await page.setViewportSize({ width: 1920, height: 1080 });
await page.reload();
await expect(page.locator('.desktop-nav')).toBeVisible();
```

### 2. Touch Gestures
```typescript
// 스와이프 제스처
await page.touchscreen.swipe({ x: 100, y: 0 }, { x: -100, y: 0 });
await expect(page.locator('.next-slide')).toBeVisible();
```

## Data Generation & Cleanup

### 1. Test Data Creation
```typescript
// 테스트용 데이터 생성
const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'TestPass123!',
  name: 'Test User'
};

// 회원가입
await page.goto('https://example.com/signup');
await page.fill('input[name="email"]', testUser.email);
await page.fill('input[name="password"]', testUser.password);
await page.fill('input[name="name"]', testUser.name);
await page.click('button[type="submit"]');
```

### 2. Test Data Cleanup
```typescript
// 테스트 종료 후 생성된 데이터 삭제
test.afterEach(async ({ page }) => {
  // 삭제 기능을 활용하여 테스트 데이터 정리
  await page.goto('https://example.com/profile');
  await page.click('button#delete-account');
  await page.click('button#confirm-delete');
  await expect(page).toHaveURL(/goodbye/);
});
```

## Screenshot & Video Capture

### 1. Visual Regression
```typescript
// 스크린샷 캡처
await page.screenshot({ path: 'screenshot.png', fullPage: true });

// 특정 요소만 캡처
await page.locator('.hero-section').screenshot({
  path: 'hero-section.png'
});
```

### 2. Failure Documentation
```typescript
// 테스트 실패 시 자동 스크린샷
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') {
    await page.screenshot({
      path: `failure-${testInfo.title}.png`,
      fullPage: true
    });
  }
});
```

## Best Practices Checklist

### Before Testing
- [ ] 테스트 환경 준비 (브라우저, 뷰포트)
- [ ] 초기 상태 설정 (쿠키/스토리지 클리어)
- [ ] 테스트 데이터 준비

### During Testing
- [ ] 명확한 선택자 사용 (ID > ARIA > Class > XPath)
- [ ] 적절한 대기 시간 설정 (waitForSelector)
- [ ] 에러 발생 시 스크린샷/로그 캡처
- [ ] 실제 사용자 행동 시뮬레이션

### After Testing
- [ ] 생성된 테스트 데이터 삭제
- [ ] 브라우저 세션 종료
- [ ] 테스트 결과 문서화 (성공/실패)
- [ ] 이슈 발견 시 재현 단계 기록

## Common Pitfalls

### ❌ Avoid
```typescript
// 고정 대기 시간 사용
await page.waitForTimeout(5000);

// 취약한 선택자
await page.click('div > div > button');

// 테스트 데이터 방치
// 삭제 없이 테스트만 수행
```

### ✅ Prefer
```typescript
// 동적 대기
await page.waitForSelector('button.submit', { state: 'visible' });

// 안정적인 선택자
await page.click('button[data-testid="submit-button"]');

// 데이터 정리
await cleanupTestData();
```

## Integration with QA Workflow

1. **페이지 접근** → URL로 이동
2. **기능 테스트** → 시나리오별 검증
3. **이슈 발견** → 스크린샷 + 로그 캡처
4. **데이터 정리** → 삭제 기능 활용
5. **결과 문서화** → Markdown + JSON 리포트

이 가이드를 따라 체계적이고 신뢰할 수 있는 기능 테스트를 수행한다.
