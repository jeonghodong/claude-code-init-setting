# QA Testing Guides Index

이 디렉토리는 프로젝트의 품질 보증(Quality Assurance)을 위한 종합 테스팅 가이드를 제공합니다.

## 📚 문서 목록

### 1. UI/UX Testing (`ui-ux-testing.md`)
**사용 시기**: 사용자 인터페이스 컴포넌트 개발 및 수정 시

**주요 내용**:
- 시각적 일관성 검증
- 사용자 경험 테스팅
- 인터랙티브 요소 검증
- 디자인 시스템 준수 확인

**활용 예시**:
```
"새로운 폼 컴포넌트를 만들었어" → ui-ux-testing.md 참조
"버튼 스타일을 업데이트했어" → ui-ux-testing.md 참조
```

---

### 2. Accessibility Testing (`accessibility-testing.md`)
**사용 시기**: 모든 UI 컴포넌트 개발 시 (필수)

**주요 내용**:
- WCAG 2.1 AA/AAA 준수
- 키보드 내비게이션
- 스크린 리더 호환성
- 색상 대비 검증
- ARIA 속성 검증

**활용 예시**:
```
"모달 다이얼로그를 구현했어" → accessibility-testing.md 참조
"폼 유효성 검사를 추가했어" → accessibility-testing.md 참조
```

---

### 3. Performance Testing (`performance-testing.md`)
**사용 시기**: 성능 최적화가 필요한 기능 개발 시

**주요 내용**:
- 로딩 시간 측정
- 번들 크기 최적화
- 렌더링 성능
- 메모리 사용량
- Core Web Vitals

**활용 예시**:
```
"대량의 데이터를 렌더링해야 해" → performance-testing.md 참조
"페이지가 느려진 것 같아" → performance-testing.md 참조
```

---

### 4. Integration Testing (`integration-testing.md`)
**사용 시기**: 여러 컴포넌트/모듈이 함께 동작하는 기능 개발 시

**주요 내용**:
- 컴포넌트 간 통신 테스트
- API 통합 테스트
- 상태 관리 검증
- 데이터 흐름 테스트

**활용 예시**:
```
"인증 플로우를 구현했어" → integration-testing.md 참조
"여러 컴포넌트가 연동되는 기능이야" → integration-testing.md 참조
```

---

### 5. E2E Testing (`e2e-testing.md`)
**사용 시기**: 사용자 시나리오 전체를 검증해야 할 때

**주요 내용**:
- Playwright를 이용한 E2E 테스트
- 사용자 시나리오 작성
- 크로스 브라우저 테스팅
- 자동화된 사용자 플로우

**활용 예시**:
```
"회원가입부터 로그인까지 전체 플로우를 테스트하고 싶어" → e2e-testing.md 참조
"실제 사용자처럼 동작하는지 확인하고 싶어" → e2e-testing.md 참조
```

---

### 6. Visual Regression Testing (`visual-regression-testing.md`)
**사용 시기**: UI 변경 사항이 의도하지 않은 시각적 변화를 일으키지 않는지 확인

**주요 내용**:
- 스크린샷 비교
- 시각적 차이 감지
- CSS 변경 영향 분석
- 반응형 디자인 회귀 테스트

**활용 예시**:
```
"스타일을 변경했는데 다른 페이지에 영향이 없는지 확인하고 싶어" → visual-regression-testing.md 참조
"디자인 시스템을 업데이트했어" → visual-regression-testing.md 참조
```

---

## 🎯 Quick Reference

### 컴포넌트 개발 시 체크리스트

```markdown
☐ UI/UX Testing 완료
☐ Accessibility Testing 완료 (필수)
☐ Performance Testing 검토
☐ Integration Testing 작성 (필요 시)
☐ E2E Testing 작성 (주요 플로우)
☐ Visual Regression Testing (UI 변경 시)
```

### 테스팅 우선순위

1. **필수 (모든 컴포넌트)**:
   - Accessibility Testing
   - UI/UX Testing

2. **권장 (복잡한 기능)**:
   - Integration Testing
   - Performance Testing

3. **선택적 (주요 플로우)**:
   - E2E Testing
   - Visual Regression Testing

---

### 7. Functional Testing (`functional-testing.md`)
**사용 시기**: Playwright 기반 기능 테스트 수행 시

**주요 내용**:
- 사용자 관점 테스트 시나리오
- 폼 검증 및 제출 플로우
- 인증/권한 테스트
- API 상호작용 검증
- 모바일 & 반응형 테스트

**활용 예시**:
```
"페이지 기능을 자동으로 테스트하고 싶어" → functional-testing.md 참조
"로그인부터 데이터 제출까지 전체 플로우 검증" → functional-testing.md 참조
```

---

### 8. Issue Documentation (`issue-documentation.md`)
**사용 시기**: QA 테스트 중 이슈 발견 시

**주요 내용**:
- 표준 이슈 리포트 템플릿
- 심각도 분류 (Critical/High/Medium/Low)
- 재현 단계 작성법
- 스크린샷/로그 첨부 가이드
- JSON 형식 구조화

**활용 예시**:
```
"이슈를 발견했는데 어떻게 문서화하지?" → issue-documentation.md 참조
"버그 리포트를 체계적으로 작성하고 싶어" → issue-documentation.md 참조
```

---

### 9. Test Automation Patterns (`test-automation-patterns.md`)
**사용 시기**: 자가 학습형 QA 시스템 구축 시

**주요 내용**:
- 과거 테스트 데이터 학습
- 반복 테스트 및 자동 수정
- 스마트 테스트 우선순위
- 컨텍스트 인식 테스팅
- 학습 데이터베이스 관리

**활용 예시**:
```
"테스트가 점점 똑똑해지게 만들고 싶어" → test-automation-patterns.md 참조
"과거 이슈를 학습해서 자동으로 감지하고 싶어" → test-automation-patterns.md 참조
```

---

### 10. Data Cleanup (`data-cleanup.md`)
**사용 시기**: 테스트 데이터 정리가 필요할 때

**주요 내용**:
- 삭제 기능을 통한 데이터 정리
- 생성 → 검증 → 삭제 사이클
- 사용자 계정 정리
- 파일/컨텐츠 정리
- 비용 최적화 전략

**활용 예시**:
```
"테스트 후 생성된 데이터를 자동으로 삭제하고 싶어" → data-cleanup.md 참조
"테스트 비용을 절감하고 싶어" → data-cleanup.md 참조
```

---

## 🚀 자동화된 QA 프로세스

Claude는 다음 키워드를 감지하면 자동으로 관련 가이드를 적용합니다:

| 키워드 | 자동 적용 가이드 |
|--------|------------------|
| "컴포넌트", "UI", "스타일" | ui-ux-testing.md |
| "접근성", "a11y", "ARIA" | accessibility-testing.md |
| "느려", "성능", "최적화" | performance-testing.md |
| "통합", "API", "연동" | integration-testing.md |
| "E2E", "사용자 플로우" | e2e-testing.md |
| "시각적", "스크린샷", "회귀" | visual-regression-testing.md |
| "기능 테스트", "Playwright", "자동화" | functional-testing.md |
| "이슈", "버그", "문서화" | issue-documentation.md |
| "학습", "자동 수정", "반복 테스트" | test-automation-patterns.md |
| "데이터 정리", "삭제", "비용 절감" | data-cleanup.md |

---

## 📖 사용 방법

### 자동 적용 (권장)
Claude가 작업 컨텍스트를 기반으로 자동으로 적절한 가이드를 적용합니다.

```
오야지: "새로운 버튼 컴포넌트를 만들었어"
Claude: [자동으로 ui-ux-testing.md + accessibility-testing.md 적용]
```

### 수동 참조
특정 가이드를 명시적으로 참조할 수 있습니다.

```
"@.claude/prompts/QA/accessibility-testing.md를 따라서 테스트해줘"
```

---

## 🔄 업데이트 정책

- 각 가이드는 프로젝트 요구사항 변경 시 업데이트
- 새로운 테스팅 도구 도입 시 관련 가이드 추가
- 팀 피드백 기반으로 지속적 개선

---

## 📝 기여 가이드

새로운 테스팅 가이드를 추가하려면:

1. `/Users/atad/Desktop/ATAD/project/ATAD_MONOREPO/apps/ATAD_ODIIN/.claude/prompts/QA/` 디렉토리에 새 파일 생성
2. 이 INDEX.md 파일 업데이트
3. CLAUDE.md의 Auto-Loading Rules 섹션 업데이트 (필요 시)

---

**마지막 업데이트**: 2025-10-20
**관리자**: ATAD Team
