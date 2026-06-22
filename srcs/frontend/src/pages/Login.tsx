import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'
import { NightModeBackground, useNightMode } from '../components/core/NightMode'
import Footer from '../components/core/Footer'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

async function loginRequest(username: string, password: string): Promise<void> {
  const res = await fetch(`${API_BASE.replace(/\/$/, '')}/v1/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { detail?: string }
    throw new Error(data.detail ?? 'Credenciais inválidas.')
  }
}

export default function Login() {
  return <LoginContent />
}

function LoginContent() {
  const { isNightMode } = useNightMode()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await loginRequest(username.trim(), password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao iniciar sessão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="relative min-h-screen w-full px-3 md:px-5 py-2 font-['Nunito',sans-serif] overflow-x-hidden"
    >
      {/* Decorative bushes */}
      <img src="/src/assets/bush.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] left-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-48 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="/src/assets/bush_night.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] left-[-3%] z-2 w-28 sm:w-36 md:w-44 lg:w-48 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="/src/assets/bush2.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] right-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-48 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="/src/assets/bush2_night.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] right-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-48 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />

      <NightModeBackground dayImage="/src/assets/content2.webp" nightImage="/src/assets/noite.webp" />

      {/* Centred cloud card */}
      <div className="flex flex-1 items-center justify-center relative z-10 py-8">
        <div className="relative w-full max-w-md flex items-center justify-center">

          {/* Cloud background image */}
          <img
            src="/src/assets/cloud_menu2.webp"
            alt="" aria-hidden="true"
            className="pointer-events-none w-full object-contain"
          />

          {/* Form content sits on top of the cloud */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-[25%] gap-4">

            <h1 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-black text-[#1e3a8a] text-center">
              Entrar
            </h1>

            {error && (
              <div role="alert" className="w-full flex items-start gap-2 rounded-xl border border-brand-red-200 bg-brand-red-100 px-3 py-2">
                <AlertCircle size={14} className="shrink-0 text-brand-red-500 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-brand-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3" noValidate>

              <div>
                <label htmlFor="login-username" className="block font-['Fredoka',sans-serif] font-bold text-sm text-[#1e3a8a] mb-1">
                  Utilizador
                </label>
                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  required
                  disabled={loading}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-800 bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-brand-blue-400 focus:ring-brand-blue-300 disabled:bg-neutral-50 disabled:cursor-not-allowed transition-colors duration-150"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block font-['Fredoka',sans-serif] font-bold text-sm text-[#1e3a8a] mb-1">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-800 bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-brand-blue-400 focus:ring-brand-blue-300 disabled:bg-neutral-50 disabled:cursor-not-allowed transition-colors duration-150"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !username || !password}
                aria-busy={loading}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-pill px-6 py-2.5 font-['Fredoka',sans-serif] font-bold text-sm text-white bg-brand-blue-500 hover:bg-brand-blue-400 active:bg-brand-blue-600 disabled:bg-neutral-300 disabled:cursor-not-allowed shadow-sm transition-colors duration-150"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    A entrar…
                  </>
                ) : 'Confirmar'}
              </button>

            </form>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}