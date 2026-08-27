import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { HomeScreen } from './HomeScreen'

const meta = {
  title: 'domain/home/HomeScreen',
  component: HomeScreen,
} satisfies Meta<typeof HomeScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
