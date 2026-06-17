import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Ler from './pages/Read'
import Homepage from './pages/Homepage'
import Resolver from './pages/Resolver'
import Jogos from './pages/Jogos'
import Aprender from './pages/Aprender'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/resolver" element={<Resolver />} />
        <Route path="/jogos" element={<Jogos />} />
        <Route path="/ler" element={<Ler />} />
        <Route path="/aprender" element={<Aprender />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
