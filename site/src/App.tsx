import { Nav } from './components/Nav'
import { Hero } from './sections/Hero'
import { Features } from './sections/Features'
import { Components } from './sections/Components'
import { SchemaPhilosophy } from './sections/SchemaPhilosophy'
import { Comparison } from './sections/Comparison'
import { Footer } from './components/Footer'

export const App = () => {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav />
      <main>
        <Hero />
        <Features />
        <Components />
        <SchemaPhilosophy />
        <Comparison />
      </main>
      <Footer />
    </div>
  )
}
