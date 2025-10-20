# Database Design & Optimization Patterns

## Schema Design Principles

### Normalization
```sql
-- Good: Normalized structure
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bad: Denormalized (data duplication)
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255), -- Duplicated data
  user_name VARCHAR(100),  -- Duplicated data
  ...
);
```

### Indexing Strategy
```sql
-- Primary key (automatic index)
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index frequently queried columns
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);

-- Composite index for combined queries
CREATE INDEX idx_products_category_price ON products(category, price);

-- Unique constraint with index
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Partial index for specific conditions
CREATE INDEX idx_active_users ON users(email) WHERE active = true;
```

### Foreign Keys & Relationships
```sql
-- One-to-Many
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT
);

-- Many-to-Many (with junction table)
CREATE TABLE users_roles (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id)
);
```

## Query Optimization

### Avoid N+1 Queries
```typescript
// Bad: N+1 query problem
const users = await User.findMany();
for (const user of users) {
  user.orders = await Order.findMany({ where: { userId: user.id } });
}

// Good: Single query with JOIN or include
const users = await User.findMany({
  include: {
    orders: true
  }
});

// Or with raw SQL
const users = await prisma.$queryRaw`
  SELECT u.*,
         json_agg(o.*) as orders
  FROM users u
  LEFT JOIN orders o ON o.user_id = u.id
  GROUP BY u.id
`;
```

### Use SELECT Wisely
```typescript
// Bad: Selecting all columns
const users = await User.findMany();

// Good: Select only needed columns
const users = await User.findMany({
  select: {
    id: true,
    email: true,
    name: true
  }
});
```

### Pagination & Limits
```typescript
// Always use pagination for large datasets
const getUsers = async (page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    User.count()
  ]);

  return { users, total, page, totalPages: Math.ceil(total / limit) };
};
```

### Query Analysis
```sql
-- Use EXPLAIN to analyze query performance
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5;

-- Look for:
-- - Sequential Scans (bad) vs Index Scans (good)
-- - High execution time
-- - Large row estimates
```

## Transaction Management

### ACID Principles
```typescript
// Use transactions for multi-step operations
const createOrderWithItems = async (userId: number, items: OrderItem[]) => {
  return await prisma.$transaction(async (tx) => {
    // Create order
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'pending'
      }
    });

    // Create order items
    await tx.orderItem.createMany({
      data: items.map(item => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    });

    // Update product inventory
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity }
        }
      });
    }

    return order;
  });
};
```

### Isolation Levels
```typescript
// Handle concurrent operations
await prisma.$transaction(
  async (tx) => {
    // Your transaction logic
  },
  {
    isolationLevel: 'ReadCommitted', // or 'Serializable' for stricter isolation
    maxWait: 5000, // Maximum time to wait for transaction to start
    timeout: 10000 // Maximum time transaction can run
  }
);
```

## Connection Pooling

```typescript
// Configure connection pool
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Connection pool settings
  log: ['query', 'error', 'warn'],
  errorFormat: 'pretty'
});

// For production
const connectionPool = {
  poolSize: 10, // Number of connections
  connectionTimeout: 2000,
  idleTimeout: 10000
};
```

## Caching Strategies

### Query Caching with Redis
```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

const getCachedUser = async (userId: number) => {
  const cacheKey = `user:${userId}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Query database
  const user = await User.findUnique({ where: { id: userId } });

  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(user));

  return user;
};

// Invalidate cache on update
const updateUser = async (userId: number, data: UpdateUserDto) => {
  const user = await User.update({
    where: { id: userId },
    data
  });

  // Invalidate cache
  await redis.del(`user:${userId}`);

  return user;
};
```

## Data Migrations

### Safe Migration Practices
```typescript
// migrations/001_add_user_status.ts
export async function up(prisma: PrismaClient) {
  // Add column with default value
  await prisma.$executeRaw`
    ALTER TABLE users
    ADD COLUMN status VARCHAR(20) DEFAULT 'active' NOT NULL
  `;

  // Create index
  await prisma.$executeRaw`
    CREATE INDEX idx_users_status ON users(status)
  `;
}

export async function down(prisma: PrismaClient) {
  // Rollback changes
  await prisma.$executeRaw`
    DROP INDEX IF EXISTS idx_users_status
  `;

  await prisma.$executeRaw`
    ALTER TABLE users DROP COLUMN status
  `;
}
```

### Zero-Downtime Migrations
```typescript
// Step 1: Add new column (nullable)
ALTER TABLE users ADD COLUMN new_email VARCHAR(255);

// Step 2: Backfill data
UPDATE users SET new_email = email WHERE new_email IS NULL;

// Step 3: Make it required
ALTER TABLE users ALTER COLUMN new_email SET NOT NULL;

// Step 4: Remove old column (after deploy)
ALTER TABLE users DROP COLUMN email;

// Step 5: Rename column
ALTER TABLE users RENAME COLUMN new_email TO email;
```

## Performance Monitoring

```typescript
// Log slow queries
prisma.$on('query', (e) => {
  if (e.duration > 1000) { // Queries taking more than 1 second
    console.warn('Slow query detected:', {
      query: e.query,
      duration: `${e.duration}ms`,
      params: e.params
    });
  }
});

// Monitor connection pool
const poolStats = await prisma.$metrics.json();
console.log('Database metrics:', poolStats);
```

## Backup & Recovery

```bash
# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="myapp"

# Create backup
pg_dump -U postgres $DB_NAME | gzip > "$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"

# Keep only last 7 days
find $BACKUP_DIR -name "${DB_NAME}_*.sql.gz" -mtime +7 -delete

# Restore from backup
# gunzip < backup.sql.gz | psql -U postgres $DB_NAME
```

## SQL vs NoSQL Decision Matrix

| Use SQL When                     | Use NoSQL When                      |
|----------------------------------|-------------------------------------|
| Complex relationships            | Flexible schema needed              |
| ACID transactions required       | High write throughput               |
| Data integrity is critical       | Horizontal scaling required         |
| Structured, relational data      | Document-based data                 |
| Complex queries with JOINs       | Key-value or time-series data       |
| Strong consistency needed        | Eventual consistency acceptable     |
