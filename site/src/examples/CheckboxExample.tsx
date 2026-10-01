import { ARForm, Checkbox } from 'accessible-react-form'
import type { FieldValues } from 'react-hook-form'

export default function CheckboxExample({
  onSubmit = () => {},
}: {
  onSubmit?: (values: FieldValues) => void
}) {
  return (
    <ARForm onSubmit={onSubmit} className="w-full max-w-md space-y-5">
      <Checkbox
        id="terms"
        label="I agree to the terms"
        labelClassName="flex items-center gap-3 text-sm font-medium text-slate-900 dark:text-slate-100"
        className="size-4 accent-violet-600 focus-visible:outline-2 focus-visible:outline-violet-500"
      />
    </ARForm>
  )
}
