import { useState } from 'react'
import { CodeBlock } from '../components/CodeBlock'
import { libraries, scenarios, lineCount } from './comparisonData'

export const Comparison = () => {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id)
  const [libraryId, setLibraryId] = useState(libraries[0].id)

  const scenario = scenarios.find((s) => s.id === scenarioId)!
  const library = libraries.find((l) => l.id === libraryId)!
  const baseline = lineCount(scenario.code.arform)
  const activeLines = lineCount(scenario.code[libraryId])
  const activeDelta = activeLines - baseline

  return (
    <section id="comparison" className="border-t border-border bg-bg-subtle/40">
      <div className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Pick a form. Watch the line count.
          </h2>
          <p className="text-fg-muted text-lg">
            The same common forms, with the same accessibility, in four
            libraries. Only one stays small — no matter how big the form gets.
          </p>
        </div>

        {/* Scenario selector */}
        <div
          role="group"
          aria-label="Form example"
          className="flex flex-wrap gap-2 mb-4"
        >
          {scenarios.map((s) => {
            const active = s.id === scenarioId
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={active}
                onClick={() => setScenarioId(s.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  active
                    ? 'bg-fg text-bg border-fg'
                    : 'border-border text-fg-muted hover:text-fg hover:bg-bg-subtle'
                }`}
              >
                {s.name}
              </button>
            )
          })}
        </div>

        <p className="text-fg-muted text-sm mb-6">{scenario.blurb}</p>

        {/* Library selector */}
        <div
          role="tablist"
          aria-label="Library"
          className="flex flex-wrap gap-2 mb-6"
        >
          {libraries.map((v) => {
            const lc = lineCount(scenario.code[v.id])
            const delta = lc - baseline
            const active = libraryId === v.id
            return (
              <button
                key={v.id}
                role="tab"
                aria-selected={active}
                aria-controls={`compare-panel-${v.id}`}
                id={`compare-tab-${v.id}`}
                type="button"
                onClick={() => setLibraryId(v.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors flex items-center gap-2 ${
                  active
                    ? 'bg-accent text-white border-accent'
                    : 'border-border text-fg-muted hover:text-fg hover:bg-bg-subtle'
                }`}
              >
                <span>{v.name}</span>
                <span
                  className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                    active ? 'bg-white/20' : 'bg-bg-subtle border border-border'
                  }`}
                >
                  {lc} {lc === 1 ? 'line' : 'lines'}
                  {delta > 0 && (
                    <span className="ml-1 opacity-70">(+{delta})</span>
                  )}
                </span>
              </button>
            )
          })}
        </div>

        <div
          role="tabpanel"
          id={`compare-panel-${library.id}`}
          aria-labelledby={`compare-tab-${library.id}`}
        >
          <p className="text-sm text-fg-muted mb-3 font-mono">
            <span className="text-fg">{library.name}</span> — {library.tagline}
            {activeDelta > 0 && (
              <span className="text-fg-muted">
                {' '}
                · {activeDelta} more lines than ARForm
              </span>
            )}
          </p>
          <CodeBlock code={scenario.code[library.id]} lang="tsx" />
        </div>

        <p className="mt-8 text-sm text-fg-muted max-w-3xl leading-relaxed">
          <strong className="text-fg">
            Every form library leaves a11y to you.
          </strong>{' '}
          The labels, the{' '}
          <code className="font-mono text-xs px-1 py-0.5 rounded bg-bg-subtle">
            aria-required
          </code>
          , the{' '}
          <code className="font-mono text-xs px-1 py-0.5 rounded bg-bg-subtle">
            aria-invalid
          </code>
          , the{' '}
          <code className="font-mono text-xs px-1 py-0.5 rounded bg-bg-subtle">
            aria-describedby
          </code>
          , the{' '}
          <code className="font-mono text-xs px-1 py-0.5 rounded bg-bg-subtle">
            role=&quot;alert&quot;
          </code>{' '}
          — you write it per field, every time, in every library above. That
          cost compounds with every field you add; ARForm does it once, at the
          framework level, so your form code stays just your form.
        </p>
        <p className="mt-3 text-sm text-fg-muted max-w-3xl leading-relaxed">
          All examples use yup for an apples-to-apples comparison. ARForm
          accepts any{' '}
          <a
            href="https://standardschema.dev"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-fg-muted/40 hover:decoration-fg underline-offset-4"
          >
            Standard Schema
          </a>{' '}
          validator — swap yup for zod, valibot, or arktype with no API change.
        </p>
      </div>
    </section>
  )
}
