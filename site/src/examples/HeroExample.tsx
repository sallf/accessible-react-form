import { ARForm, Text, Select } from 'accessible-react-form'
import type { FieldValues } from 'react-hook-form'
import { object, string } from 'yup'

const schema = object({
  name: string().required(),
  email: string().email().required(),
  plan: string(),
})

export default function HeroExample({
  onSubmit = () => {},
  onChange = () => {},
}: {
  onSubmit?: (values: FieldValues) => void
  onChange?: () => void
}) {
  return (
    <ARForm
      validationSchema={schema}
      onSubmit={onSubmit}
      onChangeCallback={onChange}
      className="space-y-4 [&_[role=alert]]:text-sm [&_[role=alert]]:text-red-600 dark:[&_[role=alert]]:text-red-400"
    >
      <Text
        id="name"
        label="Name"
        required
        labelClassName="block text-sm font-medium text-slate-900 dark:text-slate-100"
        className="mt-2 block w-full rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-900 focus:outline-2 focus:outline-violet-500 dark:bg-white/5 dark:text-white"
      />
      <Text
        id="email"
        label="Email"
        type="email"
        required
        labelClassName="block text-sm font-medium text-slate-900 dark:text-slate-100"
        className="mt-2 block w-full rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-900 focus:outline-2 focus:outline-violet-500 dark:bg-white/5 dark:text-white"
      />
      <Select
        id="plan"
        label="Plan"
        options={['Free', 'Pro', 'Team']}
        labelClassName="block text-sm font-medium text-slate-900 dark:text-slate-100"
        className="mt-2 block w-full rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-900 focus:outline-2 focus:outline-violet-500 dark:bg-slate-800 dark:text-white"
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
