# MCP Server Integration

Rules for automatic discovery and usage of Model Context Protocol servers.

## Core MCP Automation Principles

**ALWAYS:**
1. ✅ Check `.mcp.json` at session start to discover available MCP tools
2. ✅ Automatically match task context with relevant MCP server capabilities
3. ✅ Proactively use MCP tools when they provide better solutions
4. ✅ Run MCP operations in parallel with other independent operations
5. ✅ Combine MCP tools with agents, slash commands, and workflows seamlessly

**NEVER:**
1. ❌ Wait for explicit user request to use MCP tools
2. ❌ Ignore available MCP servers that match task context
3. ❌ Use default tools when superior MCP alternatives exist
4. ❌ Assume MCP configuration is static (always check current `.mcp.json`)

## Automatic MCP Discovery & Matching

### Step 1: Discovery Process

At task beginning:
- Read `.mcp.json` to identify available MCP servers
- Parse server names and capabilities
- Build mental map of available MCP tools for current session

### Step 2: Context Matching

| Task Context Keywords | Look for MCP Tools Related to |
|----------------------|-------------------------------|
| Design, UI, mockup, prototype, Figma | Design platform integrations |
| Scrape, crawl, fetch web data, extract content | Web scraping/crawling tools |
| Browser automation, screenshot, click, navigate | Browser automation frameworks |
| Task management, project planning, breakdown | Project/task management systems |
| Desktop control, GUI automation, screenshot | Desktop commander/automation tools |
| Context search, knowledge base, memory | Context management systems |
| Sequential reasoning, planning, thinking | Advanced reasoning tools |

### Step 3: Automatic Activation

- If match found → proactively use MCP tool (inform user briefly)
- If multiple matches → use all relevant tools in parallel
- If no match → proceed with default tools
- Continuously reassess as task evolves

## MCP Tool Usage Patterns

### Pattern 1: Design & Prototyping
```
User: "Check the design system in Figma"

Automatic Actions:
1. Check .mcp.json for design platform MCP servers
2. If found → use to access design files, extract specs, retrieve tokens
3. Inform: "Using Design MCP to access Figma files..."
```

### Pattern 2: Web Research & Data Extraction
```
User: "Get the latest docs from [website]"

Automatic Actions:
1. Check .mcp.json for web scraping MCP servers
2. If found → use for better rendering, structured extraction, JS handling
3. Run in parallel with WebFetch for comparison
```

### Pattern 3: Complex Task Planning
```
User: "Build multi-step auth system"

Automatic Actions:
1. Check .mcp.json for task management & reasoning MCP
2. If found → use to break down task, track dependencies, manage progress
3. If sequential-thinking MCP found → use for deep planning
```

### Pattern 4: Browser Automation & Testing
```
User: "Test the login flow"

Automatic Actions:
1. Check .mcp.json for browser automation MCP
2. If found → use to navigate, interact with UI, capture screenshots, run E2E tests
```

### Pattern 5: Desktop & GUI Automation
```
User: "Take a screenshot of desktop"

Automatic Actions:
1. Check .mcp.json for desktop control MCP
2. If found → use to control apps, take screenshots, automate GUI
```

## MCP Priority & Decision Rules

### Rule 1: MCP-First Approach
- If MCP tool exists for task, prefer it over default tools
- Exception: Use default tools if faster for simple tasks

### Rule 2: Parallel MCP Usage
- Run multiple MCP operations in parallel when independent
- Example: Scraping MCP + Task planning MCP simultaneously

### Rule 3: MCP + Default Tool Combination
- Use MCP alongside default tools for comprehensive results
- Example: WebFetch (default) + Firecrawl MCP

### Rule 4: Graceful Fallback
- If MCP server fails/unavailable, fall back to default tools
- Inform user of fallback and reason

### Rule 5: Context-Aware Selection
- Match task requirements with MCP capabilities dynamically
- Don't force MCP usage when default tools are more appropriate

## Transparency & User Communication

When using MCP tools, briefly inform user:

```
✅ GOOD: "Using Firecrawl MCP to extract structured data..."
✅ GOOD: "Leveraging Playwright MCP for browser automation..."
✅ GOOD: "Accessing Figma designs via Design MCP..."

❌ BAD: (Using MCP silently)
❌ BAD: (Lengthy explanation about what MCP is)
```

## Integration with Agents & Workflows

| Workflow Stage | Agent | MCP Integration |
|---------------|-------|-----------------|
| Requirements Gathering | architect | Context MCP for knowledge retrieval |
| Design Review | architect | Design platform MCP for mockups |
| Implementation | fullstack-developer | Task MCP for breakdown, browser MCP for testing |
| Testing | fullstack-developer | Browser automation MCP for E2E tests |
| Deployment | devops-sre | Desktop MCP for builds, task MCP for checklist |

### Example Combined Workflow
```
User: "Implement the new dashboard design"

Automatic Actions:
1. Check .mcp.json → Find Design MCP + Task MCP + Browser MCP
2. Use Design MCP → fetch Figma specs
3. Use Task MCP → break down implementation
4. Engage fullstack-developer agent → coding
5. Use Browser MCP → test responsive design
6. Run /test and /security commands
7. Update docs with /docs command
```

## Dynamic MCP Configuration Handling

**Important: `.mcp.json` can change between sessions**

- ✅ Always read `.mcp.json` fresh at session start
- ✅ Don't assume specific MCP servers are always available
- ✅ Adapt strategy based on current MCP configuration
- ✅ Handle gracefully if previously available MCP is removed

### Example Adaptive Behavior
```
Session 1: User has Figma MCP → Use it for design tasks
Session 2: User removed Figma MCP → Fall back to manual design file reading
Session 3: User added GraphQL MCP → Automatically use it for API queries
```

## MCP Security & Privacy

- Never expose MCP API keys or credentials to user
- Don't use MCP tools to access unauthorized resources
- Respect rate limits and usage policies of MCP services
- If MCP requires authentication, use only what's in `.mcp.json` env vars

## MCP Usage Decision Matrix

| User Request Type | Check for MCP Categories | Action if Found | Action if Not Found |
|------------------|--------------------------|-----------------|---------------------|
| Design work | Design platforms | Use design MCP | Read static files |
| Web scraping | Crawlers, browsers | Use scraping MCP | Use WebFetch |
| Task planning | Task managers, reasoning | Use planning MCP | Manual breakdown |
| Browser testing | Automation frameworks | Use browser MCP | Manual testing guide |
| Desktop automation | Desktop controllers | Use desktop MCP | Bash commands |
| API integration | API-specific MCPs | Use API MCP | Direct HTTP calls |

## MCP Automation Checklist

For every user request:
- [ ] Read `.mcp.json` to discover available MCP servers
- [ ] Match task context with MCP capabilities
- [ ] If match found: Use MCP proactively (inform user)
- [ ] If multiple matches: Use all relevant MCPs in parallel
- [ ] Combine MCP tools with agents/commands/workflows
- [ ] Fall back gracefully if MCP unavailable
- [ ] Never hardcode specific MCP server names in logic

## Summary

**MCP integration is a force multiplier for Claude's capabilities.**

Use it:
- **Aggressively**: Check for MCP opportunities in every task
- **Intelligently**: Match task needs with MCP capabilities
- **Transparently**: Inform user what you're using
- **Gracefully**: Fall back when MCP unavailable
- **Comprehensively**: Combine with agents, commands, workflows

**Always discover fresh at session start. Never assume static configuration.**
