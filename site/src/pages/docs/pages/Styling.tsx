import { CodeBlock } from '../../../components/CodeBlock'

export const Styling = () => {
  return (
    <>
      <h1>Styling</h1>
      <p>
        The library ships <strong>completely unstyled</strong>. Every element gets a stable{' '}
        <code>arform__*</code> class hook so you can style globally from your own CSS, and stateful elements expose state via attributes you can target with attribute selectors.
      </p>

      <h2>Per-form / per-field styling</h2>
      <p>
        <code>&lt;ARForm&gt;</code> and every input component forward <code>className</code> and <code>style</code> to the underlying DOM element, so you can style a single instance directly:
      </p>
      <CodeBlock
        code={`<ARForm className="checkout-form" style={{ maxWidth: 480 }} onSubmit={onSubmit}>
  <Text id="email" label="Email" className="checkout-form__email" />
</ARForm>`}
      />
      <p>For wrapping markup (e.g., a custom row layout), wrap the input in your own element:</p>
      <CodeBlock
        code={`<div className="my-row">
  <Text id="first" label="First" />
  <Text id="last" label="Last" />
</div>`}
      />

      <h2>Global styling</h2>
      <p>Target the <code>arform__*</code> classes from your global stylesheet:</p>
      <CodeBlock
        lang="css"
        code={`.arform__input,
.arform__select,
.arform__textarea {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem;
}

.arform__label-required { color: crimson; }
.arform__error { color: crimson; font-size: 0.875rem; }`}
      />

      <h3>Class hooks</h3>
      <table>
        <thead>
          <tr>
            <th>Class</th>
            <th>Element</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>arform</code></td><td>Root <code>&lt;form&gt;</code></td></tr>
          <tr><td><code>arform__submit</code></td><td>Default submit button</td></tr>
          <tr><td><code>arform__error</code></td><td>Field-level error <code>role="alert"</code></td></tr>
          <tr><td><code>arform__label</code></td><td>Wraps every input</td></tr>
          <tr><td><code>arform__label-inner</code></td><td>Label text + required mark</td></tr>
          <tr><td><code>arform__label-required</code></td><td>The <code>*</code> for required fields</td></tr>
          <tr><td><code>arform__input</code></td><td>Base class on all inputs</td></tr>
          <tr><td><code>arform__text</code></td><td><code>&lt;input type="text"&gt;</code></td></tr>
          <tr><td><code>arform__date</code></td><td><code>&lt;input type="date"&gt;</code></td></tr>
          <tr><td><code>arform__checkbox</code></td><td><code>&lt;input type="checkbox"&gt;</code></td></tr>
          <tr><td><code>arform__select</code></td><td><code>&lt;select&gt;</code></td></tr>
          <tr><td><code>arform__textarea</code></td><td><code>&lt;textarea&gt;</code></td></tr>
          <tr><td><code>arform__upload</code></td><td>File <code>&lt;input&gt;</code></td></tr>
          <tr><td><code>arform__upload-wrapper</code></td><td>Drop target around file input</td></tr>
          <tr><td><code>arform__prefix</code></td><td>Wraps inputs with a <code>prefix</code></td></tr>
        </tbody>
      </table>

      <h3>State attributes</h3>
      <p>State lives on attributes rather than modifier classes — pair them with a class hook above to scope each rule:</p>
      <table>
        <thead>
          <tr>
            <th>Selector</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>.arform__input[aria-invalid="true"]</code></td><td>Field has a validation error</td></tr>
          <tr><td><code>.arform__input[aria-required="true"]</code></td><td>Field is marked required (UI/a11y)</td></tr>
          <tr><td><code>.arform__input:disabled</code></td><td>Native <code>disabled</code> attribute set</td></tr>
          <tr><td><code>.arform__input[data-arform-has-prefix]</code></td><td>Input is rendered with a <code>prefix</code></td></tr>
          <tr><td><code>.arform__label[data-arform-row]</code></td><td>Label uses a row layout (e.g., checkbox)</td></tr>
          <tr><td><code>.arform__upload-wrapper[data-arform-active]</code></td><td>File is being dragged over the drop target</td></tr>
        </tbody>
      </table>
      <p>
        <code>aria-invalid</code> and <code>aria-required</code> double as accessibility hooks, so no separate <code>data-*</code> is needed for them. Same for native <code>:disabled</code>.
      </p>

      <h2>Tailwind CSS</h2>
      <p>Tailwind plays nicely with the library — utility classes coexist with the <code>arform__*</code> hooks. Three patterns:</p>

      <h3>1. Per-instance utilities via <code>className</code></h3>
      <CodeBlock
        code={`<ARForm className="space-y-4 max-w-md" onSubmit={onSubmit}>
  <Text
    id="email"
    label="Email"
    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none aria-invalid:border-red-500"
  />
</ARForm>`}
      />
      <p>
        Tailwind v3.1+ ships an <code>aria-invalid:</code> variant; older versions can use the arbitrary variant <code>{`[&[aria-invalid="true"]]:border-red-500`}</code>.
      </p>

      <h3>2. Wrapping div for layout the library doesn't render</h3>
      <CodeBlock
        code={`<ARForm onSubmit={onSubmit}>
  <div className="grid grid-cols-2 gap-4">
    <Text id="first" label="First name" className="w-full rounded border px-3 py-2" />
    <Text id="last" label="Last name" className="w-full rounded border px-3 py-2" />
  </div>
</ARForm>`}
      />

      <h3>3. Global theme via <code>@apply</code> on the class hooks</h3>
      <p>Define the look once and every <code>&lt;ARForm&gt;</code> inherits it:</p>
      <CodeBlock
        lang="css"
        code={`@layer components {
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
}`}
      />
    </>
  )
}
