---
name: QA Weekly Reporter
description: Generate comprehensive weekly QA reports from test execution data, issue tracking, and automation metrics. Use when the user asks to create a weekly report, mentions "주간 리포트", "weekly report", "QA 리포트", or when it's Friday afternoon and reporting is needed.
---

# QA Weekly Reporter

## Purpose

This skill automatically generates structured weekly QA reports that summarize testing activities, quality metrics, and actionable insights for stakeholders. It follows the project's CLAUDE.md standards for weekly reporting.

## When to Use

Use this skill when:
- User asks to create or generate a weekly QA report
- User mentions "주간 리포트", "weekly report", or "QA summary"
- It's Friday afternoon (14:00-16:00) and reporting time
- User provides test execution data and asks for analysis
- User wants to track KPIs (Pass Rate, automation coverage, etc.)
- Sprint/week completion requires documentation

## Instructions

### 1. Data Collection

First, gather all necessary data from the week:

**Test Execution Data**:
- Total test cases executed (Tier 1 + Tier 2 + Tier 3)
- Pass count
- Fail count
- Blocked/Skipped count
- Pass Rate calculation

**Issue Tracking Data**:
- New issues discovered (by priority: P0/P1/P2/P3)
- Issues resolved this week
- Currently open issues
- Average resolution time by priority
- Critical issues (P0) status

**Automation Metrics**:
- Current automation coverage %
- New automated tests added this week
- Automation execution time
- Flaky test count

**Release Information**:
- Release status (Go/No-go)
- Features released
- Features blocked
- Production incidents (if any)

**Team Activity**:
- Hours spent per tier (Tier 1/2/3)
- Team member contributions
- Exploratory testing findings

If data is missing, ask the user:
- What is the test execution summary?
- How many issues were found and resolved?
- What is the current automation coverage?
- Was there a release this week?

### 2. Calculate KPIs

Calculate key performance indicators:

**Pass Rate**:
```
Pass Rate = (Pass Count / Total Executed) × 100%
Target: 95% or higher
```

**Automation Coverage**:
```
Automation Coverage = (Automated Tests / Total Tier 1 Tests) × 100%
Target: 80% (6-month goal)
```

**Issue Resolution Metrics**:
- P0: Average time to resolve (Target: 24 hours)
- P1: Average time to resolve (Target: 3 days)
- P2: Average time to resolve (Target: 7 days)

**Release Health**:
- Go/No-go decision
- Blocking issues count
- Production incident count

### 3. Generate Report

Create the report following this structure:

```markdown
# 주간 QA 리포트 - Week [N]

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
| Avg P0 Resolution Time | Xh | Xh | 24h | ✅/⚠️/❌ |

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

### 주요 이슈 상세

#### P0 이슈 (있는 경우만)
1. **[ISSUE-XXX] 이슈 제목**
   - Status: In Progress / Resolved
   - Assigned: 담당자
   - Found: YYYY-MM-DD
   - Impact: 상세 영향도

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
1. TC-XXX: 테스트명 (Tier X → Tier 1)
2. TC-XXX: 테스트명 (Tier X → Tier 1)

---

## 🚀 릴리즈 현황

### 릴리즈 결정
- **Status**: ✅ Go / ❌ No-go
- **Date**: YYYY-MM-DD
- **Version**: vX.X.X

### 릴리즈된 기능
1. **[Feature Name]**
   - Tier 3 테스트: X건 (Pass Rate: XX%)
   - 주요 검증 항목: [항목 나열]
   - Status: ✅ Released / ⏸️ Blocked

### 블로킹 이슈
- P0 이슈로 인한 릴리즈 지연/보류 내역

### 프로덕션 현황
- Production Incidents: X건
- Rollback: X회
- Hotfix: X건

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

### 4. Status Indicators

Use clear status indicators:

**✅ Green (목표 달성)**:
- Pass Rate ≥ 95%
- P0 issues = 0
- Automation coverage on track
- All releases successful

**⚠️ Yellow (개선 필요)**:
- Pass Rate 90-94%
- P0 issues resolved but took > 24h
- Automation coverage slightly behind
- Minor production incidents

**❌ Red (목표 미달)**:
- Pass Rate < 90%
- Open P0 issues exist
- Release blocked
- Major production incidents

### 5. Insights and Recommendations

Provide actionable insights:

**Trend Analysis**:
- Compare current week vs last week
- Identify improving/degrading metrics
- Highlight patterns (e.g., recurring issues)

**Risk Assessment**:
- Flag concerning trends (e.g., declining Pass Rate)
- Identify bottlenecks (e.g., slow P0 resolution)
- Predict future issues (e.g., coverage falling behind)

**Recommendations**:
- Specific, actionable suggestions
- Prioritized by impact
- Assigned to specific roles

## Guidelines

**DO**:
- Base all data on actual measurements
- Show week-over-week trends
- Highlight both wins and areas for improvement
- Include specific action items with owners
- Use visual indicators (✅⚠️❌) for quick scanning
- Link to relevant Notion pages for details
- Keep executive summary concise
- Provide context for metrics (why they matter)

**DON'T**:
- Make up data - ask if information is missing
- Only report positive news (be transparent)
- Use vague language ("some issues", "a few tests")
- Skip trend analysis
- Forget to assign action items
- Ignore automation coverage tracking
- Overlook team time investment

## Examples

### Example 1: Successful Week

**Input**:
```
기간: 2024-11-11 ~ 2024-11-15
테스트:
- Tier 1: 50건 (Pass 49, Fail 1) = 98%
- Tier 2: 8시나리오 (버그 2건 발견)
- Tier 3: 35건 (Pass 33, Fail 2) = 94.3%
이슈:
- 신규: P0(0), P1(3), P2(5) = 8건
- 해결: P0(0), P1(4), P2(3) = 7건
- 오픈: P0(0), P1(2), P2(8) = 10건
자동화:
- 현재: 38/50 = 76%
- 신규 추가: 3건
릴리즈: Go (v2.3.0, 11/15)
```

**Output**: [Full report as shown in template with all data filled in, showing ✅ for Pass Rate, ⚠️ for automation coverage, insights highlighting successful release and steady automation progress]

### Example 2: Challenging Week

**Input**:
```
기간: 2024-11-18 ~ 2024-11-22
테스트:
- Tier 1: 50건 (Pass 45, Fail 5) = 90%
- Tier 3: 28건 (Pass 23, Fail 5) = 82.1%
이슈:
- 신규: P0(1), P1(5), P2(4) = 10건
- 해결: P0(1/48시간), P1(2), P2(1) = 4건
- 오픈: P0(0), P1(5), P2(11) = 16건
자동화: 38/50 = 76% (변화 없음)
릴리즈: No-go (P0 이슈로 인한 지연)
```

**Output**: [Full report showing ❌ for Pass Rate, ❌ for P0 resolution time, detailed P0 issue section, action items for addressing quality concerns, recommendation to focus on stability before new features]

## Best Practices

### 1. Data Accuracy
- Verify all numbers before reporting
- Cross-check with Notion databases
- Ensure calculations are correct (Pass Rate, etc.)

### 2. Storytelling
- Start with executive summary (1-2 sentences)
- Use data to tell the week's story
- Connect metrics to business impact

### 3. Actionable Insights
- Don't just report numbers, explain what they mean
- Every ❌ or ⚠️ should have a corresponding action item
- Prioritize recommendations by impact

### 4. Consistent Format
- Use the same template every week for comparability
- Maintain consistent naming conventions
- Keep report length manageable (2-3 pages)

### 5. Stakeholder Focus
- QA 헤드: All details
- 개발자: Issues and action items
- 경영진: Executive summary and key metrics
- 클라우드: Automation and infrastructure

## Integration with CLAUDE.md

Always follow standards from `/Users/atad/Desktop/QA/CLAUDE.md`:

**KPI Targets**:
- Pass Rate: 95% or higher
- Automation Coverage: 80% (6-month goal)
- P0 Resolution Time: 24 hours
- P1 Resolution Time: 3 days
- P2 Resolution Time: 7 days

**Workflow**:
- Reports generated every Friday afternoon (14:00-16:00)
- Part of weekly retrospective
- Shared with entire team
- Archived in Notion

**3-Tier System**:
- Track each tier separately
- Show Tier 3 → Tier 1 migration progress
- Highlight Tier 2 exploratory findings

## Output Format

Provide the report in two formats:

### 1. Markdown Format (for Notion)
- Full structured report as shown in template
- Ready to paste into Notion
- Includes all sections and tables

### 2. Executive Summary (for Slack/Email)
```
📊 주간 QA 리포트 - Week N (MM/DD ~ MM/DD)

**Status**: ✅ Good / ⚠️ Caution / ❌ Critical

**Key Metrics**:
• Pass Rate: XX% (Target: 95%)
• Automation: XX% (Target: 80%)
• Open P0: X건
• Release: Go / No-go

**Highlights**:
✅ [Major win]
⚠️ [Area needing attention]

**Action Required**:
🎯 [Critical action item]

Full report: [Notion link]
```

## Error Handling

If data is incomplete:

1. **List what's missing**:
   ```
   다음 정보가 필요합니다:
   - [ ] 테스트 실행 결과 (Tier 1, 2, 3)
   - [ ] 이슈 현황 (신규/해결/오픈)
   - [ ] 자동화 커버리지
   - [ ] 릴리즈 상태
   ```

2. **Provide what you can**:
   - Generate report with available data
   - Mark missing sections as "데이터 없음"
   - Estimate based on trends (with disclaimer)

3. **Ask specific questions**:
   - "Tier 3 테스트는 몇 건 실행했나요?"
   - "P0 이슈는 몇 건 발견되었나요?"
   - "이번 주 릴리즈 여부는 어떻게 되었나요?"

## Notes

- Reports should be objective and data-driven
- Celebrate wins but don't hide problems
- Trends are more important than single-week metrics
- Action items must have owners and deadlines
- Review previous week's action items for follow-up
- Keep report concise but comprehensive
- Archive all weekly reports in Notion for historical tracking
