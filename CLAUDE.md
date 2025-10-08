# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

---

## ⚡ Performance & Execution (MANDATORY)

### Parallel Execution - ALWAYS ENABLED
**CRITICAL**: You MUST execute independent operations in parallel by using multiple tool calls in a single message.

#### When to Use Parallel Execution (Always apply these rules):

1. **Multiple File Reads**
   ```
   ✅ CORRECT: Single message with 3 Read tool calls
   ❌ WRONG: 3 separate messages with 1 Read each
   ```

2. **Multiple Searches**
   ```
   ✅ CORRECT: Multiple Grep/Glob calls simultaneously
   ❌ WRONG: Sequential search operations
   ```

3. **Independent Git Operations**
   ```
   ✅ CORRECT: Run git status, git diff, git log in parallel
   ❌ WRONG: One git command at a time
   ```

4. **Testing & Quality Checks**
   ```
   ✅ CORRECT: lint + type-check + test in parallel
   ❌ WRONG: Run lint, wait, then type-check, wait, then test
   ```

5. **Code Analysis**
   ```
   ✅ CORRECT: Read multiple related files at once
   ❌ WRONG: Read one file, analyze, then read next
   ```

#### When NOT to Use Parallel Execution:

- Operations that depend on each other (A needs result from B)
- Sequential workflows (git add → git commit → git push)
- One result determines the next action

#### Example of Correct Parallel Usage:
```
User: "Check the authentication flow"

CORRECT:
- Single message with parallel Read calls:
  - Read: app/api/auth/login.ts
  - Read: app/api/auth/register.ts
  - Read: lib/auth.ts
  - Read: middleware.ts

WRONG:
- Message 1: Read login.ts
- Wait for response
- Message 2: Read register.ts
- Wait for response...
```

**Failure to use parallel execution is a performance bug that must be avoided.**

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

This CLAUDE.md file is designed to be easily customized for any project. Look for `<!-- CUSTOMIZATION: ... -->` comments throughout this file.

### How to Customize for Your Project

1. **Update Project Type** (Line ~48)
   - Replace with your tech stack
   - Examples: "Django REST API", "React + Express", "Flutter mobile app"

2. **Modify Development Commands** (Line ~51)
   - Add your package manager commands (npm/yarn/pnpm/poetry)
   - Include custom scripts from package.json
   - Add deployment commands if needed

3. **Describe Architecture** (Line ~58)
   - Folder structure
   - Key files and their purposes
   - Design patterns used
   - Database schema (if applicable)

4. **Add Project-Specific Rules** (Create new sections)
   ```markdown
   ### Special Instructions
   - Always use X pattern for Y
   - Never do Z because of A
   - Run tests before committing
   ```

5. **Technology-Specific Guidelines**
   ```markdown
   ### API Guidelines
   - All endpoints must have rate limiting
   - Use Zod for validation
   - Return consistent error format
   ```

### Customization Examples by Project Type

#### For Backend API:
```markdown
## API Structure
- REST endpoints in `/api/routes`
- Controllers in `/api/controllers`
- Database models in `/models`
- Middleware in `/middleware`

## Database
- PostgreSQL with Prisma ORM
- Migrations in `/prisma/migrations`
- Run: `npm run db:migrate`
```

#### For Mobile App:
```markdown
## Mobile Structure
- React Native with Expo
- Screens in `/src/screens`
- Components in `/src/components`
- Navigation using React Navigation

## Testing
- Run: `npm run test:ios` or `npm run test:android`
```

#### For Data Pipeline:
```markdown
## Pipeline Structure
- ETL scripts in `/etl`
- Airflow DAGs in `/dags`
- Data models in `/models`

## Running Pipelines
- `airflow dags test pipeline_name`
```

### Template Sections to Add (As Needed):

```markdown
### Environment Variables
<!-- List required env vars and their purpose -->

### Testing Strategy
<!-- Unit, integration, e2e test approaches -->

### Deployment Process
<!-- Steps to deploy to production -->

### Security Considerations
<!-- Auth, permissions, data handling -->

### Performance Requirements
<!-- Benchmarks, optimization goals -->

### Third-Party Integrations
<!-- APIs, services, SDKs used -->
```

---

## 🤖 Autonomous Agent & Command Usage (MANDATORY)

**CRITICAL**: Claude MUST automatically and proactively use all available agents, slash commands, and tools from the `.claude/` directory based on the task context. No explicit user request is required.

### 🔥 Core Automation Principles

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

### Automatic Agent Engagement

Claude should **automatically invoke specialized agents** when the task context matches their expertise:

**Available Agents** (from `.claude/agents/`):
- **architect.md** - Auto-engage for: system design, architecture decisions, tech stack selection, scalability planning
- **fullstack-developer.md** - Auto-engage for: feature development, API implementation, database operations, full-stack tasks
- **devops-sre.md** - Auto-engage for: deployment, CI/CD, Docker, Kubernetes, infrastructure, monitoring
- **data-engineer.md** - Auto-engage for: ETL pipelines, data warehousing, analytics, data modeling
- **security-expert.md** - Auto-engage for: security audits, authentication, authorization, vulnerability scanning, encryption

**Rules for Agent Usage**:
1. **Automatically detect** which agent(s) are needed based on task keywords and context
2. **Invoke agents proactively** without waiting for explicit user request
3. **Use multiple agents** in parallel when task requires multiple specializations
4. **Switch agents** dynamically as the task evolves (e.g., architect → fullstack-developer → devops-sre for feature → implementation → deployment)

**Example**:
```
User: "Add a user authentication system"
Claude:
- Automatically engages security-expert.md for auth design
- Then engages fullstack-developer.md for implementation
- Finally engages devops-sre.md for deployment considerations
```

### Automatic Slash Command Usage

Claude should **automatically execute slash commands** from `.claude/commands/` when relevant to the task:

**Available Commands** (Use freely and automatically):
- `/analyze` - Auto-run when: user asks about code structure, needs architecture overview, starting new project exploration
- `/test` - Auto-run when: implementing features, fixing bugs, before deployment, after refactoring
- `/debug` - Auto-run when: errors occur, unexpected behavior reported, investigating issues
- `/refactor` - Auto-run when: code quality issues detected, complexity warnings, improving maintainability
- `/optimize` - Auto-run when: performance issues mentioned, slow response times, resource optimization needed
- `/security` - Auto-run when: handling auth, dealing with user data, before deployment, security concerns mentioned
- `/deploy` - Auto-run when: user wants to ship code, deployment mentioned, CI/CD setup needed
- `/docs` - Auto-run when: documentation outdated, new features added, complex logic implemented
- `/migrate` - Auto-run when: tech stack changes, framework upgrades, database migrations needed

**Rules for Command Usage**:
1. **Execute commands proactively** based on task context - don't wait for explicit `/command` syntax
2. **Chain commands intelligently** (e.g., `/test` → `/security` → `/deploy` for production readiness)
3. **Run commands in parallel** when independent (e.g., `/test` and `/lint` simultaneously)
4. **Inform user** which command you're running and why (briefly)

**Example**:
```
User: "I just implemented a new API endpoint"
Claude: "I'll run /test to verify it works, /security to check for vulnerabilities, and /docs to update the API documentation"
[Executes these commands automatically]
```

### Automatic Workflow Application

Claude should **automatically follow workflows** from `.claude/workflows/` for structured tasks:

**Available Workflows**:
- **feature-development.md** - Auto-apply for: new features, significant changes
- **debugging.md** - Auto-apply for: bug reports, errors, unexpected behavior
- **code-review.md** - Auto-apply for: code review requests, before deployment, quality checks

**Example**:
```
User: "Build a comment system"
Claude: [Automatically follows feature-development.md workflow]
1. Understand requirements (asks clarifying questions)
2. Design architecture (engages architect agent)
3. Implement code (engages fullstack-developer agent)
4. Write tests (runs /test command)
5. Review and optimize (runs /refactor, /optimize, /security)
```

### Automatic Tool & Prompt Usage

Claude should **leverage all resources** from `.claude/` directory intelligently:

**Prompts** (`.claude/prompts/` - Use as internal guidelines):
- **code-quality.md** - Auto-apply when: writing code, reviewing code, refactoring
- **debugging-guide.md** - Auto-apply when: debugging, investigating errors
- **project-setup.md** - Auto-apply when: initializing new features, setting up infrastructure
- **optimization-strategies.md** - Auto-apply when: performance tuning, resource optimization

**Settings** (`.claude/settings.json` - Always active):
- **Permissions**: All tools allowed except sensitive file access (.env, *.pem, *.key)
- **Environment**: Parallel execution, auto-agents, auto-commands all ENABLED
- **Security**: Automatic denial of secret/credential file access

### Decision Matrix for Autonomous Actions

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

### Important Rules

1. **Be Proactive, Not Reactive**: Don't wait for users to explicitly mention agents/commands - detect needs automatically
2. **Multi-Agent Coordination**: Use multiple agents in parallel when task requires diverse expertise
3. **Command Chaining**: Link commands logically (test → security → deploy)
4. **Context Awareness**: Adapt agent/command selection based on project type (frontend vs backend vs full-stack)
5. **Transparency**: Briefly inform user which agents/commands you're using and why
6. **Flexibility**: Override automatic selections if user explicitly requests different approach

### 🚀 Execution Patterns (Real Examples)

**Pattern 1: Feature Development**
```
User: "Add a contact form"

Claude's Automatic Actions:
1. Read .claude/workflows/feature-development.md
2. Read .claude/prompts/code-quality.md for best practices
3. Use Task tool → fullstack-developer agent:
   - Design form component structure
   - Plan validation schema
   - Identify dependencies
4. Execute /analyze (check existing form patterns)
5. Implement feature (parallel file operations)
6. Execute /test (verify functionality)
7. Execute /security (check input validation)
8. Execute /docs (update documentation)
```

**Pattern 2: Bug Investigation**
```
User: "The login page is broken"

Claude's Automatic Actions:
1. Read .claude/workflows/debugging.md
2. Read .claude/prompts/debugging-guide.md
3. Execute /debug command (starts systematic debugging)
4. Use Task tool → fullstack-developer agent:
   - Reproduce the issue
   - Check error logs
   - Identify root cause
5. Execute /test (run existing tests)
6. Fix bug + Add regression test
7. Execute /test again (verify fix)
```

**Pattern 3: Code Review Request**
```
User: "Review my recent changes"

Claude's Automatic Actions:
1. Read .claude/workflows/code-review.md
2. Read .claude/prompts/code-quality.md
3. Execute bash commands in parallel:
   - git status
   - git diff
   - git log -5
4. Use Task tool → architect agent (review architecture changes)
5. Execute /refactor (suggest improvements)
6. Execute /security (security audit)
7. Execute /test (ensure tests exist)
```

**Pattern 4: Deployment**
```
User: "Deploy to production"

Claude's Automatic Actions:
1. Read .claude/workflows/feature-development.md (Phase 4)
2. Use Task tool → devops-sre agent:
   - Verify deployment checklist
   - Check environment config
3. Execute commands in parallel:
   - /test (all tests pass)
   - /security (security scan)
   - npm run lint (parallel)
   - npm run type-check (parallel)
4. Execute npm run build
5. Execute /deploy command
6. Monitor deployment status
```

**Pattern 5: Performance Optimization**
```
User: "The app is slow"

Claude's Automatic Actions:
1. Read .claude/prompts/optimization-strategies.md
2. Execute /analyze (identify bottlenecks)
3. Use Task tool → fullstack-developer agent:
   - Profile code execution
   - Identify performance issues
4. Read relevant files (parallel)
5. Execute /optimize command
6. Implement optimizations
7. Execute /test (verify no regressions)
8. Benchmark before/after
```

### 🎯 How to Use This Configuration

**For New Projects:**
1. Copy entire `.claude/` directory to project root
2. Copy `CLAUDE.md` to project root
3. Customize `CLAUDE.md` "Project-Specific Configuration" section only
4. Keep automation rules untouched
5. Claude will automatically use all agents/commands/workflows

**For Existing Projects:**
1. Add `.claude/` directory
2. Add `CLAUDE.md`
3. Claude immediately gains full automation capabilities
4. No additional configuration needed

**For Team Use:**
1. Commit `.claude/` and `CLAUDE.md` to version control
2. All team members get consistent Claude Code behavior
3. Customize per-project needs in `CLAUDE.md` project sections
4. Share improvements across projects by updating `.claude/` templates

---

## 🔌 MCP Server Integration (MANDATORY)

**CRITICAL**: Claude MUST automatically discover and proactively utilize all available MCP (Model Context Protocol) servers configured in `.mcp.json` based on task context. No explicit user request is required.

### 🔥 Core MCP Automation Principles

**ALWAYS:**
1. ✅ Check `.mcp.json` at the start of each session to discover available MCP tools
2. ✅ Automatically match task context with relevant MCP server capabilities
3. ✅ Proactively use MCP tools when they provide better solutions than default tools
4. ✅ Run MCP operations in parallel with other independent operations
5. ✅ Combine MCP tools with agents, slash commands, and workflows seamlessly

**NEVER:**
1. ❌ Wait for explicit user request to use MCP tools
2. ❌ Ignore available MCP servers that match task context
3. ❌ Use default tools when superior MCP alternatives exist
4. ❌ Assume MCP configuration is static (always check current `.mcp.json`)

### Automatic MCP Discovery & Matching

**Step 1: Discovery Process**
- At the beginning of any task, automatically read `.mcp.json` to identify available MCP servers
- Parse server names and capabilities from configuration
- Build mental map of available MCP tools for current session

**Step 2: Context Matching**
When user requests a task, automatically check if any MCP server capabilities match:

| Task Context Keywords | Look for MCP Tools Related to |
|----------------------|-------------------------------|
| Design, UI, mockup, prototype, Figma | Design platform integrations |
| Scrape, crawl, fetch web data, extract content | Web scraping/crawling tools |
| Browser automation, screenshot, click, navigate | Browser automation frameworks |
| Task management, project planning, breakdown | Project/task management systems |
| Desktop control, GUI automation, screenshot | Desktop commander/automation tools |
| Context search, knowledge base, memory | Context management systems |
| Sequential reasoning, planning, thinking | Advanced reasoning tools |

**Step 3: Automatic Activation**
- If match found, proactively use the MCP tool (inform user briefly)
- If multiple matches, use all relevant tools in parallel
- If no match, proceed with default tools
- Continuously reassess as task evolves

### MCP Tool Usage Patterns

**Pattern 1: Design & Prototyping Tasks**
```
User: "Check the design system in Figma" or "Import components from our design"

Claude's Automatic Actions:
1. Check .mcp.json for design platform MCP servers
2. If design tool MCP found → automatically use it to:
   - Access design files
   - Extract component specs
   - Retrieve design tokens
3. Inform user: "Using [Design MCP] to access Figma files..."
```

**Pattern 2: Web Research & Data Extraction**
```
User: "Get the latest documentation from [website]" or "Scrape product data"

Claude's Automatic Actions:
1. Check .mcp.json for web scraping/crawling MCP servers
2. If scraping MCP found → automatically use it to:
   - Fetch web pages with better rendering
   - Extract structured data
   - Handle JavaScript-heavy sites
3. Parallel execution with WebFetch for comparison
```

**Pattern 3: Complex Task Planning**
```
User: "Help me build a multi-step authentication system"

Claude's Automatic Actions:
1. Check .mcp.json for task management & reasoning MCP servers
2. If task MCP found → automatically use it to:
   - Break down complex task into subtasks
   - Track dependencies
   - Manage implementation progress
3. If sequential-thinking MCP found → use it for deep planning
```

**Pattern 4: Browser Automation & Testing**
```
User: "Test the login flow" or "Take screenshots of the app"

Claude's Automatic Actions:
1. Check .mcp.json for browser automation MCP servers
2. If automation MCP found → automatically use it to:
   - Navigate web pages programmatically
   - Interact with UI elements
   - Capture screenshots/videos
   - Run end-to-end tests
```

**Pattern 5: Desktop & GUI Automation**
```
User: "Take a screenshot of my desktop" or "Open calculator app"

Claude's Automatic Actions:
1. Check .mcp.json for desktop control MCP servers
2. If desktop MCP found → automatically use it to:
   - Control desktop applications
   - Take screenshots
   - Automate GUI interactions
```

### MCP Priority & Decision Rules

**Rule 1: MCP-First Approach**
- If an MCP tool exists for the task, prefer it over default tools
- Exception: Use default tools if faster for simple tasks

**Rule 2: Parallel MCP Usage**
- Run multiple MCP operations in parallel when independent
- Example: Scraping MCP + Task planning MCP simultaneously

**Rule 3: MCP + Default Tool Combination**
- Use MCP tools alongside default tools for comprehensive results
- Example: WebFetch (default) + Firecrawl MCP for better coverage

**Rule 4: Graceful Fallback**
- If MCP server fails or is unavailable, fall back to default tools
- Inform user of fallback and why

**Rule 5: Context-Aware Selection**
- Match task requirements with MCP capabilities dynamically
- Don't force MCP usage when default tools are more appropriate

### Transparency & User Communication

When using MCP tools, briefly inform the user:

```
✅ GOOD: "Using Firecrawl MCP to extract structured data from the website..."
✅ GOOD: "Leveraging Playwright MCP for browser automation testing..."
✅ GOOD: "Accessing Figma designs via Design MCP to extract component specs..."

❌ BAD: (Using MCP silently without informing user)
❌ BAD: (Lengthy explanation about what MCP is before using it)
```

### Integration with Agents & Workflows

**MCP tools work seamlessly with existing automation:**

| Workflow Stage | Agent | MCP Integration |
|---------------|-------|-----------------|
| Requirements Gathering | architect | Use context MCP for knowledge retrieval |
| Design Review | architect | Use design platform MCP for mockups |
| Implementation | fullstack-developer | Use task MCP for breakdown, browser MCP for testing |
| Testing | fullstack-developer | Use browser automation MCP for E2E tests |
| Deployment | devops-sre | Use desktop MCP for local builds, task MCP for checklist |

**Example Combined Workflow:**
```
User: "Implement the new dashboard design"

Claude's Automatic Actions:
1. Check .mcp.json → Find Design MCP + Task MCP + Browser MCP
2. Use Design MCP to fetch Figma specs
3. Use Task MCP to break down implementation
4. Engage fullstack-developer agent for coding
5. Use Browser MCP to test responsive design
6. Run /test and /security commands
7. Update docs with /docs command
```

### Dynamic MCP Configuration Handling

**Important: .mcp.json can change between sessions**

- ✅ Always read `.mcp.json` fresh at session start
- ✅ Don't assume specific MCP servers are always available
- ✅ Adapt strategy based on current MCP configuration
- ✅ Handle gracefully if previously available MCP is removed

**Example Adaptive Behavior:**
```
Session 1: User has Figma MCP → Use it for design tasks
Session 2: User removed Figma MCP → Fall back to manual design file reading
Session 3: User added new GraphQL MCP → Automatically use it for API queries
```

### MCP Security & Privacy Considerations

- Never expose MCP API keys or credentials to user
- Don't use MCP tools to access unauthorized resources
- Respect rate limits and usage policies of MCP services
- If MCP requires authentication, use only what's in `.mcp.json` env vars

### MCP Usage Decision Matrix

| User Request Type | Check for MCP Categories | Action if Found | Action if Not Found |
|------------------|--------------------------|-----------------|---------------------|
| Design work | Design platforms | Use design MCP | Read static files |
| Web scraping | Crawlers, browsers | Use scraping MCP | Use WebFetch |
| Task planning | Task managers, reasoning | Use planning MCP | Manual breakdown |
| Browser testing | Automation frameworks | Use browser MCP | Manual testing guide |
| Desktop automation | Desktop controllers | Use desktop MCP | Bash commands |
| API integration | API-specific MCPs | Use API MCP | Direct HTTP calls |

### Summary: MCP Automation Checklist

For every user request:
- [ ] Read `.mcp.json` to discover available MCP servers
- [ ] Match task context with MCP capabilities
- [ ] If match found: Use MCP proactively (inform user)
- [ ] If multiple matches: Use all relevant MCPs in parallel
- [ ] Combine MCP tools with agents/commands/workflows
- [ ] Fall back gracefully if MCP unavailable
- [ ] Never hardcode specific MCP server names in logic

**MCP integration is a force multiplier for Claude's capabilities. Use it aggressively and intelligently.**

---

## 🔗 Integration with .claude Directory

This CLAUDE.md works together with the `.claude/` configuration:

- **CLAUDE.md**: Project-specific instructions, architecture, commands, autonomous behavior rules
- **.claude/**: Universal tools, agents, prompts, workflows that Claude uses automatically

### Division of Responsibility:

| CLAUDE.md | .claude/ |
|-----------|----------|
| This project's tech stack | Universal best practices |
| Project-specific commands | Reusable slash commands |
| Architecture details | Role-based agents |
| Custom workflows | Generic workflows |
| Team conventions | Industry standards |
| Autonomous usage rules | Tool definitions |

---

## 📝 Quick Start for New Projects

1. **Copy this CLAUDE.md** to your new project
2. **Find all `<!-- CUSTOMIZATION: -->` comments**
3. **Update each section** with your project details
4. **Add new sections** as needed for your tech stack
5. **Copy .claude/ directory** for universal tools
6. **Commit both** to version control

---

## 🚀 Best Practices

- Keep CLAUDE.md updated as architecture evolves
- Document important decisions and patterns
- Include examples of preferred code style
- Link to external docs when helpful
- Remove sections that don't apply to your project

---

**Remember: The `⚡ Performance & Execution` section is MANDATORY and should NOT be modified. All other sections can be customized for your project.**
