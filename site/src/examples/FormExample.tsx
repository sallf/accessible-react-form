import { ARForm, Text } from 'accessible-react-form'
import type { FieldValues } from 'react-hook-form'

export default function FormExample({
  onSubmit = () => {},
}: {
  onSubmit?: (values: FieldValues) => void
}) {
  return (
    <ARForm onSubmit={onSubmit} className="w-full max-w-md space-y-5">
      <Text
        id="name"
        label="Name"
        labelClassName="block text-sm font-medium text-slate-900 dark:text-slate-100"
        className="mt-2 block w-full rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-900 focus:outline-2 focus:outline-violet-500 dark:bg-white/5 dark:text-white"
      />
      <Text
        id="email"
        label="Email"
        type="email"
        labelClassName="block text-sm font-medium text-slate-900 dark:text-slate-100"
        className="mt-2 block w-full rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-900 focus:outline-2 focus:outline-violet-500 dark:bg-white/5 dark:text-white"
      />
      <button
        type="submit"
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
      >
        Submit
      </button>
    </ARForm>
  )
}
