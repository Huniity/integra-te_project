import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Read from './pages/Read'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<div style={{ padding: '64px', textAlign: 'center', fontFamily: 'Nunito, sans-serif' }}>Homepage (a desenvolver)</div>} />
            <Route path="/read" element={<Read />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
