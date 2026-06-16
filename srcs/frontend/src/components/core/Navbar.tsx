import { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  BookOpen,
  Dumbbell,
  Gamepad2,
  BookMarked,
  Info,
  Mail,
  Search,
  type LucideIcon,
} from 'lucide-react'

/* Types */
interface NavItem {
  id       : string
  label    : string
  path     : string
  Icon     : LucideIcon
  /* Full Tailwind class strings (must be literal for v4 tree-shaking) */
  iconActive  : string   /* circular icon pill (active state)  */
  iconIdle    : string   /* circular icon pill (idle state)    */
  labelActive : string   /* small label below icon (active)    */
  labelIdle   : string   /* small label below icon (idle)      */
  /* Mobile drawer item */
  drawerActive : string  /* whole drawer row (active)          */
  drawerIcon   : string  /* icon circle inside drawer (active) */
  ariaLabel    : string
}

/* Navigation data
   Matches scope doc: Aprender · Exercícios · Jogos · Ler · Sobre · Contactos */
const NAV: NavItem[] = [
  {
    id    : 'learn',
    label : 'Aprender',
    path  : '/learn',
    Icon  : BookOpen,
    iconActive   : 'bg-brand-blue-500 text-white shadow-md',
    iconIdle     : 'bg-brand-blue-100 text-brand-blue-600 hover:bg-brand-blue-200',
    labelActive  : 'text-brand-blue-600 font-black',
    labelIdle    : 'text-neutral-400',
    drawerActive : 'bg-brand-blue-500 text-white',
    drawerIcon   : 'bg-white/20 text-white',
    ariaLabel    : 'Aprender — ir para a área de aprendizagem',
  },
  {
    id    : 'practice',
    label : 'Exercícios',
    path  : '/practice',
    Icon  : Dumbbell,
    iconActive   : 'bg-brand-green-500 text-white shadow-md',
    iconIdle     : 'bg-brand-green-100 text-brand-green-600 hover:bg-brand-green-200',
    labelActive  : 'text-brand-green-600 font-black',
    labelIdle    : 'text-neutral-400',
    drawerActive : 'bg-brand-green-500 text-white',
    drawerIcon   : 'bg-white/20 text-white',
    ariaLabel    : 'Exercícios — ir para os exercícios',
  },
  {
    id    : 'play',
    label : 'Jogos',
    path  : '/play',
    Icon  : Gamepad2,
    iconActive   : 'bg-brand-green-600 text-white shadow-md',
    iconIdle     : 'bg-brand-green-100 text-brand-green-700 hover:bg-brand-green-200',
    labelActive  : 'text-brand-green-700 font-black',
    labelIdle    : 'text-neutral-400',
    drawerActive : 'bg-brand-green-600 text-white',
    drawerIcon   : 'bg-white/20 text-white',
    ariaLabel    : 'Jogos — ir para os jogos',
  },
  {
    id    : 'read',
    label : 'Ler',
    path  : '/read',
    Icon  : BookMarked,
    iconActive   : 'bg-brand-red-500 text-white shadow-md',
    iconIdle     : 'bg-brand-red-100 text-brand-red-500 hover:bg-brand-red-200',
    labelActive  : 'text-brand-red-500 font-black',
    labelIdle    : 'text-neutral-400',
    drawerActive : 'bg-brand-red-500 text-white',
    drawerIcon   : 'bg-white/20 text-white',
    ariaLabel    : 'Ler — ir para a área de leitura',
  },
  {
    id    : 'about',
    label : 'Sobre',
    path  : '/about',
    Icon  : Info,
    iconActive   : 'bg-brand-orange-500 text-white shadow-md',
    iconIdle     : 'bg-brand-orange-100 text-brand-orange-600 hover:bg-brand-orange-200',
    labelActive  : 'text-brand-orange-600 font-black',
    labelIdle    : 'text-neutral-400',
    drawerActive : 'bg-brand-orange-500 text-white',
    drawerIcon   : 'bg-white/20 text-white',
    ariaLabel    : 'Sobre o projeto — saber mais',
  },
  {
    id    : 'contact',
    label : 'Contactos',
    path  : '/contact',
    Icon  : Mail,
    iconActive   : 'bg-brand-red-600 text-white shadow-md',
    iconIdle     : 'bg-brand-red-100 text-brand-red-600 hover:bg-brand-red-200',
    labelActive  : 'text-brand-red-600 font-black',
    labelIdle    : 'text-neutral-400',
    drawerActive : 'bg-brand-red-600 text-white',
    drawerIcon   : 'bg-white/20 text-white',
    ariaLabel    : 'Contactos — falar connosco',
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
 *   → top bar moves  +8px to overlay middle bar then rotates +45°
 *   → bottom bar moves −8px to overlay middle bar then rotates −45°
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

/* Desktop circular icon button */

function DesktopNavIcon({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.path}
      aria-label={item.ariaLabel}
      className="group flex flex-col items-center gap-1 focus-visible:outline-none"
    >
      {({ isActive }) => (
        <>
          {/* Icon circle */}
          <motion.span
            aria-current={isActive ? 'page' : undefined}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            className={`
              flex h-12 w-12 items-center justify-center rounded-full
              transition-colors duration-200
              ${isActive ? item.iconActive : item.iconIdle}
            `}
          >
            <item.Icon size={22} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
          </motion.span>

          {/* Label (always rendered for layout stability, visually styled) */}
          <span
            className={`
              font-display text-[11px] leading-none
              transition-colors duration-200
              ${isActive ? item.labelActive : item.labelIdle}
            `}
          >
            {item.label}
          </span>

          {/* Active dot underline */}
          <motion.span
            aria-hidden="true"
            animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="block h-1 w-1 rounded-full bg-brand-blue-500 origin-center"
          />
        </>
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
            {/* Icon circle (large for small fingers) */}
            <span
              aria-hidden="true"
              className={`
                flex h-14 w-14 shrink-0 items-center justify-center rounded-full
                ${isActive ? item.drawerIcon : item.iconIdle}
              `}
            >
              <item.Icon size={28} strokeWidth={isActive ? 2.5 : 2} />
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
  isOpen          : boolean
  onClose         : () => void
}

function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
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
              {NAV.map((item, i) => (
                <MobileNavRow
                  key={item.id}
                  item={item}
                  onClose={onClose}
                  isLast={i === NAV.length - 1}
                />
              ))}
            </ul>

            {/* Search shortcut (separated at the bottom) */}
            <motion.div variants={DRAWER_ITEM_VARIANTS} className="mt-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => { navigate('/search'); onClose() }}
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
        sticky top-0 z-50
        bg-white/95 backdrop-blur-md
        border-b border-neutral-200
        shadow-sm
      "
    >
     < a 
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
        relative mx-auto flex h-[var(--nav-h)] max-w-6xl
        items-center justify-between gap-4 px-4 sm:px-6
      ">

        {/* Logo */}
        <NavLink
          to="/"
          aria-label="INTEGRA-TE — ir para a página inicial"
          className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-400 focus-visible:ring-offset-2 rounded-xl"
        >
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            className="
              flex items-center gap-1.5 rounded-xl
              bg-brand-blue-500 px-3.5 py-2
              shadow-sm
            "
          >
            {LOGO_SRC ? (
              <img
                src={LOGO_SRC}
                alt=""
                className="h-8 w-auto"
              />
            ) : (
              <>
                <span
                  aria-hidden="true"
                  className="font-display text-base font-black text-white tracking-tight leading-none"
                >
                  INTEGRA‑TE
                </span>
                <span aria-hidden="true" className="text-brand-blue-200 text-sm leading-none">⭐</span>
              </>
            )}
          </motion.div>
        </NavLink>

        {/* Desktop navigation */}
        <nav
          role="navigation"
          aria-label="Navegação principal"
          className="hidden md:flex items-end gap-4 lg:gap-5"
        >
          {NAV.map((item) => (
            <DesktopNavIcon key={item.id} item={item} />
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">

          {/* Search (text+icon on large screens, icon-only on sm) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/search')}
            aria-label="Pesquisar — o que procuras?"
            className="
              flex items-center gap-2 rounded-full
              bg-brand-blue-100 text-brand-blue-600 font-display font-bold text-sm
              hover:bg-brand-blue-200 active:bg-brand-blue-300
              transition-colors duration-150
              h-10 px-3 sm:px-4
            "
          >
            <Search size={18} strokeWidth={2.5} aria-hidden="true" />
            <span className="hidden lg:inline whitespace-nowrap">O que procuras?</span>
          </motion.button>

          {/* Burger - mobile only */}
          <BurgerButton
            isOpen={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            btnRef={burgerRef}
          />
        </div>
      </div>

      {/* Mobile drawer */}
      <MobileDrawer
        isOpen={menuOpen}
        onClose={closeMenu}
      />
    </header>
  )
}

export default Navbar