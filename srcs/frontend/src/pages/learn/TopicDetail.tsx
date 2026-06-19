import { useParams, NavLink } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useTopicDetail } from '../../hooks/useTopicDetail'
import { ContentBlock }   from '../../components/learn/blocks'

export default function TopicDetail() {
  const { disciplinaSlug, temaSlug } = useParams<{
    disciplinaSlug : string
    temaSlug       : string
  }>()

  const state = useTopicDetail(temaSlug)

  /* Shared back link (reused across all non-ok states) */
  const backLink = (
    <NavLink
      to={`/learn/${disciplinaSlug ?? ''}`}
      className="
        inline-flex items-center gap-1.5
        font-display text-sm font-bold
        text-brand-blue-500 hover:text-brand-blue-400
        transition-colors duration-150
      "
    >
      <ArrowLeft size={16} aria-hidden="true" />
      Voltar
    </NavLink>
  )

  /* Loading */
  if (state.status === 'loading') {
    return (
      <main id="main-content" className="mx-auto max-w-2xl px-4 py-10">
        <div className="animate-pulse space-y-4" aria-busy="true" aria-label="A carregar tema">
          <div className="h-4 w-24 rounded bg-neutral-200" />
          <div className="h-8 w-3/4 rounded bg-neutral-200" />
          <div className="h-4 w-1/2 rounded bg-neutral-200" />
          <div className="h-40 rounded-2xl bg-neutral-200" />
          <div className="h-40 rounded-2xl bg-neutral-200" />
        </div>
      </main>
    )
  }

  /* Not found */
  if (state.status === 'not_found') {
    return (
      <main id="main-content" className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="mb-4 text-5xl select-none" role="img" aria-label="Não encontrado">🔍</p>
        <h1 className="font-display font-black text-2xl text-neutral-700 mb-2">
          Tema não encontrado
        </h1>
        <p className="font-body text-neutral-400 mb-6">
          Este tema não existe ou foi removido.
        </p>
        {backLink}
      </main>
    )
  }

  /* Error */
  if (state.status === 'error') {
    return (
      <main id="main-content" className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="mb-4 text-5xl select-none" role="img" aria-label="Erro">⚠️</p>
        <h1 className="font-display font-black text-2xl text-neutral-700 mb-2">
          Ocorreu um erro
        </h1>
        <p className="font-body text-neutral-400 mb-6">{state.message}</p>
        {backLink}
      </main>
    )
  }

  /* OK */
  const { data } = state

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-4 py-10">

      {/* Breadcrumb */}
      <nav aria-label="Localização" className="mb-6">
        {backLink}
      </nav>

      {/* Topic header */}
      <header className="mb-8">
        <span className="
          inline-block mb-2
          font-display text-xs font-bold uppercase tracking-widest
          text-brand-blue-400
        ">
          {data.disciplina.nome} · {data.ano_escolar}
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-800 leading-tight">
          {data.titulo}
        </h1>
        {data.desc && (
          <p className="mt-3 font-body text-neutral-500 leading-relaxed">
            {data.desc}
          </p>
        )}
      </header>

      {/* Content blocks */}
      <div className="flex flex-col gap-6">
        {data.conteudos.map((c) => (
          <ContentBlock key={c.id} block={c} />
        ))}
      </div>

    </main>
  )
}