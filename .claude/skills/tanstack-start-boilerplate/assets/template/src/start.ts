import { createStart } from '@tanstack/react-start'
import { paraglideRequestMiddleware } from '#/i18n/middleware'

export const startInstance = createStart(() => ({
  requestMiddleware: [paraglideRequestMiddleware],
}))
