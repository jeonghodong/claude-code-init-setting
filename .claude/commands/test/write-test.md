---
description: 테스트 코드를 작성합니다 (단위/통합/E2E)
model: sonnet
---

You should use the Task tool to launch the test-code agent to write high-quality test code following FIRST and DAMP principles.

**Task**: Write test code for the specified target

## Instructions for the test-code agent:

1. **Analyze the test target** to understand what needs to be tested
2. **Design test cases** following business behavior specifications
3. **Implement tests** using:
   - FIRST principles (Fast, Independent, Repeatable, Self-validating, Timely)
   - DAMP principles (Descriptive and Meaningful Phrases)
   - AAA pattern (Arrange-Act-Assert)
   - Business behavior-focused test names
4. **Verify and improve** test quality and coverage

## Test Types:

- **Unit Test**: Test individual functions, methods, or components
- **Integration Test**: Test multiple modules working together
- **E2E Test**: Test complete user flows from end to end

## Usage Examples:

```
/test:write-test 함수명
/test:write-test 컴포넌트경로
/test:write-test API엔드포인트
```

**Target to test**: ${user's specified target or "analyze current file/selection"}

Launch the test-code agent now to write comprehensive test code.
