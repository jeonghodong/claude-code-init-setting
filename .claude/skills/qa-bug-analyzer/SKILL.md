---
name: QA Bug Analyzer
description: Perform root cause analysis (RCA) on bugs, determine priority, suggest solutions, and recommend test improvements. Use when the user reports a bug, asks for bug analysis, mentions "결함 분석", "RCA", "root cause", "버그", "이슈 분석", or provides error logs and reproduction steps.
---

# QA Bug Analyzer

## Purpose

This skill performs comprehensive bug analysis including root cause identification, severity assessment, priority determination, solution recommendations, and test improvement suggestions. It helps QA teams efficiently triage and resolve issues.

## When to Use

Use this skill when:
- User reports a bug or defect
- User asks for bug analysis or RCA (Root Cause Analysis)
- User mentions "결함 분석", "버그 분석", "이슈"
- User provides error logs, stack traces, or reproduction steps
- User asks for priority determination
- User wants solution recommendations
- User asks how to improve tests to catch similar bugs

## Instructions

### 1. Gather Bug Information

Collect comprehensive bug details:

**Required Information**:
- Bug description (현상)
- Reproduction steps (재현 단계)
- Environment (browser, OS, version)
- Reproduction rate (재현율: 항상/가끔/한번)
- Expected behavior (예상 동작)
- Actual behavior (실제 동작)

**Technical Information** (if available):
- Error messages
- Stack traces
- Console logs
- Network requests/responses
- Screenshots or videos

**Context**:
- Which Tier? (Tier 1/2/3)
- When discovered? (개발/테스트/프로덕션)
- User impact (영향 범위)

If information is missing, ask specific questions.

### 2. Perform Root Cause Analysis

Analyze the bug systematically:

**Immediate Cause**:
- What directly caused the error?
- Which component failed?
- What line of code?

**Root Cause**:
- Why did this happen?
- Was it a code issue, design flaw, missing requirement?
- Could this have been prevented?

**Contributing Factors**:
- Environmental issues?
- Timing/race conditions?
- Data-related problems?
- Integration issues?

### 3. Assess Severity and Priority

**Severity Assessment** (기술적 영향):
- **Critical**: Service down, data loss, security breach
- **High**: Major功能能 broken, workaround exists
- **Medium**: Minor功能能 issue, limited impact
- **Low**: Cosmetic issue, minimal impact

**Priority Determination** (비즈니스 영향):
Consider:
- User impact (몇 명에게 영향?)
- Frequency (얼마나 자주 발생?)
- Workaround availability (임시 해결책 있나?)
- Business criticality (비즈니스적으로 중요한가?)

Map to P0/P1/P2/P3 based on CLAUDE.md standards:
- **P0**: Service blocking, all users affected, no workaround
- **P1**: Major feature broken, many users affected
- **P2**: Minor feature issue, some users affected
- **P3**: Cosmetic issue, few users affected

### 4. Recommend Solutions

Provide actionable solutions:

**Immediate Fix** (Hotfix):
- Quick patch to unblock users
- Minimal code change
- Safe to deploy immediately

**Proper Fix** (Root cause solution):
- Address underlying issue
- Prevent similar bugs
- May require more time

**Long-term Improvements**:
- Architecture changes
- Process improvements
- Tool/monitoring enhancements

### 5. Suggest Test Improvements

Recommend how to catch similar bugs:
- New test cases to add
- Existing tests to update
- Automation opportunities
- Monitoring/alerting improvements
- Code review checklist updates

## Process

1. **Understand the Bug**
   - Read all provided information
   - Ask clarifying questions if needed
   - Reproduce mentally or request actual reproduction

2. **Analyze Root Cause**
   - Examine error messages and logs
   - Trace code flow (if code available)
   - Identify failure point
   - Determine why it failed

3. **Assess Impact**
   - Determine severity (technical)
   - Determine priority (business)
   - Estimate affected users
   - Check if workaround exists

4. **Recommend Solutions**
   - Immediate fix (hotfix)
   - Proper fix (root cause)
   - Long-term improvements

5. **Improve Testing**
   - What test cases are missing?
   - How to prevent regression?
   - Automation recommendations

6. **Document Findings**
   - Clear, structured analysis
   - Ready to share with team
   - Action items identified

## Guidelines

**DO**:
- Ask for missing information
- Consider multiple possible causes
- Think about similar bugs
- Provide specific, actionable recommendations
- Consider both quick and proper fixes
- Think about test improvements
- Reference CLAUDE.md standards
- Use clear, professional language
- Include reproduction steps verification

**DON'T**:
- Jump to conclusions without evidence
- Ignore environmental factors
- Overlook user impact
- Provide vague solutions
- Skip test improvement suggestions
- Blame individuals
- Use technical jargon without explanation
- Forget to assess priority

## Output Format

Provide analysis in this structure:

```markdown
## 🐛 버그 분석 리포트

### 기본 정보
- **버그 ID**: [Linear/Jira ID if available]
- **발견일**: [Date]
- **발견자**: [Who found it]
- **환경**: [Browser, OS, version]
- **Tier**: [Tier 1/2/3]
- **재현율**: [항상/가끔/한번]

---

### 현상 (Symptom)
[Clear description of what's happening]

### 재현 단계 (Reproduction Steps)
1. [Step 1]
2. [Step 2]
3. [Step 3]

### 예상 동작 (Expected Behavior)
[What should happen]

### 실제 동작 (Actual Behavior)
[What actually happens]

---

### 🔍 근본 원인 분석 (Root Cause Analysis)

#### 즉각적 원인 (Immediate Cause)
[What directly caused the error]

#### 근본 원인 (Root Cause)
[Why it happened - underlying issue]

#### 기여 요인 (Contributing Factors)
- [Factor 1]
- [Factor 2]

---

### ⚠️ 심각도 및 우선순위

#### 심각도 (Severity)
**[Critical/High/Medium/Low]**

이유:
- [Technical impact]
- [System impact]

#### 우선순위 (Priority)
**[P0/P1/P2/P3]**

판단 근거:
- 사용자 영향: [How many users]
- 발생 빈도: [How often]
- 회피 방법: [Workaround available?]
- 비즈니스 영향: [Business impact]

#### 영향 범위 (Impact Scope)
- 영향받는 사용자: [Percentage or number]
- 영향받는 기능: [Which features]
- 데이터 영향: [Any data issues]

---

### 🛠️ 해결 방안 (Solution Recommendations)

#### 1. 임시 조치 (Immediate Workaround)
[Quick fix to unblock users]

```[language]
[Code snippet if applicable]
```

예상 소요시간: [Time estimate]

#### 2. 근본 해결 (Proper Fix)
[Address root cause]

**백엔드 변경**:
- [Change 1]
- [Change 2]

**프론트엔드 변경**:
- [Change 1]
- [Change 2]

예상 소요시간: [Time estimate]
위험도: [Low/Medium/High]

#### 3. 장기 개선 (Long-term Improvements)
- [Improvement 1]
- [Improvement 2]
- [Improvement 3]

---

### ✅ 테스트 개선 사항 (Test Improvements)

#### 추가해야 할 테스트 케이스
1. **TC-[ID]: [Test name]**
   - 시나리오: [Scenario]
   - 검증 항목: [What to verify]
   - 자동화: [Yes/No]

2. **TC-[ID]: [Test name]**
   - 시나리오: [Scenario]
   - 검증 항목: [What to verify]
   - 자동화: [Yes/No]

#### 기존 테스트 개선
- [Existing test to update]
- [What to add to it]

#### 자동화 권장사항
- [Which tests to automate]
- [Priority: P0/P1/P2]
- [Estimated effort]

#### 모니터링 개선
- [What alerts to add]
- [What metrics to track]

---

### 📋 액션 아이템 (Action Items)

#### 즉시 (Immediate)
- [ ] [Action item 1] - 담당: [Owner] - 기한: [Date]
- [ ] [Action item 2] - 담당: [Owner] - 기한: [Date]

#### 단기 (Short-term)
- [ ] [Action item 1] - 담당: [Owner] - 기한: [Date]
- [ ] [Action item 2] - 담당: [Owner] - 기한: [Date]

#### 장기 (Long-term)
- [ ] [Action item 1] - 담당: [Owner]
- [ ] [Action item 2] - 담당: [Owner]

---

### 🔗 관련 정보 (Related Information)

- **Related Issues**: [Link to similar bugs]
- **Related Test Cases**: [Link to test cases]
- **PR**: [Link to fix PR when available]
- **Documentation**: [Link to relevant docs]

---

### 📝 추가 노트 (Additional Notes)

[Any additional observations, concerns, or recommendations]
```

## Examples

### Example 1: Frontend Null Pointer Bug

**Input**:
```
Bug: Dashboard loading infinitely

Reproduction:
1. Login successfully
2. Auto-redirect to dashboard
3. Loading spinner keeps spinning (30+ seconds)

Environment: Chrome 120, MacOS
Reproduction rate: 100% (Always)

Console error:
TypeError: Cannot read property 'data' of null
  at Dashboard.jsx:45

API Response:
GET /api/dashboard/summary
200 OK
{"data": null, "error": null}
```

**Output**:
```markdown
## 🐛 버그 분석 리포트

### 기본 정보
- **버그 ID**: #156
- **발견일**: 2024-11-20
- **발견자**: @디자이너
- **환경**: Chrome 120, MacOS Sonoma
- **Tier**: Tier 3 (신규 기능)
- **재현율**: 항상 (100%)

---

### 현상 (Symptom)
로그인 성공 후 대시보드로 리다이렉트되지만, 페이지가 무한 로딩 상태에 빠짐. 30초 이상 경과해도 로딩 스피너가 계속 돌아감.

### 재현 단계 (Reproduction Steps)
1. 로그인 페이지에서 유효한 계정으로 로그인
2. 대시보드로 자동 리다이렉트
3. 로딩 스피너가 무한정 표시됨
4. 페이지 컨텐츠가 로드되지 않음

### 예상 동작 (Expected Behavior)
대시보드 페이지가 3초 이내에 정상적으로 로드되어 사용자 데이터와 요약 정보가 표시되어야 함.

### 실제 동작 (Actual Behavior)
로딩 스피너만 계속 표시되고 페이지가 로드되지 않음. 콘솔에 에러 발생.

---

### 🔍 근본 원인 분석 (Root Cause Analysis)

#### 즉각적 원인 (Immediate Cause)
- `Dashboard.jsx:45`에서 `response.data.map()` 호출 시 `data`가 `null`
- JavaScript의 null pointer exception 발생
- 프론트엔드에서 null 체크 로직 누락

#### 근본 원인 (Root Cause)
1. **백엔드 API 설계 문제**:
   - 데이터가 없을 때 `{"data": null}` 반환
   - API 스펙이 명확하지 않음 (null vs 빈 배열)

2. **프론트엔드 방어 코드 부재**:
   - API 응답에 대한 null 체크 없음
   - 에러 바운더리 미구현
   - 타입 체크 부족

3. **테스트 커버리지 부족**:
   - 데이터 없는 경우에 대한 테스트 케이스 누락
   - 빈 상태(Empty State) 시나리오 미검증

#### 기여 요인 (Contributing Factors)
- TypeScript strict null checks 비활성화
- API 응답 validation 레이어 없음
- 코드 리뷰에서 방어 코드 체크리스트 부재

---

### ⚠️ 심각도 및 우선순위

#### 심각도 (Severity)
**Critical**

이유:
- 핵심 기능(대시보드) 완전 차단
- 로그인 후 아무 작업도 불가능
- 시스템 크래시 수준의 영향

#### 우선순위 (Priority)
**P0 (Critical)**

판단 근거:
- **사용자 영향**: 모든 사용자 (100%)
- **발생 빈도**: 매번 발생 (100% 재현율)
- **회피 방법**: 없음 (완전 차단)
- **비즈니스 영향**: 서비스 사용 불가, 릴리즈 차단 사유

#### 영향 범위 (Impact Scope)
- 영향받는 사용자: 전체 (100%)
- 영향받는 기능: 대시보드 전체, 로그인 후 모든 워크플로우
- 데이터 영향: 없음 (읽기 작업)

---

### 🛠️ 해결 방안 (Solution Recommendations)

#### 1. 임시 조치 (Immediate Workaround)
프론트엔드에 null 체크 추가 (Hotfix):

```javascript
// Dashboard.jsx:45
// Before (❌):
const items = response.data.map(item => ...);

// After (✅):
const data = response.data ?? [];
const items = data.map(item => ...);
```

예상 소요시간: 10분
위험도: Low (안전한 방어 코드)

#### 2. 근본 해결 (Proper Fix)

**백엔드 변경**:
1. API 스펙 명확화:
```javascript
// Before:
return { data: null, error: null };

// After:
return { data: [], error: null }; // 데이터 없을 때 빈 배열 반환
```

2. API 문서 업데이트:
   - 모든 array 타입은 빈 배열 반환
   - null은 에러 케이스에서만 사용

**프론트엔드 변경**:
1. TypeScript strict null checks 활성화:
```json
// tsconfig.json
{
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

2. API 응답 validation 레이어 추가:
```typescript
// api/validator.ts
export function validateDashboardResponse(response: any) {
  if (!response || typeof response.data === 'undefined') {
    throw new Error('Invalid API response');
  }
  return {
    data: response.data ?? []
  };
}
```

3. 에러 바운더리 구현:
```typescript
// ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  // Handle component errors gracefully
}
```

예상 소요시간: 2-4시간
위험도: Medium (여러 파일 변경 필요)

#### 3. 장기 개선 (Long-term Improvements)
- API 응답 스키마 validation (Zod, Yup 등)
- 전역 에러 핸들링 미들웨어
- Storybook에 Empty State 컴포넌트 추가
- API 목업 서버로 엣지 케이스 테스트

---

### ✅ 테스트 개선 사항 (Test Improvements)

#### 추가해야 할 테스트 케이스

1. **TC-DASH-001: 데이터 없을 때 빈 상태 표시**
   - 시나리오: API가 빈 배열 또는 null 반환
   - 검증 항목:
     - "데이터가 없습니다" 메시지 표시
     - 로딩 스피너 사라짐
     - 페이지 크래시 없음
   - 자동화: Yes (P0)
   - 담당: QA 헤드

2. **TC-DASH-002: API 에러 시 에러 메시지 표시**
   - 시나리오: API 호출 실패 (500, 404 등)
   - 검증 항목:
     - 명확한 에러 메시지
     - 재시도 버튼
     - 로그아웃 또는 홈 이동 옵션
   - 자동화: Yes (P0)
   - 담당: QA 헤드

3. **TC-DASH-003: API 타임아웃 처리**
   - 시나리오: API 응답이 10초 이상 지연
   - 검증 항목:
     - 타임아웃 메시지
     - 재시도 옵션
     - 무한 대기 방지
   - 자동화: Yes (P1)
   - 담당: 클라우드

4. **TC-DASH-004: 부분 데이터 로드 시나리오**
   - 시나리오: 일부 데이터만 있는 경우
   - 검증 항목:
     - 사용 가능한 데이터는 표시
     - 없는 섹션은 Empty State
   - 자동화: No (P2)
   - 담당: QA 헤드

#### 기존 테스트 개선
- **TC-LOGIN-001**에 "로그인 후 대시보드 로드 확인" 추가
- **회귀 테스트**에 null 응답 케이스 추가

#### 자동화 권장사항
이 버그는 회귀 가능성이 매우 높으므로:
- TC-DASH-001, 002, 003을 즉시 자동화 (이번 주)
- Tier 1으로 이관하여 매일 실행
- API 목업으로 다양한 응답 시나리오 테스트

예상 작업: 3-4시간 (Playwright 스크립트 작성)

#### 모니터링 개선
1. **클라이언트 에러 모니터링**:
   - Sentry 또는 Datadog에 `TypeError` 알림 추가
   - 임계값: 1분에 5회 이상 발생 시 알림

2. **API 응답 모니터링**:
   - `/api/dashboard/summary`의 `null` 응답 비율 추적
   - 목표: 0%

3. **로딩 시간 모니터링**:
   - 대시보드 로딩 시간 95 percentile < 3초
   - 10초 이상 로딩 시 자동 알림

---

### 📋 액션 아이템 (Action Items)

#### 즉시 (Immediate) - 24시간 내
- [x] Hotfix 배포: 프론트엔드 null 체크 추가 - 담당: @개발자A - 기한: 오늘
- [ ] 프로덕션 핫픽스 검증 - 담당: @QA헤드 - 기한: 오늘
- [ ] 사용자 공지 (이슈 해결 완료) - 담당: @PM - 기한: 오늘

#### 단기 (Short-term) - 이번 스프린트
- [ ] 백엔드 API 스펙 수정 - 담당: @개발자B - 기한: 11/22
- [ ] TypeScript strict checks 활성화 - 담당: @개발자A - 기한: 11/23
- [ ] 에러 바운더리 구현 - 담당: @개발자A - 기한: 11/24
- [ ] 새 테스트 케이스 4개 작성 및 자동화 - 담당: @QA헤드 - 기한: 11/25
- [ ] Tier 1 회귀 테스트에 추가 - 담당: @QA헤드 - 기한: 11/25

#### 장기 (Long-term) - 다음 스프린트
- [ ] API validation 레이어 구축 - 담당: @개발자B
- [ ] 전역 에러 핸들링 미들웨어 - 담당: @개발자A
- [ ] Storybook Empty States 추가 - 담당: @디자이너
- [ ] 코드 리뷰 체크리스트에 "방어 코드" 항목 추가 - 담당: @QA헤드

---

### 🔗 관련 정보 (Related Information)

- **Related Issues**:
  - #142: 비슷한 null pointer 이슈 (결제 페이지)
  - #98: 에러 핸들링 개선 필요 (지난 스프린트)
- **Related Test Cases**:
  - TC-LOGIN-001 (업데이트 필요)
  - TC-DASH-* (신규 생성 예정)
- **PR**: (수정 후 링크 추가)
- **Documentation**:
  - API 문서 업데이트 필요
  - 프론트엔드 에러 핸들링 가이드 작성 필요

---

### 📝 추가 노트 (Additional Notes)

**예방 차원의 개선사항**:
1. 모든 API 응답에 대한 validation 레이어 구축 권장
2. TypeScript를 적극 활용하여 컴파일 타임에 문제 발견
3. Storybook으로 다양한 상태(Loading, Empty, Error) 미리 확인
4. 코드 리뷰 시 "데이터 없으면?"을 항상 질문

**학습 포인트**:
- Tier 3에서 이런 케이스를 놓쳤다는 것은 테스트 시나리오 부족
- 엣지 케이스(Edge Case) 테스트의 중요성
- 방어적 프로그래밍(Defensive Programming)의 필요성

**유사 버그 재발 방지**:
- 다른 대시보드/리스트 컴포넌트도 동일 패턴 확인 필요
- 전체 코드베이스 audit 권장 (null/undefined 체크)
```

## Best Practices

1. **Be Thorough but Concise**
   - Include all important details
   - Avoid unnecessary verbosity
   - Use bullet points and structure

2. **Be Specific**
   - Reference exact files and line numbers
   - Provide concrete code examples
   - Give precise time estimates

3. **Be Actionable**
   - Every recommendation should be implementable
   - Assign owners when possible
   - Set realistic timelines

4. **Think Prevention**
   - How to catch this earlier?
   - What tests are missing?
   - What process improvements needed?

5. **Consider Context**
   - Check CLAUDE.md for priority standards
   - Consider current sprint workload
   - Think about user impact

## Integration with CLAUDE.md

- Follow P0-P3 priority definitions from CLAUDE.md
- Consider automation targets (80% coverage goal)
- Plan for Tier 1 migration
- Reference team roles and responsibilities
- Align with weekly workflow

## Notes

- Analysis should be professional and blame-free
- Focus on prevention, not just fixing
- Balance between quick fix and proper solution
- Always think about test improvements
- Document for future reference
