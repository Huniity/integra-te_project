import { Routes, Route } from 'react-router-dom'
import Navbar    from './components/core/Navbar'
import { NightModeProvider } from './components/core/NightMode'
import Home      from './pages/Homepage'
import About     from './pages/About'
import Faq       from './pages/Faq'
import Privacy   from './pages/Privacy'
import Rgpd      from './pages/Rgpd'
import Contact   from './pages/Contactos'
import Aprender  from './pages/Aprender'
import Resolver  from './pages/Resolver'
import Jogos     from './pages/Jogos'
import Descarregar from './pages/Descarregar'
import Videos    from './pages/Videos'
import Ler       from './pages/Ler'
import Dashboard from './pages/Dashboard'
import RequireAuth from './components/core/RequireAuth'
import './App.css'
import Login from './pages/Login'

function PageStub({ title }: { title: string }) {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6">
      <h1 className="font-display text-4xl font-black text-neutral-700">{title}</h1>
      <p className="font-body text-neutral-400">Página em construção</p>
    </main>
  )
}

export default function App() {
  return (
    <NightModeProvider>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/aprender"    element={<Aprender />} />
        <Route path="/aprender/:id" element={<Aprender />} />
        <Route path="/resolver"    element={<Resolver />} />
        <Route path="/resolver/:id" element={<Resolver />} />
        <Route path="/jogos"       element={<Jogos />} />
        <Route path="/jogar/:id"   element={<Jogos />} />
        <Route path="/ler"         element={<Ler />} />
        <Route path="/ler/:id"     element={<Ler />} />
        <Route path="/descarregar" element={<Descarregar />} />
        <Route path="/videos"      element={<Videos />} />
        <Route path="/sobre"       element={<About />} />
        <Route path="/faq"         element={<Faq />} />
        <Route path="/privacidade" element={<Privacy />} />
        <Route path="/rgpd"        element={<Rgpd />} />
        <Route path="/contactar"   element={<Contact />} />
        <Route path="/dashboard"   element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="*"            element={<PageStub title="Página não encontrada" />} />
      </Routes>
    </NightModeProvider>
  )
}