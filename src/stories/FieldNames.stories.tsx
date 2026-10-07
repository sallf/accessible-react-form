import type { Meta, StoryObj } from '@storybook/react-vite'
import { renderToString } from 'react-dom/server'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ARForm } from '../components/ARForm/ARForm'
import { Text } from '../components/Input/Text/Text'
import { Date } from '../components/Input/Date/Date'
import { Checkbox } from '../components/Input/Checkbox/Checkbox'
import { FileUpload } from '../components/Input/FileUpload/FileUpload'
import { TagInput } from '../components/Input/TagInput/TagInput'
import { Select } from '../components/Select/Select'
import { TextArea } from '../components/TextArea/TextArea'

const meta: Meta<typeof ARForm> = {
  component: ARForm,
  title: 'Examples/Field names',
  args: { onSubmit: fn() },
}
export default meta
type Story = StoryObj<typeof ARForm>

const fieldFactories = [
  (id: string) => <Text id={id} label="Field" />,
  (id: string) => <Date id={id} label="Field" />,
  (id: string) => <Checkbox id={id} label="Field" />,
  (id: string) => <FileUpload id={id} label="Field" fileType="binary" />,
  (id: string) => <TagInput id={id} label="Field" />,
  (id: string) => (
    <TagInput id={id} label="Field" onlySuggestions suggestions={['One']} />
  ),
  (id: string) => <Select id={id} label="Field" options={['One']} />,
  (id: string) => <TextArea id={id} label="Field" />,
]

export const InvalidNamesFailEarly: Story = {
  render: ({ onSubmit }) => (
    <ARForm onSubmit={onSubmit}>
      <Text id="name" label="Name" />
    </ARForm>
  ),
  play: async () => {
    for (const field of fieldFactories) {
      for (const id of [undefined, null, 0, 42, {}, [], '']) {
        await expect(() =>
          renderToString(
            <ARForm onSubmit={() => {}}>{field(id as string)}</ARForm>
          )
        ).toThrow(/Accessible React Form field id must be a nonempty string/)
      }
      for (const id of [
        '__proto__',
        'constructor',
        'prototype',
        'toString',
        'profile.valueOf',
        'items[0].hasOwnProperty',
        '__defineGetter__',
        'profile.toLocaleString',
        'profile.__proto__.name',
        'items[0].constructor',
        'profile["prototype"]',
      ]) {
        await expect(() =>
          renderToString(<ARForm onSubmit={() => {}}>{field(id)}</ARForm>)
        ).toThrow(/field id uses a reserved path segment/)
      }
      for (const id of ['root', 'root.name', 'root[0].name', '["root"].name']) {
        await expect(() =>
          renderToString(<ARForm onSubmit={() => {}}>{field(id)}</ARForm>)
        ).toThrow(/field ids beginning with root are reserved/)
      }
      for (const id of ['a|b', '|name', 'profile.name|']) {
        await expect(() =>
          renderToString(<ARForm onSubmit={() => {}}>{field(id)}</ARForm>)
        ).toThrow(/field ids cannot contain \|/)
      }
      for (const id of [
        'name',
        'profile.name',
        'items.0.name',
        'items[0].name',
        'constructorName',
        'profiles.prototypeName',
        'profile.root',
        'a_b',
        '名前',
      ]) {
        await expect(() =>
          renderToString(<ARForm onSubmit={() => {}}>{field(id)}</ARForm>)
        ).not.toThrow()
      }
    }
  },
}

export const NestedPathsStillSubmit: Story = {
  render: ({ onSubmit }) => (
    <ARForm onSubmit={onSubmit}>
      <Text id="profile.name" label="Name" />
      <Text id="profile.root" label="Nested root" required />
      <TextArea id="items.0.notes" label="Notes" />
      <Select
        id="items[0].category"
        label="Category"
        options={['One', 'Two']}
      />
      <button type="submit">Submit</button>
    </ARForm>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('textbox', { name: 'Name' }), 'Ada')
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Nested root' }),
      'Allowed'
    )
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Notes' }),
      'Nested'
    )
    await userEvent.selectOptions(
      canvas.getByRole('combobox', { name: 'Category' }),
      'Two'
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
    await expect(args.onSubmit).toHaveBeenCalledWith(
      {
        profile: { name: 'Ada', root: 'Allowed' },
        items: [{ notes: 'Nested', category: 'Two' }],
      },
      expect.anything()
    )
  },
}
