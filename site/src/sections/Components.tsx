import { useState, type ReactNode } from 'react'
import {
  ARForm,
  Text,
  Checkbox,
  Date as DateInput,
  FileUpload,
  TagInput,
  Select,
  TextArea,
} from 'accessible-react-form'
import { object, string, type AnyObjectSchema } from 'yup'
import { CodeBlock } from '../components/CodeBlock'

type Demo = {
  id: string
  name: string
  code: string
  preview: ReactNode
}

const noop = () => {}

const textSchema: AnyObjectSchema = object({ name: string().required() })
const checkboxSchema: AnyObjectSchema = object({ terms: string().required() })
const dateSchema: AnyObjectSchema = object({ dob: string().required() })
const fileSchema: AnyObjectSchema = object({ file: string() })
const tagSchema: AnyObjectSchema = object({ tags: string() })
const selectSchema: AnyObjectSchema = object({ country: string().required() })
const textAreaSchema: AnyObjectSchema = object({ comments: string().required() })

const demos: Demo[] = [
  {
    id: 'text',
    name: 'Text',
    code: `const schema = object({
  name: string().required(),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Text id="name" label="Name" />
</ARForm>`,
    preview: (
      <ARForm validationSchema={textSchema} onSubmit={noop}>
        <Text id="name" label="Name" />
      </ARForm>
    ),
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    code: `const schema = object({
  terms: string().required(),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Checkbox id="terms" label="I agree to the terms" />
</ARForm>`,
    preview: (
      <ARForm validationSchema={checkboxSchema} onSubmit={noop}>
        <Checkbox id="terms" label="I agree to the terms" />
      </ARForm>
    ),
  },
  {
    id: 'date',
    name: 'Date',
    code: `const schema = object({
  dob: string().required(),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Date id="dob" label="Date of Birth" />
</ARForm>`,
    preview: (
      <ARForm validationSchema={dateSchema} onSubmit={noop}>
        <DateInput id="dob" label="Date of Birth" />
      </ARForm>
    ),
  },
  {
    id: 'select',
    name: 'Select',
    code: `const schema = object({
  country: string().required(),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Select
    id="country"
    label="Country"
    options={['USA', 'Canada', 'Mexico']}
  />
</ARForm>`,
    preview: (
      <ARForm validationSchema={selectSchema} onSubmit={noop}>
        <Select id="country" label="Country" options={['USA', 'Canada', 'Mexico']} />
      </ARForm>
    ),
  },
  {
    id: 'textarea',
    name: 'TextArea',
    code: `const schema = object({
  comments: string().required(),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <TextArea id="comments" label="Comments" />
</ARForm>`,
    preview: (
      <ARForm validationSchema={textAreaSchema} onSubmit={noop}>
        <TextArea id="comments" label="Comments" />
      </ARForm>
    ),
  },
  {
    id: 'file',
    name: 'FileUpload',
    code: `const schema = object({
  file: string(),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <FileUpload id="file" label="Upload a file" fileType="media" />
</ARForm>`,
    preview: (
      <ARForm validationSchema={fileSchema} onSubmit={noop}>
        <FileUpload id="file" label="Upload a file" fileType="media" />
      </ARForm>
    ),
  },
  {
    id: 'tag',
    name: 'TagInput',
    code: `const schema = object({
  tags: string(),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <TagInput id="tags" label="Tags" />
</ARForm>`,
    preview: (
      <ARForm validationSchema={tagSchema} onSubmit={noop}>
        <TagInput id="tags" label="Tags" />
      </ARForm>
    ),
  },
]

export const Components = () => {
  const [activeId, setActiveId] = useState(demos[0].id)
  const active = demos.find((d) => d.id === activeId)!

  return (
    <section id="components" className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Every input you need.
          </h2>
          <p className="text-fg-muted text-lg">
            Drop them into <code className="font-mono text-sm px-1 py-0.5 rounded bg-bg-subtle">&lt;ARForm&gt;</code>.
            They wire themselves up.
          </p>
        </div>

        <div role="tablist" aria-label="Components" className="flex flex-wrap gap-2 mb-8">
          {demos.map((d) => (
            <button
              key={d.id}
              role="tab"
              aria-selected={activeId === d.id}
              aria-controls={`panel-${d.id}`}
              id={`tab-${d.id}`}
              type="button"
              onClick={() => setActiveId(d.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                activeId === d.id
                  ? 'bg-accent text-white border-accent'
                  : 'border-border text-fg-muted hover:text-fg hover:bg-bg-subtle'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
        >
          <div className="p-6 rounded-lg bg-bg-subtle border border-border min-h-[200px]">
            <p className="text-xs font-mono text-fg-muted mb-4 uppercase tracking-wider">Preview</p>
            {active.preview}
          </div>
          <div>
            <p className="text-xs font-mono text-fg-muted mb-4 uppercase tracking-wider">Code</p>
            <CodeBlock code={active.code} lang="tsx" />
          </div>
        </div>
      </div>
    </section>
  )
}
