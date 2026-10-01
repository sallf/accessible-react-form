import { useId, useState, type ComponentType, type KeyboardEvent } from 'react'
import { CodeBlock } from '../components/CodeBlock'
import { Link } from 'react-router-dom'

type SchemaLib = 'yup' | 'zod' | 'valibot'
type ExampleModule = { default: ComponentType }

// Vite reads the same source files as modules for previews and text for CodeBlock.
const modules = import.meta.glob<ExampleModule>('../examples/showcase/*.tsx', {
  eager: true,
})
const sources = import.meta.glob<string>('../examples/showcase/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const demos = [
  { id: 'text', name: 'Text' },
  { id: 'checkbox', name: 'Checkbox' },
  { id: 'date', name: 'Date' },
  { id: 'select', name: 'Select' },
  { id: 'textarea', name: 'TextArea' },
  { id: 'file', name: 'FileUpload' },
  { id: 'tag', name: 'TagInput' },
]

const schemaLibs: { id: SchemaLib; name: string }[] = [
  { id: 'yup', name: 'yup' },
  { id: 'zod', name: 'zod' },
  { id: 'valibot', name: 'valibot' },
]

const moveSelection = <T extends string>(
  event: KeyboardEvent<HTMLButtonElement>,
  items: { id: T }[],
  current: T,
  select: (value: T) => void,
  radio = false
) => {
  const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (radio) keys.push('ArrowUp', 'ArrowDown')
  if (!keys.includes(event.key)) return
  event.preventDefault()
  const currentIndex = items.findIndex((item) => item.id === current)
  const nextIndex =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? items.length - 1
        : (currentIndex +
            (['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1) +
            items.length) %
          items.length
  select(items[nextIndex].id)
  event.currentTarget.parentElement
    ?.querySelectorAll<HTMLButtonElement>('button')
    [nextIndex]?.focus()
}

export const Components = () => {
  const [activeId, setActiveId] = useState(demos[0].id)
  const [schemaLib, setSchemaLib] = useState<SchemaLib>('yup')
  const panelId = useId()
  const active = demos.find((d) => d.id === activeId)!
  const examplePath = `../examples/showcase/${active.id}.${schemaLib}.tsx`
  const Example = modules[examplePath]?.default
  const source = sources[examplePath]

  return (
    <section id="components" className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Every input you need.
          </h2>
          <p className="text-fg-muted text-lg">
            Drop them into{' '}
            <code className="font-mono text-sm px-1 py-0.5 rounded bg-bg-subtle">
              &lt;ARForm&gt;
            </code>
            . They wire themselves up — with whatever schema validator you
            prefer.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div
            role="tablist"
            aria-label="Components"
            className="flex flex-wrap gap-2"
          >
            {demos.map((d) => (
              <button
                key={d.id}
                role="tab"
                aria-selected={activeId === d.id}
                aria-controls={panelId}
                tabIndex={activeId === d.id ? 0 : -1}
                id={`tab-${d.id}`}
                type="button"
                onClick={() => setActiveId(d.id)}
                onKeyDown={(event) =>
                  moveSelection(event, demos, activeId, setActiveId)
                }
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
            <span className="text-xs text-fg-muted px-2 hidden sm:inline">
              Schema:
            </span>
            {schemaLibs.map((s) => (
              <button
                key={s.id}
                role="radio"
                aria-checked={schemaLib === s.id}
                tabIndex={schemaLib === s.id ? 0 : -1}
                type="button"
                onClick={() => setSchemaLib(s.id)}
                onKeyDown={(event) =>
                  moveSelection(
                    event,
                    schemaLibs,
                    schemaLib,
                    setSchemaLib,
                    true
                  )
                }
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
          id={panelId}
          aria-labelledby={`tab-${active.id}`}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
        >
          <div className="p-6 rounded-lg bg-bg-subtle border border-border min-h-[200px]">
            <p className="text-xs font-mono text-fg-muted mb-4 uppercase tracking-wider">
              Preview
            </p>
            {Example && <Example key={examplePath} />}
          </div>
          <div>
            <p className="text-xs font-mono text-fg-muted mb-4 uppercase tracking-wider">
              Code <span className="text-fg-muted/60">· {schemaLib}</span>
            </p>
            <CodeBlock key={examplePath} code={source ?? ''} lang="tsx" />
            <p className="mt-3 text-sm text-fg-muted">
              The preview uses the Tailwind classes shown above. Add Tailwind to
              your app to use them.{' '}
              <Link to="/docs/styling" className="text-accent underline">
                Read the styling guide
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
