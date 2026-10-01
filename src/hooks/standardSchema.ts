import { useCallback } from 'react'
import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form'
import type { StandardSchemaV1 } from '@standard-schema/spec'

export const FORM_ERROR_TYPE = 'arform-form-validation'

export const useStandardSchemaResolver = (
  schema: StandardSchemaV1 | null
): Resolver<FieldValues> =>
  useCallback<Resolver<FieldValues>>(
    async (data) => {
      if (!schema) return { values: data, errors: {} }

      let result = schema['~standard'].validate(data)
      if (result instanceof Promise) result = await result

      if (result.issues) {
        const errors: FieldErrors = {}
        const formMessages: string[] = []
        for (const issue of result.issues) {
          const path = issue.path
            ?.map((segment) =>
              typeof segment === 'object' ? segment.key : segment
            )
            .join('.')
          if (!path) {
            formMessages.push(issue.message)
            continue
          }
          errors[path] = {
            type: 'validation',
            message: issue.message,
          }
        }
        if (formMessages.length) {
          let key = '__arform_form_errors__'
          while (key in data || key in errors) key += '_'
          errors[key] = {
            type: FORM_ERROR_TYPE,
            message: formMessages[0],
            types: Object.fromEntries(
              formMessages.map((message, i) => [i, message])
            ),
          }
        }
        return { values: {}, errors }
      }

      return { values: result.value as FieldValues, errors: {} }
    },
    [schema]
  )
