import { useTheme, type Theme } from '../hooks/useTheme'

const ThemeIcon = ({ theme }: { theme: Theme }) => {
  if (theme === 'light') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    )
  }
  if (theme === 'dark') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

export const Nav = () => {
  const { theme, setTheme } = useTheme()
  const next: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-bg/80 border-b border-border">
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="#" className="font-mono text-sm font-semibold tracking-tight">
          accessible-react-form
        </a>
        <div className="flex items-center gap-1 sm:gap-3 text-sm">
          <a
            href="#components"
            className="hidden sm:inline px-2 py-1 text-fg-muted hover:text-fg transition-colors"
          >
            Components
          </a>
          <a
            href="#comparison"
            className="hidden sm:inline px-2 py-1 text-fg-muted hover:text-fg transition-colors"
          >
            Compare
          </a>
          <a
            href="https://github.com/adam-rho/accessible-react-form"
            target="_blank"
            rel="noreferrer"
            className="px-2 py-1 text-fg-muted hover:text-fg transition-colors"
          >
            GitHub
          </a>
          <button
            type="button"
            onClick={() => setTheme(next[theme])}
            className="ml-1 p-2 rounded-md border border-border hover:bg-bg-subtle transition-colors"
            aria-label={`Theme: ${theme}. Click to change.`}
            title={`Theme: ${theme}`}
          >
            <ThemeIcon theme={theme} />
          </button>
        </div>
      </nav>
    </header>
  )
}
