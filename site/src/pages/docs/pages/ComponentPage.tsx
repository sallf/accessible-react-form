import { useParams } from 'react-router-dom'
import { StoryEmbed } from '../StoryEmbed'

type ComponentDoc = {
  name: string
  storyId: string
  summary: string
  example: string
}

const docs: Record<string, ComponentDoc> = {
  arform: {
    name: 'ARForm',
    storyId: 'forms-arform--default',
    summary: 'The form root. Owns the validation schema, registers fields with react-hook-form, and renders a default submit button.',
    example: `<ARForm validationSchema={schema} onSubmit={onSubmit}>
  {/* fields */}
</ARForm>`,
  },
  text: {
    name: 'Text',
    storyId: 'forms-text--default',
    summary: 'Text input. Supports an optional prefix slot.',
    example: `<Text id="email" label="Email" required />`,
  },
  textarea: {
    name: 'TextArea',
    storyId: 'forms-textarea--default',
    summary: 'Multi-line text input. Forwards minLength/maxLength.',
    example: `<TextArea id="bio" label="Bio" maxLength={500} />`,
  },
  select: {
    name: 'Select',
    storyId: 'forms-select--default',
    summary: 'Native select. Pass options as strings or { label, value } objects.',
    example: `<Select
  id="country"
  label="Country"
  options={['US', 'CA', 'MX']}
/>`,
  },
  checkbox: {
    name: 'Checkbox',
    storyId: 'forms-checkbox--default',
    summary: 'Single checkbox. The label renders in row layout (data-arform-row).',
    example: `<Checkbox id="terms" label="I agree to the terms" required />`,
  },
  date: {
    name: 'Date',
    storyId: 'forms-date--default',
    summary: 'Native date input.',
    example: `<Date id="birthday" label="Birthday" />`,
  },
  fileupload: {
    name: 'FileUpload',
    storyId: 'forms-fileupload--default',
    summary: 'File input with drag-and-drop, preview for media, and filename for binaries.',
    example: `<FileUpload id="avatar" label="Avatar" fileType="media" />`,
  },
}

export const ComponentPage = () => {
  const { name } = useParams<{ name: string }>()
  const doc = name ? docs[name] : undefined

  if (!doc) {
    return (
      <>
        <h1>Component not found</h1>
        <p>No component named <code>{name}</code>.</p>
      </>
    )
  }

  return (
    <>
      <h1>&lt;{doc.name}&gt;</h1>
      <p>{doc.summary}</p>
      <h2>Example</h2>
      <pre><code>{doc.example}</code></pre>
      <h2>Live</h2>
      <StoryEmbed storyId={doc.storyId} title={`${doc.name} — live example`} />
    </>
  )
}
