import { useEffect, useRef, useState } from 'react'
import { CopyButton } from '../../../components/CopyButton'
import { ExamplePreview } from '../../../components/ExamplePreview'
import formSource from '../../../recipes/contact/ContactForm.tsx?raw'
import usageSource from '../../../recipes/contact/Usage.tsx?raw'

const installCommand = 'npm install accessible-react-form react-hook-form zod'
const files = [
  { name: 'ContactForm.tsx', source: formSource },
  { name: 'Usage.tsx', source: usageSource },
]

export const ContactRecipe = () => {
  const frame = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(850)

  useEffect(() => {
    const resize = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.current?.contentWindow
      )
        return
      if (
        event.data?.type === 'contact-preview-height' &&
        Number.isFinite(event.data.height) &&
        event.data.height > 0
      )
        setHeight(event.data.height)
    }
    window.addEventListener('message', resize)
    return () => window.removeEventListener('message', resize)
  }, [])

  return (
    <>
      <h1>Contact form</h1>
      <p>
        A complete form with validation, topic tags, and a reusable text field.
        Copy the files and connect your own submit handler.
      </p>
      <p className="text-sm">
        Start with a React app with Tailwind CSS configured. Install the form
        library and its dependencies:
      </p>
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-bg-subtle p-4">
        <code className="min-w-0 flex-1 break-words text-sm">
          {installCommand}
        </code>
        <CopyButton text={installCommand} label="Copy install command" />
      </div>
      <ExamplePreview files={files}>
        <iframe
          ref={frame}
          title="Contact form preview"
          src="/recipes/contact-preview.html"
          className="block w-full border-0"
          style={{ height }}
        />
      </ExamplePreview>
      <h2>Make it yours</h2>
      <p>
        Save <code>ContactForm.tsx</code> and <code>Usage.tsx</code> together.
        The preview runs these exact files. It shows the result locally and
        sends no request.
      </p>
      <p>
        Replace the callback in <code>Usage.tsx</code> with your submit handler.
        You own the Tailwind classes. Import <code>ContactText</code> from{' '}
        <code>ContactForm.tsx</code> to use the same field in another{' '}
        <code>ARForm</code>.
      </p>
    </>
  )
}
