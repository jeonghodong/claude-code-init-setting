# Coding Tasks & Implementation

Best practices for coding implementations, inspired by SWE-bench agent patterns.

## Coding Agent Principles

From Anthropic's real-world SWE-bench implementation:

### 1. Tool Optimization is Critical

**Observation**: More time was spent optimizing tools than the overall prompt for successful SWE-bench agents.

**Key improvements**:
- Changed relative paths → absolute paths (eliminated navigation errors)
- Separated "search by name" from "search by content" (clearer intent)
- Added file context in edit tools (better location understanding)
- Provided code in markdown blocks, not JSON (easier to write)

### 2. Start with Context Gathering

Before writing code:
1. **Read relevant files** in parallel
2. **Search for similar patterns** already in codebase
3. **Understand dependencies** and imports
4. **Check existing tests** for expected behavior
5. **Review related documentation**

### 3. Make Targeted Changes

**Avoid**:
- Rewriting entire files when only small changes needed
- Making unrelated "improvements" while fixing specific issues
- Changing code style unnecessarily

**Do**:
- Make minimal changes to achieve goal
- Preserve existing patterns and conventions
- Keep related changes together
- Use Edit tool for surgical modifications

### 4. Verification Loop

After every code change:
1. **Run relevant tests** immediately
2. **Check for type errors** with type checker
3. **Verify functionality** matches requirements
4. **Look for regressions** in related features

### 5. Multiple File Coordination

When changes span multiple files:
1. **Plan the sequence**: Which files depend on which
2. **Make foundational changes first**: Models, types, interfaces
3. **Update dependents next**: Implementations using those foundations
4. **Update tests last**: After implementation is complete
5. **Verify integration**: Test cross-file interactions

## Implementation Patterns

### Pattern 1: New Feature Implementation

```
1. Understand requirements
   - Read user request carefully
   - Ask clarifying questions if ambiguous
   - Identify acceptance criteria

2. Design approach
   - Check existing patterns in codebase
   - Identify files that need changes
   - Plan data flow and interfaces

3. Implement incrementally
   - Start with data models/types
   - Add core logic
   - Integrate with existing code
   - Add UI/API layer

4. Test thoroughly
   - Write unit tests
   - Add integration tests
   - Manual verification
   - Edge case testing

5. Document
   - Update relevant docs
   - Add code comments for complex logic
   - Update API documentation if applicable
```

### Pattern 2: Bug Fix

```
1. Reproduce the bug
   - Understand expected vs actual behavior
   - Identify minimal reproduction steps
   - Check if existing test catches it (if not, bug in tests too)

2. Locate root cause
   - Use debugging workflow
   - Read relevant code
   - Check git history for context
   - Trace execution path

3. Fix minimally
   - Change only what's necessary
   - Avoid refactoring during bug fix
   - Preserve existing behavior for other cases

4. Add regression test
   - Test should fail before fix
   - Test should pass after fix
   - Test should cover edge cases

5. Verify no side effects
   - Run full test suite
   - Check related functionality
   - Review changed code paths
```

### Pattern 3: Refactoring

```
1. Ensure tests exist
   - Can't refactor safely without tests
   - Add tests first if missing
   - Verify tests pass before starting

2. Make changes incrementally
   - Small, isolated changes
   - Run tests after each change
   - Don't mix refactoring with feature work

3. Preserve behavior
   - External API should stay same
   - Functionality unchanged
   - Only internal structure improves

4. Commit atomically
   - Each refactoring step is its own commit
   - Easy to revert if problems found
   - Clear change history
```

## Code Quality Guidelines

### Readability

- **Clear variable names**: `userEmail` not `ue`
- **Descriptive function names**: `calculateTotalPrice()` not `calc()`
- **Comments for "why" not "what"**: Explain reasoning, not obvious operations
- **Consistent formatting**: Follow project conventions
- **Appropriate abstraction**: Don't over-engineer, but avoid duplication

### Maintainability

- **Single Responsibility Principle**: Each function/class has one clear purpose
- **DRY (Don't Repeat Yourself)**: Extract common patterns
- **YAGNI (You Aren't Gonna Need It)**: Don't add unused features
- **Keep functions short**: Generally 20-50 lines max
- **Limit parameters**: 3-4 max, use objects for more

### Error Handling

- **Handle expected errors**: Network failures, invalid input, missing data
- **Provide helpful messages**: User/developer can understand what went wrong
- **Log appropriately**: Errors logged, info for important events
- **Fail fast**: Validate inputs early, return/throw quickly on errors
- **Clean up resources**: Use try/finally or context managers

### Testing

- **Test behavior, not implementation**: Tests shouldn't break on refactors
- **Clear test names**: `test_user_cannot_delete_other_users_posts()`
- **Arrange-Act-Assert pattern**: Setup, execute, verify
- **Independent tests**: Each test can run in isolation
- **Fast tests**: Unit tests should be milliseconds

## Common Pitfalls to Avoid

### ❌ Premature Optimization

Don't optimize for performance before proving it's a problem.

**Do**:
1. Write clear, correct code first
2. Measure performance
3. Optimize bottlenecks if needed

### ❌ Over-Engineering

Don't build abstractions "for future flexibility" that isn't needed.

**Do**:
1. Solve the current problem simply
2. Refactor when second use case appears
3. Add abstraction when pattern is clear

### ❌ Mixing Concerns

Don't combine unrelated changes in one implementation.

**Do**:
1. Fix the bug OR refactor, not both
2. Separate feature work from cleanup
3. One logical change per commit

### ❌ Ignoring Existing Patterns

Don't introduce new patterns when existing ones work.

**Do**:
1. Check how similar problems are solved
2. Follow established conventions
3. Discuss before changing patterns

### ❌ Insufficient Testing

Don't assume code works without verification.

**Do**:
1. Write tests alongside code
2. Test happy path and edge cases
3. Include error scenarios
4. Verify with actual usage

## Language-Specific Best Practices

### TypeScript/JavaScript

- Use TypeScript for type safety
- Prefer `const` over `let`, avoid `var`
- Use async/await over raw promises
- Handle promise rejections
- Validate external data (API responses, user input)

### Python

- Follow PEP 8 style guide
- Use type hints for clarity
- Prefer list comprehensions when readable
- Use context managers (`with`) for resources
- Virtual environments for dependencies

### Go

- Follow Go idioms (effective Go)
- Handle all errors explicitly
- Use goroutines for concurrency
- Prefer table-driven tests
- Keep packages focused

## File Organization

### Project Structure

**Good organization**:
```
src/
  features/
    auth/
      components/
      api/
      types/
      tests/
    dashboard/
      components/
      api/
      types/
      tests/
  shared/
    components/
    utils/
    types/
```

**Principles**:
- Group by feature/domain, not by file type
- Keep related files together
- Shared code in explicit shared directory
- Tests next to implementation

### File Size

- **Keep files focused**: One main export per file usually
- **Split when too large**: 300-500 lines often indicates split needed
- **Extract common utilities**: Don't let one file become a junk drawer

## Documentation

### When to Document

**Code comments**:
- Complex algorithms
- Non-obvious business logic
- Workarounds for external issues
- Important assumptions

**Separate documentation**:
- API contracts
- Architecture decisions
- Setup instructions
- Deployment processes

### What to Document

**Do document**:
- Why decisions were made
- Tradeoffs considered
- Important constraints
- Usage examples

**Don't document**:
- What the code obviously does
- Things that will quickly become outdated
- Information better expressed in code

## Summary Checklist

Before considering coding task complete:

- [ ] Code is clear and readable
- [ ] Follows existing patterns and conventions
- [ ] Tests written and passing
- [ ] No unrelated changes included
- [ ] Error cases handled
- [ ] Documentation updated if needed
- [ ] Type checking passes (if applicable)
- [ ] Linting passes
- [ ] Manual verification done
- [ ] Edge cases considered
- [ ] No obvious performance issues
- [ ] Clean git history (logical commits)

**Remember**: Code is read far more often than it's written. Optimize for clarity.
