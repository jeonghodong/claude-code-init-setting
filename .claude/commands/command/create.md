---
description: 새로운 Claude Code 커맨드를 생성합니다.
model: sonnet
argument-hint: <command-name> <description>
---

예시: /command:create deploy "배포를 자동화하는 커맨드"

**Command Name**: $1
**Command Description**: $2

Create a new Claude Code slash command based on the information above.

# Command Creation Workflow

## Step 1: Analysis

Analyze the command request and determine:

- **Name**: Validate or create kebab-case name (e.g., `deploy`, `api-test`, `database-migrate`)
- **Category**: Which category does this belong to? (git, qa, ui, backend, devops, etc.)
- **Purpose**: What problem does this solve?
- **Scope**: What specific tasks should this command handle?
- **Arguments**: Does it need arguments? What should the argument-hint be?
- **Model**: Which model to use? (sonnet for most, haiku for simple, opus for complex)

## Step 2: Create Command Structure

Determine the directory structure:
- Category command: `.claude/commands/[category]/[name].md`
- Root command: `.claude/commands/[name].md`

Examples:
- `/git:commit` → `.claude/commands/git/commit.md`
- `/deploy` → `.claude/commands/deploy.md`
- `/qa:functional-test` → `.claude/commands/qa/functional-test.md`

## Step 3: Create Command File

Create the command file with proper frontmatter and instructions:

```markdown
---
description: [Clear, concise description of what this command does]
model: [sonnet|haiku|opus]
argument-hint: [<arg1> <arg2>] (if needed, otherwise omit)
---

[Optional: Usage examples]

**[Argument Name]**: $1
**[Argument Name 2]**: $2 (if applicable)

[Main command instructions - what Claude should do when this command is invoked]

# Process

## Step 1: [First Action]

[Detailed instructions for first step]

## Step 2: [Second Action]

[Detailed instructions for second step]

## Step 3: [Third Action]

[Detailed instructions for third step]

# Guidelines

- [Guideline 1]
- [Guideline 2]
- [Guideline 3]

# Quality Checks

Before completing:
- [ ] [Check 1]
- [ ] [Check 2]
- [ ] [Check 3]

# Output Format

[Expected output or summary format]
```

## Step 4: Frontmatter Guidelines

**Required fields**:
- `description`: One-line description (shown in `/list` and auto-complete)
- `model`: Choose based on complexity:
  - `haiku`: Simple, fast tasks (file operations, simple searches)
  - `sonnet`: Most tasks (analysis, code generation, workflows)
  - `opus`: Complex reasoning (architecture decisions, complex debugging)

**Optional fields**:
- `argument-hint`: Shows expected arguments (e.g., `<url>`, `<file-path> <description>`)

## Step 5: Writing Effective Instructions

**Good command instructions**:
- Start with clear objective
- Break down into numbered steps
- Include specific examples
- Specify expected output format
- Add quality checks
- Reference relevant files/patterns if needed

**Example patterns**:

```markdown
# Simple command (no arguments)
Run tests and report results in a clear format.

# Command with arguments
**Target File**: $1

Analyze the file and provide optimization suggestions.

# Command with multiple arguments
**Source**: $1
**Destination**: $2

Copy and transform the content from source to destination.
```

## Step 6: Verification

After creating the command file, verify:

1. **File location**: Correct category and naming
   - File: `.claude/commands/[category]/[name].md`
   - Usage: `/[category]:[name]` or `/[name]`

2. **Frontmatter**: Valid YAML syntax
   - description: Clear and concise
   - model: Appropriate choice
   - argument-hint: Matches actual arguments (if applicable)

3. **Instructions**: Clear and actionable
   - Well-structured steps
   - Specific guidance
   - Quality checks included

4. **Test**: Try running the command
   - Verify it appears in `/list`
   - Check argument parsing
   - Ensure instructions are clear

## Output

After creation, provide:

```markdown
## ✅ Command Created

### 📁 File Created
- **Path**: \`.claude/commands/[category]/[name].md\`
- **Usage**: \`/[category]:[name]\` or \`/[name]\`
- **Model**: [model]
- **Arguments**: [argument-hint or "None"]

### 📝 Description
[Command description]

### 🚀 Usage Example
\`\`\`bash
/[command-name] [example arguments]
\`\`\`

### 🧪 Testing
Try running: \`/[command-name] [example args]\`

### 📚 Next Steps
1. Test the command with different inputs
2. Refine instructions if needed
3. Add to documentation if it's for team use
4. Commit to git: \`git add .claude/commands/[category]/[name].md\`
```

## Quality Standards

### Command File Quality
- [ ] File in correct location (category folder or root)
- [ ] Valid YAML frontmatter
- [ ] Clear, concise description
- [ ] Appropriate model selection
- [ ] Correct argument-hint (if applicable)

### Instruction Quality
- [ ] Clear objective stated upfront
- [ ] Steps are numbered and specific
- [ ] Examples provided where helpful
- [ ] Quality checks included
- [ ] Output format specified
- [ ] Edge cases considered

### Naming Quality
- [ ] Follows kebab-case convention
- [ ] Descriptive and intuitive
- [ ] Consistent with existing commands
- [ ] Category placement makes sense

## Implementation

Now create the command based on the name and description provided. Follow all steps and ensure high quality.

**Remember**:
- Choose appropriate category and location
- Write clear, actionable instructions
- Include concrete examples
- Test the command after creation
- Keep it focused on one specific task

Execute this workflow autonomously and report completion with the output template above.
