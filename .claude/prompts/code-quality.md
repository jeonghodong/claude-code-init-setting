# Code Quality Guidelines

## General Principles

### Clean Code
- Write self-documenting code
- Use meaningful variable and function names
- Keep functions small and focused (single responsibility)
- Avoid deep nesting (max 3 levels)
- DRY (Don't Repeat Yourself)

### Code Organization
- Group related functionality
- Consistent file and folder structure
- Separate concerns (business logic, UI, data access)
- Use design patterns appropriately

## Language-Specific Best Practices

### TypeScript/JavaScript
```typescript
// ✅ Good: Type-safe, clear intent
interface User {
  id: string;
  name: string;
  email: string;
}

async function getUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error('User not found');
  return response.json();
}

// ❌ Bad: Any types, unclear error handling
async function getUser(id: any): Promise<any> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

### Python
```python
# ✅ Good: Type hints, clear structure
from typing import Optional

def calculate_total(items: list[dict], tax_rate: float = 0.1) -> float:
    """Calculate total with tax."""
    subtotal = sum(item['price'] for item in items)
    return subtotal * (1 + tax_rate)

# ❌ Bad: No types, unclear
def calc(items, tax=0.1):
    return sum(i['price'] for i in items) * (1 + tax)
```

## Error Handling

### Robust Error Handling
```typescript
// ✅ Good: Specific error handling
try {
  const data = await fetchData();
  return processData(data);
} catch (error) {
  if (error instanceof ValidationError) {
    logger.warn('Validation failed', { error });
    throw new BadRequestError(error.message);
  }
  logger.error('Unexpected error', { error });
  throw new InternalServerError();
}

// ❌ Bad: Silent failures
try {
  const data = await fetchData();
  return processData(data);
} catch (error) {
  console.log(error);
}
```

## Performance Considerations

- Avoid premature optimization
- Profile before optimizing
- Use appropriate data structures
- Minimize unnecessary re-renders (React)
- Implement pagination for large datasets
- Use caching strategically

## Testing

- Write tests for business logic
- Test edge cases and error scenarios
- Keep tests independent and isolated
- Use meaningful test descriptions
- Aim for high coverage but focus on critical paths

## Code Review Checklist

- [ ] Code is readable and well-structured
- [ ] No obvious bugs or logic errors
- [ ] Error handling is comprehensive
- [ ] Security best practices followed
- [ ] Performance is acceptable
- [ ] Tests cover new functionality
- [ ] Documentation is updated
- [ ] No sensitive data exposed
