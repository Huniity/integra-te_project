import { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

const NIGHT_MODE_STORAGE_KEY = 'resolver-night-mode';

interface NightModeContextValue {
  isNightMode: boolean;
  toggleNightMode: () => void;
}

const NightModeContext = createContext<NightModeContextValue | undefined>(undefined);

export function NightModeProvider({ children }: { children: ReactNode }) {
  const [isNightMode, setIsNightMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(NIGHT_MODE_STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    window.localStorage.setItem(NIGHT_MODE_STORAGE_KEY, String(isNightMode));
  }, [isNightMode]);

  const toggleNightMode = () => setIsNightMode((current) => !current);

  return (
    <NightModeContext.Provider value={{ isNightMode, toggleNightMode }}>
      {children}
    </NightModeContext.Provider>
  );
}

export function useNightMode() {
  const context = useContext(NightModeContext);
  return context ?? { isNightMode: false, toggleNightMode: () => {} };
}

interface NightModeBackgroundProps {
  dayImage: string;
  nightImage: string;
}

export function NightModeBackground({ dayImage, nightImage }: NightModeBackgroundProps) {
  const { isNightMode } = useNightMode();

  return (
    <>
      <div
        className={`pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${
          isNightMode ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: `url(${dayImage})` }}
      />
      <div
        className={`pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${
          isNightMode ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: `url(${nightImage})` }}
      />
    </>
  );
}

const sunVariants = {
  animate: { opacity: 1, scale: 1, rotate: [0, 360] as [number, number] },
  transition: {
    opacity: { duration: 0.25 },
    scale:   { type: 'spring' as const, stiffness: 260, damping: 18 },
    rotate:  { duration: 28, repeat: Infinity, ease: 'linear' as const, repeatType: 'loop' as const },
  },
};

const moonVariants = {
  animate: { opacity: 1, scale: 1, y: [0, -6, 0] as [number, number, number], rotate: [0, 4, -4, 0] as [number, number, number, number] },
  transition: {
    opacity: { duration: 0.25 },
    scale:   { type: 'spring' as const, stiffness: 260, damping: 18 },
    y:       { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
    rotate:  { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

export function NightModeToggle() {
  const { isNightMode, toggleNightMode } = useNightMode();

  return (
    <button
      type="button"
      onClick={toggleNightMode}
      aria-label={isNightMode ? 'Ativar Day Mode' : 'Ativar Night Mode'}
      className="fixed xl:top-[5%] lg:top-[5%] lg:left-[35%] xl:left-[27%] z-50 w-28 sm:w-36 md:w-44 lg:w-20 bg-transparent cursor-pointer rounded-full hover:scale-110 active:scale-95 transition-transform duration-200"
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={isNightMode ? 'moon-large' : 'sun-large'}
          src={isNightMode ? '/src/assets/moon2.webp' : '/src/assets/sun.webp'}
          alt=""
          aria-hidden="true"
          className="w-full object-contain opacity-80"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={isNightMode ? moonVariants.animate : sunVariants.animate}
          exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.18 } }}
          transition={isNightMode ? moonVariants.transition : sunVariants.transition}
        />
      </AnimatePresence>
    </button>
  );
}

export function NightModeNavButton() {
  const { isNightMode, toggleNightMode } = useNightMode();

  return (
    <button
      type="button"
      onClick={toggleNightMode}
      aria-label={isNightMode ? 'Ativar Day Mode' : 'Ativar Night Mode'}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 border border-white/40 backdrop-blur-xs shadow-[0_14px_36px_rgba(31,38,135,0.22)] ring-1 ring-white/20 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
    >
      <img
        key={isNightMode ? 'moon-nav' : 'sun-nav'}
        src={isNightMode ? '/src/assets/moon2.webp' : '/src/assets/sun.webp'}
        alt=""
        aria-hidden="true"
        className="w-6 h-6 object-contain"
      />
    </button>
  );
}
