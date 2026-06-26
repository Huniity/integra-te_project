import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/core/Navbar'
import { NightModeProvider } from './components/core/NightMode'
import { AccessibilityProvider } from './components/core/Accessibility'
import { QuickLinkButtons } from './components/core/QuickLinkButtons'
import PageTransition from './components/core/PageTransition'
import RouteSeo from './components/core/Seo'
import Home from './pages/Homepage'
import About from './pages/About'
import Faq from './pages/Faq'
import Privacy from './pages/Privacy'
import Contact from './pages/Contactos'
import Aprender from './pages/Aprender'
import Resolver from './pages/Resolver'
import Jogos from './pages/Jogos'
import Descarregar from './pages/Descarregar'
import Videos from './pages/Videos'
import Ler from './pages/Ler'
import Dashboard from './pages/Dashboard'
import RequireAuth from './components/core/RequireAuth'
import './App.css'
import Login from './pages/Login'
import Rgpd from './pages/Rgpd'

function PageStub({ title }: { title: string }) {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6">
      <h1 className="font-display text-4xl font-black text-neutral-700">{title}</h1>
      <p className="font-body text-neutral-400">Página em construção</p>
    </main>
  )
}

function wrap(el: React.ReactNode) {
  return <PageTransition>{el}</PageTransition>
}

export default function App() {
  const location = useLocation()
  const baseKey = location.pathname.split('/')[1] || 'home'

  return (
    <NightModeProvider>
      <AccessibilityProvider>
        <RouteSeo />
        <QuickLinkButtons />
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={baseKey}>
            <Route path="/"            element={wrap(<Home />)} />
            <Route path="/login"       element={wrap(<Login />)} />
            <Route path="/aprender"    element={wrap(<Aprender />)} />
            <Route path="/aprender/:id" element={wrap(<Aprender />)} />
            <Route path="/resolver"    element={wrap(<Resolver />)} />
            <Route path="/resolver/:id" element={wrap(<Resolver />)} />
            <Route path="/jogos"       element={wrap(<Jogos />)} />
            <Route path="/jogar/:id"   element={wrap(<Jogos />)} />
            <Route path="/ler"         element={wrap(<Ler />)} />
            <Route path="/ler/:id"     element={wrap(<Ler />)} />
            <Route path="/descarregar" element={wrap(<Descarregar />)} />
            <Route path="/videos"      element={wrap(<Videos />)} />
            <Route path="/sobre"       element={wrap(<About />)} />
            <Route path="/faq"         element={wrap(<Faq />)} />
            <Route path="/privacidade" element={wrap(<Privacy />)} />
            <Route path="/rgpd"        element={wrap(<Rgpd />)} />
            <Route path="/contactar"   element={wrap(<Contact />)} />
            <Route path="/dashboard"   element={wrap(<RequireAuth><Dashboard /></RequireAuth>)} />
            <Route path="*"            element={wrap(<PageStub title="Página não encontrada" />)} />
          </Routes>
        </AnimatePresence>
      </AccessibilityProvider>
    </NightModeProvider>
  )
}
