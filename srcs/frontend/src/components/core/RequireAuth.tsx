import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/v1/me', { credentials: 'include', signal: controller.signal })
      .then(r => {
        if (r.ok) setChecking(false)
        else navigate('/login', { replace: true })
      })
      .catch(err => { if (err.name !== 'AbortError') navigate('/login', { replace: true }) })
    return () => controller.abort()
  }, [navigate])

  if (checking) return null
  return <>{children}</>
}
