// Locale switcher refs:
// - Paraglide docs: https://inlang.com/m/gerre34r/library-inlang-paraglideJs
// - Router example: https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#switching-locale
import { HStack } from '@astryxdesign/core/HStack'
import { Text } from '@astryxdesign/core/Text'
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl'
import { getLocale, locales, setLocale } from '#/i18n/paraglide/runtime'
import { m } from '#/i18n/paraglide/messages'

export default function ParaglideLocaleSwitcher() {
  const currentLocale = getLocale()

  return (
    <HStack gap={2}>
      <Text type="supporting">{m.current_locale({ locale: currentLocale })}</Text>
      <SegmentedControl
        value={currentLocale}
        onChange={(locale) => setLocale(locale as (typeof locales)[number])}
        label={m.language_label()}
        size="sm"
      >
        {locales.map((locale) => (
          <SegmentedControlItem key={locale} value={locale} label={locale.toUpperCase()} />
        ))}
      </SegmentedControl>
    </HStack>
  )
}
