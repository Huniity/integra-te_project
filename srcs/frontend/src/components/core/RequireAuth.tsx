import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchWithConfig } from '../../services/api'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetchWithConfig('/v1/me')
      .then(() => setChecking(false))
      .catch(() => navigate('/login', { replace: true }))
  }, [navigate])

  if (checking) return null
  return <>{children}</>
}
