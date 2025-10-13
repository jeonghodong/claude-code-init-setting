# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

---

## 🧠 Context-Aware Prompt System

**CRITICAL**: Claude automatically loads relevant prompts from `.claude/prompts/` based on task context.

### Auto-Loading Rules

**Before ANY task, read relevant prompts in parallel:**

| Task Keywords | Load Prompts |
|--------------|-------------|
| ANY task (always) | `prompts/core/execution-principles.md` (mandatory)<br>`prompts/core/automation-rules.md` (mandatory) |
| Session start | `prompts/core/mcp-integration.md` |
| "agent", "workflow", "autonomous" | `prompts/core/agentic-patterns.md` |
| "tool", "function", "API design" | `prompts/core/tool-engineering.md` |
| "architecture", "complexity", "should I use" | `prompts/core/complexity-management.md` |
| Feature development, coding | `prompts/domain/coding-tasks.md` |
| "bug", "debug", "fix", "error", "broken" | `prompts/domain/debugging.md` |
| "architecture", "design", "system", "scalability" | `prompts/domain/architecture.md` |
| "slow", "performance", "optimize", "latency" | `prompts/domain/performance.md` |
| "deploy", "CI/CD", "production", "infrastructure" | `prompts/domain/deployment.md` |
| Writing tests, test files, `/test` | `prompts/quality/testing-strategy.md` |
| "security", auth code, user input, `/security` | `prompts/quality/security-practices.md` |
| Code review, PR review, `/refactor` | `prompts/quality/code-review.md` |

**Index**: See `.claude/prompts/INDEX.md` for complete prompt documentation.

### Manual Reference Syntax

To explicitly load a prompt during conversation:
```
"Follow the guidelines in prompts/core/agentic-patterns.md"
"Apply prompts/quality/testing-strategy.md principles"
```

---

## ⚡ Core Principles (Always Active)

**Detailed guidelines**: See `prompts/core/execution-principles.md`

### Parallel Execution - MANDATORY

**CRITICAL**: Execute independent operations in parallel using multiple tool calls in a single message.

**Examples**:
```
✅ CORRECT: Single message with parallel tool calls
- Read: file1.ts, file2.ts, file3.ts (simultaneously)
- Run: git status, git diff, git log (simultaneously)
- Execute: npm run lint, npm run type-check, npm test (simultaneously)

❌ WRONG: Sequential messages
- Message 1: Read file1.ts → wait
- Message 2: Read file2.ts → wait
- Message 3: Read file3.ts → wait
```

**When NOT to use parallel**:
- Operations depend on each other (A needs result from B)
- Sequential workflows (git add → commit → push)
- One result determines next action

### Tool Selection Priority

1. Use specialized tools over bash commands
2. Read/Edit/Write tools for file operations
3. Bash only for actual system commands
4. Never use bash echo to communicate with users

---

## 📋 Project-Specific Configuration

### Project Type
<!-- CUSTOMIZATION: Update this section for your project -->
This is a personal portfolio website built with Next.js 15.5.4, React 19, TypeScript, and Tailwind CSS v4.

### Development Commands
<!-- CUSTOMIZATION: Add your project's commands -->
- `npm run dev` - Start development server with Turbopack (default port: 3000)
- `npm run build` - Build production bundle with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with Next.js config

### Architecture
<!-- CUSTOMIZATION: Describe your project structure -->

#### App Router Structure
- Uses Next.js App Router (app directory)
- Root layout in `app/layout.tsx` - handles global metadata, fonts (Geist Sans/Mono), and HTML structure
- Main page at `app/page.tsx`
- Global styles in `app/globals.css` with Tailwind directives

#### TypeScript Configuration
- Path alias: `@/*` maps to project root
- Strict mode enabled
- Module resolution: bundler
- Target: ES2017

#### Styling
- Tailwind CSS v4 with PostCSS
- CSS variables for theming (foreground, background)
- Dark mode support via CSS classes
- Geist font family (sans and mono variants)

#### ESLint
- Uses flat config format (eslint.config.mjs)
- Extends Next.js core-web-vitals and TypeScript rules
- Ignores: node_modules, .next, out, build, next-env.d.ts

---

## 🎨 Customization Guide

This CLAUDE.md file is designed to be easily customized for any project.

### How to Customize for Your Project

1. **Update "Project-Specific Configuration" section** (above)
   - Project type and tech stack
   - Development commands
   - Architecture and folder structure

2. **Add project-specific rules** (if needed)
   ```markdown
   ### Special Instructions
   - Always use X pattern for Y
   - Never do Z because of A
   - Run tests before committing
   ```

3. **Modify prompts** in `.claude/prompts/` for universal guidelines
   - `core/` - Principles that apply to all tasks
   - `domain/` - Task-specific guidelines
   - `quality/` - Quality assurance practices

4. **Keep auto-loading rules updated** (if you add new prompts)

### Customization Examples by Project Type

#### For Backend API:
```markdown
### API Structure
- REST endpoints in `/api/routes`
- Controllers in `/api/controllers`
- Database models in `/models`

### Database
- PostgreSQL with Prisma ORM
- Run: `npm run db:migrate`
```

#### For Mobile App:
```markdown
### Mobile Structure
- React Native with Expo
- Screens in `/src/screens`
- Components in `/src/components`

### Testing
- Run: `npm run test:ios` or `npm run test:android`
```

---

## 🤖 Autonomous Behavior

**Detailed guidelines**: See `prompts/core/automation-rules.md`

**Summary**:
- Claude automatically uses agents, commands, and workflows based on task context
- No explicit user request needed for automation
- Claude proactively applies best practices from `.claude/prompts/`
- Always runs independent operations in parallel
- Briefly informs user of actions taken

---

## 🔌 MCP Server Integration

**Detailed guidelines**: See `prompts/core/mcp-integration.md`

**Summary**:
- Claude automatically discovers MCP servers from `.mcp.json` at session start
- MCP tools used proactively when they match task context
- Graceful fallback to default tools if MCP unavailable
- MCP usage combined with agents, commands, and workflows

---

## 🔗 Integration with .claude Directory

This CLAUDE.md works together with the `.claude/` configuration:

### Division of Responsibility

| CLAUDE.md | .claude/prompts/ | .claude/ (other) |
|-----------|------------------|------------------|
| Project-specific config | Universal best practices | Agents, commands, workflows |
| Auto-loading rules | Detailed guidelines | Tool definitions |
| Project architecture | Industry standards | Settings |
| Team conventions | Reusable patterns | - |
| This project only | Shareable across projects | Project-agnostic |

### Structure

```
.claude/
├── prompts/
│   ├── INDEX.md              # Prompt documentation
│   ├── core/                 # Universal principles
│   │   ├── execution-principles.md
│   │   ├── agentic-patterns.md
│   │   ├── tool-engineering.md
│   │   ├── complexity-management.md
│   │   ├── automation-rules.md
│   │   └── mcp-integration.md
│   ├── domain/               # Task-specific guidelines
│   │   ├── coding-tasks.md
│   │   ├── debugging.md
│   │   ├── architecture.md
│   │   ├── performance.md
│   │   └── deployment.md
│   └── quality/              # Quality assurance
│       ├── testing-strategy.md
│       ├── security-practices.md
│       └── code-review.md
├── agents/                   # Specialized agents
├── commands/                 # Slash commands
├── workflows/                # Structured workflows
└── settings.json             # Configuration
```

---

## 📝 Quick Start for New Projects

1. **Copy `.claude/` directory** to your new project
2. **Copy `CLAUDE.md`** to your new project
3. **Update "Project-Specific Configuration"** section in CLAUDE.md
4. **Optionally customize prompts** in `.claude/prompts/`
5. **Commit both** to version control

**That's it!** Claude will automatically:
- Load relevant prompts based on task
- Use agents, commands, and workflows
- Discover and use MCP servers
- Follow all best practices

---

## 🚀 Usage Tips

### For Maximum Effectiveness

**Let Claude work autonomously**:
- You don't need to explicitly mention agents, commands, or prompts
- Claude will automatically apply the right guidelines
- Focus on describing what you want, not how to do it

**Examples**:
```
❌ "Use the debugging workflow to fix this"
✅ "This feature is broken, can you fix it?"
   → Claude automatically loads prompts/domain/debugging.md

❌ "Read the coding best practices and implement this"
✅ "Add a user authentication system"
   → Claude automatically loads relevant prompts

❌ "Use the fullstack-developer agent"
✅ "Build a contact form with validation"
   → Claude automatically engages appropriate agent
```

### Trust the System

- **Auto-loading works**: Prompts load based on keywords
- **Parallel execution happens**: Independent operations run simultaneously
- **Quality checks applied**: Testing, security, code review guidelines followed
- **Agents engaged**: Specialized expertise used when needed

---

## 📚 Learning More

- **Prompt Index**: `.claude/prompts/INDEX.md` - All prompts with descriptions
- **Core Principles**: `.claude/prompts/core/` - Universal guidelines
- **Task Guidelines**: `.claude/prompts/domain/` - Specific task patterns
- **Quality Practices**: `.claude/prompts/quality/` - Ensuring quality
- **Agents**: `.claude/agents/` - Specialized agent definitions
- **Commands**: `.claude/commands/` - Available slash commands
- **Workflows**: `.claude/workflows/` - Structured processes

---

## 🎯 Design Philosophy

**This configuration follows Anthropic's "Building Effective Agents" principles**:

1. **Simplicity first**: Start simple, add complexity only when needed
2. **Modular prompts**: Load only what's relevant (token efficiency)
3. **Parallel execution**: Maximum performance by default
4. **Autonomous operation**: Claude proactively applies best practices
5. **Clear boundaries**: Tools, agents, prompts, and workflows are well-defined
6. **Maintainable**: Easy to update, extend, and customize

**Benefits**:
- **~70% smaller** than monolithic CLAUDE.md (800 lines → 250 lines)
- **Faster context loading**: Only relevant prompts loaded
- **Better organization**: Clear categorization
- **Easy maintenance**: Update one prompt without affecting others
- **Reusable**: Share prompts across projects
- **Scalable**: Add new prompts without cluttering main file

---

**Remember**:
- The **Auto-Loading Rules** section is the key to this system
- All **detailed guidelines** live in `.claude/prompts/`
- **Project-specific config** goes in this file
- **Universal best practices** go in `.claude/prompts/`

**This design maximizes Claude's effectiveness while minimizing token usage and maintenance burden.**
