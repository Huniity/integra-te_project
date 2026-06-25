import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accessibility as AccessibilityIcon, HelpCircle, ShieldCheck } from 'lucide-react';
import { useNightMode } from './NightMode';
import { AccessibilityPanel } from './Accessibility';

export function QuickLinkButtons() {
  const navigate = useNavigate();
  const { isNightMode } = useNightMode();
  const [isA11yOpen, setIsA11yOpen] = useState(false);

  const buttonClass = `fixed right-4 z-[70] flex h-12 w-12 items-center justify-center rounded-full shadow-lg active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 ${
    isNightMode ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'
  }`;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsA11yOpen(true)}
        aria-label="Abrir opções de acessibilidade"
        className={`${buttonClass} bottom-4`}
      >
        <AccessibilityIcon size={24} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => navigate('/faq')}
        aria-label="Perguntas frequentes"
        className={`${buttonClass} bottom-20`}
      >
        <HelpCircle size={24} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => navigate('/rgpd')}
        aria-label="Política de privacidade e RGPD"
        className={`${buttonClass} bottom-36`}
      >
        <ShieldCheck size={22} aria-hidden="true" />
      </button>

      <AccessibilityPanel isOpen={isA11yOpen} onClose={() => setIsA11yOpen(false)} />
    </>
  );
}
