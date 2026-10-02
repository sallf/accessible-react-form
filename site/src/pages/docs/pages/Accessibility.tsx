export const Accessibility = () => {
  return (
    <>
      <h1>Accessibility</h1>
      <p>
        Fields provide labels, required/invalid states, and linked validation
        feedback. These features support accessibility; WCAG conformance depends
        on your completed application, including its styling and content.
      </p>
      <h2>What the fields provide</h2>
      <ul>
        <li>
          Native controls have associated labels. TagInput uses a labelled
          textbox or, in suggestions-only mode, a named group of buttons.
        </li>
        <li>
          Required controls expose their required state. The suggestions-only
          group uses descriptive required text.
        </li>
        <li>
          Invalid controls expose <code>aria-invalid</code> and link their
          feedback with <code>aria-describedby</code>, preserving your help-text
          references.
        </li>
        <li>
          Field errors and the form-wide summary use{' '}
          <code>role=&quot;alert&quot;</code>. Actual announcements depend on
          the browser and assistive technology.
        </li>
        <li>
          The visual required asterisk is hidden from assistive technology; the
          control&apos;s required state or group description provides that
          information.
        </li>
      </ul>
      <h2>What to check in your application</h2>
      <ul>
        <li>
          <strong>Visible focus styles.</strong> Preserve keyboard focus
          indicators when styling controls.
        </li>
        <li>
          <strong>Contrast and error feedback.</strong> Check text and control
          contrast and keep text errors alongside color cues.
        </li>
        <li>
          <strong>Keyboard and assistive technology.</strong> Test the complete
          form, including custom content and validation recovery. The library
          does not provide a custom error-summary focus workflow.
        </li>
      </ul>
    </>
  )
}
