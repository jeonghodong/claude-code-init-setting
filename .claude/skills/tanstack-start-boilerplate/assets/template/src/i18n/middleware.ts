import { createMiddleware } from '@tanstack/react-start'
import { paraglideMiddleware } from '#/i18n/paraglide/server'

// Runs every server request inside paraglide's AsyncLocalStorage scope so
// getLocale() resolves from the request URL during SSR. The router already
// de/re-localizes URLs via `rewrite`, so the original request is passed through.
export const paraglideRequestMiddleware = createMiddleware().server(({ next, request }) =>
  paraglideMiddleware(request, () => next()),
)
