# Deployment & DevOps

Best practices for deploying and operating software systems.

## Deployment Principles

### 1. Automate Everything

**Manual deployments are error-prone.**

**Automate**:
- Build process
- Testing
- Deployment
- Rollbacks
- Infrastructure provisioning

**Benefits**:
- Consistency
- Repeatability
- Speed
- Reduced human error
- Documentation through code

### 2. Deploy Frequently

**Small, frequent deployments are safer than large, infrequent ones.**

**Benefits of frequent deployment**:
- Faster feedback
- Smaller changesets (easier to debug)
- Lower risk per deployment
- Faster time to market

**Aim for**: Multiple deployments per day (when mature)

### 3. Make Deployments Boring

**Deployments shouldn't be stressful events.**

**Achieve this through**:
- Automation
- Testing
- Gradual rollouts
- Easy rollbacks
- Good monitoring
- Practice (frequency)

### 4. Separate Deploy from Release

**Deploy**: Put code into production (off for users)
**Release**: Make feature available to users

**Techniques**:
- Feature flags
- Dark launches
- Blue-green deployments
- Canary releases

## Deployment Strategies

### 1. Rolling Deployment

**Gradually replace old instances with new ones.**

```
Old: [A] [A] [A] [A]
     [A] [A] [A] [B]
     [A] [A] [B] [B]
     [A] [B] [B] [B]
New: [B] [B] [B] [B]
```

**Pros**: No downtime, gradual
**Cons**: Mixed versions running simultaneously

### 2. Blue-Green Deployment

**Two identical environments, switch traffic between them.**

```
Blue (old) ← 100% traffic
Green (new) ← 0% traffic

[Deploy to Green]

Blue (old) ← 0% traffic
Green (new) ← 100% traffic
```

**Pros**: Instant switch, easy rollback
**Cons**: Double infrastructure cost

### 3. Canary Deployment

**Release to small subset of users first.**

```
Old: 95% traffic
New: 5% traffic (canary)

[Monitor metrics]

Old: 0% traffic
New: 100% traffic
```

**Pros**: Low risk, real user testing
**Cons**: Complex routing, monitoring needed

### 4. Feature Flags

**Deploy code but control feature availability.**

```javascript
if (featureFlags.isEnabled('new-checkout', user)) {
  return <NewCheckout />
} else {
  return <OldCheckout />
}
```

**Use cases**:
- Gradual rollouts
- A/B testing
- Kill switches
- Beta features

## CI/CD Pipeline

### Continuous Integration

**Every commit triggers**:
1. Checkout code
2. Install dependencies
3. Run linters
4. Run tests
5. Build application
6. Run security scans

**Example** (.github/workflows/ci.yml):
```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

### Continuous Deployment

**Automatically deploy after CI passes** (to staging/production):

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

**Stages**:
1. Dev: On every commit
2. Staging: On merge to main
3. Production: Manual approval or automatic

## Infrastructure as Code (IaC)

**Define infrastructure in code, not manually.**

### Benefits

- Version controlled
- Reproducible
- Self-documenting
- Easy to review
- Can be tested

### Example: Terraform

```hcl
resource "aws_instance" "web" {
  ami           = "ami-abc123"
  instance_type = "t2.micro"

  tags = {
    Name = "WebServer"
    Environment = "Production"
  }
}
```

### Example: Docker Compose

```yaml
version: '3'
services:
  web:
    image: myapp:latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://db:5432/myapp
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      POSTGRES_DB: myapp
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

## Containerization

### Docker Best Practices

```dockerfile
# ✅ Use specific version
FROM node:18-alpine

# ✅ Set working directory
WORKDIR /app

# ✅ Copy dependency files first (caching)
COPY package*.json ./
RUN npm ci --only=production

# ✅ Copy source code
COPY . .

# ✅ Build application
RUN npm run build

# ✅ Use non-root user
USER node

# ✅ Expose port
EXPOSE 3000

# ✅ Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js

# ✅ Start application
CMD ["node", "dist/main.js"]
```

### Multi-stage Builds

```dockerfile
# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
USER node
CMD ["node", "dist/main.js"]
```

## Environment Configuration

### 12-Factor App Principles

**Store config in environment variables, not code.**

```javascript
// ❌ Hardcoded
const dbUrl = 'postgres://prod-db:5432/myapp'

// ✅ Environment variable
const dbUrl = process.env.DATABASE_URL

// ✅ With validation
const dbUrl = process.env.DATABASE_URL
if (!dbUrl) {
  throw new Error('DATABASE_URL is required')
}
```

### Environment Files

```bash
# .env.example (commit this)
DATABASE_URL=postgres://localhost:5432/myapp
API_KEY=your-api-key-here
NODE_ENV=development

# .env (DO NOT commit this)
DATABASE_URL=postgres://prod-db:5432/myapp
API_KEY=prod-api-key-xyz
NODE_ENV=production
```

### Secrets Management

**Never commit secrets to git.**

**Options**:
- Environment variables (simple)
- AWS Secrets Manager
- HashiCorp Vault
- Google Secret Manager
- Azure Key Vault

```javascript
// Example: Load secret from Secrets Manager
const AWS = require('aws-sdk')
const secretsManager = new AWS.SecretsManager()

async function getSecret(secretName) {
  const data = await secretsManager
    .getSecretValue({ SecretId: secretName })
    .promise()
  return JSON.parse(data.SecretString)
}
```

## Monitoring & Observability

### Health Checks

```javascript
// Kubernetes health check endpoints
app.get('/healthz', (req, res) => {
  res.status(200).send('OK')
})

app.get('/readyz', async (req, res) => {
  try {
    await db.ping()
    await redis.ping()
    res.status(200).send('Ready')
  } catch (error) {
    res.status(503).send('Not ready')
  }
})
```

### Logging

**Structured logging**:
```javascript
logger.info('User logged in', {
  userId: user.id,
  ip: req.ip,
  userAgent: req.get('user-agent')
})

logger.error('Payment failed', {
  orderId: order.id,
  error: error.message,
  stack: error.stack
})
```

**Log levels**:
- ERROR: Something failed
- WARN: Something unexpected but handled
- INFO: Important business events
- DEBUG: Detailed diagnostic info

### Metrics

**RED method** (requests, errors, duration):
```javascript
// Request rate
metrics.increment('http.requests', {
  method: req.method,
  path: req.path
})

// Error rate
metrics.increment('http.errors', {
  statusCode: res.statusCode
})

// Duration
const duration = Date.now() - startTime
metrics.histogram('http.duration', duration, {
  method: req.method,
  path: req.path
})
```

### Alerts

**Alert on user-impacting issues**:
- Error rate spike
- Response time degradation
- Service down
- Disk/memory nearly full

**Example** (Prometheus):
```yaml
groups:
  - name: api
    rules:
      - alert: HighErrorRate
        expr: rate(http_errors[5m]) > 0.05
        for: 5m
        annotations:
          summary: High error rate detected

      - alert: SlowResponses
        expr: http_duration_p95 > 1000
        for: 5m
        annotations:
          summary: API responses are slow
```

## Zero-Downtime Deployments

### Graceful Shutdown

```javascript
// Handle SIGTERM from orchestrator
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')

  // Stop accepting new requests
  server.close(async () => {
    // Complete in-flight requests
    // Close database connections
    await db.close()
    await redis.quit()

    console.log('Shutdown complete')
    process.exit(0)
  })

  // Force shutdown after timeout
  setTimeout(() => {
    console.error('Forced shutdown')
    process.exit(1)
  }, 30000)
})
```

### Database Migrations

**Backward-compatible migrations**:

```
1. Add new column (nullable)
2. Deploy code that writes to both old and new
3. Backfill data
4. Deploy code that reads from new column
5. Remove old column
```

**Never** in a single deployment:
- Add required column without default
- Rename column
- Delete column that code still uses

## Rollback Strategy

### Quick Rollback

```bash
# Keep previous versions deployable
docker tag myapp:latest myapp:v1.2.3
docker push myapp:v1.2.3

# Roll back by deploying previous version
kubectl set image deployment/myapp myapp=myapp:v1.2.2
```

### Feature Flags for Instant Rollback

```javascript
// No deploy needed, just toggle flag
featureFlags.disable('new-checkout')
```

### Database Rollbacks

**Migrations should be reversible**:
```javascript
exports.up = async (knex) => {
  await knex.schema.createTable('users', ...)
}

exports.down = async (knex) => {
  await knex.schema.dropTable('users')
}
```

**But**: Be cautious with data loss in rollbacks.

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Database migrations tested
- [ ] Config/secrets updated
- [ ] Documentation updated
- [ ] Monitoring/alerts configured
- [ ] Rollback plan prepared
- [ ] Off-hours or low-traffic time chosen
- [ ] Team notified
- [ ] Runbook prepared

## Post-Deployment Checklist

- [ ] Health checks passing
- [ ] No error spikes in logs
- [ ] Response times normal
- [ ] Key user flows tested
- [ ] Metrics look healthy
- [ ] No unexpected alerts
- [ ] Database load normal
- [ ] Team notified of success

## Disaster Recovery

### Backups

**Automated backups**:
- Database: Daily full + continuous WAL
- Files: Versioned S3 buckets
- Configuration: In git

**Test restores regularly** (untested backups are useless).

### Incident Response

**When something breaks**:
1. **Assess impact**: How many users affected?
2. **Communicate**: Status page, team notified
3. **Mitigate**: Roll back or hotfix
4. **Investigate**: Find root cause
5. **Post-mortem**: Learn and improve

## Summary

**Deployment best practices**:
1. **Automate everything** - CI/CD pipelines
2. **Deploy frequently** - Small, low-risk changes
3. **Monitor continuously** - Logs, metrics, traces
4. **Plan for failure** - Rollback strategy, circuit breakers
5. **Zero downtime** - Graceful shutdown, rolling deploys
6. **Infrastructure as code** - Version controlled, reproducible
7. **Secure by default** - Secrets management, least privilege
8. **Practice incident response** - Runbooks, drills

**Remember**: Good DevOps enables fast, safe deployment of reliable software. Invest in automation, monitoring, and processes—it pays dividends.
