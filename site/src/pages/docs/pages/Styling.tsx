import { CodeBlock } from '../../../components/CodeBlock'

export const Styling = () => {
  return (
    <>
      <h1>Styling</h1>
      <p>
        The library ships <strong>no CSS</strong> and works with native browser
        styling. Use the <code>arform__*</code> hooks and state attributes to
        apply your own theme. Your Tailwind utilities and CSS Modules classes
        pass through unchanged; the library adds no utility classes.
      </p>

      <p>
        Each field has a block <code>arform__field</code> container, so fields
        start on separate lines without CSS. Checkboxes stay beside their
        labels. Use the field containers for grid placement or spacing.
      </p>
      <p>
        Only the internal submit control and screen-reader text use inline
        hiding styles. Add your own visible submit button when needed. The
        internal control supports Enter submission and is skipped by Tab.
      </p>

      <h2>Per-form / per-field styling</h2>
      <p>
        <code>&lt;ARForm&gt;</code> and every input component forward{' '}
        <code>className</code> and <code>style</code> to the underlying DOM
        element. TagInput targets its visible textbox, or the named group when{' '}
        <code>onlySuggestions</code> is enabled. Its hidden value input never
        receives your styling props. Style a single instance directly:
      </p>
      <CodeBlock
        code={`<ARForm className="checkout-form" style={{ maxWidth: 480 }} onSubmit={onSubmit}>
  <Text id="email" label="Email" className="checkout-form__email" />
</ARForm>`}
      />
      <p>
        For wrapping markup (e.g., a custom row layout), wrap the input in your
        own element:
      </p>
      <CodeBlock
        code={`<div className="my-row">
  <Text id="first" label="First" />
  <Text id="last" label="Last" />
</div>`}
      />

      <p>
        Text, Date, Checkbox, Select, TextArea, and FileUpload also accept
        <code> labelClassName</code> for the wrapping label. Use TagInput&apos;s
        class hooks to style its separate label and internal parts.
      </p>
      <p>
        FileUpload uses a native file input and an optional preview. Style
        <code> ::file-selector-button</code> for the native button and
        <code> arform__upload-icon</code> for its decorative icon. The old
        <code> arform__upload-text</code> and
        <code> arform__upload-button</code> spans are removed.
      </p>
      <p>
        When updating a theme, note that TagInput&apos;s
        <code> className</code> previously targeted its label and
        <code> style</code> targeted its backing input. Move wrapper styles to
        <code> .arform__tag-input</code>.
      </p>

      <h2>Global styling</h2>
      <p>
        Target the <code>arform__*</code> classes from your global stylesheet:
      </p>
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
          <tr>
            <td>
              <code>arform</code>
            </td>
            <td>
              Root <code>&lt;form&gt;</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>arform__submit</code>
            </td>
            <td>Internal submit input, visually hidden and skipped by Tab</td>
          </tr>
          <tr>
            <td>
              <code>arform__error</code>
            </td>
            <td>
              Field-level error <code>role=&quot;alert&quot;</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>arform__label</code>
            </td>
            <td>Field label; separate label or group heading for TagInput</td>
          </tr>
          <tr>
            <td>
              <code>arform__label-inner</code>
            </td>
            <td>Label text + required mark</td>
          </tr>
          <tr>
            <td>
              <code>arform__label-required</code>
            </td>
            <td>
              The <code>*</code> for required fields
            </td>
          </tr>
          <tr>
            <td>
              <code>arform__input</code>
            </td>
            <td>Base class on all inputs</td>
          </tr>
          <tr>
            <td>
              <code>arform__text</code>
            </td>
            <td>
              <code>&lt;input type=&quot;text&quot;&gt;</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>arform__date</code>
            </td>
            <td>
              <code>&lt;input type=&quot;date&quot;&gt;</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>arform__checkbox</code>
            </td>
            <td>
              <code>&lt;input type=&quot;checkbox&quot;&gt;</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>arform__select</code>
            </td>
            <td>
              <code>&lt;select&gt;</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>arform__textarea</code>
            </td>
            <td>
              <code>&lt;textarea&gt;</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>arform__upload</code>
            </td>
            <td>
              File <code>&lt;input&gt;</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>arform__upload-wrapper</code>
            </td>
            <td>Wrapper around the native file input and preview</td>
          </tr>
          <tr>
            <td>
              <code>arform__prefix</code>
            </td>
            <td>
              Wraps inputs with a <code>prefix</code>
            </td>
          </tr>
          {[
            ['arform__field', 'Block container for each field'],
            ['arform__upload-icon', 'Decorative SVG using currentColor'],
            ['arform__upload-preview', 'Image preview'],
            ['arform__upload-preview-label', 'Filename preview'],
            [
              'arform__tag-input',
              'TagInput container; named group in suggestions-only mode',
            ],
            ['arform__tag-input-control', 'Visible tag-entry textbox'],
            ['arform__tag-list', 'Selected tags'],
            ['arform__tag', 'Tag action button'],
            ['arform__tag-remove', 'Remove a selected tag'],
            ['arform__tag-suggestions', 'Suggested tag buttons'],
          ].map(([hook, description]) => (
            <tr key={hook}>
              <td>
                <code>{hook}</code>
              </td>
              <td>{description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>State attributes</h3>
      <p>
        State lives on attributes rather than modifier classes — pair them with
        a class hook above to scope each rule:
      </p>
      <table>
        <thead>
          <tr>
            <th>Selector</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>.arform__input[aria-invalid=&quot;true&quot;]</code>
            </td>
            <td>Field has a validation error</td>
          </tr>
          <tr>
            <td>
              <code>.arform__input[aria-required=&quot;true&quot;]</code>
            </td>
            <td>Field is marked required (UI/a11y)</td>
          </tr>
          <tr>
            <td>
              <code>.arform__input:disabled</code>
            </td>
            <td>
              Native <code>disabled</code> attribute set
            </td>
          </tr>
          <tr>
            <td>
              <code>.arform__input[data-arform-has-prefix]</code>
            </td>
            <td>
              Input is rendered with a <code>prefix</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>.arform__label[data-arform-row]</code>
            </td>
            <td>Label uses a row layout (e.g., checkbox)</td>
          </tr>
          <tr>
            <td>
              <code>.arform__upload-wrapper[data-arform-active]</code>
            </td>
            <td>File is being dragged over the drop target</td>
          </tr>
        </tbody>
      </table>
      <p>
        TagInput exposes <code>data-arform-invalid</code> and
        <code> data-arform-disabled</code> on its container. Its visible textbox
        also carries <code>aria-invalid</code>,<code> aria-required</code>, and
        native <code>disabled</code>. In suggestions-only mode, the named group
        carries invalid state and an accessible description of the required
        indication/error; its buttons use native <code>disabled</code>. Target
        <code> .arform__tag[data-arform-suggestion]</code> to style suggestions
        separately from selected tags.
      </p>

      <h2>Tailwind CSS</h2>
      <p>
        Tailwind plays nicely with the library — utility classes coexist with
        the <code>arform__*</code> hooks. Three patterns:
      </p>

      <h3>
        1. Per-instance utilities via <code>className</code>
      </h3>
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
        Tailwind v3.1+ ships an <code>aria-invalid:</code> variant; older
        versions can use the arbitrary variant{' '}
        <code>{`[&[aria-invalid="true"]]:border-red-500`}</code>.
      </p>

      <h3>2. Wrapping div for layout the library doesn&apos;t render</h3>
      <CodeBlock
        code={`<ARForm onSubmit={onSubmit}>
  <div className="grid grid-cols-2 gap-4">
    <Text id="first" label="First name" className="w-full rounded border px-3 py-2" />
    <Text id="last" label="Last name" className="w-full rounded border px-3 py-2" />
  </div>
</ARForm>`}
      />

      <h3>
        3. Global theme via <code>@apply</code> on the class hooks
      </h3>
      <p>
        Define the look once and every <code>&lt;ARForm&gt;</code> inherits it:
      </p>
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
