---
description: 릴리즈 Go/No-go 검증 - 모든 테스트 결과 분석 및 최종 배포 승인 판단
model: sonnet
---

금요일 오전 릴리즈 미팅에서 사용하는 커맨드입니다. 모든 테스트 결과, 이슈 현황, 인수 조건을 종합 분석하여 Go/No-go 결정을 지원합니다.

예시: `/qa:release-check`

# Process

## Step 1: 릴리즈 정보 수집

**기본 정보 확인**:
```
릴리즈 버전: vX.X.X
목표 배포일: YYYY-MM-DD
신규 기능: [기능 목록]
```

**데이터 소스**:
- Tier 1 (회귀 테스트) 실행 결과
- Tier 3 (신규 기능 테스트) 실행 결과
- Tier 2 (탐색적 테스트) 발견 사항
- 이슈 트래킹 DB (P0/P1/P2/P3 오픈 이슈)
- 인수 조건 체크리스트

만약 정보가 부족하면 사용자에게 요청:
```
릴리즈 검증을 위해 다음 정보가 필요합니다:
- [ ] Tier 3 테스트 실행 결과 (Pass/Fail 수)
- [ ] Tier 1 회귀 테스트 결과
- [ ] 현재 오픈 이슈 현황 (P0/P1 우선)
- [ ] 인수 조건 체크리스트
```

## Step 2: qa-release-validator 에이전트 활용

**2.1 인수 조건 검증**:
각 인수 조건에 대해:
```
✅ AC-1: 사용자가 이메일/비밀번호로 로그인 가능
   - Verified by: TC-NEWF-001 (Pass), TC-NEWF-002 (Pass)

⚠️ AC-2: 5회 로그인 실패 시 계정 잠금
   - Verified by: TC-NEWF-004 (Fail - ISSUE-042 오픈)

❌ AC-3: 잠긴 계정에 복구 이메일 발송
   - Not Tested: 이메일 서비스 통합 미완료
```

**충족 비율 계산**:
```
Acceptance Criteria: 8개 중 6개 충족 (75%)
- Fully Met: 6
- Partially Met: 1
- Not Met: 1
```

**2.2 테스트 결과 분석**:

**Tier 3 (신규 기능)**:
```
Total: 35 tests
Pass: 33 (94.3%)
Fail: 2 (5.7%)

Pass Rate: 94.3% (Target: 95%) ⚠️

Failed Tests:
- TC-NEWF-004 (P0): 계정 잠금 실패
- TC-NEWF-018 (P2): 고급 검색 필터
```

**Tier 1 (회귀)**:
```
Total: 50 tests
Pass: 49 (98%)
Fail: 1 (2%)

Pass Rate: 98% ✅

Failed Test:
- TC-REG-015 (P1): 결제 타임아웃 (알려진 이슈)
```

**Tier 2 (탐색적)**:
```
Sessions: 3
Bugs Found: 4 (P1: 1, P2: 2, P3: 1)

Notable:
- P1: 모바일 레이아웃 깨짐 (iPhone SE)
- P2: 버튼 스타일 불일치
```

**2.3 이슈 현황 분석**:

**P0 (Critical) Issues**:
```
Total: 1 issue 🔴

ISSUE-042: 계정 잠금 기능 동작 안 함
- Status: In Progress
- Found: 2024-11-18
- Assignee: Backend Dev
- ETA: Today EOD
- Impact: 보안 취약점
- Workaround: None
```

**P1 (High) Issues**:
```
Total: 3 issues ⚠️

ISSUE-043: 모바일 레이아웃 깨짐
- Status: New
- Impact: 8% of mobile users
- Workaround: 데스크톱 사이트 사용

ISSUE-044: 결제 타임아웃
- Status: Known Issue
- Impact: 2% of transactions
- Workaround: 재시도

ISSUE-045: 프로필 이미지 업로드 실패
- Status: Fixed, 검증 대기
```

**P2/P3 Issues**:
```
Total: 8 issues ✅
Status: 다음 스프린트 처리 예정
```

## Step 3: Go/No-Go 기준 평가

**CLAUDE.md 기준 적용**:

### ✅ GO 조건
```
- [ ] 모든 인수 조건 충족
- [ ] P0 이슈 = 0
- [ ] Tier 1 Pass Rate ≥ 95%
- [ ] Tier 3 Pass Rate ≥ 95%
- [ ] 성능 테스트 통과
- [ ] 보안 테스트 통과
- [ ] 핵심 사용자 워크플로우 검증
```

### ⚠️ GO WITH CONDITIONS 조건
```
- [ ] 모든 인수 조건 충족 (또는 minor 누락만)
- [ ] P0 이슈 = 0
- [ ] P1 이슈 ≤ 3 with workarounds
- [ ] Pass Rate ≥ 90%
- [ ] 모니터링 계획 수립
- [ ] 롤백 계획 준비
```

### 🔴 NO-GO 조건
```
- [ ] P0 이슈 ≥ 1
- [ ] Critical AC 미충족
- [ ] Pass Rate < 90%
- [ ] 핵심 워크플로우 차단
- [ ] 보안 취약점 미해결
```

**현재 상태 평가**:
각 조건을 체크하고 현재 상태와 비교

## Step 4: 리스크 평가

**고위험 영역 식별**:

```markdown
### High Risk Areas

1. **계정 보안 기능 (P0 버그)**
   - Risk: 무한 로그인 시도 가능
   - Impact: Critical - 보안 취약점
   - Probability: 100% (버그 확인됨)
   - Mitigation: 릴리즈 차단, 버그 수정 후 재검증

2. **모바일 UX (P1 버그)**
   - Risk: iPhone SE 사용자 경험 저하
   - Impact: High - 8% 사용자 영향
   - Probability: 100% (재현됨)
   - Mitigation:
     - Option 1: 수정 후 배포
     - Option 2: 알려진 이슈로 배포, 다음주 핫픽스
     - Option 3: 모바일 기능 일시 비활성화

3. **결제 타임아웃 (Known Issue)**
   - Risk: 2% 결제 실패
   - Impact: Medium - 매출 손실
   - Probability: Low (2%)
   - Mitigation: 모니터링 강화, 자동 재시도 로직
```

**종합 리스크 점수**:
- P0 이슈 존재: 🔴 High Risk
- P0 없음, P1 3개 이하: 🟡 Medium Risk
- P0 없음, P1 없음: 🟢 Low Risk

## Step 5: Go/No-Go 의사결정

**의사결정 프레임워크 적용**:

### 시나리오 1: 명확한 GO
```
✅ 모든 AC 충족
✅ P0 = 0
✅ Pass Rate ≥ 95%
✅ 리스크 낮음

→ **결정: ✅ GO**
→ 금요일 오후 2시 배포 진행
```

### 시나리오 2: 조건부 GO
```
✅ 대부분 AC 충족 (8/9)
✅ P0 = 0
⚠️ Pass Rate 92% (약간 낮음)
⚠️ P1 이슈 3개 (workaround 존재)

→ **결정: ⚠️ GO WITH CONDITIONS**
→ 조건:
   1. P1 이슈 모니터링 강화
   2. 다음주 화요일 핫픽스 예정
   3. 롤백 준비 완료
```

### 시나리오 3: NO-GO
```
❌ P0 이슈 1개 오픈
❌ Critical AC 미충족
⚠️ Pass Rate 88%

→ **결정: 🔴 NO-GO**
→ 차단 이슈:
   1. ISSUE-042 (P0) - 계정 잠금 버그
   2. AC-2 미충족 - 보안 요구사항
→ 다음 단계:
   1. P0 버그 수정 (오늘 EOD)
   2. 재테스트 (토요일)
   3. 월요일 재평가
```

## Step 6: 프로덕션 검증 계획 수립

**GO 결정인 경우**:

**Pre-Deployment Checklist**:
```markdown
## 배포 전 체크리스트

### Infrastructure
- [ ] Staging 환경이 Production과 일치
- [ ] Database migration 테스트 완료
- [ ] Feature flags 설정 확인
- [ ] Rollback 절차 문서화

### Monitoring
- [ ] Error tracking 활성화 (Sentry 등)
- [ ] Performance monitoring 설정 (New Relic 등)
- [ ] User analytics 확인
- [ ] Alert threshold 설정

### Communication
- [ ] 팀 배포 일정 공지
- [ ] Support 팀 브리핑
- [ ] 알려진 이슈 문서화
- [ ] 사용자 공지 (필요 시)
```

**Post-Deployment Smoke Test**:
```markdown
## 프로덕션 Smoke Test (15분)

Critical Path:
1. [ ] 홈페이지 로딩 (< 2s)
2. [ ] 사용자 회원가입
3. [ ] 사용자 로그인
4. [ ] 핵심 기능 1 (예: 상품 검색)
5. [ ] 핵심 기능 2 (예: 장바구니 추가)
6. [ ] 핵심 기능 3 (예: 결제)
7. [ ] 프로필 수정
8. [ ] 로그아웃

System Health:
- [ ] Error rate < 1%
- [ ] Response time < 2s (95th percentile)
- [ ] No 500 errors
- [ ] Database stable
- [ ] External APIs responding
```

**Monitoring Plan**:
```markdown
## 배포 후 모니터링

**First 1 Hour**:
- Active monitoring (QA + Dev on standby)
- Check every 5 minutes
- Ready to rollback

**First 4 Hours**:
- Regular checks every 30 min
- Monitor error rates, performance

**First 24 Hours**:
- Check every 2 hours
- Review user feedback

**First 48 Hours**:
- Daily health check
- Plan retrospective
```

## Step 7: 릴리즈 검증 리포트 생성

**종합 리포트 작성**:

```markdown
# 릴리즈 검증 리포트 - vX.X.X

**Release Version**: vX.X.X
**Target Date**: YYYY-MM-DD
**Validated By**: QA 헤드
**Validation Date**: YYYY-MM-DD HH:MM

---

## 🎯 Go/No-Go 결정

### ✅ GO / ⚠️ GO WITH CONDITIONS / 🔴 NO-GO

**결정 근거**:
[데이터 기반 명확한 설명]

**조건 (조건부 GO인 경우)**:
1. [조건 1]
2. [조건 2]

---

## 📋 인수 조건 검증

| Criterion | Status | Test Coverage | Notes |
|-----------|--------|---------------|-------|
| AC-1 | ✅ | TC-NEWF-001, 002 | 완전 검증 |
| AC-2 | ❌ | TC-NEWF-004 | ISSUE-042 차단 |

**Summary**: X/Y 조건 충족 (XX%)

---

## 🧪 테스트 결과

### Tier 3 (신규 기능)
- Total: 35, Pass: 33 (94.3%)
- Status: ⚠️ 목표(95%) 약간 미달

### Tier 1 (회귀)
- Total: 50, Pass: 49 (98%)
- Status: ✅ 목표 초과

### Tier 2 (탐색적)
- Bugs: 4 (P0:0, P1:1, P2:2, P3:1)
- Status: ✅ P0 없음

---

## 🐛 이슈 현황

### P0 Issues (Critical)
[상세 내역]

### P1 Issues (High)
[상세 내역]

---

## ⚠️ 리스크 평가

[고위험 영역 및 완화 전략]

**Overall Risk**: 🔴 High / 🟡 Medium / 🟢 Low

---

## ✅ 프로덕션 검증 계획

### Pre-Deployment Checklist
[체크리스트]

### Post-Deployment Smoke Test
[Critical path 검증]

### Monitoring Plan
[1시간/4시간/24시간/48시간 계획]

---

## 🚀 다음 단계

**If GO**:
1. 금요일 오후 2시 배포
2. Smoke test 즉시 실행
3. 1시간 집중 모니터링

**If GO WITH CONDITIONS**:
[조건 및 contingency plan]

**If NO-GO**:
[차단 이슈 및 재검증 일정]

---

## 📎 참고 문서
- [테스트 결과 대시보드](링크)
- [이슈 트래킹](링크)
- [Rollback 절차](링크)
```

# Guidelines

- **데이터 기반 결정**: 감이 아닌 객관적 데이터로 판단
- **투명한 소통**: 문제를 숨기지 않고 명확히 표현
- **비즈니스 맥락 고려**: 품질과 비즈니스 요구 균형
- **리스크 정량화**: "위험하다" → "8%의 사용자가 영향받음"
- **대안 제시**: NO-GO인 경우 해결 방안 명시
- **롤백 준비**: 항상 Plan B 보유
- **명확한 기준**: CLAUDE.md의 Go/No-go 기준 엄격히 적용

# Quality Checks

리포트 완료 전 확인:
- [ ] 모든 인수 조건 검증됨
- [ ] 모든 테스트 결과 분석됨 (Tier 1, 2, 3)
- [ ] 모든 오픈 이슈 우선순위 트리아지됨
- [ ] Go/No-go 기준이 객관적으로 평가됨
- [ ] 리스크 평가 완료 및 완화 전략 수립
- [ ] 프로덕션 검증 계획 문서화됨
- [ ] 롤백 계획 존재 (GO/조건부 GO인 경우)
- [ ] 의사결정 근거가 명확하고 방어 가능함
- [ ] 다음 단계가 구체적이고 책임자 지정됨
- [ ] Notion 형식으로 정리됨

# Output Format

```markdown
## 🎯 릴리즈 결정: ✅ GO / ⚠️ GO WITH CONDITIONS / 🔴 NO-GO

### 핵심 요약
- **버전**: vX.X.X
- **배포 예정**: YYYY-MM-DD HH:MM
- **결정**: [GO/NO-GO]
- **주요 근거**: [1문장 핵심 이유]

### 품질 지표
- Tier 3 Pass Rate: XX% (목표 95%)
- Tier 1 Pass Rate: XX% (목표 95%)
- P0 Issues: X (목표 0)
- AC 충족: X/Y (XX%)

### 다음 단계
1. [즉시 실행할 액션]
2. [후속 조치]
3. [모니터링 계획]

📄 **상세 리포트**: [Notion 링크]
```

# Integration with CLAUDE.md

항상 `/Users/atad/Desktop/QA/CLAUDE.md`를 참조:
- **Go/No-go 기준**: P0=0, Pass Rate≥95%
- **금요일 오전**: 릴리즈 미팅 (10:00-11:00)
- **품질 우선 원칙**: 릴리즈 속도보다 품질
- **3-Tier 시스템**: 모든 Tier 결과 종합 분석

# Notes

- 이 커맨드는 **qa-release-validator 에이전트**를 내부적으로 활용합니다
- 리포트는 팀 전체 및 경영진과 공유됩니다
- NO-GO 결정도 중요한 의사결정입니다 - 두려워하지 마세요
- 조건부 GO는 명확한 조건과 contingency plan이 있을 때만 사용하세요
