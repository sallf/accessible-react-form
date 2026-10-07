import type { UseFormReturn } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import { assertFieldName } from './fieldPaths'

// Fields accept arbitrary registered names; the consumer owns the form's value,
// context, and output types. Erase those invariant generics only at this boundary.
export type FieldFormMethods = Pick<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UseFormReturn<any, any, any>,
  'register' | 'watch' | 'setValue' | 'formState'
>

/** Explicit methods remain authoritative when a field is nested in a form. */
export const useFieldForm = (
  formProps: FieldFormMethods | undefined,
  id: unknown
): FieldFormMethods => {
  const context = useFormContext()
  assertFieldName(id)
  const methods = formProps ?? context
  if (!methods?.register) {
    throw new Error(
      'Accessible React Form fields need form methods. Wrap the field in ARForm or a matching React Hook Form FormProvider, or pass formProps. If a provider is already present, check for separate react-hook-form or library module instances (including mixed CommonJS/ESM imports).'
    )
  }
  return methods
}
