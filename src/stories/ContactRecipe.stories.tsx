import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import Usage from '../../site/src/recipes/contact/Usage'
import contactFormSource from '../../site/src/recipes/contact/ContactForm.tsx?raw'
import usageSource from '../../site/src/recipes/contact/Usage.tsx?raw'

const meta: Meta<typeof Usage> = {
  title: 'Recipes/Contact',
  component: Usage,
  tags: ['autodocs', 'contact-recipe'],
  parameters: { tailwind: true },
}
export default meta
type Story = StoryObj<typeof Usage>

export const ContactRecipe: Story = {
  name: 'ContactForm.tsx',
  parameters: { docs: { source: { code: contactFormSource } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }))
    await expect(await canvas.findByText('Enter your name.')).toBeVisible()
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument()
    await userEvent.type(
      canvas.getByRole('textbox', { name: /Your name/ }),
      'Avery'
    )
    await userEvent.type(
      canvas.getByRole('textbox', { name: /Email address/ }),
      'avery@example.com'
    )
    const topics = canvas.getByRole('textbox', { name: 'Topics' })
    await userEvent.type(topics, 'Design{enter}Support{enter}')
    await expect(topics).toHaveAccessibleName('Topics')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Remove tag Design' })
    )
    await expect(topics).toHaveAccessibleName('Topics')
    await userEvent.type(
      canvas.getByRole('textbox', { name: /Message/ }),
      'I would like to learn more about your services.'
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }))
    await expect(await canvas.findByRole('status')).toHaveTextContent(
      'Thanks, Avery. Your message is ready.'
    )
    await expect(canvas.getByText('Support', { selector: 'dd' })).toBeVisible()
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
  },
}

export const UsageExample: Story = {
  name: 'Usage.tsx',
  parameters: { docs: { source: { code: usageSource } } },
}
