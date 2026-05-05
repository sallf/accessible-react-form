import { useCallback } from 'react'
import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form'
import type { StandardSchemaV1 } from '@standard-schema/spec'

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
        for (const issue of result.issues) {
          const path = issue.path
            ?.map((segment) =>
              typeof segment === 'object' ? segment.key : segment
            )
            .join('.')
          if (!path) continue
          errors[path] = {
            type: 'validation',
            message: issue.message,
          }
        }
        return { values: {}, errors }
      }

      return { values: result.value as FieldValues, errors: {} }
    },
    [schema]
  )
