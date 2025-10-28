# Test Automation Patterns

자가 학습형 QA 자동화를 위한 패턴과 베스트 프랙티스.

## Self-Learning QA System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   QA Automation System                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐      ┌──────────────┐               │
│  │  Test Runner │─────▶│ Issue Detector│               │
│  └──────────────┘      └──────────────┘               │
│         │                      │                        │
│         ▼                      ▼                        │
│  ┌──────────────┐      ┌──────────────┐               │
│  │ Learning DB  │◀─────│  Auto Fixer  │               │
│  └──────────────┘      └──────────────┘               │
│         │                      │                        │
│         ▼                      ▼                        │
│  ┌──────────────┐      ┌──────────────┐               │
│  │Pattern Match │─────▶│   Re-tester  │               │
│  └──────────────┘      └──────────────┘               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Pattern 1: Historical Data Learning

### 데이터 구조
```typescript
interface TestHistory {
  test_id: string;
  timestamp: string;
  page_url: string;
  test_scenarios: TestScenario[];
  issues_found: Issue[];
  resolution_attempts: ResolutionAttempt[];
  final_status: 'passed' | 'failed' | 'partial';
  learning_points: LearningPoint[];
}

interface TestScenario {
  scenario_id: string;
  name: string;
  steps: string[];
  expected_result: string;
  actual_result: string;
  status: 'passed' | 'failed';
  execution_time: number;
}

interface LearningPoint {
  pattern_type: string;
  context: string;
  solution: string;
  success_rate: number;
  applicable_pages: string[];
}
```

### 과거 데이터 분석
```typescript
// 학습 데이터 로드
async function loadLearningData(pageUrl: string) {
  const reports = await glob('.claude/qa-reports/**/*.json');

  // 유사한 페이지의 과거 테스트 찾기
  const relevantTests = reports
    .map(file => JSON.parse(fs.readFileSync(file, 'utf-8')))
    .filter(test => isSimilarPage(test.page_url, pageUrl));

  // 패턴 추출
  const patterns = extractPatterns(relevantTests);

  return {
    common_issues: patterns.issues,
    successful_fixes: patterns.fixes,
    test_priorities: patterns.priorities
  };
}

// 페이지 유사도 판단
function isSimilarPage(url1: string, url2: string): boolean {
  const path1 = new URL(url1).pathname;
  const path2 = new URL(url2).pathname;

  // 같은 경로 패턴인지 확인
  const pattern1 = path1.replace(/\/\d+/g, '/:id');
  const pattern2 = path2.replace(/\/\d+/g, '/:id');

  return pattern1 === pattern2;
}
```

### 패턴 매칭 및 적용
```typescript
// 과거 이슈와 유사한 문제 조기 감지
async function detectSimilarIssues(currentTest: TestResult) {
  const history = await loadLearningData(currentTest.page_url);

  for (const historicalIssue of history.common_issues) {
    const similarity = calculateSimilarity(
      currentTest.symptoms,
      historicalIssue.symptoms
    );

    if (similarity > 0.8) {
      console.log(`Similar issue detected: ${historicalIssue.issue_id}`);

      // 과거 성공한 해결책 적용
      if (historicalIssue.successful_fix) {
        await applyFix(historicalIssue.successful_fix);
      }
    }
  }
}
```

## Pattern 2: Iterative Testing & Auto-Fix

### 반복 테스트 플로우
```typescript
interface TestConfig {
  max_retries: number; // 5
  retry_delay: number; // 2000ms
  auto_fix_enabled: boolean;
}

async function runIterativeTest(
  pageUrl: string,
  config: TestConfig = { max_retries: 5, retry_delay: 2000, auto_fix_enabled: true }
) {
  let attempt = 0;
  const testResults: TestAttempt[] = [];

  while (attempt < config.max_retries) {
    attempt++;
    console.log(`\n🔍 Test Attempt ${attempt}/${config.max_retries}`);

    // 1. 테스트 실행
    const result = await runTest(pageUrl);
    testResults.push({ attempt, result });

    // 2. 성공 시 종료
    if (result.status === 'passed') {
      console.log('✅ All tests passed!');
      await saveSuccessReport(pageUrl, testResults);
      return { success: true, attempts: attempt };
    }

    // 3. 이슈 발견 시 문서화
    const issues = result.issues;
    await documentIssues(issues, attempt);

    // 4. 자동 수정 시도
    if (config.auto_fix_enabled) {
      console.log(`🔧 Attempting auto-fix for ${issues.length} issues...`);
      const fixResults = await attemptAutoFix(issues);

      // 5. 수정 결과 기록
      await saveFixAttempt(attempt, fixResults);

      // 6. 재시도 전 대기
      await delay(config.retry_delay);
    } else {
      // 자동 수정 비활성화 시 즉시 종료
      break;
    }
  }

  // 최대 시도 횟수 초과
  console.log(`❌ Tests failed after ${config.max_retries} attempts`);
  await saveFailureReport(pageUrl, testResults);
  return { success: false, attempts: attempt };
}
```

### 자동 수정 전략
```typescript
interface FixStrategy {
  issue_type: string;
  detection_pattern: RegExp | ((context: any) => boolean);
  fix_function: (context: any) => Promise<FixResult>;
  success_rate: number;
}

const FIX_STRATEGIES: FixStrategy[] = [
  {
    issue_type: 'missing_validation',
    detection_pattern: /client.*validation.*missing/i,
    fix_function: async (context) => {
      // 클라이언트 측 검증 추가
      const code = generateValidationCode(context.field_type);
      await injectCode(context.file_path, code);
      return { applied: true, code };
    },
    success_rate: 0.85
  },
  {
    issue_type: 'slow_loading',
    detection_pattern: (ctx) => ctx.load_time > 3000,
    fix_function: async (context) => {
      // 이미지 lazy loading 적용
      await applyLazyLoading(context.page_url);
      return { applied: true, optimization: 'lazy_loading' };
    },
    success_rate: 0.70
  },
  {
    issue_type: 'missing_error_handling',
    detection_pattern: /unhandled.*error/i,
    fix_function: async (context) => {
      // try-catch 블록 추가
      const code = wrapWithErrorHandling(context.code_snippet);
      await replaceCode(context.file_path, code);
      return { applied: true, code };
    },
    success_rate: 0.90
  }
];

async function attemptAutoFix(issues: Issue[]): Promise<FixResult[]> {
  const results: FixResult[] = [];

  for (const issue of issues) {
    // 매칭되는 수정 전략 찾기
    const strategy = FIX_STRATEGIES.find(s => {
      if (typeof s.detection_pattern === 'function') {
        return s.detection_pattern(issue);
      }
      return s.detection_pattern.test(issue.description);
    });

    if (strategy) {
      console.log(`🔧 Applying fix: ${strategy.issue_type}`);

      try {
        const result = await strategy.fix_function(issue);
        results.push({
          issue_id: issue.id,
          strategy: strategy.issue_type,
          success: true,
          details: result
        });
      } catch (error) {
        results.push({
          issue_id: issue.id,
          strategy: strategy.issue_type,
          success: false,
          error: error.message
        });
      }
    } else {
      console.log(`⚠️ No auto-fix strategy for: ${issue.type}`);
      results.push({
        issue_id: issue.id,
        success: false,
        reason: 'no_strategy_found'
      });
    }
  }

  return results;
}
```

## Pattern 3: Smart Test Prioritization

### 우선순위 기반 테스트
```typescript
interface TestPriority {
  scenario: string;
  priority: number; // 1-10
  reason: string;
}

async function prioritizeTests(pageUrl: string): Promise<TestPriority[]> {
  const history = await loadLearningData(pageUrl);

  const priorities: TestPriority[] = [
    // 1. 과거 실패 이력이 있는 시나리오
    ...history.common_issues.map(issue => ({
      scenario: issue.scenario,
      priority: 10,
      reason: `Failed ${issue.failure_count} times in history`
    })),

    // 2. 중요 비즈니스 로직
    {
      scenario: 'user_authentication',
      priority: 9,
      reason: 'Critical business function'
    },
    {
      scenario: 'payment_flow',
      priority: 9,
      reason: 'Revenue-critical'
    },

    // 3. 최근 변경된 기능
    ...await getRecentlyChangedFeatures(pageUrl),

    // 4. 사용자 트래픽이 높은 기능
    ...await getHighTrafficFeatures(pageUrl),

    // 5. 일반 UI/UX 테스트
    {
      scenario: 'responsive_layout',
      priority: 5,
      reason: 'Standard UX check'
    },
    {
      scenario: 'accessibility',
      priority: 6,
      reason: 'Compliance requirement'
    }
  ];

  // 우선순위 순으로 정렬
  return priorities.sort((a, b) => b.priority - a.priority);
}
```

## Pattern 4: Context-Aware Testing

### 페이지 타입 감지 및 맞춤 테스트
```typescript
enum PageType {
  LANDING = 'landing',
  FORM = 'form',
  DASHBOARD = 'dashboard',
  ECOMMERCE = 'ecommerce',
  BLOG = 'blog',
  ADMIN = 'admin'
}

async function detectPageType(page: Page): Promise<PageType> {
  const url = page.url();
  const content = await page.content();

  // URL 패턴 분석
  if (/\/admin|\/dashboard/.test(url)) return PageType.DASHBOARD;
  if (/\/shop|\/products|\/cart/.test(url)) return PageType.ECOMMERCE;
  if (/\/contact|\/signup|\/login/.test(url)) return PageType.FORM;
  if (/\/blog|\/posts|\/articles/.test(url)) return PageType.BLOG;

  // DOM 구조 분석
  const formCount = await page.locator('form').count();
  const productCount = await page.locator('[data-product]').count();

  if (formCount > 2) return PageType.FORM;
  if (productCount > 5) return PageType.ECOMMERCE;

  return PageType.LANDING;
}

async function runContextAwareTests(page: Page) {
  const pageType = await detectPageType(page);
  console.log(`📄 Detected page type: ${pageType}`);

  switch (pageType) {
    case PageType.FORM:
      await testFormPage(page);
      break;
    case PageType.ECOMMERCE:
      await testEcommercePage(page);
      break;
    case PageType.DASHBOARD:
      await testDashboardPage(page);
      break;
    case PageType.LANDING:
      await testLandingPage(page);
      break;
    // ... 기타 페이지 타입
  }
}

// 폼 페이지 특화 테스트
async function testFormPage(page: Page) {
  const tests = [
    { name: 'Form Validation', fn: testFormValidation },
    { name: 'Required Fields', fn: testRequiredFields },
    { name: 'Submit Handler', fn: testFormSubmit },
    { name: 'Error Messages', fn: testErrorMessages },
    { name: 'Success Feedback', fn: testSuccessFeedback }
  ];

  for (const test of tests) {
    await test.fn(page);
  }
}

// 이커머스 페이지 특화 테스트
async function testEcommercePage(page: Page) {
  const tests = [
    { name: 'Product Display', fn: testProductDisplay },
    { name: 'Add to Cart', fn: testAddToCart },
    { name: 'Price Calculation', fn: testPriceCalculation },
    { name: 'Checkout Flow', fn: testCheckoutFlow },
    { name: 'Payment Integration', fn: testPayment }
  ];

  for (const test of tests) {
    await test.fn(page);
  }
}
```

## Pattern 5: Parallel Test Execution

### 다중 URL 동시 테스트
```typescript
async function testMultiplePages(urls: string[]) {
  console.log(`🚀 Testing ${urls.length} pages in parallel...`);

  // 브라우저 컨텍스트 생성
  const browser = await chromium.launch();
  const contexts = await Promise.all(
    urls.map(() => browser.newContext())
  );

  // 병렬 테스트 실행
  const results = await Promise.all(
    urls.map(async (url, index) => {
      const page = await contexts[index].newPage();

      try {
        const result = await runIterativeTest(url);
        return { url, success: true, result };
      } catch (error) {
        return { url, success: false, error: error.message };
      } finally {
        await page.close();
      }
    })
  );

  // 브라우저 정리
  await Promise.all(contexts.map(ctx => ctx.close()));
  await browser.close();

  // 결과 집계
  const summary = {
    total: urls.length,
    passed: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };

  return summary;
}
```

## Pattern 6: Learning Data Storage

### 학습 데이터 저장 구조
```typescript
interface LearningDatabase {
  version: string;
  last_updated: string;
  total_tests: number;
  pages_tested: string[];
  issue_patterns: IssuePattern[];
  fix_strategies: FixStrategyStats[];
  performance_metrics: PerformanceMetrics;
}

interface IssuePattern {
  pattern_id: string;
  issue_type: string;
  symptoms: string[];
  occurrence_count: number;
  affected_pages: string[];
  successful_fixes: FixHistory[];
  avg_resolution_time: number;
}

// 학습 데이터 업데이트
async function updateLearningDatabase(testResult: TestHistory) {
  const dbPath = '.claude/qa-reports/learning-db.json';
  const db: LearningDatabase = await loadOrCreateDB(dbPath);

  // 테스트 카운트 증가
  db.total_tests++;
  db.last_updated = new Date().toISOString();

  // 페이지 추가
  if (!db.pages_tested.includes(testResult.page_url)) {
    db.pages_tested.push(testResult.page_url);
  }

  // 이슈 패턴 업데이트
  for (const issue of testResult.issues_found) {
    const pattern = db.issue_patterns.find(p => p.issue_type === issue.type);

    if (pattern) {
      pattern.occurrence_count++;
      pattern.affected_pages.push(testResult.page_url);
    } else {
      db.issue_patterns.push({
        pattern_id: generateId(),
        issue_type: issue.type,
        symptoms: [issue.description],
        occurrence_count: 1,
        affected_pages: [testResult.page_url],
        successful_fixes: [],
        avg_resolution_time: 0
      });
    }
  }

  // 수정 전략 통계 업데이트
  for (const attempt of testResult.resolution_attempts) {
    const strategy = db.fix_strategies.find(s => s.type === attempt.strategy);

    if (strategy) {
      strategy.attempts++;
      if (attempt.success) strategy.successes++;
      strategy.success_rate = strategy.successes / strategy.attempts;
    } else {
      db.fix_strategies.push({
        type: attempt.strategy,
        attempts: 1,
        successes: attempt.success ? 1 : 0,
        success_rate: attempt.success ? 1 : 0
      });
    }
  }

  // DB 저장
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}
```

## Pattern 7: Intelligent Reporting

### 리포트 생성
```typescript
async function generateIntelligentReport(
  testHistory: TestHistory,
  learningData: LearningDatabase
) {
  const report = {
    // 기본 정보
    test_id: testHistory.test_id,
    timestamp: testHistory.timestamp,
    page_url: testHistory.page_url,

    // 테스트 결과
    summary: {
      total_scenarios: testHistory.test_scenarios.length,
      passed: testHistory.test_scenarios.filter(s => s.status === 'passed').length,
      failed: testHistory.test_scenarios.filter(s => s.status === 'failed').length,
      total_attempts: testHistory.resolution_attempts.length,
      final_status: testHistory.final_status
    },

    // 이슈 분석
    issues: testHistory.issues_found.map(issue => ({
      ...issue,
      // 학습 데이터 기반 분석
      is_recurring: isRecurringIssue(issue, learningData),
      similar_issues: findSimilarIssues(issue, learningData),
      recommended_fix: recommendFix(issue, learningData)
    })),

    // 학습 포인트
    learning_points: extractLearningPoints(testHistory, learningData),

    // 개선 제안
    recommendations: generateRecommendations(testHistory, learningData),

    // 통계
    statistics: {
      avg_resolution_time: calculateAvgResolutionTime(testHistory),
      success_rate: calculateSuccessRate(testHistory),
      comparison_to_history: compareToHistory(testHistory, learningData)
    }
  };

  // Markdown 생성
  const markdown = generateMarkdownReport(report);
  await fs.writeFile(
    `.claude/qa-reports/${testHistory.test_id}.md`,
    markdown
  );

  // JSON 생성
  await fs.writeFile(
    `.claude/qa-reports/${testHistory.test_id}.json`,
    JSON.stringify(report, null, 2)
  );

  return report;
}
```

## Best Practices

### DO
✅ 과거 테스트 데이터를 분석하여 패턴 파악
✅ 유사한 이슈에 성공한 해결책 재사용
✅ 중요도 순으로 테스트 우선순위 지정
✅ 페이지 타입에 맞는 맞춤형 테스트 실행
✅ 학습 데이터를 지속적으로 업데이트
✅ 자동 수정 성공률 추적 및 개선

### DON'T
❌ 과거 데이터 무시하고 매번 처음부터 시작
❌ 모든 페이지에 동일한 테스트 적용
❌ 실패한 수정 전략 반복 사용
❌ 학습 데이터 축적 없이 일회성 테스트만 수행
❌ 우선순위 없이 무작위 테스트

## Integration Example

```typescript
// 전체 QA 자동화 플로우
async function runAutomatedQA(pageUrls: string[]) {
  console.log('🤖 Starting Intelligent QA System...\n');

  // 1. 학습 데이터 로드
  const learningDB = await loadLearningDatabase();
  console.log(`📚 Loaded ${learningDB.total_tests} historical tests\n`);

  // 2. 각 페이지 테스트
  for (const url of pageUrls) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${url}`);
    console.log('='.repeat(60));

    // 2.1 과거 데이터 분석
    const insights = await analyzePastTests(url, learningDB);
    console.log(`💡 Found ${insights.similar_tests} similar past tests`);

    // 2.2 테스트 우선순위 결정
    const priorities = await prioritizeTests(url);
    console.log(`📋 Prioritized ${priorities.length} test scenarios`);

    // 2.3 반복 테스트 실행
    const result = await runIterativeTest(url, {
      max_retries: 5,
      retry_delay: 2000,
      auto_fix_enabled: true
    });

    // 2.4 학습 데이터 업데이트
    await updateLearningDatabase(result);

    // 2.5 인텔리전트 리포트 생성
    await generateIntelligentReport(result, learningDB);
  }

  console.log('\n✅ QA Automation Complete!');
}
```

이 패턴들을 활용하여 점점 더 똑똑해지는 자가 학습형 QA 시스템을 구축한다.
