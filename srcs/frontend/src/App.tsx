import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Read from './pages/Read'
import Homepage from './pages/Homepage'
import Resolver from './pages/Resolver'
import './App.css'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/exercicios" element={<Resolver />} />
        <Route path="/exercicios/*" element={<Resolver />} />
        <Route path="/read" element={<Read />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
