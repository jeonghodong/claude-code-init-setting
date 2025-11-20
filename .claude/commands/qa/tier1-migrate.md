---
description: Tier 3 테스트를 Tier 1 자동화로 이관 - 자동화 스크립트 생성 및 CI/CD 통합
model: sonnet
argument-hint: <test-case-ids>
---

릴리즈 완료 후 Tier 3 신규 기능 테스트를 Tier 1 회귀 테스트로 자동화 이관하는 커맨드입니다.

예시: `/qa:tier1-migrate TC-NEWF-001,TC-NEWF-002,TC-NEWF-005`

**Test Case IDs**: $1 (쉼표로 구분, 예: TC-NEWF-001,TC-NEWF-002)

# Process

## Step 1: 테스트 케이스 검증

**입력 파싱**:
- TC ID 목록을 쉼표로 분리
- 각 TC ID 형식 검증 (TC-NEWF-XXX 또는 TC-[TIER]-XXX)

**테스트 케이스 읽기**:
각 TC에 대해:
1. Notion DB 또는 문서에서 테스트 케이스 찾기
2. 다음 정보 확인:
   - TC ID, 테스트명
   - 전제조건
   - 테스트 단계
   - 예상 결과
   - Priority (P0/P1/P2)

**자동화 적합성 평가**:
```
✅ Automatable (자동화 가능):
- 명확한 단계가 있음
- 결과가 명확하게 검증 가능
- UI 상호작용 또는 API 호출로 재현 가능

⚠️ Partially Automatable (부분 자동화):
- 일부 단계는 자동화, 일부는 수동
- 예: 기능은 자동화, 디자인 검수는 수동

❌ Not Automatable (자동화 불가):
- 주관적 판단 필요 (예: UX 직관성)
- 특수 하드웨어 필요
- 수동 검증만 가능
```

자동화 불가능한 테스트가 있으면:
```
⚠️ 다음 테스트는 자동화할 수 없습니다:
- TC-NEWF-XXX: [이유]

이 테스트는 Tier 2(탐색적 테스트)로 유지하거나 수동 테스트로 남겨두는 것을 권장합니다.
```

## Step 2: 자동화 우선순위 결정

**Priority 기반 순서**:
1. P0 (Critical) → 즉시 자동화 (이번 작업)
2. P1 (High) → 1주일 내 자동화 (이번 작업 포함 가능)
3. P2 (Medium) → 1개월 내 자동화 (백로그 추가)

사용자에게 확인:
```
다음 테스트를 자동화합니다:
- TC-NEWF-001 (P0) ✅
- TC-NEWF-002 (P0) ✅
- TC-NEWF-005 (P1) ✅

예상 작업 시간: Xh

계속 진행하시겠습니까? (Y/n)
```

## Step 3: qa-automation-engineer 에이전트 활용

각 테스트 케이스에 대해:

**3.1 Page Object 설계**:
- 필요한 Page Object 클래스 식별
- 기존 Page Object 재사용 여부 확인
- 새로운 Page Object 생성 필요 시 작성

**3.2 Test Spec 작성**:
- Playwright/TypeScript 자동화 스크립트 생성
- Page Object Model 패턴 적용
- Given-When-Then 구조 사용
- 명시적 대기(explicit waits) 사용
- TC ID를 테스트 이름에 포함

예시:
```typescript
test('TC-REG-001: 유효한 계정으로 로그인 성공 @smoke @auth @p0', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Given: 로그인 페이지에 접속한 상태
  await loginPage.goto();

  // When: 유효한 계정 정보로 로그인
  await loginPage.login('test@example.com', 'Test1234!');

  // Then: 대시보드로 리다이렉트
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(dashboardPage.userNameDisplay).toHaveText('Test User');
});
```

**3.3 Test Data 준비**:
- 테스트 데이터 fixture 작성
- 필요한 경우 setup/teardown 스크립트

**3.4 TC ID 변환**:
- TC-NEWF-XXX → TC-REG-XXX (Tier 1 회귀 테스트 ID)
- 파일명: `tests/specs/tier1-regression/[feature].spec.ts`
- 예: `tests/specs/tier1-regression/auth.spec.ts`

## Step 4: 로컬 테스트 실행

**자동화 스크립트 검증**:
```bash
# 개별 테스트 실행
npx playwright test tests/specs/tier1-regression/auth.spec.ts

# 특정 테스트만 실행 (TC ID로)
npx playwright test -g "TC-REG-001"

# 헤드풀 모드로 디버깅
npx playwright test --headed --debug
```

**품질 체크**:
- [ ] 모든 테스트가 로컬에서 통과
- [ ] 테스트 실행 시간 측정 (각 테스트 < 2분 권장)
- [ ] 테스트 간 독립성 확인 (순서에 관계없이 통과)
- [ ] Flaky 여부 확인 (3회 반복 실행 → 3회 모두 통과)

만약 실패하면:
- 로그 분석
- 필요 시 명시적 대기 추가
- Locator 개선
- 재테스트

## Step 5: CI/CD 파이프라인 통합

**GitHub Actions 워크플로우 업데이트**:

`.github/workflows/tier1-regression.yml`에 새 테스트 추가 확인

```yaml
name: Tier 1 Regression Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 9 * * *' # Daily at 9 AM

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run Tier 1 regression tests
        run: npm run test:tier1
      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

**Test Scripts 업데이트** (`package.json`):
```json
{
  "scripts": {
    "test:tier1": "playwright test tests/specs/tier1-regression/",
    "test:smoke": "playwright test --grep @smoke",
    "test:p0": "playwright test --grep @p0"
  }
}
```

**CI에서 테스트 실행**:
- 변경사항 커밋 및 푸시
- CI 파이프라인 자동 실행 확인
- 테스트 결과 확인

## Step 6: Notion DB 업데이트

**테스트 케이스 통합 DB 업데이트**:

각 테스트 케이스에 대해:
- **TC ID**: TC-NEWF-XXX → TC-REG-XXX로 변경 또는 새 행 추가
- **Tier**: Tier 3 → Tier 1로 변경
- **자동화 여부**: FALSE → TRUE
- **자동화 스크립트**: GitHub 링크 추가
  - 예: `https://github.com/org/repo/blob/main/tests/specs/tier1-regression/auth.spec.ts`
- **Status**: 작성완료 → Pass (최초 실행 후)

**qa-notion-formatter 스킬 활용**:
자동화된 테스트 정보를 Notion 형식으로 변환하여 업데이트

## Step 7: 자동화 커버리지 업데이트

**현재 커버리지 계산**:
```
이전: 35/50 tests = 70%
이번 이관: +3 tests
현재: 38/50 tests = 76%

목표: 40/50 tests = 80%
Gap: 2 tests 남음
```

**진행 상황 문서화**:
```markdown
## 자동화 커버리지 진행 상황

**Current**: 76% (38/50)
**Target**: 80% (40/50)
**Gap**: 2 tests

**Recent Migrations**:
- 2024-11-20: TC-NEWF-001, 002, 005 → TC-REG-051, 052, 053
- 2024-11-15: TC-NEWF-010, 011 → TC-REG-048, 049

**Next Candidates** (P1):
- TC-NEWF-012: Multi-file upload
- TC-NEWF-018: Advanced search filters
```

## Step 8: 마이그레이션 리포트 생성

```markdown
## Tier 3 → Tier 1 마이그레이션 완료 ✅

### 📋 마이그레이션 Summary

**Date**: YYYY-MM-DD
**Migrated Tests**: X개
**Total Time**: Xh

| Old TC ID | New TC ID | Test Name | Priority | Status |
|-----------|-----------|-----------|----------|--------|
| TC-NEWF-001 | TC-REG-051 | 로그인 성공 | P0 | ✅ Pass |
| TC-NEWF-002 | TC-REG-052 | 로그인 실패 | P0 | ✅ Pass |
| TC-NEWF-005 | TC-REG-053 | 계정 잠금 | P0 | ✅ Pass |

### 📁 생성된 파일
- `tests/pages/LoginPage.ts`
- `tests/specs/tier1-regression/auth.spec.ts`
- `tests/fixtures/authTestData.ts`

### 🧪 테스트 실행 결과
- **Local**: 3/3 tests passed ✅
- **CI**: 3/3 tests passed ✅
- **Average Duration**: 1m 45s

### 📊 자동화 커버리지
- **Before**: 70% (35/50)
- **After**: 76% (38/50)
- **Progress**: +6% (목표 80%까지 4% 남음)

### 🎯 다음 단계
1. 새 테스트 안정성 모니터링 (7일)
2. Flaky test 발생 시 즉시 수정
3. 다음 배치 마이그레이션 계획:
   - TC-NEWF-012, 018 (P1) 예정
```

# Guidelines

- **품질 우선**: 빠른 자동화보다 안정적인 자동화
- **독립적인 테스트**: 각 테스트는 다른 테스트에 의존하지 않음
- **명시적 대기**: `waitForTimeout` 금지, 조건 기반 대기 사용
- **의미있는 이름**: TC ID + 명확한 테스트 설명
- **재현 가능**: 로컬/CI 어디서든 동일한 결과
- **효율적인 실행**: 병렬 실행 가능하도록 설계
- **적절한 태그**: @smoke, @p0, @auth 등으로 분류
- **문서화**: 복잡한 로직은 주석으로 설명

# Quality Checks

마이그레이션 완료 전 확인:
- [ ] 모든 테스트 케이스 정보 확인 완료
- [ ] 자동화 적합성 평가 완료
- [ ] Page Object Model 패턴 적용
- [ ] 안정적인 locator 사용 (role, text, label 우선)
- [ ] 명시적 대기만 사용 (no waitForTimeout)
- [ ] Given-When-Then 구조 적용
- [ ] 로컬 테스트 3회 연속 통과
- [ ] CI 테스트 통과
- [ ] TC ID 변환 (NEWF → REG)
- [ ] Notion DB 업데이트
- [ ] 자동화 커버리지 업데이트
- [ ] 마이그레이션 리포트 생성

# Output Format

```markdown
## ✅ Tier 1 마이그레이션 완료

### 마이그레이션 Summary
- **테스트 수**: X개
- **소요 시간**: Xh
- **자동화 커버리지**: XX% → YY% (+Z%)

### 성공적으로 이관된 테스트
1. TC-NEWF-001 → TC-REG-051: 로그인 성공 ✅
2. TC-NEWF-002 → TC-REG-052: 로그인 실패 ✅
3. TC-NEWF-005 → TC-REG-053: 계정 잠금 ✅

### 생성된 파일
- tests/pages/LoginPage.ts
- tests/specs/tier1-regression/auth.spec.ts

### 실행 결과
- Local: 3/3 ✅
- CI: 3/3 ✅
- Duration: 1m 45s

### 다음 단계
1. 7일간 안정성 모니터링
2. 다음 배치 계획: TC-NEWF-012, 018
```

# Integration with CLAUDE.md

항상 `/Users/atad/Desktop/QA/CLAUDE.md`를 참조:
- **80% 자동화 커버리지 목표**: 6개월 내 달성
- **Tier 1 정의**: 자동화된 회귀 테스트
- **우선순위**: P0 즉시, P1 1주일, P2 1개월
- **CI/CD 통합**: 자동화 테스트는 파이프라인에서 실행

# Notes

- 이 커맨드는 **qa-automation-engineer 에이전트**를 내부적으로 활용합니다
- 마이그레이션 후 최소 7일간 안정성 모니터링을 권장합니다
- Flaky test 발견 시 즉시 `/qa:fix-flaky` 커맨드로 수정하세요
