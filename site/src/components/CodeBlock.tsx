import { useEffect, useState } from 'react'
import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import { CopyButton } from './CopyButton'

const highlighterPromise = createHighlighterCore({
  themes: [
    import('shiki/themes/github-light.mjs'),
    import('shiki/themes/github-dark.mjs'),
  ],
  langs: [import('shiki/langs/tsx.mjs')],
  engine: createOnigurumaEngine(import('shiki/wasm')),
})

type Props = {
  code: string
  lang?: string
}

export const CodeBlock = ({ code, lang = 'tsx' }: Props) => {
  const [light, setLight] = useState<string>('')
  const [dark, setDark] = useState<string>('')

  useEffect(() => {
    let cancel = false
    highlighterPromise.then((hi) => {
      if (cancel) return
      setLight(hi.codeToHtml(code, { lang, theme: 'github-light' }))
      setDark(hi.codeToHtml(code, { lang, theme: 'github-dark' }))
    })
    return () => {
      cancel = true
    }
  }, [code, lang])

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <CopyButton text={code} />
      </div>
      {light ? (
        <>
          <div className="dark:hidden text-sm" dangerouslySetInnerHTML={{ __html: light }} />
          <div className="hidden dark:block text-sm" dangerouslySetInnerHTML={{ __html: dark }} />
        </>
      ) : (
        <pre className="p-4 rounded-lg bg-bg-subtle border border-border overflow-x-auto text-sm">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
