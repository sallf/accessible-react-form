/** Compare value containers while keeping opaque browser values (File/FileList) by identity. */
export const defaultValuesEqual = (left: unknown, right: unknown): boolean => {
  const pairs = new WeakMap<object, WeakSet<object>>()
  const compare = (a: unknown, b: unknown): boolean => {
    if (Object.is(a, b)) return true
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false
    if (a instanceof Date || b instanceof Date) {
      return (
        a instanceof Date &&
        b instanceof Date &&
        Object.is(a.getTime(), b.getTime())
      )
    }
    const aPrototype = Object.getPrototypeOf(a)
    const bPrototype = Object.getPrototypeOf(b)
    if (aPrototype !== bPrototype) return false
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return false
    } else if (aPrototype !== Object.prototype && aPrototype !== null) {
      return false
    }
    if (pairs.get(a)?.has(b)) return true
    const matches = pairs.get(a) ?? new WeakSet<object>()
    matches.add(b)
    pairs.set(a, matches)
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    return (
      aKeys.length === bKeys.length &&
      aKeys.every(
        (key) =>
          Object.prototype.hasOwnProperty.call(b, key) &&
          compare(
            (a as Record<string, unknown>)[key],
            (b as Record<string, unknown>)[key]
          )
      )
    )
  }
  return compare(left, right)
}
