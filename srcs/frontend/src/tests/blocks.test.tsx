import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { VideoBlock, DownloadBlock, ContentBlock } from '../components/learn/blocks'
import type { Conteudo } from '../libs/api'

/* Minimal valid Conteudo - override individual fields per test */
const base: Conteudo = {
  id            : 'abc-123',
  tema_id       : 'tema-1',
  tipo          : 'texto',
  titulo        : 'Título de teste',
  corpo         : '',
  ficheiro      : null,
  url_externa   : null,
  thumbnail     : null,
  dificuldade   : null,
  descarregavel : false,
  publicado     : true,
  criado_em     : '2024-01-01T00:00:00Z',
}

/* Wrapper disables animations so tests aren't timing-dependent */
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="always">
      <MemoryRouter>{children}</MemoryRouter>
    </MotionConfig>
  )
}

/* VideoBlock */
describe('VideoBlock', () => {
  const videoBlock: Conteudo = {
    ...base,
    tipo        : 'video',
    url_externa : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  }

  it('shows the play button facade on initial render — no iframe', () => {
    render(<VideoBlock block={videoBlock} />, { wrapper: Wrapper })
    expect(screen.queryByTitle(/vídeo/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reproduzir/i })).toBeInTheDocument()
  })

  it('inserts the iframe after the user clicks play', async () => {
    render(<VideoBlock block={videoBlock} />, { wrapper: Wrapper })
    await userEvent.click(screen.getByRole('button', { name: /reproduzir/i }))
    const iframe = screen.getByTitle(/vídeo/i)
    expect(iframe).toBeInTheDocument()
  })

  it('never includes autoplay in the iframe src', async () => {
    render(<VideoBlock block={videoBlock} />, { wrapper: Wrapper })
    await userEvent.click(screen.getByRole('button', { name: /reproduzir/i }))
    const iframe = screen.getByTitle(/vídeo/i) as HTMLIFrameElement
    expect(iframe.src).not.toContain('autoplay')
  })
})

/* DownloadBlock */
describe('DownloadBlock', () => {
  it('shows a download link when descarregavel is true and ficheiro exists', () => {
    const block: Conteudo = { ...base, tipo: 'pdf', ficheiro: 'docs/ficha.pdf', descarregavel: true }
    render(<DownloadBlock block={block} />, { wrapper: Wrapper })
    expect(screen.getByRole('link', { name: /descarregar/i })).toBeInTheDocument()
  })

  it('shows a view-only notice when descarregavel is false', () => {
    const block: Conteudo = { ...base, tipo: 'pdf', ficheiro: 'docs/ficha.pdf', descarregavel: false }
    render(<DownloadBlock block={block} />, { wrapper: Wrapper })
    expect(screen.queryByRole('link', { name: /descarregar/i })).not.toBeInTheDocument()
    expect(screen.getByText(/apenas para visualização/i)).toBeInTheDocument()
  })

  it('renders nothing when ficheiro is null', () => {
    const block: Conteudo = { ...base, tipo: 'pdf', ficheiro: null, descarregavel: true }
    const { container } = render(<DownloadBlock block={block} />, { wrapper: Wrapper })
    expect(container.firstChild).toBeNull()
  })
})

/* ContentBlock dispatcher */
describe('ContentBlock', () => {
  it('does not render the unknown-tipo fallback for valid tipos', () => {
    const tipos = ['texto', 'imagem', 'video', 'pdf'] as const
    tipos.forEach((tipo) => {
      const { unmount } = render(
        <ContentBlock block={{ ...base, tipo }} />,
        { wrapper: Wrapper },
      )
      expect(screen.queryByText(/tipo de conteúdo não reconhecido/i)).not.toBeInTheDocument()
      unmount()
    })
  })

  it('renders the fallback for an unrecognised tipo', () => {
    const block = { ...base, tipo: 'desconhecido' } as unknown as Conteudo
    render(<ContentBlock block={block} />, { wrapper: Wrapper })
    expect(screen.getByText(/tipo de conteúdo não reconhecido/i)).toBeInTheDocument()
  })
})