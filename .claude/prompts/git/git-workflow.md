# Git Workflow Patterns

Comprehensive guide to Git workflows, from simple to complex, and best practices for team collaboration.

## Workflow Overview

A Git workflow is a recipe or recommendation for how to use Git to accomplish work in a consistent and productive manner.

### Choosing the Right Workflow

| Team Size | Deployment | Complexity | Recommended Workflow |
|-----------|------------|------------|---------------------|
| 1-3 devs | Continuous | Low | GitHub Flow |
| 4-10 devs | Weekly/Bi-weekly | Medium | GitHub Flow or Git Flow |
| 10+ devs | Scheduled releases | High | Git Flow |
| Any size | Very frequent | Low | Trunk-Based Development |

## 1. GitHub Flow

**Best for**: Continuous deployment, simple projects, small teams

### Branch Structure
```
main (production)
  ├── feature/add-login
  ├── feature/update-ui
  └── hotfix/fix-bug
```

### Workflow Steps

```bash
# 1. Start with main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/add-user-profile

# 3. Make changes and commit
git add .
git commit -m "feat: add user profile component"

# 4. Push and create PR
git push -u origin feature/add-user-profile
gh pr create --fill

# 5. After review, merge to main
# (Done via GitHub UI or CLI)
gh pr merge --squash

# 6. Deploy from main
# (Usually automatic via CI/CD)

# 7. Delete branch
git branch -d feature/add-user-profile
git push origin --delete feature/add-user-profile
```

### Rules
- Main branch is always deployable
- Create feature branches from main
- Push frequently to feature branches
- Open PR when ready for feedback
- Merge only after review and passing tests
- Deploy immediately after merge
- Delete branches after merge

### Pros & Cons

✅ **Pros**:
- Simple and easy to understand
- Continuous deployment friendly
- Fast iteration
- Clear process

❌ **Cons**:
- No support for multiple versions
- Hotfixes can disrupt flow
- Less structure for large teams

## 2. Git Flow

**Best for**: Scheduled releases, multiple versions, larger teams

### Branch Structure
```
main (production)
  ├── hotfix/critical-fix
  └── develop (integration)
       ├── feature/user-auth
       ├── feature/payment
       └── release/v1.2.0
```

### Branch Types

| Branch | Lifetime | Merge To | Purpose |
|--------|----------|----------|---------|
| `main` | Permanent | - | Production code |
| `develop` | Permanent | main | Integration |
| `feature/*` | Temporary | develop | New features |
| `release/*` | Temporary | main + develop | Release prep |
| `hotfix/*` | Temporary | main + develop | Emergency fixes |

### Workflow Steps

**Feature Development**:
```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/user-authentication

# 3. Work on feature
git add .
git commit -m "feat: add OAuth2 login"
git push -u origin feature/user-authentication

# 4. Open PR to develop
gh pr create --base develop --fill

# 5. After approval, merge to develop
gh pr merge --squash

# 6. Delete feature branch
git branch -d feature/user-authentication
```

**Release Process**:
```bash
# 1. Create release branch from develop
git checkout develop
git checkout -b release/v1.2.0

# 2. Version bump and final fixes
npm version minor
git commit -m "chore: bump version to 1.2.0"

# 3. Merge to main
git checkout main
git merge release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin main --tags

# 4. Merge back to develop
git checkout develop
git merge release/v1.2.0
git push origin develop

# 5. Delete release branch
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0
```

**Hotfix Process**:
```bash
# 1. Create hotfix from main
git checkout main
git checkout -b hotfix/critical-security-fix

# 2. Fix and test
git add .
git commit -m "fix: patch security vulnerability"

# 3. Merge to main
git checkout main
git merge hotfix/critical-security-fix
git tag -a v1.2.1 -m "Hotfix 1.2.1"
git push origin main --tags

# 4. Merge to develop
git checkout develop
git merge hotfix/critical-security-fix
git push origin develop

# 5. Delete hotfix branch
git branch -d hotfix/critical-security-fix
```

### Rules
- Never commit directly to main or develop
- Features branch from develop
- Releases branch from develop
- Hotfixes branch from main
- Merge releases to both main and develop
- Tag all releases on main

### Pros & Cons

✅ **Pros**:
- Supports multiple versions
- Clear release process
- Hotfix process well-defined
- Good for large teams

❌ **Cons**:
- More complex
- Higher overhead
- Can slow down deployment
- Many long-lived branches

## 3. Trunk-Based Development

**Best for**: Continuous integration/deployment, mature teams, fast iteration

### Branch Structure
```
main (trunk)
  ├── feature/quick-1 (< 2 days)
  └── feature/quick-2 (< 2 days)
```

### Workflow Steps

```bash
# 1. Create short-lived branch
git checkout main
git pull origin main
git checkout -b feature/quick-change

# 2. Make small changes (< 1 day of work)
git add .
git commit -m "feat: add button component"

# 3. Push and create PR immediately
git push -u origin feature/quick-change
gh pr create --fill

# 4. Get quick review and merge
# (Same day)

# 5. Delete branch
git branch -d feature/quick-change

# Alternative: Commit directly to main (advanced)
git checkout main
git add .
git commit -m "feat: add button component"
git push origin main
```

### Rules
- Branches live < 2 days (ideally < 1 day)
- Commit to main frequently
- Use feature flags for incomplete features
- Comprehensive automated testing
- Fast code review (< 1 hour)
- All commits must be releasable

### Feature Flags Example

```typescript
// Feature flag system
const features = {
  newCheckout: process.env.FEATURE_NEW_CHECKOUT === 'true',
  betaUI: process.env.FEATURE_BETA_UI === 'true',
};

// Use in code
function CheckoutPage() {
  if (features.newCheckout) {
    return <NewCheckoutFlow />;
  }
  return <LegacyCheckoutFlow />;
}
```

### Pros & Cons

✅ **Pros**:
- Very fast iteration
- Minimal branching overhead
- Encourages small changes
- Reduces merge conflicts
- Continuous integration friendly

❌ **Cons**:
- Requires mature team
- Needs feature flags
- Requires excellent test coverage
- Can be risky without automation
- Not suitable for all projects

## 4. Forking Workflow

**Best for**: Open source projects, external contributors

### Structure
```
Upstream (original repo)
  └── main

Your Fork
  └── main
       ├── feature/contribution-1
       └── feature/contribution-2
```

### Workflow Steps

```bash
# 1. Fork repository (via GitHub UI)

# 2. Clone your fork
git clone https://github.com/your-username/project.git
cd project

# 3. Add upstream remote
git remote add upstream https://github.com/original/project.git

# 4. Create feature branch
git checkout -b feature/my-contribution

# 5. Make changes
git add .
git commit -m "feat: add new feature"

# 6. Push to your fork
git push -u origin feature/my-contribution

# 7. Create PR from fork to upstream
gh pr create --repo original/project --fill

# 8. Keep fork updated
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### Rules
- Never push directly to upstream
- Always work in feature branches
- Keep fork synchronized with upstream
- One feature per PR
- Follow project contribution guidelines

### Pros & Cons

✅ **Pros**:
- Safe for open source
- No direct access needed
- Clear contributor workflow
- Protects main repository

❌ **Cons**:
- Extra steps (fork, upstream)
- Can get out of sync
- More complex for beginners

## Common Operations

### Keeping Branch Up to Date

**With merge**:
```bash
git checkout main
git pull origin main
git checkout feature/my-feature
git merge main
git push origin feature/my-feature
```

**With rebase** (cleaner history):
```bash
git checkout main
git pull origin main
git checkout feature/my-feature
git rebase main
git push --force-with-lease origin feature/my-feature
```

### Stashing Changes

```bash
# Save work in progress
git stash

# Switch branches
git checkout other-branch

# Come back
git checkout feature/my-feature
git stash pop
```

### Cherry-picking Commits

```bash
# Apply specific commit to current branch
git cherry-pick abc123

# Apply multiple commits
git cherry-pick abc123 def456 ghi789
```

### Resolving Conflicts

```bash
# During merge or rebase
git status  # See conflicted files

# Edit files to resolve conflicts
# Look for:
# <<<<<<< HEAD
# Your changes
# =======
# Their changes
# >>>>>>> branch-name

# After resolving
git add .
git merge --continue  # or git rebase --continue

# Or abort
git merge --abort  # or git rebase --abort
```

## Team Workflow Best Practices

### 1. Communication

**Daily**:
- Morning sync: What are you working on?
- Status updates in standups
- Blocked? Ask for help immediately

**Per PR**:
- Link to ticket/issue
- Explain what and why
- Mention reviewers
- Update when ready

**Weekly**:
- Review open PRs
- Clean up old branches
- Discuss workflow improvements

### 2. Code Review Culture

**As Author**:
- Keep PRs small
- Self-review first
- Respond to feedback
- Don't take it personally

**As Reviewer**:
- Review promptly (within 24 hours)
- Be constructive
- Explain reasoning
- Approve when good enough (not perfect)

### 3. Branch Hygiene

**Daily**:
```bash
# Update main
git checkout main
git pull origin main

# Delete merged branches
git branch --merged main | grep -v "^\*\|main\|develop" | xargs git branch -d

# Prune remote branches
git fetch --prune
```

**Weekly**:
```bash
# Audit open branches
git branch -a

# Contact owners of stale branches
git for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short) %(authorname) %(committerdate:relative)'
```

### 4. Commit Discipline

**DO ✅**:
- Commit frequently
- Write clear messages
- Keep commits atomic
- Test before committing
- Review before pushing

**DON'T ❌**:
- Commit broken code
- Mix unrelated changes
- Use vague messages
- Commit sensitive data
- Force push shared branches

## Emergency Procedures

### Rolling Back Release

**Git Flow**:
```bash
# Revert to previous tag
git checkout main
git revert HEAD
git push origin main

# Or create hotfix
git checkout -b hotfix/rollback v1.1.0
git push origin hotfix/rollback
```

**GitHub Flow**:
```bash
# Revert PR
git revert abc123
git push origin main

# Immediate deploy
```

### Recovering Lost Work

```bash
# Find lost commits
git reflog

# Recover branch
git checkout -b recovered-branch abc123

# Or reset to previous state
git reset --hard abc123
```

### Fixing Pushed Secrets

```bash
# 1. Revoke the secret immediately
# 2. Remove from git history
git filter-repo --path secrets.env --invert-paths

# 3. Force push (coordinate with team)
git push --force-with-lease origin main

# 4. Everyone must re-clone
```

## Workflow Templates

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test
      - run: npm run build
```

### Branch Protection Rules

```yaml
# main branch
required_status_checks:
  strict: true
  contexts:
    - test
    - lint
    - build
required_pull_request_reviews:
  required_approving_review_count: 2
enforce_admins: true
restrictions:
  teams:
    - core-team
```

## Metrics & Monitoring

### Useful Metrics

```bash
# Branches per developer
git for-each-ref --format='%(authorname)' refs/heads/ | sort | uniq -c

# Average PR size
gh pr list --state merged --limit 50 --json additions,deletions

# Time from PR to merge
gh pr list --state merged --limit 50 --json createdAt,mergedAt

# Commit frequency
git log --since="1 month ago" --format="%ai" | cut -d " " -f 1 | uniq -c
```

### Health Indicators

**Good Signs**:
- PRs merged within 1-2 days
- < 10 open branches per developer
- Regular commits (not all Friday afternoon)
- Few force pushes
- Fast CI/CD pipeline (< 10 minutes)

**Warning Signs**:
- PRs open for weeks
- 50+ open branches
- Large PRs (> 500 lines)
- Frequent force pushes to shared branches
- CI failures ignored

## Summary

**Choosing Workflow**:
1. **GitHub Flow**: Simple projects, continuous deployment
2. **Git Flow**: Complex projects, scheduled releases
3. **Trunk-Based**: High maturity, very frequent deployment
4. **Forking**: Open source, external contributors

**Universal Best Practices**:
- Keep branches short-lived
- Commit frequently
- Review code promptly
- Automate testing
- Communicate clearly
- Clean up regularly

**Remember**: The best workflow is the one your team follows consistently. Start simple and add complexity only when needed.
