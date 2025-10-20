# Web Accessibility (A11y) Guidelines

## WCAG 2.1 AA Compliance

### Core Principles (POUR)
- **Perceivable**: Users can perceive the information
- **Operable**: Users can operate the interface
- **Understandable**: Users can understand the information
- **Robust**: Content works across technologies

## Semantic HTML

### Use Proper Elements
```tsx
// Good: Semantic HTML
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Article content...</p>
  </article>
</main>

<footer>
  <p>&copy; 2025 Company</p>
</footer>

// Bad: Generic divs everywhere
<div className="header">
  <div className="nav">
    <div className="nav-item">Home</div>
    <div className="nav-item">About</div>
  </div>
</div>
```

### Heading Hierarchy
```tsx
// Good: Proper heading order
<h1>Page Title</h1>
<section>
  <h2>Section Title</h2>
  <h3>Subsection</h3>
  <h3>Another Subsection</h3>
</section>
<section>
  <h2>Another Section</h2>
</section>

// Bad: Skipping levels
<h1>Page Title</h1>
<h4>Wait, what happened to h2 and h3?</h4>
```

## ARIA Attributes

### When to Use ARIA
```tsx
// Good: Native HTML (ARIA not needed)
<button onClick={handleClick}>Click me</button>

// Good: ARIA when native element isn't available
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  aria-label="Close dialog"
>
  ×
</div>

// Bad: Unnecessary ARIA
<button role="button" aria-label="Click me">Click me</button>
```

### Common ARIA Patterns
```tsx
// Modal/Dialog
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-description">Are you sure you want to proceed?</p>
  <button>Confirm</button>
  <button>Cancel</button>
</div>

// Dropdown Menu
<button
  aria-haspopup="true"
  aria-expanded={isOpen}
  onClick={() => setIsOpen(!isOpen)}
>
  Menu
</button>
{isOpen && (
  <ul role="menu">
    <li role="menuitem"><button>Option 1</button></li>
    <li role="menuitem"><button>Option 2</button></li>
  </ul>
)}

// Loading State
<div aria-live="polite" aria-busy={loading}>
  {loading ? 'Loading...' : 'Content loaded'}
</div>

// Form Validation
<input
  type="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? 'email-error' : undefined}
/>
{hasError && (
  <span id="email-error" role="alert">
    Please enter a valid email
  </span>
)}
```

## Keyboard Navigation

### Focus Management
```tsx
'use client';

import { useRef, useEffect } from 'react';

// Focus trap for modals
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus first focusable element
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements?.[0] as HTMLElement;
    firstElement?.focus();

    // Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded-lg">
        {children}
      </div>
    </div>
  );
}
```

### Tab Order
```tsx
// Control tab order with tabIndex
<div>
  <button tabIndex={1}>First</button>
  <button tabIndex={3}>Third</button>
  <button tabIndex={2}>Second</button>
  <button tabIndex={-1}>Not in tab order</button>
  <button tabIndex={0}>Natural tab order</button>
</div>

// Better: Use natural DOM order
<div>
  <button>First</button>
  <button>Second</button>
  <button>Third</button>
  <button tabIndex={-1}>Skip this</button>
</div>
```

### Skip Links
```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-500 focus:text-white"
        >
          Skip to main content
        </a>
        <nav>Navigation...</nav>
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
```

## Form Accessibility

### Labels and Inputs
```tsx
// Good: Explicit label association
<div>
  <label htmlFor="email">Email Address</label>
  <input
    id="email"
    type="email"
    name="email"
    required
    aria-required="true"
  />
</div>

// Good: Implicit association
<label>
  Email Address
  <input type="email" name="email" required />
</label>

// Bad: No label
<input type="email" placeholder="Email" />

// Better: Hidden label if design requires
<label htmlFor="email" className="sr-only">Email Address</label>
<input id="email" type="email" placeholder="Email" />
```

### Error Messages
```tsx
'use client';

import { useState } from 'react';

export function ContactForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    // Submit form
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">
          Email Address
          <span aria-label="required">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? 'email-error' : undefined}
          required
        />
        {error && (
          <span id="email-error" role="alert" className="text-red-500">
            {error}
          </span>
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Fieldsets and Legends
```tsx
// Group related inputs
<fieldset>
  <legend>Shipping Address</legend>
  <label htmlFor="street">Street</label>
  <input id="street" type="text" />

  <label htmlFor="city">City</label>
  <input id="city" type="text" />

  <label htmlFor="zip">ZIP Code</label>
  <input id="zip" type="text" />
</fieldset>
```

## Color and Contrast

### Contrast Ratios (WCAG AA)
```tsx
// Minimum contrast ratios:
// - Normal text: 4.5:1
// - Large text (18pt+): 3:1
// - UI components: 3:1

// Good: Sufficient contrast
<p className="text-gray-900 bg-white">
  High contrast text
</p>

// Bad: Low contrast
<p className="text-gray-400 bg-gray-300">
  Hard to read
</p>

// Check contrast with tools:
// - WebAIM Contrast Checker
// - Chrome DevTools Accessibility Panel
```

### Don't Rely on Color Alone
```tsx
// Bad: Color only
<button className="bg-red-500">Error</button>
<button className="bg-green-500">Success</button>

// Good: Color + icon + text
<button className="bg-red-500 flex items-center gap-2">
  <XIcon aria-hidden="true" />
  <span>Error</span>
</button>

<button className="bg-green-500 flex items-center gap-2">
  <CheckIcon aria-hidden="true" />
  <span>Success</span>
</button>
```

## Images and Media

### Alternative Text
```tsx
import Image from 'next/image';

// Informative images
<Image
  src="/product.jpg"
  alt="Blue cotton t-shirt with round neck"
  width={400}
  height={400}
/>

// Decorative images (empty alt)
<Image
  src="/decoration.svg"
  alt=""
  width={100}
  height={100}
  aria-hidden="true"
/>

// Complex images (use longdesc or caption)
<figure>
  <Image
    src="/chart.png"
    alt="Sales chart showing 50% increase"
    width={600}
    height={400}
  />
  <figcaption>
    Detailed description: Sales increased from $100K in Q1 to $150K in Q2...
  </figcaption>
</figure>

// Icons with meaning
<button>
  <TrashIcon aria-label="Delete item" />
</button>

// Icons that are decorative
<button>
  <CheckIcon aria-hidden="true" />
  <span>Submit</span>
</button>
```

### Video and Audio
```tsx
// Provide captions and transcripts
<video controls>
  <source src="/video.mp4" type="video/mp4" />
  <track
    kind="captions"
    src="/captions.vtt"
    srclang="en"
    label="English"
    default
  />
  <track
    kind="descriptions"
    src="/descriptions.vtt"
    srclang="en"
    label="Audio descriptions"
  />
</video>

// Audio player with transcript
<div>
  <audio controls>
    <source src="/podcast.mp3" type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>
  <details>
    <summary>Read transcript</summary>
    <p>Full transcript of the audio...</p>
  </details>
</div>
```

## Screen Reader Best Practices

### Visually Hidden Text
```tsx
// Tailwind SR-only class
<button>
  <span className="sr-only">Close menu</span>
  <XIcon aria-hidden="true" />
</button>

// Custom sr-only
// globals.css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Live Regions
```tsx
// Announce dynamic content changes
'use client';

export function SearchResults({ query, results }: Props) {
  return (
    <div>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {results.length} results found for "{query}"
      </div>

      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}

// Different politeness levels:
// - "polite": Announce when user is idle
// - "assertive": Announce immediately
// - "off": Don't announce (default)
```

## Testing Accessibility

### Tools
```bash
# Install axe DevTools extension
# - Chrome: axe DevTools
# - Firefox: axe DevTools

# Run automated tests
npm install --save-dev @axe-core/react

# In development
import React from 'react';

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  import('@axe-core/react').then(axe => {
    axe.default(React, ReactDOM, 1000);
  });
}
```

### Manual Testing
1. **Keyboard only**: Tab through entire page, no mouse
2. **Screen reader**: Test with NVDA (Windows) or VoiceOver (Mac)
3. **Zoom**: Test at 200% zoom level
4. **Color blindness**: Use Chrome's vision deficiency emulator
5. **High contrast**: Enable high contrast mode (Windows)

### Automated Testing
```tsx
// Using jest-axe
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

test('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Best Practices Summary

1. **Use semantic HTML**: header, nav, main, article, footer
2. **Proper headings**: Logical h1-h6 hierarchy
3. **Keyboard accessible**: All interactive elements focusable
4. **Form labels**: Every input has associated label
5. **Alt text**: Meaningful alternatives for images
6. **Color contrast**: Meet WCAG AA standards (4.5:1)
7. **Focus indicators**: Visible focus states
8. **ARIA sparingly**: Use native HTML when possible
9. **Screen reader friendly**: Test with actual screen readers
10. **Test regularly**: Automated + manual testing

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)
