# Accessible React Form

[![npm version](https://img.shields.io/npm/v/accessible-react-form)](https://www.npmjs.com/package/accessible-react-form)
[![CI](https://github.com/sallf/accessible-react-form/actions/workflows/ci.yml/badge.svg)](https://github.com/sallf/accessible-react-form/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/accessible-react-form)](./LICENSE)

**[Docs & live demos](https://ar-form-sallf.netlify.app)** · **[Storybook](https://ar-form-sallf.netlify.app/storybook/)**

Copy the [contact form recipe](https://ar-form-sallf.netlify.app/docs/recipes/contact) for a complete Tailwind form with validation and reusable fields.

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

You'll notice the field above declares `required` _both_ in the schema and as a prop on `<Text>`. They drive different things:

- With a schema, the schema determines whether submission succeeds. A `required` prop does not override a schema that allows an empty value.
- The `required` prop marks the field visually and announces its required state to assistive technology.

It would be nice to derive one from the other, but each schema library expresses "required" differently:

|               | yup           | zod                   | valibot                      |
| ------------- | ------------- | --------------------- | ---------------------------- |
| Default       | optional      | required              | required                     |
| Mark required | `.required()` | (default) + `.min(1)` | (default) + `v.minLength(1)` |
| Mark optional | (default)     | `.optional()`         | `v.optional(...)`            |
| Style         | method chain  | method chain          | pipe composition             |

There's no single introspection API that works across all of them — the [Standard Schema](https://standardschema.dev) spec only standardizes `validate()`, not "describe my fields," because the libraries genuinely disagree about what required means.

With a schema, keep its rules and the `required` props in sync.

Without `validationSchema`, `required` uses React Hook Form's required validation across all controls, including Select, TextArea, and both TagInput modes. Empty values and unchecked required checkboxes block submission. Optional fields remain optional; disabled fields skip this validation. Text values use React Hook Form's semantics without added whitespace trimming.

Fields with errors expose invalid state and associated feedback alongside any consumer help text. Errors without a usable message display `This field is required` for required errors or `Please check this field` for other errors. Nonblank validation messages are preserved.

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

The library ships **no CSS** and works with native browser styling. Use the `arform__*` hooks for your own styles. State attributes let you target invalid, required, and disabled controls. The library adds no Tailwind classes; your own utility classes and CSS Modules classes pass through unchanged.

Each field has a block `arform__field` container, so fields start on separate lines even without CSS. Checkboxes stay with their labels. Apply layout rules to these containers when building a grid or adding spacing.

Only the internal submit control and screen-reader text use inline hiding styles. Add your own visible submit button when the form needs one. The internal control supports Enter submission and is skipped by Tab navigation.

### Per-form / per-field styling

`<ARForm>` forwards `className` and `style` to the form. Field components forward them to the native control. For `<TagInput>`, they target the visible textbox, or the named group when `onlySuggestions` is enabled. They never target its hidden value input.

`<Text>`, `<Date>`, `<Checkbox>`, `<Select>`, `<TextArea>`, and `<FileUpload>` also accept `labelClassName` for the wrapping label. Use the tag hooks below for TagInput's label and internal parts.

Style a single instance directly:

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

FileUpload shows a native file input and an optional preview. The old `arform__upload-text` and `arform__upload-button` spans are removed. Style the input's `::file-selector-button` for its native button and `arform__upload-icon` for the decorative icon.

TagInput's `className` previously styled its outer label, while `style` reached its backing input. Move wrapper rules to `.arform__tag-input` when updating an existing theme.

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

.arform__label-required {
  color: crimson;
}
.arform__error {
  color: crimson;
  font-size: 0.875rem;
}
```

#### Class hooks

| Class                          | Element / purpose                                           |
| ------------------------------ | ----------------------------------------------------------- |
| `arform`                       | Root `<form>`                                               |
| `arform__field`                | Block container for each field                              |
| `arform__submit`               | Internal, visually hidden submit input; skipped by Tab      |
| `arform__error`                | Field-level error with `role="alert"`                       |
| `arform__label`                | Field label; a separate label or group heading for TagInput |
| `arform__label-inner`          | Label text and required mark                                |
| `arform__label-required`       | Required-field `*`                                          |
| `arform__input`                | Base class on native inputs                                 |
| `arform__text`                 | Text input                                                  |
| `arform__date`                 | Date input                                                  |
| `arform__checkbox`             | Checkbox, before its label text                             |
| `arform__select`               | Select                                                      |
| `arform__textarea`             | Textarea                                                    |
| `arform__upload`               | Native file input                                           |
| `arform__upload-wrapper`       | Wrapper around file input and preview                       |
| `arform__upload-icon`          | Decorative SVG; uses `currentColor`                         |
| `arform__upload-preview`       | Image preview for `fileType="media"`                        |
| `arform__upload-preview-label` | Filename preview for `fileType="binary"`                    |
| `arform__prefix`               | Wrapper for an input with a prefix                          |
| `arform__prefix-inner`         | Prefix text                                                 |
| `arform__prefix-input`         | Input inside a prefix wrapper                               |
| `arform__tag-input`            | TagInput container; named group in suggestions-only mode    |
| `arform__tag-input-control`    | Visible tag-entry textbox                                   |
| `arform__tag-list`             | Selected tags                                               |
| `arform__tag`                  | Tag action button                                           |
| `arform__tag-remove`           | Button for removing a selected tag                          |
| `arform__tag-suggestions`      | Suggested tag buttons                                       |

#### State attributes

State lives on attributes rather than modifier classes — pair them with the class hook above to scope each rule:

| Selector                                      | Meaning                                    |
| --------------------------------------------- | ------------------------------------------ |
| `.arform__input[aria-invalid="true"]`         | Field has a validation error               |
| `.arform__input[aria-required="true"]`        | Field is marked required (UI/a11y)         |
| `.arform__input:disabled`                     | Native `disabled` attribute set            |
| `.arform__input[data-arform-has-prefix]`      | Input is rendered with a `prefix`          |
| `.arform__label[data-arform-row]`             | Label uses a row layout (e.g., checkbox)   |
| `.arform__upload-wrapper[data-arform-active]` | File is being dragged over the drop target |

TagInput exposes `data-arform-invalid` and `data-arform-disabled` on its container. Target `.arform__tag[data-arform-suggestion]` to distinguish suggestions from selected tags. Its visible textbox also exposes `aria-invalid`, `aria-required`, and native `:disabled`. In suggestions-only mode, the named group carries invalid state and an accessible description for the required indication/error; individual buttons carry native `disabled`.

```css
.arform__input[aria-invalid='true'] {
  border-color: crimson;
}
.arform__upload-wrapper[data-arform-active] {
  background: #eef;
}
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
    <Text
      id="first"
      label="First name"
      className="w-full rounded border px-3 py-2"
    />
    <Text
      id="last"
      label="Last name"
      className="w-full rounded border px-3 py-2"
    />
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
  .arform__input[aria-invalid='true'],
  .arform__select[aria-invalid='true'],
  .arform__textarea[aria-invalid='true'] {
    @apply border-red-500;
  }
  .arform__label {
    @apply block text-sm font-medium text-gray-700;
  }
  .arform__label[data-arform-row] {
    @apply flex items-center gap-2;
  }
  .arform__label-required {
    @apply text-red-500;
  }
  .arform__error {
    @apply mt-1 text-sm text-red-600;
  }
}
```

If you're using Tailwind's content scanner, make sure your config includes the files where you write these utilities — the `arform__*` strings come from this library and don't need to be listed.

## Examples

See `src/stories` for runnable examples covering each component, validation states, and all three schema validators.

## License

MIT
