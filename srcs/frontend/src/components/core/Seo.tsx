import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

interface RouteMeta {
  title       : string
  description : string
  noindex?    : boolean
}

const SITE_NAME = 'INTEGRA-TE'
const ROUTE_META: Record<string, RouteMeta> = {
  home: {
    title: 'INTEGRA-TE — Plataforma educativa para crianças',
    description: 'Aulas, exercícios, jogos e livros para crianças do 1.º ao 6.º ano, organizados por disciplina. Um projeto da Fundação António Aleixo.',
  },
  aprender: {
    title: 'Aprender',
    description: 'Aulas e conteúdos para aprender Português, Matemática e Estudo do Meio, organizados por ano escolar.',
  },
  resolver: {
    title: 'Resolver',
    description: 'Exercícios de prática para consolidar o que foi aprendido em cada disciplina e ano escolar.',
  },
  jogos: {
    title: 'Jogar',
    description: 'Jogos educativos para crianças, filtrados por idade e disciplina.',
  },
  jogar: {
    title: 'Jogar',
    description: 'Jogos educativos para crianças, filtrados por idade e disciplina.',
  },
  ler: {
    title: 'Ler',
    description: 'Livros recomendados para crianças, com resumo e faixa etária.',
  },
  descarregar: {
    title: 'Descarregar',
    description: 'Materiais e fichas de trabalho disponíveis para download em PDF.',
  },
  videos: {
    title: 'Vídeos',
    description: 'Vídeos educativos sobre Português, Matemática e Estudo do Meio.',
  },
  sobre: {
    title: 'Sobre o Projeto',
    description: 'Conhece o projeto INTEGRA-TE e a Fundação António Aleixo.',
  },
  faq: {
    title: 'Perguntas Frequentes',
    description: 'Respostas às perguntas mais frequentes sobre a plataforma INTEGRA-TE.',
  },
  privacidade: {
    title: 'Política de Privacidade',
    description: 'Como o INTEGRA-TE trata os dados pessoais dos seus utilizadores.',
  },
  rgpd: {
    title: 'RGPD',
    description: 'Informação sobre o tratamento de dados pessoais no INTEGRA-TE, em conformidade com o RGPD.',
  },
  contactar: {
    title: 'Contacta-nos',
    description: 'Envia uma mensagem à equipa do INTEGRA-TE.',
  },
  login: {
    title: 'Entrar',
    description: 'Acesso reservado à equipa editorial do INTEGRA-TE.',
    noindex: true,
  },
  dashboard: {
    title: 'Dashboard',
    description: 'Gestão de conteúdos do INTEGRA-TE.',
    noindex: true,
  },
}

const NOT_FOUND_META: RouteMeta = {
  title: 'Página não encontrada',
  description: 'A página que procuras não existe ou foi movida.',
  noindex: true,
}

export default function RouteSeo() {
  const location = useLocation()
  const baseKey = location.pathname.split('/')[1] || 'home'
  const meta = ROUTE_META[baseKey] ?? NOT_FOUND_META
  const url = typeof window !== 'undefined' ? window.location.origin + location.pathname : undefined
  const fullTitle = baseKey === 'home' ? meta.title : `${meta.title} · ${SITE_NAME}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={meta.description} />
      {url && <link rel="canonical" href={url} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={meta.description} />
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={meta.description} />
      {meta.noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  )
}
