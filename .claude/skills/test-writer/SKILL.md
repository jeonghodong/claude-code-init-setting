---
name: Test Writer
description: Write high-quality test code following FIRST and DAMP principles. Use when writing tests, creating test cases, or when the user mentions "write test", "create test", "test coverage", "unit test", "integration test", or "e2e test". Specializes in business behavior-driven test specifications.
---

# Test Writer

## Purpose

This skill enables Claude to write comprehensive, high-quality test code following industry best practices (FIRST and DAMP principles). It focuses on creating business behavior-driven tests that are understandable even to non-developers.

## When to Use

Claude should use this skill when:
- User asks to write tests for a function, component, or module
- User wants to increase test coverage for specific code
- User mentions test types: unit, integration, or e2e tests
- User needs test cases for new features
- User wants to improve existing test quality
- User says things like "write tests for this", "create test coverage", "test this component"

## Instructions

Follow this systematic process when writing tests:

### 1. Analyze the Test Target

Before writing tests, understand what needs to be tested:

**For Functions/Utilities**:
- Input parameters and their types
- Return values and edge cases
- Side effects (if any)
- Error conditions
- Dependencies and mocks needed

**For Components**:
- Props and their variations
- User interactions (clicks, inputs)
- Rendering conditions
- State changes
- Child component interactions

**For APIs/Endpoints**:
- Request/response formats
- Success scenarios
- Error scenarios
- Authentication/authorization
- Data validation

### 2. Design Test Cases

Create test cases following business behavior:

**Use descriptive test names** that explain WHAT and WHY:
```typescript
// ✅ Good - Business behavior focused
describe("UserRegistration", () => {
  it("should create new user account when valid email and password provided", () => {})
  it("should reject registration when email already exists", () => {})
  it("should send verification email after successful registration", () => {})
})

// ❌ Bad - Technical implementation focused
describe("UserRegistration", () => {
  it("should call createUser()", () => {})
  it("should return 409", () => {})
  it("should call sendEmail()", () => {})
})
```

**Cover these scenarios**:
1. **Happy path** - Normal, expected usage
2. **Edge cases** - Boundary conditions, empty values, nulls
3. **Error cases** - Invalid input, failures, exceptions
4. **Integration cases** - Multiple components working together

### 3. Implement Tests

Follow these principles:

#### FIRST Principles

**F - Fast**: Tests should run quickly
```typescript
// ✅ Good - Fast unit test
it("should calculate total price correctly", () => {
  const result = calculateTotal([10, 20, 30]);
  expect(result).toBe(60);
});

// ❌ Bad - Slow integration test when unit test is enough
it("should calculate total price correctly", async () => {
  const result = await fetchAndCalculateTotal([10, 20, 30]);
  expect(result).toBe(60);
});
```

**I - Independent**: Tests don't depend on each other
```typescript
// ✅ Good - Independent tests
describe("ShoppingCart", () => {
  it("should add item to empty cart", () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: 1, name: "Item" });
    expect(cart.items).toHaveLength(1);
  });

  it("should remove item from cart", () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: 1, name: "Item" });
    cart.removeItem(1);
    expect(cart.items).toHaveLength(0);
  });
});

// ❌ Bad - Tests depend on execution order
let sharedCart; // ❌ Shared state
it("should add item", () => {
  sharedCart = new ShoppingCart();
  sharedCart.addItem({ id: 1, name: "Item" });
});
it("should remove item", () => {
  sharedCart.removeItem(1); // ❌ Depends on previous test
});
```

**R - Repeatable**: Same results every time
```typescript
// ✅ Good - Deterministic
it("should format date correctly", () => {
  const date = new Date("2024-01-15");
  expect(formatDate(date)).toBe("2024-01-15");
});

// ❌ Bad - Non-deterministic
it("should format today's date", () => {
  const today = new Date(); // ❌ Changes every day
  expect(formatDate(today)).toBe("2024-01-15");
});
```

**S - Self-validating**: Clear pass/fail
```typescript
// ✅ Good - Automatic validation
it("should validate email format", () => {
  expect(isValidEmail("test@example.com")).toBe(true);
  expect(isValidEmail("invalid")).toBe(false);
});

// ❌ Bad - Manual verification needed
it("should validate email format", () => {
  const result = isValidEmail("test@example.com");
  console.log(result); // ❌ Requires manual check
});
```

**T - Timely**: Write tests when code is fresh
- Write tests alongside implementation
- Don't defer test writing

#### DAMP Principles (Descriptive and Meaningful Phrases)

**Prefer readability over DRY in tests**:
```typescript
// ✅ Good - DAMP: Clear and readable
describe("User Authentication", () => {
  it("should successfully log in user with valid credentials", () => {
    const user = { email: "user@example.com", password: "validPass123" };
    const result = login(user);
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
  });

  it("should reject login with invalid password", () => {
    const user = { email: "user@example.com", password: "wrongPass" };
    const result = login(user);
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid credentials");
  });
});

// ❌ Bad - Too DRY: Hard to understand
describe("User Authentication", () => {
  const testLogin = (pwd, expected) => {
    const result = login({ email: "user@example.com", password: pwd });
    expect(result.success).toBe(expected.success);
  };

  it("valid", () => testLogin("validPass123", { success: true }));
  it("invalid", () => testLogin("wrongPass", { success: false }));
});
```

#### AAA Pattern (Arrange-Act-Assert)

Structure tests clearly:
```typescript
it("should add item to shopping cart", () => {
  // Arrange - Setup test data and dependencies
  const cart = new ShoppingCart();
  const item = { id: 1, name: "Product", price: 100 };

  // Act - Execute the code being tested
  cart.addItem(item);

  // Assert - Verify the outcome
  expect(cart.items).toHaveLength(1);
  expect(cart.items[0]).toEqual(item);
  expect(cart.total).toBe(100);
});
```

### 4. Write Test Code

Use appropriate testing library for the project:

**For React Components (React Testing Library)**:
```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("should render with correct text", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("should call onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText("Click Me"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeDisabled();
  });
});
```

**For Functions/Utilities (Jest)**:
```typescript
import { calculateTotal, validateEmail } from "./utils";

describe("calculateTotal", () => {
  it("should return sum of all numbers in array", () => {
    expect(calculateTotal([10, 20, 30])).toBe(60);
  });

  it("should return 0 for empty array", () => {
    expect(calculateTotal([])).toBe(0);
  });

  it("should handle negative numbers correctly", () => {
    expect(calculateTotal([10, -5, 3])).toBe(8);
  });
});

describe("validateEmail", () => {
  it("should return true for valid email addresses", () => {
    expect(validateEmail("user@example.com")).toBe(true);
    expect(validateEmail("test.user@domain.co.uk")).toBe(true);
  });

  it("should return false for invalid email addresses", () => {
    expect(validateEmail("invalid")).toBe(false);
    expect(validateEmail("@example.com")).toBe(false);
    expect(validateEmail("user@")).toBe(false);
  });
});
```

**For Async Functions**:
```typescript
describe("fetchUserData", () => {
  it("should return user data when API call succeeds", async () => {
    const mockData = { id: 1, name: "John" };
    jest.spyOn(api, "get").mockResolvedValue(mockData);

    const result = await fetchUserData(1);

    expect(result).toEqual(mockData);
    expect(api.get).toHaveBeenCalledWith("/users/1");
  });

  it("should throw error when API call fails", async () => {
    jest.spyOn(api, "get").mockRejectedValue(new Error("Network error"));

    await expect(fetchUserData(1)).rejects.toThrow("Network error");
  });
});
```

**For Hooks (React)**:
```typescript
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("should initialize with default value", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it("should increment count when increment is called", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("should initialize with custom value", () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });
});
```

## Guidelines

### Do's ✅

- **Use descriptive test names** - Explain business behavior
- **Follow AAA pattern** - Clear structure
- **Test behavior, not implementation** - Focus on outcomes
- **Cover edge cases** - Empty, null, invalid values
- **Mock external dependencies** - Keep tests isolated
- **Write readable tests** - DAMP over DRY
- **Test user perspective** - What users care about
- **Keep tests simple** - One concept per test

### Don'ts ❌

- **Don't test implementation details** - Test behavior instead
- **Don't share state between tests** - Keep independent
- **Don't use random data** - Use deterministic values
- **Don't skip error cases** - Test failures too
- **Don't make tests complex** - Keep simple and clear
- **Don't ignore test coverage** - Aim for high coverage
- **Don't write slow tests** - Keep them fast

## Test Types

### Unit Tests
Test individual functions or components in isolation:
- **Scope**: Single function/component
- **Speed**: Very fast (milliseconds)
- **Dependencies**: Mocked
- **Purpose**: Verify individual units work correctly

```typescript
// Unit test example
describe("formatCurrency", () => {
  it("should format number as USD currency", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });
});
```

### Integration Tests
Test multiple components working together:
- **Scope**: Multiple units combined
- **Speed**: Moderate (seconds)
- **Dependencies**: Some real, some mocked
- **Purpose**: Verify components integrate correctly

```typescript
// Integration test example
describe("User Registration Flow", () => {
  it("should create user and send welcome email", async () => {
    const userData = { email: "user@example.com", password: "pass123" };

    const user = await createUser(userData);
    const emailSent = await sendWelcomeEmail(user.email);

    expect(user).toBeDefined();
    expect(emailSent).toBe(true);
  });
});
```

### E2E Tests
Test complete user flows:
- **Scope**: Full application flow
- **Speed**: Slow (minutes)
- **Dependencies**: Real (or staging environment)
- **Purpose**: Verify end-to-end functionality

```typescript
// E2E test example (Playwright/Cypress)
describe("Complete Purchase Flow", () => {
  it("should allow user to purchase product", async () => {
    await page.goto("/products");
    await page.click('[data-testid="product-1"]');
    await page.click('[data-testid="add-to-cart"]');
    await page.click('[data-testid="checkout"]');
    await page.fill('[data-testid="card-number"]', "4242424242424242");
    await page.click('[data-testid="complete-purchase"]');

    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
});
```

## Output Format

When creating tests, provide:

```markdown
## Test Coverage Created

### File: [test-file-path]

**Test Type**: [Unit/Integration/E2E]

**Coverage**:
- [Component/Function Name]
  - ✅ Happy path scenarios
  - ✅ Edge cases
  - ✅ Error handling
  - ✅ [Specific scenarios tested]

**Tests Written**: [number]

### Test Examples

\`\`\`typescript
// Show 2-3 key test examples
\`\`\`

### Recommendations
- [Suggestion 1]
- [Suggestion 2]

### Next Steps
- Run tests: `npm test [file-path]`
- Check coverage: `npm test -- --coverage`
```

## Quality Checklist

Before completing, verify:
- [ ] Test names clearly describe behavior
- [ ] AAA pattern followed (Arrange-Act-Assert)
- [ ] FIRST principles applied (Fast, Independent, Repeatable, Self-validating, Timely)
- [ ] DAMP principles applied (Descriptive and Meaningful Phrases)
- [ ] Happy path covered
- [ ] Edge cases covered
- [ ] Error cases covered
- [ ] Dependencies properly mocked
- [ ] Tests are independent
- [ ] Tests are deterministic
- [ ] Code follows project test conventions

## Examples

### Example 1: Writing Component Tests

**User Request**: "Write tests for the Button component"

**Action**:
1. Analyze Button component - props, behavior, interactions
2. Design test cases:
   - Rendering with different props
   - Click handling
   - Disabled state
   - Different variants
3. Write tests using React Testing Library
4. Verify all scenarios covered

**Outcome**: Comprehensive Button component tests

### Example 2: Writing Utility Function Tests

**User Request**: "Create tests for the validation utilities"

**Action**:
1. Analyze validation functions - email, password, phone
2. Design test cases:
   - Valid inputs
   - Invalid inputs
   - Edge cases (empty, null, special chars)
3. Write tests using Jest
4. Ensure 100% coverage

**Outcome**: Complete validation utility tests

## Best Practices

### Naming Conventions
```typescript
// ✅ Good - Business behavior focused
describe("Shopping Cart", () => {
  describe("adding items", () => {
    it("should add item to empty cart", () => {})
    it("should increase quantity when same item added twice", () => {})
    it("should calculate correct total with multiple items", () => {})
  })

  describe("removing items", () => {
    it("should remove item completely from cart", () => {})
    it("should decrease quantity when removing partial amount", () => {})
  })
})

// ❌ Bad - Implementation focused
describe("ShoppingCart", () => {
  it("test1", () => {})
  it("addItem works", () => {})
  it("calls calculateTotal", () => {})
})
```

### Mock Management
```typescript
// ✅ Good - Clear mock setup
describe("UserService", () => {
  let apiMock: jest.Mock;

  beforeEach(() => {
    apiMock = jest.spyOn(api, "get").mockResolvedValue({ id: 1 });
  });

  afterEach(() => {
    apiMock.mockRestore();
  });

  it("should fetch user data", async () => {
    const user = await UserService.getUser(1);
    expect(user.id).toBe(1);
  });
});
```

### Test Data
```typescript
// ✅ Good - Descriptive test data
const validUser = {
  email: "user@example.com",
  password: "SecurePass123!",
  name: "John Doe"
};

const invalidUser = {
  email: "invalid-email",
  password: "weak",
  name: ""
};

// ❌ Bad - Unclear test data
const user1 = { email: "a", password: "b", name: "c" };
const user2 = { email: "x", password: "y", name: "z" };
```

---

**Note**: This skill focuses on writing new tests. For running and fixing existing tests, use the Test Runner skill instead.
