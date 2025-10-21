---
description: Figma 디자인을 분석하여 실제 동작하는 UI를 생성합니다.
model: sonnet
argument-hint: <figma_urls> <target_path> <description> <component_path>
---

**Figma URLs**: $1
**타겟 작업 경로**: $2
**설명**: $3
**컴포넌트 경로**: $4

**무조건: @.claude/agents/ui-qa-tester, @.claude/agents/frontend-engineer.md 서브 에이전트들을 사용하여 병렬적으로 작업합니다.**
**무조건: @.claude/agents/ui-qa-tester, @.claude/agents/frontend-engineer.md 서브 에이전트들을 사용하여 병렬적으로 작업합니다.**
**무조건: UI 작업을 한다면 최소 5번은 @.claude/agents/ui-qa-tester 에이전트를 사용하고 playwrite mcp를 사용하여 똑같은 UI인지 반복 테스트를 진행합니다.**
**무조건: UI 작업을 한다면 최소 5번은 @.claude/agents/ui-qa-tester 에이전트를 사용하고 playwrite mcp를 사용하여 똑같은 UI인지 반복 테스트를 진행합니다.**

# Figma to UI Generator

Figma MCP를 사용하여 디자인을 분석하고, ATAD ODIIN의 디자인 시스템에 맞춰 실제 동작하는 UI 생성합니다.

## 📋 작업 프로세스

### 1. Figma 디자인 분석

- `mcp__Framelink_Figma_MCP__get_figma_data`를 사용하여 Figma 디자인 데이터 추출
- 레이아웃, 컬러, 타이포그래피, 스페이싱, 컴포넌트 구조 파악
- 인터랙션 및 상태 변화 확인

### 2. 기존 컴포넌트 활용 우선

**반드시 먼저 확인해야 할 컴포넌트들:**

- `@/app/_components/` 디렉토리 내 재사용 가능한 컴포넌트 검색
- 특히 다음 컴포넌트들 우선 활용:
  - `Button`, `Input`, `Select`, `Checkbox`, `Radio` (Form elements)
  - `Card`, `Modal`, `Dialog`, `BottomSheet` (Containers)
  - `Table`, `Grid`, `Layout` (Layout components)
  - `Typography`, `Badge`, `Chip`, `Tag` (Display components)
  - `Dropdown`, `Popover`, `Tooltip`, `ContextMenu` (Overlay components)
  - `Loading`, `Spinner`, `ProgressBar` (Loading states)
  - `Tab`, `Stepper`, `Pagination` (Navigation components)

### 3. 컴포넌트 구조 결정

```
타겟 페이지 경로 기준:
- <component_path> 에 있는 컴포넌트 최우선순위
- 페이지 전용 컴포넌트: {target_page_path}/_components/
- 전역 재사용 컴포넌트: @/app/_components/

예시:
- app/(console)/iam/policies/create-policy/_components/PolicyForm.tsx
- app/_components/PolicyEditor/ (재사용 가능한 경우)
```

만약 기존 컴포넌트에 없다면 페이지 전용 컴포넌트로 신규 생성합니다.

### 4. 이미지 및 아이콘 처리

- 저장 경로: `@/app/_components/icons/` 또는 페이지별 `_components/icons/`

### 5. 클로드코드의 작업 플로우 틀을 참고하여 작업합니다.

@.claude/agents/의 에이전트들을 사용하여 작업합니다.
디자인 작업 할 때는 @agent-fullstack-developer 에이전트를 사용하여 작업합니다.
만약 다른 작업들도 필요하다면 다른 에이전트들도 확인을 합니다.
여러 태스크를 열어서 병렬 작업으로 진행하도록 합니다.

### 6. playwrite mcp를 사용할때는 아래 내용을 참고합니다.

이미 켜져있는 크롬 브라우저에서 첨부한 url이 이미 있다면 그 탭에서 바로 작업을 진행합니다.

## 🎯 구현 요구사항

### TypeScript 타입 안정성

- 모든 props에 대한 TypeScript 인터페이스 정의
- 상태 관리에 명확한 타입 적용
- Generic 타입 활용으로 재사용성 향상

### 성능 최적화

- 불필요한 리렌더링 방지 (React.memo, useMemo, useCallback)
- 코드 스플리팅 고려
- 이미지 최적화 (Next.js Image 컴포넌트 사용)

## 📁 파일 구조 예시

```
app/(console)/iam/policies/create-policy/
├── page.tsx                          # 메인 페이지
├── _components/
│   ├── PolicyForm.tsx               # 폼 컴포넌트
│   ├── StatementBuilder.tsx         # Statement 빌더
│   ├── ActionSelector.tsx           # 액션 선택기
│   └── icons/
│       └── PolicyIcon.svg           # 페이지 전용 아이콘
└── _hooks/
    ├── usePolicyForm.ts             # 폼 로직
    └── useStatementValidation.ts    # 검증 로직
```

## ✅ 완료 체크리스트

작업 완료 후 반드시 확인:

- [ ] Figma 디자인과 시각적 일치도 95% 이상
- [ ] 모든 인터랙션 동작 구현
- [ ] 기존 컴포넌트 최대한 재사용
- [ ] TypeScript 타입 에러 없음
- [ ] 반응형 디자인 적용 (모바일, 태블릿, 데스크톱)
- [ ] 접근성 기본 요구사항 충족
- [ ] 코드 포맷팅 (Prettier)
- [ ] ESLint 경고 없음
- [ ] 빌드 에러 없음

## 🚀 실행 예시

```bash
# 사용 예시
/figma-ui "https://figma.com/file/xxx?node-id=123" "app/(console)/iam/policies/create-policy" "구현해주세요"

# 결과:
# 1. Figma 디자인 분석 완료
# 2. 기존 Button, Select, Input 컴포넌트 재사용
# 3. StatementBuilder.tsx 생성
# 4. 필요한 아이콘 다운로드 및 저장
# 5. 타입 정의 및 로직 구현
# 6. 스타일링 완료
```

## 📝 참고사항

- Figma URLs에서 `node-id` 파라미터가 있다면 특정 노드만 분석
- Figma URL은 여러개 있을 수 있으며, 모든 URL을 참고하여 UI를 생성합니다.
- 복잡한 컴포넌트는 작은 단위로 쪼개서 구현
- 디자인 시스템 일관성 유지가 최우선
- 퍼포먼스와 유지보수성을 항상 고려

## 🔧 트러블슈팅

**Figma 데이터를 가져올 수 없는 경우:**

- Figma URL이 올바른지 확인
- 파일 접근 권한 확인
- MCP 서버 연결 상태 확인

**기존 컴포넌트를 찾을 수 없는 경우:**

- `@/app/_components/` 디렉토리 구조 재확인
- Glob 패턴으로 유사 컴포넌트 검색
- 필요시 새로운 컴포넌트 생성

**이미지 다운로드 실패:**

- 이미지 노드 ID 확인
- SVG로 변환 가능한지 확인
- 대체 이미지 또는 아이콘 사용 검토
