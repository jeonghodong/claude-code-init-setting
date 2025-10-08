# Feature Development Workflow

This workflow guides you through implementing a new feature from start to finish.

## Phase 1: Planning & Design

### 1. Understand Requirements
- [ ] Read user story or feature request
- [ ] Identify acceptance criteria
- [ ] Clarify edge cases
- [ ] List dependencies on other features

### 2. Technical Design
- [ ] Choose appropriate design pattern
- [ ] Identify files to create/modify
- [ ] Plan component hierarchy (frontend)
- [ ] Design database schema changes (backend)
- [ ] Consider API endpoints needed
- [ ] Identify reusable utilities

### 3. Break Down Tasks
- [ ] Create todo list with specific tasks
- [ ] Estimate complexity
- [ ] Identify blockers or unknowns
- [ ] Plan testing approach

## Phase 2: Implementation

### 4. Set Up Infrastructure
- [ ] Create feature branch (`git checkout -b feature/name`)
- [ ] Create necessary files and folders
- [ ] Add TypeScript types/interfaces
- [ ] Set up test files

### 5. Core Implementation (Bottom-Up)
- [ ] Implement utilities and helpers first
- [ ] Build data models or types
- [ ] Create API endpoints (if needed)
- [ ] Implement business logic
- [ ] Build UI components (leaf nodes first)
- [ ] Connect components together

### 6. Integration
- [ ] Wire up state management
- [ ] Connect frontend to backend
- [ ] Handle loading and error states
- [ ] Add validation (client & server)
- [ ] Implement proper error handling

## Phase 3: Quality & Polish

### 7. Testing
- [ ] Write unit tests for utilities
- [ ] Write component tests (frontend)
- [ ] Write API tests (backend)
- [ ] Test happy path
- [ ] Test error scenarios
- [ ] Test edge cases
- [ ] Manual testing in browser/app

### 8. Code Quality
- [ ] Run linter (`npm run lint`)
- [ ] Fix type errors (`npm run type-check`)
- [ ] Format code (`npm run format`)
- [ ] Remove console.logs and debug code
- [ ] Add JSDoc comments for complex logic
- [ ] Refactor if needed

### 9. Accessibility & UX (Frontend)
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Proper ARIA labels
- [ ] Color contrast meets WCAG AA
- [ ] Mobile responsive
- [ ] Loading states are clear
- [ ] Error messages are helpful

### 10. Performance
- [ ] No unnecessary re-renders (React)
- [ ] Optimize images
- [ ] Code splitting if feature is large
- [ ] Database queries are indexed
- [ ] API responses are cached if appropriate

## Phase 4: Review & Deploy

### 11. Pre-Commit
- [ ] All tests pass
- [ ] Build succeeds
- [ ] No linting errors
- [ ] No TypeScript errors
- [ ] Code reviewed (self-review first)

### 12. Commit & Push
- [ ] Commit with descriptive message
- [ ] Push to remote branch
- [ ] Create pull request
- [ ] Add description and screenshots
- [ ] Link related issues

### 13. Code Review
- [ ] Address reviewer feedback
- [ ] Make requested changes
- [ ] Re-test after changes
- [ ] Get approval

### 14. Deployment
- [ ] Merge to main branch
- [ ] Deploy to staging (if available)
- [ ] Smoke test in staging
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Verify feature works in production

## Phase 5: Post-Deploy

### 15. Monitoring
- [ ] Check error tracking (Sentry, etc.)
- [ ] Monitor performance metrics
- [ ] Gather user feedback
- [ ] Fix critical bugs immediately

### 16. Documentation
- [ ] Update README if needed
- [ ] Document API endpoints
- [ ] Add comments for complex logic
- [ ] Update CLAUDE.md if architecture changed

## Tips for Success

### Do's ✅
- Start with smallest working version (MVP)
- Test frequently during development
- Commit often with clear messages
- Ask for help when stuck
- Keep pull requests focused and small

### Don'ts ❌
- Don't mix feature work with refactoring
- Don't skip tests "for now"
- Don't commit commented-out code
- Don't merge without testing
- Don't push secrets or credentials

## Common Patterns by Feature Type

### Form Feature
1. Design form schema (Zod)
2. Create form component
3. Add validation
4. Handle submission
5. Show success/error feedback
6. Add loading state

### API Endpoint
1. Define request/response types
2. Create route handler
3. Validate input
4. Implement business logic
5. Handle errors
6. Add tests
7. Document endpoint

### Dashboard/Data Visualization
1. Fetch data (API or database)
2. Transform data for display
3. Create chart/table components
4. Add filters and controls
5. Handle loading states
6. Optimize for performance

### Authentication Feature
1. Design auth flow
2. Implement backend (JWT/sessions)
3. Create login/signup forms
4. Add protected routes
5. Handle token refresh
6. Add logout functionality
7. Security audit

## Estimation Guide

- **Small feature**: 1-4 hours
  - Simple UI change
  - Add a field to form
  - Basic CRUD operation

- **Medium feature**: 4-16 hours
  - New page with multiple components
  - API with multiple endpoints
  - Integration with third-party service

- **Large feature**: 2-5 days
  - Complete authentication system
  - Complex data visualization
  - Multi-step workflow

- **Epic**: 1-2 weeks
  - Major subsystem
  - Multiple related features
  - Significant architecture changes

## When Things Go Wrong

### Feature is Too Complex
- Break it down into smaller features
- Ship MVP first, iterate later
- Ask for architecture review

### Blocked by Dependencies
- Implement mock/stub for now
- Work on other parts of feature
- Communicate with team

### Tests Keep Failing
- Test one piece at a time
- Check test setup and mocks
- Verify test environment

### Performance Issues
- Profile to find bottleneck
- Optimize hot paths first
- Consider caching or pagination

---

**Remember: Perfect is the enemy of done. Ship working code, then iterate.**
