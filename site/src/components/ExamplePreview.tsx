import { useId, useState, type ReactNode, type KeyboardEvent } from 'react'
import { CodeBlock } from './CodeBlock'

export const ExamplePreview = ({
  children,
  source,
}: {
  children: ReactNode
  source: string
}) => {
  const [tab, setTab] = useState<'preview' | 'code'>('preview')
  const id = useId()
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next =
      event.key === 'Home'
        ? 'preview'
        : event.key === 'End'
          ? 'code'
          : tab === 'preview'
            ? 'code'
            : 'preview'
    setTab(next)
    document.getElementById(`${id}-${next}`)?.focus()
  }

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-bg-subtle">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <span className="text-xs text-fg-muted">Tailwind CSS</span>
        <div
          role="tablist"
          aria-label="Example view"
          className="flex gap-1 rounded-full bg-bg p-1"
        >
          {(['preview', 'code'] as const).map((value) => (
            <button
              key={value}
              id={`${id}-${value}`}
              type="button"
              role="tab"
              aria-selected={tab === value}
              aria-controls={`${id}-${value}-panel`}
              tabIndex={tab === value ? 0 : -1}
              onKeyDown={onKeyDown}
              onClick={() => setTab(value)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${tab === value ? 'bg-bg-subtle text-fg shadow-sm' : 'text-fg-muted hover:text-fg'}`}
            >
              {value === 'preview' ? 'Preview' : 'Code'}
            </button>
          ))}
        </div>
      </div>
      <div
        id={`${id}-preview-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-preview`}
        hidden={tab !== 'preview'}
      >
        <div className="flex min-h-80 items-center justify-center p-6 sm:p-12">
          {children}
        </div>
      </div>
      <div
        id={`${id}-code-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-code`}
        hidden={tab !== 'code'}
        tabIndex={0}
        className="min-w-0 p-4"
      >
        <CodeBlock code={source} />
      </div>
    </div>
  )
}
