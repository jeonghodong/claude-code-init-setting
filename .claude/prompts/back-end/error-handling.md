# Error Handling & Logging Best Practices

## Error Types & Classification

### Custom Error Classes
```typescript
// Base error class
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
export class ValidationError extends AppError {
  constructor(message: string, public details?: Record<string, any>) {
    super(400, 'VALIDATION_ERROR', message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, 'FORBIDDEN', message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    super(404, 'NOT_FOUND', `${resource}${id ? ` with id ${id}` : ''} not found`);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'CONFLICT', message);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, 'INTERNAL_ERROR', message, false);
  }
}
```

## Centralized Error Handling

### Global Error Handler Middleware
```typescript
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    body: req.body,
    userId: req.userId,
    timestamp: new Date().toISOString()
  });

  // Handle known errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err instanceof ValidationError && err.details ? { details: err.details } : {})
      }
    });
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: err.errors
      }
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token'
      }
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Authentication token has expired'
      }
    });
  }

  // Unknown error - don't expose details
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
};

// Handle async errors
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

### Prisma Error Handler
```typescript
import { Prisma } from '@prisma/client';

const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError,
  res: Response
) => {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      return res.status(409).json({
        error: {
          code: 'UNIQUE_CONSTRAINT_VIOLATION',
          message: 'A record with this value already exists',
          field: err.meta?.target
        }
      });

    case 'P2025':
      // Record not found
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Record not found'
        }
      });

    case 'P2003':
      // Foreign key constraint violation
      return res.status(400).json({
        error: {
          code: 'FOREIGN_KEY_CONSTRAINT',
          message: 'Related record does not exist'
        }
      });

    default:
      return res.status(500).json({
        error: {
          code: 'DATABASE_ERROR',
          message: 'A database error occurred'
        }
      });
  }
};
```

## Input Validation

### Zod Validation Middleware
```typescript
import { z, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: err.errors.map(e => ({
              field: e.path.join('.'),
              message: e.message
            }))
          }
        });
      }
      next(err);
    }
  };
};

// Usage
const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100)
  })
});

app.post('/users', validate(createUserSchema), asyncHandler(async (req, res) => {
  // req.body is now validated
  const user = await createUser(req.body);
  res.status(201).json({ data: user });
}));
```

## Logging

### Structured Logging with Winston
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api' },
  transports: [
    // Write errors to error.log
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    // Write all logs to combined.log
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

// Console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
```

### Request Logging Middleware
```typescript
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.userId,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });

  next();
};
```

### Contextual Logging
```typescript
// Add request ID for tracing
import { v4 as uuidv4 } from 'uuid';

export const addRequestId = (req: Request, res: Response, next: NextFunction) => {
  req.id = uuidv4();
  res.setHeader('X-Request-Id', req.id);
  next();
};

// Log with context
logger.info('User created', {
  requestId: req.id,
  userId: user.id,
  email: user.email
});
```

## Error Monitoring

### Sentry Integration
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});

// Request handler
app.use(Sentry.Handlers.requestHandler());

// Routes
app.use('/api', routes);

// Error handler
app.use(Sentry.Handlers.errorHandler());

// Custom error tracking
const captureError = (err: Error, context?: Record<string, any>) => {
  Sentry.captureException(err, {
    extra: context
  });
};
```

## Graceful Shutdown

```typescript
const gracefulShutdown = (server: any) => {
  // Shutdown signals
  const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

  signals.forEach(signal => {
    process.on(signal, async () => {
      logger.info(`${signal} received, starting graceful shutdown`);

      // Stop accepting new requests
      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          // Close database connections
          await prisma.$disconnect();
          logger.info('Database connections closed');

          // Close Redis connections
          await redis.quit();
          logger.info('Redis connection closed');

          // Exit successfully
          process.exit(0);
        } catch (err) {
          logger.error('Error during shutdown:', err);
          process.exit(1);
        }
      });

      // Force shutdown after timeout
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000); // 30 seconds
    });
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception:', err);
    captureError(err);
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection:', { reason, promise });
    captureError(new Error(String(reason)));
  });
};

// Start server
const server = app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

gracefulShutdown(server);
```

## Health Checks

```typescript
// Health check endpoint
app.get('/health', asyncHandler(async (req, res) => {
  const checks = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'ok',
    checks: {
      database: 'unknown',
      redis: 'unknown'
    }
  };

  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    checks.checks.database = 'ok';
  } catch (err) {
    checks.checks.database = 'error';
    checks.status = 'error';
  }

  try {
    // Check Redis
    await redis.ping();
    checks.checks.redis = 'ok';
  } catch (err) {
    checks.checks.redis = 'error';
    checks.status = 'error';
  }

  const statusCode = checks.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(checks);
}));
```

## Best Practices Summary

1. **Use custom error classes** for different error types
2. **Centralize error handling** with middleware
3. **Validate all inputs** before processing
4. **Log errors with context** (request ID, user ID, etc.)
5. **Monitor errors** with services like Sentry
6. **Implement graceful shutdown** for clean exits
7. **Provide health check endpoints** for monitoring
8. **Never expose sensitive details** in error messages
9. **Use async/await** with try-catch or asyncHandler
10. **Handle both operational and programming errors** differently
