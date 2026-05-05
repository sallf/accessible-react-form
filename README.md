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

## Styling

The library ships **completely unstyled**. Every element gets a stable `arform__*` class hook so you can style globally from your own CSS, and stateful elements expose state via attributes you can target with attribute selectors.

### Per-form / per-field styling

`<ARForm>` and every input component forward `className` and `style` to the underlying DOM element, so you can style a single instance directly:

```tsx
<ARForm className="checkout-form" style={{ maxWidth: 480 }} onSubmit={...}>
  <Text id="email" label="Email" className="checkout-form__email" />
</ARForm>
```

For wrapping markup (e.g., a custom row layout), wrap the input in your own element:

```tsx
<div className="my-row">
  <Text id="first" label="First" />
  <Text id="last" label="Last" />
</div>
```

### Global styling

Target the `arform__*` classes from your global stylesheet:

```css
.arform__input,
.arform__select,
.arform__textarea {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem;
}

.arform__label-required { color: crimson; }
.arform__error { color: crimson; font-size: 0.875rem; }
```

#### Class hooks

| Class | Element | Notes |
|---|---|---|
| `arform` | `<form>` | Root form element |
| `arform__submit` | `<input type="submit">` | Default submit button |
| `arform__error` | error `<div role="alert">` | Field-level error message |
| `arform__label` | `<label>` | Wraps every input |
| `arform__label-inner` | `<div>` inside label | Holds label text + required mark |
| `arform__label-required` | `<span>` | The `*` for required fields |
| `arform__input` | `<input>` | Base class on all inputs |
| `arform__text` | `<input type="text">` | |
| `arform__date` | `<input type="date">` | |
| `arform__checkbox` | `<input type="checkbox">` | |
| `arform__select` | `<select>` | |
| `arform__textarea` | `<textarea>` | |
| `arform__upload` | file `<input>` | |
| `arform__upload-wrapper` | `<div>` | Drop target around file input |
| `arform__upload-preview` | `<img>` | Image preview for `fileType="media"` |
| `arform__upload-preview-label` | `<span>` | Filename preview for `fileType="binary"` |
| `arform__upload-text` | `<span>` | "Drag and drop…" prompt |
| `arform__upload-button` | `<span>` | "Choose File" / "Change File" |
| `arform__prefix` | `<span>` | Wraps inputs with a `prefix` |
| `arform__prefix-inner` | `<span>` | Holds the prefix text |
| `arform__prefix-input` | `<span>` | Holds the input itself |

#### State attributes

State lives on attributes rather than modifier classes — pair them with the class hook above to scope each rule:

| Selector | Meaning |
|---|---|
| `.arform__input[aria-invalid="true"]` | Field has a validation error |
| `.arform__input[aria-required="true"]` | Field is marked required (UI/a11y) |
| `.arform__input:disabled` | Native `disabled` attribute set |
| `.arform__input[data-arform-has-prefix]` | Input is rendered with a `prefix` |
| `.arform__label[data-arform-row]` | Label uses a row layout (e.g., checkbox) |
| `.arform__upload-wrapper[data-arform-active]` | File is being dragged over the drop target |

`aria-invalid` and `aria-required` work as CSS selectors and double as the accessibility hooks — no separate `data-*` is needed for them. Same for native `:disabled`.

```css
.arform__input[aria-invalid="true"] { border-color: crimson; }
.arform__upload-wrapper[data-arform-active] { background: #eef; }
```

### Tailwind CSS

Tailwind plays nicely with the library — utility classes coexist with the `arform__*` hooks. Three patterns, in order of how most Tailwind users will reach for them:

**1. Per-instance utilities via `className`**

```tsx
<ARForm className="space-y-4 max-w-md" onSubmit={onSubmit}>
  <Text
    id="email"
    label="Email"
    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none aria-invalid:border-red-500"
  />
</ARForm>
```

Tailwind v3.1+ ships an `aria-invalid:` variant; older versions can use the arbitrary variant `[&[aria-invalid="true"]]:border-red-500`.

**2. Wrapping div for layout the library doesn't render**

```tsx
<ARForm onSubmit={onSubmit}>
  <div className="grid grid-cols-2 gap-4">
    <Text id="first" label="First name" className="w-full rounded border px-3 py-2" />
    <Text id="last" label="Last name" className="w-full rounded border px-3 py-2" />
  </div>
</ARForm>
```

**3. Global theme via `@apply` on the class hooks**

Define the look once in your global stylesheet and every `<ARForm>` inherits it:

```css
@layer components {
  .arform__input,
  .arform__select,
  .arform__textarea {
    @apply w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none;
  }
  .arform__input[aria-invalid="true"],
  .arform__select[aria-invalid="true"],
  .arform__textarea[aria-invalid="true"] {
    @apply border-red-500;
  }
  .arform__label { @apply block text-sm font-medium text-gray-700; }
  .arform__label[data-arform-row] { @apply flex items-center gap-2; }
  .arform__label-required { @apply text-red-500; }
  .arform__error { @apply mt-1 text-sm text-red-600; }
}
```

If you're using Tailwind's content scanner, make sure your config includes the files where you write these utilities — the `arform__*` strings come from this library and don't need to be listed.

## Examples

See `src/stories` for runnable examples covering each component, validation states, and all three schema validators.

## License

MIT
