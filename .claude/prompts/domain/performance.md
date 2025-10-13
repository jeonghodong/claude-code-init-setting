# Performance Optimization

Guidelines for identifying and fixing performance issues.

## Performance Optimization Principles

### 1. Measure First

**Never optimize without data.**

"Premature optimization is the root of all evil." — Donald Knuth

**Process**:
1. Measure current performance
2. Identify bottlenecks (profiling)
3. Optimize the bottleneck
4. Measure again
5. Repeat if needed

### 2. User-Perceived Performance Matters Most

**What users feel is more important than raw metrics.**

**Focus on**:
- Time to first paint
- Time to interactive
- Perceived responsiveness
- Loading states and feedback

### 3. Optimize the Right Things

**80/20 rule**: 80% of performance issues come from 20% of code.

**Priority**:
1. User-facing bottlenecks
2. High-frequency operations
3. Resource-intensive operations
4. Network requests

## Performance Measurement

### Frontend Metrics

**Core Web Vitals**:
- **LCP (Largest Contentful Paint)**: <2.5s
- **FID (First Input Delay)**: <100ms
- **CLS (Cumulative Layout Shift)**: <0.1

**Other metrics**:
- TTFB (Time To First Byte)
- FCP (First Contentful Paint)
- TTI (Time To Interactive)

### Backend Metrics

**Response Time**:
- p50 (median): Typical user experience
- p95: Most users' experience
- p99: Worst-case (catch issues)

**Throughput**: Requests per second
**Error Rate**: % of failed requests
**Resource Usage**: CPU, memory, DB connections

### Profiling Tools

**Browser**:
```javascript
// Performance API
const start = performance.now()
// ... operation ...
const duration = performance.now() - start
console.log(`Took ${duration}ms`)

// Chrome DevTools Performance tab
// - Record user interactions
// - See flame graph
// - Identify slow functions
```

**Node.js**:
```bash
# Built-in profiler
node --prof app.js
# Generate readable output
node --prof-process isolate-*.log > processed.txt

# Chrome DevTools
node --inspect app.js
# Open chrome://inspect
```

**Database**:
```sql
-- PostgreSQL
EXPLAIN ANALYZE SELECT ...;

-- MySQL
EXPLAIN SELECT ...;
```

## Common Performance Issues & Fixes

### 1. N+1 Query Problem

**Problem**: Loading related data in a loop

```javascript
// ❌ N+1 queries
const users = await User.findAll()
for (const user of users) {
  user.posts = await Post.findAll({ where: { userId: user.id } })
}
// 1 query for users + N queries for posts

// ✅ Use joins or eager loading
const users = await User.findAll({
  include: [{ model: Post }]
})
// 1 query total
```

### 2. Large Bundle Size

**Problem**: Shipping too much JavaScript

**Solutions**:
```javascript
// Code splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'))

// Tree shaking - use named imports
import { specific } from 'library' // ✅
import * as all from 'library' // ❌

// Dynamic imports
if (condition) {
  const module = await import('./optional-feature')
}
```

**Tools**:
- Webpack Bundle Analyzer
- Source Map Explorer
- Lighthouse

### 3. Unoptimized Images

**Problem**: Large image files

**Solutions**:
- Use modern formats (WebP, AVIF)
- Responsive images with `srcset`
- Lazy loading
- Image CDN with automatic optimization
- Proper compression

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="..." loading="lazy">
</picture>
```

### 4. Excessive Re-renders (React)

**Problem**: Components re-render unnecessarily

**Solutions**:
```javascript
// Use memo for expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])

// Use callback to prevent recreation
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])

// Memo for component
const MemoizedComponent = memo(({ data }) => {
  return <div>{data}</div>
}, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data
})

// Key optimization
// ❌ Index as key
items.map((item, i) => <Item key={i} {...item} />)
// ✅ Stable unique ID
items.map(item => <Item key={item.id} {...item} />)
```

### 5. Blocking Operations

**Problem**: Long-running sync operations block event loop

**Solutions**:
```javascript
// ❌ Blocking
const result = expensiveSync()

// ✅ Use workers for CPU-intensive tasks
const worker = new Worker('worker.js')
worker.postMessage(data)
worker.onmessage = (e) => {
  const result = e.data
}

// ✅ Use async for I/O
const result = await expensivePutAsync()

// ✅ Break into chunks
async function processLargeArray(items) {
  const chunkSize = 100
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize)
    await processChunk(chunk)
    // Let event loop breathe
    await new Promise(resolve => setTimeout(resolve, 0))
  }
}
```

### 6. Memory Leaks

**Common causes**:
- Event listeners not removed
- Circular references
- Closures holding references
- Detached DOM nodes

**Detection**:
```javascript
// Chrome DevTools Memory tab
// 1. Take heap snapshot
// 2. Perform action
// 3. Take another snapshot
// 4. Compare to find leaks

// Prevention
class Component {
  constructor() {
    this.handler = this.handler.bind(this)
    element.addEventListener('click', this.handler)
  }

  destroy() {
    // ✅ Clean up
    element.removeEventListener('click', this.handler)
    this.handler = null
  }
}
```

### 7. Database Performance

**Slow queries**:
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);

-- Use EXPLAIN to understand query plan
EXPLAIN SELECT * FROM orders WHERE user_id = 123;

-- Avoid SELECT *
SELECT id, name, email FROM users; -- ✅
SELECT * FROM users; -- ❌

-- Use pagination
SELECT * FROM posts
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;

-- Denormalize for read-heavy workloads
-- Store commonly accessed computed values
```

**Connection pooling**:
```javascript
// ✅ Reuse connections
const pool = new Pool({
  max: 20,
  min: 5,
  idle: 10000
})

// ❌ Create new connection each time
const client = new Client()
await client.connect()
```

## Optimization Strategies

### Caching

**Levels of caching**:
1. **Browser cache**: Static assets (images, CSS, JS)
2. **CDN**: Globally distributed edge caches
3. **Application cache**: Redis, Memcached
4. **Database cache**: Query result cache

**Strategies**:
```javascript
// Memory cache
const cache = new Map()

function getCached(key, fetcher, ttl = 60000) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.time < ttl) {
    return cached.value
  }

  const value = fetcher()
  cache.set(key, { value, time: Date.now() })
  return value
}

// HTTP cache headers
res.setHeader('Cache-Control', 'public, max-age=3600')
res.setHeader('ETag', generateETag(content))
```

### Lazy Loading

```javascript
// Images
<img src="..." loading="lazy">

// Routes
const Dashboard = lazy(() => import('./Dashboard'))

// Components on interaction
const Comments = lazy(() => import('./Comments'))
const [show, setShow] = useState(false)
{show && <Suspense fallback={<div>Loading...</div>}>
  <Comments />
</Suspense>}
```

### Pagination & Infinite Scroll

```javascript
// Cursor-based pagination (better than offset)
const posts = await Post.findAll({
  where: {
    id: { [Op.gt]: lastSeenId }
  },
  limit: 20,
  order: [['id', 'ASC']]
})

// Infinite scroll with intersection observer
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadMore()
  }
}, { threshold: 1.0 })

observer.observe(loadMoreElement)
```

### Debouncing & Throttling

```javascript
// Debounce: Wait for user to stop typing
const debouncedSearch = debounce((query) => {
  search(query)
}, 300)

// Throttle: Execute at most once per interval
const throttledScroll = throttle(() => {
  handleScroll()
}, 100)

// Implementation
function debounce(func, wait) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

function throttle(func, wait) {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, wait)
    }
  }
}
```

### Compression

```javascript
// Server-side compression
const compression = require('compression')
app.use(compression())

// Asset minification
// - Minify JavaScript (terser, uglify)
// - Minify CSS (cssnano)
// - Minify HTML

// Brotli compression (better than gzip)
Accept-Encoding: br, gzip
```

## Performance Budget

**Set limits and monitor**:
```
JavaScript bundle: <200KB (gzipped)
Time to Interactive: <5s on 3G
Lighthouse score: >90
API response time (p95): <500ms
Database queries per request: <10
```

**Enforce in CI**:
```javascript
// Webpack performance budgets
performance: {
  maxAssetSize: 200000,
  maxEntrypointSize: 200000,
  hints: 'error'
}
```

## Monitoring Performance

### Real User Monitoring (RUM)

**Capture actual user experience**:
```javascript
// Web Vitals
import { getCLS, getFID, getLCP } from 'web-vitals'

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getLCP(sendToAnalytics)

function sendToAnalytics({name, value, id}) {
  analytics.track('web-vital', {
    metric: name,
    value: Math.round(value),
    id
  })
}
```

### Synthetic Monitoring

**Automated performance tests**:
- Lighthouse CI in pipelines
- Regular performance audits
- Compare against baseline

## Performance Checklist

### Frontend
- [ ] Code splitting implemented
- [ ] Images optimized and lazy loaded
- [ ] Critical CSS inlined
- [ ] Unused code removed (tree-shaking)
- [ ] Compression enabled
- [ ] CDN for static assets
- [ ] Service worker for offline support
- [ ] Fonts optimized (subset, preload)
- [ ] Third-party scripts async/deferred

### Backend
- [ ] Database queries optimized (indexes, no N+1)
- [ ] Caching strategy implemented
- [ ] Connection pooling configured
- [ ] Compression enabled
- [ ] Static assets served from CDN
- [ ] Rate limiting in place
- [ ] Monitoring and alerting set up
- [ ] Pagination for large datasets

### General
- [ ] Performance budgets defined
- [ ] Monitoring in production
- [ ] Regular performance audits
- [ ] Load testing performed

## Tools & Resources

**Measurement**:
- Chrome DevTools (Performance, Network, Lighthouse)
- WebPageTest
- PageSpeed Insights
- Core Web Vitals Chrome extension

**Profiling**:
- Chrome DevTools Profiler
- React DevTools Profiler
- Node.js --inspect

**Monitoring**:
- Web Vitals library
- Real User Monitoring (DataDog, New Relic, Sentry)
- Application Performance Monitoring (APM)

## Summary

**Performance optimization process**:
1. **Measure** with real data
2. **Identify** bottlenecks with profiling
3. **Optimize** the bottleneck
4. **Measure** again to verify
5. **Monitor** in production

**Remember**:
- Premature optimization is evil
- User-perceived performance > raw metrics
- 80% of issues come from 20% of code
- Measure, don't guess
- Optimize for the right things

**"Make it work, make it right, make it fast" — in that order.**
