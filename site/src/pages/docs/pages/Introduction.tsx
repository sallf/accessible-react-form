import { Link } from 'react-router-dom'

export const Introduction = () => {
  return (
    <>
      <h1>Introduction</h1>
      <p>
        <code>accessible-react-form</code> is a minimal React form library built on{' '}
        <a href="https://react-hook-form.com/" target="_blank" rel="noreferrer">
          react-hook-form
        </a>{' '}
        with first-class support for any{' '}
        <a href="https://standardschema.dev" target="_blank" rel="noreferrer">
          Standard Schema
        </a>{' '}
        validator — yup, zod, valibot, arktype, or anything else compliant.
      </p>
      <p>
        It ships <strong>completely unstyled</strong> and <strong>WCAG-compliant by default</strong>. No ARIA wiring required. You bring the design system; the library handles correctness.
      </p>

      <h2>Why this exists</h2>
      <p>
        Most form libraries either lock you into a design system or leave accessibility as homework. This library does neither: every field gets the right ARIA attributes, error messaging is announced, and required-state and invalid-state are exposed both as a11y attributes and as CSS hooks for styling.
      </p>

      <h2>Where to go next</h2>
      <ul>
        <li>
          <Link to="/docs/quickstart">Quickstart</Link> — install and ship a form in five minutes
        </li>
        <li>
          <Link to="/docs/styling">Styling</Link> — class hooks, state attributes, Tailwind
        </li>
        <li>
          <Link to="/docs/validation">Validation schemas</Link> — yup, zod, valibot
        </li>
        <li>
          <Link to="/docs/components">Components</Link> — full reference
        </li>
      </ul>
    </>
  )
}
