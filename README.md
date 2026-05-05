# Accessible React Form

A minimal, accessible React form library. Built on [react-hook-form](https://react-hook-form.com/) for performance, with first-class support for any [Standard Schema](https://standardschema.dev) validator — yup, zod, valibot, arktype, or any other compliant library.

WCAG-compliant by default. No ARIA wiring required.

## Install

```sh
npm install accessible-react-form react-hook-form
```

Plus your validator of choice:

```sh
npm install yup       # or
npm install zod       # or
npm install valibot   # or any Standard Schema validator
```

## Basic Form

```tsx
import { ARForm, Text } from 'accessible-react-form'
import { object, string } from 'yup'

const schema = object({
  name: string().required(),
  email: string().email(),
})

<ARForm validationSchema={schema} onSubmit={onSubmit}>
  <Text id="name" label="Name" required />
  <Text id="email" label="Email" />
</ARForm>
```

The same form with zod:

```tsx
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  email: z.email().optional().or(z.literal('')),
})
```

Or valibot:

```tsx
import * as v from 'valibot'

const schema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
  email: v.optional(v.union([v.pipe(v.string(), v.email()), v.literal('')])),
})
```

The `<ARForm>` JSX is identical regardless of which validator you chose.

## Why `required` is set in two places

You'll notice the field above declares `required` *both* in the schema and as a prop on `<Text>`. They drive different things:

- **Schema** owns **validation** — will the form reject submission?
- **`required` prop** owns **UI + a11y** — does the label show a `*`? Does the input get `aria-required="true"`?

It would be nice to derive one from the other, but each schema library expresses "required" differently:

| | yup | zod | valibot |
|---|---|---|---|
| Default | optional | required | required |
| Mark required | `.required()` | (default) + `.min(1)` | (default) + `v.minLength(1)` |
| Mark optional | (default) | `.optional()` | `v.optional(...)` |
| Style | method chain | method chain | pipe composition |

There's no single introspection API that works across all of them — the [Standard Schema](https://standardschema.dev) spec only standardizes `validate()`, not "describe my fields," because the libraries genuinely disagree about what required means.

So `<ARForm>` stays neutral: the schema is the source of truth for *validation*, and the `required` prop is the source of truth for *what the user sees and what assistive tech announces*. Keep them in sync and the form behaves consistently.

## Components

- `<Text>` — text input (with optional `prefix`)
- `<TextArea>`
- `<Select>` — `options` array
- `<Checkbox>`
- `<Date>`
- `<FileUpload>` — `fileType` prop
- `<TagInput>`

All accept the standard HTML attributes for their underlying element (`required`, `minLength`, `maxLength`, etc.) plus `id` and `label`.

## Examples

See `src/stories` for runnable examples covering each component, validation states, and all three schema validators.

## License

MIT
