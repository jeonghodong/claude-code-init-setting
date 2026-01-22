# Page Spec: [페이지 이름]

> 이 문서는 E2E Playwright 테스트 코드 작성을 위한 명세서입니다.
> 개발자와 QA 엔지니어가 함께 참고하는 문서로, data-testid 속성과 테스트 시나리오를 정의합니다.

## 1. UI Components & Selectors

이 페이지에 존재하는 핵심 UI 요소들과 Playwright에서 사용할 식별자입니다.
*모든 요소는 `data-testid` 속성을 기준으로 식별합니다.*

| Component | Type | data-testid | Description |
|-----------|------|-------------|-------------|
| [이름] | [Input/Button/Select/...] | `[testid]` | [설명] |

### 네이밍 규칙 참고

- Input: `input-{name}` (예: `input-instance-name`)
- Button: `btn-{action}` (예: `btn-create-submit`)
- Select: `select-{name}` (예: `select-os-type`)
- Modal: `modal-{name}` (예: `modal-confirm-delete`)
- Table: `table-{name}` (예: `table-instance-list`)
- Row: `row-{name}-{id}` (예: `row-instance-i12345`)
- Alert: `alert-{type}` (예: `alert-error-msg`)
- Tab: `tab-{name}` (예: `tab-security-group`)

---

## 2. User Flows (Interaction Scenarios)

### Scenario A: [정상 시나리오 이름] (Happy Path)

**목적**: [이 시나리오의 목적]

**사전 조건**:
- [필요한 조건 1]
- [필요한 조건 2]

**Steps**:
1. [단계 1: 어떤 행동을 하는지]
2. [단계 2: 어떤 행동을 하는지]
3. [단계 3: 어떤 행동을 하는지]

**Expected Results**:
- [ ] [예상 결과 1]
- [ ] [예상 결과 2]
- [ ] [예상 결과 3]

---

### Scenario B: [두 번째 시나리오 이름] (Happy Path)

**목적**: [이 시나리오의 목적]

**사전 조건**:
- [필요한 조건]

**Steps**:
1. [단계 1]
2. [단계 2]

**Expected Results**:
- [ ] [예상 결과]

---

## 3. Edge Cases (Negative Path)

### Scenario C: [에러 시나리오 이름]

**목적**: [이 시나리오가 테스트하는 에러 케이스]

**Steps**:
1. [에러를 유발하는 행동]

**Expected Results**:
- [ ] [에러 메시지 또는 상태]
- [ ] [UI 상태 (버튼 비활성화 등)]

---

### Scenario D: [빈 상태/예외 시나리오]

**목적**: [빈 데이터 또는 예외 상황 테스트]

**Steps**:
1. [조건을 만족시키는 행동]

**Expected Results**:
- [ ] [예상되는 빈 상태 UI]

---

## 4. Backend Integration (Mocking Spec)

이 페이지 테스트를 위해 Mocking이 필요한 API 명세입니다.

### API 1: [API 이름]

- **Endpoint**: `[HTTP_METHOD] /api/v1/[path]`
- **Request Body** (있는 경우):
```json
{
  "field1": "value1",
  "field2": "value2"
}
```
- **Response (Success)**: `200 OK`
```json
{
  "id": "123",
  "status": "success"
}
```
- **Response (Error)**: `[STATUS_CODE] [ERROR_TYPE]`
```json
{
  "error": "Error message"
}
```

### API 2: [API 이름]

- **Endpoint**: `[HTTP_METHOD] /api/v1/[path]`
- **Response (Success)**: `200 OK`
```json
{
  "items": [],
  "total": 0
}
```

---

## 5. State Changes

행동에 따른 화면 상태 변화를 정의합니다.

| Action | Before State | After State | UI Feedback |
|--------|--------------|-------------|-------------|
| [행동 1] | [이전 상태] | [이후 상태] | [토스트/리다이렉트/모달] |
| [행동 2] | [이전 상태] | [이후 상태] | [토스트/리다이렉트/모달] |

### 상세 설명

#### [Action 1]
- **Trigger**: `[data-testid]` 클릭
- **Loading State**: [로딩 스피너/버튼 비활성화 등]
- **Success**: [성공 시 동작]
- **Error**: [실패 시 동작]

---

## 6. Test Data Requirements

테스트에 필요한 데이터 셋업입니다.

### 필수 데이터

| Data | Value | Purpose |
|------|-------|---------|
| [데이터 1] | [값] | [용도] |
| [데이터 2] | [값] | [용도] |

### Mock 데이터 파일

- `__tests__/e2e/fixtures/[page-name].json` - 이 페이지용 mock 데이터

---

## Checklist for Developers

- [ ] 모든 UI 요소에 `data-testid` 속성 추가
- [ ] 버튼 disabled 상태 처리
- [ ] 로딩 상태 표시
- [ ] 에러 메시지 표시
- [ ] 빈 상태 UI 구현

---

*문서 작성일: YYYY-MM-DD*
*최종 수정일: YYYY-MM-DD*
