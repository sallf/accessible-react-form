type Row = {
  label: string
  yup: string
  zod: string
  valibot: string
}

const rows: Row[] = [
  { label: 'Default', yup: 'optional', zod: 'required', valibot: 'required' },
  {
    label: 'Mark required',
    yup: '.required()',
    zod: '(default) + .min(1)',
    valibot: '(default) + v.minLength(1)',
  },
  {
    label: 'Mark optional',
    yup: '(default)',
    zod: '.optional()',
    valibot: 'v.optional(...)',
  },
  {
    label: 'Composition',
    yup: 'method chain',
    zod: 'method chain',
    valibot: 'pipe',
  },
]

export const SchemaPhilosophy = () => {
  return (
    <section className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
        <div className="max-w-2xl mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Why <code className="font-mono text-2xl sm:text-3xl px-1.5 py-0.5 rounded bg-bg-subtle">required</code> appears twice.
          </h2>
          <p className="text-fg-muted text-lg">
            You may notice fields declare <code className="font-mono text-sm px-1 py-0.5 rounded bg-bg-subtle">required</code> in
            both the schema and the JSX. They drive different things — and there's
            a real reason we don't try to derive one from the other.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="p-5 rounded-lg bg-bg-subtle border border-border">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">
              Schema
            </p>
            <p className="font-semibold mb-1">Owns validation.</p>
            <p className="text-sm text-fg-muted leading-relaxed">
              Will the form reject submission if this field is empty or malformed?
            </p>
          </div>
          <div className="p-5 rounded-lg bg-bg-subtle border border-border">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">
              required prop
            </p>
            <p className="font-semibold mb-1">Owns UI + accessibility.</p>
            <p className="text-sm text-fg-muted leading-relaxed">
              Does the label show a{' '}
              <code className="font-mono text-xs px-1 rounded bg-bg">*</code>? Does
              the input get{' '}
              <code className="font-mono text-xs px-1 rounded bg-bg">aria-required="true"</code>{' '}
              for screen readers?
            </p>
          </div>
        </div>

        <p className="text-fg-muted leading-relaxed mb-6 max-w-3xl">
          We could derive one from the other if every validator agreed on what
          "required" means. They don't. Each library has its own philosophy:
        </p>

        <div className="overflow-x-auto rounded-lg border border-border bg-bg-subtle/40 mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-medium text-fg-muted px-4 py-3"></th>
                <th className="text-left font-mono font-medium px-4 py-3">yup</th>
                <th className="text-left font-mono font-medium px-4 py-3">zod</th>
                <th className="text-left font-mono font-medium px-4 py-3">valibot</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i < rows.length - 1 ? 'border-b border-border' : ''}
                >
                  <td className="font-medium px-4 py-3 text-fg-muted">{row.label}</td>
                  <td className="font-mono px-4 py-3 text-xs">{row.yup}</td>
                  <td className="font-mono px-4 py-3 text-xs">{row.zod}</td>
                  <td className="font-mono px-4 py-3 text-xs">{row.valibot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-fg-muted leading-relaxed max-w-3xl">
          The{' '}
          <a
            href="https://standardschema.dev"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-fg-muted/40 hover:decoration-fg underline-offset-4"
          >
            Standard Schema
          </a>
          {' '}spec only standardizes{' '}
          <code className="font-mono text-xs px-1 py-0.5 rounded bg-bg-subtle">validate()</code> —
          not "describe my fields" — because the libraries genuinely disagree about
          what required means. So ARForm stays neutral: the schema is the source of
          truth for validation, and the prop is the source of truth for what the
          user sees and what assistive tech announces. Keep them in sync and the
          form behaves consistently across every validator.
        </p>
      </div>
    </section>
  )
}
