import { Route, Routes } from 'react-router-dom'
import { DocsLayout } from './DocsLayout'
import { Introduction } from './pages/Introduction'
import { Quickstart } from './pages/Quickstart'
import { Styling } from './pages/Styling'
import { Validation } from './pages/Validation'
import { Accessibility } from './pages/Accessibility'
import { ComponentsOverview } from './pages/ComponentsOverview'
import { ComponentPage } from './pages/ComponentPage'
import { NotFound } from './pages/NotFound'

export const DocsRoutes = () => {
  return (
    <DocsLayout>
      <Routes>
        <Route index element={<Introduction />} />
        <Route path="quickstart" element={<Quickstart />} />
        <Route path="styling" element={<Styling />} />
        <Route path="validation" element={<Validation />} />
        <Route path="accessibility" element={<Accessibility />} />
        <Route path="components" element={<ComponentsOverview />} />
        <Route path="components/:name" element={<ComponentPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DocsLayout>
  )
}
