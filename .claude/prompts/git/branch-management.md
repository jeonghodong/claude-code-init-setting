# Git Branch Management

Best practices for creating, managing, and organizing branches in Git to maintain a clean and efficient workflow.

## Branch Naming Conventions

### Standard Format

```
<type>/<ticket-id>-<short-description>
```

### Branch Types

| Type | Purpose | Example |
|------|---------|---------|
| `feature/` | New features | `feature/USER-123-add-authentication` |
| `fix/` or `bugfix/` | Bug fixes | `fix/USER-456-resolve-login-error` |
| `hotfix/` | Urgent production fixes | `hotfix/PROD-789-critical-security-patch` |
| `refactor/` | Code refactoring | `refactor/improve-api-performance` |
| `docs/` | Documentation only | `docs/update-api-documentation` |
| `test/` | Testing improvements | `test/add-integration-tests` |
| `chore/` | Maintenance tasks | `chore/update-dependencies` |
| `release/` | Release preparation | `release/v1.2.0` |
| `experiment/` | Experimental features | `experiment/new-ui-framework` |

### Naming Rules

**DO ✅**:
- Use lowercase
- Use hyphens to separate words
- Keep it short but descriptive
- Include ticket/issue number
- Use present tense

**Examples**:
```bash
✅ Good:
feature/USER-123-add-user-profile
fix/BUG-456-resolve-memory-leak
hotfix/PROD-789-security-vulnerability
refactor/simplify-authentication-logic

❌ Bad:
MyFeature
bug_fix_123
FEATURE-USER-PROFILE
feature/this-is-a-very-long-branch-name-that-describes-everything
```

## Branch Creation

### Creating New Branch

```bash
# Create and switch to new branch
git checkout -b feature/USER-123-add-authentication

# Or using newer syntax
git switch -c feature/USER-123-add-authentication

# Create from specific branch
git checkout -b feature/new-feature main
git checkout -b hotfix/critical-fix production
```

### Create from Specific Commit

```bash
# Create branch from commit
git checkout -b bugfix/fix-issue abc123

# Create branch from tag
git checkout -b hotfix/security-patch v1.0.0
```

## Branch Lifecycle

### 1. Start Working on Branch

```bash
# Ensure you're on main/develop
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/USER-123-new-feature

# Make your changes
# ... commit work ...
```

### 2. Keep Branch Updated

```bash
# Regularly sync with main
git checkout main
git pull origin main

git checkout feature/USER-123-new-feature
git rebase main
# or
git merge main
```

### 3. Push Branch

```bash
# First time push
git push -u origin feature/USER-123-new-feature

# Subsequent pushes
git push
```

### 4. Merge Branch

```bash
# After PR approval, merge to main
git checkout main
git pull origin main
git merge feature/USER-123-new-feature
git push origin main
```

### 5. Clean Up Branch

```bash
# Delete local branch
git branch -d feature/USER-123-new-feature

# Delete remote branch
git push origin --delete feature/USER-123-new-feature

# Or shorter syntax
git push origin :feature/USER-123-new-feature
```

## Branch Operations

### Switching Branches

```bash
# Old syntax
git checkout feature/my-feature

# New syntax (Git 2.23+)
git switch feature/my-feature

# Create and switch
git switch -c feature/new-feature

# Switch to previous branch
git switch -

# Switch with uncommitted changes (stash)
git stash
git switch other-branch
git stash pop
```

### Listing Branches

```bash
# List local branches
git branch

# List remote branches
git branch -r

# List all branches
git branch -a

# List with last commit
git branch -v

# List merged branches
git branch --merged

# List unmerged branches
git branch --no-merged

# Search branches
git branch --list "feature/*"
```

### Renaming Branches

```bash
# Rename current branch
git branch -m new-branch-name

# Rename specific branch
git branch -m old-name new-name

# Update remote
git push origin :old-name new-name
git push origin -u new-name
```

### Comparing Branches

```bash
# See commits in feature not in main
git log main..feature/my-feature

# See commits in main not in feature
git log feature/my-feature..main

# See differences between branches
git diff main...feature/my-feature

# See file differences
git diff main feature/my-feature -- path/to/file.ts
```

## Branch Protection

### Protected Branches

Configure in GitHub/GitLab settings:

**Main/Master Branch**:
- Require pull request reviews (1-2 reviewers)
- Require status checks to pass
- Require branches to be up to date
- Enforce for administrators
- Restrict push access
- Require signed commits

**Develop Branch**:
- Require pull request reviews (1 reviewer)
- Require status checks to pass
- Allow force pushes by admins only

**Production Branch**:
- Require pull request reviews (2+ reviewers)
- Require all status checks
- No force pushes (even admins)
- Require signed commits
- Restrict who can push

### Branch Protection Example (.github/branch-protection.yml)

```yaml
branch_protection:
  main:
    required_status_checks:
      strict: true
      contexts:
        - "ci/test"
        - "ci/lint"
        - "ci/type-check"
    required_pull_request_reviews:
      required_approving_review_count: 2
      dismiss_stale_reviews: true
      require_code_owner_reviews: true
    restrictions:
      users: []
      teams: ["core-team"]
    enforce_admins: true
```

## Branch Strategies

### Git Flow

```
main (production)
  └── develop (integration)
       ├── feature/USER-123
       ├── feature/USER-456
       └── release/v1.2.0
  └── hotfix/PROD-789
```

**Branches**:
- `main`: Production code
- `develop`: Integration branch
- `feature/*`: Feature development
- `release/*`: Release preparation
- `hotfix/*`: Production fixes

**Workflow**:
```bash
# Start feature
git checkout develop
git checkout -b feature/USER-123

# Finish feature
git checkout develop
git merge feature/USER-123
git branch -d feature/USER-123

# Start release
git checkout develop
git checkout -b release/v1.2.0
# ... version bumps, docs ...

# Finish release
git checkout main
git merge release/v1.2.0
git tag v1.2.0
git checkout develop
git merge release/v1.2.0
git branch -d release/v1.2.0

# Hotfix
git checkout main
git checkout -b hotfix/critical-fix
# ... fix ...
git checkout main
git merge hotfix/critical-fix
git tag v1.2.1
git checkout develop
git merge hotfix/critical-fix
```

### GitHub Flow (Simpler)

```
main (production + development)
  ├── feature/USER-123
  ├── feature/USER-456
  └── hotfix/PROD-789
```

**Workflow**:
```bash
# Create feature branch
git checkout main
git pull origin main
git checkout -b feature/USER-123

# Work and commit
git commit -m "feat: add feature"
git push -u origin feature/USER-123

# Create PR, get reviewed, merge to main
# Deploy from main
```

**Best for**:
- Continuous deployment
- Simple workflows
- Small teams

### Trunk-Based Development

```
main (trunk)
  ├── feature/short-lived-1
  └── feature/short-lived-2
```

**Rules**:
- Short-lived feature branches (< 2 days)
- Frequent merges to main
- Feature flags for incomplete features
- Continuous integration

**Workflow**:
```bash
# Create short-lived branch
git checkout -b feature/quick-change

# Work for short time
git commit -m "feat: partial implementation"

# Merge quickly
git checkout main
git merge feature/quick-change

# Use feature flags if not complete
if (featureFlags.newFeature) {
  // New code
}
```

## Stale Branch Management

### Find Stale Branches

```bash
# Branches not updated in 30 days
git for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short) %(committerdate:relative)'

# Merged branches (safe to delete)
git branch --merged main

# Unmerged branches (review before delete)
git branch --no-merged main
```

### Clean Up Local Branches

```bash
# Delete merged branches
git branch --merged main | grep -v "^\*\|main\|develop" | xargs git branch -d

# Prune remote tracking branches
git fetch --prune
git remote prune origin
```

### Automated Cleanup Script

```bash
#!/bin/bash
# cleanup-branches.sh

# Fetch and prune
git fetch --prune

# Delete merged feature branches
git branch --merged main | grep "feature/" | xargs git branch -d

# List branches older than 30 days
echo "Branches older than 30 days:"
git for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short) %(committerdate:short)' | awk -v date=$(date -d '30 days ago' +%Y-%m-%d) '$2 < date {print $1}'

# Delete remote branches that no longer exist
git remote prune origin
```

## Emergency Branch Recovery

### Recover Deleted Branch

```bash
# Find commit of deleted branch
git reflog

# Recreate branch
git checkout -b feature/recovered-branch abc123
```

### Restore Branch After Force Push

```bash
# Find previous commit
git reflog

# Reset to previous state
git reset --hard abc123

# Or create new branch from old state
git checkout -b feature/backup abc123
```

## Branch Hygiene

### Regular Maintenance

**Daily**:
- Delete local merged branches
- Update main/develop branch
- Rebase long-running feature branches

**Weekly**:
- Review open branches
- Clean up remote merged branches
- Update branch from main

**Monthly**:
- Audit all open branches
- Contact owners of stale branches
- Archive old branches

### Best Practices

**DO ✅**:
1. Keep branches short-lived
2. Regularly sync with main/develop
3. Delete branches after merging
4. Use descriptive branch names
5. Commit frequently to branches
6. Push branches daily
7. Keep work-in-progress in branches
8. Use pull requests for merging

**DON'T ❌**:
1. Leave branches open for months
2. Create branches from branches
3. Force push to shared branches
4. Work directly on main/develop
5. Accumulate hundreds of stale branches
6. Use generic branch names
7. Mix multiple features in one branch
8. Commit directly to protected branches

## Branch Metrics

### Useful Metrics to Track

```bash
# Number of open branches
git branch -r | wc -l

# Average branch age
git for-each-ref --sort=-committerdate refs/heads/ --format='%(committerdate:relative)' | head -10

# Branches per developer
git for-each-ref --format='%(authorname)' refs/heads/ | sort | uniq -c

# Largest branches (by commits)
git branch -v | sort -k2 -n -r
```

## Summary Checklist

When working with branches:
- [ ] Use descriptive naming convention
- [ ] Include ticket/issue number
- [ ] Keep branches short-lived (< 1 week)
- [ ] Regularly sync with main/develop
- [ ] Push branch daily
- [ ] Create PR when ready for review
- [ ] Delete branch after merging
- [ ] Don't force push to shared branches
- [ ] Protect important branches
- [ ] Clean up stale branches regularly

**Remember**: Good branch management keeps your repository organized and makes collaboration smooth.
