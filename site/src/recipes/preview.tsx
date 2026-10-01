import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import Usage from './contact/Usage'
import './preview.css'

function Preview() {
  useEffect(() => {
    const root = document.getElementById('root')!
    const observer = new ResizeObserver(() => {
      const height = Math.ceil(root.getBoundingClientRect().height)
      if (height > 0)
        window.parent.postMessage(
          { type: 'contact-preview-height', height },
          window.location.origin
        )
    })
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  return <Usage />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Preview />
  </StrictMode>
)
