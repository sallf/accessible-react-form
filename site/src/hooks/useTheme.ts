import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'system'

const apply = (theme: Theme) => {
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark = theme === 'dark' || (theme === 'system' && systemDark)
  document.documentElement.classList.toggle('dark', dark)
}

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    return stored ?? 'system'
  })

  useEffect(() => {
    apply(theme)
    if (theme === 'system') {
      localStorage.removeItem('theme')
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const onChange = () => apply('system')
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    } else {
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  return { theme, setTheme }
}
