---
description: 다국어 번역 누락을 검사하고 수정합니다.
model: sonnet
---

프로젝트의 다국어(한국어/영어) 번역 누락을 검사하고 수정합니다.

# Process

## Step 1: 데이터 파일 검사

`app/lib/data.ts`의 모든 프로젝트 데이터를 검사합니다:

- `_ko` 필드가 있으면 `_en` 필드도 있는지
- `_en` 필드가 있으면 `_ko` 필드도 있는지
- 각 필드의 내용이 비어있지 않은지

검사할 필드:
- title_ko / title_en
- description_ko / description_en
- longDescription_ko / longDescription_en

## Step 2: 컴포넌트 검사

UI 컴포넌트에서 하드코딩된 텍스트를 찾습니다:

```bash
# 한국어 텍스트 검색
grep -r "[\uAC00-\uD7AF]" --include="*.tsx" app/
```

하드코딩된 텍스트는 다국어 상수로 이동해야 합니다.

## Step 3: 누락된 번역 목록화

발견된 문제를 카테고리별로 정리:

1. **누락된 번역**: _ko만 있고 _en이 없거나 그 반대
2. **빈 번역**: 필드는 있지만 내용이 비어있음
3. **하드코딩된 텍스트**: 컴포넌트에 직접 작성된 텍스트

## Step 4: 번역 추가/수정

누락된 번역을 추가합니다:

- 한국어 → 영어 번역
- 영어 → 한국어 번역
- 의미와 톤이 일치하도록

## Step 5: UI 상수 이동

하드코딩된 텍스트를 `app/lib/constants.ts`로 이동:

```typescript
export const UI_TEXT = {
  navigation: {
    home: { ko: '홈', en: 'Home' },
    // ...
  },
};
```

# Guidelines

- 번역은 의미가 일치해야 함 (직역 X)
- 톤과 문체 유지
- 기술 용어는 일반적인 번역 사용
- 마크다운 구조는 동일하게 유지

# Quality Checks

완료 전 확인:
- [ ] 모든 _ko 필드에 대응하는 _en 필드 존재
- [ ] 모든 _en 필드에 대응하는 _ko 필드 존재
- [ ] 빈 번역 없음
- [ ] 하드코딩된 텍스트 최소화
- [ ] TypeScript 에러 없음

# Output Format

```markdown
## 다국어 검사 결과

### 발견된 문제

#### 누락된 번역 (X개)
| 파일 | 필드 | 누락 언어 |
|------|------|----------|
| data.ts | project.longDescription | en |

#### 빈 번역 (X개)
| 파일 | 필드 | 언어 |
|------|------|------|
| data.ts | project.description | ko |

#### 하드코딩된 텍스트 (X개)
| 파일:라인 | 텍스트 |
|-----------|--------|
| Header.tsx:15 | "메뉴" |

### 수정된 항목
1. [파일] - [필드] - [추가된 번역]

### 남은 작업
- [수동으로 확인이 필요한 항목]
```
