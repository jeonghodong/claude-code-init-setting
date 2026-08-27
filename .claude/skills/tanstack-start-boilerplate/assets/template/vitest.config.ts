import path from 'node:path'
import { defineConfig } from 'vitest/config'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import viteReact from '@vitejs/plugin-react'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

// Kept separate from vite.config.ts: the app plugin stack (devtools,
// tanstackStart, nitro) keeps the vitest process alive after the run.
export default defineConfig({
  test: {
    projects: [
      {
        plugins: [
          paraglideVitePlugin({
            project: './src/i18n/project.inlang',
            outdir: './src/i18n/paraglide',
          }),
          vanillaExtractPlugin(),
          viteReact(),
        ],
        resolve: {
          tsconfigPaths: true,
        },
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}'],
        },
      },
      {
        // Runs tests for the stories defined in the Storybook config.
        // See: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
        plugins: [
          paraglideVitePlugin({
            project: './src/i18n/project.inlang',
            outdir: './src/i18n/paraglide',
          }),
          vanillaExtractPlugin(),
          storybookTest({
            configDir: path.join(import.meta.dirname, '.storybook'),
          }),
        ],
        resolve: {
          tsconfigPaths: true,
        },
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
})
