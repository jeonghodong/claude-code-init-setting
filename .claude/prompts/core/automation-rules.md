# Autonomous Automation Rules

Rules for proactive agent, command, and tool usage.

## Core Automation Principles

**ALWAYS:**
1. ✅ Use Task tool to invoke agents for complex, multi-step operations
2. ✅ Execute slash commands via SlashCommand tool when context matches
3. ✅ Run multiple operations in parallel when independent
4. ✅ Reference `.claude/prompts/` for best practices guidelines
5. ✅ Follow `.claude/workflows/` for structured task execution

**NEVER:**
1. ❌ Wait for explicit user request to use agents/commands
2. ❌ Process tasks sequentially when parallel execution is possible
3. ❌ Ignore available agents that match task context
4. ❌ Skip quality checks (tests, security, linting) before completion

## Automatic Agent Engagement

**Available Agents** (from `.claude/agents/`):
- **architect.md** - Auto-engage for: system design, architecture decisions, tech stack selection, scalability planning
- **fullstack-developer.md** - Auto-engage for: feature development, API implementation, database operations, full-stack tasks
- **devops-sre.md** - Auto-engage for: deployment, CI/CD, Docker, Kubernetes, infrastructure, monitoring
- **data-engineer.md** - Auto-engage for: ETL pipelines, data warehousing, analytics, data modeling
- **security-expert.md** - Auto-engage for: security audits, authentication, authorization, vulnerability scanning, encryption

### Rules for Agent Usage

1. **Automatically detect** which agent(s) are needed based on task keywords
2. **Invoke agents proactively** without waiting for explicit request
3. **Use multiple agents** in parallel when task requires diverse expertise
4. **Switch agents dynamically** as task evolves

## Automatic Slash Command Usage

**Available Commands** (from `.claude/commands/`):
- `/analyze` - Auto-run when: user asks about code structure, architecture overview, project exploration
- `/test` - Auto-run when: implementing features, fixing bugs, before deployment, after refactoring
- `/debug` - Auto-run when: errors occur, unexpected behavior, investigating issues
- `/refactor` - Auto-run when: code quality issues, complexity warnings, maintainability concerns
- `/optimize` - Auto-run when: performance issues, slow response times, resource optimization
- `/security` - Auto-run when: handling auth, user data, before deployment, security concerns
- `/deploy` - Auto-run when: shipping code, deployment mentioned, CI/CD setup
- `/docs` - Auto-run when: documentation outdated, new features added, complex logic
- `/migrate` - Auto-run when: tech stack changes, framework upgrades, database migrations

### Rules for Command Usage

1. **Execute proactively** based on task context—don't wait for explicit `/command` syntax
2. **Chain intelligently** (e.g., `/test` → `/security` → `/deploy`)
3. **Run in parallel** when independent (e.g., `/test` and `/lint`)
4. **Inform user briefly** which command you're running and why

## Automatic Workflow Application

**Available Workflows** (from `.claude/workflows/`):
- **feature-development.md** - Auto-apply for: new features, significant changes
- **debugging.md** - Auto-apply for: bug reports, errors, unexpected behavior
- **code-review.md** - Auto-apply for: review requests, before deployment, quality checks

## Decision Matrix for Autonomous Actions

| Task Type | Auto-Engage Agent(s) | Auto-Run Commands | Auto-Apply Workflow |
|-----------|----------------------|-------------------|---------------------|
| New Feature | fullstack-developer | /analyze, /test, /security | feature-development.md |
| Bug Fix | fullstack-developer | /debug, /test | debugging.md |
| Performance Issue | fullstack-developer | /analyze, /optimize | N/A |
| Deployment | devops-sre | /test, /security, /deploy | N/A |
| Architecture Design | architect | /analyze | N/A |
| Security Audit | security-expert | /security, /analyze | N/A |
| Code Review | N/A | /refactor, /test, /security | code-review.md |
| Documentation | fullstack-developer | /docs | N/A |
| Tech Migration | architect, data-engineer | /analyze, /migrate, /test | N/A |

## Execution Patterns

### Pattern 1: Feature Development
```
User: "Add a contact form"

Automatic Actions:
1. Read .claude/workflows/feature-development.md
2. Read .claude/prompts/core/* relevant guidelines
3. Use Task → fullstack-developer agent
4. Execute /analyze (check existing patterns)
5. Implement (parallel file operations)
6. Execute /test, /security, /docs
```

### Pattern 2: Bug Investigation
```
User: "The login page is broken"

Automatic Actions:
1. Read .claude/workflows/debugging.md
2. Execute /debug command
3. Use Task → fullstack-developer agent
4. Execute /test (existing tests)
5. Fix + Add regression test
6. Execute /test again
```

### Pattern 3: Code Review
```
User: "Review my recent changes"

Automatic Actions:
1. Read .claude/workflows/code-review.md
2. Execute git commands in parallel:
   - git status
   - git diff
   - git log -5
3. Use Task → architect agent
4. Execute /refactor, /security, /test
```

### Pattern 4: Deployment
```
User: "Deploy to production"

Automatic Actions:
1. Read .claude/workflows/feature-development.md (Phase 4)
2. Use Task → devops-sre agent
3. Execute in parallel: /test, /security, lint, type-check
4. Execute npm run build
5. Execute /deploy
6. Monitor status
```

### Pattern 5: Performance Optimization
```
User: "The app is slow"

Automatic Actions:
1. Read .claude/prompts/domain/performance.md
2. Execute /analyze (identify bottlenecks)
3. Use Task → fullstack-developer agent
4. Read relevant files (parallel)
5. Execute /optimize
6. Implement optimizations
7. Execute /test
8. Benchmark before/after
```

## Transparency Principles

When automatically using agents/commands/workflows, briefly inform the user:

```
✅ GOOD: "I'll analyze the codebase structure, then run tests and security checks in parallel."

✅ GOOD: "Using the fullstack-developer agent to break down this feature implementation."

✅ GOOD: "Following the debugging workflow to systematically identify the issue."

❌ BAD: (Executing without explanation)

❌ BAD: "I'm now going to use the super advanced agentic workflow system that will..."
```

## Important Rules

1. **Be Proactive, Not Reactive**: Detect needs automatically
2. **Multi-Agent Coordination**: Use multiple agents in parallel when needed
3. **Command Chaining**: Link commands logically
4. **Context Awareness**: Adapt based on project type
5. **Transparency**: Briefly inform user of actions
6. **Flexibility**: Override if user explicitly requests different approach

## Prompt Usage Guidelines

**Prompts** (`.claude/prompts/` - Internal guidelines):
- **core/agentic-patterns.md** - Auto-apply when: designing workflows, choosing approaches
- **core/tool-engineering.md** - Auto-apply when: creating tools, debugging tool usage
- **core/complexity-management.md** - Auto-apply when: deciding architecture complexity
- **core/execution-principles.md** - ALWAYS active for performance
- **domain/*.md** - Auto-apply based on task domain
- **quality/*.md** - Auto-apply when: writing code, reviewing, testing

## How to Use This Configuration

1. **Read relevant prompts** at task start (parallel reads)
2. **Identify task type** from keywords and context
3. **Load corresponding resources** from `.claude/`
4. **Execute automatically** without waiting for explicit requests
5. **Inform user briefly** what you're doing
6. **Apply loaded guidelines** throughout execution

## Summary: Automation Checklist

For every user request:
- [ ] Identify task type and domain
- [ ] Read relevant prompts from `.claude/prompts/` in parallel
- [ ] Determine which agents are needed (if any)
- [ ] Identify applicable slash commands
- [ ] Check if a workflow should be followed
- [ ] Execute all independent operations in parallel
- [ ] Briefly inform user of approach
- [ ] Apply quality checks before completion
- [ ] Follow up with appropriate commands (/test, /security, /docs)
