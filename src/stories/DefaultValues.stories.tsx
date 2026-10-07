import { useState } from 'react'
import { renderToString } from 'react-dom/server'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ARForm } from '../components/ARForm/ARForm'
import { Text } from '../components/Input/Text/Text'
import { FileUpload } from '../components/Input/FileUpload/FileUpload'
import { defaultValuesEqual } from '../hooks/defaultValuesEqual'

const meta: Meta<typeof ARForm> = {
  component: ARForm,
  title: 'Examples/Default values',
  args: { onSubmit: fn() },
}
export default meta
type Story = StoryObj<typeof ARForm>

const createFileList = () => {
  const transfer = new DataTransfer()
  transfer.items.add(new File(['list'], 'list.txt'))
  return transfer.files
}

const Parent = ({
  onSubmit,
}: Pick<React.ComponentProps<typeof ARForm>, 'onSubmit'>) => {
  const [changes, setChanges] = useState(0)
  const [revision, setRevision] = useState(0)
  const [generation, setGeneration] = useState(0)
  const [file, setFile] = useState(() => new File(['file'], 'saved.txt'))
  const [files, setFiles] = useState(createFileList)
  return (
    <div>
      <p>Changes: {changes}</p>
      <p>Revision: {revision}</p>
      <button onClick={() => setRevision((value) => value + 1)}>
        Rerender parent
      </button>
      <button onClick={() => setGeneration((value) => value + 1)}>
        Replace defaults
      </button>
      <button onClick={() => setFile(new File(['file'], 'saved.txt'))}>
        Replace file
      </button>
      <button onClick={() => setFiles(createFileList())}>
        Replace file list
      </button>
      <ARForm
        onSubmit={onSubmit}
        defaultValues={{
          profile: { name: generation ? 'Grace' : 'Ada' },
          items: [{ title: generation ? 'Second' : 'First' }],
          date: new Date('2026-01-02'),
          attachment: file,
          attachments: files,
        }}
        onChangeCallback={() => setChanges((value) => value + 1)}
      >
        <Text id="profile.name" label="Name" />
        <Text id="items.0.title" label="Item" />
        <FileUpload id="attachment" label="File" fileType="binary" />
        <FileUpload id="attachments" label="Files" fileType="binary" />
        <button type="submit">Submit</button>
      </ARForm>
    </div>
  )
}

export const PreserveEditsAndResetReplacements: Story = {
  render: ({ onSubmit }) => <Parent onSubmit={onSubmit} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const name = canvas.getByRole('textbox', { name: 'Name' })
    const item = canvas.getByRole('textbox', { name: 'Item' })
    await expect(name).toHaveValue('Ada')
    await userEvent.clear(name)
    await userEvent.type(name, 'Edited')
    await userEvent.clear(item)
    await userEvent.type(item, 'Custom')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Rerender parent' })
    )
    await expect(name).toHaveValue('Edited')
    await expect(item).toHaveValue('Custom')
    await expect(canvas.getByText(/Changes: [1-9]/)).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        profile: { name: 'Edited' },
        items: [{ title: 'Custom' }],
      }),
      expect.anything()
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Replace defaults' })
    )
    await expect(name).toHaveValue('Grace')
    await expect(item).toHaveValue('Second')
    for (const button of ['Replace file', 'Replace file list']) {
      await userEvent.clear(name)
      await userEvent.type(name, 'Unsaved')
      await userEvent.click(canvas.getByRole('button', { name: button }))
      await expect(name).toHaveValue('Grace')
    }
  },
}

export const ComparisonEdgeCases: Story = {
  render: ({ onSubmit }) => (
    <ARForm onSubmit={onSubmit}>
      <Text id="name" label="Name" />
    </ARForm>
  ),
  play: async () => {
    const left: Record<string, unknown> = { value: 'same' }
    left.self = left
    const right: Record<string, unknown> = { value: 'same' }
    right.self = right
    await expect(defaultValuesEqual(left, right)).toBe(true)
    right.value = 'different'
    await expect(defaultValuesEqual(left, right)).toBe(false)
    await expect(defaultValuesEqual(new Date(0), new Date(0))).toBe(true)
    await expect(defaultValuesEqual(new Date(0), new Date(1))).toBe(false)
    await expect(
      defaultValuesEqual(new File(['x'], 'x.txt'), new File(['x'], 'x.txt'))
    ).toBe(false)
    await expect(defaultValuesEqual(createFileList(), createFileList())).toBe(
      false
    )
    const child = { value: 1 }
    await expect(
      defaultValuesEqual(
        { a: child, b: child },
        { a: { value: 1 }, b: { value: 1 } }
      )
    ).toBe(true)
  },
}

export const MissingContextGuidance: Story = {
  render: ({ onSubmit }) => (
    <ARForm onSubmit={onSubmit}>
      <Text id="name" label="Name" />
    </ARForm>
  ),
  play: async () => {
    await expect(() =>
      renderToString(<Text id="orphan" label="Orphan" />)
    ).toThrow(
      /Wrap the field in ARForm or a matching React Hook Form FormProvider, or pass formProps/
    )
    await expect(() =>
      renderToString(<Text id="orphan" label="Orphan" />)
    ).toThrow(/separate react-hook-form or library module instances/)
  },
}
