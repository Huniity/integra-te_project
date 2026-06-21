import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'

/* ════════════════════════════════════════════════════════════════════
   HeroBrand . centred branding layout
   Checklist: Logo/wordmark centering . Tagline typography . Responsive height

   PLACEHOLDER NOTES (update when assets arrive):
     logoSrc  -> swap text wordmark for final SVG/webp via the `logoSrc` prop
     tagline  -> update DEFAULT_TAGLINE when copy is approved
     subtitle -> update DEFAULT_SUBTITLE when copy is approved
     font     -> `font-display` (Nunito) is placeholder until type spec is settled;
                grep "TYPOGRAPHY" to find every sizing decision in one place
     bg       -> gradient placeholder; replace with hero illustration via `bgSrc` prop
   ════════════════════════════════════════════════════════════════════ */

/* Copy placeholders */
/* TYPOGRAPHY: to update strings when final copy is approved */
const DEFAULT_TAGLINE  = 'Aprender é uma aventura!'
const DEFAULT_SUBTITLE = 'Explora, brinca e descobre o mundo do conhecimento.'

/* Types */
interface HeroBrandProps {
  logoSrc?      : string
  bgSrc?        : string
  tagline?      : string
  subtitle?     : string
  /** Heading level - pass 1 on the homepage, 2 on any other page.
   *  Defaults to 1 so Home.tsx needs no change. */
  headingLevel? : 1 | 2
}

/* Animation variants */
const STAGE: Variants = {
  hidden  : {},
  visible : { transition: { staggerChildren: 0.14, delayChildren: 0.08 } },
}

const LOGO_IN: Variants = {
  hidden  : { opacity: 0, scale: 0.82 },
  visible : {
    opacity: 1, scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 22 },
  },
}

const SLIDE_UP: Variants = {
  hidden  : { opacity: 0, y: 18 },
  visible : {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
}

/* Component */
export function HeroBrand({
  logoSrc,
  bgSrc,
  tagline      = DEFAULT_TAGLINE,
  subtitle     = DEFAULT_SUBTITLE,
  headingLevel = 1,
}: HeroBrandProps) {
  const Heading = headingLevel === 2 ? motion.h2 : motion.h1
  return (
    <section
      aria-label="INTEGRA-TE — apresentação"
      className="
        relative flex flex-col items-center justify-center
        overflow-hidden text-center px-4

        /* ── RESPONSIVE HEIGHT RULES ──────────────────────────────
           Mobile:  fills viewport below navbar (72 px)
           Tablet:  caps at 80 vh so page content below stays visible
           Desktop: 85 vh — prominent without overwhelming wide screens  */
        min-h-[calc(100svh-var(--nav-h))]
        sm:min-h-[80vh]
        lg:min-h-[85vh]

        py-12 sm:py-16 lg:py-20
      "
    >

      {/* Background layer
          PLACEHOLDER: gradient until hero illustration is available.
          When `bgSrc` is supplied the illustration sits on top of the
          gradient so the gradient still shows through as a safe fallback. */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-b
          from-brand-blue-100
          via-brand-blue-200
          to-brand-blue-300
        "
      />
      {bgSrc && (
        <img
          src={bgSrc}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom opacity-60"
        />
      )}

      {/* Content layer */}
      <motion.div
        variants={STAGE}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-0"
      >

        {/* Logo / Wordmark
            ─────────────────────────────────────────────────────────
            PLACEHOLDER: text badge until final logo SVG/webp is ready.
            To swap in the real asset pass `logoSrc="/path/to/logo.svg"`.
            Sizing classes below (h-16 / sm:h-24 / lg:h-32) are the
            target slot sizes - adjust once the actual artwork is measured. */}
        <motion.figure variants={LOGO_IN} className="mb-6 sm:mb-8 lg:mb-10">
          {logoSrc ? (
            /* Real logo asset */
            <img
              src={logoSrc}
              alt="INTEGRA-TE"
              className="
                mx-auto object-contain
                h-16
                sm:h-24
                lg:h-32
              "
            />
          ) : (
            /* Text wordmark placeholder */
            <div
              role="img"
              aria-label="INTEGRA-TE (logótipo provisório)"
              className="
                inline-flex items-center gap-2 rounded-2xl
                bg-white shadow-[0_8px_32px_rgba(46,91,170,0.18)]
                px-5  py-2.5
                sm:px-7  sm:py-3.5
                lg:px-9  lg:py-4
              "
            >
              {/* TYPOGRAPHY: font-display (Nunito) is placeholder.
                  Update font-family & weight when final type spec arrives. */}
              <span
                className="
                  font-display font-black tracking-tight leading-none
                  text-brand-blue-500
                  text-2xl
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                INTEGRA‑TE
              </span>
              <span aria-hidden="true" className="text-xl sm:text-3xl lg:text-4xl select-none">
                ⭐
              </span>
            </div>
          )}
        </motion.figure>

        {/* Tagline - primary heading
            ─────────────────────────────────────────────────────────
            TYPOGRAPHY: sizes below are placeholder scale.
            Swap text-{size} classes once type ramp is finalised.
            Level controlled by headingLevel prop - defaults to h1 for homepage.*/}
        <Heading
          variants={SLIDE_UP}
          className="
            font-display font-black leading-tight
            text-brand-blue-600
            max-w-[18rem]   text-2xl
            sm:max-w-lg     sm:text-3xl
            lg:max-w-2xl    lg:text-5xl
            mt-0
          "
        >
          {tagline}
        </Heading>

        {/* Subtitle - supporting copy
            ─────────────────────────────────────────────────────────
            TYPOGRAPHY: same note as above - placeholder sizing. */}
        <motion.p
          variants={SLIDE_UP}
          className="
            font-body leading-relaxed
            text-brand-blue-500
            max-w-[16rem]   text-sm    mt-3
            sm:max-w-md     sm:text-base  sm:mt-4
            lg:max-w-xl     lg:text-lg    lg:mt-5
          "
        >
          {subtitle}
        </motion.p>

      </motion.div>
    </section>
  )
}

export default HeroBrand
