# Architecture & System Design

Guidelines for designing and evaluating system architecture.

## Architecture Principles

### 1. Simplicity First

"The simplest solution that could possibly work."

**Benefits of simplicity**:
- Easier to understand and maintain
- Fewer bugs and edge cases
- Faster to implement
- Easier to change later

**Add complexity only when**:
- Current simple solution demonstrably fails
- Benefits clearly outweigh costs
- Simpler alternatives have been exhausted

### 2. Separation of Concerns

**Each component should have a single, well-defined responsibility.**

**Good separation**:
```
├── presentation/    # UI components, user interactions
├── business/        # Business logic, rules, validations
├── data/           # Data access, persistence, caching
└── integration/    # External APIs, services
```

**Benefits**:
- Easy to test each layer independently
- Changes in one layer don't cascade
- Clear boundaries and contracts
- Team members can work in parallel

### 3. Loose Coupling, High Cohesion

**Loose coupling**: Components depend on abstractions, not implementations

**High cohesion**: Related functionality grouped together

**Example**:
```typescript
// ❌ Tight coupling
class OrderService {
  saveToDatabase(order) {
    const db = new PostgreSQLDatabase()
    db.insert('orders', order)
  }
}

// ✅ Loose coupling
interface Database {
  insert(table: string, data: any): Promise<void>
}

class OrderService {
  constructor(private db: Database) {}

  saveToDatabase(order) {
    this.db.insert('orders', order)
  }
}
```

### 4. Fail Fast

**Validate inputs early, fail clearly when something's wrong.**

```typescript
// ❌ Fail late
function processOrder(order) {
  // ... lots of processing ...
  if (!order.items) {
    throw new Error('No items')
  }
}

// ✅ Fail fast
function processOrder(order) {
  if (!order || !order.items || order.items.length === 0) {
    throw new Error('Invalid order: must have items')
  }
  // ... processing ...
}
```

### 5. Design for Change

**Assume requirements will change.**

**Strategies**:
- Use abstractions for volatile parts
- Encapsulate what varies
- Depend on interfaces, not implementations
- Keep components small and focused
- Write tests to enable safe refactoring

## Architectural Patterns

### Layered Architecture

```
┌─────────────────────┐
│   Presentation      │ ← UI, Controllers, Views
├─────────────────────┤
│   Application       │ ← Use cases, Orchestration
├─────────────────────┤
│   Domain            │ ← Business logic, Entities
├─────────────────────┤
│   Infrastructure    │ ← Database, External APIs
└─────────────────────┘
```

**When to use**: Traditional apps with clear layers, CRUD operations

**Benefits**: Clear separation, easy to understand
**Drawbacks**: Can become rigid, layers can couple

### Hexagonal (Ports & Adapters)

```
     ┌──────────────┐
     │   External   │
     │   Systems    │
     └──────┬───────┘
            │ Adapter
     ┌──────▼───────┐
     │    Ports     │
     ├──────────────┤
     │  Application │
     │    Core      │
     └──────────────┘
```

**When to use**: Need to swap implementations, extensive external integrations

**Benefits**: External changes don't affect core, testable
**Drawbacks**: More abstraction, initial complexity

### Microservices

```
┌──────┐  ┌──────┐  ┌──────┐
│ Auth │  │ Order│  │ User │
│Service  │Service  │Service│
└───┬──┘  └───┬──┘  └───┬──┘
    │         │         │
    └─────────┼─────────┘
          API Gateway
```

**When to use**: Large teams, need independent scaling, different tech stacks

**Benefits**: Independent deployment, scalability, tech flexibility
**Drawbacks**: Complexity, network overhead, data consistency challenges

### Event-Driven

```
Component A ──event──> Message Bus ──event──> Component B
                          │
                          └──event──> Component C
```

**When to use**: Asynchronous workflows, real-time systems, decoupling

**Benefits**: Loose coupling, scalable, real-time capabilities
**Drawbacks**: Debugging harder, eventual consistency, complexity

## Design Decisions

### When to Optimize

**Don't optimize prematurely**:
1. Write clear, correct code first
2. Measure performance
3. Identify bottlenecks
4. Optimize only bottlenecks
5. Measure improvement

**Optimize when**:
- Users complaining about speed
- Metrics show performance issues
- Resource costs are high
- You've measured and identified the problem

### Database Selection

**SQL (PostgreSQL, MySQL)**:
- Structured data with relationships
- ACID transactions required
- Complex queries needed
- Data integrity crucial

**NoSQL (MongoDB, DynamoDB)**:
- Flexible schema
- Horizontal scaling needed
- Simple key-value or document access
- Eventual consistency acceptable

**Considerations**:
- Data structure and relationships
- Query patterns
- Scalability requirements
- Consistency vs availability tradeoffs

### Synchronous vs Asynchronous

**Synchronous** (HTTP request/response):
- User needs immediate feedback
- Simple request-response pattern
- Low latency available
- Strong consistency needed

**Asynchronous** (message queues, events):
- Long-running operations
- Can tolerate delays
- Need to decouple components
- Want to smooth load spikes

### Monolith vs Microservices

**Start with monolith when**:
- Small team (<10 developers)
- Unclear domain boundaries
- Early stage, rapid changes
- Simple deployment preferred

**Consider microservices when**:
- Large team (>20 developers)
- Clear domain boundaries
- Independent scaling needed
- Different technology stacks beneficial
- Mature organization with DevOps capability

**Never** jump to microservices prematurely—most startups should begin with monoliths.

## Scalability Patterns

### Vertical Scaling (Scale Up)

**Add more resources to single machine**: More CPU, RAM, storage

**Pros**: Simple, no code changes
**Cons**: Hard limits, expensive, single point of failure

### Horizontal Scaling (Scale Out)

**Add more machines**: Load balance across many servers

**Pros**: Unlimited scaling, redundancy, cost-effective
**Cons**: Complexity, data consistency challenges, network overhead

### Caching Strategies

**Where to cache**:
- CDN: Static assets
- Application: Computed results, API responses
- Database: Query results

**Invalidation strategies**:
- TTL (Time To Live): Expire after time
- Event-based: Invalidate on data change
- Manual: Explicitly clear when needed

```typescript
// Example: Cache with TTL
const cache = new Map()

function getCachedData(key) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    return cached.value
  }

  const value = fetchExpensiveData(key)
  cache.set(key, { value, timestamp: Date.now() })
  return value
}
```

### Load Balancing

**Strategies**:
- Round robin: Distribute evenly
- Least connections: Send to least busy
- IP hash: Same client → same server

### Database Scaling

**Read replicas**: Separate servers for reads
**Sharding**: Split data across servers by key
**Partitioning**: Split tables by criteria

## Security Considerations

### Authentication & Authorization

**Authentication** (Who are you?):
- Use established protocols (OAuth, JWT)
- Never roll your own crypto
- Store passwords hashed (bcrypt, argon2)
- Implement rate limiting

**Authorization** (What can you do?):
- Principle of least privilege
- Role-based access control (RBAC)
- Check permissions on every request
- Don't trust client-side checks

### Data Protection

**In transit**: TLS/HTTPS always
**At rest**: Encrypt sensitive data
**In logs**: Never log secrets, PII

### Input Validation

**Never trust user input**:
- Validate all inputs
- Sanitize for XSS
- Use parameterized queries (prevent SQL injection)
- Limit input size
- Check file types for uploads

### API Security

```typescript
// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}))

// Input validation
app.post('/user', validateSchema(userSchema), handler)

// Authentication
app.use(requireAuth)

// Authorization
app.post('/admin', requireRole('admin'), handler)
```

## Monitoring & Observability

### Three Pillars

**Logs**: Record of events
**Metrics**: Numerical measurements
**Traces**: Request flow through system

### Key Metrics

**Application**:
- Response time (p50, p95, p99)
- Error rate
- Throughput (requests/second)

**Infrastructure**:
- CPU usage
- Memory usage
- Disk I/O
- Network bandwidth

**Business**:
- User signups
- Conversion rates
- Revenue metrics

### Health Checks

```typescript
app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: Date.now(),
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      externalAPI: await checkExternalAPI()
    }
  }

  const allOk = Object.values(health.checks).every(c => c === 'ok')
  res.status(allOk ? 200 : 503).json(health)
})
```

## Architecture Review Checklist

When evaluating a design:

- [ ] Is it as simple as possible?
- [ ] Are concerns properly separated?
- [ ] Are components loosely coupled?
- [ ] Is it testable?
- [ ] Can it handle expected load?
- [ ] How does it fail? Gracefully?
- [ ] Is it secure by default?
- [ ] Can it be monitored/debugged?
- [ ] Is it maintainable?
- [ ] Does it match team skills?
- [ ] Is cost acceptable?
- [ ] Can it evolve with requirements?

## Common Anti-Patterns

### ❌ Big Ball of Mud

Everything tightly coupled, no clear structure.

**Fix**: Incrementally extract modules with clear boundaries

### ❌ Golden Hammer

Using same solution for every problem ("we'll use microservices for everything!")

**Fix**: Choose architecture based on specific requirements

### ❌ Premature Optimization

Optimizing before measuring.

**Fix**: Make it work, make it right, make it fast (in that order)

### ❌ Cargo Cult

Copying architecture without understanding why.

**Fix**: Understand the problem your architecture solves

### ❌ Resume-Driven Development

Using technologies to pad resume, not to solve problems.

**Fix**: Choose tech based on project needs, not personal interests

## Summary

**Good architecture**:
1. Solves actual problems (not imagined future ones)
2. Is as simple as possible
3. Can be understood by the team
4. Can evolve as requirements change
5. Has clear boundaries and contracts
6. Is testable and monitorable
7. Fails gracefully
8. Is secure by default

**Remember**: Architecture is about making tradeoffs. Perfect architecture doesn't exist—only architecture appropriate for your context.
