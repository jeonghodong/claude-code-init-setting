# Debugging Guide

Systematic approach to investigating and fixing issues.

## Debugging Mindset

**Core principles**:
1. **Reproduce first**: Can't fix what you can't reproduce
2. **Understand before fixing**: Rushing to fix often makes things worse
3. **Change one thing**: Multiple changes make it unclear what worked
4. **Verify the fix**: Ensure problem is actually solved
5. **Add regression test**: Prevent the bug from returning

## Systematic Debugging Process

### Phase 1: Information Gathering

**Before touching any code**:

1. **Get exact error details**
   - Full error message and stack trace
   - When does it occur (always, sometimes, specific conditions)
   - Recent changes that might be related
   - Environment details (OS, versions, config)

2. **Reproduce reliably**
   - Find minimal steps to trigger the bug
   - Document the reproduction steps
   - Determine if it's intermittent or consistent
   - Check if it affects all users or specific subset

3. **Check recent changes**
   ```bash
   git log --oneline -10
   git diff main
   git blame <problematic-file>
   ```

4. **Search for similar issues**
   - Check issue tracker
   - Search error message online
   - Review past fixes for similar bugs
   - Check library/framework known issues

### Phase 2: Hypothesis Formation

**Develop theories about the cause**:

1. **Identify the failure point**
   - Where exactly does the error occur?
   - What's the last thing that worked correctly?
   - What's the first thing that failed?

2. **Trace the execution path**
   - Follow the code from user action to error
   - Identify all functions/methods involved
   - Note where data transforms happen

3. **Form hypotheses**
   - What could cause this behavior?
   - List multiple possible causes
   - Order by likelihood

### Phase 3: Investigation

**Test your hypotheses systematically**:

1. **Add logging/debugging output**
   ```javascript
   console.log('Before API call:', { userId, endpoint })
   console.log('API response:', response)
   console.log('After processing:', result)
   ```

2. **Use debugger**
   - Set breakpoints at key locations
   - Inspect variable values
   - Step through execution
   - Watch for unexpected state changes

3. **Isolate the problem**
   - Comment out code sections
   - Test with minimal input
   - Remove complexity to find core issue
   - Binary search: disable half, see if bug persists

4. **Check assumptions**
   - Is the data format what you expect?
   - Are functions being called in correct order?
   - Are all dependencies available?
   - Is the environment configured properly?

### Phase 4: Root Cause Identification

**Find the actual source of the problem**:

1. **Distinguish symptom from cause**
   - Error might manifest far from actual bug
   - Null pointer exception → why is it null?
   - Timeout → what's taking so long?

2. **Look for edge cases**
   - Empty arrays/strings
   - Null/undefined values
   - Very large/small numbers
   - Special characters
   - Concurrent access

3. **Check boundaries**
   - Array indices
   - API rate limits
   - Memory/storage limits
   - Timeout durations
   - Permission boundaries

### Phase 5: Fix Implementation

**Make the fix**:

1. **Choose the right fix location**
   - Fix at the root cause, not the symptom
   - Consider where validation should happen
   - Think about who's responsible for ensuring correctness

2. **Make minimal changes**
   - Fix only what's broken
   - Don't "improve" other things simultaneously
   - Resist refactoring urge during bug fix

3. **Add defensive programming**
   ```typescript
   // Before
   function process(data) {
     return data.items.map(x => x.value)
   }

   // After
   function process(data) {
     if (!data || !Array.isArray(data.items)) {
       console.error('Invalid data format:', data)
       return []
     }
     return data.items
       .filter(x => x && typeof x.value !== 'undefined')
       .map(x => x.value)
   }
   ```

4. **Consider backward compatibility**
   - Will fix break existing functionality?
   - Do other code paths need updates?
   - Are there migration considerations?

### Phase 6: Verification

**Confirm the fix works**:

1. **Verify fix resolves original issue**
   - Re-run original reproduction steps
   - Confirm error no longer occurs
   - Test edge cases

2. **Add regression test**
   ```typescript
   test('handles empty items array', () => {
     const result = process({ items: [] })
     expect(result).toEqual([])
   })

   test('handles null data', () => {
     const result = process(null)
     expect(result).toEqual([])
   })
   ```

3. **Run full test suite**
   - Ensure no regressions
   - All existing tests still pass
   - New tests pass

4. **Test in realistic environment**
   - Dev environment
   - Staging if available
   - With realistic data
   - Under realistic load

### Phase 7: Prevention

**Prevent similar bugs**:

1. **Document the issue**
   - Add code comment explaining the fix
   - Update documentation if needed
   - Note any gotchas for future developers

2. **Identify pattern**
   - Are there similar bugs elsewhere?
   - Should similar code be updated?
   - Is there a systemic issue?

3. **Add monitoring**
   - Log when edge case is encountered
   - Track error rates
   - Alert on anomalies

## Debugging Techniques

### Console Logging

**Strategic logging**:
```javascript
// Log entry/exit
console.log('→ Starting processOrder', { orderId })
// ... code ...
console.log('← Finished processOrder', { result })

// Log state changes
console.log('State before:', currentState)
// ... mutation ...
console.log('State after:', currentState)

// Log conditions
console.log('Checking condition:', { x, y, result: x > y })
```

**Structured logging**:
```typescript
const logger = {
  debug: (msg, data) => console.log(`[DEBUG] ${msg}`, data),
  info: (msg, data) => console.log(`[INFO] ${msg}`, data),
  error: (msg, data) => console.error(`[ERROR] ${msg}`, data),
}

logger.debug('API call', { url, method, body })
```

### Debugger Usage

**Key debugger features**:
1. **Breakpoints**: Pause execution at specific line
2. **Conditional breakpoints**: Pause only when condition is true
3. **Watch expressions**: Monitor specific variables
4. **Call stack inspection**: See how you got to current point
5. **Step over/into/out**: Navigate execution

### Binary Search Debugging

**For complex bugs**:
1. Identify working state and broken state
2. Find midpoint between them (e.g., `git bisect`)
3. Check if midpoint is working or broken
4. Repeat with new range
5. Narrows down to exact change that broke it

### Rubber Duck Debugging

**Explain the problem out loud**:
1. Describe what the code is supposed to do
2. Walk through what it actually does
3. Explain your assumptions
4. Often you'll spot the issue while explaining

## Common Bug Categories

### 1. Logic Errors

**Symptoms**: Wrong output, unexpected behavior
**Causes**: Incorrect conditions, wrong operators, off-by-one errors
**Debugging**: Trace execution, verify conditions, check edge cases

### 2. Null/Undefined Errors

**Symptoms**: "Cannot read property of undefined"
**Causes**: Missing data, async timing, optional properties
**Debugging**: Check data flow, verify initialization, add null checks

### 3. Async/Timing Issues

**Symptoms**: Intermittent failures, race conditions
**Causes**: Missing await, concurrent access, event ordering
**Debugging**: Add logging with timestamps, check promise handling

### 4. Type/Data Format Issues

**Symptoms**: Unexpected type errors, parsing failures
**Causes**: API changes, wrong assumptions, missing validation
**Debugging**: Log actual data types, validate inputs, check API docs

### 5. Environment/Configuration

**Symptoms**: Works locally, fails in production
**Causes**: Environment variables, different versions, missing config
**Debugging**: Compare environments, check dependencies, verify config

## Tools & Commands

### Browser DevTools

```javascript
// Console API
console.table(arrayOfObjects)
console.time('operation')
// ... code ...
console.timeEnd('operation')
console.trace() // Stack trace

// Copy to clipboard
copy(largeObject)

// Inspect element
inspect($0) // Last selected element
```

### Node.js Debugging

```bash
# Start with inspector
node --inspect app.js

# Debug with breakpoint
node --inspect-brk app.js

# Chrome DevTools
chrome://inspect
```

### Git Debugging

```bash
# Find when bug was introduced
git bisect start
git bisect bad  # Current commit is bad
git bisect good <commit>  # This commit was good
# Git will checkout middle commit, test it
git bisect good  # or 'git bisect bad'
# Repeat until found

# See what changed in a file
git log -p <file>

# Who changed this line?
git blame <file>
```

## Debugging Checklist

When stuck:

- [ ] Have I reproduced the bug reliably?
- [ ] Do I understand expected vs actual behavior?
- [ ] Have I read the error message carefully?
- [ ] Have I checked recent changes?
- [ ] Have I added logging at key points?
- [ ] Have I verified my assumptions?
- [ ] Have I tested edge cases?
- [ ] Have I simplified to minimal reproduction?
- [ ] Have I checked environment differences?
- [ ] Have I searched for similar issues?
- [ ] Have I taken a break and come back fresh?

## When to Ask for Help

**Ask for help when**:
- Stuck for >2 hours without progress
- Bug is in unfamiliar codebase area
- Security implications
- Affects production users
- Need domain expertise

**When asking, provide**:
1. What you're trying to achieve
2. What's actually happening
3. Minimal reproduction steps
4. What you've already tried
5. Relevant code snippets
6. Error messages and stack traces
7. Environment details

## Summary

**Good debugging is systematic**:
1. Gather information thoroughly
2. Form hypotheses
3. Test hypotheses methodically
4. Find root cause, not symptom
5. Fix minimally
6. Verify completely
7. Add regression test
8. Document and prevent

**Remember**: Every bug is an opportunity to improve the system's robustness.
