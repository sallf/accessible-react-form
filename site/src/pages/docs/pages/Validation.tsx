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
        validator. The <code>&lt;ARForm&gt;</code> JSX is identical regardless
        of which one you choose — only the schema changes.
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

      <h2>
        Why <code>required</code> appears twice
      </h2>
      <p>
        The schema controls validation; the <code>required</code> prop controls
        UI and accessibility (the <code>*</code> in the label and{' '}
        <code>aria-required</code> on the input). Each schema library expresses
        &quot;required&quot; differently, so there&apos;s no single
        introspection API that works across all of them — keep them in sync
        manually.
      </p>
      <p>
        With a schema, the resolver determines whether submission succeeds and
        supplies the transformed values to <code>onSubmit</code>. Registered
        field rules do not add validation alongside the resolver.
      </p>
      <h2>Without a schema</h2>
      <p>
        Without <code>validationSchema</code>, <code>required</code> uses React
        Hook Form validation. Empty values and unchecked required checkboxes
        block submission; optional fields remain optional and disabled fields
        skip this validation. Text is not trimmed before this check.
      </p>
      <p>
        Forwarded attributes such as <code>minLength</code> are not registered
        validation rules. Put those rules in your schema or external form
        registration. Native browser constraints may also affect submission; use{' '}
        <code>noValidate</code> when your form should rely on its resolver.
      </p>
      <h2>Nested fields and form-wide errors</h2>
      <p>
        Use paths such as <code>profile.name</code> or <code>items.0.name</code>
        as field ids. Matching nested errors appear at the control. Pathless
        issues, unsupported paths, and parent issues that overlap child issues
        appear in the form-wide alert and still block submission.
      </p>
      <p>
        A required error without a usable message displays &quot;This field is
        required&quot;; other errors display &quot;Please check this
        field&quot;. Nonblank messages are preserved.
      </p>
    </>
  )
}
