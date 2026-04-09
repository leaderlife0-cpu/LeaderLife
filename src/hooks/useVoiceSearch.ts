import { useState, useRef, useCallback, useEffect } from 'react';

type VoiceState = 'idle' | 'listening' | 'processing' | 'error';

interface UseVoiceSearchReturn {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  state: VoiceState;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
  isSupported: boolean;
}

// Extend Window interface for webkit prefix
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

export function useVoiceSearch(language = 'fr-FR'): UseVoiceSearchReturn {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [state, setState] = useState<VoiceState>('idle');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSupported = Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition);

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
  };

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setState('idle');
    setInterimTranscript('');
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;
    const SpeechRecognitionAPI = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    setError(null);
    setTranscript('');
    setInterimTranscript('');

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setState('listening');

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      clearSilenceTimer();
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += text;
        else interim += text;
      }
      if (interim) setInterimTranscript(interim);
      if (final) {
        setTranscript(final);
        setState('processing');
      }
      silenceTimerRef.current = setTimeout(() => stopListening(), 10000);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const messages: Record<string, string> = {
        'not-allowed': 'Permission micro refusée. Activez le microphone dans les paramètres.',
        'no-speech': 'Aucun son détecté. Réessayez.',
        'network': 'Erreur réseau. Vérifiez votre connexion.',
        'audio-capture': 'Microphone non disponible.',
      };
      setError(messages[event.error] ?? 'Erreur de reconnaissance vocale');
      setState('error');
    };

    recognition.onend = () => {
      clearSilenceTimer();
      setState(prev => prev === 'processing' ? 'processing' : 'idle');
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;
    recognition.start();

    silenceTimerRef.current = setTimeout(() => stopListening(), 10000);
  }, [isSupported, language, stopListening]);

  useEffect(() => () => {
    clearSilenceTimer();
    recognitionRef.current?.abort();
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening: state === 'listening',
    state,
    startListening,
    stopListening,
    resetTranscript: () => { setTranscript(''); setInterimTranscript(''); setState('idle'); },
    error,
    isSupported,
  };
}
