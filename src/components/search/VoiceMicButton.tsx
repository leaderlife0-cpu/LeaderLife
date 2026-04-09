import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';
import { parseVoiceIntent } from '@/utils/voiceIntentParser';
import type { VoiceIntent } from '@/types';

interface VoiceMicButtonProps {
  onTranscript: (text: string, intent: VoiceIntent) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function VoiceMicButton({ onTranscript, size = 'md', className }: VoiceMicButtonProps) {
  const { isListening, state, startListening, stopListening, interimTranscript, error, isSupported, transcript } = useVoiceSearch();

  const sizes = { sm: 36, md: 44, lg: 52 };
  const iconSizes = { sm: 14, md: 18, lg: 22 };
  const px = sizes[size];
  const iconPx = iconSizes[size];

  if (!isSupported) return null;

  const handleClick = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        const intent = parseVoiceIntent(transcript);
        onTranscript(transcript, intent);
      }
    } else {
      startListening();
    }
  };

  // When transcript is ready (processing state), trigger callback
  if (state === 'processing' && transcript) {
    const intent = parseVoiceIntent(transcript);
    onTranscript(transcript, intent);
  }

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Pulsing rings when listening */}
      <AnimatePresence>
        {isListening && (
          <>
            {[1, 2].map(i => (
              <motion.div
                key={i}
                className="absolute rounded-full border-2 border-blue-400/60"
                style={{ width: px + i * 16, height: px + i * 16 }}
                initial={{ opacity: 0.8, scale: 0.8 }}
                animate={{ opacity: 0, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Interim transcript floating label */}
      <AnimatePresence>
        {isListening && interimTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-full mb-2 bg-[#1E1E2E] text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap border border-blue-500/30 max-w-48 truncate"
          >
            {interimTranscript}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        aria-label={isListening ? 'Arrêter la recherche vocale' : 'Recherche vocale'}
        title={error ?? undefined}
        className={cn(
          'relative z-10 rounded-full flex items-center justify-center transition-colors',
          state === 'error' ? 'bg-red-500/20 text-red-400' :
          isListening ? 'bg-blue-500 text-white' :
          'text-white/50 hover:text-blue-400 hover:bg-blue-500/10'
        )}
        style={{ width: px, height: px, minWidth: px, minHeight: px }}
      >
        {state === 'processing' ? (
          <Loader2 size={iconPx} className="animate-spin" />
        ) : state === 'error' ? (
          <MicOff size={iconPx} />
        ) : (
          <Mic size={iconPx} />
        )}
      </motion.button>
    </div>
  );
}
