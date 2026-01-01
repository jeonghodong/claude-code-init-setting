---
description: 코드 리팩토링 실행 - 가독성, 예측 가능성, 응집도, 결합도 4원칙 기반 개선
argument-hint: <파일경로 또는 디렉토리>
allowed-tools: Task, Read, Write, Edit, Glob, Grep
---

# 리팩토링 요청

## 실행 지시

**반드시 Task 도구를 사용하여 `refactor-specialist` 에이전트를 실행하세요.**

```
Task tool 호출:
- subagent_type: "refactor-specialist"
- prompt: "다음 파일/디렉토리를 4원칙 기반으로 리팩토링해주세요: $ARGUMENTS"
```

## 리팩토링 대상

$ARGUMENTS

## 에이전트가 수행할 작업

`refactor-specialist` 에이전트가 다음을 수행합니다:

### Phase 1: 분석
1. 대상 파일/디렉토리 스캔
2. 컴포넌트/훅/유틸 구조 파악
3. 4원칙 기준 문제점 목록화

### Phase 2: 계획 수립
1. 리팩토링 항목 우선순위 정리
2. 영향 범위 분석
3. **사용자 승인 요청** (중요!)

### Phase 3: 실행
1. 작은 단위로 변경 적용
2. 각 단계별 변경 내용 기록

### Phase 4: 검증
1. 변경된 파일 목록 정리
2. 주요 변경 사항 요약
3. Before/After 비교

## 리팩토링 원칙

- **가독성**: 코드 분리, 추상화, 이름 붙이기
- **예측 가능성**: 반환 타입 통일, 숨은 로직 드러내기
- **응집도**: 도메인별 구조화, 관련 코드 묶기
- **결합도**: 단일 책임, Props Drilling 해결

## 참조 스킬

- `code-quality-review` 스킬의 원칙과 Before/After 예시를 기반으로 리팩토링

## 주의 사항

- 기존 기능이 깨지지 않도록 주의
- 한 번에 너무 많은 변경 금지, 점진적 진행
- **반드시 사용자 승인 후 코드 수정**
