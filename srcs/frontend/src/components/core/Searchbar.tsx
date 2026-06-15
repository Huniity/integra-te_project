import { useEffect, useRef, useState } from 'react';
import { useNightMode } from './NightMode';

export default function Searchbar() {
  const { isNightMode } = useNightMode();
  const [searchText, setSearchText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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

      recorder.onstop = () => {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
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

    startRecording();
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="relative flex w-full sm:w-[280px] max-w-xs items-center rounded-full border border-white/40 bg-white/15 backdrop-blur-xs shadow-[0_14px_36px_rgba(31,38,135,0.22)] ring-1 ring-white/20 sm:absolute sm:left-1/2 sm:-translate-x-1/2"
    >
      <button
        type="button"
        onClick={handleMicClick}
        aria-label={isRecording ? 'Parar gravação' : 'Iniciar gravação'}
        className={`absolute left-[-2px] top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-blue-600/20 backdrop-blur-xs shadow-[0_4px_12px_rgba(31,38,135,0.15)] transition-transform ${
          isRecording ? 'animate-pulse text-red-300' : 'text-[#1d4ed8] hover:scale-105'
        }`}
      >
        <img
          src="./src/assets/microfone2.png"
          alt=""
          aria-hidden="true"
          className="w-7 h-7 object-contain"
        />
      </button>
      <input
        type="text"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="O que procuras?"
        className={`font-['Fredoka',sans-serif] w-full rounded-full bg-white/30 py-2.5 pl-12 pr-3 text-sm font-semibold tracking-wide outline-none transition-colors duration-500 ${
          isNightMode ? 'text-white placeholder-white/80' : 'text-white placeholder-blue-600/90'
        }`}
      />
    </form>
  );
}
