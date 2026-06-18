import { Routes, Route } from 'react-router-dom'
import Navbar    from './components/core/Navbar'
import Home      from './pages/Homepage'
import About     from './pages/About'
import Faq       from './pages/Faq'
import Privacy   from './pages/Privacy'
import Contact   from './pages/Contactos'
import Aprender  from './pages/Aprender'
import Resolver  from './pages/Resolver'
import Jogos     from './pages/Jogos'
import Ler       from './pages/Ler'
import Styleguide from './pages/Styleguide'
import './App.css'

/* Placeholder for pages that are scoped but not yet built */
function PageStub({ title }: { title: string }) {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6">
      <h1 className="font-display text-4xl font-black text-neutral-700">{title}</h1>
      <p className="font-body text-neutral-400">Página em construção</p>
    </main>
  )
}

/* Route table */
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Core pages */}
        <Route path="/"             element={<Home />} />
        <Route path="/aprender"     element={<Aprender />} />
        <Route path="/resolver"     element={<Resolver />} />
        <Route path="/jogos"        element={<Jogos />} />
        <Route path="/ler"          element={<Ler />} />

        {/* Info pages */}
        <Route path="/sobre"        element={<About />} />
        <Route path="/faq"          element={<Faq />} />
        <Route path="/privacidade"  element={<Privacy />} />
        <Route path="/contactar"    element={<Contact />} />

        {/* Search - stub until search page is built */}
        <Route path="/pesquisar"    element={<PageStub title="Pesquisar" />} />

        {/* Dev/design tooling */}
        <Route path="/styleguide"   element={<Styleguide />} />

        {/* Catch-all */}
        <Route path="*"             element={<PageStub title="Página não encontrada" />} />
      </Routes>
    </>
  )
}