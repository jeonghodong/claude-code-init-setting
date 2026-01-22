# data-testid 네이밍 가이드

## 개요

`data-testid`는 Playwright E2E 테스트에서 요소를 안정적으로 식별하기 위한 속성이다.
CSS 선택자(`div > div:nth-child(3)`)나 클래스명에 의존하지 않아 UI 변경에도 테스트가 깨지지 않는다.

## 네이밍 규칙

### 기본 원칙

1. **kebab-case** 사용: `btn-create-instance` (O), `btnCreateInstance` (X)
2. **의미 있는 이름**: 요소의 목적을 명확히 표현
3. **유일성**: 페이지 내에서 고유해야 함 (동적 ID 포함 가능)
4. **일관성**: 동일 유형의 요소는 동일한 패턴 사용

### 유형별 패턴

#### Input 요소

```
input-{field-name}
```

| 예시 | 설명 |
|------|------|
| `input-instance-name` | 인스턴스 이름 입력 필드 |
| `input-search` | 검색 입력 필드 |
| `input-email` | 이메일 입력 필드 |
| `input-password` | 비밀번호 입력 필드 |
| `input-description` | 설명 입력 필드 |

#### Button 요소

```
btn-{action}[-{context}]
```

| 예시 | 설명 |
|------|------|
| `btn-create` | 생성 버튼 |
| `btn-create-submit` | 생성 폼 제출 버튼 |
| `btn-delete` | 삭제 버튼 |
| `btn-cancel` | 취소 버튼 |
| `btn-save` | 저장 버튼 |
| `btn-edit` | 편집 버튼 |
| `btn-close` | 닫기 버튼 |
| `btn-confirm` | 확인 버튼 |
| `btn-retry` | 재시도 버튼 |

#### Select/Dropdown 요소

```
select-{name}
```

| 예시 | 설명 |
|------|------|
| `select-region` | 리전 선택 |
| `select-os-type` | OS 유형 선택 |
| `select-instance-size` | 인스턴스 크기 선택 |
| `select-vpc` | VPC 선택 |

#### Select Option 요소

```
option-{select-name}-{value}
```

| 예시 | 설명 |
|------|------|
| `option-region-seoul` | 서울 리전 옵션 |
| `option-os-type-ubuntu` | Ubuntu OS 옵션 |

#### Checkbox 요소

```
checkbox-{name}
```

| 예시 | 설명 |
|------|------|
| `checkbox-agree-terms` | 약관 동의 체크박스 |
| `checkbox-select-all` | 전체 선택 체크박스 |
| `checkbox-row-{id}` | 테이블 행 선택 체크박스 |

#### Radio 요소

```
radio-{group}-{value}
```

| 예시 | 설명 |
|------|------|
| `radio-size-small` | 크기 선택 - small |
| `radio-size-medium` | 크기 선택 - medium |
| `radio-size-large` | 크기 선택 - large |

#### Modal 요소

```
modal-{name}
modal-{name}-{element}
```

| 예시 | 설명 |
|------|------|
| `modal-confirm-delete` | 삭제 확인 모달 |
| `modal-create-instance` | 인스턴스 생성 모달 |
| `modal-confirm-delete-title` | 삭제 확인 모달 제목 |
| `modal-confirm-delete-message` | 삭제 확인 모달 메시지 |

#### Table 요소

```
table-{name}
table-{name}-header
table-{name}-body
row-{name}-{id}
cell-{name}-{column}
```

| 예시 | 설명 |
|------|------|
| `table-instance-list` | 인스턴스 목록 테이블 |
| `table-instance-list-header` | 테이블 헤더 |
| `row-instance-i12345` | 특정 인스턴스 행 |
| `cell-instance-name` | 인스턴스 이름 셀 |

#### Tab 요소

```
tab-{name}
tab-panel-{name}
```

| 예시 | 설명 |
|------|------|
| `tab-overview` | 개요 탭 |
| `tab-security-group` | 보안 그룹 탭 |
| `tab-panel-overview` | 개요 탭 패널 |

#### Alert/Message 요소

```
alert-{type}
toast-{type}
```

| 예시 | 설명 |
|------|------|
| `alert-error` | 에러 알림 |
| `alert-warning` | 경고 알림 |
| `alert-info` | 정보 알림 |
| `toast-success` | 성공 토스트 메시지 |
| `toast-error` | 에러 토스트 메시지 |

#### Card/Section 요소

```
card-{name}
section-{name}
```

| 예시 | 설명 |
|------|------|
| `card-instance-detail` | 인스턴스 상세 카드 |
| `section-network-settings` | 네트워크 설정 섹션 |

#### Navigation 요소

```
nav-{name}
link-{destination}
```

| 예시 | 설명 |
|------|------|
| `nav-sidebar` | 사이드바 네비게이션 |
| `link-dashboard` | 대시보드 링크 |
| `link-instance-detail` | 인스턴스 상세 링크 |

#### Loading/State 요소

```
loading-{context}
empty-{context}
error-{context}
```

| 예시 | 설명 |
|------|------|
| `loading-table` | 테이블 로딩 스피너 |
| `loading-page` | 페이지 로딩 |
| `empty-instance-list` | 빈 인스턴스 목록 상태 |
| `error-load-failed` | 로드 실패 에러 |

---

## 동적 ID 처리

동적으로 생성되는 요소는 고유 식별자를 포함한다:

```tsx
// 테이블 행
<tr data-testid={`row-instance-${instance.id}`}>

// 체크박스
<input data-testid={`checkbox-select-${item.id}`} />

// 삭제 버튼 (행 내)
<button data-testid={`btn-delete-${item.id}`}>
```

Playwright에서 사용:

```typescript
// 특정 ID의 행 선택
await page.getByTestId('row-instance-i-12345').click();

// 패턴 매칭
await page.getByTestId(/^row-instance-/).first().click();
```

---

## Playwright 사용 예시

### 기본 선택

```typescript
// 단일 요소
await page.getByTestId('btn-create').click();

// 입력
await page.getByTestId('input-instance-name').fill('my-server');

// 선택
await page.getByTestId('select-region').selectOption('ap-northeast-2');
```

### 검증

```typescript
// 요소 존재 확인
await expect(page.getByTestId('table-instance-list')).toBeVisible();

// 텍스트 확인
await expect(page.getByTestId('alert-error')).toContainText('오류가 발생했습니다');

// 비활성화 상태 확인
await expect(page.getByTestId('btn-submit')).toBeDisabled();
```

### 동적 요소 대기

```typescript
// 로딩 완료 대기
await page.getByTestId('loading-table').waitFor({ state: 'hidden' });

// 토스트 메시지 대기
await expect(page.getByTestId('toast-success')).toBeVisible();
```

---

## TSX 적용 예시

```tsx
// Button
<Button data-testid="btn-create-instance" onClick={handleCreate}>
  인스턴스 생성
</Button>

// Input
<Input
  data-testid="input-instance-name"
  value={name}
  onChange={setName}
/>

// Select
<Select.Root data-testid="select-region">
  <Select.Item data-testid="option-region-seoul" item={{ value: 'ap-northeast-2', label: '서울' }} />
</Select.Root>

// Table Row
{instances.map((instance) => (
  <tr key={instance.id} data-testid={`row-instance-${instance.id}`}>
    <td data-testid={`cell-instance-${instance.id}-name`}>{instance.name}</td>
    <td>
      <Button data-testid={`btn-delete-${instance.id}`} onClick={() => handleDelete(instance.id)}>
        삭제
      </Button>
    </td>
  </tr>
))}

// Modal
<Modal data-testid="modal-confirm-delete">
  <Modal.Title data-testid="modal-confirm-delete-title">삭제 확인</Modal.Title>
  <Modal.Content data-testid="modal-confirm-delete-message">
    정말 삭제하시겠습니까?
  </Modal.Content>
</Modal>

// Loading State
{isLoading && <Spinner data-testid="loading-table" />}

// Empty State
{items.length === 0 && (
  <EmptyState data-testid="empty-instance-list">
    인스턴스가 없습니다
  </EmptyState>
)}
```

---

## 체크리스트

### 개발자용

- [ ] 모든 상호작용 가능한 요소에 `data-testid` 추가
- [ ] 네이밍 규칙 준수
- [ ] 동적 요소에 고유 ID 포함
- [ ] 로딩/빈/에러 상태에도 `data-testid` 추가

### QA용

- [ ] SPEC.md의 모든 `data-testid`가 실제 구현되었는지 확인
- [ ] 테스트 코드에서 `data-testid`만 사용 (CSS 선택자 지양)
- [ ] 동적 ID 패턴 매칭 테스트

---

*최종 수정일: 2025-01-22*
