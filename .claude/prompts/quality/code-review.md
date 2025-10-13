# Code Review Guidelines

Best practices for conducting effective code reviews.

## Code Review Purpose

### Why Review Code?

1. **Catch bugs**: Find issues before production
2. **Knowledge sharing**: Team learns from each other
3. **Consistency**: Maintain code standards
4. **Mentoring**: Help developers improve
5. **Collective ownership**: Team owns all code
6. **Documentation**: Review comments explain decisions

## Code Review Mindset

### For Reviewers

**Be constructive, not critical**:
- Focus on the code, not the person
- Assume good intent
- Ask questions instead of demanding changes
- Praise good solutions
- Provide reasoning for suggestions

**Example comments**:
```
❌ "This is wrong."
✅ "This might have an issue with null values. Have you considered adding a null check?"

❌ "You should use async/await."
✅ "Async/await would make this more readable. What do you think?"

❌ "Bad naming."
✅ "The name 'data' is a bit generic. Would 'userProfile' be clearer?"
```

### For Authors

**Be receptive**:
- Don't take feedback personally
- Assume reviewers want to help
- Ask for clarification if unclear
- Explain your reasoning
- Be willing to make changes

**Respond to all comments**:
- "Fixed in commit abc123"
- "Good catch! Changed to..."
- "I kept this because... Let me know if you disagree"

## What to Review

### Critical Items (Must Check)

**1. Correctness**
- Does the code work as intended?
- Are edge cases handled?
- Could it have unintended side effects?
- Are there any obvious bugs?

**2. Security**
- Input validation present?
- SQL injection prevention?
- XSS prevention?
- Authentication/authorization correct?
- Secrets not hardcoded?

**3. Testing**
- Are there tests?
- Do tests cover important cases?
- Do tests actually test what they claim to?
- Are tests readable and maintainable?

**4. Error Handling**
- Errors handled appropriately?
- Error messages helpful?
- Resources cleaned up on error?
- No swallowed exceptions?

### Important Items (Should Check)

**1. Readability**
- Is code easy to understand?
- Are names clear and descriptive?
- Is complexity justified?
- Are comments helpful (not redundant)?

**2. Maintainability**
- Will future developers understand this?
- Is it easy to modify?
- Are responsibilities clear?
- Is duplication avoided?

**3. Design**
- Does it fit the architecture?
- Are abstractions appropriate?
- Is it appropriately sized?
- Does it follow SOLID principles?

**4. Performance**
- Any obvious performance issues?
- N+1 queries?
- Unnecessary loops or operations?
- Memory leaks possible?

### Minor Items (Nice to Have)

**1. Style**
- Follows team conventions?
- Consistent formatting?
- Appropriate use of language features?

**2. Documentation**
- Complex logic explained?
- API documentation present?
- Breaking changes noted?

## Review Process

### 1. Understand the Context

**Before reviewing**:
- Read the ticket/issue
- Understand what problem is being solved
- Check related discussions

### 2. Start with the Big Picture

**High-level review**:
- Overall approach sound?
- Architecture appropriate?
- Breaking changes necessary?
- Tests adequate?

### 3. Then Check Details

**Line-by-line review**:
- Logic correctness
- Edge cases
- Error handling
- Code quality

### 4. Provide Actionable Feedback

**Use categories**:
- **🔴 Blocker**: Must fix before merge (bugs, security)
- **🟡 Suggestion**: Should fix (design, maintainability)
- **🟢 Nitpick**: Optional (style, minor improvements)
- **💡 Learning**: Educational comment
- **👍 Praise**: Acknowledge good work

**Example**:
```
🔴 BLOCKER: This could cause a null pointer exception if user.profile is undefined
🟡 SUGGESTION: Consider extracting this into a helper function for reusability
🟢 NITPICK: Missing space after comma
💡 LEARNING: FYI, Array.includes() would be simpler than Array.indexOf() !== -1
👍 PRAISE: Nice use of early returns to reduce nesting!
```

## Code Review Checklist

### Functionality
- [ ] Code solves the stated problem
- [ ] Edge cases handled
- [ ] No obvious bugs
- [ ] Works as demonstrated (if applicable)

### Security
- [ ] Input validated
- [ ] No injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Authentication/authorization correct
- [ ] No hardcoded secrets

### Testing
- [ ] Tests included
- [ ] Tests cover main use cases
- [ ] Tests cover edge cases
- [ ] Tests are readable
- [ ] All tests passing

### Code Quality
- [ ] Code is readable
- [ ] Names are clear
- [ ] Complexity is justified
- [ ] No obvious duplication
- [ ] Appropriate abstractions

### Error Handling
- [ ] Errors handled gracefully
- [ ] Error messages helpful
- [ ] No swallowed exceptions
- [ ] Resources cleaned up

### Performance
- [ ] No obvious performance issues
- [ ] Database queries optimized
- [ ] No unnecessary loops
- [ ] Caching used appropriately

### Documentation
- [ ] Complex logic documented
- [ ] API changes documented
- [ ] Breaking changes noted
- [ ] Comments are helpful

## Common Code Smells

### 1. Long Methods

```typescript
// ❌ 200 lines function
function processOrder(order) {
  // ... 200 lines ...
}

// ✅ Broken into smaller functions
function processOrder(order) {
  validateOrder(order)
  const total = calculateTotal(order)
  const payment = processPayment(order, total)
  sendConfirmation(order, payment)
  return { order, payment }
}
```

**Comment**: "This function is doing a lot. Consider breaking it into smaller, focused functions."

### 2. Unclear Naming

```typescript
// ❌ Unclear
function proc(d) {
  return d.filter(x => x > 0).map(x => x * 2)
}

// ✅ Clear
function doublePositiveNumbers(numbers) {
  return numbers
    .filter(num => num > 0)
    .map(num => num * 2)
}
```

**Comment**: "Variable names 'd' and 'x' are unclear. Could you use more descriptive names?"

### 3. Magic Numbers

```typescript
// ❌ Magic numbers
if (user.age > 18 && user.score > 500) {
  // ...
}

// ✅ Named constants
const MINIMUM_AGE = 18
const QUALIFYING_SCORE = 500

if (user.age > MINIMUM_AGE && user.score > QUALIFYING_SCORE) {
  // ...
}
```

**Comment**: "What do 18 and 500 represent? Consider using named constants."

### 4. Nested Conditionals

```typescript
// ❌ Deeply nested
if (user) {
  if (user.isActive) {
    if (user.hasPermission) {
      if (user.balance > 0) {
        // do something
      }
    }
  }
}

// ✅ Guard clauses
if (!user) return
if (!user.isActive) return
if (!user.hasPermission) return
if (user.balance <= 0) return

// do something
```

**Comment**: "Consider using guard clauses to reduce nesting depth."

### 5. God Classes/Functions

```typescript
// ❌ Does everything
class UserManager {
  createUser() {}
  deleteUser() {}
  sendEmail() {}
  processPayment() {}
  generateReport() {}
  // ... 50 more methods
}

// ✅ Separated concerns
class UserService {
  createUser() {}
  deleteUser() {}
}

class EmailService {
  sendEmail() {}
}

class PaymentService {
  processPayment() {}
}
```

**Comment**: "This class has too many responsibilities. Consider splitting it into smaller, focused classes."

### 6. Commented-Out Code

```typescript
// ❌ Commented code
function calculate(x) {
  // const old = x * 2
  // return old + 10
  return x * 2 + 10
}

// ✅ Clean
function calculate(x) {
  return x * 2 + 10
}
```

**Comment**: "Please remove commented-out code. We can find it in git history if needed."

## Review Anti-Patterns

### ❌ Nitpicking Everything

**Bad**:
- 50 comments on minor style issues
- Focusing on formatting over logic
- Blocking merge for trivial issues

**Better**:
- Use automated linting for style
- Focus on important issues
- Only block on critical problems

### ❌ Rubber Stamp Approval

**Bad**:
- "LGTM" without actually reading code
- Approving to move things along
- Not engaging with the PR

**Better**:
- Actually read and understand the code
- Ask questions if unclear
- Provide thoughtful feedback

### ❌ Demanding Perfect Code

**Bad**:
- Insisting on your preferred style
- Endless refactoring suggestions
- Blocking merge for non-critical improvements

**Better**:
- Accept that there are multiple valid approaches
- Suggest improvements but don't demand them
- Focus on must-fix issues

### ❌ Bikeshedding

**Bad**:
- Long debates about variable names
- Arguments about subjective preferences
- Wasting time on trivial decisions

**Better**:
- Defer to team conventions
- Accept author's reasonable choices
- Move on quickly from minor issues

## Review Sizes

### Small PRs (< 200 lines)
- **Ideal**: Easy to review thoroughly
- **Time**: 15-30 minutes
- **Feedback**: Detailed

### Medium PRs (200-400 lines)
- **Acceptable**: Still reviewable
- **Time**: 30-60 minutes
- **Feedback**: Focus on high-level and critical issues

### Large PRs (400+ lines)
- **Avoid**: Hard to review well
- **Alternative**: Split into smaller PRs
- **If unavoidable**: Break review into multiple sessions

**Recommendation**: "This PR is quite large. Could you split it into smaller, focused PRs?"

## Automated Checks

**Should be automated** (not manual review):
- Code formatting
- Linting
- Type checking
- Test execution
- Code coverage
- Security scanning

**CI/CD should enforce**:
```yaml
# Example GitHub Actions
- name: Lint
  run: npm run lint

- name: Type check
  run: npm run type-check

- name: Tests
  run: npm test

- name: Coverage
  run: npm run coverage
  # Fail if coverage drops
```

## Review Timelines

**Response time**:
- Small PR: Same day
- Medium PR: Within 1 day
- Large PR: Within 2 days

**If you can't review promptly**:
- Let author know
- Suggest another reviewer
- Give estimated time

## Handling Disagreements

### When You Disagree

1. **Understand their perspective**
   - Ask questions
   - Consider their reasoning
   - Maybe they're right

2. **Provide context**
   - Explain your concerns
   - Share examples
   - Reference documentation

3. **Escalate if needed**
   - Ask for third opinion
   - Discuss in team meeting
   - Defer to tech lead

### When Someone Disagrees with You

1. **Consider their feedback**
   - They might see something you missed
   - Alternative approach might be better
   - Open to learning

2. **Explain your reasoning**
   - Share why you did it this way
   - Show relevant context
   - Be willing to change

3. **Find compromise**
   - Both approaches might work
   - Pick what's best for the team
   - Document the decision

## Good Review Examples

### Example 1: Security Issue
```
🔴 BLOCKER: SQL Injection Risk

Line 45: This query concatenates user input directly into SQL.

Current:
`SELECT * FROM users WHERE email = '${email}'`

This is vulnerable to SQL injection. An attacker could input:
`'; DROP TABLE users; --`

Suggestion: Use parameterized queries:
`SELECT * FROM users WHERE email = ?` with parameter binding

Resources:
- [OWASP SQL Injection](...)
```

### Example 2: Refactoring Suggestion
```
🟡 SUGGESTION: Extract Complex Logic

Lines 120-145: This function has multiple responsibilities:
- Validates input
- Makes API call
- Processes response
- Updates database

Consider extracting into separate functions:
```typescript
async function createUser(data) {
  validateUserData(data)
  const apiResponse = await createUserInExternalSystem(data)
  const processedUser = processApiResponse(apiResponse)
  await saveUserToDatabase(processedUser)
  return processedUser
}
```

This would:
- Make each function easier to test
- Improve readability
- Make responsibilities clearer

What do you think?
```

### Example 3: Praise
```
👍 PRAISE: Excellent Error Handling

Lines 67-82: Great job handling all the edge cases here!

I especially like:
- Clear error messages
- Proper cleanup on failure
- Logging for debugging

This will make debugging much easier if issues arise.
```

## Summary

**Effective code reviews**:
1. **Be kind and constructive** - Focus on code, not person
2. **Prioritize important issues** - Security, bugs, design
3. **Provide actionable feedback** - Clear, specific, helpful
4. **Respond promptly** - Don't block your teammates
5. **Keep PRs small** - Easier to review thoroughly
6. **Automate what you can** - Style, formatting, basic checks
7. **Learn and teach** - Everyone improves together

**Remember**: Code review is a conversation, not a gate. The goal is to ship quality code while helping everyone learn and improve.
