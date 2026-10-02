import { get } from 'react-hook-form'
import type { FieldError, FieldErrors } from 'react-hook-form'
import { FORM_ERROR_TYPE } from '../hooks/standardSchema'
import { isSafeFieldPath } from '../hooks/fieldPaths'

export const getFieldError = (
  errors: FieldErrors,
  id: string
): FieldError | undefined => {
  if (!isSafeFieldPath(id)) return undefined
  const error: unknown = get(errors, id)
  if (!isContainer(error) || !isErrorNode(error)) return undefined
  const keys = id
    .replace(/["']/g, '')
    .split(/[.[\]]/)
    .filter(Boolean)
  for (let index = 0; index < keys.length; index += 1) {
    if (!errorMetadata.has(keys[index])) continue
    const parent: unknown = get(errors, keys.slice(0, index).join('.'))
    if (
      isContainer(parent) &&
      isErrorNode(parent) &&
      !isRetainedChildError(error)
    ) {
      return undefined
    }
  }
  return error as FieldError
}

const isContainer = (value: unknown): value is Record<string, unknown> =>
  value !== null &&
  typeof value === 'object' &&
  (Array.isArray(value) ||
    Object.getPrototypeOf(value) === Object.prototype ||
    Object.getPrototypeOf(value) === null)

const errorMetadata = new Set(['type', 'message', 'ref', 'types'])

const isErrorNode = (value: Record<string, unknown>) =>
  typeof value.type === 'string' ||
  typeof value.type === 'number' ||
  typeof value.message === 'string' ||
  (Object.prototype.hasOwnProperty.call(value, 'ref') &&
    !isContainer(value.ref))

// RHF's setError adds an own ref, including undefined for unregistered names.
// Criterion maps contain validation messages/booleans/arrays, not field refs.
const isRetainedChildError = (value: unknown) =>
  isContainer(value) &&
  Object.prototype.hasOwnProperty.call(value, 'ref') &&
  (value.ref === undefined ||
    (value.ref !== null &&
      typeof value.ref === 'object' &&
      !Array.isArray(value.ref)))

export const getErrorSummary = (errors: FieldErrors) => {
  let fieldErrors = 0
  const formMessages: string[] = []
  const visited = new WeakSet<object>()
  // Metadata containers can mix criteria values and retained descendant errors.
  // Only RHF error leaves count within them; criterion maps are not error nodes.
  const visitRetained = (value: unknown) => {
    if (!isContainer(value) || visited.has(value)) return
    if (isRetainedChildError(value)) {
      visit(value)
      return
    }
    visited.add(value)
    Object.values(value).forEach(visitRetained)
  }
  const visit = (value: unknown) => {
    if (!isContainer(value) || visited.has(value)) return
    visited.add(value)
    if (isErrorNode(value)) {
      if (value.type === FORM_ERROR_TYPE) {
        const messages = isContainer(value.types)
          ? Object.values(value.types).filter(
              (message): message is string => typeof message === 'string'
            )
          : typeof value.message === 'string'
            ? [value.message]
            : []
        formMessages.push(...messages)
      } else {
        fieldErrors += 1
      }
      // Public setError can retain child errors alongside a parent's error.
      // Its own metadata, including DOM refs, must never be traversed.
      Object.entries(value).forEach(([key, child]) => {
        if (errorMetadata.has(key)) visitRetained(child)
        else visit(child)
      })
      return
    }
    Object.values(value).forEach(visit)
  }
  visit(errors)
  return { errorsCount: fieldErrors + formMessages.length, formMessages }
}
