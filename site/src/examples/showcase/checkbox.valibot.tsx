import { ARForm, Checkbox } from 'accessible-react-form'
import * as v from 'valibot'

const schema = v.object({ terms: v.literal(true, 'Please agree') })

export default function Example() {
  return (
    <ARForm
      className="space-y-4 [&_[role=alert]]:mt-1 [&_[role=alert]]:text-sm [&_[role=alert]]:text-red-600 dark:[&_[role=alert]]:text-red-400"
      validationSchema={schema}
      onSubmit={() => {}}
    >
      <Checkbox
        id="terms"
        label="I agree to the terms"
        className="h-4 w-4 accent-violet-600 dark:accent-violet-400"
        labelClassName="flex flex-row items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100 [&_[aria-hidden=true]]:text-violet-600 dark:[&_[aria-hidden=true]]:text-violet-400"
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
