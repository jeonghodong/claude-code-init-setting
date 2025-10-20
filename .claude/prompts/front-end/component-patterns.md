# React Component Patterns & Best Practices

## Component Composition

### Server vs Client Components (Next.js 15)
```typescript
// Server Component (default)
// app/posts/page.tsx
export default async function PostsPage() {
  const posts = await db.post.findMany(); // Can directly query database

  return (
    <div>
      <h1>Posts</h1>
      <PostList posts={posts} />
    </div>
  );
}

// Client Component (when needed)
// components/LikeButton.tsx
'use client';

import { useState } from 'react';

export function LikeButton({ postId }: { postId: number }) {
  const [liked, setLiked] = useState(false);

  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '❤️' : '🤍'}
    </button>
  );
}
```

### When to Use Client Components
Use `'use client'` only when you need:
- Interactive event handlers (onClick, onChange, etc.)
- useState, useEffect, useContext
- Browser-only APIs (window, localStorage, etc.)
- Third-party libraries that use client-side features

### Component Composition Pattern
```typescript
// Good: Compose Server and Client components
// app/posts/[id]/page.tsx (Server Component)
export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await db.post.findUnique({ where: { id: params.id } });

  return (
    <article>
      <h1>{post.title}</h1>
      <PostContent content={post.content} />
      {/* Client component for interactivity */}
      <LikeButton postId={post.id} />
      <CommentSection postId={post.id} />
    </article>
  );
}
```

## Custom Hooks

### Extracting Reusable Logic
```typescript
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### Form Handling Hook
```typescript
// hooks/useForm.ts
import { useState, ChangeEvent, FormEvent } from 'react';

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  reset: () => void;
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void>,
  validate?: (values: T) => Partial<Record<keyof T, string>>
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    await onSubmit(values);
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, handleChange, handleSubmit, reset };
}

// Usage
function ContactForm() {
  const { values, errors, handleChange, handleSubmit } = useForm(
    { name: '', email: '', message: '' },
    async (values) => {
      await sendContactForm(values);
    },
    (values) => {
      const errors: any = {};
      if (!values.name) errors.name = 'Name is required';
      if (!values.email.includes('@')) errors.email = 'Invalid email';
      return errors;
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={values.name} onChange={handleChange} />
      {errors.name && <span className="text-red-500">{errors.name}</span>}
      {/* ... */}
    </form>
  );
}
```

## Component Patterns

### Compound Component Pattern
```typescript
// components/Tabs.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type TabsContextType = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function Tabs({ children, defaultTab }: { children: ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: ReactNode }) {
  return <div className="flex border-b">{children}</div>;
}

function Tab({ value, children }: { value: string; children: ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');

  const { activeTab, setActiveTab } = context;

  return (
    <button
      className={`px-4 py-2 ${activeTab === value ? 'border-b-2 border-blue-500' : ''}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');

  if (context.activeTab !== value) return null;

  return <div className="p-4">{children}</div>;
}

Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// Usage
<Tabs defaultTab="profile">
  <Tabs.List>
    <Tabs.Tab value="profile">Profile</Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="profile">Profile content</Tabs.Panel>
  <Tabs.Panel value="settings">Settings content</Tabs.Panel>
</Tabs>
```

### Render Props Pattern
```typescript
// components/DataFetcher.tsx
type DataFetcherProps<T> = {
  url: string;
  children: (data: T | null, loading: boolean, error: Error | null) => ReactNode;
};

export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return <>{children(data, loading, error)}</>;
}

// Usage
<DataFetcher<User> url="/api/user">
  {(user, loading, error) => {
    if (loading) return <Spinner />;
    if (error) return <Error message={error.message} />;
    return <UserProfile user={user} />;
  }}
</DataFetcher>
```

## TypeScript Best Practices

### Component Props Types
```typescript
// Good: Explicit prop types
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// With HTML attributes
import { ButtonHTMLAttributes } from 'react';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function CustomButton({ variant = 'primary', ...props }: CustomButtonProps) {
  return <button className={`btn-${variant}`} {...props} />;
}
```

### Generics in Components
```typescript
// Generic List component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string | number;
}

export function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}

// Usage
<List
  items={users}
  keyExtractor={(user) => user.id}
  renderItem={(user) => <UserCard user={user} />}
/>
```

## Error Boundaries

```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-800 font-bold">Something went wrong</h2>
          <p className="text-red-600">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<ErrorFallback />}>
  <MyComponent />
</ErrorBoundary>
```

## Performance Optimization

### Memoization
```typescript
import { memo, useMemo, useCallback } from 'react';

// Memo component (prevent unnecessary re-renders)
export const ExpensiveComponent = memo(({ data }: { data: Data }) => {
  // This component only re-renders if data changes
  return <div>{/* render logic */}</div>;
});

// useMemo for expensive calculations
function ProductList({ products, searchTerm }: Props) {
  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return <div>{/* render filteredProducts */}</div>;
}

// useCallback for stable function references
function ParentComponent() {
  const [count, setCount] = useState(0);

  // Without useCallback, this creates new function on every render
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <ChildComponent onClick={handleClick} />;
}
```

### Code Splitting
```typescript
// Dynamic imports with next/dynamic
import dynamic from 'next/dynamic';

// Lazy load heavy component
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false // Disable server-side rendering if needed
});

// Use in component
export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChart data={data} />
    </div>
  );
}
```

## Best Practices Summary

1. **Prefer Server Components**: Use client components only when necessary
2. **Extract custom hooks**: Reuse logic across components
3. **Type everything**: Use TypeScript for all component props
4. **Memoize wisely**: Use memo/useMemo/useCallback for expensive operations
5. **Error boundaries**: Catch and handle errors gracefully
6. **Code split**: Lazy load heavy components
7. **Composition over inheritance**: Build complex UIs from simple components
8. **Single responsibility**: Each component should do one thing well
