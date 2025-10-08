# Performance Optimization Strategies

## Frontend Optimization

### 1. Bundle Size Reduction
```bash
# Analyze bundle
npm run build
npx @next/bundle-analyzer

# Strategies:
- Code splitting (dynamic imports)
- Tree shaking (remove unused code)
- Remove duplicate dependencies
- Use lighter alternatives
```

### 2. Code Splitting
```typescript
// Dynamic imports for routes
const Dashboard = dynamic(() => import('./Dashboard'), {
  loading: () => <Skeleton />,
});

// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));
```

### 3. Image Optimization
```tsx
// Next.js Image component
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // for LCP
  placeholder="blur"
  blurDataURL="..."
/>

// Formats: WebP, AVIF
// Responsive sizing
// Lazy loading by default
```

### 4. React Performance
```typescript
// Memoization
const MemoizedComponent = memo(Component);

const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// Virtualization for long lists
import { FixedSizeList } from 'react-window';
```

### 5. Web Vitals Optimization

**LCP (Largest Contentful Paint) < 2.5s**
- Optimize images
- Preload critical resources
- Server-side rendering
- Remove render-blocking resources

**FID (First Input Delay) < 100ms**
- Code splitting
- Defer non-critical JavaScript
- Use web workers for heavy tasks

**CLS (Cumulative Layout Shift) < 0.1**
- Set dimensions for images/videos
- Avoid inserting content above existing
- Use transform for animations

## Backend Optimization

### 1. Database Query Optimization
```sql
-- Add indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_created_at ON orders(created_at);

-- Use EXPLAIN to analyze
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;

-- Avoid N+1 queries (use joins or batch loading)
SELECT users.*, orders.* FROM users
LEFT JOIN orders ON users.id = orders.user_id
WHERE users.id IN (1,2,3);
```

### 2. Caching Strategies
```typescript
// In-memory cache
import { LRUCache } from 'lru-cache';

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

// Redis cache
import Redis from 'ioredis';
const redis = new Redis();

async function getData(key: string) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const data = await fetchFromDB(key);
  await redis.setex(key, 300, JSON.stringify(data));
  return data;
}

// HTTP cache headers
res.set('Cache-Control', 'public, max-age=3600, s-maxage=7200');
```

### 3. API Response Optimization
```typescript
// Pagination
interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

// Field selection (sparse fieldsets)
GET /api/users?fields=id,name,email

// Compression
import compression from 'compression';
app.use(compression());

// Response streaming for large data
res.writeHead(200, { 'Content-Type': 'application/json' });
res.write('[');
for await (const item of largeDataset) {
  res.write(JSON.stringify(item) + ',');
}
res.write(']');
res.end();
```

### 4. Background Processing
```typescript
// Use job queues for heavy tasks
import { Queue } from 'bullmq';

const emailQueue = new Queue('emails');

// Enqueue
await emailQueue.add('send', {
  to: user.email,
  subject: 'Welcome',
});

// Process asynchronously
const worker = new Worker('emails', async (job) => {
  await sendEmail(job.data);
});
```

## Infrastructure Optimization

### 1. CDN Configuration
- Static assets on CDN
- Edge caching
- Geographic distribution
- Cache invalidation strategy

### 2. Load Balancing
- Distribute traffic across servers
- Health checks
- Auto-scaling rules
- Session affinity (if needed)

### 3. Database Scaling
- Read replicas for read-heavy workloads
- Connection pooling
- Sharding for horizontal scaling
- Vertical scaling (upgrade hardware)

## Monitoring & Profiling

### Frontend
```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);

// React Profiler
<Profiler id="Navigation" onRender={onRenderCallback}>
  <Navigation />
</Profiler>
```

### Backend
```typescript
// APM (Application Performance Monitoring)
import * as Sentry from '@sentry/node';

Sentry.init({ dsn: process.env.SENTRY_DSN });

// Custom instrumentation
const startTime = Date.now();
await processRequest();
const duration = Date.now() - startTime;
logger.info('Request processed', { duration });
```

## Performance Budget

Set and monitor performance budgets:
- JavaScript bundle: < 200kb
- CSS bundle: < 50kb
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- API response time: < 200ms (p95)

## Checklist

- [ ] Images optimized (WebP, proper sizing)
- [ ] Code splitting implemented
- [ ] Critical resources preloaded
- [ ] Database queries indexed
- [ ] Caching strategy in place
- [ ] CDN configured for static assets
- [ ] Monitoring and alerts set up
- [ ] Performance budget defined
- [ ] Regular performance audits scheduled
