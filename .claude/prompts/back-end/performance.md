# Backend Performance Optimization

## Database Query Optimization

### Use Indexes Effectively
```typescript
// Bad: Sequential scan
SELECT * FROM users WHERE email = 'user@example.com';

// Good: Index scan (create index first)
CREATE INDEX idx_users_email ON users(email);

// Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';
```

### Avoid N+1 Queries
```typescript
// Bad: N+1 query problem
const users = await User.findMany();
for (const user of users) {
  user.posts = await Post.findMany({ where: { userId: user.id } });
}
// This makes 1 query for users + N queries for posts

// Good: Single query with include
const users = await User.findMany({
  include: {
    posts: true
  }
});
// This makes 1-2 queries total using JOIN
```

### Connection Pooling
```typescript
// Configure optimal pool size
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Reuse connections
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};
```

### Batch Operations
```typescript
// Bad: Multiple individual queries
for (const user of users) {
  await User.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });
}

// Good: Single batch update
await User.updateMany({
  where: {
    id: { in: users.map(u => u.id) }
  },
  data: { lastLogin: new Date() }
});

// Good: Batch insert
await User.createMany({
  data: newUsers
});
```

## Caching Strategies

### Redis Caching
```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache-aside pattern
const getUserProfile = async (userId: number) => {
  const cacheKey = `user:profile:${userId}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Query database
  const user = await User.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      posts: {
        take: 10,
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(user));

  return user;
};

// Cache invalidation
const updateUserProfile = async (userId: number, data: UpdateProfileDto) => {
  const user = await User.update({
    where: { id: userId },
    data
  });

  // Invalidate cache
  await redis.del(`user:profile:${userId}`);

  return user;
};
```

### Multi-Level Caching
```typescript
import NodeCache from 'node-cache';

// In-memory cache (L1)
const memoryCache = new NodeCache({ stdTTL: 60 }); // 1 minute

// Redis cache (L2)
const getWithMultiLevelCache = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300
): Promise<T> => {
  // L1: Memory cache
  const memCached = memoryCache.get<T>(key);
  if (memCached) {
    return memCached;
  }

  // L2: Redis cache
  const redisCached = await redis.get(key);
  if (redisCached) {
    const data = JSON.parse(redisCached) as T;
    memoryCache.set(key, data, 60); // Cache in memory for 1 min
    return data;
  }

  // L3: Database
  const data = await fetcher();

  // Store in both caches
  await redis.setex(key, ttl, JSON.stringify(data));
  memoryCache.set(key, data, 60);

  return data;
};
```

### Cache Patterns
```typescript
// Write-through cache
const createPost = async (data: CreatePostDto) => {
  // Write to database
  const post = await Post.create({ data });

  // Write to cache
  await redis.setex(`post:${post.id}`, 3600, JSON.stringify(post));

  return post;
};

// Write-behind cache
const updateViewCount = async (postId: number) => {
  // Update cache immediately
  await redis.hincrby(`post:${postId}:stats`, 'views', 1);

  // Batch update to database (every minute)
  await queue.add('updatePostViews', { postId });
};
```

## Async Processing & Message Queues

### Bull Queue (Redis-based)
```typescript
import Queue from 'bull';

// Create queue
const emailQueue = new Queue('email', process.env.REDIS_URL);

// Producer: Add job to queue
const sendWelcomeEmail = async (userId: number, email: string) => {
  await emailQueue.add('welcome', {
    userId,
    email
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  });
};

// Consumer: Process jobs
emailQueue.process('welcome', async (job) => {
  const { userId, email } = job.data;

  try {
    await sendEmail({
      to: email,
      subject: 'Welcome!',
      template: 'welcome'
    });

    await User.update({
      where: { id: userId },
      data: { welcomeEmailSent: true }
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error; // Job will be retried
  }
});
```

### Background Jobs
```typescript
// Heavy computation in background
const processLargeFile = async (fileId: number) => {
  // Add to queue instead of processing synchronously
  await processingQueue.add('processFile', { fileId });

  return { message: 'File processing started', fileId };
};

// Worker processes jobs
processingQueue.process('processFile', async (job) => {
  const { fileId } = job.data;

  // Update status
  await File.update({
    where: { id: fileId },
    data: { status: 'processing' }
  });

  try {
    // Heavy processing
    const result = await heavyProcessing(fileId);

    await File.update({
      where: { id: fileId },
      data: {
        status: 'completed',
        result
      }
    });
  } catch (error) {
    await File.update({
      where: { id: fileId },
      data: {
        status: 'failed',
        error: error.message
      }
    });
    throw error;
  }
});
```

## Response Optimization

### Compression
```typescript
import compression from 'compression';

app.use(compression({
  level: 6, // Compression level (0-9)
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

### Response Caching
```typescript
// Cache-Control headers
app.get('/products', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  res.json(products);
});

// Private cache (user-specific)
app.get('/profile', authenticate, (req, res) => {
  res.set('Cache-Control', 'private, max-age=60');
  res.json(userProfile);
});

// No cache for dynamic content
app.post('/orders', authenticate, (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json(order);
});
```

### Pagination
```typescript
// Efficient pagination
const getPosts = async (page: number = 1, limit: number = 20) => {
  const offset = (page - 1) * limit;

  // Use cursor-based pagination for large datasets
  const posts = await Post.findMany({
    take: limit + 1, // Fetch one extra to know if there's a next page
    skip: offset,
    orderBy: { createdAt: 'desc' }
  });

  const hasNextPage = posts.length > limit;
  const data = hasNextPage ? posts.slice(0, -1) : posts;

  return {
    data,
    pagination: {
      page,
      limit,
      hasNextPage,
      nextPage: hasNextPage ? page + 1 : null
    }
  };
};
```

### Response Streaming
```typescript
import { pipeline } from 'stream';
import { createGzip } from 'zlib';

// Stream large files
app.get('/download/:fileId', async (req, res) => {
  const fileStream = await getFileStream(req.params.fileId);

  res.set({
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': 'attachment; filename="file.zip"',
    'Content-Encoding': 'gzip'
  });

  pipeline(
    fileStream,
    createGzip(),
    res,
    (err) => {
      if (err) {
        console.error('Stream error:', err);
      }
    }
  );
});
```

## Load Balancing & Clustering

### Cluster Mode (Node.js)
```typescript
import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  console.log(`Master process ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Replace dead worker
  });
} else {
  // Workers can share TCP connection
  startServer();
  console.log(`Worker ${process.pid} started`);
}
```

## Monitoring & Profiling

### Performance Metrics
```typescript
import { performance } from 'perf_hooks';

// Measure endpoint performance
const measurePerformance = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = performance.now();

  res.on('finish', () => {
    const duration = performance.now() - start;

    // Log slow requests
    if (duration > 1000) {
      console.warn('Slow request:', {
        method: req.method,
        url: req.url,
        duration: `${duration.toFixed(2)}ms`,
        statusCode: res.statusCode
      });
    }

    // Send to monitoring service
    metrics.timing('http.request.duration', duration, {
      method: req.method,
      route: req.route?.path,
      status: res.statusCode.toString()
    });
  });

  next();
};

app.use(measurePerformance);
```

### Memory Monitoring
```typescript
// Monitor memory usage
setInterval(() => {
  const used = process.memoryUsage();
  console.log('Memory usage:', {
    rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(used.external / 1024 / 1024)} MB`
  });
}, 60000); // Every minute

// Handle memory warnings
process.on('warning', (warning) => {
  console.warn('Process warning:', warning);
});
```

## Best Practices Summary

1. **Database**: Use indexes, avoid N+1, implement connection pooling
2. **Caching**: Multi-level caching (memory → Redis → DB)
3. **Async**: Use queues for heavy operations
4. **Compression**: Enable gzip compression
5. **Pagination**: Always paginate large datasets
6. **Streaming**: Stream large files instead of loading into memory
7. **Monitoring**: Track performance metrics and memory usage
8. **Load balancing**: Use clustering for CPU-intensive apps
