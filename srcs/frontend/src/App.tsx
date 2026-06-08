import { Routes, Route } from 'react-router-dom'
import Navbar from './components/core/Navbar'
import './App.css'

/* Temporary page stubs to be replaced with real page components */
function PageStub({ title, emoji }: { title: string; emoji: string }) {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6">
      <span className="text-7xl select-none" role="img" aria-hidden="true">{emoji}</span>
      <h1 className="font-display text-4xl font-black text-neutral-700">{title}</h1>
      <p className="font-body text-neutral-400">Página em construção</p>
    </main>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <Routes>
        <Route path="/"         element={<PageStub title="Início"                emoji="🏠" />} />
        <Route path="/learn"    element={<PageStub title="Aprender"              emoji="📚" />} />
        <Route path="/practice" element={<PageStub title="Exercícios"            emoji="💪" />} />
        <Route path="/play"     element={<PageStub title="Jogos"                 emoji="🎮" />} />
        <Route path="/read"     element={<PageStub title="Ler"                   emoji="📖" />} />
        <Route path="/about"    element={<PageStub title="Sobre"                 emoji="ℹ️"  />} />
        <Route path="/contact"  element={<PageStub title="Contactos"             emoji="✉️"  />} />
        <Route path="/search"   element={<PageStub title="Pesquisar"             emoji="🔍" />} />
        <Route path="*"         element={<PageStub title="Página não encontrada" emoji="🤔" />} />
      </Routes>
    </div>
  )
}