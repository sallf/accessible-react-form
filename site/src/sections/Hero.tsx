import { ARForm, Text } from 'accessible-react-form'
import { object, string, type AnyObjectSchema } from 'yup'
import { useState } from 'react'
import type { FieldValues } from 'react-hook-form'
import { CopyButton } from '../components/CopyButton'

type HeroValues = { name: string; email: string }

const schema: AnyObjectSchema = object({
  name: string().required(),
  email: string().email().required(),
})

const installCmd = 'npm install accessible-react-form react-hook-form'

export const Hero = () => {
  const [submitted, setSubmitted] = useState<HeroValues | null>(null)

  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <p className="text-xs font-mono text-accent mb-4 tracking-wider">
            ALPHA · v0.1.0
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
            Everything modern form libraries do —{' '}
            <span className="text-fg-muted">
              minus the boilerplate, plus accessibility built in.
            </span>
          </h1>
          <p className="text-lg text-fg-muted mb-8 max-w-xl leading-relaxed">
            A minimal React form library built on{' '}
            <code className="font-mono text-sm px-1 py-0.5 rounded bg-bg-subtle">react-hook-form</code>.
            WCAG-compliant by default. No ARIA wiring required. Bring any{' '}
            <a
              href="https://standardschema.dev"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-fg-muted/40 hover:decoration-fg underline-offset-4"
            >
              Standard Schema
            </a>
            {' '}validator —{' '}
            <code className="font-mono text-sm px-1 py-0.5 rounded bg-bg-subtle">yup</code>,{' '}
            <code className="font-mono text-sm px-1 py-0.5 rounded bg-bg-subtle">zod</code>,{' '}
            <code className="font-mono text-sm px-1 py-0.5 rounded bg-bg-subtle">valibot</code>,{' '}
            <code className="font-mono text-sm px-1 py-0.5 rounded bg-bg-subtle">arktype</code>.
          </p>

          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-bg-subtle border border-border mb-4">
            <code className="font-mono text-xs sm:text-sm text-fg overflow-x-auto whitespace-nowrap">
              <span className="text-fg-muted select-none">$ </span>{installCmd}
            </code>
            <CopyButton text={installCmd} />
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#components"
              className="px-4 py-2 rounded-md bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
            >
              View components
            </a>
            <a
              href="https://github.com/adam-rho/accessible-react-form"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-md border border-border font-medium hover:bg-bg-subtle transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-br from-accent/20 to-transparent rounded-xl blur-xl" aria-hidden="true" />
          <div className="relative p-6 sm:p-8 rounded-xl bg-bg-subtle border border-border shadow-sm">
            <p className="text-xs font-mono text-fg-muted mb-4 uppercase tracking-wider">
              Try it
            </p>
            <ARForm
              validationSchema={schema}
              onSubmit={(data: FieldValues) => setSubmitted(data as HeroValues)}
            >
              <Text id="name" label="Name" />
              <Text id="email" label="Email" />
            </ARForm>
            {submitted && (
              <div
                role="status"
                className="mt-4 p-3 rounded-md bg-accent/10 border border-accent/30 text-sm"
              >
                Submitted: <span className="font-mono">{submitted.name}</span> ·{' '}
                <span className="font-mono">{submitted.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
