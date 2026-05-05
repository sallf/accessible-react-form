export const Accessibility = () => {
  return (
    <>
      <h1>Accessibility</h1>
      <p>
        Forms are the highest-stakes part of most apps for accessibility — failures here block real users from completing real tasks. This library is WCAG-compliant by default, with zero ARIA wiring required from you.
      </p>

      <h2>What you get for free</h2>
      <ul>
        <li>Every input is associated with its <code>&lt;label&gt;</code> via the parent-label pattern.</li>
        <li>Required fields get <code>aria-required="true"</code> announced by screen readers.</li>
        <li>Invalid fields get <code>aria-invalid="true"</code> and are linked to their error message via <code>aria-describedby</code>.</li>
        <li>Error messages render with <code>role="alert"</code>, so they're announced as they appear.</li>
        <li>Required indicators in labels use <code>aria-hidden="true"</code> on the visual <code>*</code> — assistive tech reads "required" from the input's ARIA, not the asterisk.</li>
      </ul>

      <h2>What's still on you</h2>
      <ul>
        <li><strong>Visible focus styles.</strong> The library doesn't ship CSS — make sure your styles preserve <code>:focus-visible</code> outlines.</li>
        <li><strong>Color contrast.</strong> If you use color to indicate error state, ensure the contrast meets WCAG AA.</li>
        <li><strong>Don't use color alone.</strong> Pair red borders with text-based error messages (the library does this for you out of the box).</li>
      </ul>
    </>
  )
}
