import { Link } from 'react-router-dom'

const components = [
  {
    name: 'ARForm',
    path: 'arform',
    desc: 'The form root. Owns the schema and submit handler.',
  },
  { name: 'Text', path: 'text', desc: 'Text input with optional prefix.' },
  { name: 'TextArea', path: 'textarea', desc: 'Multi-line text input.' },
  {
    name: 'Select',
    path: 'select',
    desc: 'Native select with an options array.',
  },
  {
    name: 'Checkbox',
    path: 'checkbox',
    desc: 'Single checkbox with row-layout label.',
  },
  { name: 'Date', path: 'date', desc: 'Native date picker.' },
  {
    name: 'FileUpload',
    path: 'fileupload',
    desc: 'Drag-and-drop file input with preview.',
  },
]

export const ComponentsOverview = () => {
  return (
    <>
      <h1>Components</h1>
      <p>
        Fields accept attributes for their rendered controls, plus
        <code>id</code> and <code>label</code>. File and tag values have the
        behavior described below.
      </p>
      <ul>
        {components.map((c) => (
          <li key={c.path}>
            <Link to={`/docs/components/${c.path}`}>
              <code>&lt;{c.name}&gt;</code>
            </Link>
            {' — '}
            {c.desc}
          </li>
        ))}
      </ul>
      <h2>Typed external forms</h2>
      <p>
        Create your own typed <code>useForm</code> methods and provide them with
        <code>FormProvider</code> or each field&apos;s <code>formProps</code>.
        Explicit methods take precedence over context. Your external form owns
        its resolver and submit handler. ARForm uses <code>FieldValues</code>;
        it does not infer schema types or check field names against them.
      </p>
      <h2>TagInput values</h2>
      <p>
        TagInput stores tags as a comma-separated string; a comma within one tag
        cannot be represented. It supports textbox and suggestions-only modes.
        Suggestions are trimmed and deduplicated using whitespace-insensitive,
        case-sensitive comparison. Selected equivalents disappear until removed.
      </p>
    </>
  )
}
