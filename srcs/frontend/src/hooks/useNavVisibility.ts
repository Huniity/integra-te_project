import { useEffect, useRef, useState } from 'react'

/* States the nav can be in:
   - 'full'   : top of page, full size, fully visible
   - 'shrunk' : lightly scrolled OR revealed after hiding, smaller compact bar
   - 'hidden' : scrolled past the threshold while scrolling down */
export type NavVisibility = 'full' | 'shrunk' | 'hidden'

interface UseNavVisibilityOptions {
  /** Below this scrollY, nav is 'full'. Default 16px. */
  fullThreshold?  : number
  /** Above this scrollY, nav can hide while scrolling down. Default 200px. */
  hideThreshold?  : number
  /** Distance from viewport top that triggers reveal-on-hover. Default 60px. */
  hoverZone?      : number
  /** Element to monitor for focus events so keyboard nav keeps the bar visible. */
  focusTarget?    : HTMLElement | null
}

/* Derives the nav visibility state from scroll, mouse position, and focus.
   Single source of truth so the Navbar component doesn't juggle effects. */
export function useNavVisibility({
  fullThreshold = 16,
  hideThreshold = 200,
  hoverZone     = 60,
  focusTarget,
}: UseNavVisibilityOptions = {}): NavVisibility {
  const [state, setState] = useState<NavVisibility>('full')

  /* Refs avoid re-renders for transient state */
  const lastScrollY     = useRef(0)
  const mouseNearTop    = useRef(false)
  const navHasFocus     = useRef(false)
  const rafScheduled    = useRef(false)
  const mouseRaf        = useRef(false)

  /* Computes next state from current refs + a fresh scrollY value */
  function compute(scrollY: number): NavVisibility {
    if (scrollY < fullThreshold) return 'full'

    /* Above hide threshold: always shrunk, never hide */
    if (scrollY < hideThreshold) return 'shrunk'

    /* Past the hide threshold - direction & overrides decide */
    const direction = scrollY > lastScrollY.current ? 'down' : 'up'

    if (mouseNearTop.current || navHasFocus.current) return 'shrunk'
    if (direction === 'up') return 'shrunk'
    return 'hidden'
  }

  useEffect(() => {
    function applyState() {
      rafScheduled.current = false
      const y = window.scrollY
      const next = compute(y)
      setState(prev => (prev === next ? prev : next))
      lastScrollY.current = y
    }

    function onScroll() {
      if (rafScheduled.current) return
      rafScheduled.current = true
      requestAnimationFrame(applyState)
    }

    function onMouseMove(e: MouseEvent) {
      if (mouseRaf.current) return
      mouseRaf.current = true
      requestAnimationFrame(() => {
        mouseRaf.current = false
        const inZone = e.clientY < hoverZone
        if (inZone !== mouseNearTop.current) {
          mouseNearTop.current = inZone
          applyState()
        }
      })
    }

    /* Initial compute (handles page-refresh-mid-scroll) */
    applyState()

    window.addEventListener('scroll',    onScroll,    { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    return () => {
      window.removeEventListener('scroll',    onScroll)
      window.removeEventListener('mousemove', onMouseMove)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullThreshold, hideThreshold, hoverZone])

  /* Tracks focus inside the nav so keyboard users don't lose it mid-tab */
  useEffect(() => {
    if (!focusTarget) return

    function onFocusIn() {
      navHasFocus.current = true
      setState(prev => (prev === 'hidden' ? 'shrunk' : prev))
    }
    function onFocusOut(e: FocusEvent) {
      /* Only flips if focus genuinely left the nav subtree */
      const related = e.relatedTarget as Node | null
      if (related && focusTarget!.contains(related)) return
      navHasFocus.current = false
    }

    focusTarget.addEventListener('focusin',  onFocusIn)
    focusTarget.addEventListener('focusout', onFocusOut)

    return () => {
      focusTarget.removeEventListener('focusin',  onFocusIn)
      focusTarget.removeEventListener('focusout', onFocusOut)
    }
  }, [focusTarget])

  return state
}