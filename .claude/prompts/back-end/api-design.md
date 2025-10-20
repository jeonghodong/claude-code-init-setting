# API Design Guidelines

## REST API Best Practices

### HTTP Methods & Status Codes
- **GET**: Retrieve resources (200, 404)
- **POST**: Create new resources (201, 400, 409)
- **PUT**: Full update of resources (200, 404)
- **PATCH**: Partial update of resources (200, 404)
- **DELETE**: Remove resources (204, 404)

### Response Structure
```typescript
// Success Response
{
  data: T | T[],
  meta?: {
    page?: number,
    limit?: number,
    total?: number
  }
}

// Error Response
{
  error: {
    code: string,
    message: string,
    details?: Record<string, any>
  }
}
```

### URL Conventions
- Use nouns, not verbs: `/users` not `/getUsers`
- Use plural names: `/products` not `/product`
- Use nested resources: `/users/:id/orders`
- Use query params for filtering: `/products?category=electronics&sort=price`
- Version your API: `/api/v1/users`

### Input Validation
```typescript
// Always validate and sanitize input
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100)
});

// Use middleware for validation
app.post('/users', validate(userSchema), createUser);
```

### Rate Limiting
```typescript
// Implement rate limiting for all public endpoints
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## GraphQL Best Practices

### Schema Design
```graphql
# Use clear, descriptive names
type User {
  id: ID!
  email: String!
  name: String!
  createdAt: DateTime!
  orders: [Order!]!
}

# Implement pagination
type Query {
  users(
    first: Int
    after: String
    orderBy: UserOrderBy
  ): UserConnection!
}

type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
}
```

### Resolver Patterns
```typescript
// Use DataLoader to prevent N+1 queries
const userLoader = new DataLoader(async (ids) => {
  const users = await User.findByIds(ids);
  return ids.map(id => users.find(u => u.id === id));
});

// Implement field-level authorization
const resolvers = {
  User: {
    email: (user, args, context) => {
      if (context.userId !== user.id && !context.isAdmin) {
        throw new ForbiddenError('Cannot view other user emails');
      }
      return user.email;
    }
  }
};
```

## API Security

### Authentication Headers
```typescript
// Use Bearer token authentication
Authorization: Bearer <jwt_token>

// Verify token in middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### CORS Configuration
```typescript
// Configure CORS properly
import cors from 'cors';

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Input Sanitization
```typescript
// Sanitize all user input to prevent XSS and injection
import sanitizeHtml from 'sanitize-html';

const sanitizeInput = (input: string) => {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {}
  });
};
```

## Documentation

### OpenAPI/Swagger
```typescript
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
```

## Error Handling

### Standard Error Codes
```typescript
export const API_ERRORS = {
  // Client Errors (4xx)
  INVALID_INPUT: { code: 'INVALID_INPUT', status: 400 },
  UNAUTHORIZED: { code: 'UNAUTHORIZED', status: 401 },
  FORBIDDEN: { code: 'FORBIDDEN', status: 403 },
  NOT_FOUND: { code: 'NOT_FOUND', status: 404 },
  CONFLICT: { code: 'CONFLICT', status: 409 },
  RATE_LIMIT: { code: 'RATE_LIMIT_EXCEEDED', status: 429 },

  // Server Errors (5xx)
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', status: 500 },
  SERVICE_UNAVAILABLE: { code: 'SERVICE_UNAVAILABLE', status: 503 }
};
```

## Performance

### Response Compression
```typescript
import compression from 'compression';

// Compress responses
app.use(compression());
```

### Caching Headers
```typescript
// Set appropriate cache headers
app.get('/products', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  // ... send response
});

// No cache for dynamic content
app.get('/users/:id', authenticate, (req, res) => {
  res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  // ... send response
});
```

### Pagination
```typescript
// Always paginate large datasets
interface PaginationParams {
  page?: number;
  limit?: number;
}

const getUsers = async ({ page = 1, limit = 20 }: PaginationParams) => {
  const offset = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.findMany({ skip: offset, take: limit }),
    User.count()
  ]);

  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
```
