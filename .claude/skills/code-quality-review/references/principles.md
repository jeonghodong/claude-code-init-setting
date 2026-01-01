# 프론트엔드 코드 품질 원칙 상세 가이드

## 1. 가독성 (Readability)

사람이 한 번에 이해할 수 있는 맥락의 수는 제한적이기 때문에, 코드 한 곳에 너무 많은 맥락이 섞이지 않도록 설계해야 합니다.

### 1-1. 맥락 줄이기

#### A. 같이 실행되지 않는 코드 분리하기

동시에 실행되지 않는 로직이 한 함수/컴포넌트 안에 섞여 있으면 분기가 많아져 동작을 한 눈에 파악하기 어렵습니다.

**문제 코드:**
```tsx
function SubmitButton() {
  const isViewer = useRole() === "viewer";

  useEffect(() => {
    if (isViewer) {
      return;
    }
    showButtonAnimation();
  }, [isViewer]);

  return isViewer ? (
    <TextButton disabled>Submit</TextButton>
  ) : (
    <Button type="submit">Submit</Button>
  );
}
```

**개선된 코드:**
```tsx
function SubmitButton() {
  const isViewer = useRole() === "viewer";
  return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />;
}

function ViewerSubmitButton() {
  return <TextButton disabled>Submit</TextButton>;
}

function AdminSubmitButton() {
  useEffect(() => {
    showButtonAnimation();
  }, []);
  return <Button type="submit">Submit</Button>;
}
```

#### B. 구현 상세 추상화하기

세부 구현을 적절한 추상화 레벨로 감싸면 가독성이 향상됩니다.

**문제 코드 - AuthGuard 예시:**
```tsx
function LoginStartPage() {
  const status = useCheckLoginStatus();

  useEffect(() => {
    if (status === "LOGGED_IN") {
      location.href = "/home";
    }
  }, [status]);

  return status !== "LOGGED_IN" ? <LoginForm /> : null;
}
```

**개선된 코드:**
```tsx
function App() {
  return (
    <AuthGuard>
      <LoginStartPage />
    </AuthGuard>
  );
}

function AuthGuard({ children }) {
  const status = useCheckLoginStatus();

  useEffect(() => {
    if (status === "LOGGED_IN") {
      location.href = "/home";
    }
  }, [status]);

  return status !== "LOGGED_IN" ? children : null;
}

function LoginStartPage() {
  return <LoginForm />;
}
```

#### C. 로직 종류에 따라 합쳐진 함수 쪼개기

`usePageState()`처럼 "페이지의 모든 쿼리 파라미터를 한 번에 다루는 Hook"은 시간이 지날수록 책임이 무제한 늘어납니다.

**문제 코드:**
```ts
export function usePageState() {
  const [query, setQuery] = useQueryParams({
    cardId: NumberParam,
    statementId: NumberParam,
    dateFrom: DateParam,
    dateTo: DateParam,
    statusList: ArrayParam
  });
  // ...
}
```

**개선된 코드:**
```ts
export function useCardIdQueryParam() {
  const [cardId, _setCardId] = useQueryParam("cardId", NumberParam);
  const setCardId = useCallback((cardId: number) => {
    _setCardId({ cardId }, "replaceIn");
  }, []);
  return [cardId ?? undefined, setCardId] as const;
}
```

### 1-2. 이름 붙이기

#### A. 복잡한 조건에 이름 붙이기

**문제 코드:**
```ts
const result = products.filter((product) =>
  product.categories.some(
    (category) =>
      category.id === targetCategory.id &&
      product.prices.some((price) => price >= minPrice && price <= maxPrice)
  )
);
```

**개선된 코드:**
```ts
const matchedProducts = products.filter((product) => {
  return product.categories.some((category) => {
    const isSameCategory = category.id === targetCategory.id;
    const isPriceInRange = product.prices.some(
      (price) => price >= minPrice && price <= maxPrice
    );
    return isSameCategory && isPriceInRange;
  });
});
```

#### B. 매직 넘버에 이름 붙이기

**문제 코드:**
```ts
async function onLikeClick() {
  await postLike(url);
  await delay(300); // 300이 무엇을 의미하는지 불명확
  await refetchPostLike();
}
```

**개선된 코드:**
```ts
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  await delay(ANIMATION_DELAY_MS);
  await refetchPostLike();
}
```

### 1-3. 위에서 아래로 읽히게 하기

#### A. 시점 이동 줄이기

여러 함수/파일/상수로 계속 점프해야 하는 상황을 줄이세요.

**권장 패턴:**
```tsx
function Page() {
  const user = useUser();
  const policy = {
    admin: { canInvite: true, canView: true },
    viewer: { canInvite: false, canView: true }
  }[user.role];

  return (
    <div>
      <Button disabled={!policy.canInvite}>Invite</Button>
      <Button disabled={!policy.canView}>View</Button>
    </div>
  );
}
```

#### B. 삼항 연산자 단순하게 하기

**문제 코드:**
```ts
const status =
  A조건 && B조건 ? "BOTH" : A조건 || B조건 ? (A조건 ? "A" : "B") : "NONE";
```

**개선된 코드:**
```ts
const status = (() => {
  if (A조건 && B조건) return "BOTH";
  if (A조건) return "A";
  if (B조건) return "B";
  return "NONE";
})();
```

#### C. 왼쪽에서 오른쪽으로 읽히게 하기

**권장 패턴:**
```ts
// 수학의 부등식 순서대로 작성
if (b <= a && a <= c) { ... }
if (80 <= score && score <= 100) { console.log("우수"); }
if (minPrice <= price && price <= maxPrice) { console.log("적정 가격"); }
```

---

## 2. 예측 가능성 (Predictability)

같은 이름, 같은 종류의 함수는 일관된 동작과 반환 타입을 가져야 합니다.

### 2-1. 이름 겹치지 않게 관리하기

**문제 코드:**
```tsx
import { http as httpLibrary } from "@some-library/http";

export const http = {
  async get(url: string) {
    const token = await fetchToken();
    return httpLibrary.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
```

**개선된 코드:**
```tsx
import { http as httpLibrary } from "@some-library/http";

export const httpService = {
  async getWithAuth(url: string) {
    const token = await fetchToken();
    return httpLibrary.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
```

### 2-2. 같은 종류의 함수는 반환 타입 통일하기

#### 예시 1: API 호출 Hook

**문제 코드:**
```tsx
function useUser() {
  const query = useQuery({ queryKey: ["user"], queryFn: fetchUser });
  return query; // Query 객체 반환
}

function useServerTime() {
  const query = useQuery({ queryKey: ["serverTime"], queryFn: fetchServerTime });
  return query.data; // 데이터만 반환 - 불일치!
}
```

**개선된 코드:**
```tsx
function useUser() {
  const query = useQuery({ queryKey: ["user"], queryFn: fetchUser });
  return query; // Query 객체
}

function useServerTime() {
  const query = useQuery({ queryKey: ["serverTime"], queryFn: fetchServerTime });
  return query; // Query 객체 - 일관성!
}
```

#### 예시 2: 유효성 검사 함수

**문제 코드:**
```tsx
function checkIsNameValid(name: string) {
  return name.length > 0 && name.length < 20; // boolean 반환
}

function checkIsAgeValid(age: number) {
  if (!Number.isInteger(age)) {
    return { ok: false, reason: "나이는 정수여야 해요." };
  }
  return { ok: true }; // 객체 반환 - 불일치!
}

// 버그: checkIsAgeValid는 항상 객체를 반환하므로 항상 true
if (checkIsAgeValid(age)) { ... }
```

**개선된 코드 (Discriminated Union):**
```tsx
type ValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

function checkIsNameValid(name: string): ValidationResult {
  if (name.length === 0) {
    return { ok: false, reason: "이름은 빈 값일 수 없어요." };
  }
  if (name.length >= 20) {
    return { ok: false, reason: "이름은 20자 이상 입력할 수 없어요." };
  }
  return { ok: true };
}

function checkIsAgeValid(age: number): ValidationResult {
  if (!Number.isInteger(age)) {
    return { ok: false, reason: "나이는 정수여야 해요." };
  }
  return { ok: true };
}
```

### 2-3. 숨은 로직 드러내기

함수명, 파라미터, 반환 타입으로 예측할 수 없는 숨은 로직이 있으면 안 됩니다.

**문제 코드:**
```tsx
async function fetchBalance(): Promise<number> {
  const balance = await http.get<number>("...");
  logging.log("balance_fetched"); // 숨은 로직!
  return balance;
}
```

**개선된 코드:**
```tsx
async function fetchBalance(): Promise<number> {
  const balance = await http.get<number>("...");
  return balance;
}

// 사용 시 명시적으로 로깅
<Button
  onClick={async () => {
    const balance = await fetchBalance();
    logging.log("balance_fetched"); // 명시적 로깅
    await syncBalance(balance);
  }}
>
  계좌 잔액 갱신하기
</Button>
```

---

## 3. 응집도 (Cohesion)

함께 수정되어야 할 코드가 함께 있어야 합니다.

### 3-1. 함께 수정되는 파일을 같은 디렉토리에 두기

**문제 구조 (종류별 분류):**
```
└─ src
   ├─ components
   ├─ constants
   ├─ containers
   ├─ contexts
   ├─ hooks
   ├─ utils
   └─ ...
```

**개선된 구조 (도메인별 분류):**
```
└─ src
   ├─ components (전체 프로젝트에서 사용)
   ├─ hooks
   ├─ utils
   │
   └─ domains
      ├─ Domain1
      │  ├─ components
      │  ├─ hooks
      │  ├─ utils
      │  └─ ...
      │
      └─ Domain2
         ├─ components
         ├─ hooks
         └─ utils
```

**장점:**
- 의존 관계가 명확해짐
- 코드 삭제가 간단해짐 (도메인 폴더 전체 삭제)
- 프로젝트 확장이 쉬워짐

### 3-2. 매직 넘버 없애기

애니메이션 시간과 delay 함수가 함께 수정되어야 하는데, 상수로 연결하지 않으면 한쪽만 수정될 위험이 있습니다.

```ts
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  await delay(ANIMATION_DELAY_MS);
  await refetchPostLike();
}
```

### 3-3. 폼의 응집도 생각하기

#### A. 필드 단위 응집도

각 필드가 독립적으로 검증 로직을 가지고 관리되는 방식.

**사용하면 좋을 때:**
- 필드별로 복잡한 검증이 필요할 때
- 필드들이 다른 폼에서도 동일하게 재사용될 때

#### B. 폼 전체 단위 응집도

모든 필드의 검증 로직이 폼 전체에서 한 번에 관리되는 방식 (Zod 스키마 등).

**사용하면 좋을 때:**
- 모든 필드가 하나의 비즈니스 로직을 이룰 때
- 단계별 입력이 필요한 Wizard Form
- 필드 간에 의존성이 있을 때

---

## 4. 결합도 (Coupling)

코드 간의 불필요한 의존성을 줄이고, 각 코드의 책임을 명확히 분리해야 합니다.

### 4-1. 책임을 하나씩 관리하기

**문제 코드:**
```ts
export function usePageState() {
  const [query, setQuery] = useQueryParams({
    cardId: NumberParam,
    statementId: NumberParam,
    dateFrom: DateParam,
    dateTo: DateParam,
    statusList: ArrayParam
  });
  // 모든 쿼리 파라미터를 한 곳에서 관리
}
```

**개선된 코드:**
```ts
export function useCardIdQueryParam() {
  const [cardId, _setCardId] = useQueryParam("cardId", NumberParam);
  const setCardId = useCallback((cardId: number) => {
    _setCardId({ cardId }, "replaceIn");
  }, []);
  return [cardId ?? undefined, setCardId] as const;
}

export function useDateFromQueryParam() {
  const [dateFrom, _setDateFrom] = useQueryParam("dateFrom", DateParam);
  const defaultDateFrom = moment().subtract(3, "month");
  const setDateFrom = useCallback((date?: Moment) => {
    _setDateFrom(date?.toDate(), "replaceIn");
  }, []);
  return [dateFrom == null ? defaultDateFrom : moment(dateFrom), setDateFrom] as const;
}
```

### 4-2. 중복 코드 허용하기

페이지마다 다른 요구사항이 생기면, 공통 코드가 점점 복잡해집니다.

**판단 기준:**

| 상황 | 공통화 | 중복 허용 |
|------|--------|-----------|
| 동작이 완전히 동일 | O | X |
| 향후 변경 가능성 있음 | X | O |
| 페이지별 특이 요구사항 | X | O |
| 여러 버전의 인자 필요 | X | O |

### 4-3. Props Drilling 지우기

부모가 사용하지 않는 prop을 자식에게 그저 전달만 하는 패턴을 피하세요.

#### 해결방법 1: Composition 패턴

```tsx
function ItemEditModal({ open, items, recommendedItems, onConfirm, onClose }) {
  const [keyword, setKeyword] = useState("");

  return (
    <Modal open={open} onClose={onClose}>
      <ItemEditBody keyword={keyword} onKeywordChange={setKeyword} onClose={onClose}>
        <ItemEditList
          keyword={keyword}
          items={items}
          recommendedItems={recommendedItems}
          onConfirm={onConfirm}
        />
      </ItemEditBody>
    </Modal>
  );
}

function ItemEditBody({ children, keyword, onKeywordChange, onClose }) {
  return (
    <>
      <div>
        <Input value={keyword} onChange={(e) => onKeywordChange(e.target.value)} />
        <Button onClick={onClose}>닫기</Button>
      </div>
      {children}
    </>
  );
}
```

#### 해결방법 2: Context API (깊은 Props Drilling)

```tsx
const ItemEditModalContext = createContext();

function ItemEditModal({ open, items, recommendedItems, onConfirm, onClose }) {
  const [keyword, setKeyword] = useState("");

  return (
    <ItemEditModalContext.Provider value={{ items, recommendedItems }}>
      <Modal open={open} onClose={onClose}>
        <ItemEditBody keyword={keyword} onKeywordChange={setKeyword} onClose={onClose}>
          <ItemEditList keyword={keyword} onConfirm={onConfirm} />
        </ItemEditBody>
      </Modal>
    </ItemEditModalContext.Provider>
  );
}

function ItemEditList({ keyword, onConfirm }) {
  const { items, recommendedItems } = useContext(ItemEditModalContext);
  return <>{/* 검색 및 아이템 렌더링 */}</>;
}
```

**Context 사용 시 주의:**
- Props는 컴포넌트의 역할과 의도를 표현하므로, 모든 값을 Context로 관리하면 안 됨
- 먼저 Composition 패턴으로 depth를 줄일 수 있는지 검토
- 정말 필요할 때만 마지막 수단으로 Context 사용
