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
import { object as yupObject, string as yupString } from 'yup'
import { z } from 'zod'
import * as v from 'valibot'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import { CodeBlock } from '../components/CodeBlock'

type SchemaLib = 'yup' | 'zod' | 'valibot'

type Demo = {
  id: string
  name: string
  schemas: Record<SchemaLib, StandardSchemaV1>
  code: Record<SchemaLib, string>
  preview: ReactNode
}

const noop = () => {}

const demos: Demo[] = [
  {
    id: 'text',
    name: 'Text',
    schemas: {
      yup: yupObject({ name: yupString().required() }),
      zod: z.object({ name: z.string().min(1) }),
      valibot: v.object({ name: v.pipe(v.string(), v.minLength(1)) }),
    },
    code: {
      yup: `import { object, string } from 'yup'

const schema = object({
  name: string().required(),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Text id="name" label="Name" required />
</ARForm>`,
      zod: `import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Text id="name" label="Name" required />
</ARForm>`,
      valibot: `import * as v from 'valibot'

const schema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Text id="name" label="Name" required />
</ARForm>`,
    },
    preview: <Text id="name" label="Name" required />,
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    schemas: {
      yup: yupObject({ terms: yupString().required() }),
      zod: z.object({ terms: z.string().min(1) }),
      valibot: v.object({ terms: v.pipe(v.string(), v.minLength(1)) }),
    },
    code: {
      yup: `import { object, string } from 'yup'

const schema = object({
  terms: string().required(),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Checkbox id="terms" label="I agree to the terms" required />
</ARForm>`,
      zod: `import { z } from 'zod'

const schema = z.object({
  terms: z.string().min(1),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Checkbox id="terms" label="I agree to the terms" required />
</ARForm>`,
      valibot: `import * as v from 'valibot'

const schema = v.object({
  terms: v.pipe(v.string(), v.minLength(1)),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Checkbox id="terms" label="I agree to the terms" required />
</ARForm>`,
    },
    preview: <Checkbox id="terms" label="I agree to the terms" required />,
  },
  {
    id: 'date',
    name: 'Date',
    schemas: {
      yup: yupObject({ dob: yupString().required() }),
      zod: z.object({ dob: z.string().min(1) }),
      valibot: v.object({ dob: v.pipe(v.string(), v.minLength(1)) }),
    },
    code: {
      yup: `import { object, string } from 'yup'

const schema = object({
  dob: string().required(),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Date id="dob" label="Date of Birth" required />
</ARForm>`,
      zod: `import { z } from 'zod'

const schema = z.object({
  dob: z.string().min(1),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Date id="dob" label="Date of Birth" required />
</ARForm>`,
      valibot: `import * as v from 'valibot'

const schema = v.object({
  dob: v.pipe(v.string(), v.minLength(1)),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Date id="dob" label="Date of Birth" required />
</ARForm>`,
    },
    preview: <DateInput id="dob" label="Date of Birth" required />,
  },
  {
    id: 'select',
    name: 'Select',
    schemas: {
      yup: yupObject({ country: yupString().required() }),
      zod: z.object({ country: z.string().min(1) }),
      valibot: v.object({ country: v.pipe(v.string(), v.minLength(1)) }),
    },
    code: {
      yup: `import { object, string } from 'yup'

const schema = object({
  country: string().required(),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Select
    id="country"
    label="Country"
    options={['USA', 'Canada', 'Mexico']}
    required
  />
</ARForm>`,
      zod: `import { z } from 'zod'

const schema = z.object({
  country: z.string().min(1),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Select
    id="country"
    label="Country"
    options={['USA', 'Canada', 'Mexico']}
    required
  />
</ARForm>`,
      valibot: `import * as v from 'valibot'

const schema = v.object({
  country: v.pipe(v.string(), v.minLength(1)),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Select
    id="country"
    label="Country"
    options={['USA', 'Canada', 'Mexico']}
    required
  />
</ARForm>`,
    },
    preview: (
      <Select id="country" label="Country" options={['USA', 'Canada', 'Mexico']} required />
    ),
  },
  {
    id: 'textarea',
    name: 'TextArea',
    schemas: {
      yup: yupObject({ comments: yupString().required() }),
      zod: z.object({ comments: z.string().min(1) }),
      valibot: v.object({ comments: v.pipe(v.string(), v.minLength(1)) }),
    },
    code: {
      yup: `import { object, string } from 'yup'

const schema = object({
  comments: string().required(),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <TextArea id="comments" label="Comments" required />
</ARForm>`,
      zod: `import { z } from 'zod'

const schema = z.object({
  comments: z.string().min(1),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <TextArea id="comments" label="Comments" required />
</ARForm>`,
      valibot: `import * as v from 'valibot'

const schema = v.object({
  comments: v.pipe(v.string(), v.minLength(1)),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <TextArea id="comments" label="Comments" required />
</ARForm>`,
    },
    preview: <TextArea id="comments" label="Comments" required />,
  },
  {
    id: 'file',
    name: 'FileUpload',
    schemas: {
      yup: yupObject({ file: yupString() }),
      zod: z.object({ file: z.string().optional() }),
      valibot: v.object({ file: v.optional(v.string()) }),
    },
    code: {
      yup: `import { object, string } from 'yup'

const schema = object({
  file: string(),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <FileUpload id="file" label="Upload a file" fileType="media" />
</ARForm>`,
      zod: `import { z } from 'zod'

const schema = z.object({
  file: z.string().optional(),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <FileUpload id="file" label="Upload a file" fileType="media" />
</ARForm>`,
      valibot: `import * as v from 'valibot'

const schema = v.object({
  file: v.optional(v.string()),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <FileUpload id="file" label="Upload a file" fileType="media" />
</ARForm>`,
    },
    preview: <FileUpload id="file" label="Upload a file" fileType="media" />,
  },
  {
    id: 'tag',
    name: 'TagInput',
    schemas: {
      yup: yupObject({ tags: yupString() }),
      zod: z.object({ tags: z.string().optional() }),
      valibot: v.object({ tags: v.optional(v.string()) }),
    },
    code: {
      yup: `import { object, string } from 'yup'

const schema = object({
  tags: string(),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <TagInput id="tags" label="Tags" />
</ARForm>`,
      zod: `import { z } from 'zod'

const schema = z.object({
  tags: z.string().optional(),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <TagInput id="tags" label="Tags" />
</ARForm>`,
      valibot: `import * as v from 'valibot'

const schema = v.object({
  tags: v.optional(v.string()),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <TagInput id="tags" label="Tags" />
</ARForm>`,
    },
    preview: <TagInput id="tags" label="Tags" />,
  },
]

const schemaLibs: { id: SchemaLib; name: string }[] = [
  { id: 'yup', name: 'yup' },
  { id: 'zod', name: 'zod' },
  { id: 'valibot', name: 'valibot' },
]

export const Components = () => {
  const [activeId, setActiveId] = useState(demos[0].id)
  const [schemaLib, setSchemaLib] = useState<SchemaLib>('yup')
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
            They wire themselves up — with whatever schema validator you prefer.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div role="tablist" aria-label="Components" className="flex flex-wrap gap-2">
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
            role="radiogroup"
            aria-label="Schema validator"
            className="flex items-center gap-1 p-1 rounded-md bg-bg-subtle border border-border self-start sm:self-auto"
          >
            <span className="text-xs text-fg-muted px-2 hidden sm:inline">Schema:</span>
            {schemaLibs.map((s) => (
              <button
                key={s.id}
                role="radio"
                aria-checked={schemaLib === s.id}
                type="button"
                onClick={() => setSchemaLib(s.id)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  schemaLib === s.id
                    ? 'bg-bg text-fg shadow-sm'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
        >
          <div className="p-6 rounded-lg bg-bg-subtle border border-border min-h-[200px]">
            <p className="text-xs font-mono text-fg-muted mb-4 uppercase tracking-wider">Preview</p>
            <ARForm
              key={`${active.id}-${schemaLib}`}
              validationSchema={active.schemas[schemaLib]}
              onSubmit={noop}
            >
              {active.preview}
            </ARForm>
          </div>
          <div>
            <p className="text-xs font-mono text-fg-muted mb-4 uppercase tracking-wider">
              Code <span className="text-fg-muted/60">· {schemaLib}</span>
            </p>
            <CodeBlock code={active.code[schemaLib]} lang="tsx" />
          </div>
        </div>
      </div>
    </section>
  )
}
