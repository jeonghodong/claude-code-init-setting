# Data Cleanup Guide

테스트 중 생성된 데이터를 삭제 기능을 활용하여 정리하는 가이드.

## Core Principle: Test Through Deletion

**핵심 아이디어**: 삭제 기능을 테스트하는 것이 곧 데이터 정리다.

```
생성 → 검증 → 삭제 기능 테스트 → 데이터 정리 완료
```

이 접근 방식의 장점:
- ✅ 삭제 기능도 함께 QA됨
- ✅ 테스트 데이터 자동 정리
- ✅ 비용 절감 (불필요한 데이터 미적재)
- ✅ 프로덕션 환경에서도 안전 (실제 삭제 기능 사용)

## Data Lifecycle in Testing

```
┌─────────────────────────────────────────────────────┐
│              Test Data Lifecycle                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. CREATE (생성)                                    │
│     - 테스트용 데이터 생성                            │
│     - 고유 식별자로 추적 가능하게                      │
│                                                     │
│  2. VERIFY (검증)                                    │
│     - 생성 기능 정상 동작 확인                         │
│     - 데이터 정합성 체크                              │
│                                                     │
│  3. USE (사용)                                       │
│     - 생성된 데이터로 다른 기능 테스트                  │
│     - 실제 사용 시나리오 검증                          │
│                                                     │
│  4. DELETE (삭제)                                    │
│     - 삭제 기능 테스트                                │
│     - 데이터 정리 완료                                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Pattern 1: User Account Cleanup

### 회원가입 → 사용 → 탈퇴
```typescript
async function testUserLifecycle(page: Page) {
  // 1. 테스트 계정 생성
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPass123!',
    name: 'QA Test User'
  };

  console.log('📝 Creating test account...');
  await page.goto('https://example.com/signup');
  await page.fill('input[name="email"]', testUser.email);
  await page.fill('input[name="password"]', testUser.password);
  await page.fill('input[name="name"]', testUser.name);
  await page.click('button[type="submit"]');

  // 2. 회원가입 검증
  await expect(page).toHaveURL(/dashboard|welcome/);
  console.log('✅ Account created successfully');

  // 3. 로그인 기능 테스트 (생성된 계정 활용)
  await page.goto('https://example.com/logout');
  await page.goto('https://example.com/login');
  await page.fill('input[name="email"]', testUser.email);
  await page.fill('input[name="password"]', testUser.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/dashboard/);
  console.log('✅ Login with test account successful');

  // 4. 프로필 수정 테스트 (생성된 계정 활용)
  await page.goto('https://example.com/profile');
  await page.fill('input[name="bio"]', 'QA Test Bio');
  await page.click('button#save-profile');
  await expect(page.locator('text=Profile updated')).toBeVisible();
  console.log('✅ Profile update successful');

  // 5. **계정 삭제 기능 테스트 + 데이터 정리**
  console.log('🗑️ Testing account deletion (cleanup)...');
  await page.goto('https://example.com/settings/account');
  await page.click('button#delete-account');

  // 삭제 확인 모달
  await expect(page.locator('.confirm-modal')).toBeVisible();
  await page.fill('input[name="confirm-email"]', testUser.email);
  await page.click('button#confirm-delete');

  // 삭제 완료 확인
  await expect(page).toHaveURL(/goodbye|deleted/);
  console.log('✅ Account deletion successful');

  // 6. 삭제 검증: 재로그인 시도 (실패해야 함)
  await page.goto('https://example.com/login');
  await page.fill('input[name="email"]', testUser.email);
  await page.fill('input[name="password"]', testUser.password);
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Invalid credentials')).toBeVisible();
  console.log('✅ Deleted account cannot login (verified)');

  return {
    created: true,
    tested: true,
    deleted: true,
    verified: true
  };
}
```

## Pattern 2: Post/Content Cleanup

### 게시글 생성 → 수정 → 삭제
```typescript
async function testContentLifecycle(page: Page) {
  const testPost = {
    title: `QA Test Post ${Date.now()}`,
    content: 'This is a test post that will be deleted.',
    tags: ['test', 'qa']
  };

  // 1. 게시글 작성
  console.log('📝 Creating test post...');
  await page.goto('https://example.com/posts/new');
  await page.fill('input[name="title"]', testPost.title);
  await page.fill('textarea[name="content"]', testPost.content);

  for (const tag of testPost.tags) {
    await page.fill('input[name="tags"]', tag);
    await page.keyboard.press('Enter');
  }

  await page.click('button#publish');
  await expect(page.locator('text=Post published')).toBeVisible();
  console.log('✅ Post created successfully');

  // 게시글 ID 추출 (삭제 시 필요)
  const postUrl = page.url();
  const postId = postUrl.split('/').pop();

  // 2. 게시글 수정 테스트
  await page.click('button#edit-post');
  await page.fill('input[name="title"]', `${testPost.title} (edited)`);
  await page.click('button#save');
  await expect(page.locator('text=Post updated')).toBeVisible();
  console.log('✅ Post edit successful');

  // 3. 게시글 조회 테스트
  await page.goto('https://example.com/posts');
  await expect(page.locator(`text=${testPost.title}`)).toBeVisible();
  console.log('✅ Post visible in list');

  // 4. **게시글 삭제 기능 테스트 + 데이터 정리**
  console.log('🗑️ Testing post deletion (cleanup)...');
  await page.goto(`https://example.com/posts/${postId}`);
  await page.click('button#delete-post');

  // 삭제 확인
  await page.click('button#confirm-delete');
  await expect(page).toHaveURL(/posts$/); // 목록으로 리다이렉트
  console.log('✅ Post deletion successful');

  // 5. 삭제 검증: 게시글 접근 시도 (404 또는 삭제 메시지)
  await page.goto(`https://example.com/posts/${postId}`);
  await expect(
    page.locator('text=Post not found|deleted')
  ).toBeVisible();
  console.log('✅ Deleted post not accessible (verified)');

  return {
    postId,
    created: true,
    edited: true,
    deleted: true,
    verified: true
  };
}
```

## Pattern 3: File Upload Cleanup

### 파일 업로드 → 사용 → 삭제
```typescript
async function testFileUploadLifecycle(page: Page) {
  // 1. 파일 업로드
  console.log('📤 Uploading test file...');
  await page.goto('https://example.com/upload');

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: 'test-image.png',
    mimeType: 'image/png',
    buffer: Buffer.from('fake-image-data')
  });

  await page.click('button#upload');
  await expect(page.locator('text=Upload successful')).toBeVisible();
  console.log('✅ File uploaded successfully');

  // 업로드된 파일 ID 추출
  const fileUrl = await page.locator('.uploaded-file img').getAttribute('src');
  const fileId = fileUrl?.split('/').pop()?.split('.')[0];

  // 2. 파일 사용 테스트 (프로필 사진으로 설정)
  await page.goto('https://example.com/profile/edit');
  await page.click(`img[data-file-id="${fileId}"]`);
  await page.click('button#set-as-profile-picture');
  await expect(page.locator('text=Profile picture updated')).toBeVisible();
  console.log('✅ File usage successful');

  // 3. **파일 삭제 기능 테스트 + 스토리지 정리**
  console.log('🗑️ Testing file deletion (cleanup)...');
  await page.goto('https://example.com/files');
  await page.click(`button[data-file-id="${fileId}"]#delete-file`);
  await page.click('button#confirm-delete');
  await expect(page.locator('text=File deleted')).toBeVisible();
  console.log('✅ File deletion successful');

  // 4. 삭제 검증: 파일 URL 접근 시도 (404)
  const response = await page.goto(fileUrl!);
  expect(response?.status()).toBe(404);
  console.log('✅ Deleted file not accessible (verified)');

  return {
    fileId,
    uploaded: true,
    used: true,
    deleted: true,
    verified: true
  };
}
```

## Pattern 4: Transaction/Order Cleanup

### 주문 생성 → 처리 → 취소/삭제
```typescript
async function testOrderLifecycle(page: Page) {
  const testOrder = {
    product: 'Test Product',
    quantity: 1,
    cardNumber: '4242424242424242' // 테스트 카드
  };

  // 1. 상품 선택 및 장바구니 추가
  console.log('🛒 Adding product to cart...');
  await page.goto('https://example.com/products');
  await page.click('text=Test Product');
  await page.click('button#add-to-cart');
  await expect(page.locator('text=Added to cart')).toBeVisible();
  console.log('✅ Product added to cart');

  // 2. 주문 생성 (테스트 결제)
  console.log('💳 Creating test order...');
  await page.goto('https://example.com/checkout');
  await page.fill('input[name="card"]', testOrder.cardNumber);
  await page.fill('input[name="expiry"]', '12/25');
  await page.fill('input[name="cvc"]', '123');
  await page.click('button#place-order');

  await expect(page.locator('text=Order confirmed')).toBeVisible();
  const orderNumber = await page.locator('.order-number').textContent();
  console.log(`✅ Order created: ${orderNumber}`);

  // 3. 주문 조회 테스트
  await page.goto('https://example.com/orders');
  await expect(page.locator(`text=${orderNumber}`)).toBeVisible();
  console.log('✅ Order visible in list');

  // 4. **주문 취소 기능 테스트 + 데이터 정리**
  console.log('🗑️ Testing order cancellation (cleanup)...');
  await page.click(`a[href="/orders/${orderNumber}"]`);
  await page.click('button#cancel-order');
  await page.fill('textarea[name="reason"]', 'QA Test - Automated cleanup');
  await page.click('button#confirm-cancel');

  await expect(page.locator('text=Order cancelled')).toBeVisible();
  console.log('✅ Order cancellation successful');

  // 5. 취소 검증
  await page.goto('https://example.com/orders');
  await expect(
    page.locator(`[data-order="${orderNumber}"] .status`)
  ).toContainText('Cancelled');
  console.log('✅ Order status updated (verified)');

  // 6. 환불 처리 확인 (테스트 환경)
  const refundStatus = await page
    .locator(`[data-order="${orderNumber}"] .refund-status`)
    .textContent();
  expect(refundStatus).toContain('Refunded');
  console.log('✅ Refund processed (verified)');

  return {
    orderNumber,
    created: true,
    cancelled: true,
    refunded: true,
    verified: true
  };
}
```

## Pattern 5: Session & Cookie Cleanup

### 세션 데이터 정리
```typescript
async function cleanupSessionData(page: Page) {
  console.log('🧹 Cleaning up session data...');

  // 1. 쿠키 삭제
  await page.context().clearCookies();
  console.log('✅ Cookies cleared');

  // 2. localStorage 정리
  await page.evaluate(() => {
    localStorage.clear();
  });
  console.log('✅ localStorage cleared');

  // 3. sessionStorage 정리
  await page.evaluate(() => {
    sessionStorage.clear();
  });
  console.log('✅ sessionStorage cleared');

  // 4. IndexedDB 정리 (있다면)
  await page.evaluate(() => {
    indexedDB.databases().then(dbs => {
      dbs.forEach(db => {
        if (db.name) indexedDB.deleteDatabase(db.name);
      });
    });
  });
  console.log('✅ IndexedDB cleared');

  // 5. 캐시 정리
  await page.evaluate(() => {
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
  });
  console.log('✅ Cache cleared');
}
```

## Comprehensive Cleanup Strategy

### 전체 테스트 플로우에 정리 통합
```typescript
async function runTestWithCleanup(
  page: Page,
  testName: string,
  testFn: () => Promise<any>
) {
  const cleanupActions: Array<() => Promise<void>> = [];

  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Test: ${testName}`);
    console.log('='.repeat(60));

    // 테스트 실행
    const result = await testFn();

    // 정리 작업 등록
    if (result.cleanup) {
      cleanupActions.push(result.cleanup);
    }

    return result;
  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
    throw error;
  } finally {
    // 정리 작업 실행 (성공/실패 관계없이)
    console.log('\n🧹 Running cleanup...');

    for (const cleanup of cleanupActions) {
      try {
        await cleanup();
      } catch (error) {
        console.warn(`⚠️ Cleanup warning: ${error.message}`);
      }
    }

    // 세션 데이터 정리
    await cleanupSessionData(page);
    console.log('✅ All cleanup completed\n');
  }
}

// 사용 예시
await runTestWithCleanup(page, 'User Registration Flow', async () => {
  const testUser = await createTestUser(page);

  return {
    success: true,
    user: testUser,
    // 정리 함수 등록
    cleanup: async () => {
      await deleteTestUser(page, testUser.email);
    }
  };
});
```

## Cleanup Verification

### 정리가 제대로 되었는지 확인
```typescript
async function verifyCleanup(page: Page, resourceId: string, resourceType: string) {
  console.log(`🔍 Verifying ${resourceType} cleanup...`);

  switch (resourceType) {
    case 'user':
      // 사용자 로그인 시도 (실패해야 함)
      const loginFailed = await attemptLogin(page, resourceId);
      expect(loginFailed).toBe(true);
      break;

    case 'post':
      // 게시글 접근 시도 (404)
      const response = await page.goto(`/posts/${resourceId}`);
      expect(response?.status()).toBe(404);
      break;

    case 'file':
      // 파일 URL 접근 시도 (404)
      const fileResponse = await page.goto(`/files/${resourceId}`);
      expect(fileResponse?.status()).toBe(404);
      break;

    case 'order':
      // 주문 상태 확인 (취소됨)
      await page.goto(`/orders/${resourceId}`);
      const status = await page.locator('.order-status').textContent();
      expect(status).toContain('Cancelled');
      break;
  }

  console.log(`✅ ${resourceType} cleanup verified`);
}
```

## Cleanup Tracking

### 정리된 데이터 추적
```typescript
interface CleanupRecord {
  timestamp: string;
  resource_type: string;
  resource_id: string;
  cleanup_method: string;
  success: boolean;
  verification: boolean;
}

const cleanupLog: CleanupRecord[] = [];

async function trackCleanup(
  resourceType: string,
  resourceId: string,
  cleanupFn: () => Promise<void>
) {
  const record: CleanupRecord = {
    timestamp: new Date().toISOString(),
    resource_type: resourceType,
    resource_id: resourceId,
    cleanup_method: cleanupFn.name,
    success: false,
    verification: false
  };

  try {
    // 정리 실행
    await cleanupFn();
    record.success = true;

    // 검증
    await verifyCleanup(page, resourceId, resourceType);
    record.verification = true;
  } catch (error) {
    console.error(`❌ Cleanup failed: ${error.message}`);
  } finally {
    cleanupLog.push(record);
  }
}

// 정리 로그 저장
async function saveCleanupLog() {
  const logPath = `.claude/qa-reports/cleanup-log-${Date.now()}.json`;
  await fs.writeFile(logPath, JSON.stringify(cleanupLog, null, 2));
  console.log(`📋 Cleanup log saved: ${logPath}`);
}
```

## Cost Optimization Report

### 비용 절감 효과 측정
```typescript
interface CostSavings {
  test_id: string;
  resources_created: number;
  resources_deleted: number;
  cleanup_rate: number; // percentage
  estimated_cost_saved: number; // in USD
  storage_freed: number; // in MB
}

function calculateCostSavings(cleanupLog: CleanupRecord[]): CostSavings {
  const created = cleanupLog.length;
  const deleted = cleanupLog.filter(r => r.success).length;
  const cleanupRate = (deleted / created) * 100;

  // 예상 비용 절감 (예시)
  const costPerResource = {
    user: 0.01, // $0.01 per user/month
    post: 0.005, // $0.005 per post
    file: 0.02, // $0.02 per file (storage)
    order: 0.001 // $0.001 per order record
  };

  let estimatedCostSaved = 0;
  let storageFreed = 0;

  for (const record of cleanupLog) {
    if (record.success) {
      estimatedCostSaved += costPerResource[record.resource_type] || 0;

      if (record.resource_type === 'file') {
        storageFreed += 1; // 평균 1MB per file
      }
    }
  }

  return {
    test_id: `TEST-${Date.now()}`,
    resources_created: created,
    resources_deleted: deleted,
    cleanup_rate: Math.round(cleanupRate * 100) / 100,
    estimated_cost_saved: Math.round(estimatedCostSaved * 100) / 100,
    storage_freed: Math.round(storageFreed * 100) / 100
  };
}
```

## Best Practices

### DO
✅ 삭제 기능을 테스트하면서 동시에 데이터 정리
✅ 테스트 실패 시에도 정리 코드 실행 (try-finally)
✅ 정리 완료 후 검증 단계 추가
✅ 정리 로그 기록하여 추적 가능하게
✅ 비용 절감 효과 측정 및 리포팅

### DON'T
❌ 테스트 데이터 방치
❌ 수동 삭제에 의존
❌ 삭제 기능 테스트 생략
❌ 정리 검증 없이 완료 가정
❌ 실패한 정리 작업 무시

## Integration with Test Framework

```typescript
// 모든 테스트에 정리 기능 자동 적용
test.afterEach(async ({ page }) => {
  await cleanupSessionData(page);
  await saveCleanupLog();
});

// 특정 리소스 정리 헬퍼
export const withCleanup = {
  user: (testFn) => withResourceCleanup('user', testFn),
  post: (testFn) => withResourceCleanup('post', testFn),
  file: (testFn) => withResourceCleanup('file', testFn),
  order: (testFn) => withResourceCleanup('order', testFn)
};

// 사용 예시
test('User can register and delete account',
  withCleanup.user(async ({ page }) => {
    // 테스트 로직
    const user = await createUser(page);
    // ... 테스트 ...
    await deleteUser(page, user);
    // 정리는 자동으로 검증됨
  })
);
```

이 가이드를 따라 테스트 데이터를 효율적으로 관리하고 비용을 절감한다.
