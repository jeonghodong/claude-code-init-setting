# Authentication & Authorization Best Practices

## JWT-Based Authentication

### Token Generation
```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

// Generate access token (short-lived)
const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '15m', // 15 minutes
    issuer: 'myapp',
    audience: 'myapp-users'
  });
};

// Generate refresh token (long-lived)
const generateRefreshToken = (userId: number): string => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' } // 7 days
  );
};
```

### Password Hashing
```typescript
// Hash password before storing
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12; // Higher is more secure but slower
  return await bcrypt.hash(password, saltRounds);
};

// Verify password
const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Registration
const registerUser = async (email: string, password: string, name: string) => {
  // Validate password strength
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  // Check if user exists
  const existingUser = await User.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await User.create({
    data: {
      email,
      name,
      password: hashedPassword
    }
  });

  return user;
};
```

### Login Flow
```typescript
const login = async (email: string, password: string) => {
  // Find user
  const user = await User.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      isActive: true
    }
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('Account is disabled');
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  const refreshToken = generateRefreshToken(user.id);

  // Store refresh token in database
  await RefreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  };
};
```

### Token Refresh
```typescript
const refreshAccessToken = async (refreshToken: string) => {
  // Verify refresh token
  let decoded: any;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
  } catch (err) {
    throw new Error('Invalid refresh token');
  }

  // Check if token exists in database
  const storedToken = await RefreshToken.findFirst({
    where: {
      token: refreshToken,
      userId: decoded.userId,
      expiresAt: { gt: new Date() },
      revokedAt: null
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true
        }
      }
    }
  });

  if (!storedToken || !storedToken.user.isActive) {
    throw new Error('Invalid refresh token');
  }

  // Generate new access token
  const accessToken = generateAccessToken({
    userId: storedToken.user.id,
    email: storedToken.user.email,
    role: storedToken.user.role
  });

  return { accessToken };
};
```

### Token Revocation
```typescript
const logout = async (refreshToken: string) => {
  // Revoke refresh token
  await RefreshToken.updateMany({
    where: { token: refreshToken },
    data: { revokedAt: new Date() }
  });
};

const logoutAllDevices = async (userId: number) => {
  // Revoke all user's refresh tokens
  await RefreshToken.updateMany({
    where: { userId },
    data: { revokedAt: new Date() }
  });
};
```

## Authentication Middleware

```typescript
import { Request, Response, NextFunction } from 'express';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: string;
    }
  }
}

// Verify JWT middleware
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'No token provided'
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: 'Token expired'
      });
    }
    return res.status(401).json({
      error: 'Invalid token'
    });
  }
};

// Optional authentication (don't fail if no token)
export const optionalAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
      req.userId = decoded.userId;
      req.userRole = decoded.role;
    } catch (err) {
      // Ignore invalid token in optional auth
    }
  }

  next();
};
```

## Role-Based Access Control (RBAC)

```typescript
// Define roles and permissions
enum Role {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user'
}

enum Permission {
  READ_USERS = 'read:users',
  WRITE_USERS = 'write:users',
  DELETE_USERS = 'delete:users',
  READ_POSTS = 'read:posts',
  WRITE_POSTS = 'write:posts',
  DELETE_POSTS = 'delete:posts'
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    Permission.READ_USERS,
    Permission.WRITE_USERS,
    Permission.DELETE_USERS,
    Permission.READ_POSTS,
    Permission.WRITE_POSTS,
    Permission.DELETE_POSTS
  ],
  [Role.EDITOR]: [
    Permission.READ_USERS,
    Permission.READ_POSTS,
    Permission.WRITE_POSTS
  ],
  [Role.USER]: [
    Permission.READ_POSTS
  ]
};

// Authorization middleware
export const authorize = (...requiredPermissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userPermissions = rolePermissions[req.userRole as Role] || [];
    const hasPermission = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Usage
app.delete(
  '/users/:id',
  authenticate,
  authorize(Permission.DELETE_USERS),
  deleteUser
);
```

## Resource-Based Authorization

```typescript
// Check if user owns resource
export const authorizeOwner = (resourceType: 'post' | 'comment') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const resourceId = parseInt(req.params.id);
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    let resource;
    switch (resourceType) {
      case 'post':
        resource = await Post.findUnique({
          where: { id: resourceId },
          select: { userId: true }
        });
        break;
      case 'comment':
        resource = await Comment.findUnique({
          where: { id: resourceId },
          select: { userId: true }
        });
        break;
    }

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Allow owner or admin
    if (resource.userId !== userId && req.userRole !== Role.ADMIN) {
      return res.status(403).json({
        error: 'You do not have permission to access this resource'
      });
    }

    next();
  };
};

// Usage
app.put(
  '/posts/:id',
  authenticate,
  authorizeOwner('post'),
  updatePost
);
```

## OAuth 2.0 Integration

```typescript
import { google } from 'googleapis';

// Google OAuth setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generate auth URL
const getGoogleAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  });
};

// Handle OAuth callback
const handleGoogleCallback = async (code: string) => {
  // Exchange code for tokens
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Get user info
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();

  // Find or create user
  let user = await User.findUnique({
    where: { email: data.email! }
  });

  if (!user) {
    user = await User.create({
      data: {
        email: data.email!,
        name: data.name!,
        avatar: data.picture,
        provider: 'google',
        providerId: data.id!
      }
    });
  }

  // Generate JWT tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  const refreshToken = generateRefreshToken(user.id);

  return { accessToken, refreshToken, user };
};
```

## Security Best Practices

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later'
});

app.post('/auth/login', authLimiter, login);
app.post('/auth/register', authLimiter, register);
```

### CSRF Protection
```typescript
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

app.use(cookieParser());
app.use(csrf({ cookie: true }));

// Send CSRF token to client
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

### Security Headers
```typescript
import helmet from 'helmet';

app.use(helmet());
app.use(helmet.hsts({
  maxAge: 31536000, // 1 year
  includeSubDomains: true,
  preload: true
}));
```

### Session Management
```typescript
// Store sessions in Redis for scalability
import session from 'express-session';
import RedisStore from 'connect-redis';
import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL);

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only
    httpOnly: true, // Prevent XSS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' // CSRF protection
  }
}));
```
