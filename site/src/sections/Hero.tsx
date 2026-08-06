import { ARForm, Text, Select } from 'accessible-react-form'
import { object, string, type AnyObjectSchema } from 'yup'
import { useEffect, useRef, useState } from 'react'
import type { FieldValues } from 'react-hook-form'
import { CopyButton } from '../components/CopyButton'
import { CodeBlock } from '../components/CodeBlock'

const schema: AnyObjectSchema = object({
  name: string().required(),
  email: string().email().required(),
  plan: string(),
})

const installCmd = 'npm install accessible-react-form react-hook-form'

const demoCode = `<ARForm validationSchema={schema} onSubmit={save}>
  <Text id="name" label="Name" required />
  <Text id="email" label="Email" type="email" required />
  <Select
    id="plan"
    label="Plan"
    options={['Free', 'Pro', 'Team']}
  />
</ARForm>`

// Read live from the rendered DOM so the readout is the real thing the
// library emits — not a hand-written mock of it.
type FieldA11y = {
  id: string
  label: string
  required: boolean
  invalid: boolean
  describedby: string | null
  alerting: boolean
}

const readA11y = (root: HTMLElement): FieldA11y[] =>
  Array.from(root.querySelectorAll<HTMLElement>('[aria-invalid]')).map((el) => {
    const describedby = el.getAttribute('aria-describedby')
    const labelInner = el
      .closest('label')
      ?.querySelector('.arform__label-inner')
    // ARForm associates the label by wrapping the input, so the control
    // carries `name` (from register) rather than `id`; key off that.
    const name = el.getAttribute('name') ?? el.id
    return {
      id: name,
      label: (labelInner?.textContent ?? name).replace(/\*$/, '').trim(),
      required: el.getAttribute('aria-required') === 'true',
      invalid: el.getAttribute('aria-invalid') === 'true',
      describedby,
      alerting: describedby
        ? !!root.querySelector(`[id="${describedby}"][role="alert"]`)
        : false,
    }
  })

const chip =
  'inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[11px] leading-none border transition-colors'
const chipOn = `${chip} border-accent/30 bg-accent/10 text-accent`
const chipErr = `${chip} border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400`

export const Hero = () => {
  const [submitted, setSubmitted] = useState(false)
  const [fields, setFields] = useState<FieldA11y[]>([])
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = formRef.current
    if (!root) return
    const update = () => setFields(readA11y(root))
    update()
    const observer = new MutationObserver(update)
    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['aria-invalid', 'aria-describedby', 'aria-required'],
    })
    return () => observer.disconnect()
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <p className="text-xs font-mono text-accent mb-4 tracking-wider">
            ALPHA · v0.1.0
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
            Write the fields.{' '}
            <span className="text-fg-muted">
              The accessibility wires itself.
            </span>
          </h1>
          <p className="text-lg text-fg-muted mb-8 max-w-xl leading-relaxed">
            Declare your inputs and a schema — ARForm generates the labels,{' '}
            <code className="font-mono text-sm px-1 py-0.5 rounded bg-bg-subtle">
              aria-*
            </code>{' '}
            wiring, focus management, and screen-reader error announcements.
            WCAG-compliant by default, built on{' '}
            <code className="font-mono text-sm px-1 py-0.5 rounded bg-bg-subtle">
              react-hook-form
            </code>
            , with any{' '}
            <a
              href="https://standardschema.dev"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-fg-muted/40 hover:decoration-fg underline-offset-4"
            >
              Standard Schema
            </a>{' '}
            validator —{' '}
            <code className="font-mono text-sm px-1 py-0.5 rounded bg-bg-subtle">
              yup
            </code>
            ,{' '}
            <code className="font-mono text-sm px-1 py-0.5 rounded bg-bg-subtle">
              zod
            </code>
            ,{' '}
            <code className="font-mono text-sm px-1 py-0.5 rounded bg-bg-subtle">
              valibot
            </code>
            ,{' '}
            <code className="font-mono text-sm px-1 py-0.5 rounded bg-bg-subtle">
              arktype
            </code>
            .
          </p>

          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-bg-subtle border border-border mb-4">
            <code className="font-mono text-xs sm:text-sm text-fg overflow-x-auto whitespace-nowrap">
              <span className="text-fg-muted select-none">$ </span>
              {installCmd}
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
              href="https://github.com/sallf/accessible-react-form"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-md border border-border font-medium hover:bg-bg-subtle transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* X-ray demo: your code → the live form → the a11y it wired */}
        <div className="relative">
          <div
            className="absolute -inset-1 bg-gradient-to-br from-accent/20 to-transparent rounded-xl blur-xl pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative rounded-xl bg-bg-subtle border border-border shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-4">
              <p className="text-xs font-mono text-fg-muted mb-3 uppercase tracking-wider">
                You write
              </p>
              <CodeBlock code={demoCode} lang="tsx" />
            </div>

            <div className="flex items-center gap-3 px-5 text-fg-muted">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-mono">renders ↓</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="px-5 py-5" ref={formRef}>
              <ARForm
                validationSchema={schema}
                onSubmit={(_data: FieldValues) => setSubmitted(true)}
                onChangeCallback={() => setSubmitted(false)}
              >
                <Text id="name" label="Name" required />
                <Text id="email" label="Email" type="email" required />
                <Select
                  id="plan"
                  label="Plan"
                  options={['Free', 'Pro', 'Team']}
                />
              </ARForm>
              {submitted ? (
                <div
                  role="status"
                  className="mt-3 text-sm text-accent font-medium"
                >
                  ✓ Submitted — valid and accessible.
                </div>
              ) : (
                <p className="mt-3 text-xs text-fg-muted">
                  Tip: submit empty — the required fields flip{' '}
                  <code className="font-mono">aria-invalid</code>, the optional{' '}
                  <span className="font-medium text-fg">Plan</span> stays calm.
                </p>
              )}
            </div>

            <div className="border-t border-border bg-bg/50 px-5 py-4">
              <p className="text-xs font-mono text-fg-muted mb-3 uppercase tracking-wider">
                You get{' '}
                <span className="normal-case tracking-normal text-fg-muted/70">
                  · read live from the rendered DOM
                </span>
              </p>
              <div className="flex flex-col gap-2">
                {fields.map((f) => (
                  <div
                    key={f.id}
                    className="flex flex-wrap items-center gap-1.5"
                  >
                    <span className="text-xs font-medium text-fg w-12 shrink-0">
                      {f.label}
                    </span>
                    {f.required && (
                      <span className={chipOn}>aria-required</span>
                    )}
                    <span className={f.invalid ? chipErr : chipOn}>
                      aria-invalid=&quot;{String(f.invalid)}&quot;
                    </span>
                    {f.describedby && (
                      <span className={chipErr}>aria-describedby</span>
                    )}
                    {f.alerting && (
                      <span className={chipErr}>role=&quot;alert&quot;</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <a
              href="#comparison"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
            >
              See how it compares to other libraries
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
