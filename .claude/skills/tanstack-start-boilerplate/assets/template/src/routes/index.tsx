import { createFileRoute } from '@tanstack/react-router'
import { HomeScreen } from '#/domain/home/components/HomeScreen'

export const Route = createFileRoute('/')({ component: HomeScreen })
