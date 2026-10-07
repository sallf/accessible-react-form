import type { StandardSchemaV1 } from '@standard-schema/spec'

const unsafeKeys = new Set([
  ...Object.getOwnPropertyNames(Object.prototype),
  'prototype',
])

const hasUnsafeFieldKey = (path: string) =>
  path
    .replace(/["']/g, '')
    .split(/[.[\]]/)
    .some((key) => unsafeKeys.has(key))

export const isSafeFieldPath = (path: string) =>
  !path.includes('|') && !hasUnsafeFieldKey(path)

/** Fail before RHF registers malformed names or follows prototype properties. */
export const assertFieldName = (id: unknown): void => {
  if (typeof id !== 'string' || id.length === 0) {
    throw new Error(
      'Accessible React Form field id must be a nonempty string. Supply a field name such as "name", "profile.name", or "items.0.name".'
    )
  }
  if (id.includes('|')) {
    throw new Error(
      'Accessible React Form field ids cannot contain | because React Hook Form rewrites those names. Choose a different field name.'
    )
  }
  const firstKey = id
    .replace(/["']/g, '')
    .split(/[.[\]]/)
    .find(Boolean)
  if (firstKey === 'root') {
    throw new Error(
      'Accessible React Form field ids beginning with root are reserved by React Hook Form. Choose a different top-level name, such as profile.name. Nested names such as profile.root remain supported.'
    )
  }
  if (hasUnsafeFieldKey(id)) {
    throw new Error(
      'Accessible React Form field id uses a reserved path segment. Avoid Object.prototype names such as toString and constructor, and the prototype segment. Choose a different field name.'
    )
  }
}

/** Literal separators and symbols cannot name a native RHF field path. */
export const schemaFieldPath = (path: StandardSchemaV1.Issue['path']) => {
  if (!path?.length) return undefined
  const keys = path.map((segment) =>
    typeof segment === 'object' ? segment.key : segment
  )
  if (
    !keys.every((key) =>
      typeof key === 'number'
        ? Number.isInteger(key) && key >= 0
        : typeof key === 'string' &&
          key.length > 0 &&
          !/[.[\]"'|]/.test(key) &&
          !unsafeKeys.has(key)
    )
  )
    return undefined
  return keys.join('.')
}
