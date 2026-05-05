import { useState } from 'react'

export const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const onClick = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs px-2 py-1 rounded border border-border text-fg-muted hover:text-fg hover:bg-bg-subtle transition-colors"
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
