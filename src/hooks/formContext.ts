import type { UseFormReturn } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'

// Fields accept arbitrary registered names; the consumer owns the form's value,
// context, and output types. Erase those invariant generics only at this boundary.
export type FieldFormMethods = Pick<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UseFormReturn<any, any, any>,
  'register' | 'watch' | 'setValue' | 'formState'
>

/** Explicit methods remain authoritative when a field is nested in a form. */
export const useFieldForm = (
  formProps?: FieldFormMethods
): FieldFormMethods => {
  const context = useFormContext()
  return formProps ?? context
}
