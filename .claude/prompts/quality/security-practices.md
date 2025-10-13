# Security Practices

Essential security guidelines for software development.

## Security Mindset

### Core Principles

1. **Defense in Depth**: Multiple layers of security
2. **Least Privilege**: Minimum access necessary
3. **Secure by Default**: Safe configuration out of the box
4. **Fail Securely**: Errors don't expose vulnerabilities
5. **Never Trust User Input**: Validate and sanitize everything

### CIA Triad

**Confidentiality**: Data accessible only to authorized users
**Integrity**: Data hasn't been tampered with
**Availability**: Systems are accessible when needed

## Common Vulnerabilities (OWASP Top 10)

### 1. Injection Attacks

**SQL Injection**:

```typescript
// ❌ VULNERABLE
const query = `SELECT * FROM users WHERE email = '${email}'`
// Input: ' OR '1'='1
// Result: Exposes all users

// ✅ SAFE - Parameterized queries
const query = 'SELECT * FROM users WHERE email = ?'
db.execute(query, [email])

// ✅ SAFE - ORM
const user = await User.findOne({ where: { email } })
```

**Command Injection**:

```typescript
// ❌ VULNERABLE
exec(`git clone ${userInput}`)
// Input: https://repo.git; rm -rf /

// ✅ SAFE - Validate and use safe APIs
if (!/^https:\/\/[\w\.\-]+\.git$/.test(userInput)) {
  throw new Error('Invalid repo URL')
}
```

**NoSQL Injection**:

```typescript
// ❌ VULNERABLE
db.users.find({ username: req.body.username })
// Input: { "$gt": "" } matches all users

// ✅ SAFE - Validate types
if (typeof req.body.username !== 'string') {
  throw new Error('Invalid username')
}
```

### 2. Cross-Site Scripting (XSS)

**Stored XSS**:

```typescript
// ❌ VULNERABLE
<div dangerouslySetInnerHTML={{ __html: userComment }} />
// Input: <script>steal(cookies)</script>

// ✅ SAFE - Escape by default
<div>{userComment}</div>

// ✅ SAFE - Sanitize if HTML needed
import DOMPurify from 'dompurify'
const clean = DOMPurify.sanitize(userComment)
```

**Reflected XSS**:

```typescript
// ❌ VULNERABLE
<div>Search results for: {req.query.q}</div>
// URL: /search?q=<script>alert('XSS')</script>

// ✅ SAFE - Use framework escaping
<div>Search results for: {escapeHtml(req.query.q)}</div>
```

### 3. Cross-Site Request Forgery (CSRF)

```typescript
// ❌ VULNERABLE
app.post('/transfer', (req, res) => {
  const { to, amount } = req.body
  transfer(req.user, to, amount)
})

// ✅ SAFE - CSRF tokens
app.use(csrf())
app.post('/transfer', (req, res) => {
  // Token automatically validated
  const { to, amount } = req.body
  transfer(req.user, to, amount)
})

// ✅ SAFE - SameSite cookies
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
})
```

### 4. Broken Authentication

```typescript
// ❌ WEAK - Plain text passwords
db.users.create({ password: req.body.password })

// ✅ STRONG - Hashed passwords
import bcrypt from 'bcrypt'
const hash = await bcrypt.hash(req.body.password, 10)
db.users.create({ passwordHash: hash })

// ✅ STRONG - Session management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))
```

### 5. Sensitive Data Exposure

```typescript
// ❌ EXPOSED
app.get('/user/:id', (req, res) => {
  const user = await User.findById(req.params.id)
  res.json(user) // Includes password hash, SSN, etc.
})

// ✅ SAFE - Filter sensitive fields
app.get('/user/:id', (req, res) => {
  const user = await User.findById(req.params.id)
  res.json({
    id: user.id,
    name: user.name,
    email: user.email
    // passwordHash, SSN excluded
  })
})

// ✅ SAFE - Use DTOs
class UserDTO {
  constructor(user) {
    this.id = user.id
    this.name = user.name
    this.email = user.email
  }
}
```

### 6. Security Misconfiguration

```typescript
// ❌ INSECURE
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack // Exposes internal structure
  })
})

// ✅ SECURE
app.use((err, req, res, next) => {
  logger.error(err)
  res.status(500).json({
    error: 'Internal server error'
  })
})

// ✅ Security headers
import helmet from 'helmet'
app.use(helmet())
```

## Authentication & Authorization

### Password Security

```typescript
// Password requirements
const PASSWORD_MIN_LENGTH = 12
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/

function validatePassword(password: string) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new Error('Password too short')
  }
  if (!PASSWORD_PATTERN.test(password)) {
    throw new Error('Password must include uppercase, lowercase, number, and special char')
  }
}

// Hash passwords
import bcrypt from 'bcrypt'
const SALT_ROUNDS = 10

async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS)
}

async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}
```

### JWT Tokens

```typescript
// ✅ Secure JWT
import jwt from 'jsonwebtoken'

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    throw new Error('Invalid token')
  }
}

// Refresh tokens for long sessions
function generateRefreshToken(user) {
  const token = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  )
  // Store in database for revocation capability
  db.refreshTokens.create({ token, userId: user.id })
  return token
}
```

### Role-Based Access Control

```typescript
// Middleware for authorization
function requireRole(...roles: string[]) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    next()
  }
}

// Usage
app.delete('/users/:id', requireRole('admin'), deleteUser)
app.post('/posts', requireRole('user', 'admin'), createPost)
```

## Input Validation

### Validate Everything

```typescript
// ✅ Schema validation
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(120),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/)
})

app.post('/users', async (req, res) => {
  try {
    const data = userSchema.parse(req.body)
    const user = await createUser(data)
    res.json(user)
  } catch (err) {
    res.status(400).json({ error: err.errors })
  }
})
```

### Sanitize HTML

```typescript
import DOMPurify from 'isomorphic-dompurify'

function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'],
    ALLOWED_ATTR: ['href']
  })
}
```

### File Upload Security

```typescript
// Validate file uploads
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

function validateUpload(file) {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new Error('Invalid file type')
  }
  if (file.size > MAX_SIZE) {
    throw new Error('File too large')
  }
}

// Store outside web root
const uploadPath = path.join(__dirname, '../uploads', sanitizeFilename(file.name))
```

## API Security

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit'

// General rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests'
})
app.use(limiter)

// Stricter limit for sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
})
app.post('/login', authLimiter, login)
```

### API Keys

```typescript
// Validate API keys
function validateApiKey(req, res, next) {
  const apiKey = req.header('X-API-Key')

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' })
  }

  const validKey = await db.apiKeys.findOne({
    where: { key: apiKey, active: true }
  })

  if (!validKey) {
    return res.status(401).json({ error: 'Invalid API key' })
  }

  req.apiKey = validKey
  next()
}

app.use('/api', validateApiKey)
```

### CORS Configuration

```typescript
import cors from 'cors'

// ❌ Too permissive
app.use(cors({ origin: '*' }))

// ✅ Specific origins
app.use(cors({
  origin: ['https://app.example.com', 'https://admin.example.com'],
  credentials: true,
  maxAge: 86400
}))
```

## Secrets Management

### Never Commit Secrets

```bash
# .gitignore
.env
.env.local
*.pem
*.key
config/secrets.yml
```

### Use Environment Variables

```typescript
// ❌ NEVER
const apiKey = 'sk_live_1234567890'

// ✅ Environment variables
const apiKey = process.env.API_KEY
if (!apiKey) {
  throw new Error('API_KEY is required')
}
```

### Secrets Management Services

```typescript
// AWS Secrets Manager
import { SecretsManager } from 'aws-sdk'
const client = new SecretsManager()

async function getSecret(secretName: string) {
  const data = await client.getSecretValue({ SecretId: secretName }).promise()
  return JSON.parse(data.SecretString)
}

// HashiCorp Vault
import vault from 'node-vault'
const client = vault({ endpoint: 'http://vault:8200' })

const secrets = await client.read('secret/data/myapp')
```

## Logging & Monitoring

### Security Logging

```typescript
// Log security events
logger.warn('Failed login attempt', {
  email: req.body.email,
  ip: req.ip,
  userAgent: req.get('user-agent')
})

logger.error('Unauthorized access attempt', {
  userId: req.user?.id,
  resource: req.path,
  ip: req.ip
})

// ❌ NEVER log sensitive data
logger.info('User logged in', {
  password: user.password // NEVER
})
```

### Security Monitoring

**Monitor for**:
- Failed login attempts
- Permission denials
- Rate limit violations
- Unusual access patterns
- Data export activities

## Security Headers

```typescript
import helmet from 'helmet'

app.use(helmet())

// Or configure individually
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'https:']
  }
}))

app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}))
```

## Dependency Security

### Regular Updates

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Use Dependabot/Renovate for automated updates
```

### Lock Dependencies

```bash
# Use lock files
package-lock.json  # npm
yarn.lock          # yarn
pnpm-lock.yaml     # pnpm
```

### Verify Package Integrity

```bash
# Check package integrity
npm install --integrity

# Review dependencies before installing
npm view package-name
```

## Security Checklist

### Development
- [ ] Input validation on all user input
- [ ] Output encoding to prevent XSS
- [ ] Parameterized queries to prevent injection
- [ ] Strong password hashing (bcrypt, argon2)
- [ ] Secure session management
- [ ] CSRF protection
- [ ] Rate limiting on sensitive endpoints
- [ ] No secrets in code or version control

### Deployment
- [ ] HTTPS/TLS enabled
- [ ] Security headers configured (Helmet)
- [ ] CORS properly configured
- [ ] Secrets in environment variables or secrets manager
- [ ] Dependency vulnerabilities checked
- [ ] Security logging enabled
- [ ] Monitoring and alerting configured
- [ ] Backups automated and tested

### Infrastructure
- [ ] Principle of least privilege applied
- [ ] Database not publicly accessible
- [ ] Firewall rules configured
- [ ] Regular security updates
- [ ] Intrusion detection system
- [ ] DDoS protection

## Incident Response

### When Breach Detected

1. **Contain**: Limit the damage
2. **Investigate**: Understand what happened
3. **Remediate**: Fix the vulnerability
4. **Notify**: Inform affected parties
5. **Learn**: Post-mortem and prevention

### Security Contacts

```
Security team: security@example.com
Bug bounty: https://example.com/security
Responsible disclosure policy: [Link]
```

## Resources

- OWASP Top 10
- OWASP Cheat Sheets
- Security headers checker
- SSL/TLS best practices
- CWE/SANS Top 25

## Summary

**Security fundamentals**:
1. **Never trust user input** - Validate and sanitize everything
2. **Defense in depth** - Multiple security layers
3. **Least privilege** - Minimum necessary access
4. **Secure by default** - Safe out of the box
5. **Regular updates** - Patch vulnerabilities promptly
6. **Monitor and log** - Detect and respond to threats

**Remember**: Security is not a feature you add at the end—it must be built in from the start. When in doubt, err on the side of caution.
