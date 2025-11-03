# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

---

## 🤖 Specialized Agents

**CRITICAL**: Claude automatically engages specialized agents based on task context.

### Agent Auto-Engagement

Claude will automatically use the appropriate agent for your task:

| Task Type                                          | Agent Used              | Expertise                                                                |
| -------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------ |
| Backend development, API design, database          | `backend-engineer`      | REST/GraphQL APIs, authentication, database patterns, error handling     |
| Frontend development, UI components, React/Next.js | `frontend-engineer`     | React patterns, accessibility, performance, state management, Tailwind   |
| Git operations, GitHub workflows, commits, PRs     | `github-expert`         | Branch management, commit guidelines, workflows, merge strategies, PRs   |
| Automated functional testing with Playwright       | `functional-qa-tester`  | Playwright tests, issue detection, auto-fix, data cleanup                |
| UI/UX quality assurance, accessibility             | `ui-qa-tester`          | Visual consistency, responsive design, WCAG compliance, UX quality       |
| System architecture, design patterns               | `architecture-optimizer` | Architecture design, complexity management, scalability                  |

Each agent has comprehensive built-in knowledge and best practices for their domain.

---

## ⚡ Core Principles (Always Active)

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

3. **Customize agents** in `@.claude/agents/` if needed

   - Each agent has built-in best practices and guidelines
   - Modify agent instructions to match your team's preferences
   - Add project-specific patterns or conventions

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

Claude works autonomously to provide the best assistance:

- Automatically engages specialized agents based on task context
- Uses commands and workflows proactively when appropriate
- Applies domain-specific best practices through agent knowledge
- Runs independent operations in parallel for efficiency
- Briefly informs you of actions taken

---

## 🔌 MCP Server Integration

Claude integrates seamlessly with MCP (Model Context Protocol) servers:

- Automatically discovers MCP servers from `@.mcp.json` at session start
- Uses MCP tools proactively when they match task context
- Gracefully falls back to default tools if MCP unavailable
- Combines MCP usage with agents, commands, and workflows

---

## 🔗 Integration with .claude Directory

This CLAUDE.md works together with the `@.claude/` configuration:

### Division of Responsibility

| CLAUDE.md               | @.claude/agents/                          | @.claude/ (other)           |
| ----------------------- | ----------------------------------------- | --------------------------- |
| Project-specific config | Domain expertise & best practices         | Commands, workflows         |
| Agent engagement rules  | Built-in guidelines for each domain       | Tool definitions            |
| Project architecture    | Backend, frontend, Git, QA knowledge      | Settings                    |
| Team conventions        | Architecture patterns & quality standards | -                           |
| This project only       | Reusable across projects                  | Project-agnostic            |

### Structure

```
.claude/
├── agents/                          # Specialized agents with built-in expertise
│   ├── backend-engineer.md          # Backend development best practices
│   ├── frontend-engineer.md         # Frontend/React/Next.js patterns
│   ├── github-expert.md             # Git/GitHub workflows
│   ├── functional-qa-tester.md      # Playwright-based functional testing
│   ├── ui-qa-tester.md              # UI/UX quality assurance
│   ├── architecture-optimizer.md    # System architecture & design
│   └── react-hook-form-specialist.md # Form implementation patterns
├── commands/                        # Slash commands
│   ├── git/commit.md                # Git commit helper
│   ├── command/create.md            # Create new commands
│   ├── agents/create.md             # Create new agents
│   ├── skills/create.md             # Create new skills
│   ├── qa/functional-test.md        # Run functional tests
│   └── ui/figma-ui.md               # Generate UI from Figma
├── workflows/                       # Structured workflows
└── settings.json                    # Configuration
```

---

## 📝 Quick Start for New Projects

1. **Copy `@.claude/` directory** to your new project
2. **Copy `CLAUDE.md`** to your new project
3. **Update "Project-Specific Configuration"** section in CLAUDE.md
4. **Optionally customize agents** in `@.claude/agents/` to match your team's needs
5. **Commit both** to version control

**That's it!** Claude will automatically:

- Engage specialized agents based on task context
- Use commands and workflows when appropriate
- Discover and use MCP servers
- Apply domain-specific best practices

---

## 🚀 Usage Tips

### For Maximum Effectiveness

**Let Claude work autonomously**:

- You don't need to explicitly mention agents or commands
- Claude will automatically apply domain-specific best practices
- Focus on describing what you want, not how to do it

**Examples**:

```
❌ "Use the backend-engineer agent to build this API"
✅ "Build a REST API for user authentication"
   → Claude automatically engages backend-engineer agent

❌ "Use the github-expert to help with git"
✅ "Help me resolve this merge conflict"
   → Claude automatically engages github-expert agent

❌ "Use the frontend-engineer agent for this component"
✅ "Build a responsive contact form with validation"
   → Claude automatically engages frontend-engineer agent
```

### Trust the System

- **Agent engagement works**: Specialized agents activate based on task context
- **Parallel execution happens**: Independent operations run simultaneously
- **Best practices applied**: Domain expertise built into each agent
- **Quality standards maintained**: Agents follow industry best practices

---

## 📚 Learning More

To understand the system better, explore these directories:

- **Agents**: `@.claude/agents/` - View specialized agent definitions and their built-in expertise
  - `backend-engineer.md` - Backend development patterns and best practices
  - `frontend-engineer.md` - React, Next.js, and frontend guidelines
  - `github-expert.md` - Git workflows and GitHub best practices
  - `functional-qa-tester.md` - Automated testing with Playwright
  - `ui-qa-tester.md` - UI/UX quality assurance standards
- **Commands**: `@.claude/commands/` - Discover available slash commands
  - `/git:commit` - Smart commit helper
  - `/command:create` - Create new commands
  - `/agents:create` - Create new agents
  - `/qa:functional-test` - Run automated tests
- **Workflows**: `@.claude/workflows/` - Structured multi-step processes

---

## 🎯 Design Philosophy

**This configuration follows Anthropic's "Building Effective Agents" principles**:

1. **Simplicity first**: Start simple, add complexity only when needed
2. **Specialized agents**: Each agent has focused, domain-specific expertise
3. **Parallel execution**: Maximum performance by default
4. **Autonomous operation**: Agents proactively apply best practices
5. **Clear boundaries**: Tools, agents, commands, and workflows are well-defined
6. **Maintainable**: Easy to update, extend, and customize

**Benefits**:

- **Self-contained agents**: All best practices built into each agent
- **Better organization**: Clear separation of concerns by domain
- **Easy maintenance**: Update one agent without affecting others
- **Reusable**: Share agents across projects
- **Scalable**: Add new agents as needed
- **Token efficient**: No need to load external prompt files

---

**Remember**:

- **Agents** automatically engage based on task context
- All **domain expertise** is built into specialized agents
- **Project-specific config** goes in CLAUDE.md
- **Universal best practices** are embedded in each agent

**This design maximizes Claude's effectiveness while keeping configuration simple and maintainable.**
