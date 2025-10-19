# Git Commit Guidelines

Best practices for writing meaningful, maintainable commit messages and managing commits effectively.

## Commit Message Format

### Conventional Commits Standard

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add user authentication` |
| `fix` | Bug fix | `fix: resolve null pointer in login` |
| `docs` | Documentation only | `docs: update API documentation` |
| `style` | Code style (formatting, etc.) | `style: format code with prettier` |
| `refactor` | Code restructuring | `refactor: extract validation logic` |
| `perf` | Performance improvement | `perf: optimize database queries` |
| `test` | Adding/updating tests | `test: add unit tests for auth` |
| `chore` | Maintenance tasks | `chore: update dependencies` |
| `ci` | CI/CD changes | `ci: add GitHub Actions workflow` |
| `build` | Build system changes | `build: configure webpack` |
| `revert` | Revert previous commit | `revert: revert feat: add feature X` |

### Commit Message Rules

**Subject Line (First Line)**:
- Keep it under 50-72 characters
- Use imperative mood ("add" not "added" or "adds")
- No period at the end
- Capitalize the first letter
- Clearly describe WHAT changed

**Examples**:
```bash
✅ Good:
feat: add email verification for new users
fix: resolve memory leak in data processing
docs: update installation instructions
refactor: simplify authentication logic

❌ Bad:
"fixed stuff"
"WIP"
"changes"
"asdfasdf"
"Updated some files"
```

**Body (Optional)**:
- Separate from subject with blank line
- Wrap at 72 characters
- Explain WHY the change was made
- Provide context and motivation
- Reference related issues

**Footer (Optional)**:
- Breaking changes: `BREAKING CHANGE: description`
- Issue references: `Closes #123`, `Fixes #456`, `Resolves #789`
- Co-authors: `Co-authored-by: Name <email@example.com>`

## Complete Examples

### Simple Commit
```bash
git commit -m "fix: resolve login redirect issue"
```

### Detailed Commit with Body
```bash
git commit -m "feat: add email verification for new users

Implement email verification flow to prevent spam accounts
and ensure valid contact information. Users must verify
their email within 24 hours or account will be deactivated.

- Add email service integration with SendGrid
- Create verification token system with 24h expiration
- Add verification UI components and email templates
- Implement automatic cleanup of unverified accounts

Closes #234"
```

### Breaking Change
```bash
git commit -m "feat!: migrate to OAuth2 authentication

BREAKING CHANGE: JWT authentication is no longer supported.
All clients must migrate to OAuth2 flow. See migration
guide at docs/oauth2-migration.md

Previous JWT tokens will be invalid after 2025-01-31.

Closes #789"
```

### Scoped Commit
```bash
git commit -m "fix(api): correct validation error in user endpoint"
git commit -m "feat(ui): add dark mode toggle to settings"
git commit -m "test(auth): add integration tests for OAuth flow"
```

## Atomic Commits

### One Logical Change Per Commit

**Why**: Makes code review easier, simplifies reverting changes, improves git bisect effectiveness.

**Good Example**:
```bash
# Three separate commits
git commit -m "feat: add user model"
git commit -m "feat: add user authentication endpoints"
git commit -m "test: add user authentication tests"
```

**Bad Example**:
```bash
# Everything in one commit
git commit -m "feat: add entire user system with auth, tests, docs, and styling"
```

### Benefits
- Easier code review
- Cleaner git history
- Simpler to revert specific changes
- Better for git bisect debugging
- Clearer project evolution

## Commit Workflow

### Recommended Process

```bash
# 1. Review changes
git status
git diff

# 2. Stage selectively
git add src/components/UserProfile.tsx
git add src/api/auth.ts

# 3. Review staged changes
git diff --staged

# 4. Commit with message
git commit -m "feat: add user profile component"

# 5. Verify commit
git log -1 --stat
```

### Interactive Staging

Stage parts of files:
```bash
# Interactive mode
git add -p src/utils/validation.ts

# Options:
# y - stage this hunk
# n - do not stage this hunk
# s - split into smaller hunks
# q - quit; do not stage this hunk or any remaining
```

## Commit Best Practices

### DO ✅

1. **Write clear, descriptive messages**
   - Explain what and why, not how
   - Use present tense imperative

2. **Make atomic commits**
   - One logical change per commit
   - All tests passing per commit

3. **Commit frequently**
   - Small, incremental commits
   - Don't accumulate large changes

4. **Review before committing**
   - Use `git diff` to verify changes
   - Remove debug code, console.logs

5. **Reference issues**
   - Link commits to tickets
   - Use `Closes #123` syntax

### DON'T ❌

1. **Don't commit**:
   - Sensitive data (.env, credentials, API keys)
   - Build artifacts (dist/, node_modules/)
   - IDE files (.vscode/, .idea/)
   - Debug code or console.logs
   - Commented-out code
   - Work-in-progress code (use WIP branch instead)

2. **Don't use**:
   - `git commit -a` (might stage unwanted files)
   - `git add .` without reviewing first
   - Vague messages ("fix", "update", "changes")
   - `--no-verify` (skips hooks, only for emergencies)

3. **Don't mix**:
   - Multiple unrelated changes in one commit
   - Refactoring with feature additions
   - Formatting changes with logic changes

## Security Checks

### Never Commit Sensitive Files

```bash
# Check .gitignore includes:
.env
.env.local
.env.*.local
*.pem
*.key
credentials.json
.mcp.json
secrets/
```

### Verify Before Committing
```bash
# Check for sensitive data
git diff --staged | grep -i "password\|secret\|api_key\|token"

# Check what will be committed
git status
```

### If Accidentally Committed
```bash
# Before pushing - amend commit
git reset HEAD~1
git add <correct-files>
git commit -m "message"

# After pushing - requires history rewrite (dangerous!)
# Contact team lead or use tools like git-filter-repo
```

## Amending Commits

### When to Amend

**Safe scenarios**:
- Commit not yet pushed
- Fixing typo in commit message
- Adding forgotten files to last commit
- Removing accidentally staged files

### How to Amend

```bash
# Amend last commit message
git commit --amend -m "corrected message"

# Amend last commit with new changes
git add forgotten-file.ts
git commit --amend --no-edit

# Amend and edit message
git add file.ts
git commit --amend
```

### When NOT to Amend

**Dangerous scenarios**:
- Commit already pushed to shared branch
- Other people have based work on your commit
- Amending someone else's commit

**If already pushed**:
```bash
# Create new commit instead
git add fix.ts
git commit -m "fix: address review feedback"
```

## Special Commit Types

### Merge Commits

```bash
# Descriptive merge message
git merge feature/user-auth -m "Merge feature: user authentication

Adds OAuth2 authentication flow with email verification.
Includes comprehensive test coverage and documentation.

Closes #234"
```

### Revert Commits

```bash
# Revert creates new commit
git revert abc123

# Default message:
# "Revert 'feat: add user authentication'"
#
# This reverts commit abc123.
```

### Co-authored Commits

```bash
# For pair programming
git commit -m "feat: implement WebSocket connection

Co-authored-by: Jane Doe <jane@example.com>
Co-authored-by: John Smith <john@example.com>"
```

## Commit Message Templates

### Create Template File

```bash
# ~/.gitmessage.txt
# <type>(<scope>): <subject>

# <body>

# <footer>

# Type: feat|fix|docs|style|refactor|perf|test|chore|ci|build|revert
# Scope: component|api|ui|db|auth|etc
# Subject: imperative, lowercase, no period
# Body: explain what and why
# Footer: breaking changes, issues
```

### Configure Git to Use Template

```bash
git config --global commit.template ~/.gitmessage.txt
```

## Commit Hooks

### Pre-commit Hook Example

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Run linter
npm run lint || exit 1

# Run type checker
npm run type-check || exit 1

# Run tests
npm test || exit 1

# Check for sensitive files
if git diff --cached --name-only | grep -E "\.env$|\.env\..*|\.key$|\.pem$"; then
  echo "Error: Attempting to commit sensitive files"
  exit 1
fi

exit 0
```

### Commit-msg Hook Example

```bash
#!/bin/sh
# .git/hooks/commit-msg

commit_msg=$(cat "$1")

# Check commit message format
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|perf|test|chore|ci|build|revert)(\(.+\))?: .+"; then
  echo "Error: Commit message must follow Conventional Commits format"
  echo "Example: feat: add new feature"
  exit 1
fi

exit 0
```

## Tools & Automation

### Commitizen

```bash
# Install
npm install -g commitizen cz-conventional-changelog

# Configure
commitizen init cz-conventional-changelog --save-dev --save-exact

# Use
git cz
# or
npm run commit
```

### Commitlint

```bash
# Install
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Configure (.commitlintrc.json)
{
  "extends": ["@commitlint/config-conventional"]
}

# Add hook
npm install --save-dev husky
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

### Husky (Git Hooks)

```bash
# Install
npm install --save-dev husky

# Initialize
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm test"

# Add commit-msg hook
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

## Commit History Analysis

### Useful Commands

```bash
# View commit history
git log --oneline
git log --graph --oneline --all

# Search commits
git log --grep="auth"
git log --author="John"
git log --since="2 weeks ago"

# Show specific commit
git show abc123

# Show file history
git log --follow -- path/to/file.ts

# Find who changed line
git blame path/to/file.ts

# Find when bug introduced
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
```

## Summary Checklist

Before committing, verify:
- [ ] Reviewed all changes (`git status`, `git diff`)
- [ ] No sensitive files included
- [ ] Removed debug code and console.logs
- [ ] Code follows project conventions
- [ ] Linter passes
- [ ] Type checker passes
- [ ] All tests pass
- [ ] Commit is atomic (one logical change)
- [ ] Commit message follows Conventional Commits
- [ ] Commit message is clear and descriptive
- [ ] Staged only intended changes (`git diff --staged`)

**Remember**: Good commit messages are a gift to your future self and your team. They tell the story of your project's evolution.
