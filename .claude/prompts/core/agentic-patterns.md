# Agentic Patterns & Workflows

Based on Anthropic's "Building Effective Agents" research.

## Understanding Agentic Systems

### Workflows vs Agents

**Workflows**: Systems where LLMs and tools are orchestrated through **predefined code paths**.

**Agents**: Systems where LLMs **dynamically direct their own processes** and tool usage, maintaining control over how they accomplish tasks.

## Workflow Patterns

### 1. Prompt Chaining

Decomposes a task into a sequence of steps, where each LLM call processes the output of the previous one.

```
Input → LLM Call 1 → Gate Check → LLM Call 2 → Gate Check → LLM Call 3 → Output
```

**When to use**:
- Task can be cleanly decomposed into fixed subtasks
- Trading latency for higher accuracy
- Each step makes the next LLM call easier

**Examples**:
- Generate marketing copy → Translate to another language
- Write document outline → Validate outline → Write full document

### 2. Routing

Classifies an input and directs it to a specialized followup task.

```
Input → Classifier → Route A (Specialized LLM)
                  → Route B (Specialized LLM)
                  → Route C (Specialized LLM)
```

**When to use**:
- Distinct categories requiring different handling
- Classification can be handled accurately
- Separation of concerns improves performance

**Examples**:
- Customer support: general questions vs refunds vs technical support
- Route simple queries to Haiku, complex queries to Sonnet

### 3. Parallelization

LLMs work simultaneously on a task with outputs aggregated programmatically.

**Two variations**:
- **Sectioning**: Breaking task into independent subtasks run in parallel
- **Voting**: Running same task multiple times for diverse outputs

```
Input → LLM 1 (Subtask A) ↘
      → LLM 2 (Subtask B) → Aggregator → Output
      → LLM 3 (Subtask C) ↗
```

**When to use**:
- Subtasks can be parallelized for speed
- Multiple perspectives needed for confidence
- Complex tasks with multiple considerations

**Examples**:
- Sectioning: One model processes query, another screens for safety
- Voting: Multiple prompts review code for vulnerabilities

### 4. Orchestrator-Workers

Central LLM dynamically breaks down tasks, delegates to worker LLMs, and synthesizes results.

```
Input → Orchestrator → Worker 1 ↘
                    → Worker 2 → Synthesizer → Output
                    → Worker 3 ↗
```

**When to use**:
- Complex tasks where subtasks can't be predicted
- Flexibility needed in decomposition
- Task structure depends on specific input

**Examples**:
- Coding: Complex changes to multiple files
- Research: Gathering information from multiple dynamic sources

### 5. Evaluator-Optimizer

One LLM generates response while another provides evaluation and feedback in a loop.

```
Input → Generator → Evaluator → Feedback Loop → Final Output
         ↑______________|
```

**When to use**:
- Clear evaluation criteria exist
- Iterative refinement provides measurable value
- LLM can provide useful critiques
- Human feedback improves responses

**Examples**:
- Literary translation with nuanced feedback
- Complex search requiring multiple refinement rounds

## Autonomous Agents

Agents operate independently with environmental feedback, using tools in a loop.

```
User Command → Planning → Tool Use → Environment Feedback → Assessment
                ↑______________________________________________|
                                Loop until complete
```

### When to Use Agents

- Open-ended problems with unpredictable steps
- Can't hardcode a fixed path
- Many turns of operation expected
- Trust in LLM decision-making
- Appropriate for scaling in trusted environments

### Agent Design Principles

1. **Maintain simplicity**: Don't add complexity without clear benefit
2. **Prioritize transparency**: Show planning steps explicitly
3. **Craft ACI carefully**: Tool documentation and testing are crucial
4. **Include guardrails**: Extensive testing in sandboxed environments
5. **Ground truth at each step**: Tool results, code execution validate progress
6. **Human checkpoints**: Pause for feedback or at blockers
7. **Stopping conditions**: Maximum iterations to maintain control

### Agent Success Factors

**From real implementations**:
- Clear success criteria
- Automated verification (e.g., tests for code)
- Meaningful human oversight
- Well-documented tools
- Feedback loops for iteration

## Complexity Ladder (Simplest → Most Complex)

1. **Single optimized prompt** with retrieval and examples
2. **Prompt chaining** for sequential tasks
3. **Routing** for categorized handling
4. **Parallelization** for speed or multiple perspectives
5. **Orchestrator-workers** for dynamic decomposition
6. **Evaluator-optimizer** for iterative refinement
7. **Autonomous agents** for open-ended exploration

**Rule**: Start at level 1. Only increase complexity when simpler solutions fall short and improvements are measurable.

## Combining Patterns

These patterns aren't prescriptive—they're composable building blocks.

**Example combination**:
```
User request → Route by complexity →
  Simple: Prompt chain
  Medium: Orchestrator-workers
  Complex: Full agent with evaluator-optimizer loop
```

## Key Takeaways

- **Simplicity first**: Most tasks don't need agents
- **Workflows for predictability**: When steps are known
- **Agents for flexibility**: When dynamic control is essential
- **Measure performance**: Add complexity only when beneficial
- **Combine patterns**: Mix and match for optimal results
