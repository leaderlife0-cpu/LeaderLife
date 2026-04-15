import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Sparkles, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VoiceMicButton } from '@/components/search/VoiceMicButton';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { useChatAssistant } from '@/hooks/useChatAssistant';
import { getCategoryConfig } from '@/lib/constants';
import { timeAgo } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import type { VoiceIntent } from '@/types';

const QUICK_SUGGESTIONS = [
  { emoji: '🍽️', text: 'Meilleurs restaurants à Abidjan' },
  { emoji: '🏨', text: 'Hôtel 5 étoiles à Dubaï' },
  { emoji: '🏖️', text: 'Plus belles plages d\'Afrique' },
  { emoji: '🎉', text: 'Où sortir à Paris ce week-end ?' },
  { emoji: '🛍️', text: 'Shopping à Marrakech' },
  { emoji: '🌿', text: 'Nature et détente à Dakar' },
];

export default function AssistantPage() {
  const { messages, isLoading, sendMessage, clearHistory } = useChatAssistant();
  const [input, setInput] = useState('');
  const [suggestionsShown, setSuggestionsShown] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput('');
    setSuggestionsShown(false);
    await sendMessage(text);
  };

  const handleSuggestion = async (text: string) => {
    setSuggestionsShown(false);
    await sendMessage(text);
  };

  const handleVoice = (_text: string, _intent: VoiceIntent) => {
    setInput(_text);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#0F0F0F' }}>
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Left panel — context */}
        <aside
          className="hidden lg:flex flex-col w-72 shrink-0 border-r border-white/8 p-5 overflow-y-auto"
          style={{ background: 'rgba(15,15,15,0.9)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', boxShadow: '0 8px 24px rgba(139,92,246,0.4)' }}
            >
              <Sparkles size={22} className="text-white" />
            </div>
            <div>
              <h2
                className="text-white font-bold text-sm"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Exploraa Guide
              </h2>
              <p className="text-white/35 text-xs">Assistant voyage IA</p>
            </div>
          </div>

          {/* Capabilities */}
          <div className="space-y-3 mb-8">
            <h3 className="text-white/40 text-xs uppercase tracking-wider font-medium">Ce que je peux faire</h3>
            {[
              { emoji: '🗺️', label: 'Recommander des lieux' },
              { emoji: '🍽️', label: 'Trouver les meilleurs restos' },
              { emoji: '🏨', label: 'Comparer des hôtels' },
              { emoji: '📅', label: 'Planifier vos voyages' },
              { emoji: '💡', label: 'Conseils et astuces voyage' },
              { emoji: '🌍', label: '195+ pays disponibles' },
            ].map(item => (
              <div
                key={item.label}
                className="flex items-center gap-2.5 text-sm text-white/60 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                <span className="text-base">{item.emoji}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <button
              onClick={clearHistory}
              className="w-full flex items-center gap-2 text-white/35 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
            >
              <Trash2 size={14} />
              Effacer la conversation
            </button>
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Mobile header */}
          <div
            className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/8 shrink-0"
            style={{ background: 'rgba(15,15,15,0.95)' }}
          >
            <button
              onClick={() => navigate(-1)}
              className="text-white/50 hover:text-white p-1.5 rounded-xl hover:bg-white/8 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
            >
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="font-semibold text-white text-sm"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Exploraa Guide
                </span>
                <Badge
                  className="text-xs px-1.5 py-0 border"
                  style={{
                    background: 'rgba(139,92,246,0.15)',
                    color: '#A78BFA',
                    borderColor: 'rgba(139,92,246,0.3)',
                  }}
                >
                  IA
                </Badge>
              </div>
            </div>
            <button
              onClick={clearHistory}
              className="text-white/35 hover:text-white p-1.5 rounded-xl hover:bg-white/8 transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 min-h-0 scrollbar-violet">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.role === 'assistant' && (
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-1 border"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.15))',
                      borderColor: 'rgba(139,92,246,0.25)',
                    }}
                  >
                    <Sparkles size={16} className="text-violet-400" />
                  </div>
                )}

                <div className={cn('max-w-[75%] md:max-w-[65%] flex flex-col gap-2', msg.role === 'user' ? 'items-end' : 'items-start')}>
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-3 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'text-white rounded-tr-sm'
                        : 'text-white/90 rounded-tl-sm border border-white/8'
                    )}
                    style={
                      msg.role === 'user'
                        ? { background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }
                        : { background: 'rgba(22,33,62,0.85)' }
                    }
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            strong: ({ children }) => (
                              <strong className="text-violet-300 font-semibold">{children}</strong>
                            ),
                            ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
                            li: ({ children }) => <li className="text-white/80">{children}</li>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>

                  {/* Suggested places chips */}
                  {msg.suggested_places && msg.suggested_places.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {msg.suggested_places.map(p => {
                        const config = getCategoryConfig(p.category);
                        return (
                          <button
                            key={p.id}
                            onClick={() => navigate(`/place/${p.id}`)}
                            className="flex items-center gap-1.5 border rounded-full px-3 py-1.5 text-xs text-white/80 transition-all hover:border-violet-500/40 hover:bg-violet-500/8"
                            style={{ background: 'rgba(26,26,46,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}
                          >
                            <span>{config.emoji}</span>
                            <span className="font-medium">{p.name}</span>
                            <span className="text-white/40">— {p.city}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <span className="text-white/25 text-xs">{timeAgo(msg.timestamp)}</span>
                </div>

                {msg.role === 'user' && (
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-1"
                    style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.3))', border: '1px solid rgba(139,92,246,0.3)' }}
                  >
                    <span className="text-violet-300 text-xs font-bold">Moi</span>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Quick suggestions */}
            {suggestionsShown && messages.length <= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="py-4"
              >
                <p className="text-white/35 text-sm text-center mb-4">Quelques idées pour commencer :</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl mx-auto">
                  {QUICK_SUGGESTIONS.map(s => (
                    <button
                      key={s.text}
                      onClick={() => handleSuggestion(s.text)}
                      className="flex items-center gap-3 border rounded-2xl px-4 py-3 text-sm text-white/65 hover:text-white transition-all text-left hover:border-violet-500/40 hover:bg-violet-500/6"
                      style={{ background: 'rgba(26,26,46,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}
                    >
                      <span className="text-xl shrink-0">{s.emoji}</span>
                      <span>{s.text}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Typing indicator */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3 items-center"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center border"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.15))',
                      borderColor: 'rgba(139,92,246,0.25)',
                    }}
                  >
                    <Sparkles size={16} className="text-violet-400" />
                  </div>
                  <div
                    className="border rounded-2xl rounded-tl-sm px-5 py-4 flex gap-1.5 items-center"
                    style={{ background: 'rgba(22,33,62,0.85)', borderColor: 'rgba(255,255,255,0.08)' }}
                  >
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ background: '#8B5CF6' }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div
            className="shrink-0 px-4 md:px-8 py-4 border-t border-white/8"
            style={{ background: '#0F0F0F' }}
          >
            <div
              className="max-w-3xl mx-auto flex items-center gap-3 border rounded-2xl px-4 input-gradient"
              style={{ background: 'rgba(26,26,46,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={isLoading ? 'Exploraa Guide réfléchit...' : 'Demandez-moi n\'importe quoi sur les voyages...'}
                disabled={isLoading}
                className="flex-1 bg-transparent py-4 text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
              <VoiceMicButton onTranscript={handleVoice} size="sm" />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="text-white rounded-xl h-9 w-9 shrink-0 disabled:opacity-30"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
              >
                <Send size={15} />
              </Button>
            </div>
            <p className="text-center text-white/20 text-xs mt-2">
              Propulsé par Claude ·{' '}
              <span className="text-white/35">1M+ lieux référencés</span>
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
