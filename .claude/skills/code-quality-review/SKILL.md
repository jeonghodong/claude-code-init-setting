---
name: code-quality-review
description: 프론트엔드 코드 품질 리뷰 스킬. 가독성, 예측 가능성, 응집도, 결합도 4가지 원칙을 기반으로 코드를 분석하고 개선점을 제안합니다. 코드 리뷰, 리팩토링 제안, 코드 품질 분석 시 사용합니다.
---

# 프론트엔드 코드 품질 리뷰 스킬

프론트엔드 코드를 4가지 핵심 원칙을 기준으로 분석하고 개선점을 제안합니다.

**핵심 원칙:** 사람이 한 번에 이해할 수 있는 맥락의 수는 **6~7개**로 제한적이므로, 코드 한 곳에 너무 많은 맥락이 섞이지 않도록 설계해야 합니다.

---

## 1. 가독성 (Readability)

한 번에 이해해야 하는 맥락의 수를 최소화합니다.

### 1-1. 맥락 줄이기

#### A. 같이 실행되지 않는 코드 분리하기

동시에 실행되지 않는 로직이 한 함수/컴포넌트 안에 섞여 있으면 분기가 많아져 동작을 한 눈에 파악하기 어렵습니다.

**문제 패턴:**
```tsx
// ❌ viewer와 일반 사용자 로직이 한 컴포넌트에 섞여 있음
function SubmitButton() {
  const isViewer = useRole() === "viewer";
  useEffect(() => {
    if (isViewer) return;
    showButtonAnimation();
  }, [isViewer]);
  return isViewer ? (
    <TextButton disabled>Submit</TextButton>
  ) : (
    <Button type="submit">Submit</Button>
  );
}
```

**개선 패턴:**
```tsx
// ✅ 권한별로 분리하여 각 컴포넌트는 하나의 맥락만 관리
function SubmitButton() {
  const isViewer = useRole() === "viewer";
  return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />;
}

function ViewerSubmitButton() {
  return <TextButton disabled>Submit</TextButton>;
}

function AdminSubmitButton() {
  useEffect(() => { showButtonAnimation(); }, []);
  return <Button type="submit">Submit</Button>;
}
```

#### B. 구현 상세 추상화하기

세부 구현을 적절한 추상화 레벨로 감싸면 가독성이 향상됩니다.

**문제 패턴 - AuthGuard 예시:**
```tsx
// ❌ 로그인 여부 체크와 리다이렉트 로직이 페이지에 그대로 노출
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

**개선 패턴:**
```tsx
// ✅ AuthGuard로 분리하여 로그인 페이지는 UI에만 집중
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
    if (status === "LOGGED_IN") location.href = "/home";
  }, [status]);
  return status !== "LOGGED_IN" ? children : null;
}

function LoginStartPage() {
  return <LoginForm />;
}
```

**문제 패턴 - FriendInvitation 예시:**
```tsx
// ❌ 데이터 패칭, 상태 관리, 동의 다이얼로그, 초대 로직이 모두 한 곳에
export function FriendInvitation() {
  const { data } = useQuery(/* ... */);
  const [showDialog, setShowDialog] = useState(false);

  const handleInvite = async () => {
    const canInvite = await overlay.openAsync(({ isOpen, close }) => (
      <ConfirmDialog title={`${data.name}님에게 공유해요`} /* ... */ />
    ));
    if (canInvite) {
      await sendPush();
    }
  };

  return (
    <>
      <Button onClick={handleInvite}>초대하기</Button>
      {/* UI를 위한 JSX 마크업 */}
    </>
  );
}
```

**개선 패턴:**
```tsx
// ✅ 동의 + 버튼 클릭 로직을 InviteButton으로 추상화
export function FriendInvitation() {
  const { data } = useQuery(/* ... */);
  return (
    <>
      <InviteButton name={data.name} />
      {/* UI를 위한 JSX 마크업 */}
    </>
  );
}

function InviteButton({ name }) {
  return (
    <Button
      onClick={async () => {
        const canInvite = await overlay.openAsync(({ isOpen, close }) => (
          <ConfirmDialog title={`${name}님에게 공유해요`} /* ... */ />
        ));
        if (canInvite) {
          await sendPush();
        }
      }}
    >
      초대하기
    </Button>
  );
}
```

#### C. 로직 종류에 따라 합쳐진 함수 쪼개기

`usePageState()`처럼 "페이지의 모든 쿼리 파라미터를 한 번에 다루는 Hook"은 시간이 지날수록 책임이 무제한 늘어나고, 한 번에 다뤄야 하는 맥락이 지나치게 많아집니다.

**문제점:**
- 이 Hook을 사용하는 컴포넌트는 어떤 쿼리만 필요해도 모든 쿼리 변경에 리렌더링
- 성능에 악영향

**문제 패턴:**
```ts
// ❌ 페이지의 모든 쿼리 파라미터를 한 번에 다루는 Hook
export function usePageState() {
  const [query, setQuery] = useQueryParams({
    cardId: NumberParam,
    statementId: NumberParam,
    dateFrom: DateParam,
    dateTo: DateParam,
    statusList: ArrayParam
  });
  return useMemo(
    () => ({
      values: { /* ... */ },
      controls: { /* ... */ }
    }),
    [query, setQuery]
  );
}
```

**개선 패턴:**
```ts
// ✅ 각 책임을 분리하여 이름이 명확하고 리렌더링 범위가 좁아짐
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

### 1-2. 이름 붙이기

#### A. 복잡한 조건에 이름 붙이기

중첩된 `filter`, `some`, 복잡한 조건을 한 줄에서 처리하면 조건의 의미를 파악하기 어렵고, 동시에 고려해야 하는 맥락이 많아집니다.

**문제 패턴:**
```ts
// ❌ 조건의 의미를 파악하기 어려움
const result = products.filter((product) =>
  product.categories.some(
    (category) =>
      category.id === targetCategory.id &&
      product.prices.some((price) => price >= minPrice && price <= maxPrice)
  )
);
```

**개선 패턴:**
```ts
// ✅ 조건에 이름을 붙여 의도가 드러남
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

**판단 기준:** 로직이 복잡하거나 재사용/테스트 가능성이 있을 때는 이름을 붙여 분리하고, 아주 단순하고 1회성인 경우는 인라인으로 두어도 괜찮습니다.

#### B. 매직 넘버에 이름 붙이기

의미를 설명하지 않는 숫자 상수(예: `404`, `86400`, `300`)를 그대로 쓰면 값의 의도와 맥락을 알기 어렵습니다.

**문제 패턴:**
```ts
// ❌ 300이 무엇을 의미하는지 불명확
async function onLikeClick() {
  await postLike(url);
  await delay(300);
  await refetchPostLike();
}
```

**개선 패턴:**
```ts
// ✅ 의미 있는 상수 이름 사용
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  await delay(ANIMATION_DELAY_MS);
  await refetchPostLike();
}
```

### 1-3. 위에서 아래로 읽히게 하기

#### A. 시점 이동 줄이기

코드를 이해하기 위해 여러 함수/파일/상수로 계속 점프해야 하는 상황을 **시점 이동**이라고 하며, 시점 이동이 많을수록 맥락 유지가 어려워집니다.

**권장 패턴:**
```tsx
// ✅ 권한 정책을 컴포넌트 안에서 한눈에 파악 가능
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

중첩된 삼항 연산자는 조건 구조를 파악하기 어렵게 만들고, 디버깅과 수정도 힘들게 합니다.

**문제 패턴:**
```ts
// ❌ 중첩된 삼항 연산자는 구조 파악이 어려움
const status = A조건 && B조건 ? "BOTH" : A조건 || B조건 ? (A조건 ? "A" : "B") : "NONE";
```

**개선 패턴:**
```ts
// ✅ IIFE + if문으로 조건 흐름이 명확
const status = (() => {
  if (A조건 && B조건) return "BOTH";
  if (A조건) return "A";
  if (B조건) return "B";
  return "NONE";
})();
```

#### C. 왼쪽에서 오른쪽으로 읽히게 하기

`a >= b && a <= c`처럼 가운데 값을 두 번 적는 형태는, 범위를 이해할 때 인지적 부담을 높입니다.

**권장 패턴:**
```ts
// ✅ 수학 부등식 순서대로 작성하면 범위를 직관적으로 파악
if (b <= a && a <= c) { ... }
if (80 <= score && score <= 100) { console.log("우수"); }
if (minPrice <= price && price <= maxPrice) { console.log("적정 가격"); }
```

---

## 2. 예측 가능성 (Predictability)

같은 이름, 같은 종류의 함수는 일관된 동작과 반환 타입을 가져야 하며, 숨은 로직 없이 명시적으로 구현되어야 합니다.

### 2-1. 이름 겹치지 않게 관리하기

같은 이름의 함수/변수가 서로 다른 동작을 하면, 사용하는 개발자가 혼란을 겪습니다.

**문제 패턴:**
```tsx
// ❌ 라이브러리와 이름이 같아서 혼란 유발
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

**개선 패턴:**
```tsx
// ✅ 명확한 이름으로 구분, 함수명으로 추가 동작을 명시
import { http as httpLibrary } from "@some-library/http";

export const httpService = {
  async getWithAuth(url: string) {
    const token = await fetchToken();
    return httpLibrary.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

// 사용 예
import { httpService } from "./httpService";
export async function fetchUser() {
  return await httpService.getWithAuth("...");
}
```

### 2-2. 같은 종류의 함수는 반환 타입 통일하기

#### 예시 1: API 호출 Hook

API를 호출하는 Hook들이 서로 다른 반환 타입을 가지면, 매번 사용법을 다시 확인해야 합니다.

**문제 패턴:**
```tsx
// ❌ 반환 타입이 다름
function useUser() {
  const query = useQuery({ queryKey: ["user"], queryFn: fetchUser });
  return query; // Query 객체 반환
}

function useServerTime() {
  const query = useQuery({ queryKey: ["serverTime"], queryFn: fetchServerTime });
  return query.data; // 데이터만 반환 - 불일치!
}
```

**개선 패턴:**
```tsx
// ✅ 일관된 반환 타입
function useUser() {
  return useQuery({ queryKey: ["user"], queryFn: fetchUser });
}

function useServerTime() {
  return useQuery({ queryKey: ["serverTime"], queryFn: fetchServerTime });
}
```

#### 예시 2: 유효성 검사 함수

검증 함수의 반환 타입이 다르면, 같은 로직이라도 처리 방식이 달라져 버그 가능성이 높습니다.

**문제 패턴:**
```tsx
// ❌ 반환 타입이 불일치 - 버그 유발
function checkIsNameValid(name: string) {
  return name.length > 0 && name.length < 20; // boolean
}

function checkIsAgeValid(age: number) {
  if (!Number.isInteger(age)) {
    return { ok: false, reason: "나이는 정수여야 해요." };
  }
  return { ok: true }; // 객체
}

// 문제: checkIsAgeValid는 항상 객체를 반환하므로 if 문이 항상 true가 됨
if (checkIsAgeValid(age)) {
  // 이 코드가 항상 실행됨 (버그!)
}
```

**개선 패턴 (Discriminated Union):**
```tsx
// ✅ 일관된 반환 타입 + 타입 안전성
type ValidationResult = { ok: true } | { ok: false; reason: string };

function checkIsNameValid(name: string): ValidationResult {
  if (name.length === 0) return { ok: false, reason: "이름은 빈 값일 수 없어요." };
  if (name.length >= 20) return { ok: false, reason: "이름은 20자 미만이어야 해요." };
  return { ok: true };
}

function checkIsAgeValid(age: number): ValidationResult {
  if (!Number.isInteger(age)) return { ok: false, reason: "나이는 정수여야 해요." };
  if (age < 18) return { ok: false, reason: "나이는 18세 이상이어야 해요." };
  if (age > 99) return { ok: false, reason: "나이는 99세 이하이어야 해요." };
  return { ok: true };
}

// 타입 안전한 사용
const result = checkIsAgeValid(1.1);
if (result.ok) {
  result.reason; // ❌ 타입 에러: reason이 없음
} else {
  result.reason; // ✅ ok가 false일 때만 접근 가능
}
```

### 2-3. 숨은 로직 드러내기

함수명, 파라미터, 반환 타입으로 예측할 수 없는 숨은 로직이 있으면, 예상 밖의 동작이 발생합니다.

**문제 패턴:**
```tsx
// ❌ 로깅이 함수 안에 숨어 있음
async function fetchBalance(): Promise<number> {
  const balance = await http.get<number>("...");
  logging.log("balance_fetched"); // 숨은 로직!
  return balance;
}

// 사용자가 로깅을 원하지 않아도 자동으로 로깅됨
const balance = await fetchBalance();
```

**개선 패턴:**
```tsx
// ✅ 함수는 순수하게, 로깅은 명시적으로
async function fetchBalance(): Promise<number> {
  return await http.get<number>("...");
}

// 사용 예: 로깅을 원할 때 명시적으로 처리
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

함께 수정되어야 할 코드가 함께 있어야 하며, 변경의 단위에 맞춰 코드를 구조화해야 합니다.

### 3-1. 함께 수정되는 파일을 같은 디렉토리에 두기

파일을 종류별(components, hooks, utils, constants 등)로 나누면, 코드 간 의존 관계를 파악하기 어렵고 관련 코드를 함께 수정하기 어렵습니다.

**문제 구조:**
```
❌ 종류별 분류 - 프로젝트가 커질수록 의존 관계가 복잡해짐
└─ src
   ├─ components
   ├─ constants
   ├─ containers
   ├─ contexts
   ├─ hooks
   ├─ utils
   └─ ...
```

**개선 구조:**
```
✅ 도메인별 분류 - 의존 관계가 명확함
└─ src
   │ // 전체 프로젝트에서 사용
   ├─ components
   ├─ hooks
   ├─ utils
   │
   └─ domains
      │ // Domain1에서만 사용
      ├─ Domain1
      │  ├─ components
      │  ├─ hooks
      │  └─ utils
      │
      │ // Domain2에서만 사용
      └─ Domain2
         ├─ components
         ├─ hooks
         └─ utils
```

**장점:**
- `../../../Domain2/hooks/useFoo` 같은 import를 보면 도메인 간 참조 즉시 인지
- 코드 삭제가 간단해짐: 도메인 디렉토리 전체를 삭제하면 관련 파일 모두 제거
- 프로젝트 확장이 쉬워짐: 새 도메인 추가 시 관련 코드를 한 곳에 집중

### 3-2. 매직 넘버 없애기

애니메이션 시간과 delay 함수가 함께 수정되어야 하는데, 한쪽만 수정되면 서비스가 깨집니다.

```ts
// ✅ 관련 코드들이 같은 상수를 참조하도록
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  await delay(ANIMATION_DELAY_MS);
  await refetchPostLike();
}

// 애니메이션 시간이 변경되면 상수만 수정하면 됨
```

### 3-3. 폼의 응집도 생각하기

폼을 구성하는 방식에 따라 변경의 범위와 재사용성이 달라집니다.

#### A. 필드 단위 응집도

각 필드가 독립적으로 검증 로직을 가지고 관리되는 방식.

```tsx
// 필드 단위: 각 필드의 검증이 독립적
export function Form() {
  const { register, formState: { errors }, handleSubmit } = useForm({
    defaultValues: { name: "", email: "" }
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input
        {...register("name", {
          validate: (value) =>
            isEmptyStringOrNil(value) ? "이름을 입력해주세요." : ""
        })}
      />
      <input
        {...register("email", {
          validate: (value) => {
            if (isEmptyStringOrNil(value)) return "이메일을 입력해주세요.";
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
              return "유효한 이메일을 입력해주세요.";
            return "";
          }
        })}
      />
    </form>
  );
}
```

**사용하면 좋을 때:**
- 필드별로 복잡한 검증이 필요할 때 (이메일 형식, 전화번호, 아이디 중복 확인)
- 필드들이 다른 폼에서도 동일하게 재사용될 때

#### B. 폼 전체 단위 응집도

모든 필드의 검증 로직이 폼 전체에서 한 번에 관리되는 방식 (Zod 스키마 등).

```tsx
// 폼 전체 단위: 스키마로 일괄 관리
const schema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  email: z.string().min(1, "이메일을 입력해주세요.").email("유효한 이메일 주소를 입력해주세요.")
});

export function Form() {
  const { register, formState: { errors }, handleSubmit } = useForm({
    defaultValues: { name: "", email: "" },
    resolver: zodResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register("name")} />
      <input {...register("email")} />
    </form>
  );
}
```

**사용하면 좋을 때:**
- 모든 필드가 하나의 비즈니스 로직을 이룰 때 (결제 정보, 배송 정보)
- 단계별 입력이 필요한 Wizard Form
- 필드 간에 의존성이 있을 때 (비밀번호 확인, 총액 계산)

#### 선택 기준 표

| 상황 | 필드 단위 | 폼 전체 단위 |
|------|-----------|--------------|
| 필드별 독립 검증 필요 | ✅ | ❌ |
| 필드 재사용 필요 | ✅ | ❌ |
| 단일 기능 완성 | ❌ | ✅ |
| 단계별 입력(Wizard) | ❌ | ✅ |
| 필드 간 의존성 있음 | ❌ | ✅ |

---

## 4. 결합도 (Coupling)

코드 간의 불필요한 의존성을 줄이고, 각 코드의 책임을 명확히 분리해야 수정 범위를 최소화할 수 있습니다.

### 4-1. 책임을 하나씩 관리하기

한 Hook/함수가 너무 많은 책임을 지면, 그것에 의존하는 모든 코드가 영향을 받습니다.

**문제점:**
- "페이지의 모든 쿼리 파라미터를 관리"라는 광범위한 책임
- Hook 수정 시 모든 의존 컴포넌트가 영향을 받음
- 새로운 파라미터 추가 시마다 복잡도 증가
- 시간이 지날수록 유지보수가 어려워짐

**개선:** 각 파라미터별로 독립적인 Hook을 만들어 변경 범위를 특정 파라미터로만 제한합니다.

### 4-2. 중복 코드 허용하기

중복을 없애기 위해 공통화한 컴포넌트/Hook이 여러 페이지에 영향을 주면, 오히려 결합도가 높아질 수 있습니다.

**문제점:**
- 페이지A에서 로깅 내용이 달라지면?
- 페이지B에서는 화면을 닫지 않아야 한다면?
- 각 페이지에서 바텀시트 텍스트가 다르다면?
- Hook은 복잡한 인자를 받아야 하고, 모든 의존 페이지를 테스트해야 함

**판단 기준:**

| 상황 | 공통화 | 중복 허용 |
|------|--------|-----------|
| 동작이 완전히 동일 | ✅ | ❌ |
| 향후 변경 가능성 있음 | ❌ | ✅ |
| 페이지별 특이 요구사항 | ❌ | ✅ |
| 여러 버전의 인자 필요 | ❌ | ✅ |
| 항상 같은 방식으로 동작 | ✅ | ❌ |

### 4-3. Props Drilling 지우기

**Props Drilling:** 부모가 사용하지 않는 prop을 자식에게 그저 전달만 하는 패턴

**문제점:**
- 부모-자식 간 불필요한 결합도 증가
- prop 이름 변경 시 모든 중간 컴포넌트를 수정해야 함
- 중간 컴포넌트의 책임이 불명확함

#### 해결방법 1: Composition 패턴 (가벼운 Props Drilling)

children을 사용해 자식 컴포넌트를 부모에서 직접 작성하여 중간 컴포넌트가 prop을 그저 전달할 필요가 없어집니다.

```tsx
// ✅ Composition 패턴
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

컴포넌트 구조가 깊거나 많은 값이 drilling되면 Context 사용하여 원하는 곳에서 직접 값을 가져올 수 있습니다.

```tsx
// ✅ Context API
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

**Context API 사용 시 주의사항:**
- Props는 컴포넌트의 역할과 의도를 표현하므로, 모든 값을 Context로 관리하면 안 됨
- 먼저 Composition 패턴으로 depth를 줄일 수 있는지 검토
- 정말 필요할 때만 마지막 수단으로 Context 사용
- 단순히 값을 전달하기만 하는 중간 컴포넌트는 Composition이 더 적합

---

## 사용 방법

### 코드 리뷰 시

1. 분석할 코드를 읽기
2. 4가지 원칙 기준으로 문제점 식별
3. 우선순위별로 개선점 제안

### 체크리스트

```
□ 가독성
  □ 한 컴포넌트/함수에 너무 많은 맥락이 섞여있지 않은가?
  □ 같이 실행되지 않는 코드가 분리되어 있는가?
  □ 조건문과 매직 넘버에 의미 있는 이름이 붙어있는가?
  □ 코드가 위에서 아래로 자연스럽게 읽히는가?
  □ 중첩 삼항 연산자가 사용되고 있지 않은가?

□ 예측 가능성
  □ 같은 종류의 함수들이 일관된 반환 타입을 가지는가?
  □ 함수 이름과 실제 동작이 일치하는가?
  □ 라이브러리와 겹치는 이름을 사용하고 있지 않은가?
  □ 숨겨진 부수 효과가 없는가?

□ 응집도
  □ 함께 수정되는 파일들이 같은 디렉토리에 있는가?
  □ 관련 상수와 로직이 함께 관리되고 있는가?
  □ 폼의 응집도가 요구사항에 맞게 설계되었는가?

□ 결합도
  □ 하나의 Hook/함수가 너무 많은 책임을 지고 있지 않은가?
  □ Props Drilling이 발생하고 있지 않은가?
  □ 불필요한 공통화로 결합도가 높아지지 않았는가?
```

## 참고 자료

상세한 예시와 설명은 [references/principles.md](references/principles.md)를 참조하세요.
