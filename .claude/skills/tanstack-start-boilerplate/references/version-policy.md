# 버전 정책 — 최신 버전 검증 및 호환성 절차 (절대 원칙)

이 스킬의 템플릿(`assets/template/`)은 만들어진 시점의 스냅샷이다. 시간이 지나면 그 안의 모든 버전은 레거시가 된다. **이 문서의 절차가 템플릿보다 항상 우선한다.** 템플릿의 package.json에 적힌 버전은 "당시의 예시"일 뿐, 절대 신뢰하고 설치하지 말 것.

## 1. 최신 버전 조회

아래 핵심 패키지의 최신 안정 버전을 npm 레지스트리에서 직접 조회한다. 한 번에 조회하면 빠르다:

```bash
for p in @tanstack/react-start @tanstack/react-router @tanstack/react-query \
         @tanstack/react-router-ssr-query @tanstack/router-cli \
         react react-dom vite vitest typescript \
         @astryxdesign/core @astryxdesign/cli \
         @vanilla-extract/css @vanilla-extract/vite-plugin \
         @inlang/paraglide-js zod react-hook-form; do
  echo "$p -> $(npm view "$p" version 2>/dev/null || echo 'LOOKUP FAILED')"
done
```

나머지 devDependencies(storybook, playwright, oxlint, oxfmt, lefthook 등)도 같은 방식으로 조회한다. 템플릿 package.json의 전체 의존성 목록을 기준으로 빠짐없이 확인하는 것이 원칙이다.

주의:
- `npm view <pkg> version`은 `latest` 태그를 반환한다. prerelease(alpha/beta/rc/nightly)로 올리지 않는다.
- 템플릿에 `npm:nitro-nightly@...` 같은 nightly alias가 있다면(예: `nitro`), 정식 버전이 릴리스됐는지 `npm view nitro version`으로 확인하고, 정식 버전이 TanStack Start와 호환되면 정식 버전으로 교체한다. 아직 nightly가 필요하면 최신 nightly로 갱신한다.

## 2. 갱신

- 조회한 최신 버전이 템플릿 버전보다 높으면 전부 `^<latest>`로 갱신한 package.json을 만든다.
- major 버전이 바뀐 패키지는 3단계 호환성 검증을 거치기 전까지 확정하지 않는다.

## 3. 호환성 검증

버전을 올리는 것만큼 중요한 것이 조합이 실제로 동작하는지 확인하는 것이다:

1. **peerDependencies 확인**: 갱신 대상 중 핵심 패키지에 대해 `npm info <pkg>@<version> peerDependencies`를 실행하고, 갱신된 조합이 서로의 peer 범위를 만족하는지 확인한다. 특히:
   - `@tanstack/react-start` ↔ `@tanstack/react-router` ↔ vite 버전 정합
   - `@astryxdesign/core` ↔ react 버전
   - `@vanilla-extract/vite-plugin` ↔ vite major 버전
2. **breaking change 확인**: major가 올라간 패키지는 릴리스 노트/체인지로그를 확인한다(웹 검색 또는 `npm view <pkg> homepage`). 템플릿 코드(설정 파일, import 경로, API 사용부)에 영향이 있으면 코드를 함께 수정한다.
3. **설치로 최종 확인**: `pnpm install`이 peer 충돌 없이 성공하고, 이후 `pnpm typecheck && pnpm build`가 통과하면 조합이 유효한 것이다. 실패하면 에러를 읽고 해당 패키지만 한 단계 낮추거나 관련 코드를 수정한다 — 무조건 템플릿 버전으로 되돌리는 것은 최후의 수단이다.

## 4. 보고

사용자에게 반드시 보고한다:

- 갱신한 패키지 목록: `템플릿 버전 → 설치 버전` 형식
- major 업그레이드로 코드를 수정한 부분과 이유
- 충돌 때문에 최신을 쓰지 못한 패키지가 있다면, 어떤 충돌인지와 언제 다시 올릴 수 있을지

## 실패 시

npm 조회가 전부 실패하는 환경(오프라인 등)에서만 템플릿 버전 그대로 진행하되, "버전 검증을 수행하지 못했으며 의존성이 레거시일 수 있다"는 경고를 결과 보고에 반드시 포함한다.

## Astryx 업그레이드 후속 작업

`@astryxdesign/core`의 버전이 템플릿보다 올라갔다면, 설치 후 `pnpm exec astryx upgrade --apply`를 실행한다 (Astryx 자체의 마이그레이션 규칙 적용). 이후 CLAUDE.md/AGENTS.md의 `ASTRYX:START/END` 블록이 재생성되었는지 확인한다.
