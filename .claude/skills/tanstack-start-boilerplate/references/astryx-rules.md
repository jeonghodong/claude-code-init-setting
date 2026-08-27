# Astryx / xds MCP / Vanilla Extract 사용 규칙

이 보일러플레이트의 모든 UI는 메타 디자인시스템 **Astryx**(`@astryxdesign/core`) 위에서 만든다. Astryx가 컴포넌트·레이아웃·토큰·테마를 전부 제공하므로, 손으로 CSS를 만들 일은 거의 없어야 정상이다.

생성된 프로젝트의 CLAUDE.md/AGENTS.md에 Astryx CLI가 자동 생성한 `ASTRYX:START/END` 블록이 있다 — 그 블록이 해당 프로젝트 안에서의 1차 규칙이며, 이 문서는 그 요약 + 이 보일러플레이트 특화 규칙이다.

## 접근 경로 — 반드시 discover, don't guess

컴포넌트 이름이나 props를 추측해서 쓰지 말고, 코드를 쓰기 **전에** 조회한다:

1. **xds MCP** — 템플릿 `.mcp.json`에 `xds` 서버가 등록되어 있다. MCP 도구가 세션에 보이면 이것으로 컴포넌트/템플릿/토큰/테마를 조회한다.
2. **Astryx CLI** (MCP가 없어도 항상 동작): 
   - `pnpm exec astryx build "<만들려는 화면 설명>"` — **여기서 시작**. 가장 가까운 [page] + [block] + [component] 킷을 반환한다.
   - `pnpm exec astryx template <name> [--skeleton]` — 페이지/블록 스캐폴드 또는 레이아웃 학습
   - `pnpm exec astryx component <Name>` — 사용하는 모든 컴포넌트의 props + 예제 확인
   - `pnpm exec astryx search "<thing>"`, `component --list`, `template --list`, `docs <topic>`

## 핵심 규칙

- **raw `<div>`/`<span>` 레이아웃 금지.** 레이아웃·간격은 전부 Astryx 컴포넌트(VStack, HStack 등)가 담당한다. 페이지 프레임 포함.
- **프레임 먼저**: 페이지/화면을 쓰기 전에 `pnpm exec astryx docs layout`을 읽는다 — 페이지 프레임, 영역 폭, 브레이크포인트.
- 밀도 높은 데이터는 rows(Table, List/Item)로. 리스트 아이템을 Card로 감싸지 않는다. Card는 독립 위젯용. 상태 표시는 StatusDot/Token, Badge는 카운트 전용.
- **모든 값은 토큰으로**: `var(--color-*|--spacing-*|--radius-*)`. raw hex/px 금지. 컴포넌트 props 우선, 안 되면 style/className에 토큰.
- 브랜드/액센트 컬러는 테마 소관: `astryx theme list` / `theme add <slug>` / `theme template`. `:root`에서 `--color-*`를 덮어쓰지 않는다. 테마는 `src/themes/<slug>/` 폴더 하나당 하나 (`defineTheme`), 아이콘 레지스트리도 테마 소유.
- import는 딥 패스: `@astryxdesign/core/VStack` 식. CSS는 `__root.tsx`의 head links에서 `reset.css?url` + `astryx.css?url`로 이미 로드되어 있다.
- **셀프 체크**: 파일을 끝내기 전에 다시 읽고 raw div/span 레이아웃, 임포트된 .css, 하드코딩 값(#hex, 16px)을 컴포넌트나 토큰으로 교체한다. 컴포넌트/prop 존재가 불확실하면 `astryx component <Name>`으로 확인 — CSS를 손으로 만들지 않는다.

## Vanilla Extract — 탈출구, 단 토큰 브리지 경유만

Astryx 컴포넌트/props/토큰으로 표현이 불가능한 커스텀 스타일에만 Vanilla Extract(`.css.ts`)를 쓴다. 이때 값은 반드시 `src/domain/_shared/styles/theme.css.ts`의 `vars`에서 가져온다 — 이 파일이 Vanilla Extract 변수를 Astryx CSS 커스텀 프로퍼티에 매핑하는 브리지라서, 활성 Astryx 테마가 바뀌어도 커스텀 스타일이 자동으로 따라온다. hex/px를 `.css.ts`에 직접 쓰는 순간 그 동기화가 깨진다.

```ts
// 예: src/domain/feed/components/feedCard.css.ts
import { style } from '@vanilla-extract/css'
import { vars } from '#/domain/_shared/styles/theme.css'

export const highlight = style({
  borderRadius: vars.radius.element,
  padding: vars.space.md,
  color: vars.color.textPrimary,
})
```

## 테스트·스토리 규칙 (구현 시 함께)

- 각 화면 컴포넌트 옆에 최소한의 `.test.tsx`(렌더 확인)와 `.stories.tsx`(title: `domain/<feature>/<Component>`)를 콜로케이션한다.
- jest-dom 매처는 설치되어 있지 않다 — `expect(...).toBeDefined()` 계열을 쓴다.
- Astryx 컴포넌트의 접근성 롤은 겉보기와 다를 수 있다(예: SegmentedControl 아이템은 radio 롤). e2e에서 롤 기반 셀렉터를 쓸 때 실제 렌더 결과를 확인한다.
