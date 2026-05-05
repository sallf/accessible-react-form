import { CodeBlock } from '../../../components/CodeBlock'

export const Validation = () => {
  return (
    <>
      <h1>Validation schemas</h1>
      <p>
        The library accepts any{' '}
        <a href="https://standardschema.dev" target="_blank" rel="noreferrer">
          Standard Schema
        </a>{' '}
        validator. The <code>&lt;ARForm&gt;</code> JSX is identical regardless of which one you choose — only the schema changes.
      </p>

      <h2>yup</h2>
      <CodeBlock
        code={`import { object, string } from 'yup'

const schema = object({
  name: string().required(),
  email: string().email(),
})`}
      />

      <h2>zod</h2>
      <CodeBlock
        code={`import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  email: z.email().optional().or(z.literal('')),
})`}
      />

      <h2>valibot</h2>
      <CodeBlock
        code={`import * as v from 'valibot'

const schema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
  email: v.optional(v.union([v.pipe(v.string(), v.email()), v.literal('')])),
})`}
      />

      <h2>Why <code>required</code> appears twice</h2>
      <p>
        The schema controls validation; the <code>required</code> prop controls UI and accessibility (the <code>*</code> in the label and <code>aria-required</code> on the input). Each schema library expresses "required" differently, so there's no single introspection API that works across all of them — keep them in sync manually.
      </p>
    </>
  )
}
