# Execution Principles

## ⚡ Parallel Execution - ALWAYS ENABLED

**CRITICAL**: You MUST execute independent operations in parallel by using multiple tool calls in a single message.

### When to Use Parallel Execution (Always apply these rules)

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

### When NOT to Use Parallel Execution

- Operations that depend on each other (A needs result from B)
- Sequential workflows (git add → git commit → git push)
- One result determines the next action

### Example of Correct Parallel Usage

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

## Performance Best Practices

### Tool Selection Priority

1. **Use specialized tools** instead of bash commands when possible
2. **Read tool** for files instead of `cat/head/tail`
3. **Edit tool** for modifications instead of `sed/awk`
4. **Write tool** for new files instead of `echo >` or heredoc
5. **Bash tool** only for actual system commands requiring shell execution

### Efficient File Operations

- **Batch file reads**: Read all relevant files in one message
- **Parallel searches**: Use Glob/Grep simultaneously for different patterns
- **Minimize round trips**: Anticipate what you'll need and fetch it upfront

### Communication Efficiency

- **Never use bash echo** to communicate with users
- **Output text directly** in your response
- **Brief and actionable**: No unnecessary explanations

## Cost-Latency Tradeoffs

From "Building Effective Agents" principles:

- **Simple prompts first**: Optimize single LLM calls before adding complexity
- **Workflows for structure**: Use when tasks have predictable steps
- **Agents for flexibility**: Only when dynamic decision-making is essential
- **Measure before adding**: Complexity should demonstrably improve outcomes
