---
description: Git 커밋을 베스트 프랙티스에 따라 수행합니다.
model: sonnet
---

# Git Commit Workflow

## 🤖 Agent to Use

**Use the `github-expert` agent (`@.claude/agents/github-expert.md`) to perform this commit.**

The github-expert agent will automatically:
1. Reference `@.claude/prompts/git/commit-guidelines.md` for best practices
2. Execute pre-commit checks (security, quality, tests)
3. Generate Conventional Commits formatted messages
4. Follow atomic commit principles
5. Verify all changes before committing

**Agent invocation**: You MUST use the github-expert agent for all commit operations. The agent has access to all Git best practices and will ensure commits follow Conventional Commits standard.

---

## 📋 Workflow Steps

The agent will perform these steps in sequence:

### 1. **Review Changes**
```bash
git status
git diff
git diff --staged
```

### 2. **Security & Quality Checks**
- ✅ Check for sensitive files (`.env`, `.mcp.json`, credentials)
- ✅ Run linter: `npm run lint` or equivalent
- ✅ Run type checker: `npm run type-check`
- ✅ Run tests: `npm test`
- ✅ Run build: `npm run build`

### 3. **Stage Files**
```bash
git add <files>
git diff --staged  # Review before commit
```

### 4. **Create Commit**
Using Conventional Commits format:
```
<type>: <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`

### 5. **Verify & Push** (optional)
```bash
git log -1 --stat
git push  # if ready
```

---

## 🎯 Key Principles

The agent follows these principles (from `commit-guidelines.md`):

**✅ DO**:
- Atomic commits (one logical change)
- Clear, descriptive messages
- Security checks (no secrets)
- All tests passing
- Conventional Commits format

**❌ DON'T**:
- Commit sensitive files
- Skip tests or linting
- Use vague messages
- Mix unrelated changes
- Commit broken code

---

## 📝 Commit Message Examples

**Good**:
```bash
feat: add user authentication with OAuth2
fix: resolve memory leak in data processing
docs: update API documentation for v2
refactor: extract validation into separate module
```

**Bad**:
```bash
❌ "fix stuff"
❌ "WIP"
❌ "changes"
❌ "update"
```

---

## 🚨 Special Cases

### Breaking Changes
```
feat!: change API authentication to OAuth2

BREAKING CHANGE: JWT auth no longer supported.
See docs/migration.md for upgrade path.

Closes #789
```

### Multiple Authors
```
feat: add real-time notifications

Co-authored-by: Name <email@example.com>
```

### Amend Last Commit (if not pushed)
```bash
git commit --amend
```

---

## ✅ Pre-Commit Checklist

The agent verifies:
- [ ] No sensitive files (`.env`, credentials, API keys)
- [ ] Linter passes
- [ ] Type checker passes
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Conventional Commits format
- [ ] Atomic commit (one logical change)
- [ ] No debug code or console.logs

---

**Note**: All detailed guidelines are in `@.claude/prompts/git/commit-guidelines.md`. The `github-expert` agent automatically applies these best practices.
