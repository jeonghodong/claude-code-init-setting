---
description: Lighthouse 감사를 실행하고 성능/접근성/SEO 점수를 개선합니다.
model: sonnet
argument-hint: <target-score>
---

예시: /dev:lighthouse 90

**목표 점수**: $1 (기본값: 90)

Lighthouse 감사를 실행하고 목표 점수에 도달할 때까지 개선합니다.

# Process

## Step 1: 현재 상태 확인

개발 서버가 실행 중인지 확인하고, Lighthouse 감사를 실행합니다.

```bash
# 개발 서버 실행 확인 또는 프로덕션 빌드 사용
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json --chrome-flags="--headless"
```

## Step 2: 결과 분석

Lighthouse 점수를 확인합니다:
- **Performance**: 로딩 속도, 인터랙티브 시간
- **Accessibility**: 접근성 준수
- **Best Practices**: 웹 표준 준수
- **SEO**: 검색 엔진 최적화

목표 점수($1 또는 90) 미만인 카테고리를 식별합니다.

## Step 3: 개선 사항 적용

### Performance 개선
- 이미지 최적화 (next/image 사용)
- 코드 스플리팅 (dynamic import)
- 불필요한 JavaScript 제거
- 캐싱 전략 적용

### Accessibility 개선
- alt 텍스트 추가
- ARIA 속성 추가
- 색상 대비 개선
- 키보드 네비게이션 확인

### Best Practices 개선
- HTTPS 사용
- console.log 제거
- 보안 헤더 추가

### SEO 개선
- 메타 태그 추가
- 구조화된 데이터 추가
- sitemap 생성

## Step 4: 재감사

개선 사항 적용 후 다시 Lighthouse를 실행하여 점수 변화를 확인합니다.

목표 점수에 도달할 때까지 반복합니다.

# Guidelines

- 한 번에 하나의 카테고리에 집중
- 가장 영향이 큰 개선부터 적용
- 3D 컴포넌트는 lazy loading 필수
- 모바일 성능 우선 고려

# Quality Checks

완료 전 확인:
- [ ] 모든 카테고리 목표 점수 이상
- [ ] 모바일/데스크톱 모두 테스트
- [ ] 기능이 깨지지 않음
- [ ] 빌드 성공

# Output Format

```markdown
## Lighthouse 감사 결과

### 점수 비교
| 카테고리 | 이전 | 이후 | 변화 |
|----------|------|------|------|
| Performance | X | Y | +Z |
| Accessibility | X | Y | +Z |
| Best Practices | X | Y | +Z |
| SEO | X | Y | +Z |

### 적용된 개선 사항
1. [개선 내용] - 영향: [카테고리] +X점

### 추가 권장 사항
- [추가로 개선할 수 있는 항목]
```
