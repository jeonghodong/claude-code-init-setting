# Universal Claude Code Configuration

This `.claude` directory contains a **framework-agnostic, reusable configuration** for Claude Code that works across any project - frontend, backend, full-stack, data engineering, and more.

## 📁 Directory Structure

```
.claude/
├── agents/           # Specialized role-based AI agents
├── commands/         # Universal slash commands
├── prompts/          # Best practices and guidelines
├── workflows/        # Common development workflows
├── settings.json     # Parallel execution & preferences
├── ignore            # Universal ignore patterns
└── README.md         # This file
```

## 🤖 Specialized Agents

Agents are automatically engaged based on your task context:

- **`architect.md`** - System design, architecture patterns, tech stack selection
- **`fullstack-developer.md`** - Full-stack development across any framework
- **`devops-sre.md`** - CI/CD, infrastructure, container orchestration
- **`data-engineer.md`** - ETL pipelines, data warehousing, analytics
- **`security-expert.md`** - Security best practices, vulnerability assessment

## ⚡ Slash Commands

Universal commands that work with any tech stack:

| Command | Description |
|---------|-------------|
| `/analyze` | Analyze codebase, identify tech stack, suggest improvements |
| `/test` | Run tests and fix failures |
| `/debug` | Debug issues systematically |
| `/refactor` | Improve code quality and structure |
| `/optimize` | Performance optimization |
| `/security` | Security audit and fixes |
| `/deploy` | Deploy application |
| `/docs` | Generate/update documentation |
| `/migrate` | Technology migration helper |

## 📚 Prompt Templates

Comprehensive guides for any development scenario:

- **`code-quality.md`** - Clean code principles, language-specific best practices
- **`debugging-guide.md`** - Systematic debugging approach
- **`project-setup.md`** - Initial project setup checklist
- **`optimization-strategies.md`** - Frontend & backend performance optimization

## 🔄 Workflows

Step-by-step workflows for common development tasks:

- **`feature-development.md`** - Complete feature implementation from planning to deployment
- **`debugging.md`** - Systematic debugging process with tools and techniques
- **`code-review.md`** - Comprehensive code review checklist and best practices

Each workflow includes:
- Detailed checklists for each phase
- Common patterns and anti-patterns
- Tool usage examples
- Tips for success

## ⚙️ Settings & Configuration

### Official Claude Code Settings (settings.json)
The `settings.json` uses the **official Claude Code schema** for maximum compatibility:

```json
{
  "permissions": {
    "allow": ["*"],
    "deny": ["Read(.env)", "Read(*.pem)", "Read(*.key)", ...]
  },
  "env": {
    "CLAUDE_PARALLEL_EXECUTION": "enabled",
    "CLAUDE_AUTO_AGENTS": "enabled",
    "CLAUDE_AUTO_COMMANDS": "enabled"
  }
}
```

**Key Features:**
- ✅ All tools permitted except sensitive file access
- ✅ Environment variables enable automation flags
- ✅ Security-first: automatic denial of secrets/credentials
- ✅ Works across all projects without modification

### Automation Configuration (CLAUDE.md)
All automation rules, workflows, and code style preferences are defined in `CLAUDE.md`:
- 🤖 Automatic agent selection and invocation
- ⚡ Mandatory parallel execution rules
- 🔧 Slash command auto-execution
- 📋 Workflow auto-application
- 🎯 Decision matrix for task types

## 🚀 How to Use

### 1. Copy to Your Project
```bash
# Copy both .claude directory and CLAUDE.md to any project
cp -r /path/to/.claude /your/project/
cp /path/to/CLAUDE.md /your/project/
```

### 2. Automatic Operation (No User Action Required!)
Once installed, Claude Code will **automatically**:
- ✅ Use specialized agents based on task context
- ✅ Execute slash commands when relevant
- ✅ Run operations in parallel for efficiency
- ✅ Follow workflow best practices
- ✅ Apply quality checks before completion

### 3. Manual Slash Commands (Optional)
You can still manually invoke commands:
```bash
/analyze          # Understand the codebase
/test            # Run tests
/security        # Security audit
/refactor        # Improve code quality
/optimize        # Performance optimization
/deploy          # Deploy application
```

### 4. Agent Invocation (Automatic + Manual)
**Automatic**: Agents are engaged based on task context
**Manual**: Explicitly mention agents in your request
- "Use the architect agent to design this system"
- "Security expert, review this authentication code"
- "DevOps agent, help me set up CI/CD"

## 🔧 Customization

### Add Custom Commands
Create `.md` files in `/commands`:
```md
# .claude/commands/my-command.md
Do something specific to my project
```

### Extend Agents
Add new agent files in `/agents` for specialized roles:
```md
# .claude/agents/ml-engineer.md
You are a machine learning engineer...
```

### Modify Settings
Edit `settings.json` to adjust:
- Parallel execution limits
- Code style preferences
- Quality gates
- Workflow steps

## 🌍 Multi-Project Usage

This configuration is **project-agnostic** and can be used across:
- **Frontend**: React, Vue, Angular, Svelte
- **Backend**: Node.js, Python, Go, Java, Ruby
- **Full-Stack**: Next.js, Nuxt, SvelteKit, Remix
- **Data**: ETL pipelines, data warehouses, analytics
- **Infrastructure**: Docker, Kubernetes, Terraform, AWS/GCP/Azure

## 📋 Ignore Patterns (.claude/ignore)

### What is the `ignore` file?
The `ignore` file tells Claude Code which files and directories to **exclude from context** when analyzing your codebase. This improves performance and focuses Claude's attention on relevant code.

### Why use ignore patterns?
- **Performance**: Skip large dependency folders (node_modules, venv)
- **Focus**: Exclude generated files and build outputs
- **Security**: Avoid accidentally exposing secrets in .env files
- **Token efficiency**: Don't waste context on irrelevant files

### What's included in the universal ignore file:

**Dependencies** (frameworks install these)
- `node_modules/` - npm/yarn packages
- `venv/`, `env/`, `.venv/` - Python virtual environments
- `vendor/` - Go, PHP, Ruby dependencies
- `__pycache__/` - Python bytecode

**Build Outputs** (generated, not source code)
- `.next/`, `out/` - Next.js builds
- `dist/`, `build/` - General build folders
- `*.egg-info/` - Python packages

**Secrets & Environment** (security risk)
- `.env`, `.env.local`, `.env.*.local` - Environment variables
- `*.pem`, `*.key` - Certificates and keys
- `credentials.json`, `secrets.json` - Credential files

**Cache & Temporary**
- `.cache/`, `.turbo/` - Build caches
- `*.tsbuildinfo` - TypeScript cache
- `.eslintcache` - ESLint cache

**IDE & Editor**
- `.vscode/`, `.idea/` - Editor settings
- `*.swp`, `*.swo` - Vim swap files

**OS Files**
- `.DS_Store` - macOS metadata
- `Thumbs.db` - Windows thumbnails

### How Claude uses the ignore file:
When you ask Claude to analyze code or search files, it automatically skips anything matching these patterns. This means:
- Faster file searches
- More relevant context
- Lower token usage
- No accidental secret exposure

### Example:
```bash
# Without ignore: Claude might read 50,000+ files in node_modules
# With ignore: Claude only reads your ~100 source files
```

### Customizing ignore patterns:
Add project-specific patterns to `.claude/ignore`:
```
# Add your custom patterns
*.log
temp/
legacy-code/
```

## 🔄 Version Control

**Recommended approach:**
1. Add `.claude/` to your project's git repository
2. Commit the base configuration
3. Customize per project needs
4. Keep `settings.json` for team consistency

**Alternative (global config):**
```bash
# Keep one master .claude config
export CLAUDE_CONFIG_PATH=~/.claude
```

## 📖 Learning Resources

Each prompt file contains:
- Best practices for the topic
- Code examples
- Common pitfalls
- Framework-specific guidance
- Checklists and workflows

## 🤝 Contributing

Enhance this configuration:
1. Add new agents for specialized roles
2. Create additional slash commands
3. Expand prompt templates
4. Share improvements across projects

## 📝 Notes

- **settings.json** uses official Claude Code schema - maximum compatibility
- **CLAUDE.md** is the master automation config - all rules defined here
- **Agents** are role-based and automatically invoked - not framework-specific
- **Commands** are universal slash commands - work with any tech stack
- **Prompts** are reference guidelines - automatically applied by Claude
- **Workflows** are structured checklists - auto-followed for complex tasks

## 🎯 Key Differences from Other Configs

### This Configuration:
✅ Uses **official Claude Code schema** (settings.json)
✅ **Automatic agent invocation** via Task tool
✅ **Automatic command execution** based on context
✅ **Mandatory parallel execution** for efficiency
✅ **Project-agnostic** - works everywhere
✅ **Team-ready** - commit to version control
✅ **Zero configuration** - works out of the box

### What Makes This Special:
- 🚀 **Performance-first**: Parallel execution by default
- 🤖 **Intelligence**: Agents auto-engage based on task
- 🔧 **Flexibility**: Works with any tech stack
- 📚 **Comprehensive**: Covers all common workflows
- 🔒 **Secure**: Automatic secret protection
- 🌍 **Universal**: Copy once, use everywhere

---

**Built for maximum productivity across any development environment** 🚀

*This configuration follows official Claude Code best practices and is designed to be the ultimate reusable template for all your projects.*
