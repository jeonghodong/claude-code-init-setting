import { createGlobalTheme } from '@vanilla-extract/css'

// Vanilla-extract bridge over the Astryx design tokens. Custom styles written
// with vanilla-extract should pull values from `vars` so they stay in sync
// with the active Astryx theme instead of hardcoding hex/px values.
export const vars = createGlobalTheme(':root', {
  space: {
    1: 'var(--spacing-1)',
    2: 'var(--spacing-2)',
    4: 'var(--spacing-4)',
    8: 'var(--spacing-8)',
  },
  font: {
    family: {
      body: 'var(--font-family-body)',
      heading: 'var(--font-family-heading)',
    },
    size: {
      base: 'var(--font-size-base)',
      lg: 'var(--font-size-lg)',
      '4xl': 'var(--font-size-4xl)',
    },
    weight: {
      normal: 'var(--font-weight-normal)',
      bold: 'var(--font-weight-bold)',
    },
  },
  color: {
    text: 'var(--color-text-primary)',
    textSecondary: 'var(--color-text-secondary)',
    bg: 'var(--color-background-body)',
    surface: 'var(--color-background-surface)',
    border: 'var(--color-border)',
    accent: 'var(--color-accent)',
  },
  radius: {
    element: 'var(--radius-element)',
    full: 'var(--radius-full)',
  },
})
