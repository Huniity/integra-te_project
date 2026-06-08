import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Read from './pages/Read'
import Navbar from './components/core/Navbar'
import Footer from './components/core/Footer'
import About from './pages/About'
import Faq from './pages/Faq'
import Privacy from './pages/Privacy'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<div style={{ padding: '64px', textAlign: 'center', fontFamily: 'Nunito, sans-serif' }}>Homepage (a desenvolver)</div>} />
            <Route path="/Ler" element={<Read />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/privacidade" element={<Privacy />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
