import type { FieldValues, UseFormReturn } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'

/** Explicit methods remain authoritative when a field is nested in a form. */
export const useFieldForm = (
  formProps?: UseFormReturn<FieldValues, unknown>
) => {
  const context = useFormContext<FieldValues>()
  return formProps ?? context
}
