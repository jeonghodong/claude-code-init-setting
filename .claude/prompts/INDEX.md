# Prompts Index

Quick reference for all available prompts in `.claude/prompts/`.

## How to Use These Prompts

**Automatic Loading**: Claude will automatically load relevant prompts based on task context (see CLAUDE.md for auto-loading rules).

**Manual Reference**: You can explicitly reference prompts in conversations:
- "Follow the guidelines in `prompts/core/agentic-patterns.md`"
- "Apply the principles from `prompts/quality/testing-strategy.md`"

---

## Core Prompts

Universal principles that apply to all tasks.

### [`core/execution-principles.md`](core/execution-principles.md)
**Parallel execution, performance optimization, tool usage**

**When to use**: ALWAYS active (mandatory)
- Parallel execution rules
- Tool selection priority
- Performance best practices
- Cost-latency tradeoffs

**Key concepts**: Parallel tool calls, specialized tools over bash, efficiency

---

### [`core/agentic-patterns.md`](core/agentic-patterns.md)
**Workflows vs agents, building blocks, architectural patterns**

Based on Anthropic's "Building Effective Agents" research.

**When to use**:
- Designing multi-step workflows
- Choosing between workflow types
- Building autonomous agents
- Understanding agentic architectures

**Key concepts**:
- Prompt chaining, routing, parallelization
- Orchestrator-workers, evaluator-optimizer
- Autonomous agents, complexity ladder

---

### [`core/tool-engineering.md`](core/tool-engineering.md)
**Agent-Computer Interface (ACI) design, tool documentation**

**When to use**:
- Creating new tools
- Debugging tool usage
- Improving tool definitions
- Optimizing agent-tool interactions

**Key concepts**:
- Poka-yoke (error-proofing)
- Format selection
- Tool documentation structure
- Testing tools with LLMs

---

### [`core/complexity-management.md`](core/complexity-management.md)
**When to add complexity, simplicity-first principle**

**When to use**:
- Deciding architecture complexity
- Choosing between patterns
- Evaluating tradeoffs
- Framework selection

**Key concepts**:
- Simplicity-first principle
- When to use workflows vs agents
- Complexity decision tree
- Framework usage guidelines

---

### [`core/automation-rules.md`](core/automation-rules.md)
**Proactive agent, command, and workflow usage**

**When to use**: ALWAYS active (automatic behavior)
- Agent engagement rules
- Slash command usage
- Workflow application
- Decision matrix for automation

**Key concepts**:
- Auto-detection of task types
- Proactive tool usage
- Transparency principles

---

### [`core/mcp-integration.md`](core/mcp-integration.md)
**MCP server discovery and usage patterns**

**When to use**: Session start + whenever MCP capabilities are relevant
- MCP server discovery
- Context matching
- Usage patterns by task type
- Integration with agents/workflows

**Key concepts**:
- MCP-first approach
- Graceful fallback
- Dynamic configuration handling

---

## Domain Prompts

Task-specific guidelines for different development domains.

### [`domain/coding-tasks.md`](domain/coding-tasks.md)
**Implementation best practices, coding patterns**

**When to use**:
- Implementing new features
- Writing code
- Refactoring
- Following coding standards

**Key concepts**:
- SWE-bench patterns
- Tool optimization for coding
- Implementation patterns
- Code quality guidelines

**Load automatically when**: feature development, coding tasks, file modifications

---

### [`domain/debugging.md`](domain/debugging.md)
**Systematic debugging process**

**When to use**:
- Investigating bugs
- Troubleshooting issues
- Error diagnosis
- Root cause analysis

**Key concepts**:
- Systematic debugging process
- Hypothesis formation
- Investigation techniques
- Debugging tools

**Load automatically when**: errors occur, bugs reported, "debug", "fix", "broken"

---

### [`domain/architecture.md`](domain/architecture.md)
**System design principles, architectural patterns**

**When to use**:
- Designing systems
- Architecture reviews
- Making design decisions
- Evaluating tradeoffs

**Key concepts**:
- Architecture principles
- Architectural patterns
- Design decisions
- Scalability patterns

**Load automatically when**: "architecture", "design", "system", "scalability"

---

### [`domain/performance.md`](domain/performance.md)
**Performance optimization strategies**

**When to use**:
- Performance issues
- Optimization tasks
- Profiling
- Load testing

**Key concepts**:
- Measure-first approach
- Common performance issues
- Optimization strategies
- Performance monitoring

**Load automatically when**: "slow", "performance", "optimize", "latency"

---

### [`domain/deployment.md`](domain/deployment.md)
**Deployment strategies, DevOps practices**

**When to use**:
- Deployment tasks
- CI/CD setup
- Infrastructure configuration
- Production operations

**Key concepts**:
- Deployment strategies
- CI/CD pipelines
- Infrastructure as Code
- Monitoring & observability

**Load automatically when**: "deploy", "deployment", "CI/CD", "production"

---

## Quality Prompts

Guidelines for ensuring code quality, security, and reliability.

### [`quality/testing-strategy.md`](quality/testing-strategy.md)
**Comprehensive testing practices**

**When to use**:
- Writing tests
- Testing strategy decisions
- Test reviews
- Coverage goals

**Key concepts**:
- Testing pyramid
- Test types (unit, integration, E2E)
- Testing best practices
- Test patterns

**Load automatically when**: writing tests, "/test" command, test files

---

### [`quality/security-practices.md`](quality/security-practices.md)
**Security guidelines and vulnerability prevention**

**When to use**:
- Security reviews
- Handling user input
- Authentication/authorization
- Security audits

**Key concepts**:
- OWASP Top 10
- Input validation
- Authentication/authorization
- Security headers

**Load automatically when**: "security", auth code, user input handling, "/security" command

---

### [`quality/code-review.md`](quality/code-review.md)
**Code review best practices**

**When to use**:
- Reviewing code
- PR reviews
- Code quality checks
- Providing feedback

**Key concepts**:
- Review checklist
- Common code smells
- Constructive feedback
- Review anti-patterns

**Load automatically when**: code review requests, PR reviews, "/refactor" command

---

## Auto-Loading Reference

### By Task Type

| Task Keywords | Auto-Load Prompts |
|--------------|-------------------|
| "agent", "workflow", "autonomous" | `core/agentic-patterns.md` |
| "tool", "function", "API" | `core/tool-engineering.md` |
| "simple", "complex", "architecture decision" | `core/complexity-management.md` |
| Feature development, coding | `domain/coding-tasks.md` |
| "bug", "debug", "fix", "error" | `domain/debugging.md` |
| "architecture", "design", "system" | `domain/architecture.md` |
| "slow", "performance", "optimize" | `domain/performance.md` |
| "deploy", "CI/CD", "production" | `domain/deployment.md` |
| Writing tests, test files | `quality/testing-strategy.md` |
| "security", auth, user input | `quality/security-practices.md` |
| Code review, PR review | `quality/code-review.md` |

### Always Active

These prompts are ALWAYS applied:
- `core/execution-principles.md` (mandatory performance rules)
- `core/automation-rules.md` (automatic behavior)

### Session Start

These prompts are loaded at session start:
- `core/mcp-integration.md` (MCP discovery)

---

## Usage Examples

### Example 1: Feature Development
```
User: "Add a new user registration form"

Claude automatically loads:
1. core/execution-principles.md (always active)
2. core/automation-rules.md (always active)
3. domain/coding-tasks.md (feature development)
4. quality/testing-strategy.md (should write tests)
5. quality/security-practices.md (user input handling)
```

### Example 2: Bug Investigation
```
User: "The login page is broken"

Claude automatically loads:
1. core/execution-principles.md (always active)
2. core/automation-rules.md (always active)
3. domain/debugging.md (bug investigation)
4. domain/coding-tasks.md (will fix code)
```

### Example 3: Architecture Decision
```
User: "Should we use microservices or monolith?"

Claude automatically loads:
1. core/execution-principles.md (always active)
2. core/complexity-management.md (complexity decision)
3. domain/architecture.md (architecture decision)
```

### Example 4: Performance Issue
```
User: "The dashboard is loading slowly"

Claude automatically loads:
1. core/execution-principles.md (always active)
2. domain/performance.md (performance optimization)
3. domain/debugging.md (investigate bottleneck)
```

---

## Customization

### Adding New Prompts

1. Create new `.md` file in appropriate category:
   - `core/` - Universal principles
   - `domain/` - Task-specific guidelines
   - `quality/` - Quality assurance

2. Follow this structure:
```markdown
# Prompt Title

Brief description of when and why to use this prompt.

## Section 1
Content...

## Section 2
Content...
```

3. Update this INDEX.md with:
   - Prompt description
   - When to use
   - Key concepts
   - Auto-loading keywords

4. Update CLAUDE.md auto-loading table if needed

### Modifying Existing Prompts

- All prompts are markdown files in `.claude/prompts/`
- Edit directly to update guidelines
- Changes take effect immediately
- No need to update multiple places (unlike old CLAUDE.md)

---

## Prompt Development Principles

When creating or updating prompts:

1. **Be specific**: Provide concrete examples
2. **Be actionable**: Give clear guidance
3. **Be concise**: Respect token budgets
4. **Be consistent**: Follow existing patterns
5. **Be modular**: One prompt, one concern

---

## Benefits of Modular Prompts

**vs. Monolithic CLAUDE.md**:
- ✅ **Selective loading**: Only load what's needed
- ✅ **Faster context**: Smaller files load faster
- ✅ **Easier maintenance**: Update one prompt at a time
- ✅ **Better organization**: Clear categorization
- ✅ **Reusability**: Share prompts across projects
- ✅ **Clarity**: Each prompt has focused purpose

**Token efficiency**:
- Old CLAUDE.md: ~800 lines loaded every time
- New system: ~100-300 lines loaded per task (dynamic)

---

## Quick Reference by Role

### For Fullstack Developers
- `domain/coding-tasks.md`
- `domain/debugging.md`
- `quality/testing-strategy.md`
- `quality/code-review.md`

### For Architects
- `core/agentic-patterns.md`
- `core/complexity-management.md`
- `domain/architecture.md`

### For DevOps/SRE
- `domain/deployment.md`
- `domain/performance.md`
- `quality/security-practices.md`

### For Security Engineers
- `quality/security-practices.md`
- `domain/architecture.md`
- `quality/code-review.md`

---

**Last Updated**: 2025-01-13 (Initial modular structure)
