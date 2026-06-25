import { createContext, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility as AccessibilityIcon, Contrast, Type, Link2, X, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNightMode } from './NightMode';

type FontSize = 'normal' | 'large' | 'xlarge';

interface AccessibilitySettings {
  contrast: boolean;
  fontSize: FontSize;
  readableFont: boolean;
  highlightLinks: boolean;
}

interface AccessibilityContextValue extends AccessibilitySettings {
  toggleContrast: () => void;
  setFontSize: (size: FontSize) => void;
  toggleReadableFont: () => void;
  toggleHighlightLinks: () => void;
  reset: () => void;
}

const STORAGE_KEY = 'integra-te-accessibility';

const DEFAULT_SETTINGS: AccessibilitySettings = {
  contrast: false,
  fontSize: 'normal',
  readableFont: false,
  highlightLinks: false,
};

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

function loadSettings(): AccessibilitySettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(loadSettings);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    const html = document.documentElement;
    html.classList.toggle('a11y-contrast', settings.contrast);
    html.classList.toggle('a11y-readable-font', settings.readableFont);
    html.classList.toggle('a11y-highlight-links', settings.highlightLinks);
    html.classList.remove('a11y-text-lg', 'a11y-text-xl');
    if (settings.fontSize === 'large') html.classList.add('a11y-text-lg');
    if (settings.fontSize === 'xlarge') html.classList.add('a11y-text-xl');
  }, [settings]);

  const value: AccessibilityContextValue = {
    ...settings,
    toggleContrast: () => setSettings((s) => ({ ...s, contrast: !s.contrast })),
    setFontSize: (fontSize) => setSettings((s) => ({ ...s, fontSize })),
    toggleReadableFont: () => setSettings((s) => ({ ...s, readableFont: !s.readableFont })),
    toggleHighlightLinks: () => setSettings((s) => ({ ...s, highlightLinks: !s.highlightLinks })),
    reset: () => setSettings(DEFAULT_SETTINGS),
  };

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
}

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessibilityPanel({ isOpen, onClose }: AccessibilityPanelProps) {
  const a11y = useAccessibility();
  const { isNightMode } = useNightMode();

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Opções de acessibilidade"
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center sm:justify-end bg-black/50 backdrop-blur-sm p-4 sm:p-6"
        >
          <AnimatePresence>
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden ${
                isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
              }`}
            >
              <div className={`flex items-center justify-between px-5 py-4 border-b ${isNightMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <h2 className={`font-['Fredoka'] font-bold text-lg flex items-center gap-2 ${isNightMode ? 'text-white' : 'text-[#1e293b]'}`}>
                  <AccessibilityIcon size={20} className="text-blue-500" aria-hidden="true" />
                  Acessibilidade
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar"
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                    isNightMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
                  }`}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>

              <div className="px-5 py-4 flex flex-col gap-5">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5 ${isNightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    <Contrast size={13} aria-hidden="true" /> Contraste
                  </p>
                  <button
                    type="button"
                    onClick={a11y.toggleContrast}
                    aria-pressed={a11y.contrast}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full font-['Fredoka'] font-bold text-sm transition-colors ${
                      a11y.contrast
                        ? 'bg-blue-600 text-white'
                        : isNightMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>Alto contraste</span>
                    <span className="text-xs font-extrabold">{a11y.contrast ? 'Ativo' : 'Inativo'}</span>
                  </button>
                </div>

                <div>
                  <p className={`text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5 ${isNightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    <Type size={13} aria-hidden="true" /> Tamanho da letra
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {([
                      { id: 'normal', label: 'A' },
                      { id: 'large', label: 'A' },
                      { id: 'xlarge', label: 'A' },
                    ] as { id: FontSize; label: string }[]).map((opt, i) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => a11y.setFontSize(opt.id)}
                        aria-pressed={a11y.fontSize === opt.id}
                        className={`flex items-center justify-center py-2.5 rounded-full font-['Fredoka'] font-bold transition-colors ${
                          a11y.fontSize === opt.id
                            ? 'bg-blue-600 text-white'
                            : isNightMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        style={{ fontSize: `${0.85 + i * 0.2}rem` }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className={`text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5 ${isNightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Fonte
                  </p>
                  <button
                    type="button"
                    onClick={a11y.toggleReadableFont}
                    aria-pressed={a11y.readableFont}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full font-['Fredoka'] font-bold text-sm transition-colors ${
                      a11y.readableFont
                        ? 'bg-blue-600 text-white'
                        : isNightMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>Fonte legível</span>
                    <span className="text-xs font-extrabold">{a11y.readableFont ? 'Ativo' : 'Inativo'}</span>
                  </button>
                </div>

                <div>
                  <p className={`text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5 ${isNightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    <Link2 size={13} aria-hidden="true" /> Links
                  </p>
                  <button
                    type="button"
                    onClick={a11y.toggleHighlightLinks}
                    aria-pressed={a11y.highlightLinks}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full font-['Fredoka'] font-bold text-sm transition-colors ${
                      a11y.highlightLinks
                        ? 'bg-blue-600 text-white'
                        : isNightMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>Destacar links</span>
                    <span className="text-xs font-extrabold">{a11y.highlightLinks ? 'Ativo' : 'Inativo'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={a11y.reset}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full border font-semibold text-xs transition-colors ${
                    isNightMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <RotateCcw size={13} aria-hidden="true" />
                  Repor predefinições
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </>
  );
}
