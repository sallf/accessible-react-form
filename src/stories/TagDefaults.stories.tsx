import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { ARForm } from '../components/ARForm/ARForm'
import { TagInput } from '../components/Input/TagInput/TagInput'

const meta: Meta<typeof ARForm> = {
  component: ARForm,
  title: 'Examples/Tag defaults',
  args: { onSubmit: fn() },
}

export default meta
type Story = StoryObj<typeof ARForm>

export const InitialTagsAndFormPrecedence: Story = {
  render: ({ onSubmit }) => (
    <>
      <ARForm onSubmit={onSubmit} aria-label="Field defaults">
        <TagInput id="tags" label="Topics" defaultValue="React" required />
        <button type="submit">Save defaults</button>
      </ARForm>
      <ARForm
        onSubmit={onSubmit}
        defaultValues={{ tags: 'TypeScript' }}
        aria-label="Form defaults"
      >
        <TagInput
          id="tags"
          label="Suggested topics"
          defaultValue="React"
          suggestions={['React', 'TypeScript']}
          onlySuggestions
          required
        />
        <button type="submit">Save form defaults</button>
      </ARForm>
    </>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const fieldDefaults = within(
      canvas.getByRole('form', { name: 'Field defaults' })
    )
    const formDefaults = within(
      canvas.getByRole('form', { name: 'Form defaults' })
    )
    await expect(
      fieldDefaults.getByRole('button', { name: /Remove tag.*React/ })
    ).toBeVisible()
    await expect(
      formDefaults.getByRole('button', { name: /Remove tag.*TypeScript/ })
    ).toBeVisible()
    await expect(
      formDefaults.queryByRole('button', { name: /Remove tag.*React/ })
    ).not.toBeInTheDocument()

    await userEvent.click(
      fieldDefaults.getByRole('button', { name: 'Save defaults' })
    )
    await expect(args.onSubmit).toHaveBeenNthCalledWith(
      1,
      { tags: 'React' },
      expect.anything()
    )
    await userEvent.click(
      formDefaults.getByRole('button', { name: 'Save form defaults' })
    )
    await expect(args.onSubmit).toHaveBeenNthCalledWith(
      2,
      { tags: 'TypeScript' },
      expect.anything()
    )
    await userEvent.click(
      fieldDefaults.getByRole('button', { name: /Remove tag.*React/ })
    )
    await userEvent.click(
      fieldDefaults.getByRole('button', { name: 'Save defaults' })
    )
    await expect(
      await fieldDefaults.findByText('This field is required')
    ).toBeVisible()
    await expect(args.onSubmit).toHaveBeenCalledTimes(2)
  },
}
