import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { useForm } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import { ARForm } from '../components/ARForm/ARForm'
import { FileUpload } from '../components/Input/FileUpload/FileUpload'

const meta: Meta<typeof ARForm> = {
  title: 'Unstyled/File lifecycle',
  id: 'file-lifecycle',
  component: ARForm,
  parameters: { tailwind: false, a11y: { test: 'off' } },
  tags: ['file-lifecycle-regression'],
}
export default meta
type Story = StoryObj<typeof ARForm>
const submit = fn()
const ResetFile = () => {
  const methods = useForm<FieldValues>({
    defaultValues: { attachment: 'saved.txt' },
  })
  return (
    <ARForm onSubmit={submit}>
      <FileUpload
        id="attachment"
        label="Attachment"
        fileType="binary"
        formProps={methods}
      />
      <button type="button" onClick={methods.handleSubmit(submit)}>
        Save file
      </button>
      <button type="button" onClick={() => methods.reset()}>
        Reset form
      </button>
      <button type="button" onClick={() => methods.resetField('attachment')}>
        Reset file
      </button>
      <button type="button" onClick={() => methods.reset({ attachment: '' })}>
        Clear file
      </button>
    </ARForm>
  )
}
export const FileResetAndDefaults: Story = {
  render: () => <ResetFile />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    await expect(canvas.getByText('saved.txt')).toBeVisible()
    for (const reset of ['Reset form', 'Reset file']) {
      const control = canvas.getByLabelText(/^Attachment/)
      await userEvent.upload(
        control,
        new File(['new'], 'picked.txt', { type: 'text/plain' })
      )
      await expect(canvas.getByText('picked.txt')).toBeVisible()
      await userEvent.click(canvas.getByRole('button', { name: 'Save file' }))
      await expect(
        submit.mock.calls[submit.mock.calls.length - 1][0].attachment[0].name
      ).toBe('picked.txt')
      await userEvent.click(canvas.getByRole('button', { name: reset }))
      await expect(canvas.queryByText('picked.txt')).not.toBeInTheDocument()
      await expect(canvas.getByText('saved.txt')).toBeVisible()
      await userEvent.click(canvas.getByRole('button', { name: 'Save file' }))
      await expect(submit).toHaveBeenLastCalledWith(
        { attachment: 'saved.txt' },
        expect.anything()
      )
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Clear file' }))
    await expect(canvas.queryByText('saved.txt')).not.toBeInTheDocument()
    await expect(canvas.queryByText('picked.txt')).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Save file' }))
    await expect(submit).toHaveBeenLastCalledWith(
      { attachment: '' },
      expect.anything()
    )
  },
}

const ChangingDefaults = () => {
  const [defaults, setDefaults] = useState<FieldValues>(() => ({
    attachment: new File(['initial'], 'initial.txt'),
  }))
  return (
    <ARForm onSubmit={submit} defaultValues={defaults}>
      <FileUpload id="attachment" label="Attachment" fileType="binary" />
      <button
        type="button"
        onClick={() =>
          setDefaults({
            attachment: new File(['replacement'], 'replacement.txt'),
          })
        }
      >
        Replace default file
      </button>
      <button
        type="button"
        onClick={() => setDefaults({ attachment: 'existing.txt' })}
      >
        Use string default
      </button>
      <button type="button" onClick={() => setDefaults({ attachment: '' })}>
        Clear default
      </button>
      <button type="submit">Save defaults</button>
    </ARForm>
  )
}
export const ChangedFormDefaults: Story = {
  render: () => <ChangingDefaults />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    await expect(await canvas.findByText('initial.txt')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Replace default file' })
    )
    await expect(await canvas.findByText('replacement.txt')).toBeVisible()
    await expect(canvas.queryByText('initial.txt')).not.toBeInTheDocument()
    await userEvent.upload(
      canvas.getByLabelText(/^Attachment/),
      new File(['picked'], 'picked.txt')
    )
    await expect(canvas.getByText('picked.txt')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Replace default file' })
    )
    await expect(await canvas.findByText('replacement.txt')).toBeVisible()
    await expect(canvas.queryByText('picked.txt')).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Save defaults' }))
    await expect(
      submit.mock.calls[submit.mock.calls.length - 1][0].attachment.name
    ).toBe('replacement.txt')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Use string default' })
    )
    await expect(await canvas.findByText('existing.txt')).toBeVisible()
    await expect(canvas.queryByText('replacement.txt')).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Save defaults' }))
    await expect(submit).toHaveBeenLastCalledWith(
      { attachment: 'existing.txt' },
      expect.anything()
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Clear default' }))
    await expect(canvas.queryByText('existing.txt')).not.toBeInTheDocument()
    await expect(canvas.queryByText('picked.txt')).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Save defaults' }))
    await expect(submit).toHaveBeenLastCalledWith(
      { attachment: '' },
      expect.anything()
    )
  },
}

const LogicalRequiredFile = () => {
  const methods = useForm<FieldValues>({
    defaultValues: { attachment: new File(['default'], 'default.txt') },
  })
  const resetList = (empty = false) => {
    const transfer = new DataTransfer()
    if (!empty) transfer.items.add(new File(['list'], 'listed.txt'))
    methods.reset({ attachment: transfer.files })
  }
  return (
    <ARForm onSubmit={submit}>
      <p id="file-help">Choose a file or retain the saved attachment.</p>
      <FileUpload
        id="attachment"
        label="Attachment"
        fileType="binary"
        formProps={methods}
        required
        aria-describedby="file-help"
      />
      <button type="button" onClick={methods.handleSubmit(submit)}>
        Submit required file
      </button>
      <button
        type="button"
        onClick={() =>
          methods.reset({ attachment: new File(['file'], 'file.txt') })
        }
      >
        Reset to File
      </button>
      <button type="button" onClick={() => resetList()}>
        Reset to FileList
      </button>
      <button
        type="button"
        onClick={() => methods.reset({ attachment: 'stored.txt' })}
      >
        Reset to string
      </button>
      <button type="button" onClick={() => resetList(true)}>
        Empty FileList
      </button>
      <button type="button" onClick={() => methods.reset({ attachment: '' })}>
        Empty string
      </button>
      <button type="button" onClick={() => methods.reset({ attachment: null })}>
        Null value
      </button>
      <button
        type="button"
        onClick={() => methods.reset({ attachment: undefined })}
      >
        Undefined value
      </button>
    </ARForm>
  )
}
export const RequiredLogicalFileValues: Story = {
  render: () => <LogicalRequiredFile />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    const control = canvas.getByLabelText(/^Attachment/)
    await expect(control).toHaveAttribute('aria-required', 'true')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit required file' })
    )
    await expect(
      submit.mock.calls[submit.mock.calls.length - 1][0].attachment.name
    ).toBe('default.txt')
    for (const [button, preview] of [
      ['Reset to File', 'file.txt'],
      ['Reset to FileList', 'listed.txt'],
      ['Reset to string', 'stored.txt'],
    ]) {
      await userEvent.click(canvas.getByRole('button', { name: button }))
      await expect(await canvas.findByText(preview)).toBeVisible()
      await expect(control).toHaveAttribute('aria-required', 'true')
      await userEvent.click(
        canvas.getByRole('button', { name: 'Submit required file' })
      )
      const value =
        submit.mock.calls[submit.mock.calls.length - 1][0].attachment
      await expect(
        typeof value === 'string'
          ? value
          : value instanceof File
            ? value.name
            : value[0].name
      ).toBe(preview)
    }
    await expect(submit).toHaveBeenCalledTimes(4)
    for (const button of [
      'Empty FileList',
      'Empty string',
      'Null value',
      'Undefined value',
    ]) {
      await userEvent.click(canvas.getByRole('button', { name: button }))
      await userEvent.click(
        canvas.getByRole('button', { name: 'Submit required file' })
      )
      await expect(submit).toHaveBeenCalledTimes(4)
      await expect(
        await canvas.findByText('This field is required.')
      ).toBeVisible()
      await expect(control).toHaveAttribute('aria-invalid', 'true')
      await expect(control).toHaveAttribute('aria-required', 'true')
      await expect(control).toHaveAccessibleDescription(
        'Choose a file or retain the saved attachment. This field is required.'
      )
    }
    await userEvent.upload(control, new File(['recovered'], 'recovered.txt'))
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit required file' })
    )
    await expect(submit).toHaveBeenCalledTimes(5)
    await expect(control).toHaveAttribute('aria-describedby', 'file-help')
  },
}

const pixelUrl =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1cAAAAASUVORK5CYII='
const imageFile = (name: string) =>
  new File(
    [
      Uint8Array.from(atob(pixelUrl.split(',')[1]), (char) =>
        char.charCodeAt(0)
      ),
    ],
    name,
    { type: 'image/png' }
  )
const MediaFile = () => {
  const methods = useForm<FieldValues>()
  const [type, setType] = useState<'media' | 'binary'>('media')
  const [mounted, setMounted] = useState(true)
  return (
    <ARForm onSubmit={submit}>
      {mounted && (
        <FileUpload
          id="image"
          label="Image file"
          fileType={type}
          formProps={methods}
        />
      )}
      <button type="button" onClick={() => methods.reset({ image: '' })}>
        Clear image
      </button>
      <button type="button" onClick={() => methods.reset({ image: pixelUrl })}>
        Use consumer URL
      </button>
      <button type="button" onClick={() => setType('binary')}>
        Binary mode
      </button>
      <button type="button" onClick={() => setType('media')}>
        Media mode
      </button>
      <button type="button" onClick={() => setMounted(false)}>
        Remove upload
      </button>
    </ARForm>
  )
}
export const MediaUrlLifecycle: Story = {
  render: () => <MediaFile />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Observe the browser resource boundary while retaining real object URLs.
    const nativeRevoke = URL.revokeObjectURL
    const revoke = fn((url: string) => nativeRevoke.call(URL, url))
    URL.revokeObjectURL = revoke
    try {
      await userEvent.upload(
        canvas.getByLabelText(/^Image file/),
        imageFile('first.png')
      )
      const first = (
        (await canvas.findByRole('presentation')) as HTMLImageElement
      ).src
      await expect((await fetch(first)).ok).toBe(true)
      await userEvent.upload(
        canvas.getByLabelText(/^Image file/),
        imageFile('second.png')
      )
      const second = (
        (await canvas.findByRole('presentation')) as HTMLImageElement
      ).src
      await expect(second).not.toBe(first)
      await expect(revoke).toHaveBeenCalledWith(first)
      await expect((await fetch(second)).ok).toBe(true)
      await userEvent.click(canvas.getByRole('button', { name: 'Binary mode' }))
      await expect(canvas.getByText('second.png')).toBeVisible()
      await expect(revoke).toHaveBeenCalledWith(second)
      await userEvent.click(canvas.getByRole('button', { name: 'Media mode' }))
      const third = (
        (await canvas.findByRole('presentation')) as HTMLImageElement
      ).src
      await expect(third).not.toBe(second)
      await userEvent.click(canvas.getByRole('button', { name: 'Clear image' }))
      await expect(canvas.queryByRole('presentation')).not.toBeInTheDocument()
      await expect(revoke).toHaveBeenCalledWith(third)
      await userEvent.click(
        canvas.getByRole('button', { name: 'Use consumer URL' })
      )
      await expect(await canvas.findByRole('presentation')).toHaveAttribute(
        'src',
        pixelUrl
      )
      await userEvent.upload(
        canvas.getByLabelText(/^Image file/),
        imageFile('last.png')
      )
      const last = (
        (await canvas.findByRole('presentation')) as HTMLImageElement
      ).src
      await expect(last).not.toBe(pixelUrl)
      await userEvent.click(
        canvas.getByRole('button', { name: 'Remove upload' })
      )
      await expect(revoke).toHaveBeenCalledWith(last)
      await expect(revoke).not.toHaveBeenCalledWith(pixelUrl)
      await expect(revoke.mock.calls.map(([url]) => url)).toEqual([
        first,
        second,
        third,
        last,
      ])
    } finally {
      URL.revokeObjectURL = nativeRevoke
    }
  },
}

const change = fn()
const blur = fn()
const capture = fn()
const blockedSubmit = fn()
const CallbackFiles = () => {
  const enabled = useForm<FieldValues>({
    defaultValues: { callbackFile: 'logical.txt' },
  })
  const blocked = useForm<FieldValues>({ disabled: true })
  return (
    <ARForm onSubmit={submit}>
      <FileUpload
        id="callbackFile"
        label="Callback file"
        fileType="binary"
        formProps={enabled}
        required
        defaultValue="ignored-native.txt"
        value="ignored-native.txt"
        onChange={change}
        onBlur={blur}
        onChangeCapture={capture}
      />
      <FileUpload
        id="blockedFile"
        label="Blocked file"
        fileType="binary"
        formProps={blocked}
        required
        disabled={false}
      />
      <FileUpload
        id="localDisabled"
        label="Local disabled file"
        fileType="binary"
        formProps={enabled}
        required
        disabled
      />
      <button type="button" onClick={enabled.handleSubmit(submit)}>
        Submit callbacks
      </button>
      <button type="button" onClick={blocked.handleSubmit(blockedSubmit)}>
        Submit disabled file
      </button>
    </ARForm>
  )
}
export const FileCallbacksAndDisabled: Story = {
  render: () => <CallbackFiles />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    blockedSubmit.mockClear()
    change.mockClear()
    blur.mockClear()
    capture.mockClear()
    const input = canvas.getByLabelText(/^Callback file/)
    await expect(input).toHaveValue('')
    await expect(canvas.getByText('logical.txt')).toBeVisible()
    await userEvent.upload(input, new File(['consumer'], 'consumer.txt'))
    await expect(change).toHaveBeenCalledTimes(1)
    await expect(capture).toHaveBeenCalledTimes(1)
    // The simulated file chooser can also blur; isolate the next blur event.
    blur.mockClear()
    input.focus()
    await userEvent.tab()
    await expect(blur).toHaveBeenCalledTimes(1)
    await expect(canvas.getByText('consumer.txt')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit callbacks' })
    )
    await expect(submit).toHaveBeenCalledTimes(1)
    await expect(submit.mock.calls[0][0].callbackFile[0].name).toBe(
      'consumer.txt'
    )
    for (const label of ['Blocked file', 'Local disabled file']) {
      const disabled = canvas.getByLabelText(new RegExp(`^${label}`))
      await expect(disabled).toBeDisabled()
      await expect(disabled).toHaveAttribute('aria-required', 'true')
      await expect(disabled).not.toHaveAttribute('aria-invalid', 'true')
    }
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit disabled file' })
    )
    await expect(blockedSubmit).toHaveBeenCalledTimes(1)
    await expect(
      canvas.queryByText('This field is required.')
    ).not.toBeInTheDocument()
  },
}

export const FileInitialAccessibility: Story = {
  render: () => <LogicalRequiredFile />,
}
export const FileInvalidAccessibility: Story = {
  render: () => <LogicalRequiredFile />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Empty string' }))
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit required file' })
    )
    await expect(
      await canvas.findByText('This field is required.')
    ).toBeVisible()
  },
}
