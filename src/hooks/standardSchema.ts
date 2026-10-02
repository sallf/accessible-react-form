import { useCallback } from 'react'
import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form'
import { get, set } from 'react-hook-form'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import { schemaFieldPath } from './fieldPaths'

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
        const issues = result.issues.map((issue) => ({
          issue,
          path: schemaFieldPath(issue.path),
        }))
        const arrayPaths = new Set<string>()
        for (const { path } of issues) {
          const keys = path?.split('.') ?? []
          for (let index = 1; index < keys.length; index += 1) {
            // RHF creates an array when the next path segment is numeric.
            if (!Number.isNaN(Number(keys[index]))) {
              arrayPaths.add(keys.slice(0, index).join('.'))
            }
          }
        }
        for (const { issue, path } of issues) {
          // RHF removes its reserved root error bucket before deciding validity.
          const hasReservedRoot = path === 'root' || path?.startsWith('root.')
          const hasDescendant =
            path && issues.some((other) => other.path?.startsWith(`${path}.`))
          const hasArrayLength = path
            ?.split('.')
            .some(
              (key, index, keys) =>
                key === 'length' &&
                (arrayPaths.has(keys.slice(0, index).join('.')) ||
                  Array.isArray(get(data, keys.slice(0, index).join('.'))))
            )
          if (!path || hasReservedRoot || hasDescendant || hasArrayLength) {
            formMessages.push(issue.message)
            continue
          }
          set(errors, path, {
            type: 'validation',
            message: issue.message,
          })
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
