import { CodeBlock } from '../../../components/CodeBlock'
import TextExampleSource from '../../../examples/TextExample.tsx?raw'
import { Link } from 'react-router-dom'

export const Styling = () => {
  return (
    <>
      <h1>Styling</h1>
      <p>
        The <Link to="/docs/recipes/contact">contact form recipe</Link> includes
        a complete Tailwind form and a reusable <code>ContactText</code>{' '}
        component. Its copied files contain every styling class used in the
        preview.
      </p>
      <p>
        The library ships <strong>no CSS</strong>. In a React app with Tailwind
        configured, add utilities through <code>className</code> and, where
        supported, <code>labelClassName</code>. The library passes these classes
        to the rendered elements.
      </p>
      <CodeBlock code={TextExampleSource} />

      <h2>Class props</h2>
      <p>
        <code>ARForm</code> forwards <code>className</code> and{' '}
        <code>style</code> to the form. Field components forward those props to
        their input or control. Text, Date, Checkbox, Select, TextArea, and
        FileUpload also accept <code>labelClassName</code> for the wrapping
        label. Put layout around fields in your own JSX when needed.
      </p>
      <p>
        TagInput&apos;s <code>className</code> and <code>style</code> target its
        visible textbox, or its named group in suggestions-only mode. It does
        not accept <code>labelClassName</code>. Use Tailwind descendant
        selectors on your form or wrapper to style its label and tag buttons.
        Its hidden value input does not receive styling props. FileUpload uses a
        native file input, so style its button with Tailwind&apos;s{' '}
        <code>file:</code> variant.
      </p>
      <p>
        Fields render in separate block containers by default. Checkboxes stay
        beside their labels. Add a visible submit button when you want one; the
        internal submit control supports Enter and is skipped by Tab.
      </p>

      <h2>Field states</h2>
      <p>
        Use native state selectors with Tailwind utilities, such as{' '}
        <code>aria-invalid:border-red-500</code>,{' '}
        <code>disabled:opacity-50</code>, and <code>focus:ring-2</code>.
        TagInput exposes <code>data-arform-invalid</code> and{' '}
        <code>data-arform-disabled</code> on its container. The file drop target
        exposes <code>data-arform-active</code> while a file is dragged over it.
      </p>

      <h2>Optional class hooks</h2>
      <p>
        For lower-level styling or apps that use plain CSS, these generated
        classes are available. Tailwind on the component props above is the
        primary workflow.
      </p>
      <table>
        <thead>
          <tr>
            <th>Class</th>
            <th>Target</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>arform__field</code>
            </td>
            <td>Field block container</td>
          </tr>
          <tr>
            <td>
              <code>arform__label</code>
            </td>
            <td>Field label or TagInput group label</td>
          </tr>
          <tr>
            <td>
              <code>arform__label-required</code>
            </td>
            <td>Required marker</td>
          </tr>
          <tr>
            <td>
              <code>arform__input</code>
            </td>
            <td>Text, date, checkbox, and file inputs</td>
          </tr>
          <tr>
            <td>
              <code>arform__select</code>, <code>arform__textarea</code>
            </td>
            <td>Select and textarea controls, respectively</td>
          </tr>
          <tr>
            <td>
              <code>arform__error</code>
            </td>
            <td>
              Field error with <code>{'role="alert"'}</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>arform__prefix</code>
            </td>
            <td>Wrapper for a field with a prefix</td>
          </tr>
          <tr>
            <td>
              <code>arform__upload-wrapper</code>
            </td>
            <td>File input and preview wrapper</td>
          </tr>
          <tr>
            <td>
              <code>arform__tag-input</code>
            </td>
            <td>TagInput container or suggestions-only group</td>
          </tr>
          <tr>
            <td>
              <code>arform__tag-input-control</code>
            </td>
            <td>Visible tag-entry textbox</td>
          </tr>
          <tr>
            <td>
              <code>arform__tag-list</code>, <code>arform__tag</code>
            </td>
            <td>Selected tags and their actions</td>
          </tr>
          <tr>
            <td>
              <code>arform__tag-suggestions</code>
            </td>
            <td>Suggested tag buttons</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
