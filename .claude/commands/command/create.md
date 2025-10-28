---
description: 새로운 Claude Code 커맨드를 에이전트, 프롬프트, 스킬과 함께 생성합니다.
model: sonnet
argument-hint: <description>
---

예시: 데이터베이스 마이그레이션을 도와주는 커맨드를 만들어줘

**Command Description**: $1

Create a comprehensive Claude Code command system based on the description above. This includes:

1. **Agent**: A specialized agent that handles this specific task
2. **Prompt**: Supporting documentation in `.claude/prompts/` for best practices
3. **Skill**: A discoverable skill that Claude can invoke autonomously

# Command Creation Workflow

## Step 1: Analysis

Analyze the command description and determine:

- **Purpose**: What problem does this solve?
- **Category**: Which category does this belong to? (front-end, back-end, QA, devops, data, ai-ml, etc.)
- **Name**: Create a kebab-case name (e.g., `database-migrator`, `api-tester`)
- **Scope**: What specific tasks should this handle?
- **Context**: When should Claude use this?

## Step 2: Create Agent

Create an agent file at `.claude/agents/[name].md` with:

```markdown
---
name: [agent-name]
description: [Clear description of when to use this agent with 2-3 examples]
model: sonnet
color: [purple|blue|green|orange|red|yellow]
---

You are a specialized expert in [domain]. Your mission is to [primary goal].

## Core Responsibilities

1. **[Responsibility 1]**: [Description]
2. **[Responsibility 2]**: [Description]
3. **[Responsibility 3]**: [Description]

## Process

When activated, follow this process:

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Guidelines

- [Guideline 1]
- [Guideline 2]
- [Guideline 3]

## Output Format

[Expected output format]

## Quality Assurance

Before completing:
- [Check 1]
- [Check 2]
- [Check 3]

## Edge Cases

- **[Edge case 1]**: [How to handle]
- **[Edge case 2]**: [How to handle]

[Additional agent-specific instructions]
```

**Agent Template Guidelines**:

- **name**: kebab-case, descriptive
- **description**: Include when to use + 2-3 concrete examples with context
- **model**: Use `sonnet` for most tasks, `haiku` for simple/fast tasks, `opus` for complex reasoning
- **color**: Visual identifier (purple=architecture, blue=backend, green=frontend, orange=qa, red=security, yellow=data)

## Step 3: Create Prompt Document

Create a prompt file at `.claude/prompts/[category]/[name].md` with:

```markdown
# [Task Name] Best Practices

## Purpose

[Explain the purpose of this prompt and when it should be loaded]

## Core Principles

1. **[Principle 1]**
   - [Description]
   - [Why it matters]

2. **[Principle 2]**
   - [Description]
   - [Why it matters]

3. **[Principle 3]**
   - [Description]
   - [Why it matters]

## Process

### 1. [Phase 1 Name]

[Detailed steps for phase 1]

### 2. [Phase 2 Name]

[Detailed steps for phase 2]

### 3. [Phase 3 Name]

[Detailed steps for phase 3]

## Best Practices

### [Category 1]

- ✅ **Do**: [Good practice]
- ❌ **Don't**: [Anti-pattern]

### [Category 2]

- ✅ **Do**: [Good practice]
- ❌ **Don't**: [Anti-pattern]

## Common Patterns

### Pattern 1: [Pattern Name]

**When to use**: [Context]

**Implementation**:
\`\`\`[language]
[Code example]
\`\`\`

**Why it works**: [Explanation]

### Pattern 2: [Pattern Name]

[Similar structure]

## Anti-Patterns to Avoid

1. **[Anti-pattern 1]**
   - **Problem**: [What's wrong]
   - **Solution**: [How to fix]

2. **[Anti-pattern 2]**
   - **Problem**: [What's wrong]
   - **Solution**: [How to fix]

## Checklist

Before completing the task:

- [ ] [Check 1]
- [ ] [Check 2]
- [ ] [Check 3]
- [ ] [Check 4]

## Examples

### Example 1: [Scenario]

**Context**: [Situation]

**Approach**:
\`\`\`[language]
[Code or implementation]
\`\`\`

**Outcome**: [Result and why it's good]

### Example 2: [Scenario]

[Similar structure]

## References

- [Related prompt 1]: \`@.claude/prompts/[category]/[file].md\`
- [Related prompt 2]: \`@.claude/prompts/[category]/[file].md\`

## Auto-Loading

This prompt is automatically loaded when task keywords include:
- "[keyword 1]"
- "[keyword 2]"
- "[keyword 3]"
```

**Prompt Categories**:

- `core/` - Universal principles (execution, agentic patterns, tool engineering, complexity, automation, MCP)
- `domain/` - Task-specific (coding, debugging, architecture, performance, deployment)
- `quality/` - Quality assurance (testing, security, code review)
- `git/` - Version control (commits, branches, PRs, workflow, merges)
- `front-end/` - Frontend development (components, state, styling, performance, accessibility)
- `back-end/` - Backend development (API, auth, database, error handling, performance)
- `devops/` - DevOps practices (deployment, CI/CD, monitoring, infrastructure)
- `data/` - Data engineering (pipelines, processing, analysis, warehousing)
- `ai-ml/` - AI/ML (models, training, evaluation, deployment)
- `QA/` - Quality assurance (testing, automation, documentation)

## Step 4: Create Skill

Use the `/skills:create` command to create the skill:

```bash
/skills:create [Description based on the original command description, with specific focus on when Claude should invoke this skill and what it should do]
```

The skill description should include:
- What the skill does
- When Claude should use it (trigger keywords)
- What specific actions it performs

## Step 5: Update CLAUDE.md (if needed)

If this is a new category or requires special auto-loading rules, update the Auto-Loading Rules table in `CLAUDE.md`:

```markdown
| "[keyword]", "[keyword2]" | \`@.claude/prompts/[category]/[name].md\` |
```

## Step 6: Verification

After creating all components, verify:

1. **Agent file exists**: `.claude/agents/[name].md`
   - Valid YAML frontmatter
   - Clear description with examples
   - Comprehensive agent instructions

2. **Prompt file exists**: `.claude/prompts/[category]/[name].md`
   - Organized in correct category
   - Follows best practices template
   - Includes concrete examples

3. **Skill created**: Check output from `/skills:create`
   - SKILL.md has proper frontmatter
   - Description includes trigger keywords
   - Instructions are clear and actionable

4. **Integration**: Ensure all three components work together:
   - Agent references the prompt document
   - Skill can invoke the agent
   - Prompt provides detailed guidelines

## Output

After creation, provide:

```markdown
## ✅ Command System Created

### 📁 Files Created

1. **Agent**: \`.claude/agents/[name].md\`
   - Purpose: [Brief description]
   - Color: [color]

2. **Prompt**: \`.claude/prompts/[category]/[name].md\`
   - Category: [category]
   - Auto-loads on: [keywords]

3. **Skill**: \`.claude/skills/[name]/SKILL.md\`
   - Trigger: [when to use]

### 🚀 Usage

**Autonomous**: Claude will automatically use this when you mention [trigger keywords]

**Explicit**: You can also use:
- \`/[command-name]\` (if slash command created)
- Directly mention the skill by name
- Invoke the agent via Task tool

### 📝 Next Steps

1. Test the command by mentioning: "[example trigger phrase]"
2. Review and customize the prompt if needed
3. Share with team via git commit

### 🔗 Integration

- Agent references: \`@.claude/prompts/[category]/[name].md\`
- Auto-loading keywords: [list]
```

## Quality Standards

### Agent Quality

- [ ] Clear, specific name
- [ ] Description includes when to use + 2-3 examples
- [ ] Core responsibilities well-defined
- [ ] Process is step-by-step
- [ ] Guidelines are actionable
- [ ] Edge cases considered

### Prompt Quality

- [ ] Organized by category
- [ ] Core principles clearly stated
- [ ] Process broken into phases
- [ ] Best practices with do/don't
- [ ] Common patterns with examples
- [ ] Anti-patterns identified
- [ ] Checklist for completion
- [ ] Concrete code examples
- [ ] Auto-loading keywords listed

### Skill Quality

- [ ] Name is descriptive (kebab-case)
- [ ] Description includes what AND when
- [ ] Instructions are step-by-step
- [ ] Examples are concrete
- [ ] Best practices included
- [ ] Error handling addressed

### Integration Quality

- [ ] Agent references relevant prompts
- [ ] Skill can invoke agent
- [ ] Prompt provides detailed guidance
- [ ] Auto-loading rules configured
- [ ] All components work together

## Implementation

Now create the command system based on the description provided. Follow all steps and ensure high quality for each component.

**Remember**:
- Choose appropriate category for prompt
- Use descriptive, trigger-rich descriptions
- Include concrete examples
- Ensure all three components (agent, prompt, skill) work together
- Test by mentioning trigger keywords

Execute this workflow autonomously and report completion with the output template above.
