# Code Review Workflow

A comprehensive guide for conducting effective code reviews.

## Phase 1: Preparation

### Before Reviewing

#### Context Gathering
- [ ] Read the PR/MR description
- [ ] Understand the feature or bug being addressed
- [ ] Review linked issues or tickets
- [ ] Check acceptance criteria
- [ ] Note any special requirements

#### Set Up Review Environment
- [ ] Checkout the branch locally
- [ ] Install dependencies if changed
- [ ] Run the application
- [ ] Test the feature manually
- [ ] Run tests locally

```bash
# Checkout PR branch
git fetch origin pull/123/head:pr-123
git checkout pr-123

# Install and test
npm install
npm run dev
npm test
```

## Phase 2: Code Review Checklist

### 1. Functionality ⚙️

- [ ] **Does it work?** Test the feature thoroughly
- [ ] **Meets requirements?** Matches acceptance criteria
- [ ] **Edge cases handled?** Tests unusual inputs
- [ ] **Error handling?** Graceful failure scenarios
- [ ] **No regressions?** Existing features still work

### 2. Code Quality 📝

#### Readability
- [ ] **Clear naming?** Variables and functions are descriptive
- [ ] **Proper formatting?** Consistent with project style
- [ ] **Comments helpful?** Explains "why", not "what"
- [ ] **No dead code?** Unused imports, functions removed
- [ ] **DRY principle?** No unnecessary duplication

#### Structure
- [ ] **Single responsibility?** Functions/components do one thing
- [ ] **Appropriate abstraction?** Not over or under-engineered
- [ ] **Proper separation of concerns?** Logic, UI, data separated
- [ ] **Follows project patterns?** Consistent with codebase

#### TypeScript/Types
- [ ] **Proper typing?** No unnecessary `any` types
- [ ] **Interfaces defined?** Clear type contracts
- [ ] **Type inference used?** Where appropriate
- [ ] **No type errors?** `npm run type-check` passes

### 3. Testing 🧪

- [ ] **Tests included?** New code has tests
- [ ] **Tests pass?** All tests green
- [ ] **Good coverage?** Critical paths tested
- [ ] **Meaningful assertions?** Tests verify behavior
- [ ] **Edge cases tested?** Not just happy path

```typescript
// Good test example
describe('UserService', () => {
  it('should handle empty user list', async () => {
    const result = await userService.getUsers();
    expect(result).toEqual([]);
  });

  it('should throw error for invalid user ID', async () => {
    await expect(userService.getUser('invalid')).rejects.toThrow();
  });
});
```

### 4. Performance 🚀

- [ ] **No obvious bottlenecks?** Efficient algorithms
- [ ] **Database queries optimized?** Proper indexing, no N+1
- [ ] **Appropriate caching?** Where beneficial
- [ ] **No memory leaks?** Proper cleanup
- [ ] **Bundle size impact?** Check if significant

### 5. Security 🔒

- [ ] **Input validation?** All user inputs validated
- [ ] **SQL injection safe?** Using parameterized queries
- [ ] **XSS prevention?** Proper escaping
- [ ] **Secrets secure?** No hardcoded credentials
- [ ] **Authentication/authorization?** Proper access control
- [ ] **Dependencies safe?** No known vulnerabilities

```typescript
// ❌ Bad: SQL injection risk
db.query(`SELECT * FROM users WHERE id = ${userId}`);

// ✅ Good: Parameterized query
db.query('SELECT * FROM users WHERE id = ?', [userId]);
```

### 6. Accessibility ♿

- [ ] **Semantic HTML?** Proper element usage
- [ ] **ARIA labels?** Where needed
- [ ] **Keyboard navigation?** Tab order works
- [ ] **Color contrast?** WCAG AA compliant
- [ ] **Screen reader friendly?** Alt text, labels

### 7. Error Handling 🚨

- [ ] **Errors caught?** Try/catch where needed
- [ ] **Helpful messages?** User-friendly errors
- [ ] **Logging?** Errors logged appropriately
- [ ] **Error boundaries?** React error boundaries if needed
- [ ] **Graceful degradation?** Falls back sensibly

### 8. Documentation 📚

- [ ] **README updated?** If setup changed
- [ ] **API documented?** New endpoints described
- [ ] **Comments added?** For complex logic
- [ ] **Types documented?** JSDoc where helpful
- [ ] **Breaking changes noted?** If any

## Phase 3: Provide Feedback

### Feedback Principles

#### Be Constructive
```markdown
❌ "This code is bad"
✅ "Consider extracting this into a separate function for better readability"

❌ "You don't know what you're doing"
✅ "This approach might cause performance issues. Have you considered using memoization?"
```

#### Be Specific
```markdown
❌ "Fix the styling"
✅ "The button should use the primary color from the theme (line 42)"

❌ "This won't work"
✅ "This will fail when the API returns null. Add a null check before accessing properties."
```

#### Distinguish Severity

**Critical (Must Fix) 🔴**
- Security vulnerabilities
- Breaking changes
- Data loss risks
- Major bugs

**Important (Should Fix) 🟡**
- Performance issues
- Missing tests
- Poor error handling
- Accessibility problems

**Nice to Have (Optional) 🟢**
- Code style preferences
- Minor optimizations
- Refactoring suggestions
- Additional comments

**Example Comments:**
```markdown
🔴 CRITICAL: This endpoint doesn't validate user permissions, allowing unauthorized access.

🟡 IMPORTANT: Missing error handling here could crash the application if the API fails.

🟢 NIT: Consider renaming `data` to `userData` for clarity.
```

### Comment Template

```markdown
## Summary
Brief overview of the changes

## Strengths
- Well-written tests
- Clean component structure
- Good error handling

## Issues Found

### Critical
- [ ] Security: User input not sanitized (line 42)

### Important
- [ ] Missing null check in API call (line 67)
- [ ] No loading state for async operation (line 89)

### Suggestions
- Consider using useMemo for expensive calculation (line 105)
- Extract this logic into a custom hook for reusability

## Questions
- Why was approach X chosen over Y?
- Is there a specific reason for this pattern?

## Verdict
- ✅ Approve
- 🔄 Request Changes
- 💬 Comment Only
```

## Phase 4: Collaboration

### Responding to Reviews

**As Author:**
- Thank reviewers for feedback
- Ask for clarification if needed
- Explain decisions when helpful
- Make requested changes promptly
- Re-request review after changes

**As Reviewer:**
- Respond to questions
- Approve after fixes
- Be available for discussion
- Follow up on critical issues

### Conflict Resolution

If you disagree:
1. Understand the reviewer's perspective
2. Explain your reasoning
3. Discuss trade-offs
4. Escalate if needed (team lead, architect)
5. Document the decision

## Review Workflows

### Small PR (< 200 lines)
- 10-15 minute review
- Focus on logic and tests
- Quick approval if good

### Medium PR (200-500 lines)
- 30-45 minute review
- Full checklist
- May need multiple rounds

### Large PR (> 500 lines)
- Request smaller PRs
- Or review in phases
- Consider pair programming

## Automated Checks

Leverage CI/CD to check automatically:

```yaml
# .github/workflows/pr-checks.yml
name: PR Checks

on: pull_request

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4

      # Parallel checks
      - name: Lint
        run: npm run lint

      - name: Type Check
        run: npm run type-check

      - name: Tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Security Audit
        run: npm audit
```

## Common Issues to Watch For

### React/Next.js
- Missing keys in lists
- Unnecessary re-renders
- Improper hook dependencies
- Server/client component confusion
- Hydration mismatches

### TypeScript
- Liberal use of `any`
- Type assertions (`as`) hiding errors
- Missing null checks
- Incorrect type definitions

### General
- Hardcoded values (use constants)
- Copy-paste duplication
- Overly complex functions
- Missing error handling
- Poor variable naming

## Self-Review Checklist

Before requesting review:

- [ ] Reviewed own code
- [ ] Removed debug code
- [ ] Tests pass locally
- [ ] Linter passes
- [ ] No console errors
- [ ] Manual testing done
- [ ] PR description complete
- [ ] Linked related issues
- [ ] Added screenshots if UI change

## Review Time Expectations

- **Urgent:** < 2 hours
- **Normal:** Within 1 day
- **Low priority:** Within 2-3 days

## Tips for Effective Reviews

### Do's ✅
- Review code within reasonable time
- Test the actual feature
- Provide constructive feedback
- Ask questions to understand
- Praise good work
- Focus on important issues

### Don'ts ❌
- Nitpick excessively
- Block on personal preferences
- Review when tired/rushed
- Assume malicious intent
- Ignore automated checks
- Approve without reading

---

**Remember: Code review is about improving code quality and sharing knowledge, not criticizing the author.**
