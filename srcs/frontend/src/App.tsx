import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Resolver from './pages/Resolver'
import Games from './pages/Jogos'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/exercicios" element={<Resolver />} />
        <Route path="/exercicios/*" element={<Resolver />} />
        <Route path="/jogos" element={<Games />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
