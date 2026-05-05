import { Link } from 'react-router-dom'

const components = [
  { name: 'ARForm', path: 'arform', desc: 'The form root. Owns the schema and submit handler.' },
  { name: 'Text', path: 'text', desc: 'Text input with optional prefix.' },
  { name: 'TextArea', path: 'textarea', desc: 'Multi-line text input.' },
  { name: 'Select', path: 'select', desc: 'Native select with an options array.' },
  { name: 'Checkbox', path: 'checkbox', desc: 'Single checkbox with row-layout label.' },
  { name: 'Date', path: 'date', desc: 'Native date picker.' },
  { name: 'FileUpload', path: 'fileupload', desc: 'Drag-and-drop file input with preview.' },
]

export const ComponentsOverview = () => {
  return (
    <>
      <h1>Components</h1>
      <p>All components accept the standard HTML attributes for their underlying element, plus <code>id</code> and <code>label</code>.</p>
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
    </>
  )
}
