import { useState } from 'react'

export const CopyButton = ({
  text,
  label = 'Copy to clipboard',
}: {
  text: string
  label?: string
}) => {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)

  const onClick = async () => {
    setFailed(false)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
      setFailed(true)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={onClick}
        className="text-xs px-2 py-1 rounded border border-border text-fg-muted hover:text-fg hover:bg-bg-subtle transition-colors"
        aria-label={copied ? 'Copied' : label}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <span
        role="status"
        className={
          failed
            ? 'max-w-64 rounded bg-bg px-2 py-1 text-xs text-fg'
            : 'sr-only'
        }
      >
        {failed
          ? 'Copy failed. Select the code and copy it manually.'
          : copied
            ? 'Code copied.'
            : ''}
      </span>
    </div>
  )
}
