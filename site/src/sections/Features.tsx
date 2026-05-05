type Feature = {
  title: string
  body: string
  icon: React.ReactNode
}

const features: Feature[] = [
  {
    title: 'WCAG by default',
    body: 'Labels, errors, required states, and focus management are wired correctly the first time. Ship without an a11y audit follow-up.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
      </svg>
    ),
  },
  {
    title: 'Zero re-render cost',
    body: 'Built on react-hook-form. Uncontrolled inputs mean no re-rendering the entire form when one field changes.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: 'Yup validation',
    body: 'Schema-first validation. Define your shape once and get types, errors, and required-field hints for free.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
  },
  {
    title: 'Tiny API',
    body: 'One form component, one input per type. No render props, no controllers, no field-level boilerplate.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
]

export const Features = () => {
  return (
    <section className="border-t border-border bg-bg-subtle/40">
      <div className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Less code, fewer bugs.
          </h2>
          <p className="text-fg-muted text-lg">
            The pieces you'd build yourself anyway — already built, already accessible.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-lg bg-bg border border-border"
            >
              <div className="w-10 h-10 mb-4 rounded-md bg-accent/10 text-accent flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-fg-muted leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
