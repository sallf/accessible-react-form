import { ARForm, Date } from 'accessible-react-form'
import { object, string } from 'yup'

const schema = object({ dob: string().required() })

export default function Example() {
  return (
    <ARForm
      className="space-y-4 [&_[role=alert]]:mt-1 [&_[role=alert]]:text-sm [&_[role=alert]]:text-red-600 dark:[&_[role=alert]]:text-red-400"
      validationSchema={schema}
      onSubmit={() => {}}
    >
      <Date
        id="dob"
        label="Date of Birth"
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-400"
        labelClassName="flex flex-col gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-100 [&_[aria-hidden=true]]:text-violet-600 dark:[&_[aria-hidden=true]]:text-violet-400"
        required
      />
      <button
        type="submit"
        className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
      >
        Validate
      </button>
    </ARForm>
  )
}
