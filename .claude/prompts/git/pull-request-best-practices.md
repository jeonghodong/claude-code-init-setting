# Pull Request Best Practices

Guidelines for creating, reviewing, and managing pull requests to ensure high-quality code and efficient collaboration.

## Pull Request Fundamentals

### What is a Pull Request?

A pull request (PR) is a proposal to merge code changes from one branch into another. It enables:
- Code review and collaboration
- Discussion of implementation details
- Quality checks (tests, linting, etc.)
- Documentation of changes
- Knowledge sharing across team

### When to Create a PR

**Create PR when**:
- Feature is complete and tested
- Bug fix is ready for review
- Refactoring is done
- Documentation needs review
- Code is ready for feedback

**Don't create PR when**:
- Work is not started yet
- Code doesn't compile/run
- Tests are failing (unless asking for help)
- Placeholder code without implementation

## Creating Great Pull Requests

### PR Title

Follow Conventional Commits format:

```
<type>(<scope>): <description>
```

**Examples**:
```
✅ Good:
feat: add user authentication with OAuth2
fix: resolve memory leak in data processing
docs: update API documentation for v2
refactor: simplify database query logic

❌ Bad:
Update files
WIP
fix
changes
```

### PR Description Template

```markdown
## Summary
Brief overview of what this PR does (2-3 sentences).

## Changes
- Detailed list of changes
- What was added
- What was modified
- What was removed

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to not work as expected)
- [ ] Refactoring (no functional changes)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Test additions/updates

## Testing
Describe how you tested these changes:
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed
- [ ] All tests passing locally

### Test Coverage
- Unit test coverage: X%
- Integration test coverage: Y%

## Screenshots/Videos
(If applicable) Add screenshots or videos demonstrating the changes.

## Breaking Changes
(If applicable) Describe any breaking changes and migration steps.

## Related Issues
Closes #123
Relates to #456

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added for new functionality
- [ ] All tests passing
- [ ] Backward compatibility maintained (or breaking changes documented)
- [ ] Performance impact considered
- [ ] Security implications reviewed

## Additional Notes
Any additional context or information reviewers should know.
```

### Complete PR Example

**Title**: `feat(auth): add OAuth2 authentication with Google and GitHub`

**Description**:
```markdown
## Summary
Implements OAuth2 authentication flow supporting Google and GitHub providers. Users can now sign in using their existing accounts, improving onboarding experience and security.

## Changes
- Added OAuth2 strategy using Passport.js
- Integrated Google OAuth2 provider
- Integrated GitHub OAuth2 provider
- Created user account linking for existing emails
- Added OAuth callback handling
- Updated login UI with provider buttons
- Migrated database schema for OAuth tokens
- Added environment variables for OAuth credentials

## Type of Change
- [x] New feature (non-breaking change adding functionality)
- [x] Documentation update

## Testing
- [x] Unit tests added for OAuth strategy
- [x] Integration tests for Google provider
- [x] Integration tests for GitHub provider
- [x] Manual testing with real OAuth apps
- [x] All tests passing locally (247 tests, 0 failures)

### Test Coverage
- Unit test coverage: 92%
- Integration test coverage: 87%

## Screenshots
![OAuth Login Screen](./screenshots/oauth-login.png)
![Google Sign In Flow](./screenshots/google-flow.png)

## Breaking Changes
None. Existing email/password authentication still works.

## Related Issues
Closes #234: Add social login
Relates to #189: Improve onboarding

## Checklist
- [x] Code follows project style guidelines
- [x] Self-review completed
- [x] Comments added for OAuth flow
- [x] Documentation updated (README, API docs)
- [x] No new warnings generated
- [x] Tests added for OAuth flows
- [x] All tests passing (247/247)
- [x] Backward compatibility maintained
- [x] Performance impact: minimal (OAuth is async)
- [x] Security: reviewed OAuth implementation, tokens stored securely

## Additional Notes
- Requires setting `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` environment variables
- See `.env.example` for configuration
- OAuth redirect URIs must be configured in Google/GitHub console
```

## PR Size Guidelines

### Optimal PR Size

**Small PR (< 200 lines)**:
- ✅ Easy to review thoroughly
- ✅ Quick turnaround
- ✅ Lower chance of bugs
- ✅ Easier to revert if needed

**Medium PR (200-400 lines)**:
- ⚠️ Still reviewable
- ⚠️ May take 30-60 minutes to review
- ⚠️ Consider splitting if possible

**Large PR (> 400 lines)**:
- ❌ Hard to review well
- ❌ Review fatigue
- ❌ High chance of missing issues
- ❌ **Should be split into smaller PRs**

### How to Keep PRs Small

```bash
# Bad: One massive PR
git checkout -b feature/complete-user-system
# ... 2000 lines of changes ...
git push -u origin feature/complete-user-system

# Good: Multiple focused PRs
git checkout -b feature/user-model
# ... add user model (100 lines) ...
git push -u origin feature/user-model
# Create PR #1

git checkout -b feature/user-authentication
# ... add auth (150 lines) ...
git push -u origin feature/user-authentication
# Create PR #2 (depends on PR #1)

git checkout -b feature/user-profile-ui
# ... add UI (200 lines) ...
git push -u origin feature/user-profile-ui
# Create PR #3 (depends on PR #2)
```

### Splitting Large PRs

**Strategies**:
1. **By layer**: Database → API → UI
2. **By feature**: Core logic → Edge cases → Polish
3. **By file type**: Models → Controllers → Views
4. **By risk**: Low-risk changes → High-risk changes

## PR Review Process

### For Authors

**Before Creating PR**:
```bash
# 1. Ensure branch is up to date
git checkout main
git pull origin main
git checkout feature/my-feature
git rebase main

# 2. Run all checks locally
npm run lint
npm run type-check
npm test
npm run build

# 3. Self-review changes
git diff main...HEAD

# 4. Push and create PR
git push origin feature/my-feature
gh pr create --fill
```

**Creating PR**:
1. Write clear title and description
2. Add relevant labels (bug, feature, documentation)
3. Assign reviewers
4. Link related issues
5. Add to project board (if applicable)

**During Review**:
1. Respond to all comments
2. Make requested changes
3. Push updates
4. Re-request review when ready
5. Resolve conversations when addressed

**Responding to Feedback**:
```markdown
✅ Good responses:
- "Good catch! Fixed in abc123"
- "Changed to use Array.map() as suggested"
- "I kept this approach because [explanation]. Let me know if you disagree"
- "Created issue #456 to track this separately"

❌ Bad responses:
- "No"
- "Already works"
- Ignoring comments
- Getting defensive
```

### For Reviewers

**Review Checklist**:

**Functionality** (Critical):
- [ ] Code solves the stated problem
- [ ] Edge cases handled
- [ ] No obvious bugs
- [ ] Works as demonstrated/described

**Code Quality** (Important):
- [ ] Code is readable and maintainable
- [ ] Naming is clear and consistent
- [ ] Complexity is justified
- [ ] No obvious duplication
- [ ] Follows project conventions

**Testing** (Critical):
- [ ] Tests included for new code
- [ ] Tests cover main use cases
- [ ] Tests cover edge cases
- [ ] All tests passing
- [ ] Test quality is good

**Security** (Critical):
- [ ] Input validation present
- [ ] No injection vulnerabilities
- [ ] Authentication/authorization correct
- [ ] No hardcoded secrets
- [ ] Sensitive data handled properly

**Performance** (Important):
- [ ] No obvious performance issues
- [ ] Database queries optimized
- [ ] No unnecessary loops
- [ ] Caching considered

**Documentation** (Important):
- [ ] Complex logic documented
- [ ] API changes documented
- [ ] README updated if needed
- [ ] Breaking changes noted

### Review Comment Categories

Use labels to indicate priority:

**🔴 BLOCKER**: Must fix before merge
```
🔴 BLOCKER: SQL Injection Risk
This query concatenates user input directly. Use parameterized queries instead.
```

**🟡 SUGGESTION**: Should fix (not blocking)
```
🟡 SUGGESTION: Extract Complex Logic
Consider extracting this 50-line function into smaller, focused functions.
```

**🟢 NITPICK**: Optional improvements
```
🟢 NITPICK: Minor style inconsistency
Missing space after comma (line 45).
```

**💡 LEARNING**: Educational comment
```
💡 LEARNING: FYI
You could use Array.includes() here instead of indexOf() !== -1 for better readability.
```

**👍 PRAISE**: Acknowledge good work
```
👍 PRAISE: Excellent error handling!
I really like how you handled all edge cases here.
```

### Review Best Practices

**DO ✅**:
1. **Review promptly** (within 24 hours)
2. **Be constructive** ("Consider..." not "Wrong!")
3. **Explain reasoning** (WHY, not just WHAT)
4. **Praise good solutions**
5. **Ask questions** instead of demands
6. **Provide examples** of suggestions
7. **Focus on important issues** first
8. **Test locally** if needed

**DON'T ❌**:
1. **Nitpick everything** (use automated tools)
2. **Be vague** ("This is bad")
3. **Demand perfection** (accept good enough)
4. **Bikeshed** (argue over trivial preferences)
5. **Review while rushed**
6. **Only criticize** (acknowledge good parts too)
7. **Block for trivial issues**
8. **Rubber stamp** without actually reading

## Automated Checks

### CI/CD Pipeline

```yaml
# .github/workflows/pr-checks.yml
name: PR Checks

on: pull_request

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm audit
```

### Required Status Checks

Configure in GitHub:
1. Go to repository Settings
2. Branches → Branch protection rules
3. Require status checks to pass:
   - ✅ lint
   - ✅ type-check
   - ✅ test
   - ✅ build
   - ✅ security

## Draft PRs

### When to Use Draft PRs

**Use draft PR for**:
- Early feedback on approach
- Work in progress (WIP)
- Asking questions about implementation
- Showing progress to stakeholders

**Example**:
```markdown
## [DRAFT] Experiment: New caching strategy

This is a proof-of-concept for implementing Redis caching.

### Questions:
- Should we cache at the API level or database level?
- What should be the default TTL?
- How to handle cache invalidation?

### TODO:
- [ ] Add cache invalidation logic
- [ ] Add tests
- [ ] Add documentation
- [ ] Performance benchmarks
```

### Converting Draft to Ready

```bash
# When ready for review
gh pr ready
```

## PR Labels

### Standard Labels

| Label | Purpose | When to Use |
|-------|---------|-------------|
| `bug` | Bug fixes | Fixing a defect |
| `feature` | New features | Adding functionality |
| `enhancement` | Improvements | Enhancing existing features |
| `refactoring` | Code refactoring | Restructuring code |
| `documentation` | Docs only | Documentation changes |
| `performance` | Performance improvements | Optimizations |
| `security` | Security fixes | Security vulnerabilities |
| `breaking-change` | Breaking changes | API changes |
| `dependencies` | Dependency updates | Updating packages |
| `wip` | Work in progress | Not ready for review |
| `needs-review` | Needs review | Ready for reviewers |
| `needs-testing` | Needs testing | Requires QA testing |
| `do-not-merge` | Do not merge | Blocked |

## Merging Pull Requests

### Merge Strategies

**1. Merge Commit** (Default)
```bash
git merge --no-ff feature/my-feature
```
- ✅ Preserves full history
- ✅ Clear when feature was merged
- ❌ More commits in history
- **Use for**: Features, significant changes

**2. Squash and Merge**
```bash
git merge --squash feature/my-feature
git commit -m "feat: add user authentication"
```
- ✅ Clean history (one commit per feature)
- ✅ Easier to revert
- ❌ Loses commit details
- **Use for**: Small features, bug fixes

**3. Rebase and Merge**
```bash
git rebase main
git checkout main
git merge feature/my-feature
```
- ✅ Linear history
- ✅ No merge commits
- ❌ Can be confusing
- **Use for**: Simple changes, clean commits

### When to Use Each Strategy

| Strategy | Best For | Avoid For |
|----------|----------|-----------|
| Merge commit | Large features, multiple contributors | Small fixes |
| Squash | Small features, messy commits | Large features with good commit history |
| Rebase | Linear history preference | Complex merges, shared branches |

## After Merging

### Clean Up

```bash
# Delete local branch
git checkout main
git pull origin main
git branch -d feature/my-feature

# Delete remote branch (usually automatic)
git push origin --delete feature/my-feature
```

### Post-Merge Checklist

- [ ] Branch deleted (local and remote)
- [ ] Deployment successful (if auto-deploy)
- [ ] Monitor for issues in production
- [ ] Close related issues
- [ ] Update project board
- [ ] Notify stakeholders (if needed)

## Common PR Issues

### Issue: Conflicts

**Solution**:
```bash
# Update branch
git checkout main
git pull origin main
git checkout feature/my-feature
git rebase main

# Resolve conflicts
# Edit conflicted files
git add .
git rebase --continue

# Force push (branch only)
git push --force-with-lease
```

### Issue: Failed CI Checks

**Solution**:
```bash
# Run checks locally
npm run lint
npm run type-check
npm test
npm run build

# Fix issues
# Commit fixes
git add .
git commit -m "fix: resolve CI failures"
git push
```

### Issue: Large PR

**Solution**:
1. Close current PR
2. Create feature/* branches for each logical part
3. Create smaller PRs in sequence
4. Link PRs with "Depends on #123"

### Issue: Stale PR

**Solution**:
```bash
# Update from main
git checkout main
git pull origin main
git checkout feature/my-feature
git rebase main
git push --force-with-lease

# Or close and create fresh PR
```

## PR Templates

### Creating PR Template

**Location**: `.github/pull_request_template.md`

```markdown
## Description
<!-- Describe your changes in detail -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
<!-- Describe testing performed -->

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review performed
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Documentation updated

## Related Issues
<!-- Closes #123 -->
```

## Summary

**For Authors**:
1. Keep PRs small and focused
2. Write clear titles and descriptions
3. Self-review before requesting review
4. Respond to feedback promptly
5. Test thoroughly

**For Reviewers**:
1. Review promptly (within 24 hours)
2. Be constructive and helpful
3. Focus on important issues
4. Explain reasoning
5. Acknowledge good work

**Remember**: Pull requests are conversations, not gates. The goal is to ship quality code while helping everyone learn and improve.
