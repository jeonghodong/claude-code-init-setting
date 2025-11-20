---
description: Flaky test 식별 및 수정 - 불안정한 테스트 root cause 분석 및 안정화
model: sonnet
argument-hint: <test-case-id-or-file-path>
---

CI/CD 파이프라인에서 간헐적으로 실패하는 Flaky 테스트를 식별하고 수정하는 커맨드입니다.

예시:
- `/qa:fix-flaky TC-REG-008`
- `/qa:fix-flaky tests/specs/tier1-regression/cart.spec.ts`

**Test Case ID or File Path**: $1

# Process

## Step 1: Flaky Test 식별 및 분석

**입력 파싱**:
- TC ID인 경우: 해당 테스트 파일 찾기
- File path인 경우: 해당 파일 직접 읽기

**Flaky Test 정의**:
```
Flaky Test = 코드 변경 없이 동일 테스트가 간헐적으로 통과/실패하는 테스트

특징:
- 로컬에서는 통과, CI에서 실패 (또는 반대)
- 재실행하면 통과
- Pass/Fail이 불규칙함
```

**Flakiness 확인**:
1. CI/CD 로그 확인 (최근 10회 실행)
2. Flake rate 계산: `(Fail Count / Total Runs) × 100%`
3. 패턴 분석:
   - 항상 실패? → Flaky 아님, 진짜 버그
   - 간헐적 실패? → Flaky test
   - 특정 환경에서만 실패? → 환경 이슈

**예시**:
```
TC-REG-008: 장바구니 합계 계산
- Last 10 runs: P, P, F, P, P, F, P, P, P, F
- Flake rate: 30% (3/10 failures)
- Pattern: 간헐적 실패 → Flaky test ✅
```

## Step 2: Root Cause Analysis

**Common Flaky Test Causes**:

### 1. Race Conditions (경쟁 조건)
**증상**:
- 타이밍에 따라 통과/실패
- 동적 컨텐츠가 로드되기 전에 검증 시도
- API 응답 대기 없이 다음 단계 진행

**예시 문제 코드**:
```typescript
// 🔴 Bad: Fixed timeout
await page.click('.submit-button');
await page.waitForTimeout(2000); // 2초 후에는 로드되었을 거야 (가정)
await expect(page.locator('.success-message')).toBeVisible();
```

**해결 방법**:
```typescript
// ✅ Good: Explicit wait for condition
await page.click('.submit-button');
await expect(page.locator('.success-message')).toBeVisible({ timeout: 10000 });
```

### 2. Test Data Pollution (데이터 오염)
**증상**:
- 이전 테스트의 데이터가 남아있음
- 같은 테스트를 2번 연속 실행하면 2번째 실패
- 테스트 순서에 따라 결과가 달라짐

**예시 문제 코드**:
```typescript
// 🔴 Bad: No cleanup
test('add item to cart', async ({ page }) => {
  await page.goto('/cart');
  await page.click('.add-item');
  await expect(page.locator('.cart-count')).toHaveText('1'); // 이미 1개 있으면 실패
});
```

**해결 방법**:
```typescript
// ✅ Good: Clean state before test
test('add item to cart', async ({ page }) => {
  // Setup: Clear cart first
  await page.goto('/cart');
  await page.click('.clear-cart');
  await expect(page.locator('.cart-count')).toHaveText('0');

  // Test
  await page.click('.add-item');
  await expect(page.locator('.cart-count')).toHaveText('1');
});

test.afterEach(async ({ page }) => {
  // Cleanup: Clear cart after test
  await page.goto('/cart');
  await page.click('.clear-cart');
});
```

### 3. Network Timeouts (네트워크 타임아웃)
**증상**:
- 느린 네트워크에서 실패
- CI 환경에서 더 자주 실패
- "Timeout exceeded" 에러

**예시 문제 코드**:
```typescript
// 🔴 Bad: Default timeout too short
await page.goto('/products'); // Default: 30s
await page.click('.load-more'); // 무거운 API 호출
await expect(page.locator('.product-grid')).toBeVisible(); // Timeout!
```

**해결 방법**:
```typescript
// ✅ Good: Increase timeout for slow operations
await page.goto('/products', { timeout: 60000 });
await page.click('.load-more');
await expect(page.locator('.product-grid')).toBeVisible({ timeout: 30000 });

// Or wait for specific API response
await Promise.all([
  page.waitForResponse(resp => resp.url().includes('/api/products')),
  page.click('.load-more')
]);
```

### 4. Non-Deterministic Data (비결정적 데이터)
**증상**:
- 랜덤 데이터 사용
- 날짜/시간에 의존
- 외부 API의 불규칙한 응답

**예시 문제 코드**:
```typescript
// 🔴 Bad: Random data
const randomEmail = `test${Math.random()}@example.com`;
await page.fill('[name="email"]', randomEmail);
// 나중에 이 이메일로 로그인 시도 → 매번 다른 계정
```

**해결 방법**:
```typescript
// ✅ Good: Deterministic test data
const testEmail = 'test-user-001@example.com';
await page.fill('[name="email"]', testEmail);

// Or use fixtures
import { testUsers } from '../fixtures/testData';
await page.fill('[name="email"]', testUsers.valid.email);
```

### 5. Browser State (브라우저 상태)
**증상**:
- localStorage, cookies, cache 충돌
- 이전 테스트의 상태가 영향
- 로그인 상태 공유 문제

**예시 문제 코드**:
```typescript
// 🔴 Bad: Shared state between tests
test('login test 1', async ({ page }) => {
  await page.goto('/login');
  await loginAs('user1');
  // No logout
});

test('login test 2', async ({ page }) => {
  await page.goto('/login');
  // Still logged in as user1!
});
```

**해결 방법**:
```typescript
// ✅ Good: Clean browser state
test.beforeEach(async ({ page, context }) => {
  // Clear storage before each test
  await context.clearCookies();
  await page.evaluate(() => localStorage.clear());
});

test.afterEach(async ({ page }) => {
  // Logout after each test
  await page.goto('/logout');
});
```

## Step 3: Flaky Test 수정

**qa-automation-engineer 에이전트 활용**:

### 3.1 문제 코드 식별
- 테스트 파일 읽기
- Flaky 패턴 찾기:
  - `waitForTimeout` 사용
  - 명시적 대기 없음
  - cleanup 없음
  - 랜덤 데이터
  - 하드코딩된 타이밍

### 3.2 수정 적용
각 원인에 맞는 해결책 적용:

**Race Condition 수정**:
```typescript
// Before
await page.click('.button');
await page.waitForTimeout(3000);

// After
await page.click('.button');
await expect(page.locator('.result')).toBeVisible();
```

**Data Cleanup 추가**:
```typescript
test.beforeEach(async ({ page }) => {
  // Setup clean state
  await setupTestData();
});

test.afterEach(async ({ page }) => {
  // Cleanup
  await cleanupTestData();
});
```

**Timeout 증가**:
```typescript
test('slow operation', async ({ page }) => {
  test.setTimeout(60000); // Increase test timeout
  await page.goto('/slow-page', { timeout: 30000 });
});
```

**Stable Locators**:
```typescript
// Before: Brittle
await page.click('.btn-123');

// After: Stable
await page.getByRole('button', { name: 'Submit' }).click();
```

### 3.3 Retry Logic 추가 (최후의 수단)
일부 외부 요인(네트워크 등)은 완전히 제어 불가:
```typescript
test('payment with external API', async ({ page }) => {
  test.setTimeout(120000);

  // Retry on failure
  await test.step('process payment', async () => {
    let attempts = 0;
    while (attempts < 3) {
      try {
        await page.click('.pay-button');
        await expect(page.locator('.success')).toBeVisible({ timeout: 30000 });
        break; // Success
      } catch (error) {
        attempts++;
        if (attempts === 3) throw error;
        await page.reload(); // Retry
      }
    }
  });
});
```

## Step 4: 수정 검증

**로컬 반복 테스트**:
```bash
# 테스트를 10회 연속 실행
for i in {1..10}; do
  echo "Run $i"
  npx playwright test tests/specs/tier1-regression/cart.spec.ts
done

# 모두 통과해야 함: 10/10 ✅
```

**CI에서 검증**:
```bash
# 코드 커밋 및 푸시
git add tests/specs/tier1-regression/cart.spec.ts
git commit -m "Fix flaky test TC-REG-008: Add explicit waits"
git push

# CI 파이프라인 실행 확인
# 3-5회 연속 통과 확인
```

**7일 모니터링**:
- 다음 7일간 CI 결과 추적
- Flake rate가 0%로 유지되는지 확인
- 문제 재발 시 추가 분석

## Step 5: 문서화 및 리포트

```markdown
## Flaky Test 수정 완료 ✅

### Test Information
- **TC ID**: TC-REG-008
- **Test Name**: 장바구니 합계 계산
- **File**: tests/specs/tier1-regression/cart.spec.ts
- **Flake Rate (Before)**: 30% (3/10 failures)

### Root Cause Analysis
**Primary Cause**: Race Condition
- 장바구니 합계가 계산되기 전에 검증 시도
- API 응답 대기 없이 `.cart-total` 요소 확인

**Secondary Cause**: Test Data Pollution
- 이전 테스트의 장바구니 아이템 잔존
- Cleanup logic 없음

### Fix Applied
1. **Added explicit wait**:
   \`\`\`typescript
   await expect(page.locator('.cart-total')).toHaveText('$100', { timeout: 10000 });
   \`\`\`

2. **Added cleanup**:
   \`\`\`typescript
   test.afterEach(async ({ page }) => {
     await page.goto('/cart/clear');
   });
   \`\`\`

3. **Improved locator**:
   - Before: \`.cart-total\` (CSS class)
   - After: \`page.getByTestId('cart-total')\` (stable)

### Verification Results
- **Local runs**: 10/10 passed ✅
- **CI runs (initial)**: 5/5 passed ✅
- **Flake Rate (After)**: 0% (monitored for 7 days)

### Files Modified
- tests/specs/tier1-regression/cart.spec.ts

### Next Steps
1. Monitor for 7 days to confirm stability
2. Apply similar pattern to related tests
3. Add to CI flaky test report
```

## Step 6: qa-regression-manager 업데이트

**Tier 1 Suite Health 업데이트**:
- Flaky test count -1
- Pass Rate 개선
- Suite 안정성 향상

**Notion 이슈 트래킹 DB**:
- Flaky test 이슈 종료
- Resolution notes 추가

# Guidelines

- **Root cause 우선**: 증상이 아닌 근본 원인 해결
- **명시적 대기 사용**: `waitForTimeout` 절대 사용 금지
- **독립적인 테스트**: 다른 테스트에 의존하지 않도록
- **안정적인 locator**: role, text, test-id 우선
- **Clean state**: 각 테스트는 깨끗한 상태에서 시작
- **적절한 timeout**: 네트워크 작업에는 충분한 시간 부여
- **Retry는 최후**: 근본 원인을 먼저 해결
- **문서화**: 수정 이유와 방법 명확히 기록

# Quality Checks

수정 완료 전 확인:
- [ ] Root cause 명확히 식별됨
- [ ] 적절한 해결책 적용됨
- [ ] `waitForTimeout` 사용 제거
- [ ] 명시적 대기 추가 (`expect().toBeVisible()` 등)
- [ ] Test data cleanup 구현
- [ ] 안정적인 locator 사용
- [ ] 로컬에서 10회 연속 통과
- [ ] CI에서 5회 연속 통과
- [ ] 코드 리뷰 완료
- [ ] 문서화 완료
- [ ] 7일 모니터링 계획 수립

# Output Format

```markdown
## ✅ Flaky Test 수정 완료

### Test Info
- **TC ID**: TC-REG-008
- **Flake Rate**: 30% → 0%

### Root Cause
- [Primary cause]
- [Secondary cause if any]

### Fix Summary
1. [Fix 1]
2. [Fix 2]
3. [Fix 3]

### Verification
- Local: 10/10 ✅
- CI: 5/5 ✅

### Files Modified
- [file1.spec.ts]

### Monitoring
- Next 7 days: Track CI results
- Expected: 0% flake rate maintained
```

# Integration with CLAUDE.md

항상 `/Users/atad/Desktop/QA/CLAUDE.md`를 참조:
- **95% Pass Rate 목표**: Flaky test는 Pass Rate 저하의 주범
- **CI/CD 통합**: 안정적인 자동화 테스트 유지
- **품질 우선 원칙**: 불안정한 테스트는 즉시 수정

# Notes

- 이 커맨드는 **qa-automation-engineer 에이전트**와 **qa-regression-manager 에이전트**를 활용합니다
- Flaky test는 발견 즉시 수정하는 것이 최선입니다
- 수정 후 최소 7일간 모니터링하여 재발 방지를 확인하세요
- 만약 수정이 어려운 경우 일시적으로 skip 처리하고 이슈 트래킹하세요
