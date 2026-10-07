import { useForm } from 'react-hook-form'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  expect,
  fireEvent,
  fn,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'
import { ARForm } from '../components/ARForm/ARForm'
import { Text } from '../components/Input/Text/Text'
import { Date } from '../components/Input/Date/Date'
import { Checkbox } from '../components/Input/Checkbox/Checkbox'
import { FileUpload } from '../components/Input/FileUpload/FileUpload'
import { Select } from '../components/Select/Select'
import { TextArea } from '../components/TextArea/TextArea'

const meta: Meta<typeof ARForm> = {
  title: 'Unstyled/Feedback isolation',
  component: ARForm,
  parameters: { tailwind: false, a11y: { test: 'off' } },
  tags: ['feedback-regression'],
}
export default meta
type Story = StoryObj<typeof ARForm>
const paths = [
  'profile.name',
  'date',
  'consent',
  'attachment',
  'country',
  'notes',
]
const labels = ['Name', 'Date', 'Consent', 'Attachment', 'Country', 'Notes']
const submit = fn()

const FeedbackForm = ({
  suffix,
  message,
}: {
  suffix: string
  message: string
}) => {
  const methods = useForm()
  return (
    <ARForm onSubmit={submit} data-testid={suffix}>
      <p id={`help-${suffix}`}>Help for {suffix}.</p>
      <Text
        id={paths[0]}
        label={`Name ${suffix}`}
        formProps={methods}
        aria-describedby={`help-${suffix}`}
      />
      <Date id={paths[1]} label={`Date ${suffix}`} formProps={methods} />
      <Checkbox id={paths[2]} label={`Consent ${suffix}`} formProps={methods} />
      <FileUpload
        id={paths[3]}
        label={`Attachment ${suffix}`}
        fileType="binary"
        formProps={methods}
      />
      <Select
        id={paths[4]}
        label={`Country ${suffix}`}
        options={['Canada']}
        formProps={methods}
      />
      <TextArea id={paths[5]} label={`Notes ${suffix}`} formProps={methods} />
      <button
        type="button"
        onClick={() =>
          paths.forEach((path) =>
            methods.setError(path, { type: 'manual', message })
          )
        }
      >
        Errors {suffix}
      </button>
      <button type="button" onClick={() => methods.clearErrors()}>
        Clear {suffix}
      </button>
    </ARForm>
  )
}

export const StableNamesAndIndependentDescriptions: Story = {
  render: () => (
    <>
      <FeedbackForm suffix="first" message="Check this?" />
      <FeedbackForm suffix="second" message="Already punctuated." />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const allErrorIds = new Set<string>()
    for (const [suffix, message] of [
      ['first', 'Check this?'],
      ['second', 'Already punctuated.'],
    ]) {
      const form = within(canvas.getByTestId(suffix))
      const controls = labels.map((label) =>
        form.getByLabelText(`${label} ${suffix}`)
      )
      for (const [index, control] of controls.entries()) {
        await expect(control).toHaveAttribute('id', paths[index])
        await expect(control).toHaveAttribute('name', paths[index])
        await expect(control).toHaveAccessibleName(`${labels[index]} ${suffix}`)
      }
      await userEvent.click(
        form.getByRole('button', { name: `Errors ${suffix}` })
      )
      for (const [index, control] of controls.entries()) {
        await expect(control).toHaveAttribute('aria-invalid', 'true')
        await expect(control).toHaveAccessibleName(`${labels[index]} ${suffix}`)
        await expect(control).toHaveAccessibleDescription(
          index === 0 ? `Help for ${suffix}. ${message}` : message
        )
        const errorId = control
          .getAttribute('aria-describedby')!
          .split(/\s+/)
          .slice(-1)[0]!
        await expect(allErrorIds.has(errorId)).toBe(false)
        allErrorIds.add(errorId)
        const error = control.ownerDocument.getElementById(errorId)!
        await expect(error.textContent).toBe(message)
        await expect(error).toHaveAttribute('role', 'alert')
        await expect(canvas.getByTestId(suffix).contains(error)).toBe(true)
        await expect(error.closest('label')).toBeNull()
      }
    }
    // Clear only one form: the other form keeps its independent feedback.
    await userEvent.click(canvas.getByRole('button', { name: 'Clear first' }))
    for (const label of labels) {
      const first = within(canvas.getByTestId('first')).getByLabelText(
        `${label} first`
      )
      const second = within(canvas.getByTestId('second')).getByLabelText(
        `${label} second`
      )
      await expect(first).toHaveAccessibleName(`${label} first`)
      await expect(first).toHaveAttribute('aria-invalid', 'false')
      await expect(second).toHaveAccessibleDescription(
        label === 'Name'
          ? 'Help for second. Already punctuated.'
          : 'Already punctuated.'
      )
    }
  },
}

const enter = fn()
const leave = fn()
const drop = fn()
export const ConsumerDragCallbacksPreserveActiveState: Story = {
  render: () => (
    <ARForm onSubmit={submit}>
      <FileUpload
        id="drag-file"
        label="Drag file"
        fileType="binary"
        onDragEnter={enter}
        onDragLeave={leave}
        onDrop={drop}
      />
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    enter.mockClear()
    leave.mockClear()
    drop.mockClear()
    const control = within(canvasElement).getByLabelText('Drag file')
    const wrapper = control.closest('.arform__upload-wrapper')!
    await fireEvent.dragEnter(control)
    await waitFor(() => expect(wrapper).toHaveAttribute('data-arform-active'))
    await expect(enter).toHaveBeenCalledTimes(1)
    await fireEvent.dragLeave(control)
    await waitFor(() =>
      expect(wrapper).not.toHaveAttribute('data-arform-active')
    )
    await expect(leave).toHaveBeenCalledTimes(1)
    await fireEvent.dragEnter(control)
    await fireEvent.drop(control)
    await waitFor(() =>
      expect(wrapper).not.toHaveAttribute('data-arform-active')
    )
    await expect(enter).toHaveBeenCalledTimes(2)
    await expect(drop).toHaveBeenCalledTimes(1)
  },
}
