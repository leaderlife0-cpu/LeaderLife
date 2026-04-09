import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Compass, ArrowLeft, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VoiceMicButton } from '@/components/search/VoiceMicButton';
import { Navbar } from '@/components/layout/Navbar';
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
    <div className="flex flex-col h-screen bg-[#0A0A0F] overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Left panel – context */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-[#12121A] border-r border-white/10 p-5 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-orange-500/30 flex items-center justify-center">
              <Sparkles size={22} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">LeaderLife Guide</h2>
              <p className="text-white/40 text-xs">Assistant voyage IA</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h3 className="text-white/60 text-xs uppercase tracking-wider">Ce que je peux faire</h3>
            {[
              { emoji: '🗺️', label: 'Recommander des lieux' },
              { emoji: '🍽️', label: 'Trouver les meilleurs restos' },
              { emoji: '🏨', label: 'Comparer des hôtels' },
              { emoji: '📅', label: 'Planifier vos voyages' },
              { emoji: '💡', label: 'Conseils et astuces voyage' },
              { emoji: '🌍', label: '195+ pays disponibles' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2.5 text-sm text-white/70">
                <span className="text-base">{item.emoji}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <Button
              onClick={clearHistory}
              variant="ghost"
              className="w-full text-white/40 hover:text-white hover:bg-white/5 text-sm justify-start"
            >
              <Trash2 size={14} className="mr-2" />
              Effacer la conversation
            </Button>
          </div>
        </aside>

        {/* Chat */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Chat header (mobile) */}
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#12121A] shrink-0">
            <button onClick={() => navigate(-1)} className="text-white/60 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Compass size={16} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-white text-sm">LeaderLife Guide</span>
              <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-1.5 py-0">IA</Badge>
            </div>
            <button onClick={clearHistory} className="text-white/40 hover:text-white">
              <Trash2 size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 min-h-0">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.role === 'assistant' && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-600/30 flex items-center justify-center shrink-0 mt-1 border border-blue-500/20">
                    <Compass size={16} className="text-blue-400" />
                  </div>
                )}

                <div className={cn('max-w-[75%] md:max-w-[65%] flex flex-col gap-2', msg.role === 'user' ? 'items-end' : 'items-start')}>
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-3 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white rounded-tr-sm'
                        : 'bg-[#1E293B] text-white/90 rounded-tl-sm border border-white/5'
                    )}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            strong: ({ children }) => (
                              <strong className="text-blue-300 font-semibold">{children}</strong>
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
                            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 rounded-full px-3 py-1.5 text-xs text-white/80 transition-all"
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
                  <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1 border border-blue-500/20">
                    <span className="text-blue-400 text-xs font-bold">Moi</span>
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
                <p className="text-white/40 text-sm text-center mb-4">Quelques idées pour commencer :</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl mx-auto">
                  {QUICK_SUGGESTIONS.map(s => (
                    <button
                      key={s.text}
                      onClick={() => handleSuggestion(s.text)}
                      className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 rounded-xl px-4 py-3 text-sm text-white/70 hover:text-white transition-all text-left"
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
                  <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/20">
                    <Compass size={16} className="text-blue-400" />
                  </div>
                  <div className="bg-[#1E293B] border border-white/5 rounded-2xl rounded-tl-sm px-5 py-4 flex gap-1.5 items-center">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-blue-400 rounded-full"
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
          <div className="shrink-0 px-4 md:px-8 py-4 border-t border-white/10 bg-[#0A0A0F]">
            <div className="max-w-3xl mx-auto flex items-center gap-3 bg-white/5 border border-white/15 hover:border-white/25 focus-within:border-blue-500/50 rounded-2xl px-4 transition-all">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={isLoading ? 'LeaderLife Guide réfléchit...' : 'Demandez-moi n\'importe quoi sur les voyages...'}
                disabled={isLoading}
                className="flex-1 bg-transparent py-4 text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
              <VoiceMicButton onTranscript={handleVoice} size="sm" />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-30 text-white rounded-xl h-9 w-9 shrink-0"
              >
                <Send size={16} />
              </Button>
            </div>
            <p className="text-center text-white/20 text-xs mt-2">
              Propulsé par Claude · Recommandations basées sur {' '}
              <span className="text-white/40">1M+ lieux</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
