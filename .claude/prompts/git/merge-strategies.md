# Git Merge Strategies

Comprehensive guide to understanding and choosing the right merge strategy for different scenarios.

## Overview

Git offers multiple ways to integrate changes from one branch into another. Each has trade-offs in terms of history clarity, conflict resolution, and team workflow.

## Three Main Approaches

### 1. Merge Commit

### 2. Rebase

### 3. Squash

## 1. Merge Commit

### What It Does

Creates a new "merge commit" that combines two branches, preserving both histories.

```
Before:
main:     A---B---C
               \
feature:        D---E---F

After (merge commit):
main:     A---B---C-------G
               \         /
feature:        D---E---F
```

### How to Use

```bash
# Standard merge
git checkout main
git merge feature/my-feature

# With explicit merge commit (even if fast-forward possible)
git merge --no-ff feature/my-feature

# With custom message
git merge feature/my-feature -m "Merge feature: user authentication"
```

### Pros & Cons

✅ **Pros**:
- Preserves complete history
- Shows when features were integrated
- Easy to revert entire feature
- Clear context of what was merged
- Maintains branch relationships

❌ **Cons**:
- More commits in history
- History can become cluttered
- Merge commits can be noisy
- Harder to follow linear timeline

### When to Use

**Use merge commit for**:
- Long-running feature branches
- Team collaboration on branches
- When you want to preserve branch history
- Complex features with many commits
- When reverting entire features is important

**Example scenarios**:
```bash
# Large feature with multiple contributors
git merge --no-ff feature/payment-integration

# Release branches
git merge --no-ff release/v1.2.0

# Integration branches
git merge feature/mobile-app
```

## 2. Rebase

### What It Does

Replays commits from one branch onto another, creating a linear history.

```
Before:
main:     A---B---C
               \
feature:        D---E---F

After (rebase):
main:     A---B---C
                   \
feature:            D'---E'---F'
```

### How to Use

```bash
# Rebase feature onto main
git checkout feature/my-feature
git rebase main

# Interactive rebase (edit commits)
git rebase -i main

# Continue after resolving conflicts
git rebase --continue

# Abort if things go wrong
git rebase --abort

# Push rebased branch (requires force)
git push --force-with-lease origin feature/my-feature
```

### Interactive Rebase

```bash
git rebase -i HEAD~3

# Editor opens with:
pick abc123 feat: add login
pick def456 fix: typo
pick ghi789 refactor: cleanup

# Change to:
pick abc123 feat: add login
fixup def456 fix: typo          # Merge into previous commit
reword ghi789 refactor: cleanup # Edit commit message

# Options:
# pick = use commit
# reword = use commit, but edit message
# edit = use commit, but stop for amending
# squash = merge into previous commit, combine messages
# fixup = merge into previous commit, discard message
# drop = remove commit
```

### Pros & Cons

✅ **Pros**:
- Clean, linear history
- Easy to follow timeline
- No merge commits
- Easier to read git log
- Bisect-friendly

❌ **Cons**:
- Rewrites history (can be dangerous)
- Force push required
- Conflicts resolved per commit
- Learning curve
- Not safe for shared branches

### When to Use

**Use rebase for**:
- Keeping feature branches up to date
- Cleaning up local commits before pushing
- Creating linear history
- Personal branches (not shared)

**Example scenarios**:
```bash
# Update feature branch with latest main
git checkout feature/my-work
git rebase main

# Clean up commits before PR
git rebase -i HEAD~5

# Sync fork with upstream
git fetch upstream
git rebase upstream/main
```

### Golden Rule of Rebasing

**NEVER rebase commits that have been pushed to a shared branch that others are working on.**

```bash
❌ DANGEROUS:
git checkout main
git rebase feature  # Never rebase public branches!

✅ SAFE:
git checkout feature
git rebase main     # Rebase your feature onto main
```

## 3. Squash and Merge

### What It Does

Combines all commits from a branch into a single commit when merging.

```
Before:
main:     A---B---C
               \
feature:        D---E---F

After (squash merge):
main:     A---B---C---G
                     (G contains D+E+F changes)
feature:        D---E---F (remains unchanged)
```

### How to Use

```bash
# Squash merge
git checkout main
git merge --squash feature/my-feature
git commit -m "feat: complete user authentication feature"

# Or via GitHub
# Use "Squash and merge" button in PR

# Or via GitHub CLI
gh pr merge --squash
```

### Pros & Cons

✅ **Pros**:
- Very clean main branch history
- One commit per feature/PR
- Easy to revert features
- Hides messy development commits
- Easy to read git log

❌ **Cons**:
- Loses detailed commit history
- Can hide useful intermediate commits
- Requires good final commit message
- Makes bisect less granular

### When to Use

**Use squash merge for**:
- Small to medium features
- PRs with many "fix typo" commits
- When main branch clarity is priority
- Features developed by single person

**Example scenarios**:
```bash
# PR with messy commits
# Commits: "WIP", "fix", "fix again", "final fix"
# Squash to: "feat: add user profile page"
gh pr merge --squash

# Small bug fix with multiple attempts
git merge --squash bugfix/login-error
git commit -m "fix: resolve login redirect issue"
```

## Comparison Table

| Aspect | Merge Commit | Rebase | Squash |
|--------|--------------|--------|--------|
| **History** | Complete | Linear | Simplified |
| **Commits** | All preserved | All preserved (rewritt) | Combined into one |
| **Conflicts** | Once | Per commit | Once |
| **Revert** | Easy (revert merge) | Harder | Easy (revert commit) |
| **Bisect** | Works but complex | Excellent | Less granular |
| **Force push** | Not needed | Required | Not needed |
| **Learning curve** | Easy | Moderate | Easy |
| **Public branches** | Safe | Dangerous | Safe |

## Conflict Resolution

### During Merge

```bash
# Start merge
git merge feature/branch

# Conflicts occur
# Edit conflicted files
# Look for markers:
<<<<<<< HEAD
Your changes (current branch)
=======
Their changes (merging branch)
>>>>>>> feature/branch

# After resolving
git add .
git merge --continue

# Or abort
git merge --abort
```

### During Rebase

```bash
# Start rebase
git rebase main

# Conflicts occur in first commit
# Resolve conflicts
git add .
git rebase --continue

# More conflicts? Repeat
# Resolve → add → continue

# Or abort
git rebase --abort
```

### Conflict Resolution Tools

```bash
# Use mergetool
git mergetool

# Or specific tool
git mergetool --tool=vimdiff
git mergetool --tool=meld
git mergetool --tool=code  # VS Code

# Configure default tool
git config --global merge.tool code
git config --global mergetool.code.cmd "code --wait --merge \$REMOTE \$LOCAL \$BASE \$MERGED"
```

## Advanced Merge Options

### Merge Strategies

```bash
# Recursive (default, handles most cases)
git merge -s recursive feature/branch

# Ours (keep our version on conflicts)
git merge -s ours feature/branch

# Theirs (keep their version on conflicts)
git merge -X theirs feature/branch

# Octopus (merge multiple branches)
git merge branch1 branch2 branch3
```

### Useful Options

```bash
# Show merge in progress
git merge --no-commit --no-ff feature/branch
# Review changes before committing
git diff --cached
git commit

# Merge with strategy for specific files
git merge -X ours feature/branch  # Prefer our version on conflicts

# Abort merge
git merge --abort

# Continue merge after resolving
git merge --continue
```

## Fast-Forward Merges

### What Is Fast-Forward?

When the target branch hasn't diverged, Git can simply "move forward" the pointer.

```
Before:
main:     A---B---C
                   \
feature:            D---E---F

After (fast-forward):
main:     A---B---C---D---E---F
```

### Controlling Fast-Forward

```bash
# Allow fast-forward (default)
git merge feature/branch

# Force merge commit (no fast-forward)
git merge --no-ff feature/branch

# Only fast-forward (fail if not possible)
git merge --ff-only feature/branch
```

### When to Use --no-ff

**Use --no-ff when**:
- You want to see when features were merged
- Reverting the entire feature should be easy
- Following Git Flow or similar

```bash
# Git Flow releases
git merge --no-ff release/v1.2.0

# Feature branches in GitHub Flow
git merge --no-ff feature/major-feature
```

## Choosing the Right Strategy

### Decision Tree

```
Is it a feature branch?
├─ Yes: How many commits?
│   ├─ 1-3 clean commits → Merge commit or rebase
│   ├─ 4-10 messy commits → Squash
│   └─ 10+ commits → Rebase interactively, then merge
└─ No: Is it a hotfix?
    ├─ Yes → Squash
    └─ No: Is it a release?
        └─ Yes → Merge commit (--no-ff)
```

### By Project Type

**Open Source Project**:
- Merge commits (preserve contributor history)
- Or squash (clean maintainer history)

**Startup/Fast-Moving Product**:
- Squash (clean history)
- Trunk-based development

**Enterprise/Regulated**:
- Merge commits (full audit trail)
- Git Flow with structured merges

**Personal Project**:
- Whatever you prefer
- Recommend: Squash for simplicity

## Merge vs Rebase: Team Guidelines

### GitHub Flow with Squash

```bash
# Recommended for most teams

# Feature development
git checkout -b feature/new-thing
# ... work and commits ...
git push origin feature/new-thing

# Create PR, review, then squash merge
gh pr merge --squash

# Result: Clean main branch, one commit per feature
```

### Git Flow with Merge Commits

```bash
# For teams needing structured releases

# Feature development
git checkout develop
git checkout -b feature/new-thing
# ... work ...

# Merge with --no-ff
git checkout develop
git merge --no-ff feature/new-thing

# Result: Clear feature boundaries, full history
```

### Trunk-Based with Rebase

```bash
# For mature teams with excellent tests

# Short-lived branch
git checkout -b feature/quick-change
# ... work ...

# Rebase onto main
git fetch origin
git rebase origin/main

# Merge (often fast-forward)
git checkout main
git merge feature/quick-change

# Result: Linear history, clean timeline
```

## Common Scenarios

### Scenario 1: Update Feature Branch

```bash
# Option A: Merge (safe, preserves history)
git checkout feature/my-feature
git merge main

# Option B: Rebase (clean, linear history)
git checkout feature/my-feature
git rebase main
git push --force-with-lease
```

### Scenario 2: Combine Multiple Commits

```bash
# Interactive rebase
git rebase -i HEAD~4

# Change 'pick' to 'squash' for commits to combine
pick abc123 feat: add component
squash def456 fix: typo
squash ghi789 fix: styling
pick jkl012 test: add tests

# Result: 2 commits instead of 4
```

### Scenario 3: Merge Multiple Features

```bash
# Merge one at a time
git checkout main
git merge feature/auth
git merge feature/profile
git merge feature/settings

# Or octopus merge (use cautiously)
git merge feature/auth feature/profile feature/settings
```

### Scenario 4: Undo Merge

```bash
# If merge not pushed yet
git reset --hard HEAD~1

# If merge pushed (revert merge commit)
git revert -m 1 abc123

# -m 1 means keep main branch side
# -m 2 means keep feature branch side
```

## Best Practices

### DO ✅

1. **Be consistent**: Choose one strategy per project
2. **Communicate**: Document strategy in CONTRIBUTING.md
3. **Protect main**: Use branch protection rules
4. **Test before merging**: Ensure CI passes
5. **Clean commits**: Fix up before merging
6. **Meaningful messages**: Explain the merge

### DON'T ❌

1. **Mix strategies randomly**: Choose one approach
2. **Rebase public branches**: Only rebase private branches
3. **Force push main**: Never force push shared branches
4. **Merge without testing**: Always run tests first
5. **Ignore conflicts carelessly**: Review conflict resolution
6. **Commit merge conflicts**: Resolve before committing

## Summary Checklist

Before merging, verify:
- [ ] Branch is up to date with target
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Conflicts resolved (if any)
- [ ] Commit history is clean
- [ ] Merge strategy decided
- [ ] CI/CD checks passed
- [ ] Documentation updated

After merging:
- [ ] Verify merge successful
- [ ] Delete feature branch
- [ ] Deploy if necessary
- [ ] Update related issues
- [ ] Notify team if needed

**Remember**: The best merge strategy is the one your team understands and follows consistently. When in doubt, use squash merges for simplicity and merge commits for important features.
