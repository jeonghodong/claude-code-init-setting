---
description: 코드 품질 체크리스트 출력 - 4원칙 전체 체크리스트 확인
allowed-tools: Read
---

# 프론트엔드 코드 품질 체크리스트

## 참조 스킬

이 체크리스트는 `code-quality-review` 스킬을 기반으로 합니다.
상세 내용은 `.claude/skills/code-quality-review/SKILL.md`를 참조하세요.

---

## 1. 가독성 (Readability)

### 맥락 줄이기
- [ ] 같이 실행되지 않는 코드가 별도 컴포넌트로 분리되어 있는가?
- [ ] 구현 상세가 적절한 추상화 레벨로 감싸져 있는가?
- [ ] 로직 종류에 따라 Hook/함수가 적절히 분리되어 있는가?

### 이름 붙이기
- [ ] 복잡한 조건에 의미 있는 이름이 붙어있는가? (`isSameCategory`, `isPriceInRange`)
- [ ] 매직 넘버가 상수로 정의되어 있는가? (`ANIMATION_DELAY_MS = 300`)

### 위에서 아래로 읽히게 하기
- [ ] 시점 이동(여러 파일/함수로 점프)이 최소화되어 있는가?
- [ ] 중첩 삼항 연산자가 IIFE + if문으로 단순화되어 있는가?
- [ ] 범위 조건이 수학 부등식 순서대로 작성되어 있는가? (`b <= a && a <= c`)

---

## 2. 예측 가능성 (Predictability)

### 이름 관리
- [ ] 라이브러리와 동일한 이름으로 다른 동작을 하는 함수가 없는가?
- [ ] 추가 동작이 함수명에 명시되어 있는가? (`getWithAuth` vs `get`)

### 반환 타입 통일
- [ ] 같은 종류의 API Hook들이 동일한 반환 타입을 가지는가?
- [ ] 검증 함수들이 일관된 타입을 반환하는가? (`{ ok: boolean, reason?: string }`)
- [ ] Discriminated Union이 적절히 사용되고 있는가?

### 숨은 로직 드러내기
- [ ] 함수명/파라미터로 예측할 수 없는 숨은 로직(로깅, 분석)이 없는가?
- [ ] 부수 효과가 호출 측에서 명시적으로 처리되는가?

---

## 3. 응집도 (Cohesion)

### 디렉토리 구조
- [ ] 함께 수정되는 파일들이 같은 디렉토리에 있는가?
- [ ] 종류별(components, hooks, utils)이 아닌 도메인별로 분류되어 있는가?

### 관련 코드 묶기
- [ ] 애니메이션 시간과 delay 함수가 같은 상수를 참조하는가?
- [ ] 관련 상수와 로직이 함께 관리되고 있는가?

### 폼 응집도
- [ ] 필드별 독립 검증이 필요하면 필드 단위 응집도를 사용하는가?
- [ ] 단일 비즈니스 로직이면 폼 전체 단위 응집도(Zod 스키마)를 사용하는가?

---

## 4. 결합도 (Coupling)

### 책임 분리
- [ ] 하나의 Hook이 "페이지의 모든 쿼리 파라미터를 관리"하고 있지 않은가?
- [ ] 각 Hook이 하나의 책임만 가지는가? (`useCardIdQueryParam`, `useDateFromQueryParam`)

### 중복 코드 허용
- [ ] 동작이 완전히 동일할 때만 공통화하고 있는가?
- [ ] 향후 변경 가능성이 있으면 중복을 허용하고 있는가?

### Props Drilling 해결
- [ ] 부모가 사용하지 않는 prop을 단순히 전달만 하고 있지 않은가?
- [ ] Composition 패턴(children)으로 depth를 줄일 수 있는가?
- [ ] 정말 필요한 경우에만 Context API를 사용하는가?

---

## 사용법

```bash
# 전체 리뷰 (code-quality-reviewer 에이전트 실행)
/quality/review src/components/MyComponent.tsx

# 특정 원칙만 분석 (code-quality-reviewer 에이전트 실행)
/quality/analyze readability src/components/MyComponent.tsx
/quality/analyze coupling src/hooks/usePageState.ts

# 리팩토링 실행 (refactor-specialist 에이전트 실행)
/quality/refactor src/components/MyComponent.tsx
```

## 관련 에이전트

- `code-quality-reviewer`: 코드 품질 분석 전문가
- `refactor-specialist`: 리팩토링 실행 전문가
