import type { Meta, StoryObj } from '@storybook/react-vite'
import FormExample from '../../site/src/examples/FormExample'
import TextExample from '../../site/src/examples/TextExample'
import TextAreaExample from '../../site/src/examples/TextAreaExample'
import SelectExample from '../../site/src/examples/SelectExample'
import CheckboxExample from '../../site/src/examples/CheckboxExample'
import DateExample from '../../site/src/examples/DateExample'
import FileUploadExample from '../../site/src/examples/FileUploadExample'
import TagInputExample from '../../site/src/examples/showcase/tag.yup'
import formSource from '../../site/src/examples/FormExample.tsx?raw'
import textSource from '../../site/src/examples/TextExample.tsx?raw'
import textAreaSource from '../../site/src/examples/TextAreaExample.tsx?raw'
import selectSource from '../../site/src/examples/SelectExample.tsx?raw'
import checkboxSource from '../../site/src/examples/CheckboxExample.tsx?raw'
import dateSource from '../../site/src/examples/DateExample.tsx?raw'
import fileUploadSource from '../../site/src/examples/FileUploadExample.tsx?raw'
import tagInputSource from '../../site/src/examples/showcase/tag.yup.tsx?raw'

const meta = {
  title: 'Components',
  tags: ['autodocs'],
  parameters: { tailwind: true },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ARForm: Story = {
  render: () => <FormExample />,
  parameters: { docs: { source: { code: formSource } } },
}

export const Text: Story = {
  render: () => <TextExample />,
  parameters: { docs: { source: { code: textSource } } },
}

export const TextArea: Story = {
  render: () => <TextAreaExample />,
  parameters: { docs: { source: { code: textAreaSource } } },
}

export const Select: Story = {
  render: () => <SelectExample />,
  parameters: { docs: { source: { code: selectSource } } },
}

export const Checkbox: Story = {
  render: () => <CheckboxExample />,
  parameters: { docs: { source: { code: checkboxSource } } },
}

export const Date: Story = {
  render: () => <DateExample />,
  parameters: { docs: { source: { code: dateSource } } },
}

export const FileUpload: Story = {
  render: () => <FileUploadExample />,
  parameters: { docs: { source: { code: fileUploadSource } } },
}

export const TagInput: Story = {
  render: () => <TagInputExample />,
  parameters: { docs: { source: { code: tagInputSource } } },
}
