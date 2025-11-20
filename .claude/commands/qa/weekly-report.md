---
description: 주간 QA 리포트 자동 생성 - 테스트 결과, 이슈, 자동화 진행 상황 종합
model: sonnet
---

금요일 오후 회고 미팅에서 사용하는 커맨드입니다. 이번 주 QA 활동을 종합하여 데이터 기반 주간 리포트를 생성합니다.

예시: `/qa:weekly-report`

# Process

## Step 1: 주간 데이터 수집

**기간 확인**:
```
이번 주: YYYY-MM-DD (월) ~ YYYY-MM-DD (금)
```

**수집할 데이터**:

### 테스트 실행 데이터
```
Tier 1 (회귀):
- 총 실행: X회
- 총 테스트: X개
- Pass/Fail 수
- Pass Rate

Tier 2 (탐색적):
- 세션 수: X
- 담당자: [이름들]
- 발견 버그: X개

Tier 3 (신규):
- 테스트 케이스: X개
- Pass/Fail 수
- Pass Rate
```

### 이슈 데이터
```
신규 발견: X건 (P0/P1/P2/P3 breakdown)
해결 완료: X건
오픈 중: X건 (P0/P1/P2/P3 breakdown)

평균 해결 시간:
- P0: Xh (목표: 24h)
- P1: Xd (목표: 3d)
- P2: Xd (목표: 7d)
```

### 자동화 데이터
```
현재 커버리지: XX%
이번 주 추가: X개 테스트
실행 시간: Xm
Flaky 테스트: X개
```

### 릴리즈 데이터
```
릴리즈 여부: Go / No-go / N/A
릴리즈 버전: vX.X.X
프로덕션 이슈: X건
```

### 팀 활동 데이터
```
QA 헤드: Xh (계획 15h)
클라우드: Xh (계획 5h)
디자이너: Xh (계획 5h)
개발자: Xh (계획 3h)
```

만약 데이터가 불완전하면:
```
주간 리포트 생성을 위해 다음 정보가 필요합니다:
- [ ] Tier 1/2/3 테스트 실행 결과
- [ ] 이번 주 발견/해결/오픈 이슈 수
- [ ] 자동화 커버리지 현황
- [ ] 릴리즈 여부 및 상태
- [ ] 팀원별 투입 시간 (대략적인 추정도 가능)
```

## Step 2: qa-weekly-reporter 스킬 활용

**2.1 KPI 계산**:

**Pass Rate**:
```
Tier 1: (Pass / Total) × 100%
Tier 3: (Pass / Total) × 100%

Target: ≥ 95%
Status: ✅ / ⚠️ / ❌
```

**Automation Coverage**:
```
Current: (Automated Tests / Total Tier 1 Tests) × 100%
Target: 80% (6개월 목표)
Progress: [████████░░] XX%
```

**Issue Resolution Metrics**:
```
P0 Avg Resolution: Xh (Target: 24h)
P1 Avg Resolution: Xd (Target: 3d)
P2 Avg Resolution: Xd (Target: 7d)
```

**Release Health**:
```
Release: Go / No-go
Production Incidents: X건
Rollback: X회
```

**2.2 트렌드 분석**:

지난주와 비교:
```
Pass Rate: 98% → 94% (↓ 4%) 🔴
Automation: 74% → 76% (↑ 2%) ✅
Open Issues: 12 → 16 (↑ 4) ⚠️
```

7일 추이:
- Pass Rate 그래프 (텍스트 또는 데이터)
- 이슈 추이 (신규 vs 해결)
- 자동화 커버리지 진행

**2.3 주요 인사이트 도출**:

**잘된 점 (Wins)**:
```
✅ 1. 자동화 커버리지 2% 증가 (3개 테스트 추가)
✅ 2. P0 이슈 0건 유지
✅ 3. 릴리즈 성공적 완료 (프로덕션 이슈 0건)
```

**개선 필요 (Areas for Improvement)**:
```
⚠️ 1. Pass Rate 4% 하락 - 5개 테스트 실패
⚠️ 2. P1 이슈 증가 (2건 → 5건)
⚠️ 3. Tier 2 탐색적 테스트 시간 부족 (계획 5h → 실제 2h)
```

**액션 아이템 (Action Items)**:
```
🎯 1. 5개 실패 테스트 root cause 분석 및 수정
   - Owner: QA 헤드
   - Deadline: 다음주 화요일

🎯 2. P1 이슈 트리아지 및 우선순위 재평가
   - Owner: QA 헤드 + 개발자
   - Deadline: 다음주 월요일

🎯 3. Tier 2 탐색적 테스트 시간 확보 방안 논의
   - Owner: 전체 팀
   - Deadline: 다음 스프린트 계획 시
```

## Step 3: 주간 리포트 생성

CLAUDE.md 표준 형식에 따라 리포트 작성:

```markdown
# 주간 QA 리포트 - Week N

**보고 기간**: YYYY-MM-DD ~ YYYY-MM-DD
**작성자**: QA 헤드
**작성일**: YYYY-MM-DD

---

## 📊 핵심 지표 (Key Metrics)

| Metric | This Week | Last Week | Target | Status |
|--------|-----------|-----------|--------|--------|
| Pass Rate | XX% | XX% | 95% | ✅/⚠️/❌ |
| Automation Coverage | XX% | XX% | 80% | ✅/⚠️/❌ |
| Open P0 Issues | X | X | 0 | ✅/⚠️/❌ |
| Avg P0 Resolution | Xh | Xh | 24h | ✅/⚠️/❌ |

**Status Legend**:
- ✅ 목표 달성 (Green)
- ⚠️ 개선 필요 (Yellow)
- ❌ 목표 미달 (Red)

---

## 🧪 테스트 실행 현황

### 전체 테스트 요약
- **Total Executed**: X건
- **Pass**: X건 (XX%)
- **Fail**: X건 (XX%)
- **Blocked/Skipped**: X건 (XX%)

### Tier별 상세
| Tier | Executed | Pass | Fail | Pass Rate |
|------|----------|------|------|-----------|
| Tier 1 (회귀) | X | X | X | XX% |
| Tier 2 (탐색) | X | X | X | XX% |
| Tier 3 (신규) | X | X | X | XX% |

---

## 🐛 이슈 현황

### 신규 이슈
- **P0 (Critical)**: X건
- **P1 (High)**: X건
- **P2 (Medium)**: X건
- **P3 (Low)**: X건
- **Total**: X건

### 해결된 이슈
- **P0**: X건 (평균 해결 시간: Xh)
- **P1**: X건 (평균 해결 시간: Xd)
- **P2**: X건 (평균 해결 시간: Xd)
- **P3**: X건
- **Total**: X건

### 오픈 이슈 (현재)
- **P0**: X건 [Blocking]
- **P1**: X건
- **P2**: X건
- **P3**: X건
- **Total**: X건

### 주요 이슈 상세 (P0/P1만)
[P0/P1 이슈 목록 및 상태]

---

## 🤖 자동화 현황

### 커버리지 진행
- **Current Coverage**: XX% (XX/XX tests)
- **New This Week**: +X tests automated
- **Target**: 80% (by YYYY-MM)
- **Progress**: [██████████░░░░░░] XX%

### 자동화 실행 결과
- **Total Automated Tests**: X건
- **Execution Time**: X분
- **Pass Rate**: XX%
- **Flaky Tests**: X건 (요개선)

### 이번 주 자동화 추가
1. TC-XXX → TC-REG-XXX: [테스트명]
2. TC-XXX → TC-REG-XXX: [테스트명]

---

## 🚀 릴리즈 현황

### 릴리즈 결정
- **Status**: ✅ Go / ❌ No-go / N/A
- **Date**: YYYY-MM-DD
- **Version**: vX.X.X

### 릴리즈된 기능
[기능 목록 및 테스트 결과]

### 블로킹 이슈
[있다면 상세]

### 프로덕션 현황
- **Production Incidents**: X건
- **Rollback**: X회
- **Hotfix**: X건

---

## 👥 팀 활동

### 시간 투입 현황
| 역할 | 계획 | 실제 | Tier 1 | Tier 2 | Tier 3 | 기타 |
|------|------|------|--------|--------|--------|------|
| QA 헤드 | 15h | Xh | Xh | Xh | Xh | Xh |
| 클라우드 | 5h | Xh | Xh | Xh | Xh | Xh |
| 디자이너 | 5h | Xh | Xh | Xh | Xh | Xh |
| 개발자 | 3h | Xh | Xh | Xh | Xh | Xh |

### Tier 2 탐색적 테스트
- **담당자**: [이름]
- **시나리오**: [탐색한 시나리오]
- **발견 사항**:
  - 버그: X건
  - UX 개선점: X건
  - 인사이트: [주요 인사이트]

---

## 💡 주요 인사이트

### ✅ 잘된 점 (Wins)
1. [성과 1]
2. [성과 2]
3. [성과 3]

### ⚠️ 개선 필요 (Areas for Improvement)
1. [개선점 1]
2. [개선점 2]
3. [개선점 3]

### 🎯 액션 아이템 (Action Items)
1. **[Action Item 1]**
   - 담당: [담당자]
   - 기한: YYYY-MM-DD
   - Priority: P0/P1/P2

2. **[Action Item 2]**
   - 담당: [담당자]
   - 기한: YYYY-MM-DD
   - Priority: P0/P1/P2

---

## 📅 다음 주 계획

### Tier 3 신규 기능
1. **[Feature Name]**
   - 일정: YYYY-MM-DD ~ YYYY-MM-DD
   - 예상 케이스: X건
   - 담당: [담당자]

### 자동화 목표
- Tier 1 이관: X건
- Coverage 목표: XX% → YY%

### 특이사항
- [다음 주 특별 이벤트/마일스톤]

---

## 📎 참고 링크

- [Notion - 테스트 케이스 통합 DB](링크)
- [Notion - 이슈 트래킹 DB](링크)
- [CI/CD - 자동화 대시보드](링크)
- [프로덕션 모니터링](링크)

---

**다음 리포트**: YYYY-MM-DD (금요일)
```

## Step 4: Executive Summary 생성

팀 공유용 간단 요약 (Slack/Email):

```markdown
📊 **주간 QA 리포트 - Week N** (MM/DD ~ MM/DD)

**Status**: ✅ Good / ⚠️ Caution / 🔴 Critical

**Key Metrics**:
• Pass Rate: XX% (Target: 95%) ✅/⚠️/❌
• Automation: XX% (Target: 80%) ✅/⚠️/❌
• Open P0: X건 ✅/⚠️/❌
• Release: Go / No-go / N/A

**Highlights**:
✅ [Major win]
⚠️ [Area needing attention]

**Action Required**:
🎯 [Critical action item]

📄 Full report: [Notion 링크]
```

## Step 5: 리포트 배포 및 아카이브

**배포**:
1. Notion 주간 QA 리포트 DB에 저장
2. Executive Summary를 Slack QA 채널에 공유
3. 팀 이메일로 전체 리포트 링크 공유

**아카이브**:
- 주간 리포트 DB에 영구 보관
- 트렌드 분석을 위한 데이터 축적
- 회고 및 프로세스 개선 자료로 활용

# Guidelines

- **데이터 기반**: 모든 지표는 실제 데이터에서 추출
- **객관적 평가**: 좋은 것과 나쁜 것 모두 투명하게 보고
- **트렌드 중시**: 단일 주보다 추세가 더 중요
- **액션 지향**: 모든 문제에는 액션 아이템 연결
- **간결한 요약**: Executive Summary는 1분 내 읽기 가능
- **시각적 표현**: 표, 차트, 아이콘으로 가독성 향상
- **맥락 제공**: 숫자에만 그치지 않고 의미 설명

# Quality Checks

리포트 완료 전 확인:
- [ ] 모든 핵심 지표 포함 (Pass Rate, Coverage, Issues, Release)
- [ ] 지난주 대비 트렌드 분석 완료
- [ ] Pass Rate이 95% 미만이면 원인 분석 포함
- [ ] 모든 P0/P1 이슈 상세 기술
- [ ] 자동화 커버리지 진행 상황 업데이트
- [ ] 팀 활동 시간 투입 현황 기록
- [ ] 잘된 점 최소 3가지 나열
- [ ] 개선 필요 사항 명시
- [ ] 액션 아이템에 담당자 및 기한 지정
- [ ] 다음 주 계획 포함
- [ ] Notion 형식으로 정리
- [ ] Executive Summary 작성

# Output Format

```markdown
## 📊 주간 QA 리포트 생성 완료

### Summary
- **기간**: YYYY-MM-DD ~ YYYY-MM-DD
- **Overall Status**: ✅ Good / ⚠️ Caution / 🔴 Critical
- **주요 하이라이트**: [1-2줄 요약]

### Key Metrics
- Pass Rate: XX% (목표 95%) ✅/⚠️/❌
- Automation: XX% (목표 80%) ✅/⚠️/❌
- Open P0: X건
- Release: Go / No-go

### Top 3 Wins ✅
1. [Win 1]
2. [Win 2]
3. [Win 3]

### Top 3 Improvements Needed ⚠️
1. [Improvement 1]
2. [Improvement 2]
3. [Improvement 3]

### Critical Action Items 🎯
1. [Action 1] - [Owner] - [Deadline]
2. [Action 2] - [Owner] - [Deadline]

### 📄 Full Report
[Notion 링크 또는 파일 경로]

### 📧 Next Steps
1. Slack에 Executive Summary 공유
2. 팀 이메일 발송
3. 금요일 회고 미팅에서 논의
```

# Integration with CLAUDE.md

항상 `/Users/atad/Desktop/QA/CLAUDE.md`를 참조:
- **주간 워크플로우**: 금요일 오후 리포트 작성
- **KPI 목표**: Pass Rate 95%, 자동화 80%
- **팀 구성**: QA헤드 15h, 클라우드 5h, 디자이너 5h, 개발자 3h
- **3-Tier 시스템**: 각 Tier 현황 포함

# Notes

- 이 커맨드는 **qa-weekly-reporter 스킬**을 내부적으로 활용합니다
- 리포트는 매주 금요일 오후(14:00-15:00)에 작성됩니다
- 회고 미팅(15:00-16:00) 전에 완료하여 미팅 자료로 활용합니다
- 데이터 수집 자동화를 위해 Notion API 활용을 고려할 수 있습니다
