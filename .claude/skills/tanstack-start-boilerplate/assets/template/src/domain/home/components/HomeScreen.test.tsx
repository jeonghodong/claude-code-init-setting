import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { HomeScreen } from './HomeScreen'

test('renders the localized heading and lead text', () => {
  render(<HomeScreen />)

  expect(screen.getByRole('heading', { level: 1 })).toBeDefined()
  expect(screen.getByText('Welcome to your i18n app.')).toBeDefined()
})
