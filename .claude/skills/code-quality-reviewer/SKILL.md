---
name: Code Quality Reviewer
description: Review code for quality based on readability, predictability, cohesion, and coupling principles. Use when reviewing code, refactoring, checking PRs, or when user mentions "code quality", "clean code", "refactor", "code review", or asks to improve code structure.
allowed-tools: Read, Grep, Glob
---

# Code Quality Reviewer

## Purpose

Review and improve code quality based on the principle that **"good code is code that is easy to change."** This skill evaluates code against four core criteria and provides actionable feedback.

## When to Use

- Code reviews and PR reviews
- Refactoring existing code
- When asked to improve code quality
- When user mentions readability, maintainability, or clean code
- Before committing significant changes

## Core Principles

### 1. Readability (가독성)

Code should be easy to understand at a glance.

**Evaluation Criteria:**

- **Context Reduction**
  - Are unrelated code blocks separated?
  - Are implementation details properly abstracted?
  - Are functions split by logic type?

- **Clear Naming**
  - Are complex conditions labeled with meaningful names?
  - Are magic numbers replaced with named constants?
  - Do names clearly express intent?

- **Top-to-bottom Flow**
  - Does code read naturally from top to bottom?
  - Are perspective shifts minimized?
  - Are ternary operators simple (avoid nesting)?

### 2. Predictability (예측 가능성)

Teammates should anticipate function/component behavior.

**Evaluation Criteria:**

- **Consistent Naming**
  - No naming conflicts across codebase
  - Similar functions follow similar patterns

- **Unified Return Types**
  - Functions with similar purposes return consistent types
  - No surprising return values

- **Explicit Logic**
  - Hidden side effects are made visible
  - No implicit behaviors

### 3. Cohesion (응집도)

Code that changes together should stay together.

**Evaluation Criteria:**

- **Co-location**
  - Related files are in the same directory
  - Files modified together are grouped

- **No Scattered Constants**
  - Magic numbers are eliminated
  - Related constants are centralized

- **Form Structure**
  - Form fields and validation are co-located
  - Related state is grouped

### 4. Coupling (결합도)

Changes should have minimal impact scope.

**Evaluation Criteria:**

- **Isolated Responsibilities**
  - Each module has single responsibility
  - Dependencies are explicit

- **Strategic Duplication**
  - Accept duplication when it reduces dependencies
  - Don't over-abstract prematurely

- **No Props Drilling**
  - Avoid passing props through multiple layers
  - Use context or composition patterns

## Review Process

1. **Read the code** using Read tool
2. **Search for patterns** using Grep
3. **Find related files** using Glob
4. **Evaluate against each principle**
5. **Identify trade-offs** (principles may conflict)
6. **Provide prioritized recommendations**

## Output Format

```markdown
## Code Quality Review

### Summary
[Brief overview of code quality status]

### Readability
- **Score**: [Good/Needs Improvement/Poor]
- **Issues**: [List specific issues]
- **Recommendations**: [Actionable improvements]

### Predictability
- **Score**: [Good/Needs Improvement/Poor]
- **Issues**: [List specific issues]
- **Recommendations**: [Actionable improvements]

### Cohesion
- **Score**: [Good/Needs Improvement/Poor]
- **Issues**: [List specific issues]
- **Recommendations**: [Actionable improvements]

### Coupling
- **Score**: [Good/Needs Improvement/Poor]
- **Issues**: [List specific issues]
- **Recommendations**: [Actionable improvements]

### Priority Actions
1. [Most critical improvement]
2. [Second priority]
3. [Third priority]

### Trade-off Considerations
[Explain any conflicting principles and recommended prioritization]
```

## Examples

### Example 1: Poor Readability

**Before:**
```typescript
const x = data.filter(d => d.status === 1 && d.type === 'A' && d.value > 100);
```

**After:**
```typescript
const isActive = (item) => item.status === 1;
const isTypeA = (item) => item.type === 'A';
const hasHighValue = (item) => item.value > 100;

const filteredData = data.filter(item =>
  isActive(item) && isTypeA(item) && hasHighValue(item)
);
```

### Example 2: Poor Cohesion

**Before:**
```
src/
  constants/
    userConstants.ts  // USER_STATUS values
  validators/
    userValidator.ts  // validates user
  components/
    UserForm.tsx      // uses both above
```

**After:**
```
src/
  features/
    user/
      constants.ts
      validator.ts
      UserForm.tsx
```

### Example 3: High Coupling

**Before:**
```typescript
// Props drilling through 5 components
<App user={user}>
  <Layout user={user}>
    <Page user={user}>
      <Section user={user}>
        <UserDisplay user={user} />
      </Section>
    </Page>
  </Layout>
</App>
```

**After:**
```typescript
// Using context
<UserProvider value={user}>
  <App>
    <Layout>
      <Page>
        <Section>
          <UserDisplay /> {/* Uses useUser() hook */}
        </Section>
      </Page>
    </Layout>
  </App>
</UserProvider>
```

## Best Practices

1. **Prioritize based on risk**: Focus on cohesion where mistakes cause errors
2. **Accept strategic duplication**: Don't over-abstract to reduce coupling
3. **Consider the team**: Readability standards should match team conventions
4. **Document trade-offs**: Explain why you chose one principle over another
5. **Incremental improvement**: Don't try to fix everything at once

## Common Anti-patterns to Watch

- **God components**: Components doing too many things
- **Scattered constants**: Magic numbers spread across files
- **Deep nesting**: Complex conditionals and callbacks
- **Implicit dependencies**: Hidden side effects
- **Over-abstraction**: Too many layers of indirection
- **Copy-paste with variations**: Similar code that should be unified

## Trade-off Guidelines

These four principles often conflict. Here's how to prioritize:

| Situation | Priority |
|-----------|----------|
| High-risk business logic | Cohesion > Coupling |
| Frequently changing UI | Readability > Cohesion |
| Shared utilities | Predictability > all |
| Performance-critical | Coupling > Readability |

Remember: **Perfect code doesn't exist.** The goal is code that's easy to change for your specific context.
