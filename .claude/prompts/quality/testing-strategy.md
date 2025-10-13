# Testing Strategy

Comprehensive guide to software testing practices.

## Testing Philosophy

### Why Test?

1. **Confidence**: Safe to refactor and change code
2. **Documentation**: Tests show how code should work
3. **Design feedback**: Hard-to-test code is often poorly designed
4. **Regression prevention**: Catch bugs before users do
5. **Faster development**: Find issues immediately, not in production

### Testing Pyramid

```
        /\
       /  \      E2E Tests (Few)
      /____\     - Slow, brittle, expensive
     /      \    - Test critical user journeys
    /        \
   /__________\  Integration Tests (Some)
  /            \ - Test component interactions
 /              \
/________________\ Unit Tests (Many)
                  - Fast, focused, cheap
                  - Test individual functions
```

**Ratio**: 70% unit, 20% integration, 10% E2E (approximate)

## Test Types

### 1. Unit Tests

**Test individual functions/methods in isolation.**

```typescript
// Function to test
function add(a: number, b: number): number {
  return a + b
}

// Unit test
describe('add', () => {
  it('should add two positive numbers', () => {
    expect(add(2, 3)).toBe(5)
  })

  it('should handle negative numbers', () => {
    expect(add(-2, 3)).toBe(1)
  })

  it('should handle zero', () => {
    expect(add(0, 5)).toBe(5)
  })
})
```

**Characteristics**:
- Fast (milliseconds)
- No external dependencies
- Test one thing
- Easy to debug when failing

### 2. Integration Tests

**Test how components work together.**

```typescript
// Integration test
describe('UserService', () => {
  it('should create user and send welcome email', async () => {
    const userService = new UserService(db, emailService)

    const user = await userService.createUser({
      email: 'test@example.com',
      name: 'Test User'
    })

    // Verify user created in database
    const dbUser = await db.users.findById(user.id)
    expect(dbUser).toBeDefined()

    // Verify email sent
    expect(emailService.send).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Welcome'
    })
  })
})
```

**Characteristics**:
- Slower than unit tests
- May use test database
- Test interactions between components
- More realistic scenarios

### 3. End-to-End (E2E) Tests

**Test complete user flows through the application.**

```typescript
// E2E test (Playwright/Cypress)
test('user can sign up and create a post', async ({ page }) => {
  // Navigate to signup page
  await page.goto('/signup')

  // Fill in form
  await page.fill('[name="email"]', 'user@example.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('button[type="submit"]')

  // Verify redirect to dashboard
  await expect(page).toHaveURL('/dashboard')

  // Create a post
  await page.click('text=New Post')
  await page.fill('[name="title"]', 'My First Post')
  await page.fill('[name="content"]', 'Hello world')
  await page.click('text=Publish')

  // Verify post appears
  await expect(page.locator('text=My First Post')).toBeVisible()
})
```

**Characteristics**:
- Slow (seconds to minutes)
- Brittle (UI changes break tests)
- Expensive to maintain
- High confidence when passing

### 4. Smoke Tests

**Quick tests to verify critical functionality.**

```typescript
// Smoke tests - run these first
describe('Smoke Tests', () => {
  it('should load homepage', async () => {
    const response = await fetch('/')
    expect(response.status).toBe(200)
  })

  it('should connect to database', async () => {
    await expect(db.ping()).resolves.not.toThrow()
  })

  it('should connect to Redis', async () => {
    await expect(redis.ping()).resolves.not.toThrow()
  })
})
```

## Testing Best Practices

### AAA Pattern (Arrange-Act-Assert)

```typescript
test('should calculate order total', () => {
  // Arrange - Set up test data
  const order = {
    items: [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 1 }
    ]
  }

  // Act - Execute the code being tested
  const total = calculateTotal(order)

  // Assert - Verify the result
  expect(total).toBe(25)
})
```

### Test Independence

**Each test should run independently.**

```typescript
// ❌ BAD - Tests depend on order
let user
test('creates user', () => {
  user = createUser()
})
test('updates user', () => {
  user.name = 'New Name'
  updateUser(user)
})

// ✅ GOOD - Each test is independent
test('creates user', () => {
  const user = createUser()
  expect(user.id).toBeDefined()
})

test('updates user', () => {
  const user = createUser()
  user.name = 'New Name'
  updateUser(user)
  expect(user.name).toBe('New Name')
})
```

### Clear Test Names

**Test name should describe what is being tested and expected outcome.**

```typescript
// ❌ BAD
test('test1', () => {})
test('user', () => {})

// ✅ GOOD
test('should throw error when email is invalid', () => {})
test('should return empty array when no users exist', () => {})
test('should send welcome email after user registration', () => {})
```

### Test Behavior, Not Implementation

```typescript
// ❌ BAD - Tests implementation details
test('should call sortByDate and then filterByStatus', () => {
  const spy1 = jest.spyOn(service, 'sortByDate')
  const spy2 = jest.spyOn(service, 'filterByStatus')

  service.getActiveOrders()

  expect(spy1).toHaveBeenCalled()
  expect(spy2).toHaveBeenCalled()
})

// ✅ GOOD - Tests behavior
test('should return only active orders sorted by date', () => {
  const orders = service.getActiveOrders()

  expect(orders).toHaveLength(3)
  expect(orders[0].date).toBeGreaterThan(orders[1].date)
  expect(orders.every(o => o.status === 'active')).toBe(true)
})
```

### Don't Test Third-Party Code

```typescript
// ❌ BAD - Testing library code
test('should sort array', () => {
  const sorted = [3, 1, 2].sort()
  expect(sorted).toEqual([1, 2, 3])
})

// ✅ GOOD - Test your code that uses the library
test('should sort users by registration date', () => {
  const users = [user3, user1, user2]
  const sorted = sortUsersByDate(users)
  expect(sorted[0].registeredAt).toBeLessThan(sorted[1].registeredAt)
})
```

## Testing Patterns

### Test Doubles

**1. Stub** - Provides predefined answers
```typescript
const stub = {
  getUser: () => ({ id: 1, name: 'Test User' })
}
```

**2. Mock** - Records interactions
```typescript
const mock = jest.fn()
service.process(mock)
expect(mock).toHaveBeenCalledWith('expected-value')
```

**3. Spy** - Wraps real object
```typescript
const spy = jest.spyOn(service, 'method')
service.method()
expect(spy).toHaveBeenCalled()
```

**4. Fake** - Working implementation (simpler)
```typescript
class FakeDatabase {
  private data = new Map()

  async save(key, value) {
    this.data.set(key, value)
  }

  async get(key) {
    return this.data.get(key)
  }
}
```

### Test Fixtures

**Reusable test data.**

```typescript
// fixtures/users.ts
export const testUsers = {
  admin: {
    id: 1,
    email: 'admin@example.com',
    role: 'admin'
  },
  regular: {
    id: 2,
    email: 'user@example.com',
    role: 'user'
  }
}

// In tests
import { testUsers } from './fixtures/users'

test('admin can delete user', () => {
  const result = canDelete(testUsers.admin, testUsers.regular)
  expect(result).toBe(true)
})
```

### Parameterized Tests

**Test multiple inputs with same logic.**

```typescript
describe.each([
  ['hello', 'Hello'],
  ['WORLD', 'World'],
  ['tEsT', 'Test'],
])('capitalize', (input, expected) => {
  test(`should capitalize "${input}" to "${expected}"`, () => {
    expect(capitalize(input)).toBe(expected)
  })
})
```

### Setup and Teardown

```typescript
describe('Database tests', () => {
  let db

  beforeAll(async () => {
    // Runs once before all tests
    db = await connectToTestDB()
  })

  afterAll(async () => {
    // Runs once after all tests
    await db.disconnect()
  })

  beforeEach(async () => {
    // Runs before each test
    await db.clear()
  })

  afterEach(async () => {
    // Runs after each test
    await db.rollback()
  })

  test('should create user', async () => {
    // Test code
  })
})
```

## Testing Async Code

```typescript
// Promises
test('should fetch user', async () => {
  const user = await fetchUser(1)
  expect(user.name).toBe('Test User')
})

// Callbacks
test('should call callback', (done) => {
  fetchUser(1, (user) => {
    expect(user.name).toBe('Test User')
    done()
  })
})

// Error handling
test('should throw error', async () => {
  await expect(fetchUser(999)).rejects.toThrow('User not found')
})
```

## Testing React Components

```typescript
import { render, screen, fireEvent } from '@testing-library/react'

test('should display counter and increment', () => {
  render(<Counter />)

  // Find elements
  const button = screen.getByRole('button', { name: /increment/i })
  const count = screen.getByText(/count: 0/i)

  expect(count).toBeInTheDocument()

  // Interact
  fireEvent.click(button)

  // Assert updated state
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument()
})

test('should call onSubmit with form data', () => {
  const onSubmit = jest.fn()
  render(<Form onSubmit={onSubmit} />)

  // Fill form
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'John' }
  })

  fireEvent.click(screen.getByRole('button', { name: /submit/i }))

  expect(onSubmit).toHaveBeenCalledWith({ name: 'John' })
})
```

## Test Coverage

**Coverage measures how much code is executed by tests.**

```bash
# Run with coverage
npm test -- --coverage

# Coverage types
- Lines: % of lines executed
- Functions: % of functions called
- Branches: % of if/else branches taken
- Statements: % of statements executed
```

**Coverage goals**:
- Critical code: 90%+
- Overall codebase: 70-80%
- Don't chase 100% (diminishing returns)

**Coverage ≠ Quality**: Can have 100% coverage with poor tests.

## Test Organization

### File Structure

```
src/
  components/
    Button.tsx
    Button.test.tsx        # Next to implementation
  services/
    UserService.ts
    UserService.test.ts
  __tests__/
    integration/           # Or separate folder
      user-flow.test.ts
    e2e/
      checkout.test.ts
```

### Test Grouping

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    test('should create user with valid data', () => {})
    test('should throw error with invalid email', () => {})
    test('should hash password', () => {})
  })

  describe('updateUser', () => {
    test('should update user fields', () => {})
    test('should not update email', () => {})
  })
})
```

## Testing Checklist

Before considering code done:

- [ ] Unit tests for all public functions
- [ ] Edge cases covered (null, empty, invalid input)
- [ ] Error cases tested
- [ ] Happy path tested
- [ ] Integration tests for component interactions
- [ ] E2E tests for critical user flows
- [ ] All tests passing
- [ ] Coverage meets requirements
- [ ] Tests are readable and maintainable
- [ ] No flaky tests (intermittent failures)

## Common Testing Mistakes

### ❌ Testing Implementation Details

Focus on behavior, not how it's implemented.

### ❌ Too Many Mocks

Over-mocking makes tests brittle. Use real objects when possible.

### ❌ Unclear Test Failures

When test fails, should be immediately obvious why.

### ❌ Slow Test Suite

Keep tests fast. Slow tests won't be run frequently.

### ❌ Brittle E2E Tests

Use stable selectors (data-testid), not CSS classes.

### ❌ Not Testing Error Cases

Test unhappy paths, not just happy paths.

## Summary

**Good tests**:
1. **Fast**: Run in milliseconds
2. **Independent**: Can run in any order
3. **Repeatable**: Same result every time
4. **Self-validating**: Pass/fail is automatic
5. **Timely**: Written with or before code

**Test the right things**:
- Unit tests for logic
- Integration tests for interactions
- E2E tests for critical flows
- Don't test implementation details
- Focus on behavior

**Remember**: Tests are code too—keep them clean, readable, and maintainable. Good tests enable confident refactoring and faster development.
