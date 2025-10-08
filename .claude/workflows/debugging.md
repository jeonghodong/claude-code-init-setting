# Debugging Workflow

A systematic approach to finding and fixing bugs.

## Phase 1: Reproduction & Understanding

### 1. Gather Information
- [ ] What is the expected behavior?
- [ ] What is the actual behavior?
- [ ] When did this start happening?
- [ ] Does it happen consistently or intermittently?
- [ ] What environment? (dev, staging, production)
- [ ] Browser/OS/device if relevant

### 2. Reproduce the Bug
- [ ] Follow exact steps to reproduce
- [ ] Note any error messages
- [ ] Check browser console (frontend)
- [ ] Check server logs (backend)
- [ ] Screenshot or record the issue
- [ ] Can you reproduce in dev environment?

### 3. Create Minimal Reproduction
- [ ] Strip away unrelated code
- [ ] Isolate the problematic feature
- [ ] Identify minimum steps to trigger bug
- [ ] Document reproduction steps

## Phase 2: Investigation

### 4. Examine Recent Changes
```bash
# Check recent commits
git log --oneline -10

# See what changed recently
git diff HEAD~5..HEAD

# Check when file was last modified
git log -p <file_path>
```

### 5. Add Instrumentation
- [ ] Add strategic console.logs
- [ ] Add debugger breakpoints
- [ ] Log function inputs and outputs
- [ ] Check variable values at key points
- [ ] Monitor network requests (DevTools)

### 6. Form Hypothesis
- [ ] What could cause this behavior?
- [ ] Which components/functions are involved?
- [ ] Is it a data problem or logic problem?
- [ ] Is it client-side or server-side?
- [ ] Is it a timing/race condition issue?

### 7. Test Hypothesis
- [ ] Add tests to verify hypothesis
- [ ] Try different inputs
- [ ] Check edge cases
- [ ] Verify assumptions

## Phase 3: Root Cause Analysis

### Common Bug Categories

#### Data Issues
- [ ] Is data in expected format?
- [ ] Check for null/undefined values
- [ ] Verify data types
- [ ] Check API response structure
- [ ] Database query returning correct data?

#### Logic Errors
- [ ] Off-by-one errors
- [ ] Incorrect conditional logic
- [ ] Missing edge case handling
- [ ] Wrong comparison operators (== vs ===)
- [ ] Scope issues (closure problems)

#### Timing Issues
- [ ] Race conditions
- [ ] Async/await not used properly
- [ ] State updates not waited for
- [ ] Event listener timing
- [ ] Animation/transition conflicts

#### Framework-Specific Issues

**React/Next.js:**
- [ ] Hydration mismatch (server vs client)
- [ ] Missing 'use client' directive
- [ ] useEffect dependency issues
- [ ] Stale closure in callback
- [ ] Key prop issues in lists

**TypeScript:**
- [ ] Type assertion hiding errors
- [ ] Any type masking problems
- [ ] Interface mismatch
- [ ] Enum usage issues

**API/Backend:**
- [ ] CORS errors
- [ ] Authentication/authorization
- [ ] Request/response format
- [ ] Database connection issues
- [ ] Middleware order

## Phase 4: Fix Implementation

### 8. Implement Fix
- [ ] Make minimal changes to fix issue
- [ ] Avoid refactoring during bug fix
- [ ] Add defensive checks if needed
- [ ] Update types if necessary
- [ ] Add comments explaining the fix

### 9. Verify Fix
- [ ] Test the original reproduction steps
- [ ] Test related functionality (no regression)
- [ ] Test edge cases
- [ ] Run full test suite
- [ ] Test in multiple browsers (if frontend)

### 10. Add Regression Test
```typescript
// Add test that would have caught this bug
test('should handle empty array without crashing', () => {
  const result = processItems([]);
  expect(result).toEqual([]);
});
```

## Phase 5: Prevention & Documentation

### 11. Prevent Future Occurrences
- [ ] Add validation to prevent bad data
- [ ] Improve type safety
- [ ] Add error boundaries
- [ ] Add better error messages
- [ ] Update documentation

### 12. Document the Fix
- [ ] Write clear commit message
- [ ] Document why the bug happened
- [ ] Add code comments if non-obvious
- [ ] Update CLAUDE.md if pattern emerged
- [ ] Share learnings with team

## Debugging Tools & Techniques

### Browser DevTools (Frontend)
```javascript
// Console debugging
console.log('Value:', value);
console.table(arrayOfObjects);
console.trace(); // Show call stack

// Debugger
debugger; // Pauses execution

// Performance
console.time('operation');
// ... code ...
console.timeEnd('operation');
```

### Node.js Debugging
```bash
# Node inspector
node --inspect server.js

# Debug specific test
node --inspect-brk node_modules/.bin/jest --runInBand

# VS Code launch config
{
  "type": "node",
  "request": "launch",
  "name": "Debug",
  "program": "${workspaceFolder}/index.js"
}
```

### Network Debugging
- Check DevTools Network tab
- Verify request headers
- Check response status codes
- Inspect request/response payloads
- Look for CORS errors

### Database Debugging
```sql
-- Explain query
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Check indexes
SHOW INDEXES FROM users;

-- Monitor slow queries
SET profiling = 1;
SELECT * FROM users;
SHOW PROFILES;
```

## Debugging Checklist by Issue Type

### "It's Not Working"
1. Define "working" specifically
2. Check for error messages
3. Verify inputs are correct
4. Check function is being called
5. Verify return value is used

### "Intermittent Failure"
1. Look for race conditions
2. Check for shared state
3. Verify async/await usage
4. Check for timing dependencies
5. Test with different delays

### "Works in Dev, Fails in Prod"
1. Check environment variables
2. Verify build process
3. Check for dev-only code
4. Review production configs
5. Compare dependencies

### "Performance Issue"
1. Profile the application
2. Check database query times
3. Look for N+1 queries
4. Check for memory leaks
5. Review bundle size

## When Stuck

### Take a Break
- Step away for 15 minutes
- Fresh perspective helps
- Avoid tunnel vision

### Rubber Duck Debugging
- Explain problem out loud
- Walk through code line by line
- Often reveals the issue

### Simplify
- Remove code until it works
- Add back piece by piece
- Isolate the problem

### Ask for Help
- Prepare clear description
- Share reproduction steps
- Show what you've tried
- Provide relevant code

## Common Pitfalls

❌ **Changing too much at once**
→ Make one change at a time

❌ **Assuming, not verifying**
→ Verify every assumption with logs/tests

❌ **Fixing symptoms, not root cause**
→ Find and fix the actual problem

❌ **Skipping tests after fix**
→ Always verify fix and test for regressions

❌ **Not documenting the solution**
→ Future you will thank you

## Bug Report Template

```markdown
## Bug Description
Clear description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: macOS 14.0
- Browser: Chrome 120
- Node version: 20.x
- Framework version: Next.js 15

## Screenshots/Logs
[Attach relevant images or error logs]

## Possible Fix
[If you have ideas]
```

---

**Remember: Every bug is an opportunity to improve your codebase and understanding.**
