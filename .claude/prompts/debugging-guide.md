# Debugging Guide

## Systematic Debugging Process

### 1. Reproduce the Issue
- Understand expected vs actual behavior
- Identify exact steps to reproduce
- Note environment (browser, OS, versions)
- Check error messages and stack traces

### 2. Gather Information
- Console logs and error messages
- Network requests (DevTools Network tab)
- Application state at time of error
- Recent code changes (git log, git diff)

### 3. Form Hypothesis
- What could cause this behavior?
- Which components/functions are involved?
- Is it a data issue, logic error, or configuration?

### 4. Test Hypothesis
- Add strategic console.logs or breakpoints
- Isolate the problematic code
- Test with different inputs
- Check assumptions

### 5. Fix and Verify
- Implement the fix
- Test the original scenario
- Test edge cases
- Ensure no regressions

## Common Issues by Technology

### React/Next.js
**Hydration Errors**
- Server/client HTML mismatch
- Check for: browser-only APIs, random values, Date objects
- Use `useEffect` for client-only code

**State Not Updating**
- Ensure using state setter function
- Check if in server component (add 'use client')
- Verify dependencies in useEffect

**Infinite Loops**
- Check useEffect dependencies
- Avoid state updates in render
- Review recursive function base cases

### API/Backend
**CORS Errors**
```typescript
// Configure CORS properly
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}));
```

**Database Connection Issues**
- Check connection string
- Verify credentials and permissions
- Check network/firewall rules
- Monitor connection pool

**Slow Queries**
- Use query profiling tools
- Check for missing indexes
- Review N+1 query problems
- Consider caching

### Deployment Issues
**Build Failures**
- Check TypeScript errors
- Verify all dependencies installed
- Review environment variables
- Check build logs carefully

**Runtime Errors in Production**
- Check environment-specific config
- Verify API endpoints
- Review error monitoring (Sentry)
- Check resource limits

## Debugging Tools

### Browser DevTools
- Console: Errors, warnings, custom logs
- Network: API calls, status codes, payloads
- Sources: Breakpoints, step debugging
- Performance: Profiling, memory leaks
- Application: Storage, service workers

### Node.js
```bash
# Debug mode
node --inspect server.js

# Chrome DevTools for Node
chrome://inspect
```

### VS Code Debugging
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug",
  "program": "${workspaceFolder}/index.ts",
  "preLaunchTask": "tsc: build",
  "outFiles": ["${workspaceFolder}/dist/**/*.js"]
}
```

## Logging Best Practices

```typescript
// Structured logging
logger.info('User action', {
  userId: user.id,
  action: 'purchase',
  amount: 100,
  timestamp: new Date(),
});

// Error logging with context
logger.error('Payment failed', {
  error: error.message,
  stack: error.stack,
  userId: user.id,
  orderId: order.id,
});
```

## When Stuck
1. Take a break (fresh perspective helps)
2. Explain the problem to someone (rubber duck debugging)
3. Search for similar issues (Stack Overflow, GitHub)
4. Simplify: Create minimal reproduction
5. Ask for help with specific details
