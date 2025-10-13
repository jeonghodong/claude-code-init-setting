# Tool Engineering & Agent-Computer Interface (ACI)

Based on Anthropic's "Building Effective Agents" - Appendix 2.

## The ACI Principle

Just as Human-Computer Interfaces (HCI) require thoughtful design, **Agent-Computer Interfaces (ACI)** deserve equal investment for effective agent operation.

## Tool Definition Best Practices

### 1. Put Yourself in the Model's Shoes

Ask: "Is it obvious how to use this tool based on the description and parameters?"

**Good tool definition includes**:
- Clear purpose statement
- Example usage
- Edge cases documentation
- Input format requirements
- Clear boundaries from other tools

Think of it as writing a great docstring for a junior developer.

### 2. Format Selection Guidelines

Not all formats are equally easy for LLMs to generate.

**Consider**:
- **Thinking tokens**: Give the model enough tokens to plan before writing itself into a corner
- **Natural formats**: Keep close to what model has seen on the internet
- **Minimal overhead**: No complex counting, no excessive escaping

**Example comparisons**:
```
❌ BAD: JSON with escaped code
{
  "code": "function hello() {\n  console.log(\"Hello\");\n}"
}

✅ GOOD: Markdown code blocks
```python
def hello():
    print("Hello")
```
```

❌ BAD: Git diff requiring accurate line counts before writing
```diff
@@ -147,6 +147,12 @@ def process():
```

✅ GOOD: Full file rewrite or clear chunk boundaries
```

### 3. Parameter Naming & Descriptions

**Optimize for clarity**:
- Use descriptive, unambiguous parameter names
- Provide examples in descriptions
- Clarify what happens with edge cases
- Distinguish similar parameters clearly

**Example**:
```
❌ BAD:
path (string): The path

✅ GOOD:
absolute_path (string): Absolute path to the target file
  Example: "/home/user/project/src/main.py"
  Must be absolute, not relative (no "./file.py")
  File must exist or tool will return error
```

### 4. Test How Model Uses Tools

Run many example inputs to see what mistakes the model makes:
- Use workbench for rapid testing
- Identify common error patterns
- Iterate on descriptions based on failures
- Test edge cases thoroughly

### 5. Poka-Yoke Your Tools

**Poka-yoke** (error-proofing): Design tools so mistakes are harder to make.

**Example from SWE-bench agent**:
```
❌ BEFORE: Tool accepts relative file paths
Problem: Model makes mistakes after moving out of root directory

✅ AFTER: Tool requires absolute file paths only
Result: Model uses method flawlessly
```

**Other poka-yoke techniques**:
- Provide enums instead of free-text when options are limited
- Auto-validate inputs before execution
- Return clear error messages with correction guidance
- Use separate tools for similar-but-distinct operations

## Tool Documentation Structure

### Template for Tool Definitions

```markdown
## Tool Name: descriptive_action_name

### Purpose
[One sentence describing what this tool does]

### When to Use
- [Scenario 1]
- [Scenario 2]
- [NOT for: Common mistake scenario]

### Parameters

**parameter_name** (type, required/optional)
- Description: [What it does]
- Format: [Expected format with example]
- Constraints: [Any limitations or requirements]
- Default: [If optional, what's the default]

### Examples

#### Example 1: Common Use Case
```
[Show example invocation]
```

#### Example 2: Edge Case
```
[Show how to handle edge case]
```

### Error Handling
- **Error X**: Cause and how to fix
- **Error Y**: Cause and how to fix

### Related Tools
- Use [other_tool] instead if [condition]
- Combine with [complementary_tool] for [purpose]
```

## Tool Organization Principles

### Granularity

**Too coarse**: One "edit_code" tool that does everything
- Hard to document all behaviors
- Model unsure when to use it
- Many parameters, complex interactions

**Too fine**: Separate tools for every minor variation
- Decision paralysis
- Hard to discover right tool
- Redundant documentation

**Just right**: Logical groupings by capability
- `read_file`, `write_file`, `edit_file` (separate concerns)
- `search_files`, `search_content` (different search types)
- Clear when to use which

### Consistency

**Across all tools**:
- Similar operations use similar parameter names
- Consistent return formats
- Predictable error patterns
- Uniform documentation style

## Testing Tools with LLMs

### 1. Unit Testing (Without LLM)

Test tool implementation independently:
- Input validation
- Error handling
- Edge cases
- Performance with large inputs

### 2. Integration Testing (With LLM)

Test how LLM uses the tool:
- Provide task requiring tool
- Observe if LLM selects correct tool
- Check parameter values are appropriate
- Verify error recovery behavior

### 3. Iteration Based on Failures

Common failure patterns:
- **Wrong tool selected**: Improve tool descriptions, clarify boundaries
- **Invalid parameters**: Add examples, tighten format specs
- **Misunderstood purpose**: Rewrite purpose statement
- **Correct tool, wrong order**: Add sequencing guidance

## Real-World Example: SWE-bench Tools

**Observation**: More time spent optimizing tools than overall prompt.

**Key improvements**:
1. Changed relative paths → absolute paths (eliminated navigation errors)
2. Separated "search by name" from "search by content" (clearer intent)
3. Added file context in edit tools (model understands location better)
4. Provided code in markdown blocks, not JSON (easier to write)
5. Extensive testing revealed edge cases needing documentation

**Result**: Flawless tool usage after iteration.

## Anti-Patterns to Avoid

### ❌ Assuming Model Reads Documentation Carefully

Reality: Model skims. Make key info prominent.

### ❌ Overloading One Tool with Many Behaviors

Split into focused tools instead.

### ❌ Requiring Perfect Inputs

Build in forgiveness: normalize paths, handle common variations.

### ❌ Cryptic Error Messages

Return actionable errors: "Path must be absolute. You provided: './file.py'. Try: '/full/path/file.py'"

### ❌ No Examples

Always include examples—they're worth a thousand words of description.

## Summary Checklist

For each tool, verify:
- [ ] Clear, one-sentence purpose
- [ ] When to use (and when NOT to use)
- [ ] Well-documented parameters with examples
- [ ] Error cases and recovery documented
- [ ] Format is natural for LLM to generate
- [ ] Tested with LLM on real tasks
- [ ] Poka-yoke mechanisms to prevent errors
- [ ] Consistent with other tools in your set
- [ ] Similar tools clearly differentiated
- [ ] Multiple usage examples provided

**Remember**: Good ACI design is as important as good prompting. Invest the time upfront.
