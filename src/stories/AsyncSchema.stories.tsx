import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { ARForm } from '../components/ARForm/ARForm'
import { Text } from '../components/Input/Text/Text'

const meta: Meta<typeof ARForm> = {
  component: ARForm,
  title: 'Examples/Async schema',
  args: { onSubmit: fn() },
}

export default meta
type Story = StoryObj<typeof ARForm>

const schema: StandardSchemaV1 = {
  '~standard': {
    version: 1,
    vendor: 'cross-realm-regression',
    validate: (value) => {
      const name = (value as { name: string }).name
      const result: StandardSchemaV1.Result<unknown> = name
        ? { value: { name: name.toUpperCase() } }
        : { issues: [{ path: ['name'], message: 'Enter your name' }] }
      const frame = document.createElement('iframe')
      frame.hidden = true
      frame.title = 'Validator realm'
      document.body.append(frame)
      try {
        const realm = frame.contentWindow as Window & typeof globalThis
        return realm.Promise.resolve(result)
      } finally {
        frame.remove()
      }
    },
  },
}

export const CrossRealmValidation: Story = {
  render: ({ onSubmit }) => (
    <ARForm validationSchema={schema} onSubmit={onSubmit}>
      <Text id="name" label="Name" required />
      <button type="submit">Submit</button>
    </ARForm>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const name = canvas.getByRole('textbox', { name: 'Name' })
    const submit = canvas.getByRole('button', { name: 'Submit' })

    await userEvent.click(submit)
    await expect(await canvas.findByText('Enter your name')).toBeVisible()
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    await expect(args.onSubmit).not.toHaveBeenCalled()

    await userEvent.type(name, 'Ada')
    await userEvent.click(submit)
    await expect(args.onSubmit).toHaveBeenCalledWith(
      { name: 'ADA' },
      expect.anything()
    )
    await expect(name).toHaveAttribute('aria-invalid', 'false')
  },
}
