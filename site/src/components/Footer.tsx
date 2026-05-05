export const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm text-fg-muted">
        <div>
          <span className="font-mono">accessible-react-form</span> · MIT · by{' '}
          <a href="https://github.com/adam-rho" className="text-fg hover:text-accent transition-colors">
            Adam Rho
          </a>
        </div>
        <div className="flex gap-5">
          <a
            href="https://www.npmjs.com/package/accessible-react-form"
            target="_blank"
            rel="noreferrer"
            className="hover:text-fg transition-colors"
          >
            npm
          </a>
          <a
            href="https://github.com/adam-rho/accessible-react-form"
            target="_blank"
            rel="noreferrer"
            className="hover:text-fg transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://github.com/adam-rho/accessible-react-form/issues"
            target="_blank"
            rel="noreferrer"
            className="hover:text-fg transition-colors"
          >
            Issues
          </a>
        </div>
      </div>
    </footer>
  )
}
