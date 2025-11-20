---
name: QA Notion Formatter
description: Format test cases, bug reports, and QA content for Notion database import. Use when the user wants to import test cases to Notion, mentions "Notion 형식", "노션 데이터베이스", "bulk import", or needs to convert markdown content to Notion-compatible format.
---

# QA Notion Formatter

## Purpose

This skill converts test cases, bug reports, and QA documentation into Notion database-compatible formats. It handles property mapping, CSV generation for bulk import, and markdown-to-Notion conversion following the project's database schema defined in CLAUDE.md.

## When to Use

Use this skill when:
- User wants to import test cases into Notion
- User mentions "Notion 형식", "노션으로 올려", "bulk import"
- User has test cases in markdown and needs Notion format
- User asks to create a CSV for Notion import
- User wants to format content for the 테스트 케이스 통합 DB
- User needs to convert bug reports or weekly reports to Notion

## Instructions

### 1. Understand Target Database Schema

First, identify which Notion database the content is for:

**테스트 케이스 통합 DB (Test Case Master DB)**:
```
Required Fields:
- TC ID (Title): Text - "TC-TIER-XXX"
- 테스트명 (Test Name): Text
- Tier: Select - "Tier 1" / "Tier 2" / "Tier 3"
- Priority: Select - "P0" / "P1" / "P2" / "P3"
- Status: Select - "작성완료" / "실행중" / "Pass" / "Fail" / "Blocked"
- Test Type: Multi-select - "기능" / "성능" / "보안" / "UI" / "통합"
- 담당: Person - "QA 헤드" / "클라우드" / "디자이너" / "개발자"

Optional Fields:
- 전제조건 (Preconditions): Text (Long)
- 테스트 단계 (Test Steps): Text (Long)
- 예상 결과 (Expected Results): Text (Long)
- 테스트 데이터 (Test Data): Text
- 비고 (Notes): Text
- 자동화 여부 (Automated): Checkbox
- 자동화 스크립트 (Script Link): URL
- 생성일 (Created): Date
- 마지막 실행일 (Last Run): Date
```

**이슈 트래킹 DB (Issue Tracking DB)**:
```
Required Fields:
- Issue ID (Title): Text - "ISSUE-XXX"
- 이슈명 (Issue Name): Text
- Priority: Select - "P0" / "P1" / "P2" / "P3"
- Status: Select - "New" / "In Progress" / "Resolved" / "Closed" / "Reopened"
- Severity: Select - "Critical" / "High" / "Medium" / "Low"
- 발견자 (Reporter): Person
- 담당자 (Assignee): Person
- Tier: Select - "Tier 1" / "Tier 2" / "Tier 3"

Optional Fields:
- 재현율 (Reproducibility): Select - "100%" / "75%" / "50%" / "25%" / "Random"
- 환경 (Environment): Multi-select - "Chrome" / "Safari" / "Firefox" / "Mobile"
- 현상 (Description): Text (Long)
- 재현 단계 (Steps to Reproduce): Text (Long)
- 예상 결과 (Expected): Text
- 실제 결과 (Actual): Text
- 첨부 (Attachments): Files
- 발견일 (Found Date): Date
- 해결일 (Resolved Date): Date
```

**주간 QA 리포트 DB (Weekly Report DB)**:
```
Required Fields:
- Week (Title): Text - "Week N (MM/DD ~ MM/DD)"
- 기간 (Period): Date Range
- Pass Rate: Number (%)
- Automation Coverage: Number (%)
- 총 테스트 (Total Tests): Number
- Pass: Number
- Fail: Number
- 신규 이슈 (New Issues): Number
- 해결 이슈 (Resolved Issues): Number
- 오픈 이슈 (Open Issues): Number
- Release Status: Select - "Go" / "No-go" / "N/A"

Optional Fields:
- 요약 (Summary): Text (Long)
- 주요 인사이트 (Insights): Text (Long)
- 액션 아이템 (Action Items): Relation (to Task DB)
- 리포트 링크 (Report Link): URL
```

### 2. Parse Input Content

Analyze the user's input format:

**From Markdown Test Cases**:
```markdown
### TC-NEWF-001: 유효한 계정으로 로그인 성공
**Priority**: P0
**Test Type**: 기능
**담당**: QA 헤드

**전제조건**:
- 가입된 사용자 계정 존재

**테스트 단계**:
1. 로그인 페이지 접속
2. 이메일 입력
3. 비밀번호 입력
4. 로그인 버튼 클릭

**예상 결과**:
- 대시보드로 리다이렉트
- 사용자 이름 표시
```

Extract:
- TC ID: TC-NEWF-001
- 테스트명: 유효한 계정으로 로그인 성공
- Tier: Tier 3 (from "NEWF")
- Priority: P0
- Test Type: 기능
- 담당: QA 헤드
- 전제조건: [content]
- 테스트 단계: [content]
- 예상 결과: [content]

**From Structured Data**:
```
TC-AUTH-001, 로그인 테스트, Tier 1, P0, Pass, 기능, QA 헤드
```

### 3. Generate Notion-Compatible Format

Provide output in requested format:

#### Format A: CSV for Bulk Import

```csv
TC ID,테스트명,Tier,Priority,Status,Test Type,담당,전제조건,테스트 단계,예상 결과,테스트 데이터,비고,자동화 여부
TC-NEWF-001,유효한 계정으로 로그인 성공,Tier 3,P0,작성완료,기능,QA 헤드,"- 가입된 사용자 계정 존재","1. 로그인 페이지 접속
2. 이메일 입력: test@example.com
3. 비밀번호 입력: Test1234!
4. 로그인 버튼 클릭","- 대시보드로 리다이렉트 (/dashboard)
- 사용자 이름 표시
- JWT 토큰 저장","Email: test@example.com
Password: Test1234!",크롬/사파리/모바일 확인 필요,FALSE
TC-NEWF-002,잘못된 비밀번호로 로그인 실패,Tier 3,P0,작성완료,기능,QA 헤드,"- 가입된 사용자 계정 존재","1. 로그인 페이지 접속
2. 유효한 이메일 입력
3. 잘못된 비밀번호 입력
4. 로그인 버튼 클릭","- 에러 메시지 표시
- 로그인 페이지 유지
- 실패 로그 기록",,보안 중요 케이스,FALSE
```

**CSV Guidelines**:
- First row: Column headers matching Notion property names
- Escape commas in content with quotes
- Use `\n` for line breaks within cells
- Use `TRUE`/`FALSE` for checkbox fields
- Empty cells for optional fields

#### Format B: Notion API JSON

```json
{
  "parent": { "database_id": "DATABASE_ID_HERE" },
  "properties": {
    "TC ID": {
      "title": [
        {
          "text": { "content": "TC-NEWF-001" }
        }
      ]
    },
    "테스트명": {
      "rich_text": [
        {
          "text": { "content": "유효한 계정으로 로그인 성공" }
        }
      ]
    },
    "Tier": {
      "select": { "name": "Tier 3" }
    },
    "Priority": {
      "select": { "name": "P0" }
    },
    "Status": {
      "select": { "name": "작성완료" }
    },
    "Test Type": {
      "multi_select": [
        { "name": "기능" }
      ]
    },
    "담당": {
      "people": []
    },
    "자동화 여부": {
      "checkbox": false
    }
  },
  "children": [
    {
      "object": "block",
      "type": "heading_2",
      "heading_2": {
        "rich_text": [{ "text": { "content": "전제조건" } }]
      }
    },
    {
      "object": "block",
      "type": "bulleted_list_item",
      "bulleted_list_item": {
        "rich_text": [{ "text": { "content": "가입된 사용자 계정 존재" } }]
      }
    },
    {
      "object": "block",
      "type": "heading_2",
      "heading_2": {
        "rich_text": [{ "text": { "content": "테스트 단계" } }]
      }
    },
    {
      "object": "block",
      "type": "numbered_list_item",
      "numbered_list_item": {
        "rich_text": [{ "text": { "content": "로그인 페이지 접속" } }]
      }
    }
  ]
}
```

#### Format C: Notion Table (Copy-Paste Ready)

```
| TC ID | 테스트명 | Tier | Priority | Status | Test Type | 담당 |
|-------|----------|------|----------|--------|-----------|------|
| TC-NEWF-001 | 유효한 계정으로 로그인 성공 | Tier 3 | P0 | 작성완료 | 기능 | QA 헤드 |
| TC-NEWF-002 | 잘못된 비밀번호로 로그인 실패 | Tier 3 | P0 | 작성완료 | 기능 | QA 헤드 |
```

**Note**: This format can be copied and pasted directly into Notion. Notion will auto-detect the table structure.

#### Format D: Notion Import Template

Provide a downloadable template:

```markdown
# Notion Import Instructions

## 1. Prepare CSV File

Save the following as `test_cases_import.csv`:

[CSV content here]

## 2. Import to Notion

1. Open your 테스트 케이스 통합 DB in Notion
2. Click "⋮" menu (top right) → "Import"
3. Select "CSV"
4. Choose `test_cases_import.csv`
5. Map columns to properties:
   - TC ID → TC ID (Title)
   - 테스트명 → 테스트명
   - Tier → Tier (Select)
   - Priority → Priority (Select)
   - [continue mapping...]
6. Click "Import"

## 3. Verify Import

- Check all rows imported successfully
- Verify Select fields have correct options
- Ensure multi-line text fields preserved line breaks
- Confirm checkbox fields are TRUE/FALSE

## 4. Post-Import Cleanup

- Assign people to "담당" field
- Link automation scripts if applicable
- Add any missing attachments
```

### 4. Handle Edge Cases

**TC ID Tier Detection**:
```
TC-REG-001 → Tier 1 (Regression)
TC-EXPL-001 → Tier 2 (Exploratory)
TC-NEWF-001 → Tier 3 (New Feature)
TC-AUTH-001 → Detect from context or ask user
```

**Multi-line Content**:
- Preserve bullet points
- Maintain numbered lists
- Keep paragraph breaks
- Escape special characters in CSV

**Multi-select Fields**:
- Test Type can have multiple values: "기능, 성능"
- Split by comma in CSV
- Create array in JSON

**Date Fields**:
- Accept various formats: "2024-11-20", "11/20/2024", "Nov 20, 2024"
- Convert to ISO 8601: "2024-11-20"
- Handle date ranges for weekly reports

### 5. Validation

Before outputting, validate:

**Required Fields**:
- [ ] TC ID follows format TC-[TIER]-[NUMBER]
- [ ] Priority is one of P0/P1/P2/P3
- [ ] Tier is one of Tier 1/Tier 2/Tier 3
- [ ] Status is valid option
- [ ] Test Type is valid option(s)

**Data Quality**:
- [ ] No empty required fields
- [ ] Multi-line text properly escaped
- [ ] Date formats valid
- [ ] Person fields have valid names
- [ ] URLs are well-formed

**CSV Specific**:
- [ ] Headers match Notion property names exactly
- [ ] Commas in content are quoted
- [ ] Line breaks use `\n` not actual breaks
- [ ] No trailing commas

## Guidelines

**DO**:
- Preserve original content exactly (don't summarize)
- Maintain formatting (bullets, numbers, bold)
- Validate all fields before output
- Provide import instructions
- Offer multiple format options
- Include post-import checklist
- Handle Korean characters correctly (UTF-8)
- Suggest property creation if fields missing

**DON'T**:
- Modify or summarize test case content
- Lose formatting in conversion
- Skip validation
- Assume database schema - confirm with user
- Forget to escape special characters
- Mix date formats
- Omit required fields

## Examples

### Example 1: Single Test Case to CSV

**Input**:
```markdown
### TC-NEWF-005: UI/UX 검수
**Priority**: P2
**Test Type**: UI
**담당**: 디자이너

**전제조건**: 로그인 페이지 접속

**테스트 단계**:
1. 디자인 가이드와 비교
2. 반응형 레이아웃 확인
3. 포커스 상태 확인

**예상 결과**:
- 디자인 가이드 100% 준수
- 모든 디바이스에서 정상
- 명확한 포커스 인디케이터

**비고**: Figma 디자인과 1:1 비교 필요
```

**Output**:
```csv
TC ID,테스트명,Tier,Priority,Status,Test Type,담당,전제조건,테스트 단계,예상 결과,테스트 데이터,비고,자동화 여부
TC-NEWF-005,UI/UX 검수,Tier 3,P2,작성완료,UI,디자이너,로그인 페이지 접속,"1. 디자인 가이드와 비교
2. 반응형 레이아웃 확인
3. 포커스 상태 확인","- 디자인 가이드 100% 준수
- 모든 디바이스에서 정상
- 명확한 포커스 인디케이터",,Figma 디자인과 1:1 비교 필요,FALSE
```

### Example 2: Multiple Test Cases (Bulk Import)

**Input**:
```
5 test cases for login feature, priorities P0-P2, mix of 기능/보안/UI
```

**Output**:
- Full CSV with 5 rows
- Import instructions
- Property mapping guide
- Post-import checklist

### Example 3: Bug Report to Notion

**Input**:
```markdown
## 버그 리포트

**Issue ID**: ISSUE-042
**Priority**: P1
**Severity**: High

**현상**: 로그인 후 세션이 5분만에 만료됨

**재현 단계**:
1. 로그인
2. 5분 대기
3. 페이지 새로고침

**예상**: 세션 유지 (30분)
**실제**: 로그아웃됨

**환경**: Chrome 119, macOS
**재현율**: 100%
```

**Output**:
```csv
Issue ID,이슈명,Priority,Status,Severity,발견자,담당자,Tier,재현율,환경,현상,재현 단계,예상 결과,실제 결과,발견일
ISSUE-042,로그인 세션 조기 만료,P1,New,High,QA 헤드,,Tier 1,100%,Chrome,로그인 후 세션이 5분만에 만료됨,"1. 로그인
2. 5분 대기
3. 페이지 새로고침",세션 유지 (30분),로그아웃됨,2024-11-20
```

### Example 4: Weekly Report Summary to Notion

**Input**:
```
Week 47 (11/18 ~ 11/22)
Pass Rate: 92%
Automation: 76%
Tests: Total 78, Pass 72, Fail 6
Issues: New 10 (P0: 1, P1: 5), Resolved 4, Open 16
Release: No-go
```

**Output**:
```csv
Week,기간,Pass Rate,Automation Coverage,총 테스트,Pass,Fail,신규 이슈,해결 이슈,오픈 이슈,Release Status
"Week 47 (11/18 ~ 11/22)",2024-11-18 → 2024-11-22,92,76,78,72,6,10,4,16,No-go
```

## Best Practices

### 1. Maintain Data Integrity
- Never modify the semantic meaning of content
- Preserve all details, even if verbose
- Keep original formatting intent

### 2. CSV Formatting
```csv
# Good
"TC-001","Test with, comma",Tier 1
"TC-002","Multi-line
content",Tier 1

# Bad
TC-001,Test with, comma,Tier 1  # Breaks CSV parsing
TC-002,Multi-line               # Loses line break
content,Tier 1
```

### 3. Property Mapping
Always confirm Notion database schema before generating format:
- "Does your Notion database have these exact property names?"
- "Are there any custom fields I should include?"
- "What are the options for Select/Multi-select fields?"

### 4. Bulk Import Optimization
For large datasets (>50 rows):
- Split into batches of 50
- Number each batch file
- Provide import order instructions
- Include validation script

### 5. Error Prevention
- Include property creation instructions for missing fields
- Warn about Select option mismatches
- Provide rollback instructions
- Test with small sample first

## Integration with Other Skills

This skill works with:

**qa-test-case-writer**:
- Takes test cases from writer
- Converts to Notion format
- Imports to 테스트 케이스 통합 DB

**qa-bug-analyzer**:
- Takes RCA output
- Formats for 이슈 트래킹 DB
- Links to related test cases

**qa-weekly-reporter**:
- Takes weekly report
- Extracts key metrics
- Populates 주간 QA 리포트 DB

## Common Issues and Solutions

### Issue 1: Encoding Errors
**Problem**: Korean characters show as � or ???
**Solution**:
- Save CSV as UTF-8 with BOM
- Use Notion's "Import" feature (not copy-paste)
- Test with small sample first

### Issue 2: Line Breaks Lost
**Problem**: Multi-line fields become single line
**Solution**:
- Use `\n` for line breaks in CSV
- Wrap entire cell in quotes
- Verify after import

### Issue 3: Select Options Don't Match
**Problem**: "P0" doesn't exist in Notion database
**Solution**:
- List required options before import
- Create options in Notion first
- Use exact spelling and capitalization

### Issue 4: Person Fields Empty
**Problem**: "QA 헤드" not recognized as person
**Solution**:
- Leave empty in CSV
- Assign manually after import
- Or use email addresses if available

## Notes

- Always provide import instructions with formatted output
- Validate data before generating final format
- Support multiple output formats per user preference
- Maintain CLAUDE.md standards for property values
- Test CSV in small batches first
- Keep backup of original data before import
- Document any assumptions or mappings made
