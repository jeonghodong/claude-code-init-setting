# Frontend Performance Optimization

## Core Web Vitals

### Understanding the Metrics
- **LCP (Largest Contentful Paint)**: Should be < 2.5s
- **FID (First Input Delay)**: Should be < 100ms
- **CLS (Cumulative Layout Shift)**: Should be < 0.1

## Next.js 15 App Router Optimization

### Server Components (Default)
```tsx
// Good: Server Component (default) - no client-side JS
export default async function ProductPage({ params }: { params: { id: string } }) {
  // Data fetching happens on server
  const product = await db.product.findUnique({
    where: { id: params.id }
  });

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <ProductImages images={product.images} />
    </div>
  );
}

// Only use Client Components when necessary
'use client';

export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <button onClick={() => addToCart(productId)}>
      Add to Cart
    </button>
  );
}
```

### Data Fetching Patterns
```tsx
// Parallel data fetching
export default async function Dashboard() {
  // These fetch in parallel, not sequentially!
  const [user, posts, stats] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchStats()
  ]);

  return (
    <div>
      <UserProfile user={user} />
      <PostList posts={posts} />
      <StatsWidget stats={stats} />
    </div>
  );
}

// Sequential when dependencies exist
export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await fetchPost(params.id);
  const author = await fetchAuthor(post.authorId); // Depends on post

  return <Post post={post} author={author} />;
}
```

### Streaming with Suspense
```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      {/* Load immediately */}
      <Header />

      {/* Stream when ready */}
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>

      <Suspense fallback={<CommentsSkeleton />}>
        <Comments />
      </Suspense>
    </div>
  );
}

// Posts component can be async
async function Posts() {
  const posts = await fetchPosts();
  return <PostList posts={posts} />;
}
```

## Image Optimization

### Next.js Image Component
```tsx
import Image from 'next/image';

// Good: Optimized with proper sizing
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // Load immediately for above-fold images
  placeholder="blur" // Show blur while loading
  blurDataURL="data:image/jpeg;base64,..." // Inline blur placeholder
/>

// Responsive images
<Image
  src="/product.jpg"
  alt="Product"
  fill // Fill parent container
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
/>

// Bad: Regular img tag (no optimization)
<img src="/large-image.jpg" alt="Not optimized" />
```

### Image Best Practices
```tsx
// 1. Set explicit width/height to prevent CLS
<Image src="/image.jpg" width={400} height={300} alt="..." />

// 2. Use priority for above-fold images
<Image src="/hero.jpg" priority alt="Hero" width={1200} height={600} />

// 3. Lazy load below-fold images (default)
<Image src="/footer.jpg" loading="lazy" alt="Footer" width={800} height={400} />

// 4. Use modern formats (WebP, AVIF)
// Next.js does this automatically!

// 5. Responsive images with sizes
<Image
  src="/responsive.jpg"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  fill
  alt="Responsive"
/>
```

## Code Splitting & Lazy Loading

### Dynamic Imports
```tsx
import dynamic from 'next/dynamic';

// Lazy load heavy component
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false // Disable SSR if not needed
});

// Conditional loading
const AdminPanel = dynamic(() => import('@/components/AdminPanel'), {
  ssr: false
});

export default function Dashboard({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div>
      <h1>Dashboard</h1>
      {isAdmin && <AdminPanel />}
    </div>
  );
}

// Load with named export
const Map = dynamic(() => import('@/components/Map').then(mod => mod.Map), {
  loading: () => <div>Loading map...</div>,
  ssr: false // Maps usually need window object
});
```

### Route-Based Code Splitting
```tsx
// Next.js automatically code-splits by route
// app/dashboard/page.tsx - separate bundle
// app/profile/page.tsx - separate bundle
// app/settings/page.tsx - separate bundle

// Each route only loads what it needs!
```

## React Performance

### Memoization
```tsx
import { memo, useMemo, useCallback } from 'react';

// memo: Prevent unnecessary re-renders
export const ProductCard = memo(({ product }: { product: Product }) => {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
});

// useMemo: Cache expensive calculations
function ProductList({ products, filter }: Props) {
  const filteredProducts = useMemo(() => {
    console.log('Filtering products'); // Only runs when dependencies change
    return products.filter(p => p.category === filter);
  }, [products, filter]);

  return <div>{/* render filteredProducts */}</div>;
}

// useCallback: Stable function references
function ParentComponent() {
  const [count, setCount] = useState(0);

  // Without useCallback, new function created every render
  const handleIncrement = useCallback(() => {
    setCount(c => c + 1);
  }, []); // Empty deps = function never changes

  return <ExpensiveChild onClick={handleIncrement} />;
}
```

### When NOT to Memoize
```tsx
// Don't memoize everything!

// Bad: Over-optimization for simple component
const SimpleButton = memo(({ onClick }: { onClick: () => void }) => {
  return <button onClick={onClick}>Click</button>;
});

// Good: Just a regular component
function SimpleButton({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick}>Click</button>;
}

// Memoize only when:
// 1. Component renders often with same props
// 2. Component has expensive rendering logic
// 3. Profiler shows performance issue
```

### Virtual Lists
```tsx
// For long lists, use virtualization
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }: { items: Item[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <ItemRow item={items[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}

// Bad: Rendering 10,000 items at once
{items.map(item => <ItemRow key={item.id} item={item} />)}

// Good: Only render visible items
<VirtualizedList items={items} />
```

## Bundle Size Optimization

### Analyze Bundle
```bash
# Install bundle analyzer
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... your config
});

# Run analysis
ANALYZE=true npm run build
```

### Tree Shaking
```tsx
// Good: Import only what you need
import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';

// Bad: Importing entire library
import * as React from 'react';
import * as Components from '@/components';

// Good: Named imports for tree shaking
import { map, filter } from 'lodash-es';

// Bad: Default import (includes entire lodash)
import _ from 'lodash';
```

### Remove Unused Dependencies
```bash
# Find unused dependencies
npx depcheck

# Remove unused packages
npm uninstall unused-package
```

## Font Optimization

### Using next/font
```tsx
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono'
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}

// Fonts are automatically optimized and self-hosted!
```

## State Management Performance

### Avoid Prop Drilling
```tsx
// Bad: Prop drilling through many levels
<GrandParent data={data}>
  <Parent data={data}>
    <Child data={data}>
      <GrandChild data={data} />
    </Child>
  </Parent>
</GrandParent>

// Good: Use Context for deeply nested state
const DataContext = createContext<Data | null>(null);

function GrandParent({ data }: { data: Data }) {
  return (
    <DataContext.Provider value={data}>
      <Parent />
    </DataContext.Provider>
  );
}

function GrandChild() {
  const data = useContext(DataContext);
  return <div>{data?.value}</div>;
}
```

### Optimize Context Updates
```tsx
// Bad: Single context with all state (causes unnecessary re-renders)
const AppContext = createContext({ user, theme, settings });

// Good: Separate contexts for independent state
const UserContext = createContext(user);
const ThemeContext = createContext(theme);
const SettingsContext = createContext(settings);

// Components only re-render when their context changes
```

## Network Performance

### Prefetching
```tsx
import Link from 'next/link';

// Next.js automatically prefetches links in viewport
<Link href="/products" prefetch={true}>
  Products
</Link>

// Programmatic prefetching
import { useRouter } from 'next/navigation';

const router = useRouter();
router.prefetch('/dashboard');
```

### Request Deduplication
```tsx
// Next.js automatically deduplicates identical requests
// These fetch calls will only make ONE request:
async function Page() {
  const data1 = await fetch('https://api.example.com/data');
  const data2 = await fetch('https://api.example.com/data'); // Deduplicated!

  return <div>...</div>;
}
```

## Monitoring Performance

### Web Vitals
```tsx
// app/layout.tsx
export function reportWebVitals(metric: any) {
  console.log(metric);

  // Send to analytics
  if (metric.label === 'web-vital') {
    analytics.track('Web Vital', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating
    });
  }
}
```

### Performance Monitoring
```tsx
'use client';

import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor long tasks
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('Long task detected:', entry);
        }
      }
    });

    observer.observe({ entryTypes: ['longtask'] });

    return () => observer.disconnect();
  }, []);

  return null;
}
```

## Best Practices Summary

1. **Server Components first**: Minimize client-side JavaScript
2. **Optimize images**: Use Next.js Image with proper sizing
3. **Code split**: Lazy load heavy components
4. **Memoize wisely**: Only when profiler shows benefit
5. **Virtual lists**: For long lists (>100 items)
6. **Tree shake**: Import only what you need
7. **Prefetch routes**: Use Link with prefetch
8. **Monitor vitals**: Track LCP, FID, CLS
9. **Streaming**: Use Suspense for better UX
10. **Fonts**: Use next/font for optimization
