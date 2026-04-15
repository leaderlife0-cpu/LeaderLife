import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VoiceMicButton } from '@/components/search/VoiceMicButton';
import { useChatAssistant } from '@/hooks/useChatAssistant';
import { timeAgo } from '@/utils/formatters';
import { getCategoryConfig } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { VoiceIntent } from '@/types';

const QUICK_SUGGESTIONS = [
  '🍽️ Meilleurs restos à Abidjan',
  '🏖️ Plus belles plages du monde',
  '🏨 Hôtel pas cher à Paris',
  '🎉 Où sortir ce soir ?',
  '✈️ Conseils voyage Dubaï',
];

export function ChatAssistant() {
  const { messages, isLoading, isOpen, hasUnread, toggleChat, sendMessage, clearHistory } = useChatAssistant();
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput('');
    setShowSuggestions(false);
    await sendMessage(text);
  };

  const handleSuggestion = async (s: string) => {
    setShowSuggestions(false);
    await sendMessage(s);
  };

  const handleVoice = (_text: string, _intent: VoiceIntent) => {
    setInput(_text);
  };

  const isMobile = window.innerWidth < 768;

  return (
    <>
      {/* Floating button */}
      <motion.button
        className="fixed bottom-20 right-5 md:bottom-6 md:right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
          boxShadow: '0 8px 32px rgba(139,92,246,0.5)',
        }}
        whileHover={{ scale: 1.08, boxShadow: '0 12px 40px rgba(139,92,246,0.6)' }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? {} : { y: [0, -5, 0] }}
        transition={{ repeat: isOpen ? 0 : Infinity, duration: 2.5, ease: 'easeInOut' }}
        onClick={toggleChat}
        aria-label="Ouvrir l'assistant voyage"
      >
        {isOpen ? (
          <X size={20} className="text-white" />
        ) : (
          <Sparkles size={20} className="text-white" />
        )}
        {!isOpen && hasUnread && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-[#0F0F0F]" />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={isMobile ? { y: '100%' } : { x: '100%', opacity: 0 }}
            animate={isMobile ? { y: 0 } : { x: 0, opacity: 1 }}
            exit={isMobile ? { y: '100%' } : { x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'fixed z-50 flex flex-col',
              'border border-white/10',
              isMobile
                ? 'inset-x-0 bottom-0 h-[90vh] rounded-t-3xl'
                : 'right-6 bottom-24 w-[400px] h-[calc(100vh-120px)] max-h-[700px] rounded-2xl shadow-2xl'
            )}
            style={{ background: 'rgba(15,15,15,0.97)', backdropFilter: 'blur(24px)' }}
          >
            {/* Mobile drag handle */}
            {isMobile && (
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-3 mb-1 shrink-0" />
            )}

            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b border-white/8 shrink-0"
              style={{ background: 'rgba(26,26,46,0.5)' }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
              >
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Exploraa Guide
                  </span>
                  <Badge
                    className="text-xs px-1.5 py-0 border font-medium"
                    style={{
                      background: 'rgba(139,92,246,0.15)',
                      color: '#A78BFA',
                      borderColor: 'rgba(139,92,246,0.3)',
                    }}
                  >
                    IA
                  </Badge>
                </div>
                <p className="text-white/35 text-xs">En ligne</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/35 hover:text-white shrink-0 rounded-xl hover:bg-white/8"
                onClick={clearHistory}
              >
                <Trash2 size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/35 hover:text-white shrink-0 rounded-xl hover:bg-white/8"
                onClick={toggleChat}
              >
                <X size={16} />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 min-h-0 scrollbar-violet">
              {messages.map((msg, i) => (
                <div key={i} className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {msg.role === 'assistant' && (
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1"
                      style={{ background: 'linear-gradient(135deg, #8B5CF620, #EC489920)', border: '1px solid rgba(139,92,246,0.2)' }}
                    >
                      <Sparkles size={12} className="text-violet-400" />
                    </div>
                  )}
                  <div className={cn('max-w-[80%]', msg.role === 'user' ? 'items-end' : 'items-start', 'flex flex-col gap-1')}>
                    <div
                      className={cn(
                        'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                        msg.role === 'user'
                          ? 'text-white rounded-tr-sm'
                          : 'rounded-tl-sm border border-white/8'
                      )}
                      style={
                        msg.role === 'user'
                          ? { background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }
                          : { background: 'rgba(26, 33, 62, 0.8)' }
                      }
                    >
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                              strong: ({ children }) => (
                                <strong className="text-violet-300 font-semibold">{children}</strong>
                              ),
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>

                    {/* Suggested places */}
                    {msg.suggested_places && msg.suggested_places.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {msg.suggested_places.map(p => {
                          const config = getCategoryConfig(p.category);
                          return (
                            <button
                              key={p.id}
                              onClick={() => navigate(`/place/${p.id}`)}
                              className="flex items-center gap-1 border rounded-full px-2.5 py-1 text-xs text-white/80 transition-all hover:border-violet-500/40 hover:bg-violet-500/10"
                              style={{ background: 'rgba(26,26,46,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}
                            >
                              <span>{config.emoji}</span>
                              <span>{p.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <span className="text-white/25 text-xs">{timeAgo(msg.timestamp)}</span>
                  </div>
                </div>
              ))}

              {/* Quick suggestions */}
              {showSuggestions && messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {QUICK_SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      className="border rounded-full px-3 py-1.5 text-xs text-white/65 transition-all hover:text-white hover:border-violet-500/40 hover:bg-violet-500/8"
                      style={{ background: 'rgba(26,26,46,0.6)', borderColor: 'rgba(255,255,255,0.08)' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex gap-2 items-center">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #8B5CF620, #EC489920)' }}
                  >
                    <Sparkles size={12} className="text-violet-400" />
                  </div>
                  <div
                    className="rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center border border-white/8"
                    style={{ background: 'rgba(26,33,62,0.8)' }}
                  >
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: '#8B5CF6' }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/8 shrink-0">
              <div
                className="flex items-center gap-2 border rounded-2xl px-3 input-gradient"
                style={{ background: 'rgba(26,26,46,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder={isLoading ? 'Exploraa Guide réfléchit...' : 'Demandez-moi n\'importe quoi...'}
                  disabled={isLoading}
                  className="flex-1 bg-transparent py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
                <VoiceMicButton onTranscript={handleVoice} size="sm" />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
