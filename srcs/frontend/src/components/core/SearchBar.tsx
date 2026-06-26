import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useNightMode } from './NightMode';
import { fetchWithConfig } from '../../services/api';
import { getCookie, setCookie } from '../../utils/cookies';

const MIC_CONSENT_COOKIE = 'mic_consent';
const MIC_CONSENT_DAYS = 180;

interface SearchResult { route: string; label: string; distance: number; type?: string }

const RESULT_TYPE_LABELS: Record<string, string> = {
  disciplina: 'Disciplina',
  jogo: 'Jogo',
  livro: 'Livro',
  exercicio: 'Exercício',
  aula: 'Aula',
};

const SEARCH_CATEGORIES: { key: string; label: string }[] = [
  { key: 'aula', label: 'Aulas' },
  { key: 'exercicio', label: 'Exercícios' },
  { key: 'jogo', label: 'Jogos' },
  { key: 'livro', label: 'Livros' },
  { key: 'disciplina', label: 'Disciplinas' },
];

export function SearchBar({ className }: { className?: string }) {
  const navigate = useNavigate();
  const { isNightMode } = useNightMode();
  const [searchText, setSearchText] = useState('');
  const [results, setResults]       = useState<SearchResult[]>([]);
  const [showDrop, setShowDrop]     = useState(false);
  const [excludedTypes, setExcludedTypes] = useState<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<{ type: 'heard' | 'error'; text: string } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const formRef = useRef<HTMLFormElement>(null);


  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const q = searchText.trim();
    if (q.length < 2) { setResults([]); setShowDrop(false); return; }
    const t = setTimeout(async () => {
      try {
        const exclude = excludedTypes.size > 0 ? `&exclude=${[...excludedTypes].join(',')}` : '';
        const data = await fetchWithConfig<{ results: SearchResult[] }>(
          `/v1/voice/search/?q=${encodeURIComponent(q)}&top=5${exclude}`,
        );
        setResults(data.results ?? []);
        setShowDrop(true);
      } catch { setResults([]); setShowDrop(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [searchText, excludedTypes]);

  function toggleCategory(key: string) {
    setExcludedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }


  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) setShowDrop(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (results.length > 0) { navigate(results[0].route); setSearchText(''); setShowDrop(false); }
  }

  function pick(route: string) {
    navigate(route); setSearchText(''); setShowDrop(false);
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];

        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        setIsTranscribing(true);
        setVoiceFeedback(null);
        try {
          const { transcript } = await fetchWithConfig<{ transcript: string }>(
            '/v1/voice/transcribe/',
            { method: 'POST', body: formData },
            30000,
          );
          setSearchText(transcript);
          setVoiceFeedback({ type: 'heard', text: `"${transcript}"` });

          const { route } = await fetchWithConfig<{ route: string }>(
            '/v1/voice/reroute/',
            { method: 'POST', body: JSON.stringify({ transcript }) },
          );
          setTimeout(() => { navigate(route); setVoiceFeedback(null); }, 1200);
        } catch (error) {
          console.error('Falha ao processar a pesquisa por voz:', error);
          setVoiceFeedback({ type: 'error', text: 'Não consegui ouvir. Tenta novamente.' });
          setTimeout(() => setVoiceFeedback(null), 3000);
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }

    setIsRecording(false);
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    if (getCookie(MIC_CONSENT_COOKIE) === 'granted') {
      startRecording();
      return;
    }

    setShowConsent(true);
  };

  const handleConsentAccept = () => {
    setCookie(MIC_CONSENT_COOKIE, 'granted', MIC_CONSENT_DAYS);
    setShowConsent(false);
    startRecording();
  };

  const handleConsentDecline = () => {
    setShowConsent(false);
  };

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={className ?? "relative flex w-full sm:w-[280px] max-w-xs items-center rounded-full border border-white/40 bg-white/15 backdrop-blur-xs shadow-[0_14px_36px_rgba(31,38,135,0.22)] ring-1 ring-white/20 sm:absolute sm:left-1/2 sm:-translate-x-1/2"}
      >
        <button
          type="button"
          onClick={handleMicClick}
          disabled={isTranscribing}
          aria-label={isRecording ? 'Parar gravação' : 'Iniciar gravação'}
          className={`absolute left-[-2px] top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-blue-600/20 backdrop-blur-xs shadow-[0_4px_12px_rgba(31,38,135,0.15)] transition-transform ${
            isRecording ? 'animate-pulse text-red-300' : isTranscribing ? 'animate-pulse text-[#1d4ed8]' : 'text-[#1d4ed8] hover:scale-105'
          }`}
        >
          <img
            src="/src/assets/microfone2.webp"
            alt=""
            aria-hidden="true"
            className="w-7 h-7 object-contain"
          />
        </button>
        <input
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          onFocus={() => results.length > 0 && setShowDrop(true)}
          placeholder="O que procuras?"
          aria-label="Pesquisar"
          className={`font-['Fredoka',sans-serif] w-full rounded-full bg-white/30 py-2.5 pl-12 pr-3 text-sm font-semibold tracking-wide outline-none transition-colors duration-500 ${
            isNightMode ? 'text-white/90 placeholder-white/90' : 'text-blue-600/90 placeholder-blue-600/90'
          }`}
        />

        {voiceFeedback && (
          <div className={`absolute top-[calc(100%+8px)] left-0 right-0 z-[60] rounded-2xl px-4 py-2.5 text-sm font-semibold text-center shadow-lg
            ${voiceFeedback.type === 'error'
              ? 'bg-red-500/90 text-white'
              : 'bg-white/95 text-[#1e3a8a]'
            }`}>
            {voiceFeedback.type === 'heard' ? '🎙️ Ouvi: ' : ''}{voiceFeedback.text}
          </div>
        )}

        {showDrop && (
          <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-[60] rounded-2xl bg-white/95 backdrop-blur-md shadow-[0_8px_32px_rgba(31,38,135,0.18)] border border-white/40 overflow-hidden">
            <div className="flex flex-wrap gap-1.5 px-3 pt-2.5 pb-2 border-b border-neutral-100">
              {SEARCH_CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); toggleCategory(c.key); }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-['Fredoka',sans-serif] transition-colors cursor-pointer ${
                    excludedTypes.has(c.key)
                      ? 'bg-neutral-100 text-neutral-400 line-through'
                      : 'bg-blue-100 text-[#1e3a8a]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {results.length === 0 ? (
              <p className="px-4 py-3 text-sm text-neutral-400 font-semibold">Sem resultados.</p>
            ) : results.map((r, i) => (
              <button
                key={i}
                type="button"
                onMouseDown={() => pick(r.route)}
                className="w-full text-left px-4 py-2.5 font-['Fredoka',sans-serif] font-bold text-sm text-[#1e3a8a] hover:bg-blue-50 transition-colors border-b border-neutral-100 last:border-0 cursor-pointer"
              >
                {r.type && RESULT_TYPE_LABELS[r.type] && (
                  <span className="text-neutral-400 font-semibold">{RESULT_TYPE_LABELS[r.type]}: </span>
                )}
                {r.label}
              </button>
            ))}
          </div>
        )}
      </form>

      {showConsent && createPortal(
        <div role="dialog" aria-modal="true" aria-label="Consentimento de gravação de voz" className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm " onClick={handleConsentDecline} aria-hidden="true" />
          <div className="relative z-10 w-full max-w-xl rounded-3xl bg-blue-900/90 border border-white/20 shadow-2xl p-6 text-center ">
            <h2 className="font-['Fredoka',sans-serif] font-black text-3xl text-white mb-12 ">
              Usar o microfone?
            </h2>
            <p className="text-white/80 text-xl leading-snug mb-12">
              Vamos gravar a tua voz só para entender o que procuras. O áudio não é guardado: é apagado logo após cada pesquisa.
            </p>
            <span className="font-bold text-white/80 text-lg">Lei n.º 58/2019, de 8 de agosto </span> <br />
            <a href="https://diariodarepublica.pt/dr/detalhe/lei/58-2019-123815982" target="_blank" rel="noopener noreferrer" className="text-lg text-blue-400 hover:underline mb-5 inline-block">
              <span className="font-bold">Saiba mais sobre os seus direitos</span>
            </a>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleConsentDecline}
                className="px-4 py-2 rounded-full bg-white/15 text-white font-bold text-sm hover:bg-red-600/70 transition-colors"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={handleConsentAccept}
                className="px-4 py-2 rounded-full bg-white text-[#1e3a8a] font-bold text-sm hover:bg-emerald-600/90 hover:text-white/90 transition-colors"
              >
                Aceitar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default SearchBar
