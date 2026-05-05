import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { docsNav } from './docsNav'

type Props = {
  children: ReactNode
}

export const DocsLayout = ({ children }: Props) => {
  return (
    <div className="max-w-7xl mx-auto px-6 flex gap-10">
      <aside className="hidden lg:block w-56 shrink-0 py-10 sticky top-14 self-start max-h-[calc(100vh-3.5rem)] overflow-y-auto">
        <nav aria-label="Documentation">
          {docsNav.map((section) => (
            <div key={section.title} className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-fg-muted mb-2">
                {section.title}
              </div>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      end={link.path === '/docs'}
                      className={({ isActive }) =>
                        `block text-sm py-1 px-2 -mx-2 rounded transition-colors ${
                          isActive
                            ? 'bg-bg-subtle text-accent font-medium'
                            : 'text-fg-muted hover:text-fg'
                        }`
                      }
                    >
                      {link.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 min-w-0 py-10 max-w-3xl">
        <article className="prose-doc">{children}</article>
      </main>
    </div>
  )
}
