import { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { SearchBar } from './SearchBar'
import { Search } from 'lucide-react'

/* Types */
interface NavItem {
  id           : string
  label        : string
  path         : string
  /** Coloured sphere/dot — same assets as Homepage menu buttons */
  bgImg        : string
  /** Icon layered on top of the sphere */
  iconImg      : string
  /** Tailwind classes for the active drawer row background */
  drawerActive : string
  ariaLabel    : string
}

/* Navigation data
   Order and assets mirror Homepage.tsx menuButtons exactly:
   Resolver -> Jogos -> Aprender -> Ler -> Vídeos -> Descarregar */
const NAV: NavItem[] = [
  {
    id           : 'resolver',
    label        : 'Exercícios',
    path         : '/resolver',
    bgImg        : '/src/assets/purple_dot.webp',
    iconImg      : '/src/assets/weight.webp',
    drawerActive : 'bg-brand-green-500 text-white',
    ariaLabel    : 'Exercícios — ir para os exercícios',
  },
  {
    id           : 'jogos',
    label        : 'Jogos',
    path         : '/jogos',
    bgImg        : '/src/assets/green_dot.webp',
    iconImg      : '/src/assets/controller.webp',
    drawerActive : 'bg-brand-green-600 text-white',
    ariaLabel    : 'Jogos — ir para os jogos',
  },
  {
    id           : 'aprender',
    label        : 'Aprender',
    path         : '/aprender',
    bgImg        : '/src/assets/red_dot.webp',
    iconImg      : '/src/assets/blackboard.webp',
    drawerActive : 'bg-brand-blue-500 text-white',
    ariaLabel    : 'Aprender — ir para a área de aprendizagem',
  },
  {
    id           : 'ler',
    label        : 'Ler',
    path         : '/ler',
    bgImg        : '/src/assets/salmon_dot.webp',
    iconImg      : '/src/assets/blue_book.webp',
    drawerActive : 'bg-brand-red-500 text-white',
    ariaLabel    : 'Ler — ir para a área de leitura',
  },
  {
    id           : 'videos',
    label        : 'Vídeos',
    path         : '/videos',
    bgImg        : '/src/assets/blue_dot.webp',
    iconImg      : '/src/assets/video.webp',
    drawerActive : 'bg-brand-blue-400 text-white',
    ariaLabel    : 'Vídeos — ver vídeos educativos',
  },
  {
    id           : 'descarregar',
    label        : 'Descarregar',
    path         : '/descarregar',
    bgImg        : '/src/assets/darkb_dot.webp',
    iconImg      : '/src/assets/download.webp',
    drawerActive : 'bg-brand-blue-600 text-white',
    ariaLabel    : 'Descarregar — descarregar recursos',
  },
]

/*
 * Set to the logo path once the final asset is ready.
 * To activate: drop logo.svg into /public and change null to '/logo.svg'
 */
const LOGO_SRC: string | null = null

/* Animation constants */

/** Spring used for burger bar transforms */
const BURGER_SPRING = { type: 'spring', stiffness: 420, damping: 32 } as const

/**
 * Burger bar y-offset maths:
 *   bar height = 2px (h-0.5), gap = 6px (gap-1.5)
 *   center-to-center distance between adjacent bars = 2 + 6 = 8px
 *   -> top bar moves  +8px to overlay middle bar then rotates +45°
 *   -> bottom bar moves −8px to overlay middle bar then rotates −45°
 */
const BURGER_VARIANTS = {
  top: {
    closed : { rotate: 0,  y: 0 },
    open   : { rotate: 45, y: 8 },
  },
  mid: {
    closed : { opacity: 1, scaleX: 1 },
    open   : { opacity: 0, scaleX: 0 },
  },
  bot: {
    closed : { rotate: 0,   y: 0 },
    open   : { rotate: -45, y: -8 },
  },
} satisfies Record<string, Record<string, object>>

/** Drawer slide-down + staggered children */
const DRAWER_VARIANTS: Variants = {
  hidden  : { opacity: 0, y: -12, transition: { duration: 0.15 } },
  visible : {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 320, damping: 28, staggerChildren: 0.055 },
  },
  exit    : { opacity: 0, y: -10, transition: { duration: 0.15 } },
}

const DRAWER_ITEM_VARIANTS: Variants = {
  hidden  : { opacity: 0, x: -10 },
  visible : { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 400, damping: 28 } },
}

/* Sub-components */
/* Animated burger button (mobile-only) */

interface BurgerButtonProps {
  isOpen   : boolean
  onClick  : () => void
  btnRef   : React.RefObject<HTMLButtonElement | null>
}

function BurgerButton({ isOpen, onClick, btnRef }: BurgerButtonProps) {
  return (
    <motion.button
      ref={btnRef}
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      aria-label={isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
      className="
        relative flex h-12 w-12 flex-col items-center justify-center gap-1.5
        rounded-full bg-brand-blue-100 text-brand-blue-600
        hover:bg-brand-blue-200 active:bg-brand-blue-300
        transition-colors duration-150
        md:hidden
        focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-brand-blue-400
      "
    >
      <motion.span
        aria-hidden="true"
        variants={BURGER_VARIANTS.top}
        animate={isOpen ? 'open' : 'closed'}
        transition={BURGER_SPRING}
        className="block h-0.5 w-5 rounded-full bg-current origin-center"
      />
      <motion.span
        aria-hidden="true"
        variants={BURGER_VARIANTS.mid}
        animate={isOpen ? 'open' : 'closed'}
        transition={BURGER_SPRING}
        className="block h-0.5 w-5 rounded-full bg-current origin-center"
      />
      <motion.span
        aria-hidden="true"
        variants={BURGER_VARIANTS.bot}
        animate={isOpen ? 'open' : 'closed'}
        transition={BURGER_SPRING}
        className="block h-0.5 w-5 rounded-full bg-current origin-center"
      />
    </motion.button>
  )
}

/* Desktop sphere icon — no label, active state = white ring + scale */
function DesktopNavIcon({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.path}
      aria-label={item.ariaLabel}
      className="group focus-visible:outline-none"
    >
      {({ isActive }) => (
        <motion.span
          aria-current={isActive ? 'page' : undefined}
          animate={{ scale: isActive ? 1.1 : 1 }}
          whileHover={{ scale: isActive ? 1.18 : 1.18 }}
          whileTap={{ scale: 0.90 }}
          transition={{ type: 'spring', stiffness: 550, damping: 20 }}
          className={`
            relative flex h-12 w-12 items-center justify-center rounded-full
            transition-opacity duration-150
            ${isActive
              ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent drop-shadow-lg'
              : 'opacity-90 hover:opacity-100'
            }
          `}
        >
          {/* Coloured sphere — scale kept at 1.2 so bleed stays within the gap budget */}
          <img
            src={item.bgImg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-contain scale-[1.2] pointer-events-none"
          />
          {/* Section icon — scaled up for visibility on larger screens */}
          <img
            src={item.iconImg}
            alt=""
            aria-hidden="true"
            className="relative z-10 w-[70%] h-[70%] object-contain drop-shadow-sm pointer-events-none"
          />
        </motion.span>
      )}
    </NavLink>
  )
}

/* Mobile drawer row */

function MobileNavRow({
  item,
  onClose,
  isLast,
}: {
  item    : NavItem
  onClose : () => void
  isLast  : boolean
}) {
  return (
    <motion.li variants={DRAWER_ITEM_VARIANTS} className={!isLast ? 'border-b border-neutral-100' : ''}>
      <NavLink
        to={item.path}
        onClick={onClose}
        aria-label={item.ariaLabel}
        className="focus-visible:outline-none"
      >
        {({ isActive }) => (
          <motion.div
            whileTap={{ scale: 0.97 }}
            aria-current={isActive ? 'page' : undefined}
            className={`
              flex items-center gap-4 rounded-2xl px-4 py-3.5 my-0.5
              transition-colors duration-150
              ${isActive
                ? `${item.drawerActive}`
                : 'text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200'
              }
            `}
          >
            {/* Sphere icon (large for small fingers) */}
            <span
              aria-hidden="true"
              className="relative flex h-14 w-14 shrink-0 items-center justify-center"
            >
              <img
                src={item.bgImg}
                alt=""
                className="absolute inset-0 w-full h-full object-contain scale-[1.2] pointer-events-none"
              />
              <img
                src={item.iconImg}
                alt=""
                className="relative z-10 w-[70%] h-[70%] object-contain drop-shadow-sm pointer-events-none"
              />
            </span>

            {/* Label (extra-large for low-literacy users) */}
            <span className="font-display text-xl font-extrabold leading-tight flex-1">
              {item.label}
            </span>

            {/* Active checkmark */}
            {isActive && (
              <span aria-hidden="true" className="text-white/80 text-lg mr-1">✓</span>
            )}
          </motion.div>
        )}
      </NavLink>
    </motion.li>
  )
}

/* Mobile drawer panel */
interface MobileDrawerProps {
  isOpen  : boolean
  onClose : () => void
  nav     : NavItem[]
}

function MobileDrawer({ isOpen, onClose, nav }: MobileDrawerProps) {
  const navigate = useNavigate()
  const listRef = useRef<HTMLUListElement>(null)

  /* Escape key closes drawer */
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  /* Moves focus into the drawer when it opens */
  useEffect(() => {
    if (!isOpen) return
    const first = listRef.current?.querySelector<HTMLElement>('a, button')
    first?.focus()
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (click to close) */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 top-[var(--nav-h)] z-40 bg-black/25 backdrop-blur-sm md:hidden"
          />

          {/* Drawer panel */}
          <motion.nav
            key="drawer"
            id="mobile-menu"
            role="navigation"
            aria-label="Menu de navegação"
            variants={DRAWER_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="
              absolute left-3 right-3 top-full z-50 mt-2
              rounded-3xl bg-white p-3
              shadow-[0_8px_32px_rgba(0,0,0,0.14)]
              md:hidden
            "
          >
            <ul ref={listRef} role="list" className="flex flex-col">
              {nav.map((item, i) => (
                <MobileNavRow
                  key={item.id}
                  item={item}
                  onClose={onClose}
                  isLast={i === nav.length - 1}
                />
              ))}
            </ul>

            {/* Search shortcut (separated at the bottom) */}
            <motion.div variants={DRAWER_ITEM_VARIANTS} className="mt-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => { navigate('/pesquisar'); onClose() }}
                aria-label="Pesquisar — o que procuras?"
                className="
                  flex w-full items-center gap-4 rounded-2xl px-4 py-3.5
                  bg-brand-blue-100 text-brand-blue-600
                  hover:bg-brand-blue-200 active:bg-brand-blue-300
                  transition-colors duration-150
                "
              >
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-blue-200"
                >
                  <Search size={28} strokeWidth={2} />
                </span>
                <span className="font-display text-xl font-extrabold">Pesquisar</span>
              </button>
            </motion.div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}

/* Main Navbar export */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const burgerRef    = useRef<HTMLButtonElement>(null)
  const navigate     = useNavigate()
  const { pathname } = useLocation()

  /* Hide the button for the page the user is already on */
  const visibleNav = NAV.filter(item => item.path !== pathname)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  /* Locks body scroll while drawer is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /* Returns focus to burger button when drawer closes */
  useEffect(() => {
    if (!menuOpen) burgerRef.current?.focus()
  }, [menuOpen])

  return (
    <header
      role="banner"
      className="
        fixed top-5 left-0 right-0 z-50
        bg-transparent
      "
    >
     <a
      href="#main-content"
        className="
          sr-only focus:not-sr-only
          absolute left-4 top-4 z-[100]
          rounded-pill bg-brand-blue-500 px-4 py-2
          font-display font-bold text-sm text-white
          focus:outline-2 focus:outline-white
        "
      >
        Saltar para o conteúdo principal
      </a>

      <div className="
        relative w-full flex h-[var(--nav-h)]
        items-center px-4 sm:px-6
      ">

        {/* Logo — flush to the left viewport edge */}
        <NavLink
          to="/"
          aria-label="INTEGRA-TE — ir para a página inicial"
          className="shrink-0 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-400 focus-visible:ring-offset-2 rounded-xl"
        >
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            className="flex items-center"
          >
            {LOGO_SRC ? (
              <img
                src={LOGO_SRC}
                alt=""
                className="h-8 w-auto"
              />
            ) : (
              <>
                <button
                    onClick={() => navigate('/')}
                    className="h-22 w-[250px] flex items-center justify-center bg-center bg-no-repeat bg-[length:100%_100%] hover:scale-105 transition-transform cursor-pointer"
                    style={{ backgroundImage: 'url(/src/assets/cloud_logo.webp)' }}
                    >
                    <span className="font-['Fredoka',sans-serif] text-xl md:text-[1.4rem] font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#005bb7] to-[#3b82f6]">
                        INTEGRA-TE
                    </span>
                </button>
              </>
            )}
          </motion.div>
        </NavLink>

        {/* Desktop navigation — hidden on homepage (grid serves as nav there) */}
        {pathname !== '/' && (
          <nav
            role="navigation"
            aria-label="Navegação principal"
            className="hidden md:flex items-center gap-6 lg:gap-7 absolute left-1/2 -translate-x-1/2"
          >
            {visibleNav.map((item) => (
              <DesktopNavIcon key={item.id} item={item} />
            ))}
          </nav>
        )}

        {/* Right controls — flush to the right viewport edge */}
        <div className="ml-auto flex items-center gap-2 shrink-0">

          {/* SearchBar + Admin lock — hidden on mobile (burger handles nav there) */}
          <div className="hidden md:flex items-center gap-2">
            <SearchBar className="relative flex w-[220px] items-center rounded-full border border-white/40 bg-white/15 backdrop-blur-xs shadow-[0_14px_36px_rgba(31,38,135,0.22)] ring-1 ring-white/20"/>
            <a
              href="/admin/"
              aria-label="Django Admin"
              className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center shadow-[0_14px_36px_rgba(31,38,135,0.22)] border border-white/40 ring-1 ring-white/20 hover:scale-110 active:scale-95 transition-transform cursor-pointer backdrop-blur-xs"
            >
              <img src="/src/assets/lock.webp" alt="Admin" className="w-5 h-5 object-contain" />
            </a>
          </div>

          {/* Burger — mobile only, not needed on homepage (grid is the nav) */}
          {pathname !== '/' && (
            <BurgerButton
              isOpen={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              btnRef={burgerRef}
            />
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <MobileDrawer
        isOpen={menuOpen}
        onClose={closeMenu}
        nav={visibleNav}
      />
    </header>
  )
}

export default Navbar
