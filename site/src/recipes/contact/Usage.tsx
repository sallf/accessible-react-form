import { useState } from 'react'
import { ContactForm, type ContactValues } from './ContactForm'

export default function Usage() {
  const [result, setResult] = useState<ContactValues | null>(null)

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <ContactForm onSubmit={setResult} />
      <p className="px-1 text-sm text-slate-500">
        Demo only. Nothing is sent or saved.
      </p>
      {result && (
        <div className="rounded-xl border border-violet-300 bg-violet-50 p-5 text-slate-900">
          <p role="status" className="font-medium">
            Thanks, {result.name}. Your message is ready.
          </p>
          <dl className="mt-3 space-y-2 break-words text-sm">
            <div>
              <dt className="font-medium">Email</dt>
              <dd>{result.email}</dd>
            </div>
            <div>
              <dt className="font-medium">Topics</dt>
              <dd>{result.topics || 'None selected'}</dd>
            </div>
            <div>
              <dt className="font-medium">Message</dt>
              <dd>{result.message}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  )
}
