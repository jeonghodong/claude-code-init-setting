---
name: tanstack-start-boilerplate
description: TanStack Start(React 19 SSR) 프로젝트 보일러플레이트를 생성하는 스킬. 항상 npm에서 최신 버전을 검증한 뒤 Astryx 디자인시스템 기반 구조로 프로젝트를 세팅한다. 사용자가 "TanStack Start 프로젝트 만들어줘", "새 프로젝트/웹앱 세팅", "보일러플레이트 생성", "React 프로젝트 스캐폴드", "관리자 대시보드/커머스/커뮤니티/예약/챗봇 서비스 시작하고 싶어" 등 새 프론트엔드 프로젝트를 시작하려는 모든 상황에서 반드시 이 스킬을 사용할 것 — "TanStack"이나 "보일러플레이트"라는 단어를 직접 말하지 않아도, 새 React 웹 프로젝트를 만들려는 의도가 보이면 이 스킬을 사용한다.
---

# TanStack Start Boilerplate Generator

TanStack Start + React 19 + Astryx 디자인시스템 기반의 프로덕션급 보일러플레이트를 생성한다.

이 스킬 디렉토리(이 SKILL.md가 있는 폴더, 이하 `<skill-dir>`)를 기준으로 모든 리소스를 상대 경로로 참조한다. 절대 특정 사용자의 로컬 경로를 가정하지 말 것 — 이 스킬은 어떤 머신에서든 스킬 폴더만으로 자립적으로 동작해야 한다.

- `<skill-dir>/assets/template/` — 보일러플레이트 소스코드 전체 (유일한 템플릿 소스)
- `<skill-dir>/references/version-policy.md` — 최신 버전 검증 절차 (**절대 원칙**, 반드시 읽기)
- `<skill-dir>/references/template-guide.md` — 템플릿 구조 맵 + 복사·치환 규칙
- `<skill-dir>/references/uxui-presets.md` — UX/UI 프리셋 5종 상세
- `<skill-dir>/references/astryx-rules.md` — Astryx / xds MCP / Vanilla Extract 사용 규칙

## 핵심 원칙 (왜 이 순서인가)

이 스킬의 존재 이유는 **유지보수가 절대적인 보일러플레이트**다. 번들된 템플릿 소스는 시간이 지나면 반드시 레거시가 된다. 그래서 템플릿을 "정답"이 아니라 "구조와 컨벤션의 레퍼런스"로 취급하고, **의존성 버전만큼은 생성 시점마다 npm 레지스트리에서 직접 최신 안정 버전을 조회해 갱신**한다. 템플릿의 package.json 버전을 그대로 믿고 설치하는 것은 이 스킬의 목적에 대한 위반이다.

## 워크플로

### 1단계 — 사용자에게 질문 (필수, 생략 금지)

AskUserQuestion 도구로 아래 두 가지를 **한 번에** 질문한다. 사용자가 이미 대화에서 명확히 답한 항목은 다시 묻지 않는다.

**Q1. "기본 틀만 구성할까요?"**
- 선택지: `기본 틀만` (템플릿 구조 그대로, 홈 화면만) / `UX/UI까지 구현` (와이어프레임 + 화면 구현 포함)

**Q2. "생각해두신 UX/UI가 있나요?"**
- 선택지로 아래 5개 프리셋을 제시하고, 자유 입력(Other)도 받는다:
  1. 대시보드 및 관리자 페이지 (Admin)
  2. 커머스 / 쇼핑몰
  3. SNS / 커뮤니티
  4. 예약 및 일정 관리 (SaaS)
  5. AI / 실시간 채팅 인터페이스
- 각 프리셋의 상세 요구사항(구현할 화면·컴포넌트 목록)은 `references/uxui-presets.md`를 읽고 그대로 따른다.
- Q1에서 "기본 틀만"을 답하면 Q2의 답은 무시한다.

프로젝트 이름과 생성 경로가 대화에서 정해지지 않았다면 이 질문에 함께 포함한다.

### 2단계 — 버전 검증 (절대 원칙)

`references/version-policy.md`를 읽고 절차를 그대로 수행한다. 요약:

1. `npm view <pkg> version`으로 핵심 패키지(@tanstack/react-start, @tanstack/react-router, react, vite, @astryxdesign/core 등)의 **최신 안정 버전을 npm에서 직접 조회**한다.
2. 템플릿 package.json과 비교해 낮은 버전을 전부 최신으로 갱신한다.
3. `npm info <pkg> peerDependencies`로 호환성을 검증하고, 충돌·breaking change가 있으면 해결 후 사용자에게 무엇을 어떻게 조정했는지 보고한다.

이 단계는 어떤 경우에도 생략하지 않는다. 네트워크가 막혀 조회가 불가능한 경우에만 템플릿 버전을 그대로 쓰되, 그 사실을 사용자에게 명시적으로 경고한다.

### 3단계 — 스캐폴드

`references/template-guide.md`의 규칙대로:

1. `<skill-dir>/assets/template/` 전체를 대상 경로로 복사한다 (숨김 파일 포함, `cp -R` 또는 `rsync -a`).
2. package.json의 `name`을 프로젝트명으로 치환하고, 2단계에서 확정한 최신 버전들을 반영한다.
3. README.md를 실제 스택(TanStack Start, Astryx, Vanilla Extract, paraglide i18n, vitest/playwright/storybook, pnpm)에 맞게 새로 작성한다 — 템플릿의 README는 스캐폴드 원본이라 스테일하다.
4. `pnpm install` → `pnpm i18n:compile` → `pnpm generate-routes` 순서로 실행한다 (i18n 산출물과 routeTree는 생성물이라 커밋되어 있지 않을 수 있다).

### 4단계 — 와이어프레임 (UX/UI 선택 시에만)

Claude Code의 `/design` 스킬을 호출해 선택된 프리셋의 화면들을 **와이어프레임으로만** 그린다.

- 와이어프레임 = 회색조 박스·레이아웃·컴포넌트 배치·화면 흐름만. 색상, 브랜딩, 하이파이 비주얼은 절대 넣지 않는다.
- 이유: 실제 비주얼(컬러·타이포·컴포넌트 스타일)은 전부 Astryx 테마가 결정한다. 와이어프레임은 "무엇이 어디에 놓이는가"만 합의하는 도구다.
- 와이어프레임을 사용자에게 보여주고 확인받은 뒤 5단계로 진행한다.

### 5단계 — UI 구현 (UX/UI 선택 시에만)

`references/astryx-rules.md`를 읽고 규칙을 준수하며 와이어프레임대로 구현한다. 핵심:

- **discover, don't guess**: 코드를 쓰기 전에 xds MCP(프로젝트 `.mcp.json`에 등록됨) 또는 `pnpm exec astryx build/template/component`로 Astryx의 페이지·블록·컴포넌트를 먼저 조회한다.
- 모든 컴포넌트·레이아웃·테마는 Astryx로 구현한다. raw `<div>`/`<span>` 레이아웃, 하드코딩된 hex/px 금지 — 토큰(`var(--color-*|--spacing-*|--radius-*)`)만 사용.
- Astryx로 표현 불가능한 커스텀 스타일만 Vanilla Extract로 작성하되, 반드시 `src/domain/_shared/styles/theme.css.ts`의 토큰 브리지(`vars`)에서 값을 가져온다.
- 구조 컨벤션 유지: `src/routes/`는 3줄 위임만, 실제 화면·로직은 `src/domain/<feature>/{components,hooks,utils}`, 테스트(`.test.tsx`)와 스토리(`.stories.tsx`)는 컴포넌트 옆에 콜로케이션.

### 6단계 — 검증 및 보고

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

전부 통과할 때까지 수정한다. 마지막으로 사용자에게 보고한다:

- 생성 위치와 실행 방법 (`cp .env.example .env.local` 후 `pnpm dev`)
- 2단계에서 갱신한 버전 목록 (템플릿 버전 → 설치된 최신 버전)
- 호환성 이슈가 있었다면 무엇을 어떻게 해결했는지
- 구현한 화면/컴포넌트 목록 (UX/UI 선택 시)
