import { useCallback } from 'react'
import type { FieldError, FieldErrors, FieldValues } from 'react-hook-form'
import type { AnyObject, ValidationError } from 'yup'

// TODO there might be an existing yup type
export type YupPromise = Promise<
  | { values: FieldValues; errors: Record<string, never> }
  | { values: Record<string, never>; errors: ValidationError }
>

// TODO need to protect against null validationSchema
export const useYupValidationResolver = (validationSchema: AnyObject | null) =>
  useCallback(
    async (data: FieldValues): YupPromise => {
      try {
        const values: FieldValues = await validationSchema?.validate(data, {
          abortEarly: false,
        })
        return {
          values,
          errors: {},
        }
      } catch (errors: any) {
        return {
          values: {},
          errors: errors.inner.reduce(
            // TODO fix type error below
            (allErrors: FieldErrors, currentError: FieldError) => ({
              ...allErrors,
              // @ts-ignore
              [currentError.path]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {}
          ),
        }
      }
    },
    [validationSchema]
  )
