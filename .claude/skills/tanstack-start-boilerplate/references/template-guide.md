# 템플릿 가이드 — assets/template/ 구조 맵과 복사 규칙

`<skill-dir>/assets/template/`이 이 스킬의 **유일한** 소스 템플릿이다. 외부 경로나 특정 사용자의 로컬 저장소를 참조하지 않는다.

## 스택 개요

| 영역 | 선택 |
|---|---|
| 프레임워크 | TanStack Start (React 19, SSR) + TanStack Router (파일 기반) + TanStack Query |
| 디자인시스템 | Astryx (`@astryxdesign/core`) — xds MCP + `pnpm exec astryx` CLI |
| 커스텀 스타일 | Vanilla Extract (Astryx 토큰 브리지 경유만) |
| i18n | paraglide-js (inlang) — URL 전략, en/de 기본 |
| 테스트 | vitest(unit + storybook 브라우저 프로젝트), Playwright e2e, Storybook |
| 품질 도구 | oxlint, oxfmt, lefthook(pre-commit lint/fmt, pre-push typecheck) |
| 관측 | Sentry (`instrument.server.mjs`, `.env.local`의 DSN 없으면 no-op) |
| 런타임/패키지 | node + pnpm (mise.toml로 버전 고정), nitro 서버 빌드 |

## 구조 맵

```
template/
├── package.json            # 스크립트: dev/build/start/typecheck/lint/fmt/test/test:e2e/storybook/i18n:compile/generate-routes/astryx
├── vite.config.ts          # 플러그인 순서가 중요: devtools → paraglide → vanillaExtract → tanstackStart → nitro → react → babel(react-compiler)
├── vitest.config.ts        # vite.config와 의도적으로 분리 — 앱 플러그인 스택(devtools/tanstackStart/nitro)이 vitest 프로세스를 잡아두기 때문. unit(jsdom) + storybook(브라우저) 2개 프로젝트
├── tsconfig.json           # `#/*` → `./src/*` alias, strict
├── .mcp.json               # xds MCP(Astryx) + chrome-devtools MCP — 생성 프로젝트에 반드시 포함
├── mise.toml               # node/pnpm 버전 고정
├── lefthook.yml, .oxlintrc.json, .oxfmtrc.json
├── .env.example            # Sentry 키들 — 사용자가 .env.local로 복사해서 채움
├── instrument.server.mjs   # Sentry 서버 초기화 (dev는 NODE_OPTIONS --import, build 시 .output/server로 복사)
├── CLAUDE.md / AGENTS.md   # 자동 생성 블록(ASTRYX:START/END, intent-skills) — 손으로 편집하지 말 것
├── .storybook/             # @storybook/tanstack-react, 콜로케이션된 stories 글롭
├── .github/workflows/      # lint/typecheck/test-unit/test-e2e/build 개별 잡, mise 기반 setup 액션
├── e2e/                    # Playwright 스펙 (locale SSR 검증 예시 포함)
└── src/
    ├── routes/             # 라우팅 셸만. index.tsx는 3줄: createFileRoute → domain 컴포넌트 위임
    ├── domain/             # 실제 기능 코드. <feature>/{components,hooks,utils}, 테스트·스토리 콜로케이션
    │   └── _shared/styles/theme.css.ts   # Vanilla Extract ↔ Astryx 토큰 브리지 (커스텀 스타일의 유일한 값 출처)
    ├── i18n/               # messages/, project.inlang/, 생성물 paraglide/, middleware, LocaleSwitcher
    ├── integrations/       # 라이브러리별 배선 (tanstack-query provider/devtools)
    ├── themes/neutral/     # Astryx defineTheme + lucide 아이콘 레지스트리 — 테마는 폴더당 하나
    ├── router.tsx, start.ts, styles.css
    └── routeTree.gen.ts    # 생성물 — 직접 편집 금지, pnpm generate-routes로 재생성
```

## 복사 규칙

1. 템플릿 전체를 숨김 파일 포함해 복사한다: `rsync -a <skill-dir>/assets/template/ <target>/` (또는 `cp -Rp`). 복사 누락이 흔한 파일: `.mcp.json`, `.gitignore`, `.env.example`, `.storybook/`, `.github/`.
2. `package.json`의 `name`을 프로젝트명(kebab-case)으로 치환한다.
3. 버전 정책(version-policy.md)에서 확정한 최신 버전들을 package.json에 반영한다.
4. **README.md는 새로 작성한다.** 템플릿의 README는 업스트림 스캐폴드 원본이라 실제 스택과 어긋난다(Tailwind 언급 등). 새 README에는: 스택 요약, `cp .env.example .env.local`, `pnpm install && pnpm dev`, 주요 스크립트 표, domain 구조 설명, Astryx 사용법 한 단락.
5. `git init` 후 첫 커밋까지 만들어준다 (lefthook `prepare` 훅이 pnpm install 시 걸리므로 git 저장소가 먼저 있어야 한다).
6. 설치·생성 순서: `git init` → `pnpm install` → `pnpm i18n:compile` → `pnpm generate-routes`. paraglide 산출물(`src/i18n/paraglide/`)과 `routeTree.gen.ts`는 생성물이므로 없거나 스테일할 수 있다.

## 새 화면(도메인) 추가 컨벤션

1. `src/domain/<feature>/components/<Screen>.tsx` 작성 (+ 옆에 `.test.tsx`, `.stories.tsx`)
2. `src/routes/<path>.tsx`는 위임만:
   ```tsx
   import { createFileRoute } from '@tanstack/react-router'
   import { FeatureScreen } from '#/domain/<feature>/components/FeatureScreen'
   export const Route = createFileRoute('/<path>')({ component: FeatureScreen })
   ```
3. `pnpm generate-routes`로 routeTree 재생성
4. 문자열은 하드코딩하지 말고 `src/i18n/messages/*.json`에 추가 후 `pnpm i18n:compile`
