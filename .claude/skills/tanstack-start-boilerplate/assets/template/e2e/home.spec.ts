import { expect, test } from '@playwright/test'

test('home renders in English at /', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Home page')
  await expect(page.getByText('Welcome to your i18n app.')).toBeVisible()
})

test('home renders in German at /de', async ({ page }) => {
  await page.goto('/de/')

  await expect(page.locator('html')).toHaveAttribute('lang', 'de')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Startseite')
  await expect(page.getByText('Willkommen in deiner i18n-App.')).toBeVisible()
})

test('locale switcher navigates to the German URL', async ({ page }) => {
  await page.goto('/')
  // The click handler only exists after hydration; wait for the page to settle.
  await page.waitForLoadState('networkidle')

  // The locale switcher is a SegmentedControl, whose items render as radios.
  await page.getByRole('radio', { name: 'DE', exact: true }).click()
  await expect(page).toHaveURL(/\/de\//)
  await expect(page.locator('html')).toHaveAttribute('lang', 'de')
})
