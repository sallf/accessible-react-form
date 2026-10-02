import type { Meta, StoryObj } from '@storybook/react-vite'
import HeroExample from '../../site/src/examples/HeroExample'
import heroSource from '../../site/src/examples/HeroExample.tsx?raw'

const meta = {
  title: 'Examples/Complete form',
  component: HeroExample,
  tags: ['autodocs'],
  parameters: { tailwind: true },
} satisfies Meta<typeof HeroExample>

export default meta
type Story = StoryObj<typeof meta>

export const CompleteForm: Story = {
  parameters: { docs: { source: { code: heroSource } } },
}
