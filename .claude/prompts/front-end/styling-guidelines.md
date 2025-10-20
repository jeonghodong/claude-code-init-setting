# Tailwind CSS Styling Guidelines

## Utility-First Approach

### Basic Principles
```tsx
// Good: Use utility classes
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Click me
</button>

// Avoid: Inline styles (unless absolutely necessary)
<button style={{ padding: '8px 16px', backgroundColor: 'blue' }}>
  Click me
</button>
```

## Responsive Design

### Mobile-First Breakpoints
```tsx
// Tailwind breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)

<div className="
  w-full           // Mobile: full width
  sm:w-1/2         // Small screens: half width
  md:w-1/3         // Medium screens: one-third width
  lg:w-1/4         // Large screens: quarter width
  p-4              // Padding on all sizes
  sm:p-6           // More padding on small+ screens
  md:p-8           // Even more padding on medium+ screens
">
  Responsive content
</div>
```

### Common Responsive Patterns
```tsx
// Stack on mobile, grid on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card />
  <Card />
  <Card />
</div>

// Hidden on mobile, visible on desktop
<aside className="hidden lg:block">
  Sidebar content
</aside>

// Flex direction changes
<div className="flex flex-col md:flex-row gap-4">
  <div>Left</div>
  <div>Right</div>
</div>
```

## Layout Patterns

### Flexbox
```tsx
// Center content
<div className="flex items-center justify-center h-screen">
  <h1>Centered</h1>
</div>

// Space between items
<nav className="flex justify-between items-center p-4">
  <Logo />
  <Menu />
</nav>

// Column layout
<div className="flex flex-col gap-4">
  <header />
  <main />
  <footer />
</div>
```

### Grid
```tsx
// Equal columns
<div className="grid grid-cols-3 gap-4">
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
</div>

// Asymmetric grid
<div className="grid grid-cols-12 gap-4">
  <aside className="col-span-3">Sidebar</aside>
  <main className="col-span-9">Content</main>
</div>

// Auto-fit responsive grid
<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
  <Card />
  <Card />
  <Card />
</div>
```

## Color System

### Using CSS Variables
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --secondary: 217.2 32.6% 17.5%;
  --accent: 217.2 32.6% 17.5%;
  --destructive: 0 62.8% 30.6%;
}
```

```tsx
// Use in components
<div className="bg-background text-foreground">
  <h1 className="text-primary">Title</h1>
  <p className="text-secondary">Description</p>
</div>
```

### Dark Mode
```tsx
// Enable dark mode in tailwind.config.ts
export default {
  darkMode: 'class', // or 'media'
  // ...
}

// Toggle dark mode
'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Check system preference or localStorage
    const isDark = localStorage.theme === 'dark' ||
      (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.theme = newDark ? 'dark' : 'light';
  };

  return (
    <button onClick={toggleTheme}>
      {dark ? '🌙' : '☀️'}
    </button>
  );
}

// Use dark mode variants
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content adapts to theme
</div>
```

## Typography

### Font Families
```tsx
// Use Geist fonts (from layout.tsx)
import { GeistSans, GeistMono } from 'geist/font';

<body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
  <p className="font-sans">Body text (Geist Sans)</p>
  <code className="font-mono">Code (Geist Mono)</code>
</body>
```

### Text Styles
```tsx
// Headings
<h1 className="text-4xl font-bold tracking-tight">Hero Title</h1>
<h2 className="text-3xl font-semibold">Section Title</h2>
<h3 className="text-2xl font-medium">Subsection</h3>

// Body text
<p className="text-base leading-relaxed">Regular paragraph text</p>
<p className="text-sm text-gray-600 dark:text-gray-400">Secondary text</p>

// Truncate long text
<p className="truncate">This text will be cut off with ellipsis...</p>
<p className="line-clamp-3">This text will show max 3 lines then ellipsis...</p>
```

## Component Patterns

### Button Variants
```tsx
// components/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-secondary text-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent',
        ghost: 'hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-11 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}

// Usage
<Button variant="default">Primary</Button>
<Button variant="secondary" size="sm">Small Secondary</Button>
<Button variant="outline">Outline</Button>
```

### Card Component
```tsx
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="p-6">{children}</div>;
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div className="p-6 pt-0">{children}</div>;
}

// Usage
<Card>
  <CardHeader>
    <h3 className="text-2xl font-semibold">Card Title</h3>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

## Animations & Transitions

### Hover Effects
```tsx
// Simple hover
<button className="bg-blue-500 hover:bg-blue-600 transition-colors">
  Hover me
</button>

// Transform on hover
<div className="transform hover:scale-105 transition-transform duration-200">
  Scale on hover
</div>

// Multiple effects
<a className="group relative">
  <span className="group-hover:underline">Link</span>
  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-current group-hover:w-full transition-all" />
</a>
```

### Loading States
```tsx
// Skeleton loader
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded w-3/4" />
  <div className="h-4 bg-gray-200 rounded" />
  <div className="h-4 bg-gray-200 rounded w-5/6" />
</div>

// Spinner
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
```

## Accessibility

### Focus States
```tsx
// Visible focus indicator
<button className="
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-blue-500
  focus-visible:ring-offset-2
">
  Accessible button
</button>

// Focus within
<div className="border focus-within:border-blue-500 focus-within:ring-2">
  <input className="outline-none" />
</div>
```

### Screen Reader Only
```tsx
// Visually hidden but accessible
<span className="sr-only">Screen reader only text</span>

// Skip to main content
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4">
  Skip to main content
</a>
```

## Best Practices

### Organizing Classes
```tsx
// Use consistent ordering: layout → spacing → sizing → colors → typography → effects
<div className="
  flex items-center justify-between    // Layout
  p-4 gap-4                            // Spacing
  w-full max-w-4xl                     // Sizing
  bg-white dark:bg-gray-900            // Colors
  text-lg font-semibold                // Typography
  rounded-lg shadow-md                 // Effects
  hover:shadow-lg transition-shadow    // Interactive
">
  Content
</div>
```

### Extracting Components
```tsx
// Bad: Repeated utility classes
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Button 1</button>
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Button 2</button>

// Good: Extract to component
function PrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      {children}
    </button>
  );
}
```

### Custom Utilities (Sparingly)
```css
/* app/globals.css */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

## Summary

1. **Mobile-first**: Design for mobile, enhance for desktop
2. **Utility classes**: Prefer utilities over custom CSS
3. **Consistent spacing**: Use Tailwind's scale (4, 8, 16, etc.)
4. **Dark mode**: Support both light and dark themes
5. **Accessibility**: Always include focus states and ARIA labels
6. **Performance**: Extract repeated patterns into components
7. **Type safety**: Use TypeScript for component props
8. **Responsive**: Test on all breakpoints
