import { VStack } from '@astryxdesign/core/VStack'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { m } from '#/i18n/paraglide/messages'
import LocaleSwitcher from '#/i18n/LocaleSwitcher'

export function HomeScreen() {
  return (
    <VStack gap={4} padding={8}>
      <Heading level={1}>{m.home_page()}</Heading>
      <Text type="large">{m.example_message()}</Text>
      <LocaleSwitcher />
    </VStack>
  )
}
