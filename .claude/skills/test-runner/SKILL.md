---
name: Test Runner
description: Run test suites and automatically fix failing tests. Use when executing tests, debugging test failures, or when the user mentions "run tests", "fix tests", "test failures", or "test coverage". Handles unit, integration, and e2e tests.
---

# Test Runner

## Purpose

This skill enables Claude to execute test suites, analyze test failures, automatically fix failing tests, and report test coverage. It provides a comprehensive testing workflow from execution to fix verification.

## When to Use

Claude should use this skill when:
- User asks to run tests (e.g., "run the tests", "execute test suite")
- User reports test failures (e.g., "tests are failing", "fix failing tests")
- User asks about test coverage (e.g., "what's our test coverage?")
- User wants to verify test quality after code changes
- User mentions specific test types (unit, integration, e2e)

## Instructions

Follow this systematic process when running and fixing tests:

### 1. Execute Tests

First, run the appropriate test suite based on the project:

```bash
# For Jest-based projects
npm test
# or
yarn test

# For specific test types
npm run test:unit
npm run test:integration
npm run test:e2e

# For a specific file
npm test -- path/to/test.test.ts
```

### 2. Analyze Failures

When tests fail:
1. **Read the error messages carefully** - Identify the root cause
2. **Locate the failing test** - Find the test file and line number
3. **Understand the assertion** - What was expected vs what was received
4. **Check related code** - Review the code being tested

Common failure patterns:
- **Assertion errors**: Expected value doesn't match actual
- **Type errors**: Incorrect types or missing properties
- **Async errors**: Promises not properly awaited
- **Mock errors**: Mocks not configured correctly
- **Component errors**: React component rendering issues

### 3. Fix Failing Tests

Apply appropriate fixes based on failure type:

**For assertion errors**:
- Update test expectations if requirements changed
- Fix the implementation if test is correct
- Check if test data needs updating

**For type errors**:
- Update TypeScript types in tests
- Ensure mock data matches interfaces
- Fix imports and dependencies

**For async errors**:
- Add proper `await` keywords
- Use `waitFor` for async assertions
- Handle promises correctly

**For mock errors**:
- Verify mock configuration
- Update mock return values
- Check mock function signatures

### 4. Verify Fixes

After fixing:
1. **Re-run the fixed tests** to confirm they pass
2. **Run the full test suite** to ensure no regressions
3. **Check test coverage** if applicable
4. **Report results** to the user

## Process

1. **Execution Phase**
   - Determine test type (unit/integration/e2e)
   - Execute appropriate test command
   - Capture test output and failures

2. **Analysis Phase**
   - Parse test failure messages
   - Identify failure patterns
   - Locate problematic code
   - Understand root causes

3. **Fix Phase**
   - Apply appropriate fixes based on failure type
   - Update test code or implementation
   - Ensure fixes align with test requirements

4. **Verification Phase**
   - Re-run fixed tests
   - Run full test suite
   - Report coverage metrics
   - Confirm all tests pass

## Guidelines

### Do's ✅

- **Read error messages completely** - Don't skip details
- **Fix one test at a time** - Systematic approach
- **Re-run after each fix** - Verify immediately
- **Update both test and implementation** - If requirements changed
- **Check related tests** - Ensure no side effects
- **Report coverage metrics** - When available
- **Explain fixes clearly** - Help user understand changes

### Don'ts ❌

- **Don't skip test execution** - Always verify before fixing
- **Don't fix blindly** - Understand the failure first
- **Don't ignore warnings** - They might indicate issues
- **Don't modify passing tests** - Unless requirements changed
- **Don't skip full suite run** - Prevent regressions
- **Don't assume fixes work** - Always verify

## Output Format

Provide results in this format:

```markdown
## Test Execution Results

### Summary
- Total Tests: [number]
- Passed: [number]
- Failed: [number]
- Skipped: [number]

### Failures Analyzed
1. **[Test Name]** - `path/to/test.test.ts:123`
   - Error: [error message]
   - Cause: [root cause]
   - Fix Applied: [description of fix]

2. **[Test Name]** - `path/to/test.test.ts:456`
   - Error: [error message]
   - Cause: [root cause]
   - Fix Applied: [description of fix]

### Verification
✅ All tests now passing
📊 Coverage: [percentage]%

### Files Modified
- test/file1.test.ts:123
- src/file2.ts:456
```

## Best Practices

### Test Execution
- Run tests before making changes (baseline)
- Use watch mode for rapid iteration
- Run specific tests during debugging
- Execute full suite before completion

### Failure Analysis
- Read complete error stack traces
- Check both test and implementation code
- Consider recent changes that might cause failures
- Look for patterns across multiple failures

### Fix Strategy
- Fix simplest issues first
- Group related failures together
- Verify each fix immediately
- Update documentation if needed

### Quality Assurance
- Ensure all tests pass
- Check for flaky tests
- Verify coverage meets requirements
- Look for potential improvements

## Error Handling

### Test Runner Not Found
- **Issue**: Test command not available
- **Solution**: Check package.json scripts, install dependencies

### Timeout Errors
- **Issue**: Tests taking too long
- **Solution**: Increase timeout, optimize tests, check for infinite loops

### Module Not Found
- **Issue**: Import errors in tests
- **Solution**: Check imports, install missing packages, update paths

### Mock Configuration Errors
- **Issue**: Mocks not working correctly
- **Solution**: Review mock setup, check mock factory, verify mock data

## Examples

### Example 1: Fixing Assertion Failures

**User Request**: "The tests are failing, can you fix them?"

**Action**:
1. Execute test suite: `npm test`
2. Identify failures:
   ```
   FAIL  app/_components/Button/Button.test.tsx
   ● Button › should render with correct text

   expect(element).toHaveTextContent("Click Me")
   Received: "Submit"
   ```
3. Analyze: Test expects "Click Me" but component shows "Submit"
4. Fix: Update test expectation to match actual button text
5. Verify: Re-run test - ✅ PASS

**Outcome**: All tests passing, reported results to user

### Example 2: Fixing Type Errors

**User Request**: "Run the test suite"

**Action**:
1. Execute: `npm test`
2. Identify type error:
   ```
   Type 'string | undefined' is not assignable to type 'string'
   ```
3. Fix: Add proper type guards or update mock data
4. Verify: All tests pass with correct types

**Outcome**: Tests pass, types are correct

## Test Coverage Reporting

When reporting coverage:
```markdown
### Coverage Report

| Metric | Percentage |
|--------|-----------|
| Statements | 85.3% |
| Branches | 78.9% |
| Functions | 92.1% |
| Lines | 84.7% |

**Low Coverage Areas**:
- `src/utils/api.ts` - 45.2%
- `src/components/Form.tsx` - 62.8%
```

## Quality Checklist

Before completing, verify:
- [ ] All tests executed successfully
- [ ] All failures analyzed and understood
- [ ] Fixes applied and verified
- [ ] Full test suite passes
- [ ] Coverage reported (if available)
- [ ] No new warnings introduced
- [ ] Changes explained clearly

---

**Note**: This skill focuses on test execution and fixing. For writing new tests, use the Test Writer skill instead.
