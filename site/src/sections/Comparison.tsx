import { useState } from 'react'
import { CodeBlock } from '../components/CodeBlock'

type Variant = {
  id: string
  name: string
  tagline: string
  code: string
}

const arformCode = `import { ARForm, Text } from 'accessible-react-form'
import { object, string } from 'yup'

const schema = object({
  name: string().required(),
  email: string().email().required(),
})

export const SignupForm = ({ onSubmit }) => (
  <ARForm validationSchema={schema} onSubmit={onSubmit}>
    <Text id="name" label="Name" required />
    <Text id="email" label="Email" required />
  </ARForm>
)`

const rhfCode = `import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'

const schema = object({
  name: string().required(),
  email: string().email().required(),
})

export const SignupForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="name">
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="name"
          type="text"
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name')}
        />
        {errors.name && (
          <p id="name-error" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email">
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          type="email"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  )
}`

const tanstackCode = `import { useForm } from '@tanstack/react-form'
import { object, string } from 'yup'

const schema = object({
  name: string().required(),
  email: string().email().required(),
})

export const SignupForm = ({ onSubmit }) => {
  const form = useForm({
    defaultValues: { name: '', email: '' },
    validators: { onChange: schema },
    onSubmit: ({ value }) => onSubmit(value),
  })

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field name="name">
        {(field) => {
          const error = field.state.meta.errors[0]
          const message = error?.message ?? error
          return (
            <div>
              <label htmlFor={field.name}>
                Name <span aria-hidden="true">*</span>
              </label>
              <input
                id={field.name}
                name={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? \`\${field.name}-error\` : undefined}
              />
              {error && (
                <p id={\`\${field.name}-error\`} role="alert">
                  {message}
                </p>
              )}
            </div>
          )
        }}
      </form.Field>

      <form.Field name="email">
        {(field) => {
          const error = field.state.meta.errors[0]
          const message = error?.message ?? error
          return (
            <div>
              <label htmlFor={field.name}>
                Email <span aria-hidden="true">*</span>
              </label>
              <input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? \`\${field.name}-error\` : undefined}
              />
              {error && (
                <p id={\`\${field.name}-error\`} role="alert">
                  {message}
                </p>
              )}
            </div>
          )
        }}
      </form.Field>

      <button type="submit">Submit</button>
    </form>
  )
}`

const formikCode = `import { Formik, Form, Field, ErrorMessage } from 'formik'
import { object, string } from 'yup'

const schema = object({
  name: string().required(),
  email: string().email().required(),
})

export const SignupForm = ({ onSubmit }) => (
  <Formik
    initialValues={{ name: '', email: '' }}
    validationSchema={schema}
    onSubmit={onSubmit}
  >
    {({ errors, touched }) => (
      <Form noValidate>
        <div>
          <label htmlFor="name">
            Name <span aria-hidden="true">*</span>
          </label>
          <Field
            id="name"
            name="name"
            type="text"
            aria-required="true"
            aria-invalid={!!(errors.name && touched.name)}
            aria-describedby={
              errors.name && touched.name ? 'name-error' : undefined
            }
          />
          <ErrorMessage name="name">
            {(msg) => (
              <p id="name-error" role="alert">
                {msg}
              </p>
            )}
          </ErrorMessage>
        </div>

        <div>
          <label htmlFor="email">
            Email <span aria-hidden="true">*</span>
          </label>
          <Field
            id="email"
            name="email"
            type="email"
            aria-required="true"
            aria-invalid={!!(errors.email && touched.email)}
            aria-describedby={
              errors.email && touched.email ? 'email-error' : undefined
            }
          />
          <ErrorMessage name="email">
            {(msg) => (
              <p id="email-error" role="alert">
                {msg}
              </p>
            )}
          </ErrorMessage>
        </div>

        <button type="submit">Submit</button>
      </Form>
    )}
  </Formik>
)`

const variants: Variant[] = [
  {
    id: 'arform',
    name: 'accessible-react-form',
    tagline: 'a11y wired internally',
    code: arformCode,
  },
  {
    id: 'rhf',
    name: 'raw react-hook-form',
    tagline: 'manual ARIA + error wiring',
    code: rhfCode,
  },
  {
    id: 'tanstack',
    name: 'TanStack Form',
    tagline: 'render-prop fields + ARIA',
    code: tanstackCode,
  },
  {
    id: 'formik',
    name: 'Formik',
    tagline: 'verbose render props + ARIA',
    code: formikCode,
  },
]

const lineCount = (code: string) => code.split('\n').length

export const Comparison = () => {
  const [activeId, setActiveId] = useState(variants[0].id)
  const active = variants.find((v) => v.id === activeId)!
  const baseline = lineCount(arformCode)

  return (
    <section id="comparison" className="border-t border-border bg-bg-subtle/40">
      <div className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Modern form libraries didn't fix this.
          </h2>
          <p className="text-fg-muted text-lg">
            Same form, same accessibility, four implementations. Only one stays
            small.
          </p>
        </div>

        <div role="tablist" aria-label="Library" className="flex flex-wrap gap-2 mb-6">
          {variants.map((v) => {
            const lc = lineCount(v.code)
            const delta = lc - baseline
            return (
              <button
                key={v.id}
                role="tab"
                aria-selected={activeId === v.id}
                aria-controls={`compare-panel-${v.id}`}
                id={`compare-tab-${v.id}`}
                type="button"
                onClick={() => setActiveId(v.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors flex items-center gap-2 ${
                  activeId === v.id
                    ? 'bg-accent text-white border-accent'
                    : 'border-border text-fg-muted hover:text-fg hover:bg-bg-subtle'
                }`}
              >
                <span>{v.name}</span>
                <span
                  className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                    activeId === v.id
                      ? 'bg-white/20'
                      : 'bg-bg-subtle border border-border'
                  }`}
                >
                  {lc} {lc === 1 ? 'line' : 'lines'}
                  {delta > 0 && <span className="ml-1 opacity-70">(+{delta})</span>}
                </span>
              </button>
            )
          })}
        </div>

        <div
          role="tabpanel"
          id={`compare-panel-${active.id}`}
          aria-labelledby={`compare-tab-${active.id}`}
        >
          <p className="text-sm text-fg-muted mb-3 font-mono">
            <span className="text-fg">{active.name}</span> — {active.tagline}
          </p>
          <CodeBlock code={active.code} lang="tsx" />
        </div>

        <p className="mt-8 text-sm text-fg-muted max-w-3xl leading-relaxed">
          <strong className="text-fg">Every form library leaves a11y to you.</strong>{' '}
          The labels, the <code className="font-mono text-xs px-1 py-0.5 rounded bg-bg-subtle">aria-required</code>,
          the <code className="font-mono text-xs px-1 py-0.5 rounded bg-bg-subtle">aria-invalid</code>,
          the <code className="font-mono text-xs px-1 py-0.5 rounded bg-bg-subtle">aria-describedby</code>,
          the <code className="font-mono text-xs px-1 py-0.5 rounded bg-bg-subtle">role="alert"</code> —
          you write it per field, every time, in every library above. ARForm
          does it once, at the framework level, so your form code is just your
          form.
        </p>
        <p className="mt-3 text-sm text-fg-muted max-w-3xl leading-relaxed">
          All four examples use yup for an apples-to-apples comparison. ARForm
          accepts any{' '}
          <a
            href="https://standardschema.dev"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-fg-muted/40 hover:decoration-fg underline-offset-4"
          >
            Standard Schema
          </a>
          {' '}validator — swap yup for zod, valibot, or arktype with no API change.
        </p>
      </div>
    </section>
  )
}
