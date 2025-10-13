# Complexity Management

Guidance on when to add complexity to your LLM systems.

## The Simplicity-First Principle

**Start with the simplest solution possible, and only increase complexity when needed.**

From Anthropic's "Building Effective Agents":
> "We recommend finding the simplest solution possible, and only increasing complexity when needed. This might mean not building agentic systems at all."

## When NOT to Build Agentic Systems

### Simple Solutions May Suffice

Before building workflows or agents, try:

1. **Single optimized prompt**
   - Add retrieval for relevant context
   - Include few-shot examples
   - Use clear instructions
   - Iterate on prompt quality

2. **Prompt engineering techniques**
   - Chain of thought
   - Step-by-step reasoning
   - Format specifications
   - Error handling instructions

**Rule**: If a single well-crafted prompt solves the problem reliably, stop there.

## When to Add Workflow Complexity

### Indicators You Need a Workflow

- Task has clear, decomposable steps
- Each step is significantly easier than the whole
- Intermediate validation is valuable
- Different steps need different contexts
- Sequential or parallel processing provides benefits

### Workflow Complexity Levels

**Level 1: Prompt Chaining**
- Predictable sequence of steps
- Each step transforms output for next
- Low risk, easy to debug

**Level 2: Routing**
- Input naturally falls into categories
- Different categories need different handling
- Classification is reliable

**Level 3: Parallelization**
- Independent subtasks can run simultaneously
- Multiple perspectives improve accuracy
- Speed matters

**Level 4: Orchestrator-Workers**
- Subtasks aren't predictable upfront
- Dynamic decomposition needed
- Synthesis of results required

**Level 5: Evaluator-Optimizer**
- Quality can be meaningfully evaluated
- Iteration demonstrably improves output
- Clear evaluation criteria exist

## When to Build Agents

### Agents Are Justified When

1. **Open-ended problems**
   - Can't predict required steps in advance
   - Solution path depends on discoveries along the way
   - Many possible approaches to explore

2. **Dynamic decision-making required**
   - Model must choose tools and approaches based on context
   - Adaptability to unexpected situations is essential
   - Human-like judgment calls needed

3. **Trusted environment**
   - Guardrails in place
   - Sandboxed execution
   - Human oversight available
   - Consequences of errors are acceptable

4. **Scaling benefits**
   - Agent can handle many similar tasks
   - Autonomy reduces human intervention
   - Cost/latency tradeoff is favorable

### Agents Have Costs

**Higher latency**: Many turns of interaction
**Higher cost**: Multiple LLM calls per task
**Compounding errors**: Mistakes can cascade
**Harder debugging**: Complex execution paths
**Unpredictability**: Harder to guarantee outcomes

**Only use agents when benefits clearly outweigh costs.**

## The Complexity Decision Tree

```
Task arrives
    ↓
Can one good prompt solve it?
├─ Yes → Use single prompt (STOP HERE)
└─ No ↓

Are steps predictable and sequential?
├─ Yes → Use prompt chaining
└─ No ↓

Are there distinct categories?
├─ Yes → Use routing
└─ No ↓

Can task be parallelized?
├─ Yes → Use parallelization
└─ No ↓

Do subtasks need dynamic determination?
├─ Yes → Use orchestrator-workers
└─ No ↓

Would iteration improve quality?
├─ Yes → Use evaluator-optimizer
└─ No ↓

Is problem truly open-ended with need for autonomy?
├─ Yes → Use agent (with caution)
└─ No → Reconsider problem decomposition
```

## Measuring Success

**Before adding complexity, define**:
- Success criteria
- Baseline performance with simpler approach
- Target improvement
- Acceptable cost increase

**After implementation, measure**:
- Actual performance improvement
- Latency impact
- Cost impact
- Error rates
- Maintenance burden

**If improvements don't justify costs, simplify.**

## Framework Usage Considerations

### When Frameworks Help

- Rapid prototyping
- Standard patterns (chaining, routing)
- Tool/API integrations
- Getting started quickly

### When to Avoid Frameworks

- Production systems requiring full control
- Performance optimization needed
- Debugging complex issues
- Custom patterns not supported
- Unclear what's happening under the hood

**From Anthropic**:
> "We suggest developers start by using LLM APIs directly: many patterns can be implemented in a few lines of code."

### If Using a Framework

- **Understand the underlying code**: Don't treat it as magic
- **Know what prompts it generates**: Inspect actual LLM calls
- **Be ready to drop abstraction layers**: When you hit limitations
- **Test thoroughly**: Framework defaults may not suit your needs

## Anti-Patterns in Complexity

### ❌ "More Complexity = Better"

Reality: Complexity without clear benefit hurts performance.

### ❌ "We Need an Agent for Everything"

Reality: Most tasks don't need agent-level autonomy.

### ❌ "Let's Use This Framework Because It's Popular"

Reality: Frameworks add abstraction overhead. Use when beneficial.

### ❌ "Just Add More Steps to the Workflow"

Reality: Each step adds latency and potential failure points.

### ❌ "The Model Will Figure It Out"

Reality: Clear, simple instructions outperform complex agentic flows for most tasks.

## Best Practices Summary

1. **Start simple**: Single prompt with good engineering
2. **Add structure deliberately**: Workflows when steps are clear
3. **Reserve agents for true autonomy needs**: Open-ended, unpredictable tasks
4. **Measure everything**: Performance, cost, latency, errors
5. **Be willing to simplify**: Remove complexity that doesn't help
6. **Understand your tools**: Whether APIs or frameworks
7. **Optimize the interface**: Prompt and tool quality matter more than architecture
8. **Human in the loop**: For important decisions and validation
9. **Clear success criteria**: Know what you're optimizing for
10. **Iterate based on data**: Not assumptions

## The 80/20 Rule

**80% of tasks** can be solved with:
- Well-engineered single prompts
- Simple prompt chaining
- Basic tool use

**20% of tasks** benefit from:
- Complex workflows
- Autonomous agents
- Multi-step reasoning

**Focus your effort accordingly.**

## When in Doubt

Ask:
1. What's the simplest thing that could work?
2. Have I tried that and measured the results?
3. What specific problem does added complexity solve?
4. Can I quantify the improvement?
5. Is the added cost worth the benefit?

**If answers are unclear, stay simple.**
