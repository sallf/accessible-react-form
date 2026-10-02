import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'
import { ARForm } from '../components/ARForm/ARForm'
import { Text } from '../components/Input/Text/Text'
import { Date } from '../components/Input/Date/Date'
import { Checkbox } from '../components/Input/Checkbox/Checkbox'
import { FileUpload } from '../components/Input/FileUpload/FileUpload'
import { Select } from '../components/Select/Select'
import { TextArea } from '../components/TextArea/TextArea'
import { TagInput } from '../components/Input/TagInput/TagInput'

const meta: Meta<typeof ARForm> = {
  title: 'Unstyled/Required validation',
  id: 'required-validation',
  component: ARForm,
  // The shared runner always executes axe; avoid simultaneous addon runs.
  parameters: { tailwind: false, a11y: { test: 'off' } },
  tags: ['required-regression'],
}
export default meta
type Story = StoryObj<typeof ARForm>
const submit = fn()
const ids = [
  'text',
  'date',
  'checkbox',
  'file',
  'select',
  'area',
  'tags',
  'suggested',
]
const labels = [
  'Name',
  'Date',
  'Consent',
  'Attachment',
  'Country',
  'Message',
  'Topics',
  'Suggested topics',
]
const Fields = ({
  required = true,
  disabled,
  prefix = '',
  formProps,
}: {
  required?: boolean
  disabled?: boolean
  prefix?: string
  formProps?: UseFormReturn<FieldValues>
}) => {
  const shared = {
    required,
    disabled,
    formProps,
    'aria-describedby': 'required-help',
  }
  return (
    <section>
      <Text {...shared} id={`${prefix.trim()}text`} label={`${prefix}Name`} />
      <Date {...shared} id={`${prefix.trim()}date`} label={`${prefix}Date`} />
      <Checkbox
        {...shared}
        id={`${prefix.trim()}checkbox`}
        label={`${prefix}Consent`}
      />
      <FileUpload
        {...shared}
        id={`${prefix.trim()}file`}
        label={`${prefix}Attachment`}
        fileType="binary"
      />
      <Select
        {...shared}
        id={`${prefix.trim()}select`}
        label={`${prefix}Country`}
        options={[{ label: 'Choose', value: '' }, 'Canada']}
      />
      <TextArea
        {...shared}
        id={`${prefix.trim()}area`}
        label={`${prefix}Message`}
      />
      <TagInput
        {...shared}
        id={`${prefix.trim()}tags`}
        label={`${prefix}Topics`}
      />
      <TagInput
        {...shared}
        id={`${prefix.trim()}suggested`}
        label={`${prefix}Suggested topics`}
        onlySuggestions
        suggestions={['React']}
      />
    </section>
  )
}
const controls = (canvas: ReturnType<typeof within>, prefix = '') =>
  labels.map((label, index) =>
    index === 7
      ? canvas.getByRole('group', { name: `${prefix}${label}` })
      : canvas.getByLabelText(new RegExp(`^${prefix}${label}`))
  )
const RequiredForm = () => (
  <ARForm onSubmit={submit}>
    <p id="required-help">Complete this field.</p>
    <Fields />
    <button type="submit">Send</button>
  </ARForm>
)
const fillFields = async (canvas: ReturnType<typeof within>) => {
  const fields = controls(canvas)
  await userEvent.type(fields[0], 'Ada')
  fireEvent.change(fields[1], { target: { value: '2000-01-02' } })
  await userEvent.click(fields[2])
  await userEvent.upload(
    fields[3],
    new File(['hello'], 'note.txt', { type: 'text/plain' })
  )
  await userEvent.selectOptions(fields[4], 'Canada')
  await userEvent.type(fields[5], 'Hi')
  await userEvent.type(fields[6], 'design{enter}')
  await userEvent.click(
    within(fields[7]).getByRole('button', { name: 'Add tag React' })
  )
}
const assertRequiredErrors = async (canvas: ReturnType<typeof within>) => {
  for (const control of controls(canvas)) {
    await expect(control).toHaveAttribute('aria-invalid', 'true')
    await expect(control).toHaveAccessibleDescription(
      expect.stringContaining('Complete this field.')
    )
    await expect(control).toHaveAccessibleDescription(
      expect.stringContaining('This field is required.')
    )
    const references = control.getAttribute('aria-describedby')!.split(/\s+/)
    const error = control.ownerDocument.getElementById(references.at(-1)!)
    await expect(error).toHaveAttribute('role', 'alert')
    await expect(error).toHaveTextContent('This field is required.')
  }
}
export const SchemaFreeRequiredFields: Story = {
  render: () => <RequiredForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }))
    await assertRequiredErrors(canvas)
    await expect(submit).not.toHaveBeenCalled()
    await fillFields(canvas)
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }))
    await expect(submit).toHaveBeenCalledTimes(1)
    await expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Ada',
        date: '2000-01-02',
        checkbox: true,
        select: 'Canada',
        area: 'Hi',
        tags: 'design',
        suggested: 'React',
      }),
      expect.anything()
    )
    await expect(submit.mock.calls[0][0].file[0].name).toBe('note.txt')
    for (const [index, control] of controls(canvas).entries()) {
      await expect(control).not.toHaveAttribute('aria-invalid', 'true')
      await expect(control).toHaveAccessibleDescription(
        index === 7 ? 'Complete this field. (required)' : 'Complete this field.'
      )
    }
    await expect(
      canvas.queryByText('This field is required.')
    ).not.toBeInTheDocument()
  },
}

export const OptionalAndDisabledFields: Story = {
  render: () => (
    <ARForm onSubmit={submit}>
      <p id="required-help">Complete this field.</p>
      <Fields required={false} prefix="Optional " />
      <Fields disabled prefix="Disabled " />
      <Text
        id="whitespace"
        label="Whitespace value"
        required
        defaultValue=" "
      />
      <button type="submit">Send optional</button>
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    for (const control of controls(canvas, 'Disabled ').slice(0, 7))
      await expect(control).toBeDisabled()
    const group = controls(canvas, 'Disabled ')[7]
    const add = within(group).getByRole('button', { name: 'Add tag React' })
    await expect(add).toBeDisabled()
    await userEvent.click(add)
    await expect(
      within(group).queryByRole('button', { name: 'Remove tag React' })
    ).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Send optional' }))
    await expect(submit).toHaveBeenCalledTimes(1)
    await expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        Optionaltext: '',
        Optionalcheckbox: false,
        whitespace: ' ',
      }),
      expect.anything()
    )
    await expect(
      canvas.queryByText('This field is required.')
    ).not.toBeInTheDocument()
    for (const prefix of ['Optional ', 'Disabled ']) {
      for (const control of controls(canvas, prefix))
        await expect(control).not.toHaveAttribute('aria-invalid', 'true')
    }
  },
}

const ExplicitErrorFields = () => {
  const methods = useForm()
  const setErrors = (type: string) => {
    ids.forEach((id, index) =>
      methods.setError(id, {
        type,
        ...(index % 2 ? { message: ' \t\n ' } : {}),
      })
    )
    methods.setError('custom', {
      type: 'manual',
      message: ' Keep this exact message ',
    })
  }
  return (
    <ARForm onSubmit={submit}>
      <p id="required-help">Complete this field.</p>
      <Fields formProps={methods} />
      <Text
        id="custom"
        label="Custom message"
        formProps={methods}
        aria-describedby="required-help"
      />
      <button type="button" onClick={() => setErrors('required')}>
        Set required errors
      </button>
      <button type="button" onClick={() => setErrors('manual')}>
        Set other errors
      </button>
      <button type="button" onClick={() => methods.clearErrors()}>
        Clear errors
      </button>
    </ARForm>
  )
}
export const MessageLessFieldErrors: Story = {
  render: () => <ExplicitErrorFields />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const [button, message] of [
      ['Set required errors', 'This field is required.'],
      ['Set other errors', 'Please check this field.'],
    ]) {
      await userEvent.click(canvas.getByRole('button', { name: button }))
      for (const control of controls(canvas)) {
        await expect(control).toHaveAttribute('aria-invalid', 'true')
        await expect(control).toHaveAccessibleDescription(
          expect.stringContaining(`Complete this field.`)
        )
        await expect(control).toHaveAccessibleDescription(
          expect.stringContaining(message)
        )
        const errorId = control
          .getAttribute('aria-describedby')!
          .split(/\s+/)
          .at(-1)!
        await expect(
          control.ownerDocument.getElementById(errorId)
        ).toHaveTextContent(message)
      }
      const custom = canvas.getByLabelText(/^Custom message/)
      await expect(custom).toHaveAttribute('aria-invalid', 'true')
      await expect(custom).toHaveAccessibleDescription(
        'Complete this field. Keep this exact message .'
      )
      await expect(
        canvasElement.ownerDocument.getElementById('custom-error')!.textContent
      ).toBe(' Keep this exact message .')
      await userEvent.click(
        canvas.getByRole('button', { name: 'Clear errors' })
      )
      for (const [index, control] of controls(canvas).entries()) {
        await expect(control).not.toHaveAttribute('aria-invalid', 'true')
        await expect(control).toHaveAccessibleDescription(
          index === 7
            ? 'Complete this field. (required)'
            : 'Complete this field.'
        )
      }
      await expect(canvas.getByLabelText(/^Custom message/)).toHaveAttribute(
        'aria-describedby',
        'required-help'
      )
      await expect(canvas.queryAllByText(message)).toHaveLength(0)
    }
  },
}

const schemaSubmit = fn()
export const SchemaOwnsRequiredValidation: Story = {
  render: () => (
    <>
      <ARForm
        onSubmit={submit}
        validationSchema={object({ text: string().optional() })}
      >
        <p id="required-help">Complete this field.</p>
        <Fields />
        <button type="submit">Submit optional schema</button>
      </ARForm>
      <ARForm
        onSubmit={schemaSubmit}
        validationSchema={object({
          schemaRequired: string().required('Schema owns this rejection'),
        })}
      >
        <Text id="schemaRequired" label="Schema field" required />
        <button type="submit">Submit required schema</button>
      </ARForm>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    schemaSubmit.mockClear()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit optional schema' })
    )
    await expect(submit).toHaveBeenCalledTimes(1)
    await expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        text: '',
        checkbox: false,
        select: '',
        area: '',
        tags: '',
        suggested: '',
      }),
      expect.anything()
    )
    for (const control of controls(canvas))
      await expect(control).not.toHaveAttribute('aria-invalid', 'true')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit required schema' })
    )
    await expect(schemaSubmit).not.toHaveBeenCalled()
    const error = await canvas.findByText('Schema owns this rejection.')
    const control = canvas.getByLabelText(/^Schema field/)
    await expect(control).toHaveAttribute('aria-invalid', 'true')
    await expect(control).toHaveAttribute('aria-describedby', error.id)
    await expect(control).toHaveAccessibleDescription(
      'Schema owns this rejection.'
    )
    await userEvent.type(control, 'accepted')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit required schema' })
    )
    await expect(schemaSubmit).toHaveBeenCalledWith(
      { schemaRequired: 'accepted' },
      expect.anything()
    )
  },
}

// Terminal states let the shared axe runner inspect initial and invalid fields.
export const RequiredInitialAccessibility: Story = {
  render: () => <RequiredForm />,
}
export const RequiredInvalidAccessibility: Story = {
  render: () => <RequiredForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }))
    await assertRequiredErrors(canvas)
  },
}
export const MessageLessInvalidAccessibility: Story = {
  render: () => <ExplicitErrorFields />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Set other errors' })
    )
    for (const control of controls(canvas))
      await expect(control).toHaveAccessibleDescription(
        expect.stringContaining('Please check this field.')
      )
  },
}

const suppliedSubmit = fn()
const LateDisabledFields = () => {
  const [disabled, setDisabled] = useState(true)
  const methods = useForm<FieldValues>({
    disabled,
    defaultValues: {
      Globaltags: 'design',
      Globalsuggested: 'Existing',
      Falsetags: 'design',
      Falsesuggested: 'Existing',
    },
  })
  const [mounted, setMounted] = useState(false)
  return (
    <ARForm onSubmit={submit}>
      <p id="required-help">Complete this field.</p>
      <button type="button" onClick={() => setMounted(true)}>
        Mount disabled fields
      </button>
      <button type="button" onClick={() => setDisabled(false)}>
        Enable fields
      </button>
      <button type="button" onClick={methods.handleSubmit(suppliedSubmit)}>
        Submit supplied methods
      </button>
      {mounted && (
        <>
          <Fields formProps={methods} prefix="Global " />
          <Fields formProps={methods} prefix="False " disabled={false} />
        </>
      )}
    </ARForm>
  )
}
export const FormWideDisabledLateMount: Story = {
  render: () => <LateDisabledFields />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    suppliedSubmit.mockClear()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Mount disabled fields' })
    )
    const removeButtons = canvas.getAllByRole('button', {
      name: /Remove tag (design|Existing)/,
    })
    await expect(removeButtons).toHaveLength(4)
    for (const button of removeButtons) {
      await expect(button).toBeDisabled()
      await userEvent.click(button)
      await expect(button).toBeInTheDocument()
    }
    for (const prefix of ['Global ', 'False ']) {
      const fields = controls(canvas, prefix)
      for (const control of fields.slice(0, 7))
        await expect(control).toBeDisabled()
      const add = within(fields[7]).getByRole('button', {
        name: 'Add tag React',
      })
      await expect(add).toBeDisabled()
      await userEvent.click(add)
      await expect(
        within(fields[7]).queryByRole('button', { name: 'Remove tag React' })
      ).not.toBeInTheDocument()
      await expect(fields[7]).toHaveAttribute('data-arform-disabled', '')
    }
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit supplied methods' })
    )
    await expect(suppliedSubmit).toHaveBeenCalledTimes(1)
    await expect(canvas.queryAllByText('This field is required.')).toHaveLength(
      0
    )
    for (const prefix of ['Global ', 'False ']) {
      for (const control of controls(canvas, prefix))
        await expect(control).not.toHaveAttribute('aria-invalid', 'true')
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Enable fields' }))
    for (const button of removeButtons) {
      await expect(button).toBeEnabled()
      await userEvent.click(button)
      await expect(button).not.toBeInTheDocument()
    }
    for (const prefix of ['Global ', 'False ']) {
      const fields = controls(canvas, prefix)
      for (const control of fields.slice(0, 7))
        await expect(control).toBeEnabled()
      await userEvent.type(fields[0], 'Ada')
      await expect(fields[0]).toHaveValue('Ada')
      await userEvent.type(fields[6], `${prefix.trim()}{enter}`)
      await expect(
        canvas.getByRole('button', { name: `Remove tag ${prefix.trim()}` })
      ).toBeEnabled()
      const add = within(fields[7]).getByRole('button', {
        name: 'Add tag React',
      })
      await expect(add).toBeEnabled()
      await userEvent.click(add)
      await expect(
        within(fields[7]).getByRole('button', { name: 'Remove tag React' })
      ).toBeEnabled()
      await expect(fields[7]).not.toHaveAttribute('data-arform-disabled')
    }
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit supplied methods' })
    )
    await expect(suppliedSubmit).toHaveBeenCalledTimes(1)
    for (const prefix of ['Global ', 'False ']) {
      for (const control of controls(canvas, prefix).slice(1, 6)) {
        await expect(control).toHaveAttribute('aria-invalid', 'true')
        await expect(control).toHaveAccessibleDescription(
          expect.stringContaining('This field is required.')
        )
      }
    }
  },
}
