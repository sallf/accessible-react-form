import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { ARForm } from '../components/ARForm/ARForm'
import { Text } from '../components/Input/Text/Text'

const meta: Meta<typeof ARForm> = {
  component: ARForm,
  title: 'Examples/Schema failure without issues',
  args: { onSubmit: fn() },
}
export default meta
type Story = StoryObj<typeof ARForm>

const schema = (deferred: boolean): StandardSchemaV1 => ({
  '~standard': {
    version: 1,
    vendor: 'empty-failure-regression',
    validate: (values) => {
      const name = (values as { name: string }).name
      const result: StandardSchemaV1.Result<unknown> = name
        ? { value: { name: name.toUpperCase() } }
        : { issues: [] }
      return deferred ? Promise.resolve(result) : result
    },
  },
})

const render: Story['render'] = ({ onSubmit, validationSchema }) => (
  <ARForm validationSchema={validationSchema} onSubmit={onSubmit}>
    <Text id="name" label="Name" />
    <button type="submit">Submit</button>
  </ARForm>
)

const play: Story['play'] = async ({ canvasElement, args }) => {
  const canvas = within(canvasElement)
  const submit = canvas.getByRole('button', { name: 'Submit' })
  await userEvent.click(submit)
  await expect(await canvas.findByText('Please check the form.')).toBeVisible()
  await expect(canvas.getByRole('alert')).toHaveTextContent(
    'You have (1) error'
  )
  await expect(args.onSubmit).not.toHaveBeenCalled()

  await userEvent.type(canvas.getByRole('textbox', { name: 'Name' }), 'Ada')
  await userEvent.click(submit)
  await expect(args.onSubmit).toHaveBeenCalledWith(
    { name: 'ADA' },
    expect.anything()
  )
  await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
}

export const SynchronousFailure: Story = {
  args: { validationSchema: schema(false) },
  render,
  play,
}

export const AsynchronousFailure: Story = {
  args: { validationSchema: schema(true) },
  render,
  play,
}
