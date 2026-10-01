import { useParams } from 'react-router-dom'
import { ExamplePreview } from '../../../components/ExamplePreview'
import type { ComponentType } from 'react'

import FormExample from '../../../examples/FormExample'
import FormExampleSource from '../../../examples/FormExample.tsx?raw'
import TextExample from '../../../examples/TextExample'
import TextExampleSource from '../../../examples/TextExample.tsx?raw'
import TextAreaExample from '../../../examples/TextAreaExample'
import TextAreaExampleSource from '../../../examples/TextAreaExample.tsx?raw'
import SelectExample from '../../../examples/SelectExample'
import SelectExampleSource from '../../../examples/SelectExample.tsx?raw'
import CheckboxExample from '../../../examples/CheckboxExample'
import CheckboxExampleSource from '../../../examples/CheckboxExample.tsx?raw'
import DateExample from '../../../examples/DateExample'
import DateExampleSource from '../../../examples/DateExample.tsx?raw'
import FileUploadExample from '../../../examples/FileUploadExample'
import FileUploadExampleSource from '../../../examples/FileUploadExample.tsx?raw'

type ComponentDoc = {
  name: string
  Preview: ComponentType
  source: string
  summary: string
}

const docs: Record<string, ComponentDoc> = {
  arform: {
    name: 'ARForm',
    Preview: FormExample,
    source: FormExampleSource,
    summary:
      'The form root. Owns the validation schema, registers fields with react-hook-form, and includes a visually hidden submit control for Enter submission. Add your own visible submit button when needed.',
  },
  text: {
    name: 'Text',
    Preview: TextExample,
    source: TextExampleSource,
    summary: 'Text input. Supports an optional prefix slot.',
  },
  textarea: {
    name: 'TextArea',
    Preview: TextAreaExample,
    source: TextAreaExampleSource,
    summary: 'Multi-line text input. Forwards minLength/maxLength.',
  },
  select: {
    name: 'Select',
    Preview: SelectExample,
    source: SelectExampleSource,
    summary:
      'Native select. Pass options as strings or { label, value } objects.',
  },
  checkbox: {
    name: 'Checkbox',
    Preview: CheckboxExample,
    source: CheckboxExampleSource,
    summary:
      'Single checkbox before its label text. Style the control with className and the label with labelClassName.',
  },
  date: {
    name: 'Date',
    Preview: DateExample,
    source: DateExampleSource,
    summary: 'Native date input.',
  },
  fileupload: {
    name: 'FileUpload',
    Preview: FileUploadExample,
    source: FileUploadExampleSource,
    summary:
      'Native file input with an image preview for media and a filename preview for binaries. Files can be dropped onto the native input.',
  },
}

export const ComponentPage = () => {
  const { name } = useParams<{ name: string }>()
  const doc = name ? docs[name] : undefined

  if (!doc) {
    return (
      <>
        <h1>Component not found</h1>
        <p>
          No component named <code>{name}</code>.
        </p>
      </>
    )
  }

  return (
    <>
      <h1>&lt;{doc.name}&gt;</h1>
      <p>{doc.summary}</p>
      <ExamplePreview key={name} source={doc.source}>
        <doc.Preview />
      </ExamplePreview>
      <p className="text-sm text-fg-muted">
        Copy the Code tab into a React app with Tailwind CSS configured. The
        preview runs that exact source, including its styling classes.
      </p>
    </>
  )
}
