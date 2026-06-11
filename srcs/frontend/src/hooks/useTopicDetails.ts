import { useState, useEffect } from 'react'
import { api, ApiError } from '../lib/api'
import type { TemaDetail } from '../lib/api'

/* ─── State machine ──────────────────────────────────────────────── */

export type TopicState =
  | { status: 'loading' }
  | { status: 'not_found' }
  | { status: 'error'; message: string }
  | { status: 'ok'; data: TemaDetail }

/* ─── Hook ───────────────────────────────────────────────────────── */

export function useTopicDetail(temaSlug: string | undefined): TopicState {
  const [state, setState] = useState<TopicState>({ status: 'loading' })

  useEffect(() => {
    if (!temaSlug) {
      setState({ status: 'not_found' })
      return
    }

    let cancelled = false
    setState({ status: 'loading' })

    api.getTema(temaSlug)
      .then((data) => {
        if (cancelled) return
        // Filter to only publicado conteúdos, sorted by ordem
        const filtered = [...data.conteudos]
          .filter((c) => c.publicado)
          .sort((a, b) => a.ordem - b.ordem)
        setState({ status: 'ok', data: { ...data, conteudos: filtered } })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 404) {
          setState({ status: 'not_found' })
        } else {
          const message =
            err instanceof Error ? err.message : 'Erro ao carregar o tema.'
          setState({ status: 'error', message })
        }
      })

    return () => { cancelled = true }
  }, [temaSlug])

  return state
}