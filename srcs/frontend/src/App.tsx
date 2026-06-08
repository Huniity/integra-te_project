import './App.css'

/* ─────────────────────────────────────────────────────────────────
   INTEGRA-TE — Design Token Showcase
   This file must be deleted once real pages are wired in -- Giulio
   Shows every colour token from index.css @theme working live.
   ───────────────────────────────────────────────────────────────── */

type Swatch = { shade: string; hex: string }
type Palette = { label: string; swatches: Swatch[] }

const palettes: Palette[] = [
  {
    label: 'Primary — Blue',
    swatches: [
      { shade: '600', hex: '#1F3C6E' },
      { shade: '500', hex: '#2E5BAA' },
      { shade: '400', hex: '#4C7ED3' },
      { shade: '300', hex: '#57A9EC' },
      { shade: '200', hex: '#AFCDF5' },
      { shade: '100', hex: '#E6F1FF' },
    ],
  },
  {
    label: 'Secondary — Green',
    swatches: [
      { shade: '600', hex: '#0F8A3B' },
      { shade: '500', hex: '#17A44A' },
      { shade: '400', hex: '#4BCB73' },
      { shade: '300', hex: '#37D91E' },
      { shade: '200', hex: '#CFF8DA' },
      { shade: '100', hex: '#EAFDF0' },
    ],
  },
  {
    label: 'Secondary — Yellow',
    swatches: [
      { shade: '600', hex: '#C4CC00' },
      { shade: '500', hex: '#DDE600' },
      { shade: '400', hex: '#EBF400' },
      { shade: '300', hex: '#F6FF00' },
      { shade: '200', hex: '#FAFF66' },
      { shade: '100', hex: '#FDFFCC' },
    ],
  },
  {
    label: 'Secondary — Orange',
    swatches: [
      { shade: '600', hex: '#CC5F00' },
      { shade: '500', hex: '#E66C00' },
      { shade: '400', hex: '#FF8A3A' },
      { shade: '300', hex: '#FF7700' },
      { shade: '200', hex: '#FFB380' },
      { shade: '100', hex: '#FFE3D8' },
    ],
  },
  {
    label: 'Secondary — Red',
    swatches: [
      { shade: '600', hex: '#8F0000' },
      { shade: '500', hex: '#A80000' },
      { shade: '400', hex: '#FF6A6A' },
      { shade: '300', hex: '#C40000' },
      { shade: '200', hex: '#FFB3B3' },
      { shade: '100', hex: '#FFE6E6' },
    ],
  },
]

const neutrals: Swatch[] = [
  { shade: '900', hex: '#121212' },
  { shade: '800', hex: '#1E1E1E' },
  { shade: '700', hex: '#2C2C2C' },
  { shade: '600', hex: '#3A3A3A' },
  { shade: '500', hex: '#6E6E6E' },
  { shade: '400', hex: '#9E9E9E' },
  { shade: '300', hex: '#C4C4C4' },
  { shade: '200', hex: '#E0E0E0' },
  { shade: '100', hex: '#F5F5F5' },
  { shade: '50',  hex: '#FAFAFA' },
]

/** Returns true when hex colour is visually light (use dark text on top). */
function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 155
}

function SwatchCard({ swatch }: { swatch: Swatch }) {
  const dark = !isLight(swatch.hex)
  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl shadow-sm border border-neutral-200/60 transition-transform hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Colour block */}
      <div
        className="h-16 w-full"
        style={{ backgroundColor: swatch.hex }}
        aria-label={`Colour swatch ${swatch.hex}`}
      />
      {/* Metadata */}
      <div
        className="px-2.5 py-2 bg-white"
      >
        <p className="font-display text-xs font-700 text-neutral-700 leading-none">
          {swatch.shade}
        </p>
        <p className="font-mono text-[10px] text-neutral-400 mt-0.5 tracking-wide">
          {swatch.hex}
        </p>
      </div>
    </div>
  )
}

function PaletteSection({ palette }: { palette: Palette }) {
  return (
    <section>
      <h2 className="font-display text-sm font-800 text-neutral-500 uppercase tracking-widest mb-3">
        {palette.label}
      </h2>
      <div className="grid grid-cols-6 gap-3">
        {palette.swatches.map((sw) => (
          <SwatchCard key={sw.shade} swatch={sw} />
        ))}
      </div>
    </section>
  )
}

/* Button preview */
function ButtonShowcase() {
  return (
    <section>
      <h2 className="font-display text-sm font-800 text-neutral-500 uppercase tracking-widest mb-4">
        Buttons — Tailwind tokens in action
      </h2>
      <div className="flex flex-wrap gap-3 items-center">
        {/* Primary */}
        <button className="
          font-display font-800 text-sm text-white
          bg-brand-blue-500 hover:bg-brand-blue-400 active:bg-brand-blue-600
          px-6 py-2.5 rounded-pill
          shadow-sm transition-colors duration-150
        ">
          Primário
        </button>

        {/* Secondary outlined */}
        <button className="
          font-display font-800 text-sm text-neutral-800
          bg-white hover:bg-neutral-100 active:bg-neutral-200
          border border-neutral-200 hover:border-neutral-300
          px-6 py-2.5 rounded-pill
          shadow-sm transition-colors duration-150
        ">
          Secundário
        </button>

        {/* Green */}
        <button className="
          font-display font-800 text-sm text-white
          bg-brand-green-500 hover:bg-brand-green-400 active:bg-brand-green-600
          px-6 py-2.5 rounded-pill
          shadow-sm transition-colors duration-150
        ">
          Confirmar ✓
        </button>

        {/* Orange */}
        <button className="
          font-display font-800 text-sm text-white
          bg-brand-orange-500 hover:bg-brand-orange-400 active:bg-brand-orange-600
          px-6 py-2.5 rounded-pill
          shadow-sm transition-colors duration-150
        ">
          Aviso ⚠
        </button>

        {/* Red */}
        <button className="
          font-display font-800 text-sm text-white
          bg-brand-red-500 hover:bg-brand-red-400 active:bg-brand-red-600
          px-6 py-2.5 rounded-pill
          shadow-sm transition-colors duration-150
        ">
          Eliminar ✕
        </button>

        {/* Disabled */}
        <button
          disabled
          className="
            font-display font-800 text-sm text-neutral-400
            bg-neutral-100 cursor-not-allowed
            px-6 py-2.5 rounded-pill
          "
        >
          Desativado
        </button>
      </div>
    </section>
  )
}

/* Typography preview */
function TypographyShowcase() {
  return (
    <section>
      <h2 className="font-display text-sm font-800 text-neutral-500 uppercase tracking-widest mb-4">
        Typography — font-display / font-body
      </h2>
      <div className="bg-brand-blue-100 rounded-card p-6 flex flex-col gap-2">
        <p className="font-display text-3xl font-900 text-brand-blue-600">INTEGRA-TE</p>
        <p className="font-display text-xl font-700 text-brand-blue-500">Aprender · Jogar · Crescer</p>
        <p className="font-body text-base text-neutral-600">
          Plataforma educativa para crianças do 1.º Ciclo do Ensino Básico, apoiada pela Fundação António Aleixo e cofinanciada pela União Europeia — Portugal 2030.
        </p>
        <p className="font-mono text-sm text-neutral-400">bg-brand-blue-100  ·  font-display  ·  rounded-card</p>
      </div>
    </section>
  )
}

/* App */
export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 font-body">

      {/* Header */}
      <header className="bg-brand-blue-500 text-white px-8 py-5 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-900 text-white tracking-tight">
              INTEGRA-TE
            </h1>
            <p className="text-brand-blue-200 text-sm font-600 mt-0.5">
              Design System — Token Showcase
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 bg-brand-blue-400/40 text-brand-blue-100 text-xs font-700 px-3 py-1.5 rounded-pill">
            index.css @theme ✓
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-12">

        {/* Intro callout */}
        <div className="bg-brand-green-100 border border-brand-green-300 rounded-card px-5 py-4">
          <p className="font-display text-sm font-800 text-brand-green-600">
            ✓ Tokens carregados com sucesso
          </p>
          <p className="text-sm text-brand-green-500 mt-1">
            Todos os tokens abaixo são gerados a partir do bloco <code className="font-mono bg-brand-green-200 px-1 rounded text-xs">@theme</code> em <code className="font-mono bg-brand-green-200 px-1 rounded text-xs">src/index.css</code>.
            Use-os como classes Tailwind: <code className="font-mono bg-brand-green-200 px-1 rounded text-xs">bg-brand-blue-500</code>, <code className="font-mono bg-brand-green-200 px-1 rounded text-xs">text-brand-orange-600</code>, <code className="font-mono bg-brand-green-200 px-1 rounded text-xs">font-display</code>, etc.
          </p>
        </div>

        {/* Colour palettes */}
        {palettes.map((p) => (
          <PaletteSection key={p.label} palette={p} />
        ))}

        {/* Neutrals */}
        <section>
          <h2 className="font-display text-sm font-800 text-neutral-500 uppercase tracking-widest mb-3">
            Neutral — Gray
          </h2>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
            {neutrals.map((sw) => (
              <SwatchCard key={sw.shade} swatch={sw} />
            ))}
          </div>
        </section>

        {/* Buttons */}
        <ButtonShowcase />

        {/* Typography */}
        <TypographyShowcase />

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 mt-8 py-5 px-6 text-center">
        <p className="text-xs text-neutral-400 font-display">
          INTEGRA-TE · Fundação António Aleixo · Loulé Concelho · Portugal 2030 · União Europeia
        </p>
      </footer>

    </div>
  )
}