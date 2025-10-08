# Project Setup Guide

## Initial Setup Checklist

### 1. Repository Setup
- [ ] Initialize git repository
- [ ] Create `.gitignore` (use gitignore.io)
- [ ] Set up branch protection rules
- [ ] Configure commit message conventions

### 2. Development Environment
- [ ] Choose and install runtime (Node.js, Python, etc.)
- [ ] Select package manager (npm, yarn, pnpm, poetry)
- [ ] Initialize project (`npm init`, `poetry init`, etc.)
- [ ] Set up TypeScript (if applicable)
- [ ] Configure linting (ESLint, Ruff, etc.)
- [ ] Configure formatting (Prettier, Black, etc.)

### 3. Code Quality Tools
```json
// package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "prepare": "husky install"
  }
}
```

### 4. Git Hooks (Husky + lint-staged)
```bash
npm install -D husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

### 5. Environment Variables
```bash
# .env.example (commit this)
DATABASE_URL=postgresql://localhost:5432/mydb
API_KEY=your_api_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# .env.local (DO NOT commit)
# Copy from .env.example and add real values
```

### 6. Testing Setup
- [ ] Choose testing framework (Vitest, Jest, pytest)
- [ ] Set up test configuration
- [ ] Add example tests
- [ ] Configure coverage reporting

### 7. CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
name: CI

on: [pull_request, push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run build
```

### 8. Documentation
- [ ] README with setup instructions
- [ ] Contributing guidelines (CONTRIBUTING.md)
- [ ] Code of Conduct (if open source)
- [ ] License (LICENSE)
- [ ] Architecture documentation

## Framework-Specific Setup

### Next.js
```bash
npx create-next-app@latest my-app \
  --typescript \
  --tailwind \
  --app \
  --turbopack \
  --no-src-dir
```

### Express.js (TypeScript)
```bash
npm init -y
npm install express
npm install -D typescript @types/node @types/express tsx
npx tsc --init
```

### FastAPI (Python)
```bash
poetry init
poetry add fastapi uvicorn
poetry add -D pytest black ruff mypy
```

### React SPA
```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

## Project Structure Examples

### Next.js App Router
```
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
├── components/
├── lib/
├── types/
├── public/
└── .env.local
```

### Backend (Node.js)
```
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   ├── middleware/
│   └── utils/
├── tests/
└── .env
```

### Monorepo (Turborepo)
```
├── apps/
│   ├── web/      # Next.js app
│   └── api/      # Express API
├── packages/
│   ├── ui/       # Shared components
│   └── config/   # Shared config
└── turbo.json
```

## Security Checklist
- [ ] Secrets in environment variables (not code)
- [ ] `.env` files in `.gitignore`
- [ ] Dependency vulnerability scanning (npm audit, Snyk)
- [ ] HTTPS in production
- [ ] Security headers configured
- [ ] Input validation on all endpoints

## Deployment Preparation
- [ ] Build succeeds without errors
- [ ] All tests pass
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] Health check endpoint
- [ ] Error tracking (Sentry)
- [ ] Monitoring configured
