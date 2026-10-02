import type { StandardSchemaV1 } from '@standard-schema/spec'

const unsafeKeys = new Set(['__proto__', 'constructor', 'prototype'])

export const isSafeFieldPath = (path: string) =>
  !path.includes('|') &&
  !path
    .replace(/["']/g, '')
    .split(/[.[\]]/)
    .some((key) => unsafeKeys.has(key))

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
