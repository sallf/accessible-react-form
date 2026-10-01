import type { ComponentProps } from 'react'
import { ARForm, TagInput, Text, TextArea } from 'accessible-react-form'
import { z } from 'zod'

const schema = z.object({
  name: z.string().trim().min(1, 'Enter your name'),
  email: z.email('Enter a valid email address'),
  topics: z.string().optional(),
  message: z
    .string()
    .trim()
    .min(10, 'Write a message of at least 10 characters'),
})

export type ContactValues = z.infer<typeof schema>

const inputClasses =
  'mt-2 block w-full rounded-lg bg-white/5 px-3 py-2.5 text-sm text-white outline-1 outline-white/15 focus:outline-2 focus:outline-violet-400 aria-invalid:outline-red-400 disabled:opacity-50'
const labelClasses = 'block text-sm font-medium text-slate-200'

export function ContactText({
  className = inputClasses,
  labelClassName = labelClasses,
  ...props
}: Omit<ComponentProps<typeof Text>, 'formProps'>) {
  return (
    <Text {...props} className={className} labelClassName={labelClassName} />
  )
}

export function ContactForm({
  onSubmit,
  disabled = false,
}: {
  onSubmit: (values: ContactValues) => void
  disabled?: boolean
}) {
  return (
    <section className="w-full rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight">Let’s talk.</h2>
      <p className="mt-2 text-sm text-slate-400">
        Tell us what you have in mind.
      </p>
      <ARForm
        validationSchema={schema}
        onSubmit={(values) => onSubmit(values as ContactValues)}
        className="mt-6 space-y-5 [&_[role=alert]]:mt-2 [&_[role=alert]]:text-sm [&_[role=alert]]:text-red-300"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <ContactText
            id="name"
            label="Your name"
            autoComplete="name"
            placeholder="Avery Taylor"
            required
            disabled={disabled}
          />
          <ContactText
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="avery@example.com"
            required
            disabled={disabled}
          />
        </div>
        <div className="[&_label]:text-sm [&_label]:font-medium [&_label]:text-slate-200 [&_button]:mr-2 [&_button]:mt-2 [&_button]:rounded-full [&_button]:bg-violet-400/15 [&_button]:px-3 [&_button]:py-1 [&_button]:text-sm [&_button]:text-violet-200 [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-violet-400 [&_button:disabled]:opacity-50">
          <TagInput
            id="topics"
            label="Topics"
            placeholder="Type a topic and press Enter"
            className={inputClasses}
            disabled={disabled}
          />
        </div>
        <TextArea
          id="message"
          label="Message"
          placeholder="How can we help?"
          rows={4}
          required
          disabled={disabled}
          labelClassName={labelClasses}
          className={inputClasses}
        />
        <button
          type="submit"
          disabled={disabled}
          className="w-full rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400 disabled:opacity-50 sm:w-auto"
        >
          Send message
        </button>
      </ARForm>
    </section>
  )
}
