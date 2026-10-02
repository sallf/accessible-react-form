// Consumer references come first; conditional library references follow.
export const describedBy = (...references: (string | undefined)[]) => {
  const tokens = references
    .flatMap((reference) => reference?.split(/\s+/) ?? [])
    .filter(Boolean)
  return [...new Set(tokens)].join(' ') || undefined
}
