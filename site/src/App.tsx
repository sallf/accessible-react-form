import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { DocsRoutes } from './pages/docs/DocsRoutes'

export const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg text-fg flex flex-col">
        <Nav />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <main className="flex-1">
                  <Home />
                </main>
                <Footer />
              </>
            }
          />
          <Route path="/docs/*" element={<DocsRoutes />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
