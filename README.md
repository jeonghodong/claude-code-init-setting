# Claude Code Init Setting

Claude Code를 위한 초기 설정 템플릿입니다.

## 설정 파일

- **CLAUDE.md**: Claude Code의 작동 지침 (프로젝트별 커스터마이징 가능)
- **.claude/**: 에이전트, 명령어, 워크플로우 템플릿
- **.mcp.json**: MCP 서버 설정 (API 키 포함, git에서 제외됨)
- **.mcp.json.example**: MCP 서버 설정 템플릿

## MCP 서버 설정 방법

1. `.mcp.json.example`을 복사하여 `.mcp.json` 생성:
   ```bash
   cp .mcp.json.example .mcp.json
   ```

2. `.mcp.json`에서 API 키를 실제 값으로 교체:
   - `YOUR_FIGMA_API_KEY_HERE` → 실제 Figma API 키
   - `YOUR_CONTEXT7_API_KEY_HERE` → 실제 Context7 API 키
   - `YOUR_FIRECRAWL_API_KEY_HERE` → 실제 Firecrawl API 키

3. `.mcp.json`은 `.gitignore`에 포함되어 있어 git에 커밋되지 않습니다.

## 특징

### 🔌 자동 MCP 통합
- Claude가 자동으로 `.mcp.json`을 읽어 사용 가능한 MCP 서버 감지
- 작업 컨텍스트에 맞는 MCP 도구 자동 활용
- 특정 MCP 이름을 하드코딩하지 않는 범용적 설계

### ⚡ 병렬 실행
- 독립적인 작업들을 자동으로 병렬 처리
- 성능 최적화된 작업 실행

### 🤖 자율 에이전트
- 작업 유형에 따라 적절한 에이전트 자동 선택
- Slash 명령어 자동 실행

## 사용법

1. 이 템플릿을 새 프로젝트에 복사
2. `CLAUDE.md`의 "Project-Specific Configuration" 섹션 커스터마이징
3. `.mcp.json` 설정
4. Claude Code와 함께 사용

## 보안 주의사항

- `.mcp.json`에는 API 키가 포함되므로 **절대 git에 커밋하지 마세요**
- `.env` 파일도 git에서 제외됨
- API 키는 `.mcp.json.example`에 플레이스홀더로만 표시
