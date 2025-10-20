# State Management Patterns

## State Location Decision Tree

```
Is the state needed by multiple components?
├─ No → Use local component state (useState)
└─ Yes → Is it URL-sharable/bookmarkable?
    ├─ Yes → Use URL state (searchParams, pathname)
    └─ No → Is it global UI state?
        ├─ Yes → Use Context API
        └─ No → Consider server state library (React Query, SWR)
```

## Local Component State

### useState
```tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Functional updates (when new state depends on previous)
const [count, setCount] = useState(0);
setCount(prevCount => prevCount + 1); // Better for async updates
```

### useReducer
```tsx
'use client';

import { useReducer } from 'react';

type State = {
  count: number;
  step: number;
};

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'setStep'; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'reset':
      return { ...state, count: 0 };
    case 'setStep':
      return { ...state, step: action.payload };
    default:
      return state;
  }
}

export function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <input
        type="number"
        value={state.step}
        onChange={(e) => dispatch({ type: 'setStep', payload: Number(e.target.value) })}
      />
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

## URL State (Next.js 15)

### Search Parameters
```tsx
// app/products/page.tsx
import { Suspense } from 'react';

export default function ProductsPage({
  searchParams
}: {
  searchParams: { category?: string; sort?: string; page?: string }
}) {
  return (
    <div>
      <Suspense fallback={<FiltersSkeleton />}>
        <Filters searchParams={searchParams} />
      </Suspense>

      <Suspense fallback={<ProductsSkeleton />}>
        <ProductList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// components/Filters.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <select
        value={searchParams.get('category') || ''}
        onChange={(e) => updateFilter('category', e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <select
        value={searchParams.get('sort') || 'newest'}
        onChange={(e) => updateFilter('sort', e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </div>
  );
}
```

### Dynamic Routes
```tsx
// app/posts/[slug]/page.tsx
export default async function PostPage({
  params
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}

// Programmatic navigation
'use client';

import { useRouter } from 'next/navigation';

export function PostCard({ post }: { post: Post }) {
  const router = useRouter();

  return (
    <div onClick={() => router.push(`/posts/${post.slug}`)}>
      <h2>{post.title}</h2>
    </div>
  );
}
```

## Context API

### Creating Context
```tsx
// contexts/ThemeContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for easy access
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Usage in app/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

// Usage in components
'use client';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

### Optimizing Context Performance
```tsx
// Split contexts to avoid unnecessary re-renders
// contexts/UserContext.tsx
type UserContextType = {
  user: User | null;
  isLoading: boolean;
};

type UserActionsContextType = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileDto) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);
const UserActionsContext = createContext<UserActionsContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    // Login logic
  };

  const logout = async () => {
    // Logout logic
  };

  const updateProfile = async (data: UpdateProfileDto) => {
    // Update logic
  };

  // Split into two contexts
  // Components using only actions won't re-render when user data changes
  return (
    <UserContext.Provider value={{ user, isLoading }}>
      <UserActionsContext.Provider value={{ login, logout, updateProfile }}>
        {children}
      </UserActionsContext.Provider>
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};

export const useUserActions = () => {
  const context = useContext(UserActionsContext);
  if (!context) throw new Error('useUserActions must be used within UserProvider');
  return context;
};
```

## Server State (React Query / SWR)

### Using SWR
```tsx
// Install: npm install swr

// lib/fetcher.ts
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

// hooks/useUser.ts
'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export function useUser(userId: string) {
  const { data, error, isLoading, mutate } = useSWR<User>(
    `/api/users/${userId}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000 // Dedupe requests within 2s
    }
  );

  return {
    user: data,
    isLoading,
    isError: error,
    mutate // Manually revalidate
  };
}

// Usage
export function UserProfile({ userId }: { userId: string }) {
  const { user, isLoading, isError } = useUser(userId);

  if (isLoading) return <Skeleton />;
  if (isError) return <Error />;
  if (!user) return <NotFound />;

  return <div>{user.name}</div>;
}
```

### Mutations with SWR
```tsx
'use client';

import useSWRMutation from 'swr/mutation';

async function updateUser(url: string, { arg }: { arg: UpdateUserDto }) {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg)
  });

  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export function EditProfile({ userId }: { userId: string }) {
  const { trigger, isMutating } = useSWRMutation(
    `/api/users/${userId}`,
    updateUser
  );

  const handleSubmit = async (data: UpdateUserDto) => {
    try {
      await trigger(data);
      // Optimistically update or revalidate
    } catch (err) {
      console.error('Failed to update:', err);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({ name: 'New Name' });
    }}>
      <button type="submit" disabled={isMutating}>
        {isMutating ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

## Form State

### Controlled Components
```tsx
'use client';

import { useState } from 'react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Server Actions (Next.js 15)
```tsx
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await db.post.create({
    data: { title, content }
  });

  revalidatePath('/posts');
}

// app/posts/new/page.tsx
import { createPost } from '@/app/actions';

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  );
}

// With useFormState for optimistic UI
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createPost } from '@/app/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  );
}

export function NewPostForm() {
  const [state, formAction] = useFormState(createPost, null);

  return (
    <form action={formAction}>
      <input name="title" required />
      <textarea name="content" required />
      <SubmitButton />
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}
```

## Best Practices Summary

1. **Start local**: Use useState for component-specific state
2. **URL for shareable state**: Filters, pagination, search
3. **Context sparingly**: Only for truly global UI state
4. **Split contexts**: Avoid unnecessary re-renders
5. **Server state libraries**: For API data (SWR, React Query)
6. **useReducer for complex state**: Multiple related values
7. **Server Actions**: For form submissions in Next.js 15
8. **Avoid prop drilling**: Use context or composition
9. **Memoize context values**: Prevent unnecessary re-renders
10. **Type everything**: Use TypeScript for state types
