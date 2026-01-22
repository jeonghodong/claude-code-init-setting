---
name: playwright-spec-generator
description: |
  E2E Playwright 테스트 코드 작성을 위한 SPEC.md 파일을 생성하는 스킬.
  이 스킬은 페이지 폴더에 테스트 명세서를 자동으로 생성하여 Spec-Driven Testing을 지원한다.

  사용 시점:
  - "SPEC 생성해줘", "테스트 스펙 만들어줘" 요청 시
  - "이 페이지 테스트 명세서 작성해줘" 요청 시
  - Playwright E2E 테스트를 위한 문서화가 필요할 때
  - data-testid 속성과 테스트 시나리오를 정의해야 할 때
---

# Spec Generator

E2E Playwright 테스트를 위한 SPEC.md 파일을 생성하는 스킬이다.

## 목적

이 스킬은 "Spec-Driven Development" 방식을 지원한다:

- Claude가 테스트 코드를 작성할 때 환각(Hallucination) 방지
- data-testid 기반의 안정적인 선택자(Selector) 사용 강제
- 개발자와 QA 간의 명확한 커뮤니케이션

## 사용 방법

### 기본 사용

```
/spec-generator <페이지_경로>
```

예시:

```
/spec-generator app/(route)/computing/virtual-machine
```

### 워크플로우

1. 해당 페이지의 TSX 파일 분석
2. UI 요소 식별 및 data-testid 제안
3. 예상 User Flow 추론
4. `assets/SPEC.template.md` 템플릿 기반으로 SPEC.md 생성
5. 해당 페이지 폴더에 SPEC.md 저장

## SPEC.md 필수 구성 요소

SPEC.md는 반드시 다음 5가지 섹션을 포함해야 한다:

### 1. UI Components & Selectors

화면에 존재하는 핵심 UI 요소와 Playwright 식별자 정의.

### 2. User Flows (Happy Path)

사용자가 정상적으로 진행하는 시나리오.

### 3. Edge Cases (Negative Path)

에러 발생 및 예외 상황 시나리오.

### 4. Backend Integration (Mocking Spec)

MSW 설정을 위한 API 명세.

### 5. State Changes

행동 후 화면 변화 (Success Message, Page Redirection 등).

## 페이지 분석 프로세스

### Step 1: 페이지 구조 파악

해당 페이지의 TSX 파일을 읽고 다음을 파악한다:

- 사용된 컴포넌트 (Button, Input, Select, Modal 등)
- 폼 필드와 유효성 검사 로직
- API 호출 패턴 (SWR hooks, mutation 등)
- 상태 관리 (useState, Zustand 등)

### Step 2: data-testid 네이밍 규칙

`references/data-testid-guide.md` 참조. 주요 규칙:

| 유형   | 패턴               | 예시                   |
| ------ | ------------------ | ---------------------- |
| Input  | `input-{name}`     | `input-instance-name`  |
| Button | `btn-{action}`     | `btn-create-submit`    |
| Select | `select-{name}`    | `select-os-type`       |
| Modal  | `modal-{name}`     | `modal-confirm-delete` |
| Table  | `table-{name}`     | `table-instance-list`  |
| Row    | `row-{identifier}` | `row-instance-{id}`    |
| Alert  | `alert-{type}`     | `alert-error-msg`      |
| Tab    | `tab-{name}`       | `tab-security-group`   |

### Step 3: 템플릿 적용

`assets/SPEC.template.md` 템플릿을 기반으로 SPEC.md를 생성한다.

### Step 4: 파일 저장

생성된 SPEC.md는 해당 페이지 폴더에 저장한다:

```
app/(route)/computing/virtual-machine/
├── page.tsx
├── SPEC.md  ← 여기에 생성
└── ...
```

## 출력 예시

````markdown
# Page Spec: Virtual Machine 목록

## 1. UI Components & Selectors

| Component     | Type   | data-testid       | Description    |
| ------------- | ------ | ----------------- | -------------- |
| Search Input  | Input  | `input-vm-search` | VM 검색 필드   |
| Create Button | Button | `btn-vm-create`   | VM 생성 버튼   |
| VM Table      | Table  | `table-vm-list`   | VM 목록 테이블 |
| Delete Button | Button | `btn-vm-delete`   | VM 삭제 버튼   |

## 2. User Flows

### Scenario A: VM 목록 조회 (Happy Path)

1. 페이지 진입
2. VM 목록 테이블이 로딩됨
3. **Expectation:** 테이블에 VM 목록이 표시됨

### Scenario B: VM 검색

1. `input-vm-search`에 "web-server" 입력
2. Enter 키 입력
3. **Expectation:** 필터링된 결과만 표시됨

## 3. Edge Cases

### Scenario C: 빈 목록

1. VM이 없는 상태에서 페이지 진입
2. **Expectation:** "VM이 없습니다" 메시지 표시

## 4. Backend Integration

- **API:** `GET /api/v1/virtual-machines`
- **Response (Success):**
  ```json
  { "items": [...], "total": 10 }
  ```
````

- **Response (Empty):**
  ```json
  { "items": [], "total": 0 }
  ```

## 5. State Changes

| Action  | Before         | After                           |
| ------- | -------------- | ------------------------------- |
| VM 삭제 | 목록에 VM 존재 | 목록에서 제거 + 성공 토스트     |
| VM 생성 | 생성 모달 열림 | 목록에 새 VM 추가 + 성공 토스트 |

```

## Resources

### assets/
- `SPEC.template.md`: SPEC.md 기본 템플릿

### references/
- `data-testid-guide.md`: data-testid 네이밍 가이드 상세 문서
```
