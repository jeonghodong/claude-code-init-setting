---
name: QA Test Case Writer
description: Generate comprehensive Tier 3 test cases for new features based on requirements and acceptance criteria. Use when the user asks to write test cases, create test scenarios, or mentions "Tier 3", "new feature testing", "test case generation", or provides requirements/specifications.
---

# QA Test Case Writer

## Purpose

This skill generates structured, comprehensive test cases for Tier 3 (new feature testing) following the project's QA standards. It creates test cases that cover functional, non-functional, and edge case scenarios.

## When to Use

Use this skill when:
- User asks to write or generate test cases
- User mentions "Tier 3" or "new feature testing"
- User provides requirements or specifications for a new feature
- User asks for test scenarios or test coverage
- User mentions "acceptance criteria" or "인수 조건"

## Instructions

### 1. Gather Requirements
First, collect all necessary information:
- Feature name and description
- Detailed requirements
- Acceptance criteria (인수 조건)
- Priority (P0/P1/P2/P3)
- Test types needed (기능/성능/보안/UI)

If information is missing, ask the user for:
- What is the feature?
- What are the acceptance criteria?
- What priority is this? (P0/P1/P2/P3)

### 2. Analyze Requirements
- Identify main functionality
- List all acceptance criteria
- Determine test scope (functional, non-functional, UI/UX, integration)
- Consider edge cases and error scenarios

### 3. Generate Test Cases

Create test cases following this structure:

```markdown
### TC-[TIER]-[NUMBER]: [Test Name]
**Priority**: P0/P1/P2
**Test Type**: 기능/성능/보안/UI
**담당**: QA 헤드/클라우드/디자이너

**전제조건**:
- [Precondition 1]
- [Precondition 2]

**테스트 단계**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**예상 결과**:
- [Expected result 1]
- [Expected result 2]
- [Expected result 3]

**테스트 데이터**:
- [Test data if needed]

**비고**:
- [Additional notes if any]
```

### 4. Coverage Strategy

Ensure comprehensive coverage:

**Functional Testing (기능 테스트)**:
- Positive test cases (정상 케이스)
- Negative test cases (예외 처리)
- Boundary value testing (경계값)
- Input validation (유효성 검증)

**Non-Functional Testing (비기능 테스트)**:
- Performance (성능): Response time, throughput
- Security (보안): XSS, injection, authentication
- UI/UX: Design consistency, responsiveness
- Compatibility (호환성): Cross-browser, devices

**Integration Testing (통합 테스트)**:
- Integration with existing features
- API interactions
- Data consistency

### 5. Prioritization

Assign priority based on:
- **P0 (Critical)**: Core functionality, blocking issues
- **P1 (High)**: Important features, major user impact
- **P2 (Medium)**: Secondary features, minor impact
- **P3 (Low)**: Nice-to-have, cosmetic issues

## Process

1. **Understand the Feature**
   - Read requirements carefully
   - Identify acceptance criteria
   - Clarify ambiguities with user

2. **Plan Test Coverage**
   - List all test scenarios
   - Categorize by type (functional, non-functional)
   - Determine priority

3. **Write Test Cases**
   - Start with P0 critical path
   - Add P1 important scenarios
   - Include P2 edge cases
   - Document P3 nice-to-have tests

4. **Review and Validate**
   - Ensure all acceptance criteria covered
   - Check for missing scenarios
   - Verify test case clarity
   - Confirm priority assignments

5. **Format for Notion**
   - Structure for Tier 3 database
   - Include all required fields
   - Link to related issues if any

## Guidelines

**DO**:
- Start with positive test cases
- Include comprehensive negative testing
- Consider real user scenarios
- Write clear, step-by-step instructions
- Specify expected results precisely
- Include test data when needed
- Reference CLAUDE.md standards

**DON'T**:
- Assume implicit steps
- Skip edge cases
- Write vague expected results
- Ignore non-functional requirements
- Forget to assign priority
- Overlook integration scenarios

## Examples

### Example 1: Login Feature

**Input**:
```
Feature: Email/Password Login
Requirements:
- User can login with email and password
- Validate email format
- Password minimum 8 characters
- Lock account after 5 failed attempts

Acceptance Criteria:
1. Successful login redirects to dashboard
2. Failed login shows clear error message
3. Account locked after 5 failures
4. Locked accounts can be recovered

Priority: P0
```

**Output**:
```markdown
### TC-NEWF-001: 유효한 계정으로 로그인 성공
**Priority**: P0
**Test Type**: 기능
**담당**: QA 헤드

**전제조건**:
- 가입된 사용자 계정 존재 (test@example.com / Test1234!)
- 계정이 잠금 상태가 아님

**테스트 단계**:
1. 로그인 페이지 접속 (/login)
2. 이메일 입력: test@example.com
3. 비밀번호 입력: Test1234!
4. "로그인" 버튼 클릭

**예상 결과**:
- 대시보드 페이지로 리다이렉트 (/dashboard)
- 우측 상단에 사용자 이름 표시
- localStorage에 JWT 토큰 저장
- 응답 시간 < 2초

**테스트 데이터**:
- Email: test@example.com
- Password: Test1234!

**비고**: 크롬, 사파리, 모바일 모두 확인 필요

---

### TC-NEWF-002: 잘못된 비밀번호로 로그인 실패
**Priority**: P0
**Test Type**: 기능
**담당**: QA 헤드

**전제조건**:
- 가입된 사용자 계정 존재

**테스트 단계**:
1. 로그인 페이지 접속
2. 유효한 이메일 입력: test@example.com
3. 잘못된 비밀번호 입력: WrongPass123!
4. "로그인" 버튼 클릭

**예상 결과**:
- 에러 메시지 표시: "이메일 또는 비밀번호가 일치하지 않습니다"
- 로그인 페이지 유지
- 로그인 실패 로그 기록
- 실패 횟수 증가 (서버)

---

### TC-NEWF-003: 5회 실패 후 계정 잠금
**Priority**: P0
**Test Type**: 보안
**담당**: 클라우드

**전제조건**:
- 가입된 사용자 계정 존재
- 실패 횟수 0회

**테스트 단계**:
1. 잘못된 비밀번호로 로그인 시도 5회 반복
2. 6번째 로그인 시도 (올바른 비밀번호)

**예상 결과**:
- 6번째 시도에서 "계정이 잠겼습니다. 이메일을 확인하세요" 메시지
- 계정 복구 이메일 발송
- 더 이상 로그인 불가
- 관리자 알림 발송

**비고**: 보안 중요 케이스, 자동화 필수

---

### TC-NEWF-004: 유효하지 않은 이메일 형식
**Priority**: P1
**Test Type**: 기능
**담당**: QA 헤드

**전제조건**: 없음

**테스트 단계**:
1. 로그인 페이지 접속
2. 잘못된 이메일 형식 입력
   - test (도메인 없음)
   - test@ (도메인 불완전)
   - @example.com (계정 없음)
3. 비밀번호 입력
4. "로그인" 버튼 클릭 시도

**예상 결과**:
- 이메일 입력란 아래 실시간 에러 메시지
- "올바른 이메일 형식을 입력하세요"
- 로그인 버튼 비활성화 또는 클릭 시 에러

**테스트 데이터**:
- Invalid emails: test, test@, @example.com, test@.com

---

### TC-NEWF-005: UI/UX 검수
**Priority**: P2
**Test Type**: UI
**담당**: 디자이너

**전제조건**: 로그인 페이지 접속

**테스트 단계**:
1. 디자인 가이드와 비교
2. 반응형 레이아웃 확인 (PC/Tablet/Mobile)
3. 입력 필드 포커스 확인
4. 에러 메시지 스타일 확인
5. 버튼 호버/클릭 상태 확인

**예상 결과**:
- 디자인 가이드 100% 준수
- 모든 디바이스에서 레이아웃 정상
- 명확한 포커스 인디케이터
- 일관된 에러 메시지 스타일
- 버튼 상태 변화 명확

**비고**: Figma 디자인과 1:1 비교 필요
```

### Example 2: AI Chatbot Feature

**Input**:
```
Feature: AI 챗봇 도우미
Requirements:
- 우측 하단에 챗봇 아이콘 표시
- 클릭 시 채팅창 오픈
- 사용자 질문에 AI 응답 (3초 이내)
- 대화 히스토리 저장 (최근 10개)

Acceptance Criteria:
1. 모든 페이지에서 아이콘 표시
2. 응답 시간 < 3초
3. 부적절한 질문 필터링
4. 모바일 정상 동작

Priority: P0
```

**Output**: [Generate 10-15 comprehensive test cases covering all acceptance criteria, edge cases, and non-functional requirements]

## Best Practices

1. **Be Specific**
   - Avoid "확인한다" → Use "대시보드 URL(/dashboard)로 리다이렉트"
   - Avoid "에러 표시" → Use "빨간색 에러 메시지: '이메일 또는 비밀번호가 일치하지 않습니다'"

2. **Include Test Data**
   - Provide specific test accounts, inputs, expected outputs
   - Document edge cases and boundary values

3. **Consider Real Usage**
   - Think like an actual user
   - Include common user mistakes
   - Test realistic scenarios

4. **Cross-Reference**
   - Link to requirements
   - Reference acceptance criteria
   - Mention related test cases

5. **Plan for Automation**
   - Mark P0/P1 cases as automation candidates
   - Write steps that can be automated
   - Include clear verification points

## Error Handling

If requirements are unclear:
1. Ask clarifying questions
2. List assumptions
3. Request acceptance criteria
4. Suggest what information is needed

If acceptance criteria are missing:
1. Infer reasonable criteria from requirements
2. Ask user to confirm
3. Document assumptions

## Output Format

Provide test cases in two formats:

1. **Markdown Format** (for documentation)
   - Structured as shown in examples
   - Ready to copy to Notion

2. **Summary Table** (for overview)
   ```
   | TC ID | Test Name | Priority | Type | 담당 | Status |
   |-------|-----------|----------|------|------|--------|
   | TC-NEWF-001 | 로그인 성공 | P0 | 기능 | QA헤드 | 작성완료 |
   ```

3. **Coverage Report**
   ```
   Test Coverage Summary:
   - Total Test Cases: 15
   - By Priority: P0(5), P1(6), P2(3), P3(1)
   - By Type: 기능(8), 성능(2), 보안(2), UI(3)
   - By Owner: QA헤드(8), 클라우드(4), 디자이너(3)

   Acceptance Criteria Coverage:
   ✅ Criterion 1: 5 test cases
   ✅ Criterion 2: 4 test cases
   ✅ Criterion 3: 3 test cases
   ✅ Criterion 4: 3 test cases
   ```

## Integration with CLAUDE.md

Always follow the standards defined in `/Users/atad/Desktop/QA/CLAUDE.md`:
- Use 3-Tier system (this is Tier 3)
- Follow priority definitions (P0-P3)
- Assign roles correctly (QA헤드, 클라우드, 디자이너, 개발자)
- Plan for Tier 1 migration (automation candidates)
- Use standard test case template

## Notes

- Test cases should be clear enough for any team member to execute
- Include enough detail but avoid over-specification
- Balance between thoroughness and maintainability
- Consider automation from the start
- Reference the project's CLAUDE.md for standards
