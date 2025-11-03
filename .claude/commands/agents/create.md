---
description: È\´ Claude Code Ðt¸| Ý1iÈä.
model: sonnet
argument-hint: <agent-name> <description>
---

Ü: /agents:create code-reviewer "TÜ ¬ð| ‰X” Ðt¸"

**Agent Name**: $1
**Agent Description**: $2

Create a new Claude Code agent based on the information above.

# Agent Creation Workflow

## Step 1: Analysis

Analyze the agent request and determine:

- **Name**: Validate or create kebab-case name (e.g., `code-reviewer`, `api-tester`, `security-auditor`)
- **Category/Domain**: What domain does this agent specialize in? (frontend, backend, QA, security, devops, architecture, etc.)
- **Purpose**: What specific problem does this agent solve?
- **Expertise**: What specialized knowledge should this agent have?
- **Model**: Which model to use?
  - `haiku`: Simple, fast tasks (file operations, simple searches)
  - `sonnet`: Most tasks (analysis, code generation, reviews)
  - `opus`: Complex reasoning (architecture decisions, complex debugging)
- **Color**: Visual identifier
  - `purple`: Architecture, system design
  - `blue`: Backend, API, database
  - `green`: Frontend, UI/UX
  - `orange`: QA, testing
  - `red`: Security, critical systems
  - `yellow`: Data, analytics, AI/ML

## Step 2: Define Agent Scope

Determine what the agent should handle:

### Core Responsibilities
- Primary task 1
- Primary task 2
- Primary task 3

### When to Use This Agent
Define trigger scenarios with concrete examples:
- **Scenario 1**: [Context] ’ [When agent should activate]
- **Scenario 2**: [Context] ’ [When agent should activate]
- **Scenario 3**: [Context] ’ [When agent should activate]

### What This Agent Should NOT Do
Define clear boundaries to avoid scope creep.

## Step 3: Create Agent File

Create the agent file at `.claude/agents/[name].md` with the following structure:

```markdown
---
name: [agent-name]
description: [Clear description of when to use this agent, including 2-3 concrete examples with user context]
model: [sonnet|haiku|opus]
color: [purple|blue|green|orange|red|yellow]
---

You are a specialized expert in [domain]. Your mission is to [primary goal].

## Core Responsibilities

1. **[Responsibility 1]**: [Description of what this involves]
2. **[Responsibility 2]**: [Description of what this involves]
3. **[Responsibility 3]**: [Description of what this involves]

## When to Engage

This agent should be proactively used when:
- [Trigger condition 1]
- [Trigger condition 2]
- [Trigger condition 3]

## Process

When activated, follow this systematic process:

### 1. [Phase 1: Assessment/Analysis]

[Detailed steps for initial assessment]
- Sub-step 1
- Sub-step 2
- Sub-step 3

### 2. [Phase 2: Planning/Design]

[Detailed steps for planning phase]
- Sub-step 1
- Sub-step 2
- Sub-step 3

### 3. [Phase 3: Execution/Implementation]

[Detailed steps for execution phase]
- Sub-step 1
- Sub-step 2
- Sub-step 3

### 4. [Phase 4: Verification/Review]

[Detailed steps for verification]
- Sub-step 1
- Sub-step 2
- Sub-step 3

## Guidelines

### Do's 
- [Guideline 1: What to do and why]
- [Guideline 2: What to do and why]
- [Guideline 3: What to do and why]

### Don'ts L
- [Anti-pattern 1: What to avoid and why]
- [Anti-pattern 2: What to avoid and why]
- [Anti-pattern 3: What to avoid and why]

## Output Format

Provide results in the following format:

\`\`\`markdown
## [Task Name]

### Summary
[Brief overview of what was done]

### Details
[Detailed findings, changes, or recommendations]

### Recommendations
[Actionable next steps or improvements]

### Files Modified/Analyzed
- file1.ts:123
- file2.ts:456
\`\`\`

## Quality Assurance

Before completing, verify:
- [ ] [Quality check 1]
- [ ] [Quality check 2]
- [ ] [Quality check 3]
- [ ] [Quality check 4]

## Edge Cases

Handle these scenarios appropriately:

### [Edge Case 1]
- **When it occurs**: [Condition]
- **How to handle**: [Approach]

### [Edge Case 2]
- **When it occurs**: [Condition]
- **How to handle**: [Approach]

## Integration with Prompts

Reference relevant prompt documents for detailed guidelines:
- \`@.claude/prompts/[category]/[relevant-prompt].md\`

## Examples

### Example 1: [Scenario Name]

**User Request**: "[Example user request]"

**Agent Action**:
1. [Step 1 action]
2. [Step 2 action]
3. [Step 3 action]

**Outcome**: [What the agent delivered]

### Example 2: [Scenario Name]

**User Request**: "[Example user request]"

**Agent Action**:
1. [Step 1 action]
2. [Step 2 action]
3. [Step 3 action]

**Outcome**: [What the agent delivered]
```

## Step 4: Agent Description Best Practices

The `description` field in frontmatter is CRITICAL. It determines when Claude will use this agent.

**Good descriptions include**:
1. **What**: Clear statement of agent's purpose
2. **When**: 2-3 concrete examples with user context
3. **Trigger keywords**: Natural language that users might use

**Example**:
```yaml
description: Use this agent when developing backend systems, APIs, server-side logic, database operations, authentication systems, microservices, or any server-side architecture tasks. This agent is particularly valuable when implementing REST/GraphQL APIs, designing database schemas, handling authentication/authorization, optimizing server performance, or building scalable backend services.

Examples:
- <example>
  user: "I need to create a REST API endpoint for user registration with email verification"
  assistant: "I'm going to use the Task tool to launch the backend-engineer agent to design and implement the user registration API with proper validation, security, and email verification flow."
  </example>
```

## Step 5: Verification

After creating the agent file, verify:

### File Structure
- [ ] File at `.claude/agents/[name].md`
- [ ] Valid YAML frontmatter
- [ ] All required fields present (name, description, model, color)

### Description Quality
- [ ] Clear purpose statement
- [ ] 2-3 concrete examples included
- [ ] Trigger keywords are natural and discoverable
- [ ] Examples show user context ’ agent activation

### Content Quality
- [ ] Core responsibilities clearly defined (3-5 items)
- [ ] Process broken into numbered phases
- [ ] Guidelines include both do's and don'ts
- [ ] Quality checks specified
- [ ] Edge cases considered
- [ ] Output format defined
- [ ] Integration with prompts referenced

### Completeness
- [ ] All sections filled out (no placeholders)
- [ ] Examples are concrete and realistic
- [ ] Instructions are actionable
- [ ] Scope is well-defined (not too broad, not too narrow)

## Step 6: Testing

After creation, test the agent:

1. **Discoverability**: Will Claude find this agent when needed?
   - Review the description for trigger keywords
   - Ensure examples match real user scenarios

2. **Clarity**: Are instructions clear enough?
   - Can the agent execute without ambiguity?
   - Are all phases well-explained?

3. **Scope**: Is the agent's scope appropriate?
   - Not too broad (doing everything)
   - Not too narrow (too specific to be useful)

## Output

After creation, provide:

```markdown
##  Agent Created

### =Á File Created
- **Path**: `.claude/agents/[name].md`
- **Name**: [agent-name]
- **Model**: [model]
- **Color**: [color]
- **Domain**: [domain/category]

### =Ý Description
[Agent description from frontmatter]

### <¯ Core Responsibilities
1. [Responsibility 1]
2. [Responsibility 2]
3. [Responsibility 3]

### =€ When Claude Will Use This Agent

Claude will automatically engage this agent when:
- [Trigger scenario 1]
- [Trigger scenario 2]
- [Trigger scenario 3]

### >ê Testing

Try these phrases to activate the agent:
- "[Example phrase 1]"
- "[Example phrase 2]"
- "[Example phrase 3]"

### =Ú Next Steps

1. Test the agent with example scenarios
2. Refine description if agent isn't being discovered
3. Add complementary prompt document if needed: `.claude/prompts/[category]/[name].md`
4. Consider creating a slash command for explicit invocation
5. Commit to git: `git add .claude/agents/[name].md`

### = Related Files

**Consider creating**:
- Prompt document: `.claude/prompts/[category]/[name].md` (detailed guidelines)
- Slash command: `.claude/commands/[category]/[name].md` (explicit invocation)
- Skill: `.claude/skills/[name]/SKILL.md` (discoverable skill)
```

## Quality Standards

### Naming Quality
- [ ] Follows kebab-case convention
- [ ] Descriptive and intuitive
- [ ] Indicates domain/specialty
- [ ] Not too generic (avoid "helper", "manager")

### Description Quality
- [ ] Includes trigger keywords naturally
- [ ] Has 2-3 concrete examples with user context
- [ ] Examples show: user request ’ agent action
- [ ] Clear when to use vs when NOT to use

### Instruction Quality
- [ ] Process is step-by-step and numbered
- [ ] Each phase has sub-steps
- [ ] Guidelines are specific and actionable
- [ ] Examples are realistic and helpful
- [ ] Output format is clearly defined

### Scope Quality
- [ ] Clear boundaries defined
- [ ] Not overlapping with existing agents
- [ ] Specialized but not too narrow
- [ ] Useful for multiple scenarios

## Implementation

Now create the agent based on the name and description provided. Follow all steps and ensure high quality.

**Remember**:
- Write a **detailed description** with concrete examples
- Define a **clear process** with numbered steps
- Include **both do's and don'ts**
- Provide **realistic examples** of usage
- Define **quality checks** for completion
- Consider **edge cases** the agent might encounter

Execute this workflow autonomously and report completion with the output template above.
