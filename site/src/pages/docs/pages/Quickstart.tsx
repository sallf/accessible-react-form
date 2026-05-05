import { Link } from 'react-router-dom'
import { CodeBlock } from '../../../components/CodeBlock'

export const Quickstart = () => {
  return (
    <>
      <h1>Quickstart</h1>
      <p>Get a validated, accessible form running in five minutes.</p>

      <h2>1. Install</h2>
      <CodeBlock
        lang="bash"
        code={`npm install accessible-react-form react-hook-form`}
      />
      <p>Plus the validator of your choice:</p>
      <CodeBlock
        lang="bash"
        code={`npm install yup       # or
npm install zod       # or
npm install valibot   # or any Standard Schema validator`}
      />

      <h2>2. Build a form</h2>
      <CodeBlock
        code={`import { ARForm, Text } from 'accessible-react-form'
import { object, string } from 'yup'

const schema = object({
  name: string().required(),
  email: string().email(),
})

export const SignupForm = () => (
  <ARForm validationSchema={schema} onSubmit={(values) => console.log(values)}>
    <Text id="name" label="Name" required />
    <Text id="email" label="Email" />
  </ARForm>
)`}
      />

      <h2>3. Style it</h2>
      <p>
        The library is unstyled. Pass <code>className</code> to any component, or target the global{' '}
        <code>arform__*</code> class hooks from your stylesheet. See the{' '}
        <Link to="/docs/styling">styling guide</Link>.
      </p>

      <h2>The two-source-of-truth model</h2>
      <p>
        You'll notice <code>required</code> shows up in both the schema <em>and</em> as a prop. They drive different things:
      </p>
      <ul>
        <li>
          <strong>Schema</strong> owns <strong>validation</strong> — will the form reject submission?
        </li>
        <li>
          <strong>The <code>required</code> prop</strong> owns <strong>UI + a11y</strong> — does the label show a <code>*</code>? Does the input get <code>aria-required="true"</code>?
        </li>
      </ul>
      <p>
        Keep them in sync. There's no auto-derivation because Standard Schema only standardizes <code>validate()</code>; libraries genuinely disagree about what "required" means.
      </p>
    </>
  )
}
