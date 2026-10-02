import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { useForm } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import { ARForm } from '../components/ARForm/ARForm'
import { FileUpload } from '../components/Input/FileUpload/FileUpload'
import { Text } from '../components/Input/Text/Text'
import { Date } from '../components/Input/Date/Date'
import { Checkbox } from '../components/Input/Checkbox/Checkbox'
import { Select } from '../components/Select/Select'
import { TextArea } from '../components/TextArea/TextArea'
import { TagInput } from '../components/Input/TagInput/TagInput'

const meta: Meta<typeof ARForm> = {
  title: 'Unstyled/External validation',
  id: 'external-validation',
  component: ARForm,
  parameters: { tailwind: false, a11y: { test: 'off' } },
  tags: ['external-validation-regression'],
}
export default meta
type Story = StoryObj<typeof ARForm>
const submit = fn()
const invalid = fn()
const fileCases = [
  { id: 'omittedAsync', required: undefined, map: false },
  { id: 'omittedMap', required: undefined, map: true },
  { id: 'falseAsync', required: false, map: false },
  { id: 'falseMap', required: false, map: true },
  { id: 'trueAsync', required: true, map: false },
  { id: 'trueMap', required: true, map: true },
]
const fileName = (value: unknown) =>
  typeof value === 'string'
    ? value
    : value instanceof File
      ? value.name
      : value instanceof FileList
        ? value.item(0)?.name
        : undefined
const ConsumerFiles = () => {
  const methods = useForm<FieldValues>()
  fileCases.forEach(({ id, map }) => {
    const validate = async (value: unknown) =>
      fileName(value) === 'allowed.txt' || `Consumer rejects ${id}`
    methods.register(id, { validate: map ? { consumer: validate } : validate })
  })
  const reset = (name: string, asString = false) =>
    methods.reset(
      Object.fromEntries(
        fileCases.map(({ id }) => [
          id,
          asString ? name : new File(['reset'], name),
        ])
      )
    )
  return (
    <form noValidate onSubmit={methods.handleSubmit(submit, invalid)}>
      {fileCases.map(({ id, required }) => (
        <FileUpload
          key={id}
          id={id}
          label={id}
          fileType="binary"
          formProps={methods}
          required={required}
        />
      ))}
      <button type="button" onClick={methods.handleSubmit(submit, invalid)}>
        Submit consumer files
      </button>
      <button type="button" onClick={() => reset('blocked.txt')}>
        Reset blocked Files
      </button>
      <button type="button" onClick={() => reset('allowed.txt')}>
        Reset allowed Files
      </button>
      <button type="button" onClick={() => reset('blocked.txt', true)}>
        Reset blocked strings
      </button>
      <button type="button" onClick={() => reset('allowed.txt', true)}>
        Reset allowed strings
      </button>
    </form>
  )
}
export const ConsumerFileValidators: Story = {
  render: () => <ConsumerFiles />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    invalid.mockClear()
    for (const { id } of fileCases)
      await userEvent.upload(
        canvas.getByLabelText(new RegExp(`^${id}`)),
        new File(['upload'], 'blocked.txt')
      )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit consumer files' })
    )
    await expect(submit).not.toHaveBeenCalled()
    for (const { id, map } of fileCases) {
      await expect(
        await canvas.findByText(`Consumer rejects ${id}.`)
      ).toBeVisible()
      await expect(canvas.getByLabelText(new RegExp(`^${id}`))).toHaveAttribute(
        'aria-invalid',
        'true'
      )
      await expect(invalid.mock.calls[0][0][id].type).toBe(
        map ? 'consumer' : 'validate'
      )
    }
    for (const kind of ['Files', 'strings']) {
      await userEvent.click(
        canvas.getByRole('button', { name: `Reset blocked ${kind}` })
      )
      await userEvent.click(
        canvas.getByRole('button', { name: 'Submit consumer files' })
      )
      await expect(submit).toHaveBeenCalledTimes(kind === 'Files' ? 0 : 1)
      for (const { id } of fileCases)
        await expect(
          await canvas.findByText(`Consumer rejects ${id}.`)
        ).toBeVisible()
      await userEvent.click(
        canvas.getByRole('button', { name: `Reset allowed ${kind}` })
      )
      await userEvent.click(
        canvas.getByRole('button', { name: 'Submit consumer files' })
      )
      await expect(submit).toHaveBeenCalledTimes(kind === 'Files' ? 1 : 2)
      for (const { id } of fileCases) {
        const value = submit.mock.calls[submit.mock.calls.length - 1][0][id]
        await expect(fileName(value)).toBe('allowed.txt')
        await expect(
          canvas.getByLabelText(new RegExp(`^${id}`))
        ).not.toHaveAttribute('aria-invalid', 'true')
      }
    }
  },
}

const requiredIds = [
  'text',
  'date',
  'checkbox',
  'file',
  'select',
  'area',
  'tags',
  'suggested',
]
const ConsumerRequiredFields = () => {
  const methods = useForm<FieldValues>()
  requiredIds.forEach((id) =>
    methods.register(id, { required: `Consumer requires ${id}` })
  )
  return (
    <form noValidate onSubmit={methods.handleSubmit(submit, invalid)}>
      <Text id="text" label="text" formProps={methods} />
      <Date id="date" label="date" formProps={methods} />
      <Checkbox id="checkbox" label="checkbox" formProps={methods} />
      <FileUpload
        id="file"
        label="file"
        fileType="binary"
        formProps={methods}
      />
      <Select
        id="select"
        label="select"
        options={[{ label: 'Choose', value: '' }, 'Canada']}
        formProps={methods}
      />
      <TextArea id="area" label="area" formProps={methods} />
      <TagInput id="tags" label="tags" formProps={methods} />
      <TagInput
        id="suggested"
        label="suggested"
        onlySuggestions
        suggestions={['React']}
        formProps={methods}
      />
      <button type="submit">Submit consumer required</button>
    </form>
  )
}
export const OmittedRequiredRules: Story = {
  render: () => <ConsumerRequiredFields />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    invalid.mockClear()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit consumer required' })
    )
    await expect(submit).not.toHaveBeenCalled()
    await userEvent.type(canvas.getByLabelText(/^text/), '{Enter}')
    await expect(submit).not.toHaveBeenCalled()
    await expect(invalid).toHaveBeenCalledTimes(2)
    for (const id of requiredIds) {
      const error = await canvas.findByText(`Consumer requires ${id}.`)
      const control =
        id === 'suggested'
          ? canvas.getByRole('group', { name: id })
          : canvas.getByLabelText(new RegExp(`^${id}`))
      await expect(control).toHaveAttribute('aria-invalid', 'true')
      await expect(control).toHaveAccessibleDescription(
        `Consumer requires ${id}.`
      )
      await expect(control.getAttribute('aria-describedby')).toBe(error.id)
      await expect(invalid.mock.calls[0][0][id].type).toBe('required')
    }
  },
}

const ChangingRequired = () => {
  const methods = useForm<FieldValues>()
  const [required, setRequired] = useState(true)
  const shared = { required, formProps: methods }
  return (
    <form noValidate onSubmit={methods.handleSubmit(submit, invalid)}>
      <Text {...shared} id="text" label="text" />
      <Date {...shared} id="date" label="date" />
      <Checkbox {...shared} id="checkbox" label="checkbox" />
      <FileUpload {...shared} id="file" label="file" fileType="binary" />
      <Select
        {...shared}
        id="select"
        label="select"
        options={[{ label: 'Choose', value: '' }, 'Canada']}
      />
      <TextArea {...shared} id="area" label="area" />
      <TagInput {...shared} id="tags" label="tags" />
      <TagInput
        {...shared}
        id="suggested"
        label="suggested"
        onlySuggestions
        suggestions={['React']}
      />
      <button type="button" onClick={methods.handleSubmit(submit, invalid)}>
        Submit changing rules
      </button>
      <button type="button" onClick={() => setRequired(false)}>
        Make optional
      </button>
      <button type="button" onClick={() => setRequired(true)}>
        Make required
      </button>
      <button
        type="button"
        onClick={() =>
          methods.reset({ file: new File(['retained'], 'retained.txt') })
        }
      >
        Reset logical default
      </button>
      <button type="button" onClick={() => methods.reset({ file: '' })}>
        Clear logical default
      </button>
    </form>
  )
}
export const ExplicitRequiredChanges: Story = {
  render: () => <ChangingRequired />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    invalid.mockClear()
    const send = canvas.getByRole('button', { name: 'Submit changing rules' })
    await userEvent.click(send)
    await expect(submit).not.toHaveBeenCalled()
    for (const id of requiredIds)
      await expect(invalid.mock.calls[0][0][id].type).toBe('required')
    await expect(canvas.getByLabelText(/^file/)).toHaveAccessibleDescription(
      'This field is required.'
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Reset logical default' })
    )
    await userEvent.click(send)
    await expect(invalid.mock.calls[1][0].file).toBeUndefined()
    await expect(canvas.getByText('retained.txt')).toBeVisible()
    await expect(canvas.getByLabelText(/^file/)).toHaveAttribute(
      'aria-required',
      'true'
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear logical default' })
    )
    await userEvent.click(send)
    await expect(invalid.mock.calls[2][0].file.type).toBe('required')
    await expect(canvas.getByLabelText(/^file/)).toHaveAccessibleDescription(
      'This field is required.'
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Make optional' }))
    await userEvent.click(send)
    await expect(submit).toHaveBeenCalledTimes(1)
    await expect(canvas.queryAllByText('This field is required.')).toHaveLength(
      0
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Make required' }))
    await userEvent.click(send)
    await expect(submit).toHaveBeenCalledTimes(1)
    const errors = invalid.mock.calls[invalid.mock.calls.length - 1][0]
    for (const id of requiredIds) await expect(errors[id].type).toBe('required')
  },
}

const ProgrammaticFiles = () => {
  const methods = useForm<FieldValues>({
    defaultValues: { immediateFile: new File(['initial'], 'initial.txt') },
  })
  methods.register('immediateFile', {
    validate: async (value: unknown) =>
      fileName(value) !== 'blocked.txt' || 'Consumer rejects immediate file',
  })
  const changeFileValue = (value: unknown, wholeForm = false) => {
    if (wholeForm) methods.reset({ immediateFile: value })
    else methods.resetField('immediateFile', { defaultValue: value })
  }
  const files = (populated: boolean) => {
    const transfer = new DataTransfer()
    if (populated) transfer.items.add(new File(['list'], 'list.txt'))
    return transfer.files
  }
  return (
    <form noValidate onSubmit={methods.handleSubmit(submit, invalid)}>
      <FileUpload
        id="immediateFile"
        label="Immediate file"
        fileType="binary"
        required
        formProps={methods}
      />
      <button type="button" onClick={() => changeFileValue('')}>
        Clear file value
      </button>
      <button
        type="button"
        onClick={() => changeFileValue(new File(['restored'], 'restored.txt'))}
      >
        Restore file value
      </button>
      <button type="button" onClick={() => changeFileValue(files(false))}>
        Empty list value
      </button>
      <button type="button" onClick={() => changeFileValue(files(true))}>
        Populated list value
      </button>
      <button type="button" onClick={() => changeFileValue('blocked.txt')}>
        Blocked string value
      </button>
      <button type="button" onClick={() => changeFileValue('allowed.txt')}>
        Allowed string value
      </button>
      <button type="button" onClick={() => changeFileValue('', true)}>
        Reset clear value
      </button>
      <button type="button" onClick={() => changeFileValue('reset.txt', true)}>
        Reset restore value
      </button>
      <button type="button" onClick={methods.handleSubmit(submit, invalid)}>
        Submit reset value
      </button>
    </form>
  )
}
export const ProgrammaticFileUpdates: Story = {
  render: () => <ProgrammaticFiles />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    invalid.mockClear()
    const click = async (name: string) =>
      userEvent.click(canvas.getByRole('button', { name }))
    await click('Clear file value')
    await expect(canvas.queryByText('initial.txt')).not.toBeInTheDocument()
    await click('Submit reset value')
    await expect(submit).not.toHaveBeenCalled()
    await expect(invalid).toHaveBeenCalledTimes(1)
    await expect(invalid.mock.calls[0][0].immediateFile.type).toBe('required')
    await expect(
      canvas.getByLabelText(/^Immediate file/)
    ).toHaveAccessibleDescription('This field is required.')
    await click('Restore file value')
    await expect(canvas.getByText('restored.txt')).toBeVisible()
    await click('Submit reset value')
    await expect(submit).toHaveBeenCalledTimes(1)
    await expect(fileName(submit.mock.calls[0][0].immediateFile)).toBe(
      'restored.txt'
    )
    await click('Empty list value')
    await click('Submit reset value')
    await expect(submit).toHaveBeenCalledTimes(1)
    await expect(invalid.mock.calls[1][0].immediateFile.type).toBe('required')
    await click('Populated list value')
    await expect(canvas.getByText('list.txt')).toBeVisible()
    await click('Submit reset value')
    await expect(submit).toHaveBeenCalledTimes(2)
    await expect(fileName(submit.mock.calls[1][0].immediateFile)).toBe(
      'list.txt'
    )
    await click('Blocked string value')
    await click('Submit reset value')
    await expect(submit).toHaveBeenCalledTimes(2)
    await expect(invalid.mock.calls[2][0].immediateFile.type).toBe('validate')
    await expect(
      canvas.getByText('Consumer rejects immediate file.')
    ).toBeVisible()
    await click('Allowed string value')
    await click('Submit reset value')
    await expect(submit).toHaveBeenCalledTimes(3)
    await click('Reset clear value')
    await click('Submit reset value')
    await expect(submit).toHaveBeenCalledTimes(3)
    await expect(invalid.mock.calls[3][0].immediateFile.type).toBe('required')
    await click('Reset restore value')
    await click('Submit reset value')
    await expect(submit).toHaveBeenCalledTimes(4)
    await expect(fileName(submit.mock.calls[3][0].immediateFile)).toBe(
      'reset.txt'
    )
    await expect(canvas.getByLabelText(/^Immediate file/)).toHaveAttribute(
      'aria-required',
      'true'
    )
  },
}

const ParentPathFile = () => {
  const methods = useForm<FieldValues>({
    defaultValues: { profile: { file: 'saved.txt' } },
  })
  methods.watch()
  const changeFileValue = (file: string) =>
    methods.setValue('profile', { file })
  return (
    <form noValidate onSubmit={methods.handleSubmit(submit, invalid)}>
      <FileUpload
        id="profile.file"
        label="Nested file"
        fileType="binary"
        required
        formProps={methods}
      />
      <button type="button" onClick={() => changeFileValue('')}>
        Clear parent value
      </button>
      <button type="button" onClick={() => changeFileValue('saved.txt')}>
        Restore parent value
      </button>
      <button type="submit">Submit parent value</button>
    </form>
  )
}
export const ParentPathFileSubmission: Story = {
  render: () => <ParentPathFile />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    invalid.mockClear()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear parent value' })
    )
    await expect(canvas.queryByText('saved.txt')).not.toBeInTheDocument()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit parent value' })
    )
    await expect(submit).not.toHaveBeenCalled()
    await expect(invalid.mock.calls[0][0].profile.file.type).toBe('required')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Restore parent value' })
    )
    await expect(canvas.getByText('saved.txt')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit parent value' })
    )
    await expect(submit).toHaveBeenCalledTimes(1)
    await expect(submit.mock.calls[0][0].profile.file).toBe('saved.txt')
  },
}
const DisabledResetFile = ({ global = false }: { global?: boolean }) => {
  const methods = useForm<FieldValues>({ disabled: global })
  return (
    <form
      noValidate
      onSubmit={methods.handleSubmit(submit, invalid)}
      aria-label={global ? 'Globally disabled reset' : 'Locally disabled reset'}
    >
      <FileUpload
        id={global ? 'globalFile' : 'localFile'}
        label={global ? 'Global file' : 'Local file'}
        fileType="binary"
        required
        disabled={global ? undefined : true}
        formProps={methods}
      />
      <button
        type="button"
        onClick={() => {
          methods.reset({ [global ? 'globalFile' : 'localFile']: '' })
        }}
      >
        Reset disabled value
      </button>
      <button type="button" onClick={methods.handleSubmit(submit, invalid)}>
        Submit disabled value
      </button>
    </form>
  )
}
export const DisabledFileResetSubmission: Story = {
  render: () => (
    <div>
      <DisabledResetFile />
      <DisabledResetFile global />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    invalid.mockClear()
    for (const name of ['Locally disabled reset', 'Globally disabled reset']) {
      const panel = within(canvas.getByRole('form', { name }))
      await userEvent.click(
        panel.getByRole('button', { name: 'Reset disabled value' })
      )
      await expect(panel.getByLabelText(/file/)).toBeDisabled()
      await userEvent.click(
        panel.getByRole('button', { name: 'Submit disabled value' })
      )
      await expect(invalid).not.toHaveBeenCalled()
    }
    await expect(submit).toHaveBeenCalledTimes(2)
  },
}
const fileCapture = fn()
const OnChangeFile = () => {
  const methods = useForm<FieldValues>({ mode: 'onChange' })
  return (
    <form noValidate onSubmit={methods.handleSubmit(submit, invalid)}>
      <FileUpload
        id="onChangeFile"
        label="On change file"
        fileType="binary"
        required
        formProps={methods}
        onChangeCapture={fileCapture}
      />
    </form>
  )
}
export const OnChangeFileRequired: Story = {
  render: () => <OnChangeFile />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText(/^On change file/)
    fileCapture.mockClear()
    await userEvent.upload(input, new File(['selected'], 'selected.txt'))
    await expect(input).toHaveAttribute('aria-invalid', 'false')
    await userEvent.upload(input, [])
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'))
    await expect(input).toHaveAccessibleDescription('This field is required.')
    await userEvent.upload(input, new File(['restored'], 'restored.txt'))
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'false'))
    await expect(fileCapture).toHaveBeenCalledTimes(3)
  },
}

const AliasedPathFile = () => {
  const methods = useForm<FieldValues>({
    defaultValues: { items: [{ file: 'saved.txt' }] },
  })
  methods.watch()
  const changeFileValue = (file: string) =>
    methods.setValue('items.0', { file })
  return (
    <form noValidate onSubmit={methods.handleSubmit(submit, invalid)}>
      <FileUpload
        id="items[0].file"
        label="Array file"
        fileType="binary"
        required
        formProps={methods}
      />
      <button type="button" onClick={() => changeFileValue('')}>
        Clear array parent value
      </button>
      <button type="button" onClick={() => changeFileValue('saved.txt')}>
        Restore array parent value
      </button>
      <button type="submit">Submit parent value</button>
    </form>
  )
}
export const AliasedFilePathSubmission: Story = {
  render: () => <AliasedPathFile />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    invalid.mockClear()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear array parent value' })
    )
    await expect(canvas.queryByText('saved.txt')).not.toBeInTheDocument()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit parent value' })
    )
    await expect(submit).not.toHaveBeenCalled()
    await expect(invalid.mock.calls[0][0].items[0].file.type).toBe('required')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Restore array parent value' })
    )
    await expect(canvas.getByText('saved.txt')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit parent value' })
    )
    await expect(submit).toHaveBeenCalledTimes(1)
    await expect(submit.mock.calls[0][0].items[0].file).toBe('saved.txt')
  },
}
const WholeResetFileList = () => {
  const methods = useForm<FieldValues>({
    defaultValues: { listFile: 'saved.txt' },
  })
  const changeFileValue = (populated: boolean) => {
    const transfer = new DataTransfer()
    if (populated) transfer.items.add(new File(['reset'], 'reset-list.txt'))
    methods.reset({ listFile: transfer.files })
  }
  return (
    <form noValidate onSubmit={methods.handleSubmit(submit, invalid)}>
      <FileUpload
        id="listFile"
        label="Reset list file"
        fileType="binary"
        required
        formProps={methods}
      />
      <button type="button" onClick={() => changeFileValue(false)}>
        Reset empty list value
      </button>
      <button type="button" onClick={() => changeFileValue(true)}>
        Reset populated list value
      </button>
      <button type="button" onClick={methods.handleSubmit(submit, invalid)}>
        Submit reset list
      </button>
    </form>
  )
}
export const WholeResetFileListSubmission: Story = {
  render: () => <WholeResetFileList />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    invalid.mockClear()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Reset empty list value' })
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit reset list' })
    )
    await expect(submit).not.toHaveBeenCalled()
    await expect(invalid.mock.calls[0][0].listFile.type).toBe('required')
    await expect(
      canvas.getByLabelText(/^Reset list file/)
    ).toHaveAccessibleDescription('This field is required.')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Reset populated list value' })
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit reset list' })
    )
    await expect(submit).toHaveBeenCalledTimes(1)
    await expect(fileName(submit.mock.calls[0][0].listFile)).toBe(
      'reset-list.txt'
    )
    await expect(canvas.getByLabelText(/^Reset list file/)).toHaveAttribute(
      'aria-invalid',
      'false'
    )
  },
}

const RemovingFile = () => {
  const methods = useForm<FieldValues>({ defaultValues: { other: '' } })
  const [shown, setShown] = useState(true)
  return (
    <form noValidate onSubmit={methods.handleSubmit(submit, invalid)}>
      {shown && (
        <FileUpload
          id="removedFile"
          label="Removed file"
          fileType="binary"
          required
          formProps={methods}
        />
      )}
      <button
        type="button"
        onClick={() => {
          setShown(false)
          methods.unregister('removedFile')
          methods.setValue('other', 'updated')
          void methods.handleSubmit(submit, invalid)()
        }}
      >
        Remove file and submit
      </button>
    </form>
  )
}
export const RemovedFileSubmission: Story = {
  render: () => <RemovingFile />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    invalid.mockClear()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Remove file and submit' })
    )
    await expect(invalid).not.toHaveBeenCalled()
    await expect(submit).toHaveBeenCalledTimes(1)
    await expect(submit.mock.calls[0][0]).not.toHaveProperty('removedFile')
    await expect(
      canvas.queryByLabelText(/^Removed file/)
    ).not.toBeInTheDocument()
  },
}
const disabledConsumer = fn(() => 'Consumer rejects disabled file')
const DisabledConsumerReset = () => {
  const methods = useForm<FieldValues>({
    defaultValues: { disabledConsumerFile: 'saved.txt' },
  })
  methods.register('disabledConsumerFile', { validate: disabledConsumer })
  return (
    <form noValidate onSubmit={methods.handleSubmit(submit, invalid)}>
      <FileUpload
        id="disabledConsumerFile"
        label="Disabled consumer file"
        fileType="binary"
        required={false}
        disabled
        formProps={methods}
      />
      <button
        type="button"
        onClick={() =>
          methods.reset({ disabledConsumerFile: '' }, { keepDirtyValues: true })
        }
      >
        Reset retained disabled file
      </button>
      <button type="button" onClick={methods.handleSubmit(submit, invalid)}>
        Submit disabled consumer file
      </button>
    </form>
  )
}
export const DisabledConsumerResetLifecycle: Story = {
  render: () => <DisabledConsumerReset />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    invalid.mockClear()
    disabledConsumer.mockClear()
    const send = canvas.getByRole('button', {
      name: 'Submit disabled consumer file',
    })
    await userEvent.click(send)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Reset retained disabled file' })
    )
    await expect(
      canvas.getByLabelText(/^Disabled consumer file/)
    ).toBeDisabled()
    await userEvent.click(send)
    await expect(submit).toHaveBeenCalledTimes(2)
    await expect(invalid).not.toHaveBeenCalled()
    await expect(disabledConsumer).not.toHaveBeenCalled()
  },
}
const fileRegistration = fn()
const UnrelatedFileChange = () => {
  const methods = useForm<FieldValues>({ defaultValues: { unrelated: '' } })
  const countedMethods = {
    ...methods,
    register: ((name, options) => {
      if (name === 'countedFile') fileRegistration()
      return methods.register(name, options)
    }) as typeof methods.register,
  }
  return (
    <form noValidate onSubmit={methods.handleSubmit(submit, invalid)}>
      <FileUpload
        id="countedFile"
        label="Counted file"
        fileType="binary"
        required
        formProps={countedMethods}
      />
      <button
        type="button"
        onClick={() => methods.setValue('unrelated', 'updated')}
      >
        Edit unrelated field
      </button>
    </form>
  )
}
export const UnrelatedFileNotification: Story = {
  render: () => <UnrelatedFileChange />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    fileRegistration.mockClear()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Edit unrelated field' })
    )
    await expect(fileRegistration).not.toHaveBeenCalled()
  },
}

const RemovingNestedFile = () => {
  const methods = useForm<FieldValues>()
  const [shown, setShown] = useState(true)
  return (
    <form noValidate onSubmit={methods.handleSubmit(submit, invalid)}>
      {shown && (
        <FileUpload
          id="profile.file"
          label="Removed nested file"
          fileType="binary"
          required
          formProps={methods}
        />
      )}
      <button
        type="button"
        onClick={() => {
          setShown(false)
          methods.unregister('profile.file')
          methods.setValue('profile', { other: 'updated' })
          void methods.handleSubmit(submit, invalid)()
        }}
      >
        Remove nested file and submit
      </button>
    </form>
  )
}
export const RemovedNestedFileSubmission: Story = {
  render: () => <RemovingNestedFile />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    invalid.mockClear()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Remove nested file and submit' })
    )
    await expect(invalid).not.toHaveBeenCalled()
    await expect(submit).toHaveBeenCalledTimes(1)
    await expect(submit.mock.calls[0][0].profile).not.toHaveProperty('file')
    await expect(
      canvas.queryByLabelText(/^Removed nested file/)
    ).not.toBeInTheDocument()
  },
}
const clearingCapture = fn()
const ConsumerClearedFile = () => {
  const methods = useForm<FieldValues>({ mode: 'onChange' })
  return (
    <form noValidate onSubmit={methods.handleSubmit(submit, invalid)}>
      <FileUpload
        id="consumerClearedFile"
        label="Consumer cleared file"
        fileType="binary"
        required
        formProps={methods}
        onChangeCapture={(event) => {
          clearingCapture()
          event.currentTarget.value = ''
        }}
      />
      <button type="submit">Submit consumer cleared file</button>
    </form>
  )
}
export const ConsumerCaptureFileChange: Story = {
  render: () => <ConsumerClearedFile />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    invalid.mockClear()
    clearingCapture.mockClear()
    const input = canvas.getByLabelText(/^Consumer cleared file/)
    await userEvent.upload(input, new File(['selected'], 'cleared.txt'))
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'))
    await expect(input).toHaveAccessibleDescription('This field is required.')
    await expect(clearingCapture).toHaveBeenCalledTimes(1)
    await expect(canvas.queryByText('cleared.txt')).not.toBeInTheDocument()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit consumer cleared file' })
    )
    await expect(submit).not.toHaveBeenCalled()
    await expect(invalid.mock.calls[0][0].consumerClearedFile.type).toBe(
      'required'
    )
  },
}
