# UX/UI 프리셋 5종

사용자가 "생각해두신 UX/UI가 있나요?" 질문에서 프리셋을 고르면, 해당 프리셋의 요구사항을 아래 명세 그대로 구현한다. 프리셋은 출발점이다 — 사용자가 추가·변경 요구를 말하면 그것이 우선한다.

모든 프리셋 공통:
- 먼저 SKILL.md 4단계대로 **와이어프레임 시안 2~3개**(레이아웃 접근이 서로 다른)를 만들어 사용자가 고르게 하고, 수정 요청이 있으면 반영해 다시 보여주는 루프를 사용자가 확정할 때까지 반복한다. 도구는 `/design` 스킬(가능한 환경) 또는 자립형 HTML(그 외 환경).
- 구현은 astryx-rules.md를 따른다. 특히 `pnpm exec astryx build "<프리셋 설명>"`으로 시작해 Astryx가 제안하는 [page]/[block] 템플릿을 우선 활용한다.
- 각 화면은 `src/domain/<feature>/` 아래에 만들고 route는 위임만 한다.
- 데이터는 실제 백엔드가 없으므로 TanStack Query + 목(mock) 서버 함수(`createServerFn`)로 구성해, 나중에 실제 API로 교체하기 쉽게 한다.

## 1. 대시보드 및 관리자 페이지 (Admin)

사내 직원용 백오피스 관리자 대시보드.

- 회원 목록을 조회하고 상태를 변경하는 테이블 — Pagination, Filter 기능 포함
- 월별 매출 추이를 보여주는 차트 컴포넌트
- 권한별(Admin/User) 접근 제한이 적용된 페이지 구성 — TanStack Router의 `beforeLoad` 가드 사용

도메인 제안: `domain/dashboard`(차트·요약), `domain/members`(테이블), `domain/auth`(권한 가드·세션 목)

## 2. 커머스 / 쇼핑몰

반려동물 용품 e-커머스 서비스의 상품 상세 페이지.

- 상품 이미지 갤러리/캐러셀
- 옵션 선택(색상, 수량)에 따라 가격이 실시간 계산되는 장바구니 담기 UI
- 리뷰 작성/목록 컴포넌트

도메인 제안: `domain/product`(상세·갤러리·옵션), `domain/cart`(장바구니 상태), `domain/review`(작성 폼은 react-hook-form + zod)

## 3. SNS / 커뮤니티

IT 개발자 피드 중심의 커뮤니티 서비스.

- 게시글 작성 시 마크다운 에디터 컴포넌트
- 무한 스크롤(Infinite Scroll)이 적용된 피드 목록 UI — TanStack Query `useInfiniteQuery` 사용
- 좋아요 및 댓글/대댓글 구조를 갖춘 페이지

도메인 제안: `domain/feed`(무한 스크롤 목록), `domain/post`(에디터·상세), `domain/comment`(댓글 트리)

## 4. 예약 및 일정 관리 (SaaS)

스터디룸 예약 플랫폼의 날짜 및 시간 선택 페이지.

- 달력에서 날짜를 선택하면 이용 가능한 시간대가 활성화되는 타임슬롯 선택 UI
- 예약 정보 입력 폼 컴포넌트 — react-hook-form + zod 검증
- 예약 확정 모달(Modal)

도메인 제안: `domain/booking`(달력·타임슬롯·폼·확정 모달)

## 5. AI / 실시간 채팅 인터페이스

LLM 기반의 AI 챗봇 대화 화면.

- 메시지가 실시간으로 추가되는 스트리밍 텍스트 UI
- 이전 대화 목록을 불러오는 사이드바
- 메시지 입력창 및 프롬프트 추천 칩(Chip) 컴포넌트

도메인 제안: `domain/chat`(메시지 목록·스트리밍 렌더·입력창·추천 칩), `domain/conversation`(사이드바 목록). 스트리밍은 목 서버 함수에서 청크를 흘려보내는 형태로 시뮬레이션한다.
