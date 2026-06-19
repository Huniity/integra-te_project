import { createContext, useContext, useEffect, useState } from 'react';
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
        className={`pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed transition-opacity duration-700 ${
          isNightMode ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: `url(${dayImage})` }}
      />
      <div
        className={`pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed transition-opacity duration-700 ${
          isNightMode ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: `url(${nightImage})` }}
      />
    </>
  );
}

export function NightModeToggle() {
  const { isNightMode, toggleNightMode } = useNightMode();

  return (
    <>
      <img
        src={isNightMode ? './src/assets/moon2.png' : './src/assets/sun.png'}
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed top-[14%] left-[15%] z-0 w-28 sm:w-36 md:w-44 lg:w-20 object-contain rotate-24 transition-all duration-700"
      />
      <button
        type="button"
        onClick={toggleNightMode}
        aria-label={isNightMode ? 'Ativar Day Mode' : 'Ativar Night Mode'}
        className="fixed top-[14%] left-[15%] z-10 h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44 lg:h-20 lg:w-20 rounded-full bg-transparent transition-transform duration-500 hover:scale-110"
      />
    </>
  );
}
