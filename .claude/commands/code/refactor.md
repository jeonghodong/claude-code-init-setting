---
description: 코드 품질 원칙(가독성, 예측 가능성, 응집도, 결합도)을 기반으로 코드를 분석하고 리팩토링합니다.
model: sonnet
argument-hint: <file-or-directory> [focus-area]
---

예시: /code:refactor src/components/UserProfile.tsx readability

**Target**: $1
**Focus Area** (optional): $2

리팩토링 대상 파일 또는 디렉토리를 분석하고, 코드 품질 원칙을 기반으로 개선합니다.

# Core Philosophy

> **"좋은 코드는 변경하기 쉬운 코드다."**

4가지 핵심 원칙을 기반으로 코드를 평가하고 리팩토링합니다:
1. **Readability (가독성)**: 코드 이해 용이성
2. **Predictability (예측 가능성)**: 동작 예측 가능성
3. **Cohesion (응집도)**: 관련 코드의 근접성
4. **Coupling (결합도)**: 변경 영향 범위

# Process

## Step 1: 코드 분석

1. 대상 파일/디렉토리 읽기
2. 관련 파일 검색 (imports, exports, dependencies)
3. 현재 코드 품질 상태 평가
4. Focus Area가 지정된 경우 해당 영역에 집중

## Step 2: 문제점 식별

각 원칙별로 구체적인 문제점을 식별:

### Readability 체크리스트
- [ ] 복잡한 조건문에 의미 있는 이름이 있는가?
- [ ] 매직 넘버가 상수로 대체되었는가?
- [ ] 함수가 단일 책임을 가지는가?
- [ ] 중첩된 삼항 연산자가 있는가?

### Predictability 체크리스트
- [ ] 유사한 함수가 일관된 패턴을 따르는가?
- [ ] 반환 타입이 일관적인가?
- [ ] 숨겨진 부작용이 있는가?

### Cohesion 체크리스트
- [ ] 관련 파일이 함께 위치하는가?
- [ ] 상수가 사용처 근처에 있는가?
- [ ] 폼 필드와 검증 로직이 함께 있는가?

### Coupling 체크리스트
- [ ] Props drilling이 있는가?
- [ ] 각 모듈이 단일 책임을 가지는가?
- [ ] 의존성이 명시적인가?

## Step 3: 리팩토링 계획 수립

1. 문제점의 우선순위 결정 (영향도, 노력 기준)
2. Trade-off 고려 (원칙들이 충돌할 수 있음)
3. 점진적 개선 경로 설계
4. 사용자에게 계획 확인

## Step 4: 리팩토링 실행

1. 가장 높은 우선순위 이슈부터 처리
2. 각 변경사항에 대해:
   - Before/After 코드 비교
   - 변경 이유 설명
   - 실제 코드 수정
3. 관련 파일도 함께 업데이트

## Step 5: 검증

1. 빌드 확인 (npm run build)
2. 린트 확인 (npm run lint)
3. 타입 체크 (tsc --noEmit)
4. 테스트 실행 (npm test, 있는 경우)

# Focus Areas

Focus Area를 지정하면 해당 영역에 집중합니다:

- `readability`: 가독성 개선에 집중
- `predictability`: 예측 가능성 개선에 집중
- `cohesion`: 응집도 개선에 집중
- `coupling`: 결합도 개선에 집중
- `all`: 모든 영역 (기본값)

# Trade-off Guidelines

원칙들이 충돌할 때 우선순위:

| 상황 | 우선순위 |
|------|----------|
| 고위험 비즈니스 로직 | Cohesion > Coupling |
| 자주 변경되는 UI | Readability > Cohesion |
| 공유 유틸리티 | Predictability > all |
| 성능 중요 코드 | Coupling > Readability |

# Common Refactoring Patterns

## 1. 복잡한 조건문 추출

```typescript
// Before
if (user.status === 1 && user.role === 'admin' && user.verified) { ... }

// After
const isActiveAdmin = user.status === 1 && user.role === 'admin' && user.verified;
if (isActiveAdmin) { ... }
```

## 2. 매직 넘버 상수화

```typescript
// Before
if (items.length > 10) { ... }

// After
const MAX_VISIBLE_ITEMS = 10;
if (items.length > MAX_VISIBLE_ITEMS) { ... }
```

## 3. Props Drilling 제거

```typescript
// Before: Props drilling
<Parent user={user}><Child user={user}><GrandChild user={user} /></Child></Parent>

// After: Context 사용
<UserProvider value={user}><Parent><Child><GrandChild /></Child></Parent></UserProvider>
```

## 4. 파일 Co-location

```
// Before: 분산된 구조
src/constants/userConstants.ts
src/validators/userValidator.ts
src/components/UserForm.tsx

// After: 응집된 구조
src/features/user/constants.ts
src/features/user/validator.ts
src/features/user/UserForm.tsx
```

# Guidelines

- 한 번에 모든 것을 고치려 하지 마세요. 점진적으로 개선하세요.
- 팀 컨벤션을 존중하세요. 필요시 팀 논의를 권장하세요.
- 완벽한 코드는 없습니다. 상황에 맞는 최선을 찾으세요.
- 리팩토링 전후로 기능이 동일하게 동작하는지 확인하세요.
- 큰 변경은 작은 커밋으로 나누세요.

# Quality Checks

리팩토링 완료 전 확인:
- [ ] 빌드 성공
- [ ] 린트 통과
- [ ] 타입 체크 통과
- [ ] 테스트 통과 (있는 경우)
- [ ] 기능 동작 확인
- [ ] 변경 이유 문서화

# Output Format

리팩토링 완료 후 다음 형식으로 보고:

```markdown
## Refactoring Summary

### Target
- **Path**: [파일/디렉토리 경로]
- **Focus**: [집중 영역]

### Changes Made

#### 1. [변경 제목]
- **Principle**: [관련 원칙]
- **Issue**: [문제점]
- **Solution**: [해결책]
- **Files**: [수정된 파일:라인]

#### 2. [변경 제목]
...

### Verification
- Build: [Pass/Fail]
- Lint: [Pass/Fail]
- Type Check: [Pass/Fail]
- Tests: [Pass/Fail/Skipped]

### Remaining Issues
[추가 개선이 필요한 사항]

### Recommendations
[후속 작업 권장사항]
```
