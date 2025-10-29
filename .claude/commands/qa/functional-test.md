---
description: 페이지 URLs에 대해 Playwright 기반 자동 기능 테스트를 수행합니다.
model: sonnet
argument-hint: <page_urls> [notion_database_url]
---

You are executing the `/qa:functional-test` command to perform comprehensive automated functional testing on specified web pages.
**디테일한 탭이나 페이지들도 다 접근해서 다 테스트 해야함. 디테일한 탭이나 페이지들도 다 접근해서 다 테스트 해야함.**

## Command Arguments

- **$1**: One or more page URLs to test (space-separated)
  - Example: `https://example.com/login https://example.com/dashboard`
  - Example: `https://myapp.dev/checkout`
- **$2** (Optional): Notion Database URL for issue tracking
  - Example: `https://www.notion.so/workspace/database_id?v=view_id`
  - If provided, all discovered issues will be automatically logged to this Notion database

## Workflow

### Step 1: Validate Input

Ensure at least one URL is provided and validate Notion URL if provided:

```
If no URLs provided:
  → Show usage: /qa:functional-test <page_urls> [notion_database_url]
  → Exit

If Notion URL provided:
  → Validate it's a valid Notion database URL
  → Extract database ID from URL
  → Store for later use in issue documentation
  → If invalid: Warn user but continue without Notion integration
```

### Step 2: Prepare Testing Environment

```
1. Check Playwright MCP availability
   - If not available: Warn user and suggest installation
   - If available: Proceed

2. Create test session ID: TEST-{timestamp}

3. Check Notion integration (if URL provided)
   - Verify Notion API access
   - Test database connection
   - Validate database schema compatibility

4. Display test plan:
   📋 Functional QA Test Plan
   - Pages to test: {count}
   - Max retries per page: 5
   - Auto-fix: ✅ Enabled
   - Data cleanup: ✅ Enabled
   - Reports: .claude/qa-reports/
   - Notion Integration: ✅ Enabled / ❌ Disabled
   - Notion Database: {database_url or "Not configured"}
```

### Step 3: Invoke functional-qa-tester Agent

Use the Task tool to launch the `functional-qa-tester` agent with the following prompt:

```markdown
Perform comprehensive functional QA testing on the following page(s):

**URLs**:
$1

**Notion Database** (Optional):
$2

**Requirements**:

1. Test each page thoroughly using Playwright MCP
2. Detect page type and run appropriate test scenarios
3. Document all issues found (Markdown + JSON format)
4. Attempt automatic fixes for discovered issues
5. Rerun tests up to 5 times until all pass
6. Clean up test data using deletion features
7. Update learning database with results
8. **If Notion URL provided**: Sync all issues to Notion database
9. Generate final report (Markdown + JSON)

**Notion Integration** (if enabled):

For each discovered issue:

1. Create a new page in the Notion database
2. Map issue data to Notion database properties:

   - **Title**: Issue summary (e.g., "Login Form Accepts Invalid Email Format")
   - **Issue ID**: ISSUE-{timestamp}-{sequence}
   - **Status**: Select (Open, In Progress, Resolved, Cannot Reproduce)
   - **Severity**: Select (Critical, High, Medium, Low)
   - **Page URL**: URL property
   - **Discovered**: Date property
   - **Environment**: Text (Browser, OS, Viewport)
   - **Description**: Rich text with full issue details
   - **Steps to Reproduce**: Rich text (numbered list)
   - **Expected Behavior**: Rich text
   - **Actual Behavior**: Rich text
   - **Screenshots**: Files (if available)
   - **Console Logs**: Code block
   - **Network Logs**: Code block
   - **Potential Fix**: Rich text
   - **Auto-Fix Status**: Select (Success, Failed, Not Attempted)
   - **Test Session ID**: Text

3. Upload screenshots to Notion (if available)
4. Add issue to final report with Notion page link

**Success Criteria**:

- All critical tests pass
- Issues documented with severity classification
- Test data cleaned up
- Learning database updated
- Final report generated
- **If Notion enabled**: All issues synced to Notion database

**Deliverables**:

- Test report: .claude/qa-reports/{timestamp}-final-report.md
- Test report (JSON): .claude/qa-reports/{timestamp}-final-report.json
- Issue reports: .claude/qa-reports/{timestamp}-issue-\*.md
- Learning database: .claude/qa-reports/learning-db.json
- Cleanup log: .claude/qa-reports/cleanup-log-{timestamp}.json
- **If Notion enabled**: Notion database pages with issue links
```

### Step 4: Monitor Progress

Display real-time progress updates from the agent:

```
🔍 Starting QA test session...
🔗 Notion integration: ✅ Connected to database
📄 Testing page 1/2: https://example.com/login
  ✅ Page load test passed
  ✅ Form validation test passed
  ✅ Login flow test passed
  🧹 Cleaning up test account...
📄 Testing page 2/2: https://example.com/dashboard
  ✅ Authentication check passed
  ❌ Data display test failed (ISSUE-20250128-001)
  📝 Creating Notion page for issue...
  ✅ Notion page created: [View in Notion]
  🔧 Attempting auto-fix...
  🔁 Retrying (Attempt 2/5)
  ✅ All tests passed after 2 attempts
  📝 Updating Notion page status: Resolved
```

### Step 5: Present Results

Once the agent completes, present a comprehensive summary:

```markdown
## ✅ Functional QA Test Complete

### 📊 Summary

| Metric                 | Value             |
| ---------------------- | ----------------- |
| Pages Tested           | {count}           |
| Total Test Scenarios   | {count}           |
| Passed                 | {count} ✅        |
| Failed                 | {count} ❌        |
| Total Attempts         | {count}           |
| Issues Found           | {count}           |
| Issues Auto-Fixed      | {count}           |
| Data Cleaned           | {count} resources |
| Cost Saved             | ${amount}         |
| **Notion Integration** | ✅ / ❌           |
| **Issues Synced**      | {count} / {total} |

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
   - Notion: [View in Notion](https://notion.so/page-id) (if enabled)

2. **ISSUE-{timestamp}-002**: Slow page load (5.2s)
   - Severity: High
   - Page: https://example.com/dashboard
   - Status: ⚠️ Needs Manual Review
   - Report: [View details](./.claude/qa-reports/{timestamp}-issue-002.md)
   - Notion: [View in Notion](https://notion.so/page-id) (if enabled)

### 🔧 Auto-Fix Summary

| Issue     | Strategy Applied      | Success |
| --------- | --------------------- | ------- |
| ISSUE-001 | Add client validation | ✅ Yes  |
| ISSUE-002 | Image lazy loading    | ❌ No   |

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

### 🔗 Notion Integration (if enabled)

- **Database**: [Open Notion Database](https://notion.so/database-id)
- **Issues Synced**: {count} issues successfully added
- **Failed Syncs**: {count} issues (see error log)
- **Sync Log**: `.claude/qa-reports/{timestamp}-notion-sync.json`

**Notion Page Properties**:
Each issue in Notion includes:

- Title, Issue ID, Status, Severity
- Page URL, Discovered date, Environment
- Full description with steps to reproduce
- Expected vs Actual behavior
- Screenshots (if available)
- Console & Network logs
- Potential fix suggestions
- Auto-fix status
- Link back to local markdown report

### 🔗 Next Steps

1. **Review Issues**: Check detailed issue reports for failed tests
2. **Notion Review**: View and manage issues in Notion database (if enabled)
3. **Manual Fixes**: Address issues that couldn't be auto-fixed
4. **Rerun Tests**: Use `/qa:functional-test {url}` to verify fixes
5. **Learn More**: Review learning database to see patterns

---

**Test Session ID**: TEST-{timestamp}
**Duration**: {time}
**Test Date**: {datetime}
```

### Step 6: Offer Follow-up Actions

```
Would you like me to:

1. 🔍 Review specific issue details
2. 📋 Open Notion database to view all issues (if enabled)
3. 🔧 Attempt manual fixes for failed issues
4. 🔁 Rerun tests on failed pages
5. 📊 Analyze learning database patterns
6. 💾 Export report in different format
7. 🔄 Resync failed Notion items (if any)

Let me know how you'd like to proceed!
```

## Usage Examples

### Example 1: Single Page Test (No Notion)

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

### Example 2: Single Page Test with Notion Integration

```bash
/qa:functional-test https://myapp.com/login https://www.notion.so/myworkspace/qa-issues-db123?v=view456
```

**Expected Output**:

```
🔍 Starting functional QA test...
🔗 Notion integration: ✅ Connected to database
📄 Testing: https://myapp.com/login
  ✅ Page load: 1.2s
  ❌ Form validation failed (ISSUE-20250128-001)
  📝 Creating Notion page for issue...
  ✅ Notion page created: https://notion.so/page-xyz
  🔧 Attempting auto-fix...
  ✅ Auto-fix successful
  📝 Updating Notion page status: Resolved
  ✅ Login flow
  ✅ Error handling
  🧹 Test data cleaned
📊 Report: .claude/qa-reports/TEST-20250128-103045.md
🔗 Notion: 1 issue synced, 1 resolved
✅ All tests passed!
```

### Example 3: Multiple Pages Test

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

### Example 4: Multiple Pages with Notion Integration

```bash
/qa:functional-test "https://myapp.com/login https://myapp.com/dashboard https://myapp.com/profile" https://www.notion.so/myworkspace/qa-db123
```

**Expected Output**:

```
🔍 Starting functional QA test...
🔗 Notion integration: ✅ Connected to database
📋 Testing 3 pages...

📄 Page 1/3: https://myapp.com/login
  ✅ All tests passed (5/5)

📄 Page 2/3: https://myapp.com/dashboard
  ❌ Failed 1/8 tests (ISSUE-20250128-001)
  📝 Creating Notion page...
  ✅ Notion page created
  🔧 Auto-fix applied
  🔁 Retrying... ✅ Passed
  📝 Updating Notion: Resolved

📄 Page 3/3: https://myapp.com/profile
  ❌ UI alignment issue (ISSUE-20250128-002)
  📝 Creating Notion page...
  ✅ Notion page created
  ⚠️ Auto-fix failed, marked for manual review

✅ Test complete: 18/19 scenarios passed
📊 Report: .claude/qa-reports/TEST-20250128-103045.md
🔗 Notion: 2 issues synced (1 resolved, 1 needs review)
📋 View all issues: https://notion.so/myworkspace/qa-db123
```

### Example 5: Testing with Failures

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

### Notion Integration Errors

```
⚠️ Warning: Notion integration failed

Issue: Cannot connect to Notion database
- Database URL: https://notion.so/...
- Error: Invalid database ID or insufficient permissions

Suggestions:
1. Verify the database URL is correct
2. Check Notion integration token in environment
3. Ensure database has proper sharing permissions
4. Grant integration access to the database

QA testing will continue without Notion integration.
Local reports will still be generated.
```

### Partial Notion Sync Failure

```
⚠️ Warning: Some issues failed to sync to Notion

Successfully synced: 3/5 issues
Failed syncs: 2 issues

Failed issues:
- ISSUE-20250128-003: Rate limit exceeded (will retry)
- ISSUE-20250128-004: Invalid property type (check schema)

Local reports contain all 5 issues.
Failed items logged in: .claude/qa-reports/{timestamp}-notion-errors.json

Would you like me to retry failed syncs?
```

## Best Practices

### DO

✅ Test related pages together (e.g., login, dashboard, profile)
✅ Run tests after deployments
✅ Review learning database periodically
✅ Fix issues marked as "Critical" or "High" immediately
✅ Clean up test data (automatic with this command)
✅ **Use Notion integration for team collaboration and tracking**
✅ **Set up proper Notion database schema before first use**
✅ **Review Notion issues regularly and update statuses**
✅ **Share Notion database with team for visibility**

### DON'T

❌ Test production URLs with real user data
❌ Ignore repeated patterns in learning database
❌ Skip manual review of auto-fix failures
❌ Run tests on pages without proper test environment
❌ **Manually duplicate issues in Notion (use auto-sync)**
❌ **Share Notion database URL publicly (keep internal)**
❌ **Delete Notion pages without archiving first**

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

      - name: Run QA Tests with Notion Integration
        env:
          NOTION_API_TOKEN: ${{ secrets.NOTION_API_TOKEN }}
        run: |
          claude /qa:functional-test \
            "https://staging.myapp.com/login https://staging.myapp.com/dashboard" \
            "https://www.notion.so/${{ secrets.NOTION_QA_DB }}"

      - name: Upload Reports
        uses: actions/upload-artifact@v3
        with:
          name: qa-reports
          path: .claude/qa-reports/

      - name: Comment PR with Notion Link
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ QA Tests Complete!\n\n📋 [View Issues in Notion](https://notion.so/${{ secrets.NOTION_QA_DB }})'
            })
```

**Environment Variables Required**:

- `NOTION_API_TOKEN`: Your Notion integration token
- `NOTION_QA_DB`: Your Notion database ID/URL (store in GitHub Secrets)

## Completion Checklist

After command execution, verify:

- [ ] All pages tested
- [ ] Issues documented (if any)
- [ ] Auto-fix attempts recorded
- [ ] Test data cleaned up
- [ ] Reports generated (Markdown + JSON)
- [ ] Learning database updated
- [ ] **Notion integration connected (if URL provided)**
- [ ] **All issues synced to Notion database**
- [ ] **Notion pages have correct properties and data**
- [ ] **Screenshots uploaded to Notion (if any)**
- [ ] **Sync errors logged and reported**
- [ ] User provided with clear summary and next steps

---

## Notion Database Schema

For optimal Notion integration, set up your database with these properties:

### Required Properties

| Property Name | Type   | Options/Config                                |
| ------------- | ------ | --------------------------------------------- |
| Title         | Title  | (Default page title - issue summary)          |
| Issue ID      | Text   | -                                             |
| Status        | Select | Open, In Progress, Resolved, Cannot Reproduce |
| Severity      | Select | Critical, High, Medium, Low                   |
| Page URL      | URL    | -                                             |
| Discovered    | Date   | Include time: Yes                             |

### Recommended Properties

| Property Name      | Type          | Options/Config                                      |
| ------------------ | ------------- | --------------------------------------------------- |
| Environment        | Text          | -                                                   |
| Description        | Rich Text     | -                                                   |
| Steps to Reproduce | Rich Text     | -                                                   |
| Expected Behavior  | Rich Text     | -                                                   |
| Actual Behavior    | Rich Text     | -                                                   |
| Potential Fix      | Rich Text     | -                                                   |
| Auto-Fix Status    | Select        | Success, Failed, Not Attempted                      |
| Test Session ID    | Text          | -                                                   |
| Screenshots        | Files & Media | -                                                   |
| Console Logs       | Rich Text     | -                                                   |
| Network Logs       | Rich Text     | -                                                   |
| Assignee           | Person        | (For manual assignment)                             |
| Priority           | Select        | P0, P1, P2, P3                                      |
| Tags               | Multi-select  | validation, forms, performance, accessibility, etc. |

### Optional Properties

| Property Name    | Type     | Options/Config                          |
| ---------------- | -------- | --------------------------------------- |
| Fixed In Version | Text     | -                                       |
| Verified By      | Person   | -                                       |
| Related Issues   | Relation | (Link to other issues in same database) |
| Time to Fix      | Number   | (Minutes/Hours)                         |
| Browser          | Select   | Chrome, Firefox, Safari, Edge           |
| Device Type      | Select   | Desktop, Mobile, Tablet                 |

### Setting Up Your Notion Database

1. **Create Database**:

   ```
   1. Open Notion
   2. Create new page → Database → Table
   3. Name it "QA Issues" or similar
   ```

2. **Add Properties**:

   ```
   1. Click "+" next to properties
   2. Add each property from tables above
   3. Configure Select options exactly as shown
   ```

3. **Create Notion Integration**:

   ```
   1. Go to notion.so/my-integrations
   2. Create new integration
   3. Copy integration token
   4. Set as NOTION_API_TOKEN environment variable
   ```

4. **Share Database with Integration**:

   ```
   1. Open your QA Issues database
   2. Click "..." (three dots) → "Connections"
   3. Add your integration
   ```

5. **Get Database URL**:
   ```
   1. Copy database URL from browser
   2. Format: https://notion.so/workspace/database_id?v=view_id
   3. Use this URL as $2 parameter
   ```

---

**Remember**: This command is fully autonomous. Once invoked, the `functional-qa-tester` agent handles everything from testing to reporting to learning, and optionally syncs all issues to your Notion database for team collaboration.
