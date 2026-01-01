---
description: 코드 품질 리뷰 - 가독성, 예측 가능성, 응집도, 결합도 4원칙 기반 분석
argument-hint: <파일경로 또는 디렉토리>
allowed-tools: Task, Read, Glob, Grep
---

# 코드 품질 리뷰 요청

## 실행 지시

**반드시 Task 도구를 사용하여 `code-quality-reviewer` 에이전트를 실행하세요.**

```
Task tool 호출:
- subagent_type: "code-quality-reviewer"
- prompt: "다음 파일/디렉토리를 4원칙(가독성, 예측 가능성, 응집도, 결합도) 기준으로 분석해주세요: $ARGUMENTS"
```

## 분석 대상

$ARGUMENTS

## 에이전트가 수행할 작업

`code-quality-reviewer` 에이전트가 다음을 수행합니다:

1. **코드 읽기**: 대상 파일/디렉토리의 코드를 분석
2. **4원칙 기반 분석**:
   - 가독성: 맥락 분리, 추상화, 이름 붙이기
   - 예측 가능성: 반환 타입 통일, 숨은 로직
   - 응집도: 디렉토리 구조, 관련 코드 묶기
   - 결합도: 책임 분리, Props Drilling
3. **이슈 우선순위 정리**: 높음/중간/낮음
4. **개선 방안 제안**: Before/After 코드 예시 포함

## 참조 스킬

- `code-quality-review` 스킬의 원칙과 체크리스트를 기반으로 분석
