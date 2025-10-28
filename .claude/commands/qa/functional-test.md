---
description: 페이지 URLs에 대해 Playwright 기반 자동 기능 테스트를 수행합니다.
model: sonnet
argument-hint: <page_urls>
---

You are executing the `/qa:functional-test` command to perform comprehensive automated functional testing on specified web pages.

## Command Arguments

- **$1+**: One or more page URLs to test (space-separated)
  - Example: `https://example.com/login https://example.com/dashboard`
  - Example: `https://myapp.dev/checkout`

## Workflow

### Step 1: Validate Input

Ensure at least one URL is provided:
```
If no URLs provided:
  → Show usage: /qa:functional-test <page_url1> [page_url2] [...]
  → Exit
```

### Step 2: Prepare Testing Environment

```
1. Check Playwright MCP availability
   - If not available: Warn user and suggest installation
   - If available: Proceed

2. Create test session ID: TEST-{timestamp}

3. Display test plan:
   📋 Functional QA Test Plan
   - Pages to test: {count}
   - Max retries per page: 5
   - Auto-fix: ✅ Enabled
   - Data cleanup: ✅ Enabled
   - Reports: .claude/qa-reports/
```

### Step 3: Invoke functional-qa-tester Agent

Use the Task tool to launch the `functional-qa-tester` agent with the following prompt:

```markdown
Perform comprehensive functional QA testing on the following page(s):

**URLs**:
$1

**Requirements**:
1. Test each page thoroughly using Playwright MCP
2. Detect page type and run appropriate test scenarios
3. Document all issues found (Markdown + JSON format)
4. Attempt automatic fixes for discovered issues
5. Rerun tests up to 5 times until all pass
6. Clean up test data using deletion features
7. Update learning database with results
8. Generate final report (Markdown + JSON)

**Success Criteria**:
- All critical tests pass
- Issues documented with severity classification
- Test data cleaned up
- Learning database updated
- Final report generated

**Deliverables**:
- Test report: .claude/qa-reports/{timestamp}-final-report.md
- Test report (JSON): .claude/qa-reports/{timestamp}-final-report.json
- Issue reports: .claude/qa-reports/{timestamp}-issue-*.md
- Learning database: .claude/qa-reports/learning-db.json
- Cleanup log: .claude/qa-reports/cleanup-log-{timestamp}.json
```

### Step 4: Monitor Progress

Display real-time progress updates from the agent:
```
🔍 Starting QA test session...
📄 Testing page 1/2: https://example.com/login
  ✅ Page load test passed
  ✅ Form validation test passed
  ✅ Login flow test passed
  🧹 Cleaning up test account...
📄 Testing page 2/2: https://example.com/dashboard
  ✅ Authentication check passed
  ❌ Data display test failed (ISSUE-20250128-001)
  🔧 Attempting auto-fix...
  🔁 Retrying (Attempt 2/5)
  ✅ All tests passed after 2 attempts
```

### Step 5: Present Results

Once the agent completes, present a comprehensive summary:

```markdown
## ✅ Functional QA Test Complete

### 📊 Summary

| Metric | Value |
|--------|-------|
| Pages Tested | {count} |
| Total Test Scenarios | {count} |
| Passed | {count} ✅ |
| Failed | {count} ❌ |
| Total Attempts | {count} |
| Issues Found | {count} |
| Issues Auto-Fixed | {count} |
| Data Cleaned | {count} resources |
| Cost Saved | ${amount} |

### 🎯 Results by Page

#### Page 1: {URL}
- Status: ✅ Passed / ❌ Failed / ⚠️ Partial
- Scenarios: {passed}/{total}
- Attempts: {count}
- Issues: {count} (Critical: {n}, High: {n}, Medium: {n}, Low: {n})

#### Page 2: {URL}
- Status: ✅ Passed
- Scenarios: {passed}/{total}
- Attempts: 1
- Issues: 0

### 🐛 Issues Found

1. **ISSUE-{timestamp}-001**: Missing form validation
   - Severity: Medium
   - Page: https://example.com/contact
   - Status: ✅ Auto-Fixed
   - Report: [View details](./.claude/qa-reports/{timestamp}-issue-001.md)

2. **ISSUE-{timestamp}-002**: Slow page load (5.2s)
   - Severity: High
   - Page: https://example.com/dashboard
   - Status: ⚠️ Needs Manual Review
   - Report: [View details](./.claude/qa-reports/{timestamp}-issue-002.md)

### 🔧 Auto-Fix Summary

| Issue | Strategy Applied | Success |
|-------|------------------|---------|
| ISSUE-001 | Add client validation | ✅ Yes |
| ISSUE-002 | Image lazy loading | ❌ No |

### 🧹 Data Cleanup

- Resources Created: {count}
- Resources Deleted: {count}
- Cleanup Rate: {percent}%
- Storage Freed: {mb} MB
- Estimated Cost Saved: ${amount}

### 📚 Learning Points

- Discovered new pattern: {pattern_name}
- Successful fix strategy: {strategy} (Success rate: {percent}%)
- Recommendation: {suggestion for similar pages}

### 📁 Generated Files

- **Final Report (MD)**: `.claude/qa-reports/{timestamp}-final-report.md`
- **Final Report (JSON)**: `.claude/qa-reports/{timestamp}-final-report.json`
- **Issue Reports**: `.claude/qa-reports/{timestamp}-issue-*.md`
- **Learning Database**: `.claude/qa-reports/learning-db.json`
- **Cleanup Log**: `.claude/qa-reports/cleanup-log-{timestamp}.json`

### 🔗 Next Steps

1. **Review Issues**: Check detailed issue reports for failed tests
2. **Manual Fixes**: Address issues that couldn't be auto-fixed
3. **Rerun Tests**: Use `/qa:functional-test {url}` to verify fixes
4. **Learn More**: Review learning database to see patterns

---

**Test Session ID**: TEST-{timestamp}
**Duration**: {time}
**Test Date**: {datetime}
```

### Step 6: Offer Follow-up Actions

```
Would you like me to:

1. 🔍 Review specific issue details
2. 🔧 Attempt manual fixes for failed issues
3. 🔁 Rerun tests on failed pages
4. 📊 Analyze learning database patterns
5. 💾 Export report in different format

Let me know how you'd like to proceed!
```

## Usage Examples

### Example 1: Single Page Test
```bash
/qa:functional-test https://myapp.com/login
```

**Expected Output**:
```
🔍 Starting functional QA test...
📄 Testing: https://myapp.com/login
  ✅ Page load: 1.2s
  ✅ Form validation
  ✅ Login flow
  ✅ Error handling
  🧹 Test data cleaned
📊 Report: .claude/qa-reports/TEST-20250128-103045.md
✅ All tests passed!
```

### Example 2: Multiple Pages Test
```bash
/qa:functional-test https://myapp.com/login https://myapp.com/dashboard https://myapp.com/profile
```

**Expected Output**:
```
🔍 Starting functional QA test...
📋 Testing 3 pages...

📄 Page 1/3: https://myapp.com/login
  ✅ All tests passed (5/5)

📄 Page 2/3: https://myapp.com/dashboard
  ❌ Failed 1/8 tests
  🔧 Auto-fix applied
  🔁 Retrying... ✅ Passed

📄 Page 3/3: https://myapp.com/profile
  ✅ All tests passed (6/6)

✅ Test complete: 19/19 scenarios passed
📊 Report: .claude/qa-reports/TEST-20250128-103045.md
```

### Example 3: Testing with Failures
```bash
/qa:functional-test https://broken-site.com/page
```

**Expected Output**:
```
🔍 Starting functional QA test...
📄 Testing: https://broken-site.com/page

❌ Test failed: Page load timeout
📝 Issue documented: ISSUE-20250128-001
🔧 Attempting auto-fix... ❌ Failed
🔁 Retry 2/5... ❌ Failed
🔁 Retry 3/5... ❌ Failed
🔁 Retry 4/5... ❌ Failed
🔁 Retry 5/5... ❌ Failed

⚠️ Max retries reached. Manual intervention required.
📊 Report: .claude/qa-reports/TEST-20250128-103045.md
🐛 Issues: 1 Critical

Would you like me to investigate the issue further?
```

## Error Handling

### No URLs Provided
```
❌ Error: No URLs provided

Usage: /qa:functional-test <page_url1> [page_url2] [...]

Example:
  /qa:functional-test https://example.com/login
  /qa:functional-test https://app.com/page1 https://app.com/page2
```

### Invalid URL Format
```
❌ Error: Invalid URL format

The following URLs are invalid:
- "not-a-url"
- "ftp://unsupported-protocol.com"

Please provide valid HTTP(S) URLs.
```

### Playwright MCP Not Available
```
⚠️ Warning: Playwright MCP not detected

This command requires Playwright MCP server.

Installation:
1. npm install -D @playwright/test
2. Configure MCP server in .mcp.json or Claude settings

Learn more: https://docs.claude.com/mcp/playwright

Would you like me to help you set it up?
```

### Network/Access Issues
```
⚠️ Warning: Cannot access some URLs

The following URLs are unreachable:
- https://private-site.com/page (403 Forbidden)
- https://offline-site.com/page (Connection timeout)

Continuing with accessible pages...
```

## Best Practices

### DO
✅ Test related pages together (e.g., login, dashboard, profile)
✅ Run tests after deployments
✅ Review learning database periodically
✅ Fix issues marked as "Critical" or "High" immediately
✅ Clean up test data (automatic with this command)

### DON'T
❌ Test production URLs with real user data
❌ Ignore repeated patterns in learning database
❌ Skip manual review of auto-fix failures
❌ Run tests on pages without proper test environment

## Integration with CI/CD

This command can be integrated into CI/CD pipelines:

```yaml
# .github/workflows/qa-test.yml
name: Functional QA
on: [push, pull_request]
jobs:
  qa:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run QA Tests
        run: |
          claude /qa:functional-test \
            https://staging.myapp.com/login \
            https://staging.myapp.com/dashboard
      - name: Upload Reports
        uses: actions/upload-artifact@v3
        with:
          name: qa-reports
          path: .claude/qa-reports/
```

## Completion Checklist

After command execution, verify:

- [ ] All pages tested
- [ ] Issues documented (if any)
- [ ] Auto-fix attempts recorded
- [ ] Test data cleaned up
- [ ] Reports generated (Markdown + JSON)
- [ ] Learning database updated
- [ ] User provided with clear summary and next steps

---

**Remember**: This command is fully autonomous. Once invoked, the `functional-qa-tester` agent handles everything from testing to reporting to learning.
